from flask import Flask, render_template, jsonify, request
from flask_cors import CORS # type: ignore
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from functions import config
from Objects.users import Users
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import logging
import os
import time
import actions.constans as constants

# -------------- Load Routes Fuctions -------------
from Routes_Api.login import login
from Routes_Api.signup import signup
from Routes_Api.logout import logout
from Routes_Api.auth import authCheck as auth
# -------------------------------------------------

app = Flask(__name__)
CORS(app, supports_credentials=True)

# Configure settings for the database and login manager
users_db, login_manager = config(app)

# Create the database
with app.app_context():
    users_db.create_all()

# ------------------------- Routes -----------------------------
app.add_url_rule('/api/signup', 'signup', signup, methods=['POST'])
app.add_url_rule('/api/signupA', 'signupAdmin', signup, methods=['POST'])
app.add_url_rule('/api/login', 'login', login, methods=['GET', 'POST'])
app.add_url_rule('/api/logout', 'logout', logout, methods=['GET'])
app.add_url_rule('/api/authCheck', 'authCheck', auth, methods=['GET'])
# --------------------------------------------------------------

if __name__ == '__main__':
    # to run the server with ssl need to add the ssl_context=('cert.pem', 'key.pem') which are the certificates:
    # cert.pem is the certificate file -
    # key.pem is the key file - 
    # for test only we will use ssl_context='adhoc'

    if constants.PROTOCOL != 'https://':
        app.run(debug=constants.DEBUG, port=int(constants.PORT))
    else:
        app.run(debug=constants.DEBUG, port=int(constants.PORT), ssl_context=constants.SSL) 