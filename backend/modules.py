import requests

def fetch(data, logfile):
	'''fetches data of all objects in the list and passes to logfile''' 	
	for item in data:
		obj = {}	
		log(item, obj)	
		logfile.append(obj)

def log(data, logfile):
	'''Extracts data of queried object'''
	for field, value in data.__dict__.items(): 
		if not field[0].startswith('_'): 
			logfile[field] = value

def netsuite_req(pload):
	'''NetSuite integration request'''
	try:
		headers = {"Authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHAiOiJwcm9qZWN0YXIiLCJleHBpcnkiOjE4OTM0NTYwMDAsInNjb3BlIjoidGFnZyJ9.E6lIboiszt-AQuvCI8HWF7XxEUM7sQV8ZD_1MODUY4Q"}
		r = requests.post("https://tagg.automationghana.com/projectar", headers=headers, json=pload)
		return r.json()
	except requests.ConnectionError as err:
		print(err)
		return {
			"success":False	
		}

def get_tasks(task_details):
	tasks = []
	if len(task_details[:]) != 0:
				for detail in task_details:
					tasks.append(detail.task)
				i=0
				for task in tasks:
						if tasks.index(task)!=i:
								tasks.remove(task)
						i+=1
	return tasks

def get_task_personnel(task_details):
	tasks = []
	if len(task_details[:]) != 0:
				for detail in task_details:
					tasks.append(detail.task)
				i=0
				for task in tasks:
						if tasks.index(task)!=i:
								tasks.remove(task)
						i+=1
	return tasks