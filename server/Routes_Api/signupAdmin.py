from flask import jsonify, request
from Objects.users import Users
from flask_login import current_user
from functions import users_db
import logging
from middleware.middlewares import content_type_middleware, valid_data_middleware, valid_data_signup_middleware

# create a route for signup
@content_type_middleware(Content_Type='application/json')
@valid_data_middleware()
@valid_data_signup_middleware()
def signupAdmin():
    """
    Register a new Admin user.

    args:
        firstName: str
        lastName: str
        email: str
        password: str
        instrument: str
        Admin: bool = True
    
    returns:
        message: str
    """
    data = request.validated_data
    new_user = Users(firstName=data['firstName'],
                    lastName=data['lastName'],
                    email=data['email'],
                    password=data['password'],
                    instrument=data['instrument'],
                    level = data['level'])
    
    try:
        users_db.session.add(new_user)
        users_db.session.commit()
    except Exception as e:
        logging.error(f"Error: {e}")
        return jsonify({'error': 'Error adding user to database'}), 400

    return jsonify({'message': 'User registered successfully!'}), 201