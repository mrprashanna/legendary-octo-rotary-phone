# SecureKey News Portal

A modern Flask-based news website with admin capabilities and secure admin access.

## Features

- Responsive news portal with categories and article display
- Secure admin area with hidden access URL
- Image upload capabilities for articles
- Advertisement management system
- User authentication and authorization
- Modern, responsive frontend using Bootstrap 5
- Admin panel for managing news articles
- User authentication and authorization
- Article categorization
- CRUD operations for articles
- SQLite database integration

## GitHub Deployment Instructions

### 1. Upload Files to GitHub

1. Create a new repository on GitHub
2. Click 'Add file' > 'Upload files'
3. Drag and drop all project files or use the file selector
   - You may need to upload in batches if you have many files
   - Start with core files, then templates, then static files
4. Add a commit message for each batch like 'Add project files'
5. Click 'Commit changes'

### 2. Set Repository Secrets (Required)

1. Go to your repository settings
2. Click on 'Secrets and variables' > 'Actions'
3. Add these repository secrets:
   - `SECRET_KEY`: Add a random string like 'your-random-secret-key-here'
   - `SECRET_ADMIN_URL`: Set your admin access URL (e.g., 'admin_secret_portal')
   - `DATABASE_URL`: (Optional) If using an external database

### 3. Enable GitHub Pages

1. Go to repository settings
2. Click on 'Pages'
3. Under 'Build and deployment', select:
   - Source: GitHub Actions

## Admin Access

After deployment, access the admin panel at:
```
https://yourusername.github.io/your-repo-name/your-secret-admin-url
```

Default admin credentials (change immediately after first login):
- Username: admin
- Password: admin

**IMPORTANT:** Replace 'your-secret-admin-url' with whatever you set as your SECRET_ADMIN_URL in GitHub secrets.

## Project Structure

- `app.py`: Main Flask application
- `templates/`: HTML templates
- `static/`: Static files (CSS, JS, images)
- `requirements.txt`: Python dependencies

## Technologies Used

- Backend: Flask, SQLAlchemy
- Frontend: HTML5, CSS3, Bootstrap 5
- Database: SQLite
- Authentication: Flask-Login
