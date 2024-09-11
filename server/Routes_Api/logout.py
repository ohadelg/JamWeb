from flask import jsonify
from flask_login import logout_user, login_required, current_user
from actions import constans

# create a route for logout
@login_required
def logout():
    """
    Logout the current user.
    """
    if current_user.is_authenticated:
        print("Current user is authenticated")
        logout_user(current_user)
        if constans.DEBUG:
            print(f'User logged out successfully: {current_user.__getattr__(id)}') # just for debugging
        return jsonify({'message': 'User logged out'}), 200
    return jsonify({'message': 'User not logged in'}), 400