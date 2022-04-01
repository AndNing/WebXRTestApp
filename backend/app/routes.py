from asyncio.windows_events import NULL
from app import app
import sqlite3
from flask import request, render_template

import time

def get_db_connection():
    conn = sqlite3.connect('database.db')
    return conn

def make_query(query,values):
    conn = get_db_connection()
    rows = NULL
    with conn:
        conn.row_factory = sqlite3.Row
        curs = conn.cursor()
        rows = curs.execute(query,values).fetchall()

    return rows

@app.route('/')
def server():
    return render_template('index.html')

@app.route("/time")
def try_test():
    # return {'time': time.time()}
    return "Hello"

@app.route("/device/<devicename>", methods = ['GET','POST','PUT','DELETE'])
def geolocation(devicename):
    data = request.get_json()
    print(data)

    if request.method == 'GET':
        get_geolocation(devicename,data)
    elif request.method == 'POST':
        post_geolocation(devicename,data)
    elif request.method == 'PUT':
        put_geolocation(devicename,data)
    else:
        delete_geolocation(devicename,data)

    response = {"status": "success"}
    return response

def get_geolocation(devicename,data):
    print(devicename + " Get")
    # print(data)

def post_geolocation(devicename,data):
    print(devicename + " Post")
    make_query("INSERT INTO devices (devicename, latitude, longitude) VALUES (?,?,?)",(devicename, data["latitude"], data["longitude"]))

def put_geolocation(devicename,data):
    print(devicename + " Put")
    make_query("UPDATE devices SET latitude=?,longitude=? WHERE devicename=?", (data["latitude"],data["longitude"],devicename))

def delete_geolocation(devicename,data):
    print(devicename + " Delete")
    make_query("DELETE FROM devices WHERE devicename=?",(devicename,))

@app.route("/destinationlocations/<destinationnumber>", methods = ['GET'])
def userlocations(destinationnumber):
    # destinations = [
    #     {
    #         "name" : "South",
    #         "latitude" : 43.029919,
    #         "longitude" : -81.271674
    #     },
    #     {
    #         "name" : "East",
    #         "latitude" : 43.041212,
    #         "longitude" : -81.270085
    #     },
    #     {
    #         "name" : "North",
    #         "latitude" : 43.041369,
    #         "longitude" : -81.278182
    #     },
    #     {
    #         "name" : "West",
    #         "latitude" : 43.038107,
    #         "longitude" : -81.281274
    #     }
    # ]

    # destination = destinations[int(destinationnumber)]
    # destination["numDestinations"] = 4

    # return destinations[int(destinationnumber)]

    # conn = get_db_connection()
    # destinationData = conn.execute("SELECT * FROM devices WHERE id=?", (destinationnumber)).fetchall()
    # conn.close()

    numDestinations = len(make_query("SELECT * FROM devices",()))
    print(numDestinations)

    if int(destinationnumber) > numDestinations:
        destinationData = make_query("SELECT * FROM devices", ())[0]
    else:
        destinationData = make_query("SELECT * FROM devices", ())[int(destinationnumber)]
    

    return {
        "name" : destinationData['devicename'],
        "latitude" : destinationData['latitude'],
        "longitude" : destinationData['longitude'],
        "numDestinations" : numDestinations
    }