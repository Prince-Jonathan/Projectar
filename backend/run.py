'''
A single entry-point that resolves theimport dependencies.
In order to run app, point to run.
>>python run.py
'''
from app import APP
from routes import *

if __name__ == "__main__":
    APP.run(host="0.0.0.0", port=5000, debug=True)
    