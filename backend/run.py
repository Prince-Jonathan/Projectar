'''
A single entry-point that resolves theimport dependencies.
In order to run app, point to run.
>>python run.py
'''
from app import APP
from routes import *
# from waitress import serve
# import logging

# logging.basicConfig()
# logging.getLogger().setLevel(logging.CRITICAL) # Basically silence all logs from the root logger

if __name__ == "__main__":
    # serve(APP, host='0.0.0.0', port=8050)
    APP.run(host="0.0.0.0", port=8050, debug=False)