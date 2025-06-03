from flask import Flask, render_template, request, redirect, url_for, flash
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

# Initialize app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///news.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'admin_login'

# Create initial admin user if it doesn't exist
@app.before_first_request
def create_tables():
    db.create_all()
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        admin = User(
            username='admin',
            email='admin@example.com',
            password_hash=generate_password_hash('admin123'),
            is_admin=True
        )
        db.session.add(admin)
        db.session.commit()

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    articles = db.relationship('Article', backref='author', lazy=True)

class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(200))

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Routes
@app.route('/')
def index():
    try:
        articles = Article.query.order_by(Article.created_at.desc()).limit(10).all()
        return render_template('index.html', articles=articles)
    except Exception as e:
        flash('Error loading articles: ' + str(e))
        return render_template('index.html', articles=[])

@app.route('/article/<int:id>')
def article(id):
    try:
        article = Article.query.get_or_404(id)
        return render_template('article.html', article=article)
    except Exception as e:
        flash('Error loading article: ' + str(e))
        return redirect(url_for('index'))

@app.route('/category/<string:category>')
def category(category):
    try:
        articles = Article.query.filter_by(category=category).order_by(Article.created_at.desc()).all()
        return render_template('category.html', articles=articles, category=category)
    except Exception as e:
        flash('Error loading category: ' + str(e))
        return redirect(url_for('index'))

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for('admin_dashboard'))
    
    if request.method == 'POST':
        try:
            user = User.query.filter_by(username=request.form['username']).first()
            if user and check_password_hash(user.password_hash, request.form['password']) and user.is_admin:
                login_user(user)
                return redirect(url_for('admin_dashboard'))
            flash('Invalid username or password')
        except Exception as e:
            flash('Error during login: ' + str(e))
    return render_template('admin/login.html')

@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    if not current_user.is_admin:
        return redirect(url_for('index'))
    try:
        articles = Article.query.order_by(Article.created_at.desc()).all()
        return render_template('admin/dashboard.html', articles=articles)
    except Exception as e:
        flash('Error loading dashboard: ' + str(e))
        return redirect(url_for('admin_login'))

@app.route('/admin/add_article', methods=['GET', 'POST'])
@login_required
def add_article():
    if not current_user.is_admin:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        try:
            article = Article(
                title=request.form['title'],
                content=request.form['content'],
                category=request.form['category'],
                author=current_user,
                image_url=request.form.get('image_url')
            )
            db.session.add(article)
            db.session.commit()
            flash('Article added successfully!')
            return redirect(url_for('admin_dashboard'))
        except Exception as e:
            flash('Error adding article: ' + str(e))
            db.session.rollback()
    return render_template('admin/add_article.html')

@app.route('/admin/edit_article/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_article(id):
    if not current_user.is_admin:
        return redirect(url_for('index'))
    
    try:
        article = Article.query.get_or_404(id)
        if request.method == 'POST':
            article.title = request.form['title']
            article.content = request.form['content']
            article.category = request.form['category']
            article.image_url = request.form.get('image_url')
            db.session.commit()
            flash('Article updated successfully!')
            return redirect(url_for('admin_dashboard'))
        return render_template('admin/edit_article.html', article=article)
    except Exception as e:
        flash('Error editing article: ' + str(e))
        return redirect(url_for('admin_dashboard'))

@app.route('/admin/delete_article/<int:id>')
@login_required
def delete_article(id):
    if not current_user.is_admin:
        return redirect(url_for('index'))
    
    try:
        article = Article.query.get_or_404(id)
        db.session.delete(article)
        db.session.commit()
        flash('Article deleted successfully!')
    except Exception as e:
        flash('Error deleting article: ' + str(e))
        db.session.rollback()
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/logout')
@login_required
def admin_logout():
    logout_user()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True, port=5000)
