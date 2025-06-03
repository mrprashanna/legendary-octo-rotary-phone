from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime
import os
import uuid

# Create Flask application
app = Flask(__name__)

# Configure file uploads
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads', 'articles')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB limit for uploads

# Configuration
# Load environment variables from .env file if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Configuration with environment variable support for deployment
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY', os.urandom(24)),
    SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'sqlite:///news.db'),
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    TEMPLATES_AUTO_RELOAD=True,
    UPLOAD_FOLDER=UPLOAD_FOLDER,
    MAX_CONTENT_LENGTH=MAX_CONTENT_LENGTH
)

# Initialize extensions
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'secret_admin_login'

# Helper functions for file uploads
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_image(file):
    if file and allowed_file(file.filename):
        # Generate a unique filename to prevent overwriting
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4().hex}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # Ensure upload directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Save the file
        file.save(file_path)
        
        # Return the relative path to be stored in the database
        return os.path.join('uploads', 'articles', unique_filename)
    return None

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    articles = db.relationship('Article', backref='author', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(200))

class Advertisement(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(50), nullable=False)  # sidebar, header, footer, article
    image_url = db.Column(db.String(200), nullable=False)
    link_url = db.Column(db.String(200), nullable=False)
    active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Flask-Login user loader
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Create database tables and initial admin user
@app.before_first_request
def create_tables():
    db.create_all()
    
    # Create admin user if it doesn't exist
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(
            username='admin',
            email='admin@example.com',
            is_admin=True
        )
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print('Admin user created successfully')
        
    # Create sample advertisements if none exist
    if Advertisement.query.count() == 0:
        sample_ads = [
            Advertisement(
                title='Sidebar Promotion',
                position='sidebar',
                image_url='https://picsum.photos/300/250',
                link_url='https://example.com/promo1',
                active=True
            ),
            Advertisement(
                title='Header Banner',
                position='header',
                image_url='https://picsum.photos/728/90',
                link_url='https://example.com/banner',
                active=True
            ),
            Advertisement(
                title='Article Promo',
                position='article',
                image_url='https://picsum.photos/600/300',
                link_url='https://example.com/special',
                active=True
            )
        ]
        for ad in sample_ads:
            db.session.add(ad)
        db.session.commit()
        print('Sample advertisements created successfully')

# Public routes
@app.route('/')
def index():
    try:
        articles = Article.query.order_by(Article.created_at.desc()).limit(10).all()
        # Get advertisements for different positions
        header_ads = Advertisement.query.filter_by(position='header', active=True).all()
        sidebar_ads = Advertisement.query.filter_by(position='sidebar', active=True).all()
        return render_template('index.html', articles=articles, header_ads=header_ads, sidebar_ads=sidebar_ads)
    except Exception as e:
        flash(f'Error loading articles: {str(e)}')
        return render_template('index.html', articles=[])

@app.route('/article/<int:id>')
def article(id):
    try:
        article = Article.query.get_or_404(id)
        # Get advertisements for different positions
        sidebar_ads = Advertisement.query.filter_by(position='sidebar', active=True).all()
        article_ads = Advertisement.query.filter_by(position='article', active=True).all()
        return render_template('article.html', article=article, sidebar_ads=sidebar_ads, article_ads=article_ads)
    except Exception as e:
        flash(f'Error loading article: {str(e)}')
        return redirect(url_for('index'))

@app.route('/category/<string:category>')
def category(category):
    try:
        articles = Article.query.filter_by(category=category).order_by(Article.created_at.desc()).all()
        # Get advertisements for different positions
        header_ads = Advertisement.query.filter_by(position='header', active=True).all()
        sidebar_ads = Advertisement.query.filter_by(position='sidebar', active=True).all()
        return render_template('category.html', category=category, articles=articles, header_ads=header_ads, sidebar_ads=sidebar_ads)
    except Exception as e:
        flash(f'Error loading category: {str(e)}')
        return redirect(url_for('index'))

# Admin authentication routes
# Public admin login route now redirects to home for security
@app.route('/admin/login')
def admin_login():
    # Redirect to homepage for security - hide the admin login from regular users
    return redirect(url_for('index'))

# Import os module for environment variables if not already imported
import os

# Secret admin login route using environment variable
# Default to 'secret_admin' if not set, but you should set this in production
SECRET_ADMIN_URL = os.environ.get('SECRET_ADMIN_URL', 'secret_admin')

@app.route(f'/{SECRET_ADMIN_URL}', methods=['GET', 'POST'])
def secret_admin_login():
    if current_user.is_authenticated and current_user.is_admin:
        return redirect(url_for('admin_dashboard'))
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        if not username or not password:
            flash('Please provide both username and password')
            return render_template('admin/login.html')
            
        try:
            user = User.query.filter_by(username=username).first()
            
            if user and user.check_password(password) and user.is_admin:
                login_user(user)
                next_page = request.args.get('next')
                return redirect(next_page or url_for('admin_dashboard'))
                
            flash('Invalid username or password')
        except Exception as e:
            flash(f'Login error: {str(e)}')
            
    return render_template('admin/login.html')

@app.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for('index'))

# Admin dashboard routes
@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if not current_user.is_admin:
        flash('Access denied')
        return redirect(url_for('index'))
        
    try:
        articles = Article.query.order_by(Article.created_at.desc()).all()
        return render_template('admin/dashboard.html', articles=articles)
    except Exception as e:
        flash(f'Error loading dashboard: {str(e)}')
        return render_template('admin/dashboard.html', articles=[])

@app.route('/admin/add_article', methods=['GET', 'POST'])
@login_required
def add_article():
    if not current_user.is_admin:
        flash('Access denied')
        return redirect(url_for('index'))
        
    if request.method == 'POST':
        title = request.form.get('title')
        content = request.form.get('content')
        category = request.form.get('category')
        image_url = request.form.get('image_url')
        image_file = request.files.get('image_file')
        
        if not title or not content or not category:
            flash('Please fill in all required fields')
            return render_template('admin/add_article.html')
        
        # Process image (either from file upload or URL)
        final_image_url = None
        if image_file and image_file.filename:
            # User uploaded a file
            saved_path = save_uploaded_image(image_file)
            if saved_path:
                final_image_url = url_for('static', filename=saved_path)
            else:
                flash('Invalid image file. Please use JPG, PNG or GIF format.')
        elif image_url:
            # User provided a URL
            final_image_url = image_url
            
        try:
            article = Article(
                title=title,
                content=content,
                category=category,
                image_url=final_image_url,
                author_id=current_user.id
            )
            db.session.add(article)
            db.session.commit()
            flash('Article added successfully')
            return redirect(url_for('admin_dashboard'))
        except Exception as e:
            flash(f'Error adding article: {str(e)}')
            
    return render_template('admin/add_article.html')

@app.route('/admin/edit_article/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_article(id):
    if not current_user.is_admin:
        flash('Access denied')
        return redirect(url_for('index'))
    
    try:
        article = Article.query.get_or_404(id)
        
        if request.method == 'POST':
            title = request.form.get('title')
            content = request.form.get('content')
            category = request.form.get('category')
            image_url = request.form.get('image_url')
            image_file = request.files.get('image_file')
            
            if not title or not content or not category:
                flash('Please fill all required fields')
                return render_template('admin/edit_article.html', article=article)
            
            # Process image (either from file upload or URL)
            if image_file and image_file.filename:
                # User uploaded a file
                saved_path = save_uploaded_image(image_file)
                if saved_path:
                    article.image_url = url_for('static', filename=saved_path)
                else:
                    flash('Invalid image file. Please use JPG, PNG or GIF format.')
            elif image_url:
                # User provided a URL
                article.image_url = image_url
            
            article.title = title
            article.content = content
            article.category = category
            
            db.session.commit()
            flash('Article updated successfully!')
            return redirect(url_for('admin_dashboard'))
            
        return render_template('admin/edit_article.html', article=article)
    except Exception as e:
        flash(f'Error editing article: {str(e)}')
        return redirect(url_for('admin_dashboard'))

@app.route('/admin/delete_article/<int:id>')
@login_required
def delete_article(id):
    if not current_user.is_admin:
        flash('Access denied')
        return redirect(url_for('index'))
    
    try:
        article = Article.query.get_or_404(id)
        db.session.delete(article)
        db.session.commit()
        flash('Article deleted successfully!')
    except Exception as e:
        flash(f'Error deleting article: {str(e)}')
        db.session.rollback()
        
    return redirect(url_for('admin_dashboard'))

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('errors/404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('errors/500.html'), 500

# Admin Password Change
@app.route('/admin/change-password', methods=['GET', 'POST'])
@login_required
def change_password():
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        current_password = request.form.get('current_password')
        new_password = request.form.get('new_password')
        confirm_password = request.form.get('confirm_password')
        
        # Validate inputs
        if not current_user.check_password(current_password):
            flash('Current password is incorrect', 'danger')
            return redirect(url_for('change_password'))
        
        if new_password != confirm_password:
            flash('New passwords do not match', 'danger')
            return redirect(url_for('change_password'))
        
        if len(new_password) < 8:
            flash('Password must be at least 8 characters long', 'danger')
            return redirect(url_for('change_password'))
        
        # Update password
        current_user.set_password(new_password)
        db.session.commit()
        flash('Password updated successfully', 'success')
        return redirect(url_for('admin_dashboard'))
    
    return render_template('admin/change_password.html')

# Ad Management Routes
@app.route('/admin/ads')
@login_required
def manage_ads():
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    ads = Advertisement.query.all()
    return render_template('admin/manage_ads.html', ads=ads)

@app.route('/admin/ads/add', methods=['POST'])
@login_required
def add_ad():
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    title = request.form.get('title')
    position = request.form.get('position')
    image_url = request.form.get('image_url')
    link_url = request.form.get('link_url')
    active = 'active' in request.form
    
    ad = Advertisement(title=title, position=position, image_url=image_url, 
                       link_url=link_url, active=active)
    
    db.session.add(ad)
    db.session.commit()
    flash('Advertisement added successfully', 'success')
    return redirect(url_for('manage_ads'))

@app.route('/admin/ads/edit/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_ad(id):
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    ad = Advertisement.query.get_or_404(id)
    
    if request.method == 'POST':
        ad.title = request.form.get('title')
        ad.position = request.form.get('position')
        ad.image_url = request.form.get('image_url')
        ad.link_url = request.form.get('link_url')
        ad.active = 'active' in request.form
        
        db.session.commit()
        flash('Advertisement updated successfully', 'success')
        return redirect(url_for('manage_ads'))
    
    return render_template('admin/edit_ad.html', ad=ad)

@app.route('/admin/ads/toggle/<int:id>')
@login_required
def toggle_ad(id):
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    ad = Advertisement.query.get_or_404(id)
    ad.active = not ad.active
    db.session.commit()
    
    flash(f'Advertisement {"activated" if ad.active else "deactivated"} successfully', 'success')
    return redirect(url_for('manage_ads'))

@app.route('/admin/ads/delete/<int:id>')
@login_required
def delete_ad(id):
    if not current_user.is_admin:
        flash('Access denied', 'danger')
        return redirect(url_for('index'))
    
    ad = Advertisement.query.get_or_404(id)
    db.session.delete(ad)
    db.session.commit()
    
    flash('Advertisement deleted successfully', 'success')
    return redirect(url_for('manage_ads'))

# Run the application
if __name__ == '__main__':
    app.run(debug=True, port=5000)
