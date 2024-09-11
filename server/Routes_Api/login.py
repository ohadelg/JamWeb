from flask import jsonify, request
from flask_login import login_user, login_required
from Objects.users import Users
from werkzeug.security import check_password_hash
from middleware.middlewares import content_type_middleware, valid_data_middleware, check_user_middleware, valid_data_login_middleware
from functions import users_db
import actions.constans as constants
import logging


# create a route for login
@content_type_middleware(Content_Type='application/json')
@valid_data_middleware()
@valid_data_login_middleware()
def login():
    """
    Login a user.

    Args:
        email: str
        password: str

    Returns:
        message: str
    """
    data = request.validated_data
    user = Users.query.filter_by(email=data['email']).first()
    
    if constants.PROTOCOL == 'https://':
        if not user or not check_password_hash(user.password, data['password']):
            print('Unauthorized - Invalid Email or password')
            return jsonify({'error': 'Unauthorized - Invalid Email or password'}), 401
    else:
        if not user or not user.password == data['password']:
            print('Unauthorized - Invalid Email or password')
            return jsonify({'error': 'Unauthorized - Invalid Email or password'}), 401
    
    try:
        if not login_user(user):
            print('Error logging in - in login_user')
            logging.error(f'Error logging in - in login_user user: {user}')
            return jsonify({'error': 'Error logging in'}), 415
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({'error': 'Error logging in'}), 416

    if constants.DEBUG:
        print(f'User logged in successfully: {user.id}') # just for debugging
    return jsonify({'message': 'Connected'}), 200

# Load user from database - return user object
# @login_manager.user_loader()
def load_user(user_id):
    return Users.query.get(int(user_id))