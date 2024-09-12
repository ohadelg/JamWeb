from flask import Flask, render_template, jsonify, request
from flask_cors import CORS # type: ignore
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from functions import config, setSocketHandlers
from Objects.users import Users
from cryptography import x509
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization
import logging
import os
import time
import datetime
import actions.constans as constants
from flask_socketio import SocketIO, join_room, leave_room, emit
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, verify_jwt_in_request

# --------------------- Load Routes Fuctions ---------------------
from Routes_Api.login import login
from Routes_Api.signup import signup
from Routes_Api.logout import logout
from Routes_Api.auth import authCheck
# ----------------------------------------------------------------
global app
app = Flask(__name__)
CORS(app,  resources={r"/*": {"origins": "*", "allow_headers": ["Content-Type", "Authorization"]}})
app.config['JWT_SECRET_KEY'] = os.urandom(32).hex()
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
jwt = JWTManager(app)

# # Set global variable for users sql
socket = SocketIO(app, cors_allowed_origins="http://localhost:3000")
# setSocketHandlers(socket)

# Configure settings for the database and login manager
users_db, login_manager = config(app)

# Create the database
with app.app_context():
    users_db.create_all()

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))


# --------------------- Configure settings for the database and login manager ---------------------
# On Connect
@socket.on('connect')
# @jwt_required()
def handle_connect(data):
    try: 
        print(f"\nData: {data}\n")
        user_id = data.get('token')
        """# verify_jwt_in_request(optional=False, token=data.get('token'))
        # id_from_jwt = get_jwt_identity()
        # print(f"ID from token: {id_from_jwt}")"""
        with app.app_context():
            user = Users.query.filter_by(id=user_id).first()
        """ print(f"\nverify_jwt_in_request: {verify_jwt_in_request(optional=False, token=data.get('token'))}\n")
        # print(f"The current user id is: {get_jwt_identity()}\n")
        # print(f"\nAuth: {data} | Current User: {current_user}\n")"""
    except Exception as e:
        emit('error', {'message': f'data probelem: {e}'})
    if user.level == '1':
        if user.instrument == 'Singer':
            join_room('SingersRoom')
        else:
            join_room('MainRoom')
        print('Start Broadcast')
        emit('play', {}, broadcast=True, room='MainRoom')
        emit('play', {}, broadcast=True, room='SingersRoom')
    if constants.DEBUG:
        print('Client connected (socket handler)')
        print(f"user if: {user.id} | user name: {user.firstName} | user level: {user.level} | user instrument: {user.instrument}")
    room_name = 'MainRoom'
    try:
        # if current_user.is_authenticated:
        with app.app_context():
            id = user.id
            level = user.level
            name = user.firstName
            if user.instrument == 'Singer':
                room_name = 'SingersRoom'
        if constants.DEBUG:
            print(f'User {id} connected successfully')
            print(f"-- User ID: {id}, Level: {level}, Name: {name} --")
    except:
        if constants.DEBUG:
            print('Error in user data')
        logging.error('Error in user data')
        id = 'Undefined'
        level = 'Undefined'
        name = 'Undefined'
    
    join_room(room_name)

    # send the token to the client 
    emit('message', {'info': "success", 'token': id, 'level': level, "name": name})

    # for debug only
    if constants.DEBUG:
        print(f'User {id} connected successfully and joined room: {room_name}')

# On Disconnect
@socket.on('disconnect')
def disconnect():
    if constants.DEBUG:
        print('Client disconnected (socket handler)')

@socket.on('play')
def play(data):
    if constants.DEBUG:
        print('Handle Play, data: ' + data)
    try:
        token = data['token']
        level = data['level']
        song_name = data['song_name']

        # load the song from file
        song_file_name = f'{song_name}.json'
        with open(f'./songs/{song_file_name}', 'r') as file:
            song = file.read()
        
        if constants.DEBUG:
            print(f'Loaded song: {song}')
        # need to continue
    except:
        logging.error('Error in data format')
        return
    emit('play', data, broadcast=True)
    if constants.DEBUG:
        print(f'Play: {data} broadcasted')
# -------------------------------------------------------------------------------------------------



# ------------------------------ Routes ----------------------------------
app.add_url_rule('/api/signup', 'signup', signup, methods=['POST'])
app.add_url_rule('/api/signupA', 'signupAdmin', signup, methods=['POST'])
app.add_url_rule('/api/login', 'login', login, methods=['GET', 'POST'])
app.add_url_rule('/api/logout', 'logout', logout, methods=['GET'])
app.add_url_rule('/api/authCheck', 'authCheck', authCheck, methods=['GET'])
# ------------------------------------------------------------------------

if __name__ == '__main__':
    # to run the server with ssl need to add the ssl_context=('cert.pem', 'key.pem') which are the certificates:
    # cert.pem is the certificate file -
    # key.pem is the key file - 
    # for test only we will use ssl_context='adhoc'

    if constants.PROTOCOL != 'https://':
        socket.run(app, debug=constants.DEBUG, port=int(constants.PORT))
    else:
        socket.run(app, debug=constants.DEBUG, port=int(constants.PORT), ssl_context=constants.SSL) 