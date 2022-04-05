import sqlite3

connection = sqlite3.connect('database.db')

with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO devices (devicename, latitude, longitude) VALUES (?, ?, ?)",
            ('South - Port Stanley', 42.668726, -81.216186)
            )

cur.execute("INSERT INTO devices (devicename, latitude, longitude) VALUES (?, ?, ?)",
            ('North - Sudbury', 46.492447, -80.991020)
            )

cur.execute("INSERT INTO devices (devicename, latitude, longitude) VALUES (?, ?, ?)",
            ('East - Buffalo', 42.986253, -78.902066)
            )

cur.execute("INSERT INTO devices (devicename, latitude, longitude) VALUES (?, ?, ?)",
            ('West - Sarnia', 43.005863, -82.386442)
            )

cur.execute("INSERT INTO devices (devicename, latitude, longitude) VALUES (?, ?, ?)",
            ('Western Student Recreation Centre', 43.003011, -81.274808)
            )            

cur.execute("INSERT INTO devices (devicename, latitude, longitude) VALUES (?, ?, ?)",
            ('London International Airport', 43.029574, -81.146803)
            )     

connection.commit()
connection.close()