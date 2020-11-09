import os
from flask import Flask, request,url_for, send_from_directory, jsonify
from flask_cors import CORS
from flask_ckeditor import upload_success, upload_fail

app = Flask(__name__, static_folder='build')

cors=CORS(app, resources={r"/*": {"origins": "*"}})
# app.config['CKEDITOR_FILE_UPLOADER'] = './uploads'  # this value can be endpoint or url

@app.route('/home')
def home():
	return "home page"

# @app.route('/')
# def frontend():
#     return send_from_directory(app.static_folder, "index.html")
    #return "files"

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
@app.route('/files/<path:filename>')
def uploaded_files(filename):
    return send_from_directory(app.static_folder, "uploads/"+filename)

@app.route('/upload', methods=['POST'])
def upload():
	print("we are in")
	f = request.files.get('upload')
	# Add more validations here
	extension = f.filename.split('.')[-1].lower()
	if extension not in ['jpg', 'gif', 'png', 'jpeg']:
	    return upload_fail(message='Image only!')
	f.save(os.path.join('./build/uploads', f.filename))
	url = url_for('uploaded_files', filename=f.filename)
	print(f.filename)
	return jsonify({
        "uploaded": True,
        "url": "http://localhost:8000/files/"+f.filename,
      })
	# return upload_success(url=url)  # return upload_success call

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8888, debug=True)