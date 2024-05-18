from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_swagger_ui import get_swaggerui_blueprint
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

with open("swagger.json", "r") as f:
    swagger_json = json.load(f)

# Serve Swagger JSON document as a static file
@app.route('/swagger.json')
def get_swagger_json():
    return jsonify(swagger_json)

# Define Swagger UI blueprint
SWAGGER_URL = '/swagger'
API_URL = '/swagger.json'
swagger_ui_blueprint = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={'app_name': "Calendar API"})
app.register_blueprint(swagger_ui_blueprint, url_prefix=SWAGGER_URL)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///calendar.db'
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['JWT_EXPIRATION_DELTA'] = datetime.timedelta(minutes=1)

db = SQLAlchemy(app)

jwt = JWTManager(app)

# Define your User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    events = db.relationship('Event', backref='user', lazy=True)

# Define your Event model
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    start = db.Column(db.DateTime, nullable=False)
    end = db.Column(db.DateTime, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
# User Registration endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    new_user = User(username=data['username'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

# Authentication endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    return jsonify({'message': 'Invalid username or password'}), 401

# Token endpoint
@app.route('/token', methods=['GET'])
@jwt_required()
def get_token():
    current_user = get_jwt_identity()
    user = User.query.get(current_user)
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200

# Get all users endpoint
@app.route('/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    users_list = [{'id': user.id, 'username': user.username} for user in users]
    return jsonify(users_list), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
