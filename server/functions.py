import random
import string
from flask import Flask, render_template, jsonify, request, current_app as app
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, join_room, leave_room, emit
from actions import constans as constants
import logging
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

def setSocketHandlers(socketio):
        """
        Set Socket handlers with decorators
        """
        # On Connect
        @socketio.on('connect')
        def handle_connect():
            if constants.DEBUG:
                print('Client connected (socket handler)')
            # when connected to the socket, join the main room
            # if current_user.instrument == 'Singer':
            #     room_name = 'singersRoom'
            # else:
            #     room_name = 'MainRoom'

            join_room("room_name")

            try:
                # if current_user.is_authenticated:
                id = current_user.id
                level = current_user.level
                name = current_user.name
                if constants.DEBUG:
                    print(f'User {current_user.id} connected successfully')
                    print(f"-- User ID: {id}, Level: {level}, Name: {name} --")
            except:
                if constants.DEBUG:
                    print('Error in user data')
                logging.error('Error in user data')
                id = 'Undefined'
                level = 'Undefined'
                name = 'Undefined'

            # send the token to the client 
            emit('message', {'info': "success", 'token': id, 'level': level, "name": name})

            # for debug only
            if constants.DEBUG:
                print(f'User {id} connected successfully and joined room: {"room_name"}')

        # On Disconnect
        @socketio.on('disconnect')
        def handle_disconnect():
            if constants.DEBUG:
                print('Client disconnected (socket handler)')

        @socketio.on('play')
        def handle_play(data):
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
            print(f'Play: {data} broadcasted')
        return

def socketConnections(app):
    """
    function to connect the socket

    args:
        app: Flask app
    
    returns:
        socket: SocketIO object
    """
    print('Connecting socket')
    socket = SocketIO(app, cors_allowed_origins="http://localhost:3000")
    setSocketHandlers(socket)
    socket.run(app, debug=constants.DEBUG, port=int(constants.PORT))

def read_file(file_name):
    """
    Read a file and return its content

    args:
        file_name: str
    
    returns:
        str: content of the file
    """
    with open(file_name, 'r') as file:
        content = file.read()
    return content




