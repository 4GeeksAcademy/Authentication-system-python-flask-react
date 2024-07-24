"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
import json

api = Blueprint('api', __name__)

@api.route('/user', methods=['POST'])
def add_new_user():
    body = json.loads(request.data)
    user_password = body["password"]

    # Mensajes campos sin completar
    if not body.get("name"):
        return jsonify({"msg": "Introduzca nombre"}), 401
    if not body.get("email"):
        return jsonify({"msg": "Introduzca un correo"}), 401
    if not body.get("password"):
        return jsonify({"msg": "Introduzca una contraseña"}), 401

    # Comprobamos si el correo o el nombre ya están registrados
    nombre_existente = User.query.filter_by(name=body["name"]).first()
    correo_existente = User.query.filter_by(email=body["email"]).first()

    if nombre_existente or correo_existente:
        return jsonify({"msg": "El nombre o correo ya está registrado"}), 400

    # Hash password
    hashed_password = current_app.bcrypt.generate_password_hash(body["password"]).decode('utf-8')

    # Guardar nuevo usuario con hashed_password
    user = User(name=body["name"], email=body["email"], password=hashed_password)
    db.session.add(user)
    db.session.commit()

    # Respuesta
    response_body = {
        "msg": "Usuario creado"
    }

    return jsonify(response_body), 200


@api.route('/user', methods=['DELETE'])
def delete_user():
    body = json.loads(request.data)
    usuario = User.query.filter_by(name=body["name"]).first()

    if not usuario:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    db.session.delete(usuario)
    db.session.commit()

    response_body = {
        "msg": "Usuario eliminado"
    }

    return jsonify(response_body), 200


@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    user = User.query.filter_by(email=email).first()
    user_by_name = User.query.filter_by(name=email).first()

    # Mensajes datos sin rellenar
    if not email:
        return jsonify({"msg": "Introduzca un correo"}), 401
    if not password:
        return jsonify({"msg": "Introduzca una contraseña"}), 401

    # Mensaje usuario no registrado
    if not user and not user_by_name:
        return jsonify({"msg": "Usuario no encontrado"}), 401

    if user:
        if email != user.email or not current_app.bcrypt.check_password_hash(user.password, password):
            return jsonify({"msg": "Correo o contraseña incorrecta"}), 401

        access_token = {
            "token": create_access_token(identity=email),
            "name": user.name
        }

    if user_by_name and not user:
        if email != user_by_name.name or not current_app.bcrypt.check_password_hash(user_by_name.password, password):
            return jsonify({"msg": "Correo o contraseña incorrecta"}), 401

        access_token = {
            "token": create_access_token(identity=email),
            "name": user_by_name.name
        }

    return jsonify(access_token=access_token), 200


@api.route("/profile", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


if __name__ == "__main__":
    app.run()