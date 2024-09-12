from flask import jsonify, request, current_app as app
from flask_login import login_user, login_required, current_user
from Objects.users import Users
from werkzeug.security import check_password_hash
from middleware.middlewares import content_type_middleware, valid_data_middleware, check_user_middleware, valid_data_login_middleware
from functions import users_db, setSocketHandlers, socketConnections
import actions.constans as constants
from flask_socketio import SocketIO
import logging
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required


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
        login_user(user)
        # if not login_user(user):
        #     print('Error logging in - in login_user')
        #     logging.error(f'Error logging in - in login_user user: {user}')
        #     return jsonify({'error': 'Error logging in'}), 415
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({'error': 'Error logging in'}), 416
    
    # if user authenticated, create a token
    if user.is_authenticated:
        if constants.DEBUG:
            print(f"User authenticated: True")
        # token = create_access_token(identity=user.id) // JWT - did problem with the token
        token = user.id
    else:
        if constants.DEBUG:
            print(f"User authenticated: False")
        token = user.id

    if constants.DEBUG:
        print(f'User logged in successfully: {user.id}') # just for debugging
        print(f"the current user is: {current_user.id}")
    
    return jsonify({'message': 'Connected', 'token': token, 'name': current_user.firstName, 'level': current_user.level }), 200

    