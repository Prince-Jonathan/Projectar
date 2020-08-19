'''
This Script holds all routes to endpoints 
'''
import asyncio
from flask import request, redirect, url_for,jsonify
from sqlalchemy.exc import SQLAlchemyError
from app import APP as app, DB as db, ONESIGNAL_CLIENT as client
from models import Project, User, Task
from modules import fetch, log

async def create_note():
    notification_body = {
			'contents': {'tr': 'Yeni bildirim', 'en': 'New notification'},
			'included_segments': ['Subscribed Users'],
			"headings": {"en": "Title of Message"},
	}
    response = await client.send_notification(notification_body)
    return response.body

loop = asyncio.get_event_loop()

@app.route('/api')
def api():
	return {"name":"Max"}

@app.route('/api/notify')
def notify():
	return loop.run_until_complete(create_note())

@app.route('/api/user/add', methods=['POST'])
def add_user():
	'''Add new user'''
	data = request.get_json()
	user = User(
		first_name=data["first_name"],
		last_name=data["last_name"],
		email=data["email"],
		phone_number=data["phone_number"],
		username=data["username"].lower(),
		pin=data["pin"],
		role=data["role"]
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
		project_consultant=data["project_consultant"],
		project_manager=data["project_manager"],
		team=data["team"]
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

@app.route('/api/task/add', methods=['POST'])
def add_task():
	'''Add new task'''
	data = request.get_json()
	project = Project.query.get_or_404(data["project_id"])
	task = Task(
		title=data["title"],
		description=data["description"],
		target=data["target"],
		date=data["date"],
		project=project
	)
	try:
		db.session.add(task)
		db.session.commit()

		for personnel_id in data["personnel"]:
			enrol_user_task(task.id, personnel_id)
		return {
			"success":True,
			"data":data
		}
	except SQLAlchemyError as err:
		print(err)
		db.session.rollback()
		return {
			"success":False,
			"msg":"Task:'%s' already exits" % data["title"]
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
		# fetch(users, data)
		# return {
		# 	"success":True,
		# 	"data":data
		# }
		return jsonify(Task.serialize_list(users))
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
		# fetch(projects, data)
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

@app.route('/api/task/all')
def all_tasks():
	'''Get all Tasks'''
	data = []
	try:
		tasks = Task.query.order_by(Task.id).all()
		#fetch(tasks, data)
		# return {
		# 	"success":True,
		# 	"data":data
		# }
		return jsonify(Task.serialize_list(tasks))
	except SQLAlchemyError as err:
		print(err)
		return {
			"success":False	
		}

@app.route('/api/enrol/user/proj/<int:personnel_id>/<int:project_id>')
def enrol_user_proj(personnel_id, project_id):
	'''Passes two id arguments to  enrol a user to a project respectively.'''
	try:
		user = User.query.get_or_404(personnel_id)
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

@app.route('/api/enrol/user/task/<int:task_id>/<int:personnel_id>')
def enrol_user_task(task_id, personnel_id):
	'''Passes task id and personnel id to enrol personnel to a task '''
	try:
		personnel=User.query.get_or_404(personnel_id)
		task = Task.query.get_or_404(task_id)
		task.personnel.append(personnel)
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

@app.route('/api/task/update/<int:task_id>', methods=['GET'])
def update_task(task_id):
	'''edits the task of the specifiend id'''
	try:
		task= Task.query.get_or_404(task_id)
		
		task.title=data["title"],
		task.description=data["description"],
		task.target=data["target"],
		task.date=data["date"],
		task.project=project
		return jsonify(Task.serialize_list(task))
	except SQLAlchemyError as err:
		print(err)
		db.session.rollback()
		return {
			"success":False
		}

@app.route('/api/project/task/<int:project_id>')
def proj_tasks(project_id):
	'''Get all tasks that project of id has assigned'''
	try:
		project = Project.query.get(project_id)
		msg = "does not exist"
		if project is not None:
			tasks = project.tasks
			if len(tasks) != 0:
				return jsonify(Task.serialize_list(tasks))
			msg = "has not yet been assigned tasks"
		return {
			"success":False,
			"msg":"Project with ID: %d %s" % (project_id, msg)
		}
	except SQLAlchemyError as err:
		print(err)
		return{
			"success":False
		}
@app.route('/api/user/enrolments/<int:personnel_id>')
def user_projs(personnel_id):
	'''Get all projects that user of id has been enrolled to'''
	data = []
	try:
		user = User.query.get(personnel_id)
		msg = "does not exist"
		if user is not None:
			projects = user.projects
			if len(projects) != 0:
				# fetch(projects, data)
				# return {
				# 	"success":True,
				# 	"data":data
				# }
				return jsonify(Project.serialize_list(projects))
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
def proj_users(project_id):
	'''Get all users that have been enrolled to a project'''
	data = []
	try:
		project = Project.query.get(project_id)
		msg = "does not exist"
		if project is not None:
			users = project.personnel
			if len(users[:]) != 0:
				# fetch(users, data)
				# return {
				# 	"success":True,
				# 	"data":data
				# }
				return jsonify(User.serialize_list(users))
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

@app.route('/api/task/enrolments/<int:task_id>')
def task_users(task_id):
	'''Get all users that have been enrolled to a task'''
	data = []
	try:
		task = Task.query.get(task_id)
		msg = "does not exist"
		if task is not None:
			personnel = task.personnel
			if len(personnel[:]) != 0:
				# fetch(personnel, data)
				# return {
				# 	"success":True,
				# 	"data":data
				# }
				return jsonify(User.serialize_list(personnel))
			msg = "has not yet got enrolled personnel"
		return {
			"success":False,
			"msg":"Task with ID: %d %s" % (task_id, msg)
		}
	except SQLAlchemyError as err:
		print(err)
		return{
			"success":False
		}

@app.route('/api/task/delete/<int:task_id>')
def del_task(task_id):
	'''Delete task of specified id'''
	try:
		task=Task.query.get_or_404(task_id)
		db.session.delete(task)
		db.session.commit()
		return {
			"success":True
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
