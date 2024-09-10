from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from functions import config
import os

# -------------- Load Routers -------------
from Routes_Api.login import login
from Routes_Api.signup import signup
from Routes_Api.logout import logout
# -----------------------------------------


app = Flask(__name__)
CORS(app)

# Configure settings for the database and login manager
users_db, login_manager = config(app)

# User class - define user object
class User(UserMixin, users_db.Model):
    id = users_db.Column(users_db.Integer, primary_key=True, unique=True)
    firstName = users_db.Column(users_db.String(100))
    lastName = users_db.Column(users_db.String(100))
    email = users_db.Column(users_db.String(100), unique=True)
    password = users_db.Column(users_db.String(100))
    
    def __init__(self, firstName, lastName, email, password):
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.password = password

# Create the database
with app.app_context():
    users_db.create_all()

# Load user from database - return user object
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# ------------------ Routes ------------------
# signup route - register a new user
@app.route('/api/signup', methods=['POST']) # if post request is made to /api/register, then this function is called
def register():
    print(f"request: {request}")
    if request.headers['Content-Type'] != 'application/json':
        return jsonify({'error': 'Bad request. Content-Type must be application/json'}), 400
    
    errors = {}
    
    data = request.get_json() # get the json data from request

    if not data:
        errors['No Data'] = 'Bad request. No data found in request'
    
    required_fields = ['firstName', 'lastName', 'password', 'email']
    for field in required_fields:
        if field not in data:
            errors[field] = f'{field} is required'
    
    if errors:
        return jsonify({'errors': errors}) # 400 is status code for bad request

    # create a new user object
    new_user = User(firstName=data['firstName'], lastName=data['lastName'], email=data['email'], password=data['password'])
    
    # add user to the database
    users_db.session.add(new_user)
    users_db.session.commit()
    
    # return a response (There is another option of redirecting to another page)
    return jsonify({'message': 'User registered successfully!'}) # 201 is status code for created

@app.route('/login', methods=['POST']) # if post request is made to /api/login, then this function is called
def login():
    print(f"request: {request}")

    # The that this is a login request with json data
    if request.headers['Content-Type'] != 'login/json':
        return jsonify({'error': 'Bad request. Content-Type must be application/json'}), 400
    elif not request.get_json():
        return jsonify({'error': 'Bad request. No data found in request'}), 400
    
    # Setup the email and password received from the request
    email = request.get_json().get('email')
    password = request.get_json().get('password')

    # Check if email and password are provided - send client error if not
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    elif not password:
        return jsonify({'error': 'Password is required'}), 400
    
    # check if user exists in database
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not recognized'}), 404

    # check if password is correct
    elif user.password != password:
        return jsonify({'error': 'Incorrect Password'}), 401
    
    # login the user
    login_user(user)
       
    # return a response
    return jsonify({'message': 'Connected', 'token':'token'}), 200 # 200 is status code for OK

@app.route('/logout') # if request to logout is made, then this function is called
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully!'}), 200


if __name__ == '__main__':
    app.run(debug=True, port=8080) 