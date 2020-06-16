'''
This script is a model of the SQLite Database
'''
from datetime import datetime 
from app import DB as db, Serializer


#An enrolment relation table
ENROLMENT = db.Table('enrolment', 
			db.Column('id', db.Integer, primary_key=True),
			db.Column('pm_id', db.Integer, db.ForeignKey('user.id')),
			db.Column('project_id', db.Integer, db.ForeignKey('project.id')),
			db.Column('date', db.DateTime, default=datetime.utcnow)
		)

class User(db.Model, Serializer):
	'''Model User Table'''
	id = db.Column(db.Integer, primary_key=True)
	first_name = db.Column(db.String(50), nullable=False)
	last_name = db.Column(db.String(50), nullable=False)
	username = db.Column(db.String(100), unique=True, nullable=False)
	pin = db.Column(db.Integer, nullable=False)
<<<<<<< HEAD
	# status = db.Column(db.String(50), nullable=False)
=======
	status = db.Column(db.String(50), nullable=False)
>>>>>>> 0cb6ac0d951036b83077a2770644b0e863f5a04f

	projects = db.relationship('Project', 
				secondary=ENROLMENT,
				backref=db.backref('users', lazy='dynamic')
			)

	def __repr__(self): 
		return '<User %r>' % self.username	


class Project(db.Model, Serializer):
	'''Model Project Table'''
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(80), unique=True, nullable=False)
	client = db.Column(db.String(80), nullable=False)
	lon = db.Column(db.Float, nullable=True)
	lat = db.Column(db.Float, nullable=True)

	#date_created =  db.Column(db.DateTime, default=datetime.utcnow)	

	def __repr__(self): 
		return '<Project %r>' % self.name
		