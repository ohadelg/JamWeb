// Constant.ts is a file that contains all the constants that are used in the actions.

// Available Instruments
export const INSTRUMENTS = ["Guitar", "Bass", "Drums", "Flute", "Singer"];

// Web Address
export const WEB_PROTOCOL = 'https://',
ADDRESS = 'server-side-flask-production.up.railway.app',
PORT = 8080,
URL_BEGIN = WEB_PROTOCOL+ADDRESS; //+":"+PORT;
 //'flask-production-8a1a.up.railway.app',

// Alerts



// Auth
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS',
REGISTER_FAILED = 'REGISTER_FAILED',
LOGIN_SUCCESS = 'LOGIN_SUCCESS',
LOGIN_FAILED = 'LOGIN_FAILED',
USER_LOADED = 'USER_LOADED',
AUTH_ERROR = 'AUTH_ERROR',
LOGOUT = 'LOGOUT',
LOGOUT_FAILED = 'LOGOUT_FAILED';

// Messages 
export const 
MESSAGE_SENT = 'MESSAGE_SENT',
MESSAGE_FAILED = 'MESSAGE_FAILED',
MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
MESSAGE_ERROR = 'MESSAGE_ERROR',
MESSAGE_DELETED = 'MESSAGE_DELETED',
BAD_REQUEST = 400,
UNAUTHORIZED = 401,
OK = 200,
CREATED = 201,
ACCEPTED = 202,
CONTENT_TYPE = 'Content-Type',
APPLICATION_JSON = 'application/json',
TEXT_HTML = 'text/html',
IMAGE_JPEG = 'image/jpeg';

// User
export const SONGS = [
    {'name': 'Hey jude', 'value': 'hey_jude', 'dir': 'ltr', 'artist': 'The Beatles' },
    {'name': 'ואיך שלא', 'value': 'veech_shelo', 'dir': 'rtl', 'artist': 'אריאל זילבר' },
    ];
