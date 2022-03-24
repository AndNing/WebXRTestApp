from app import app

import time

@app.route("/time")
def try_test():
    return {'time': time.time()}
