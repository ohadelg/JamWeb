from typing import Any
from flask_login import UserMixin
from functions import users_db
import uuid

class Users(UserMixin, users_db.Model):
    # Model method make the db 
    id = users_db.Column(users_db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()), unique=True)
    firstName = users_db.Column(users_db.String(100))
    lastName = users_db.Column(users_db.String(100))
    email = users_db.Column(users_db.String(100), unique=True)
    password = users_db.Column(users_db.String(100))
    instrument = users_db.Column(users_db.String(100))
    level = users_db.Column(users_db.String(100))
    # Status = users_db.Column(users_db.String(100)) - Can implement this later
    
    def __init__(self, firstName, lastName, email, password, instrument, level=False):
        self.firstName = firstName
        self.lastName = lastName
        self.email = email
        self.password = password
        self.instrument = instrument
        self.level = level # True = Admin, False = User
        # self.Status = Status - Can implement this later
    
    # Get all attributes names
    def getAttributes(self):
        """
        getAttributes - Get all attributes names of the object.
        Args:
            None
        Returns:
            list: The list of attributes names.
        """
        atributes = ["firstName", "lastName", "email", "password"]
        return atributes
