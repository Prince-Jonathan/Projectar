

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
			