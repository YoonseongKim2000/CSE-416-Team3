from flask import Blueprint, jsonify
from ..db import AtlasClient

testdb = Blueprint("testdb", __name__, url_prefix="/api")

client = AtlasClient()

@testdb.route("/db/ping")
def ping():
    client.ping()
    return jsonify({"message": "ping'd"})

@testdb.route("/db/getUsers")
def getUsers():
    users = client.get_users()
    return jsonify(users)