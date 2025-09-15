from flask import Blueprint, jsonify

test = Blueprint("test", __name__, url_prefix="/api")

@test.route("/ping")
def respone():
    return jsonify({"message": "pong"})