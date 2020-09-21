'''
This script is a model of the SQLite Database
'''
from datetime import datetime 
from app import DB as db, Serializer


#An enrolment relation table
enrolment = db.Table('enrolment', 
			db.Column('id', db.Integer, primary_key=True),
			db.Column('personnel_id', db.Integer, db.ForeignKey('user.id')),
			db.Column('project_id', db.Integer, db.ForeignKey('project.id')),
			db.Column('task_id', db.Integer, db.ForeignKey('task.id')),
			db.Column('date', db.DateTime, default=datetime.utcnow)
		)

#Model User Table
class User(db.Model, Serializer):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), nullable=False)
	# email=db.Column(db.String(200), nullable=True)
	# role=db.Column(db.String(50), nullable=True)
	# role_id=db.Column(db.Integer, nullable=True)

	projects = db.relationship('Project', secondary=enrolment, backref=db.backref('personnel', lazy='dynamic'))
	tasks = db.relationship('Task', secondary=enrolment, backref=db.backref('personnel', lazy='dynamic'))

	#date_created =  db.Column(db.DateTime, default=datetime.utcnow)	

	def __repr__(self): 
		return '<User %r>' % self.name	

#Model Project Table
class Project(db.Model, Serializer):
	id = db.Column(db.Integer, primary_key=True)
	# name = db.Column(db.String(200), nullable=False)
	# consultant = db.Column(db.String(100), nullable=False)
	# consultant_id = db.Column(db.Integer, nullable=False)
	# manager = db.Column(db.String(100), nullable=False)
	# manager_id = db.Column(db.Integer, nullable=False)
	# team = db.Column(db.String(200), nullable=True)
	# customer = db.Column(db.String(200), nullable=False)
	# start_date = db.Column(db.String(10), nullable=False)
	# end_date = db.Column(db.String(10), nullable=False)
	# number = db.Column(db.Integer, nullable=True)
	# progress_percentage = db.Column(db.String(8), nullable=True)
	# revised_end_date = db.Column(db.String(10), nullable=True)
	# status = db.Column(db.String(100), nullable=True)
	# actual_end_date = db.Column(db.String(10), nullable=True)

	tasks = db.relationship('Task', backref='project', lazy=True)
	registers = db.relationship('Register', backref='project', lazy=True)

	def __repr__(self): 
		return '<Project %r>' % self.name

#Model Task Table
class Task(db.Model, Serializer):
	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(100), nullable=False)
	description=db.Column(db.String(500), nullable=False)
	target=db.Column(db.String(5), nullable=False)
	achieved=db.Column(db.String(5), nullable=True)
	comment=db.Column(db.String(2000),nullable=True)
	date =  db.Column(db.DateTime)
	project_id=db.Column(db.Integer, db.ForeignKey('project.id'),nullable=False)
	child_task=db.relationship('Reassigned_Task', backref='parent_task', uselist=False)

	def __repr__(self): 
		return '<Task %r>' % self.title

#Model Register Table
class Register(db.Model, Serializer):
	id = db.Column(db.Integer, primary_key=True)
	date =  db.Column(db.DateTime)
	is_present = db.Column(db.Boolean)
	time_in = db.Column(db.String(10))
	time_out = db.Column(db.String(10))
	lunch = db.Column(db.Boolean)
	t_and_t= db.Column(db.Float)
	personnel_id = db.Column(db.Integer)
	personnel_name=db.Column(db.String(100))
	
	project_id=db.Column(db.Integer, db.ForeignKey('project.id'),nullable=False)

	def __repr__(self): 
		return '<Register %r>' % self.title

#Model Reassigned_Task Table
class Reassigned_Task(db.Model, Serializer):
	id = db.Column(db.Integer, primary_key=True)
	parent_id=db.Column(db.Integer, db.ForeignKey('task.id'), unique=True)

	def __repr__(self): 
		return '<Reassigned_Task %r>' % self.parent_id
		