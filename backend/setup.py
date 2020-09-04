'''
This script sets up the database...and that's all
'''
from flask import Flask,request,jsonify
from flask_migrate import Migrate, MigrateCommand
from flask_script import Manager
from flask import Flask,request
from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime


app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://jona:jona132435@35.225.121.217:5432/projectar'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #consumes lot of memory: set to fals

db=SQLAlchemy(app)

migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', MigrateCommand)

#An enrolment relation table
enrolment = db.Table('enrolment', 
			db.Column('id', db.Integer, primary_key=True),
			db.Column('personnel_id', db.Integer, db.ForeignKey('user.id')),
			db.Column('project_id', db.Integer, db.ForeignKey('project.id')),
			db.Column('task_id', db.Integer, db.ForeignKey('task.id')),
			db.Column('register_id',db.Integer, db.ForeignKey('register.id')),
			db.Column('date', db.DateTime, default=datetime.utcnow)
		)

#Model User Table
class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	first_name = db.Column(db.String(50), nullable=False)
	last_name=db.Column(db.String(50), nullable=False)
	email=db.Column(db.String(200), nullable=True)
	phone_number=db.Column(db.Integer, nullable=True)
	username=db.Column(db.String(100), nullable=True)
	password=db.Column(db.String(50), nullable=True)
	role=db.Column(db.String(50), nullable=True)

	projects = db.relationship('Project', secondary=enrolment, backref=db.backref('personnel', lazy='dynamic'))
	tasks = db.relationship('Task', secondary=enrolment, backref=db.backref('personnel', lazy='dynamic'))
	assessment = db.relationship('Assessment', secondary=enrolment, backref=db.backref('personnel', lazy='dynamic'))
	register = db.relationship('Register', secondary=enrolment, backref=db.backref('personnel', lazy='dynamic'))

	#date_created =  db.Column(db.DateTime, default=datetime.utcnow)	

	def __repr__(self): 
		return '<User %r>' % self.first_name	

#Model Project Table
class Project(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), unique=True, nullable=False)
	project_consultant=db.Column(db.String(100), nullable=False)
	project_manager=db.Column(db.String(100), nullable=False)
	team=db.Column(db.String(200), nullable=False)

	tasks=db.relationship('Task', backref='project', lazy=True)
	register=db.relationship('Register', backref='project', lazy=True)

	def __repr__(self): 
		return '<Project %r>' % self.name

#Model Task Table
class Task(db.Model):
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
class Register(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	date =  db.Column(db.DateTime)

	project_id=db.Column(db.Integer, db.ForeignKey('project.id'),nullable=False)

	def __repr__(self): 
		return '<Register %r>' % self.title

#Model Reassigned_Task Table
class Reassigned_Task(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	parent_id=db.Column(db.Integer, db.ForeignKey('task.id'), unique=True)

	def __repr__(self): 
		return '<Task %r>' % self.parent_id

if __name__ == '__main__':
    manager.run()