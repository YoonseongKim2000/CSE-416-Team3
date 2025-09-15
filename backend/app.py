from flask import Flask, request, jsonify
from flask_cors import CORS
from routes.test import test
from routes.testdb import testdb


def compile_routes():
    app = Flask(__name__)

    # Only allow requests from GitHub Pages frontend, stops other websites from calling our API
    CORS(app, resources={r"/*": {"origins": [
    "https://yoonseongkim2000.github.io",
    "http://localhost:5173" 
    ]}})

    app.register_blueprint(test)
    app.register_blueprint(testdb)

    @app.route("/api/ping")
    def ping():
        return jsonify({"message": "pong from backend"})

    @app.route("/api/login", methods=["POST"])
    def login():
        # Get JSON payload
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No data sent"}), 400

        username = data.get("username")
        password = data.get("password")

        # Simple validation
        if not username or not password:
            return jsonify({"success": False, "message": "Username or password missing"}), 400

        # Example authentication (replace with real DB check)
        if username == "testuser" and password == "12345":
            return jsonify({"success": True, "message": "Login successful!"})
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
        
    return app

if __name__ == "__main__":
    app = compile_routes()
    app.run(host="0.0.0.0", port=5000)
