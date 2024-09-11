from flask import Flask, render_template, jsonify, request
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash

def valid_data_middleware():
    def decorator(func):
        def wrapper(*args, **kwargs):
            try:
                data = request.get_json()
            except:
                print(f"Invalid JSON: {request}")
                return jsonify({'error': 'Invalid JSON'}), 413
            if not data:
                return jsonify({'error': 'No data provided'}), 412
            # Add the validated data to the request object to be used in the route
            request.validated_data = data
            return func(*args, **kwargs)
        return wrapper
    return decorator

def valid_data_login_middleware():
    def decorator(func):
        def wrapper(*args, **kwargs):
            data = request.validated_data
            if not data.get('email') or not data.get('password'):
                return jsonify({'error': 'Email and password are required'}), 411
            return func(*args, **kwargs)
        return wrapper
    return decorator

def valid_data_signup_middleware():
    def decorator(func):
        def wrapper(*args, **kwargs):
            data = request.validated_data
            if not data.get('firstName') or not data.get('lastName') or not data.get('email') or not data.get('password'):
                return jsonify({'error': 'All fields are required'}), 410
            return func(*args, **kwargs)
        return wrapper
    return decorator

def check_user_middleware():
    def decorator(func):
        def wrapper(*args, **kwargs):
            # Set the user and data
            user = current_user
            data = request.validated_data

            # Check if the user exists and if the password is correct
            # if not user and not check_password_hash(user.password, data['password']):
            if not user:
                return jsonify({'error': 'Unauthorized - Invalid Email or password'}), 401
            return func(*args, **kwargs)    
        return wrapper
    return decorator

def content_type_middleware(Content_Type: str):
    def decorator(func):
        def wrapper(*args, **kwargs):
            print(f"request before: {request}")
            if request.headers.get('Content-Type') != Content_Type:
                return jsonify({'error': 'Bad request. Content-Type must be ' + Content_Type}), 414
            return func(*args, **kwargs)
        return wrapper
    return decorator

# def auth_middleware(next, app):
#     def inner_function(*args, **kwargs):
#          # Check for authentication headers or tokens
#         if not is_authenticated(request):
#             return jsonify({'error': 'Unauthorized'}), 401
#     return inner_function