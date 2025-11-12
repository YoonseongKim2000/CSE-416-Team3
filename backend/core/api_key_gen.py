import hashlib
import random

def generateKey(email: str):
    input_seed = email + str(random.getrandbits(2048))
    sha256 = hashlib.sha256()

    sha256.update(input_seed.encode("utf-8"))

    return sha256.hexdigest()
