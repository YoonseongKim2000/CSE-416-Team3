from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Only allow requests from GitHub Pages frontend, stops other websites from calling our API
CORS(app, resources={r"/*": {"origins": [
    "https://yoonseongkim2000.github.io",
    "http://localhost:5173" 
    ]}})

@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello from Flask on Render!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
