"""InfyNest AI - Flask Application Factory"""
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from backend.config import config

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri="memory://",  # Use in-memory storage (no Redis needed)
)


def create_app(config_name=None):
    """Create and configure the Flask application."""
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    limiter.init_app(app)

    # Register blueprints
    from backend.routes.auth import auth_bp
    from backend.routes.properties import properties_bp
    from backend.routes.locations import locations_bp
    from backend.routes.ai_predictions import ai_bp
    from backend.routes.admin import admin_bp
    from backend.routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(properties_bp, url_prefix='/api/properties')
    app.register_blueprint(locations_bp, url_prefix='/api/locations')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(users_bp, url_prefix='/api/users')

    # Create upload directory
    upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
    os.makedirs(upload_folder, exist_ok=True)

    # Import all models to ensure they are registered with SQLAlchemy
    import backend.models  # noqa: F401

    # Create all database tables
    with app.app_context():
        db.create_all()

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {'message': 'Token has expired', 'error': 'token_expired'}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {'message': 'Invalid token', 'error': 'invalid_token'}, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {'message': 'Authorization required', 'error': 'authorization_required'}, 401

    # Health check
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'app': 'InfyNest AI', 'version': '1.0.0'}

    return app
