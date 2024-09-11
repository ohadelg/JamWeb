import random
import string
from flask import Flask, render_template, jsonify, request
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
import os

# Set global variable for users sql
global users_db
global login_manager
users_db = SQLAlchemy()

# Configure settings for the database and login manager
def config(app):
    # Set global variable for users sql
    global users_db
    global login_manager

    # Configure app settinfs
    app.config['SECRET_KEY'] = os.urandom(30)
    app.config['CORS_HEADERS'] = 'Content-Type'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
    
    # Create SQLAlchemy object
    users_db.init_app(app)
    # need to setup recovery of the database and backup - later

    # Creta login manager object
    login_manager = LoginManager()
    login_manager.session_protection = "strong"
    login_manager.init_app(app)
    login_manager.login_view = 'login'
    return users_db, login_manager
