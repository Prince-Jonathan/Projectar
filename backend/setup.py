'''
This script sets up the database...and that's all
'''
from flask import Flask,request,jsonify
from flask import Flask,request
from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime


app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://jona:jona132435@35.225.121.217:5432/projectar'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #consumes lot of memory: set to fals

db=SQLAlchemy(app)

#An enrolment relation table
enrolment = db.Table('enrolment', 
			db.Column('id', db.Integer, primary_key=True),
			db.Column('pm_id', db.Integer, db.ForeignKey('user.id')),
			db.Column('project_id', db.Integer, db.ForeignKey('project.id')),
			db.Column('date', db.DateTime, default=datetime.utcnow)
		)

#Model User Table
class User(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	first_name = db.Column(db.String(50), nullable=False)
	last_name=db.Column(db.String(50), nullable=False)
	username=db.Column(db.String(100), unique=True, nullable=False)
	pin=db.Column(db.Integer, nullable=False)
	status=db.Column(db.String(50), nullable=False)

	projects = db.relationship('Project', secondary=enrolment, backref=db.backref('users', lazy='dynamic'))

	#date_created =  db.Column(db.DateTime, default=datetime.utcnow)	

	def __repr__(self): 
		return '<User %r>' % self.username	

#Model Project Table
class Project(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	name = db.Column(db.String(100), unique=True, nullable=False)
	project_consultant=db.Column(db.String(100), nullable=False)
	project_manager=db.Column(db.String(100), nullable=False)
	team=db.Column(db.String(200), nullable=False)
	tasks=db.relationship('Task', backref='project', lazy=True)

	#date_created =  db.Column(db.DateTime, default=datetime.utcnow)	

	def __repr__(self): 
		return '<Project %r>' % self.name

#Model Task Table
class Task(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	title = db.Column(db.String(100), unique=True, nullable=False)
	description=db.Column(db.String(100), nullable=False)
	target=db.Column(db.String(100), nullable=False)
	date =  db.Column(db.DateTime)
	project_id=db.Column(db.Integer, db.ForeignKey('project.id'),nullable=False)

	#date_created =  db.Column(db.DateTime, default=datetime.utcnow)	

	def __repr__(self): 
		return '<Task %r>' % self.name


