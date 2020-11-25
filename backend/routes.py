'''
This Script holds all routes to endpoints 
'''
import os
import asyncio
from flask import request, redirect, url_for,jsonify,send_from_directory
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import text
from onesignal_sdk.error import OneSignalHTTPError
import requests
from app import APP as app, DB as db, ONESIGNAL_CLIENT as client, session
from models import Project, User, Task, Detail as Task_Detail, Register, Announcement
from modules import fetch, log, netsuite_req, get_tasks
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

'''serve frontend'''
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
	f = request.files.get('upload')
	# Add more validations here
	extension = f.filename.split('.')[-1].lower()
	if extension not in ['jpg', 'gif', 'png', 'jpeg']:
	    return upload_fail(message='Image only!')
	f.save(os.path.join('./build/uploads', f.filename))
	url = url_for('uploaded_files', filename=f.filename)
	return jsonify({
        "uploaded": True,
        "url": "https://projectar.automationghana.com/files/"+f.filename,
      })

async def create_note(note,status):
	if "targets_include" in note:
		#code below code be optimised with sets; sets function malware, hence code below:
		for id in note["targets_include"]:
			if id not in note["targets"]:
				note["targets"].append(id)
	print('the targets to be notified', note["targets"])
	try:
		notification_body = {
			'contents': {'en': note["description"]},
			'include_external_user_ids': note["targets"],
			"headings": {"en":status+": "+note["title"]},
			# 'url':"https://projectar.devcodes.co/"
			'url':note["url"] if "url" in note else "https://projectar.devcodes.co/"

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
	note = request.get_json()
	return loop.run_until_complete(create_note(note,"Updated Task"))

@app.route('/api/notify/reassigned-task', methods=['POST'])
def notify_reassign():
	note = request.get_json()
	return loop.run_until_complete(create_note(note,"Reassigned Task"))

@app.route('/api/notify/completed-task', methods=['POST'])
def notify_complete():
	note = request.get_json()
	return loop.run_until_complete(create_note(note,"Completed Task"))

@app.route('/api/notify/new_task', methods=['POST'])
def notify_new():
	note = request.get_json()
	return loop.run_until_complete(create_note(note,"New Task"))

@app.route('/api/notify/announce', methods=['POST'])
def notify_announcement():
	note = request.get_json()
	announcement = Announcement(
		sender=note["sender"],
		title=note["title"],
		description=note["description"]
		)
	try: 
		db.session.add(announcement)
		db.session.commit()
		for target in note["targets"]:
			recipient = User.query.get(target)
			if recipient is not None:
				announcement.personnel.append(recipient)
			
	except SQLAlchemyError as err:
		print(err)
		db.session.rollback()
		return {
			"success":False,
			"msg":"could not send announcement"
		}
	db.session.commit()
	return loop.run_until_complete(create_note(note,"Announcement"+" from "+note["sender"]))

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

# @app.route('/api/task/add', methods=['POST'])
# def add_task():
# 	'''Add new task'''
# 	data = request.get_json()
# 	project = Project.query.get_or_404(data["project_id"])
# 	task = Task(
# 		title=data["title"],
# 		description=data["description"],
# 		target=data["target"],
# 		date=data["date"],
# 		project=project
# 	)
# 	try:
# 		db.session.add(task)
# 		db.session.commit()

# 		for personnel_id in data["personnel"]:
# 			enrol_user_task(task.id, personnel_id)
# 		return {
# 			"success":True,
# 			"data":data
# 		}
# 	except SQLAlchemyError as err:
# 		print(err)
# 		db.session.rollback()
# 		return {
# 			"success":False,
# 			"msg":"Task:'%s' already exits" % data["title"]
# 		} 

@app.route('/api/task/add', methods=['POST'])
def add_task():
	'''Add new task'''
	try:
		data = request.get_json()
		project = Project.query.get(data["project_id"])
		if project is None:
			#add project
			project = Project(
					id=data["project_id"]
				)
		#create task
		task = Task(
			title=data["title"],
			description=data["description"],
			project=project,
			creator=data["creator"]
		)
		db.session.add(task)
		db.session.commit()

		#add task details
		task_detail = Task_Detail(
			target_date=data["date"],
			entry_type=data["entry_type"],
			achieved=data["achieved"],
			target=data["target"],
			comment=data["comment"],
			task=task
		)
		db.session.add(task_detail)
		db.session.commit()

		#enrol personnel to task_detail
		for personnel in data["personnel"]:
			db_pers = User.query.get(personnel["id"])
			if db_pers is None:
				#add personnel
				db_pers = User(
						id=personnel["id"],
						name=personnel["name"]
					)
				db.session.add(db_pers)
				db.session.commit()
			enrol_user_task_detail(task_detail.id, personnel["id"])
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

# @app.route('/api/user/all')
# def all_users():
# 	'''Get all users'''
# 	data = []
# 	try:
# 		users = User.query.order_by(User.id).all()
# 		# fetch(users, data)
# 		# return {
# 		# 	"success":True,
# 		# 	"data":data
# 		# }
# 		return jsonify(Task.serialize_list(users))
# 	except SQLAlchemyError as err:
# 		print(err)
# 		return {
# 			"success":False	
# 		}

@app.route('/api/user/all')
def all_users():
	'''Get all users'''
	data = []
	try:
		users = netsuite_req({"request": "resources"})["data"]
		# fetch(users, data)
		# return {
		# 	"success":True,
		# 	"data":data
		# }
		return jsonify(users)
	except SQLAlchemyError as err:
		print(err)
		return {
			"success":False	
		}
# @app.route('/api/project/all')
# def all_projects():
# 	'''Get all Projects'''
# 	data = []
# 	try:
# 		projects = Project.query.order_by(Project.id).all()
# 		# fetch(projects, data)
# 		# return {
# 		# 	"success":True,
# 		# 	"data":data
# 		# }
# 		return jsonify(Project.serialize_list(projects))
# 	except SQLAlchemyError as err:
# 		print(err)
# 		return {
# 			"success":False	
# 		}

# @app.route('/api/project/all')
# def all_projects():
# 	'''Get all Projects'''
# 	data = netsuite_req({"request": "projects"})["data"]
# 	return {
# 		"success":True,
# 		"data":data
# 	}

# passed authentication route
@app.route('/api/project/all/<int:user_id>')
def all_projects(user_id):
	'''Get all Projects'''
	data = netsuite_req({"request": "user-projects", "id": user_id})["data"] if user_id != 0 else netsuite_req({"request": "projects"})["data"]
	return {
		"success":True,
		"data":data
	}

@app.route('/api/project/sync')
def sync_projects():
	'''Sync all Projects from NetSuite into db'''
	data = netsuite_req({"request":"projects"})["data"]
	try:
		for project in data:
			db_proj = Project.query.get(project["id"])
			if db_proj is not None:
				db.session.query(Project).filter(Project.id==db_proj.id).update({"id":project["id"]})
			else:
				proj = Project(
					id=project["id"],
					# name=project["name"],
					# consultant=project["consultant"],
					# consultant_id=project["consultant_id"],
					# manager=project["manager"],
					# manager_id=project["manager_id"],
					# customer=project["customer"],
					# start_date=project["start_date"],
					# end_date=project["end_date"],
					# number=project["number"],
					# progress_percentage=project["progress_percentage"],
					# revised_end_date=project["revised_end_date"],
					# status=project["status"],
					# actual_end_date=project["actual_end_date"] 
				)
				db.session.add(proj)
			db.session.commit()	

			#add personnel
			
			data = netsuite_req( {"request": "personnel", "project_id": project["id"]})["data"]
			if len(data) != 0:
				try:
					for personnel in data:
						db_pers = User.query.get(personnel["id"])
						if db_pers is not None:
							db.session.query(User).filter(User.id==db_pers.id).update({"id":personnel["id"]})
						else:
							pers = User(
								id=personnel["id"],
								# name=personnel["name"],
								# role=personnel["role"],
								# role_id=personnel["role_id"]
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
		tasks_obj = Task.serialize_list(tasks)
		for task in tasks:
			details = Task_Detail.serialize_list(db.session.query(Task_Detail).filter(Task_Detail.task_id==task.id).order_by(Task_Detail.date_updated.desc()).all())
			if len(details) !=0:
				obj = [x for x in tasks_obj if x["id"] == details[0]["task_id"]][0]

			tasks_obj[tasks_obj.index(obj)]["details"] = details

		return jsonify(tasks_obj)
	except SQLAlchemyError as err:
		print(err)
		return {
			"success":False	
		}

@app.route('/api/announcements/<int:user_id>')
def user_announcements(user_id):
	'''pass user id to return all announcements to specified personnel'''
	try:
		print("in announcements endpoint")
		personnel = User.query.get(user_id)
		if personnel is not None:
			announcements = personnel.announcements
			return jsonify({
				"success":True,
				"data":Announcement.serialize_list(announcements)
			})
		return { "success":False}
	except SQLAlchemyError as err:
		print(err)
		db.session.rollback()
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

@app.route('/api/enrol/user/task/<int:task_detail_id>/<int:personnel_id>')
def enrol_user_task_detail(task_detail_id, personnel_id):
	'''Passes task id and personnel id to enrol personnel to a task '''
	try:
		personnel=User.query.get_or_404(personnel_id)
		task_detail	 = Task_Detail.query.get_or_404(task_detail_id)
		task_detail.personnel.append(personnel)
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


@app.route('/api/task/edit/<int:task_id>', methods=['POST'])
def edit_task(task_id):
	'''edits the task of the specified id'''
	data = request.get_json()
	try:
		task = Task.query.get_or_404(task_id)
		task.title = data["title"]
		task.description = data["description"]
		recent_task_detail = db.session.query(Task_Detail).filter(Task_Detail.task_id==task.id).order_by(Task_Detail.date_updated.desc()).first()
		recent_task_detail.target = data["target"]
		recent_task_detail.target_date = data["date"]
		recent_task_detail.comment = data["comment"] if "comment" in data else None
		recent_task_detail.achieved = data["achieved"] if "achieved" in data else None
		recent_task_detail.entry_type = data["entry_type"]
		recent_task_detail.date_updated = datetime.now()
		db.session.commit()
		for personnel in task.personnel[:]:
			task.personnel.remove(personnel)
		db.session.commit()
		if data["personnel"] is not None:
			for personnel in data["personnel"]:
				db_pers = User.query.get(personnel["id"])
				if db_pers is None:
					#add personnel
					db_pers = User(
							id=personnel["id"],
							name=personnel["name"]
						)
					db.session.add(db_pers)
					db.session.commit()
				enrol_user_task(task.id, personnel["id"])
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
	'''update the task of the specified id'''
	data = request.get_json()
	try:
		task = Task.query.get_or_404(task_id)
		task.title = data["title"]
		task.description = data["description"]

		#get the recent task detail
		recent_task_detail = db.session.query(Task_Detail).filter(Task_Detail.task_id==task.id).order_by(Task_Detail.date_updated.desc()).first()
		recent_update_interval = datetime.now() - recent_task_detail.date_updated
		#only update recently executed task details not older than 24 hours
		if data["entry_type"]==2 and (recent_update_interval.total_seconds() < 86400):
			#update corresponding task_detail
			print("in here")
			recent_task_detail.target = data["target"]
			recent_task_detail.target_date = data["date"]
			recent_task_detail.comment = data["comment"] if "comment" in data else None
			recent_task_detail.achieved = data["achieved"] if "achieved" in data else None
			recent_task_detail.entry_type = data["entry_type"]
		elif data["entry_type"] in [2,3]:
			#execute task by passing task_detail, to create enrtry row in database
			task_detail = Task_Detail(
				target_date=data["date"],
				entry_type=data["entry_type"],
				achieved=data["achieved"] if data["entry_type"]==2 else None,
				target=data["target"],
				comment=data["comment"] if data["entry_type"]==2 else None,
				task=task
			)
			db.session.add(task_detail)
		db.session.commit()
		for personnel in task.personnel[:]:
			task.personnel.remove(personnel)
		db.session.commit()
		if data["personnel"] is not None:
			for personnel in data["personnel"]:
				db_pers = User.query.get(personnel["id"])
				if db_pers is None:
					#add personnel
					db_pers = User(
							id=personnel["id"],
							name=personnel["name"]
						)
					db.session.add(db_pers)
					db.session.commit()
				enrol_user_task(task.id, personnel["id"])
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

# @app.route('/api/task/reassign/<int:task_id>', methods=['POST'])
# def reassign_task(task_id):
# 	'''reassign task of the specified id'''
# 	data = request.get_json()
# 	try:
# 		task = Task.query.get_or_404(task_id)
# 		print(1)
# 		task.title = data["title"]
# 		task.description = data["description"]	
# 		task_detail = Task_Detail(
# 				target_date=data["date"],
# 				entry_type=data["entry_type"],
# 				# achieved=data["achieved"],
# 				target=data["target"],
# 				# comment=data["comment"],
# 				task=task
# 			)
# 		db.session.add(task_detail)
# 		db.session.commit()
# 		for personnel in task.personnel[:]:
# 			task.personnel.remove(personnel)
# 		db.session.commit()
# 		if data["personnel"] is not None:
# 			for personnel in data["personnel"]:
# 				db_pers = User.query.get(personnel["id"])
# 				if db_pers is None:
# 					#add personnel
# 					db_pers = User(
# 							id=personnel["id"],
# 							name=personnel["name"]
# 						)
# 					db.session.add(db_pers)
# 					db.session.commit()
# 				enrol_user_task(task.id, personnel["id"])
# 		db.session.commit()
# 		return {
# 			"success":True,
# 		} 
# 	except SQLAlchemyError as err:
# 		print(err)
# 		db.session.rollback()
# 		return {
# 			"success":False
# 		}	

@app.route('/api/project/task/<int:project_id>')
def proj_tasks(project_id):
	'''Get all tasks that project of id has assigned'''
	# try:
	# 	project = Project.query.get(project_id)
	# 	msg = "does not exist"
	# 	if project is not None:
	# 		tasks = project.tasks
	# 		if len(tasks) != 0:
	# 			return {
	# 				"success":True,
	# 				"data":Task.serialize_list(tasks)
	# 			}
	# 		msg = "has not yet been assigned tasks"
	# 	return {
	# 		"success":False,
	# 		"msg":"Project with ID: %d %s" % (project_id, msg)
	# 	}
	# except SQLAlchemyError as err:
	# 	print(err)
	# 	return{
	# 		"success":False
	# 	}
	try:
		project = Project.query.get(project_id)
		if project is not None:
			tasks = project.tasks
			# if len(tasks) != 0:
			# 	return {
			# 		"success":True,
			# 		"data":Task.serialize_list(tasks)
			# 	}


			tasks_obj = Task.serialize_list(tasks)
			# append task details
			for task in tasks:
				details = Task_Detail.serialize_list(db.session.query(Task_Detail).filter(Task_Detail.task_id==task.id).order_by(Task_Detail.date_updated.desc()).all())
				if len(details) !=0:
					obj = [x for x in tasks_obj if x["id"] == details[0]["task_id"]][0]

				tasks_obj[tasks_obj.index(obj)]["details"] = details

			return {
				"success":True,
				"data":tasks_obj
			}
		return {
			"success":False,
		}
	except SQLAlchemyError as err:
		print(err)
		return {
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
	print(data)
	return {
		"success" : True,
		"data" : data["data"]
	}

@app.route('/api/task/enrolments/<int:task_id>')
def task_users(task_id):
	'''Get all users that have been enrolled to a task'''
	data = []
	try:
		# task = get_tasks(task_detail)
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
			"success":Falses
		}

@app.route('/api/user/tasks/<int:user_id>')
def user_tasks(user_id):
	'''Get all tasks that user has been enrolled to'''
	data = []
	try:
		user = User.query.get(user_id)
		msg = "does not exist"
		if user is not None:
			task_details = user.task_details
			if len(task_details[:]) != 0:
				# for detail in task_details:
				# 	tasks.append(detail.task)
				# i=0
				# for task in tasks:
				# 		if tasks.index(task)!=i:
				# 				tasks.remove(task)
				# 		i+=1
				tasks = get_tasks(task_details)
				tasks_obj = Task.serialize_list(tasks)
				# append task details
				for task in tasks:
					details = Task_Detail.serialize_list(db.session.query(Task_Detail).filter(Task_Detail.task_id==task.id).order_by(Task_Detail.date_updated.desc()).all())
					if len(details) !=0:
						obj = [x for x in tasks_obj if x["id"] == details[0]["task_id"]][0]

					tasks_obj[tasks_obj.index(obj)]["details"] = details
				return jsonify({
					"data":tasks_obj, 
					"success": True
				})
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
@app.route('/api/user/projects_personnel/<int:user_id>')
def user_projects_personnel(user_id):
	'''receives user id and returns all personnel enrolled to user's Projects'''
	
	projects = netsuite_req({"request": "user-projects", "id": user_id})["data"]
	projs=[]
	for project in projects:
		proj = {}
		data = netsuite_req({"request": "personnel", "project_id": project["id"]})
		proj["project_id"] = project["id"]
		proj["project_name"] = str(project["number"])+" - "+project["name"]
		proj["personnel"] = data["data"]
		projs.append(proj)
	return (jsonify(projs))

@app.route('/api/project/verbose/<int:proj_id>')
def project_verbose(proj_id):
	'''Details of project tasks of specified id'''
	try:
		# plist = []
		# pnames = ""
		project = Project.query.get(proj_id)
		msg = "does not exist"
		if project is not None:
			tasks = project.tasks
			if len(tasks) == 0:
				print("project %id has no tasks" % (project.id))
			tasks_obj = Task.serialize_list(tasks)
			for task in tasks:
				# append personnel list
				personnel = ''
				task_users = User.serialize_list(task.personnel)
				for task_user in task_users:
					personnel += task_user['name']
					if not task_users[-1]==task_user:
						personnel+=", "
				# plist.append(personnel)
				# append task details
				details = Task_Detail.serialize_list(db.session.query(Task_Detail).filter(Task_Detail.task_id==task.id).order_by(Task_Detail.date_updated.desc()).all())
				if len(details) !=0:
					# find task object that mataches id of details
					obj = [x for x in tasks_obj if x["id"] == details[0]["task_id"]][0]
				# append details and personnel
				tasks_obj[tasks_obj.index(obj)]["details"] = details
				tasks_obj[tasks_obj.index(obj)]["personnel"] = personnel
			return {
				"success":True,
				"tasks_list":tasks_obj,
				# "personnel_list":plist
			}
		return {
			"msg":"project awaiting sync",
			"tasks_list":[],
			"personnel_list":[]
		}
	except SQLAlchemyError as err:
		# print(err)
		return{
		"success":False,
		"tasks_list":[],
		"personnel_list":[]
		}

@app.route('/api/task/verbose/<int:proj_id>')
def task_verbose(proj_id):
	'''Details of task of specified id'''
	try:
		# plist = []
		# pnames = ""
		task = task.query.get(proj_id)
		msg = "does not exist"
		if task is not None:
			tasks = task.tasks
			if len(tasks) == 0:
				print("task %id has no tasks" % (task.id))
			tasks_obj = Task.serialize_list(tasks)
			for task in tasks:
				# append personnel list
				personnel = ''
				task_users = User.serialize_list(task.personnel)
				for task_user in task_users:
					personnel += task_user['name']
					if not task_users[-1]==task_user:
						personnel+=", "
				# plist.append(personnel)
				# append task details
				details = Task_Detail.serialize_list(db.session.query(Task_Detail).filter(Task_Detail.task_id==task.id).order_by(Task_Detail.date_updated.desc()).all())
				if len(details) !=0:
					# find task object that mataches id of details
					obj = [x for x in tasks_obj if x["id"] == details[0]["task_id"]][0]
				# append details and personnel
				tasks_obj[tasks_obj.index(obj)]["details"] = details
				tasks_obj[tasks_obj.index(obj)]["personnel"] = personnel
			return {
				"success":True,
				"tasks_list":tasks_obj,
				# "personnel_list":plist
			}
		return {
			"msg":"task awaiting sync",
			"tasks_list":[],
			"personnel_list":[]
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
		print("date", data["date"])
		register = Register.query.filter_by(date=data["date"], project=project).all()
		if len(register) != 0:
			for personnel in register[:]:
				db.session.delete(personnel)
			db.session.commit()

		for personnel in data["body"]:
			print("time in", personnel["signIn"], "time out", personnel["signOut"])
			time_in = None if personnel["signIn"]==None else datetime.strptime(personnel["signIn"], "%H:%M").time()
			time_out =  None if personnel["signOut"]==None else datetime.strptime(personnel["signOut"], "%H:%M").time()

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

@app.route('/set')
def set():
    
    return 'ok'

@app.route('/get/')
def get():
    return session.get('key', 'not set')

@app.route('/api/authenticate', methods=['POST'])
def authenticate():
	'''login authentication'''
	data= request.get_json()
	res = netsuite_req({"request":"login", "email":data["username"], "password":data["password"]})["data"]
	if res["login_ok"]:
		#with unique username (email preferrably)
		session['netsuite_id'] = data["username"]
		return {
			"success":True,
			"data":res
		}
	return {
		"success":False,
	}

@app.route('/api/logout')
def logout():
	'''destroy session'''
	session.clear()
	return {
		"success":True
	}


@app.route('/api/check_loggedin')
def check_loggedin():
	if "netsuite_id" in session:
		print("the session id", session["netsuite_id"])
		return {"success": True}
	return {"success": False}
