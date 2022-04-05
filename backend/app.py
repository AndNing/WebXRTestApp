from app import app

if __name__ == "__main__":
    from os import environ
    # port = '0.0.0.0:3000'
    app.run(host='0.0.0.0', port=int(environ.get("PORT", 3000)))