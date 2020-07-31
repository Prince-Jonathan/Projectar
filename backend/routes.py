'''
This Script holds all routes to endpoints 
'''
from flask import request, redirect, url_for,jsonify
from sqlalchemy.exc import SQLAlchemyError
from app import APP as app, DB as db, ONESIGNAL_CLIENT as client
from models import Project, User
from modules import fetch, log

@app.route('/api')
def api():
	return {"name":"Max"}

@app.route('/api/notify')
def notify():
	notification_body = {
			'contents': {'tr': 'Yeni bildirim', 'en': 'New notification'},
			'included_segments': ['Subscribed Users'],
			"headings": {"en": "Title of Message"},
	}
	response = client.send_notification(notification_body)
	return response.body

@app.route('/api/user/add', methods=['POST'])
def add_user():
	'''Add new user'''
	data = request.get_json()
	user = User(
		first_name=data["first_name"],
		last_name=data["last_name"],
		username=data["username"].lower(),
		pin=data["pin"],
		status=data["status"]
	)
	try: 
		db.session.add(user)
		db.session.commit()
		return redirect(url_for('get_user', user_id=user.id))
			
	except SQLAlchemyError as err:
		print(err)
		db.session.rollback()
		return {
			"success":False,
			"msg":"Username:'%s' already exits" % data["username"]
		}


@app.route('/api/project/add', methods=['POST'])
def add_project():
	'''Add new project'''
	data = request.get_json()
	project = Project(
		name=data["name"],
		client=data["client"],
		lon=data["lon"],
		lat=data["lat"]
	)
	try:
		db.session.add(project)
		db.session.commit()
		return {
			"success":True,
			"data":data
		}
	except SQLAlchemyError as err:
		print(err)
		db.session.rollback()
		return {
			"success":False,
			"msg":"Project:'%s' already exits" % data["name"]
		} 

@app.route('/api/user/detail/<int:user_id>')
def get_user(user_id):
	'''Query user details'''
	data = {}
	try:
		user = User.query.get(user_id)		
		if user is not None:
			log(user, data)
			return {
				"success":True,
				"data":data
			} 
		return {
				"success":False,
				"msg":"User with ID: %d does not exist" % user_id
			} 
	except SQLAlchemyError as err:
		print(err)
		return {
			"success":False,
			"msg":"An error occured while trying to fetch user with ID: %d" % user_id
		}

@app.route('/api/user/all')
def all_users():
	'''Get all users'''
	data = []
	try:
		users = User.query.order_by(User.id).all()
		fetch(users, data)
		return {
			"success":True,
			"data":data
		}
	except SQLAlchemyError as err:
		print(err)
		return {
			"success":False	
		}

@app.route('/api/project/all')
def all_projects():
	'''Get all Projects'''
	data = []
	try:
		projects = Project.query.order_by(Project.id).all()
		fetch(projects, data)
		# return {
		# 	"success":True,
		# 	"data":data
		# }
		return jsonify(Project.serialize_list(projects))
	except SQLAlchemyError as err:
		print(err)
		return {
			"success":False	
		}

@app.route('/api/user/enrol/<int:user_id>/<int:project_id>')
def enrol(user_id, project_id):
	'''Passes two id arguments to  enrol a user to a project respectively.'''
	try:
		user = User.query.get_or_404(user_id)
		project = Project.query.get_or_404(project_id)
		user.projects.append(project)
		db.session.commit()
		return {
			"success":True,
		} 
	except SQLAlchemyError as err:
		print(err)
		db.session.rollback()
		return {
			"success":False
		}

@app.route('/api/user/enrolments/<int:user_id>')
def pro_enrol(user_id):
	'''Get all projects that user of id has been enrolled to'''
	data = []
	try:
		user = User.query.get(user_id)
		msg = "does not exist"
		if user is not None:
			enrolments = user.projects
			if len(enrolments) != 0:
				fetch(enrolments, data)
				return {
					"success":True,
					"data":data
				}
			msg = "has not yet been enrolled to a project"
		return {
			"success":False,
			"msg":"User with ID: %d %s" % (user_id, msg)
		}
	except SQLAlchemyError as err:
		print(err)
		return{
			"success":False
		}

@app.route('/api/project/enrolments/<int:project_id>')
def usr_enrol(project_id):
	'''Get all users that have been enrolled to a project'''
	data = []
	try:
		project = Project.query.get(project_id)
		msg = "does not exist"
		if project is not None:
			enrolments = project.users
			if len(enrolments[:]) != 0:
				fetch(enrolments, data)
				return {
					"success":True,
					"data":data
				}
			msg = "has not yet got enrolled users"
		return {
			"success":False,
			"msg":"Project with ID: %d %s" % (project_id, msg)
		}
	except SQLAlchemyError as err:
		print(err)
		return{
			"success":False
		}

@app.route('/api/login', methods=['POST'])
def login():
	'''login authentication'''
	details = request.get_json()
	try:
		usrn = User.query.filter_by(username=details["username"], pin=details["pincode"]).first() 
		if usrn is not None:
			return redirect(url_for('get_user', user_id=usrn.id))
		return "Username: \"%s\" does not exits" % details["username"]
	except SQLAlchemyError as err:
		print(err)
		return{
				"success":False
		}
