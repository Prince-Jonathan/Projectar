'''
This script sets up the database...and that's all
'''
from flask import Flask,request,jsonify
from flask import Flask,request
from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime


app=Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI']='postgresql://postgres:postgres@localhost:5432/projectar'
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
	name = db.Column(db.String(80),unique=True,nullable=False)
	client=db.Column(db.String(80),nullable=False)
	lon=db.Column(db.Float,nullable=True)
	lat=db.Column(db.Float,nullable=True)

	#date_created =  db.Column(db.DateTime, default=datetime.utcnow)	

	def __repr__(self): 
		return '<Project %r>' % self.name


