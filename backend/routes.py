'''
This Script holds all routes to endpoints 
'''
import asyncio
from flask import request, redirect, url_for,jsonify
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from onesignal_sdk.error import OneSignalHTTPError
import requests
from app import APP as app, DB as db, ONESIGNAL_CLIENT as client
from models import Project, User, Task, Register
from modules import fetch, log, netsuite_req
from datetime import datetime

# async def create_note(note):
#     notification_body = {
# 			'contents': {'tr': 'Yeni bildirim', 'en': 'New notification'},
# 			'included_segments': ['Subscribed Users'],
# 			"headings": {"en": "Title of Message"},
# 	}
#     response = await client.send_notification(notification_body)
#     return response.body

# loop = asyncio.get_event_loop()
async def create_note(note,status):
    try:
        notification_body = {
            'contents': {'en': note["description"]},
            'include_external_user_ids': note["targets"],
            "headings": {"en":status+": "+note["title"]},
            'url':"https://projectar.devcodes.co/"
        }
        response = await client.send_notification(notification_body)
        return response.body
    except OneSignalHTTPError as e:
        print(e)
        print(e.status_code)
        print(e.http_response.json()) # You can see the details of error by parsing original response

loop = asyncio.get_event_loop()

@app.route('/api')
def api():
	return {"name":"Max"}

@app.route('/api/notify/edited-task', methods=['POST'])
def notify_edit():
	note=request.get_json()
	return loop.run_until_complete(create_note(note,"Updated Task"))

@app.route('/api/notify/completed-task', methods=['POST'])
def notify_complete():
	note=request.get_json()
	return loop.run_until_complete(create_note(note,"Completed Task"))

@app.route('/api/notify/new_task', methods=['POST'])
def notify_new():
	note=request.get_json()
	return loop.run_until_complete(create_note(note,"New Task"))

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
		password=data["password"],
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

@app.route('/api/project/sync')
def sync_projects():
	'''Sync all Projects from NetSuite into db'''
	data = netsuite_req({"request":"projects"})["data"]
	try:
		for project in data:
			print("at project:",project["id"])
			db_proj = Project.query.get(project["id"])
			if db_proj is not None:
				db.session.query(Project).filter(Project.id==db_proj.id).update(project)
				# db.session.commit()
				# return {
				# 	"success":True,
				# }
			else:
				proj = Project(
					id=project["id"],
					name=project["name"],
					consultant=project["consultant"],
					consultant_id=project["consultant_id"],
					manager=project["manager"],
					manager_id=project["manager_id"],
					customer=project["customer"],
					start_date=project["start_date"],
					end_date=project["end_date"],
					number=project["number"],
					progress_percentage=project["progress_percentage"],
					revised_end_date=project["revised_end_date"],
					status=project["status"],
					actual_end_date=project["actual_end_date"] 
				)
				db.session.add(proj)
			db.session.commit()	

			#add personnel
			
			data = netsuite_req( {"request": "personnel", "project_id": project["id"]})["data"]
			if len(data) != 0:
				print("syncing personnel for project:", project["id"])
				try:
					for personnel in data:
						db_pers = User.query.get(personnel["id"])
						if db_pers is not None:
							db.session.query(User).filter(User.id==db_pers.id).update(personnel)
						else:
							pers = User(
								id=personnel["id"],
								name=personnel["name"],
								role=personnel["role"],
								role_id=personnel["role_id"]
							)
							db.session.add(pers)
					db.session.commit()	
				except SQLAlchemyError as err:
					print(err)
					db.session.rollback()
					return {
						"success":False,
						"msg":"Could not sync personnel"
					} 
		return {
			"success":True,
		}
	except SQLAlchemyError as err:
		print(err)
		db.session.rollback()
		return {
			"success":False,
			"msg":"Could not sync project"
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

@app.route('/api/task/update/<int:task_id>', methods=['POST'])
def update_task(task_id):
	'''edits the task of the specified id'''
	data = request.get_json()
	try:
		task= Task.query.get_or_404(task_id)

		task.title=data["title"]
		task.description=data["description"]
		task.target=data["target"]
		task.date=data["date"]
		task.comment=data["comment"]
		if data["achieved"] is not None:
			task.achieved=data["achieved"]

		for personnel in task.personnel[:]:
			print("deleting",personnel)
			task.personnel.remove(personnel)
		db.session.commit()
		if data["personnel"] is not None:
			for personnel_id in data["personnel"]:
				print("adding",personnel_id)
				enrol_user_task(task.id, personnel_id)
		db.session.commit()
		return {
			"success":True,
			"data":data
		} 
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

# @app.route('/api/project/enrolments/<int:project_id>')
# def proj_users(project_id):
# 	'''Get all users that have been enrolled to a project'''
# 	data = []
# 	try:
# 		project = Project.query.get(project_id)
# 		msg = "does not exist"
# 		if project is not None:
# 			users = project.personnel
# 			if len(users[:]) != 0:
# 				# fetch(users, data)
# 				# return {
# 				# 	"success":True,
# 				# 	"data":data
# 				# }
# 				return jsonify(User.serialize_list(users))
# 			msg = "has not yet got enrolled users"
# 		return {
# 			"success":False,
# 			"msg":"Project with ID: %d %s" % (project_id, msg)
# 		}
# 	except SQLAlchemyError as err:
# 		print(err)
# 		return{
# 			"success":False
# 		}

@app.route('/api/project/enrolments/<int:project_id>')
def proj_users(project_id):
	'''Get all users that have been enrolled to a project'''
	data = netsuite_req({"request": "personnel", "project_id": project_id})
	db_proj = Project.query.get(project_id)
	return {
		"success" : True,
		"data" : data["data"]
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

@app.route('/api/user/tasks/<int:user_id>')
def user_tasks(user_id):
	'''Get all users that have been enrolled to a task'''
	data = []
	try:
		user = User.query.get(user_id)
		msg = "does not exist"
		if user is not None:
			tasks = user.tasks
			if len(tasks[:]) != 0:
				# fetch(tasks, data)
				# return {
				# 	"success":True,
				# 	"data":data
				# }
				return jsonify(Task.serialize_list(tasks))
			msg = "has not yet got enrolled tasks"
		return {
			"success":False,
			"msg":"User with ID: %d %s" % (user_id, msg)
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

@app.route('/api/project/verbose/<int:proj_id>')
def project_verbose(proj_id):
  '''Details of project tasks of specified id'''
  try:
    plist = []
    # pnames = ""
    project = Project.query.get(proj_id)
    msg = "does not exist"
    if project is not None:
      tasks = project.tasks
      if len(tasks) == 0:
      	print("project has no tasks")
    for task in tasks:
      temp_ = ''
      task_users = User.serialize_list(task.personnel)
      # print(task_users)
      for task_user in task_users:
        temp_ += task_user['name']
        if not task_users[-1]==task_user:
        	temp_+=", "
      plist.append(temp_)
      # plist.append(User.serialize_list(task.personnel))
      # for
    return {
    "success":True,
    "tasks_list":Task.serialize_list(tasks),
    "personnel_list":plist
    }
  except SQLAlchemyError as err:
    print(err)
    return{
    "success":False
    }

@app.route('/api/attendance/<int:proj_id>', methods=['POST'])
def attendance(proj_id):
	'''assess attendance of personnel'''
	data = request.get_json()

	try:
		#check if the register for day already exists
		project = Project.query.get_or_404(proj_id)
		register = Register.query.filter_by(date=data["date"], project=project).all()
		if len(register) != 0:
			for personnel in register[:]:
				db.session.delete(personnel)
			db.session.commit()

		for personnel in data["body"]:
			time_in = None if personnel["signIn"]==None else datetime.strptime(personnel["signIn"], "%H:%M:%S %p").time()
			time_out =  None if personnel["signOut"]==None else datetime.strptime(personnel["signOut"], "%H:%M:%S %p").time()

			register = Register(
				date=data["date"],
				is_present=personnel["isPresent"],
				time_in=time_in,
				time_out=time_out,
				lunch=personnel["lunch"],
				t_and_t=personnel["tandt"],
				personnel_id=personnel["id"],
				personnel_name=personnel["name"],
				project=project
			)
			db.session.add(register)
		db.session.commit()
		return {
			"success":True
		}
		
	except SQLAlchemyError as err:
		print(err)
		db.session.rollback()
		return {
			"success":False,
			"message":"Invalid date or project ID"
		}

@app.route('/api/attendance/<int:proj_id>/all')
def all_attendance(proj_id):
	try:
		register = Register.query.filter_by(project_id=proj_id)
		return jsonify(Register.serialize_list(register))
	except SQLAlchemyError as err:
		print(err)
		db.session.rollback()
		return {
			"success":False,
			"message":"project has no register"
		}

@app.route('/api/login', methods=['POST'])
def login():
	'''login authentication'''
	details = request.get_json()	
	try:
		usrn = User.query.filter_by(username=details["username"], password=details["password"]).all() 
		if len(usrn) !=0 :
			message= User.serialize_list(usrn)
			return {
				"success":True,
				"message":message
			}
		return {
				"success":False,
				"message":"Access Denied"
			}
	except SQLAlchemyError as err:
		print(err)
		return {
			"success":False	
		}

@app.route('/api/v1/authenticate', methods=['POST'])
def authenticate():
	'''login authentication'''
	pload= request.get_json()
	r = requests.post("https://b0703c0633fb.ngrok.io/v1/authenticate", data=pload)
	return r.json()