from middleware.middlewares import content_type_middleware
from Objects.users import Users
from flask import jsonify, request
from flask_login import current_user


@content_type_middleware(Content_Type='application/json')
def authCheck():
    """
    Check if the user is authenticated. and send the message to the client.

    Args:
        request: Request

    Returns:
        message: str, code
    """
    if current_user.is_authenticated:
        return jsonify({'message': 'Connected'}), 200
    else:
        return jsonify({'message': 'Not connected'}), 401