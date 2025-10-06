import os

FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "*")

CONFIG = {
    "num_classes": 2,
    "class_names": ["AI", "Human"]
}
