import random
import string
from flask import Flask, render_template, jsonify, request, current_app as app
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, join_room, leave_room, emit
from actions import constans as constants
import logging
import os
import json

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
    app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
    
    # Create SQLAlchemy object
    users_db.init_app(app)
    # need to setup recovery of the database and backup - later

    # Creta login manager object
    login_manager = LoginManager()
    login_manager.session_protection = "strong"
    login_manager.init_app(app)
    login_manager.login_view = 'login'
    return users_db, login_manager

def song_orgenizer(data, dir='ltr') -> str:
    """ return a song list"""
    songSingers = ''
    songInstruments = ''
    lyrics = ''
    chords = ''

    for verse in data:
        for line in verse:
            lyric = line['lyrics']
            lyrics += f'{lyric}  '
            chord = line.get('chords', '')
            if dir == 'rtl':
                chord = chord[::-1]
                chords += ' ' * round(max((1+ len(lyric) - len(chord))/2,0)) + f'{chord} ' +' ' *round(max((1+len(lyric) - len(chord))/2, 0))
            else:
                chords += ' ' * round(max((1+ len(lyric) - len(chord))/2,0)) + f'{chord} ' +' ' *round(max((1+len(lyric) - len(chord))/2, 0))
        if dir == 'rtl':
            chords = "  "+chords[::-1]
        songSingers += f'{lyrics}\n'
        songInstruments += f'{chords}\n{lyrics}\n'
        lyrics = ''
        chords = ''

    return songSingers, songInstruments

def getSongMessage(songName, group='all', dir='ltr'):
    """
    Get songName and return a string with only the lyrics
    
    args:
        songName: str

    returns:
        str: lyrics of the song
    """
    # print(f'song start | value: {songName} | group: {group} | dir: {dir}')

    songPath = os.path.join(os.getcwd(), 'songs', f'{songName}.json')
    
    with open(songPath, 'r', encoding='utf-8') as file:
        songContent = file.read()

        try:
            songJson = json.loads(songContent)
        except Exception as e:
            print(f'Error: {e}')
    
    songSinger, songInstrument = song_orgenizer(songJson, dir)
    # print(f'sondSingerList: \n{songSinger}\n songInstrumentList: \n{songInstrument}')
    
    if group == 'all':
        return songSinger, songInstrument
    elif group == 'singer':
        return songSinger
    elif group == 'instrument':
        return songInstrument
    else:
        raise ValueError('Invalid group')



