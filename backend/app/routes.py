from app import app
from flask import request

import time

@app.route("/time")
def try_test():
    # return {'time': time.time()}
    return "Hello"

@app.route("/geolocation", methods = ['POST', 'PUT'])
def geolocation():
    if request.method == 'POST':
        print("Post")
        print(request.get_json())
    else:
        print("Put")
        print(request.get_json())

    response = {"response": 'hello'}
    return response

@app.route("/userlocations", methods = ['GET'])
def userlocations():
    return {
        "latitude" : 43.039124,
        "longitude" : -81.278583
    }