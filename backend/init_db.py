import sqlite3

connection = sqlite3.connect('database.db')

with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO devices (devicename, latitude, longitude) VALUES (?, ?, ?)",
            ('South', 43.029919, -81.271674)
            )

cur.execute("INSERT INTO devices (devicename, latitude, longitude) VALUES (?, ?, ?)",
            ('North', 43.041369, -81.278182)
            )

cur.execute("INSERT INTO devices (devicename, latitude, longitude) VALUES (?, ?, ?)",
            ('East', 43.041212, -81.270085)
            )

cur.execute("INSERT INTO devices (devicename, latitude, longitude) VALUES (?, ?, ?)",
            ('West', 43.038107, -81.281274)
            )             

connection.commit()
connection.close()