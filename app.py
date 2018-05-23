from db_setup import *
from flask import Flask, request, render_template, jsonify, redirect, url_for, flash
from flask import session as login_session
from flask_uploads import UploadSet, configure_uploads, IMAGES
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine, exc

import os
import random
import string

engine = create_engine('sqlite:///pax.db')

Base.metadata.bind = engine
DBSession = sessionmaker(bind = engine)
session = DBSession()

app = Flask(__name__)

photos = UploadSet('photos', IMAGES)

app.config['UPLOADED_PHOTOS_DEST'] = 'static/images'
configure_uploads(app, photos)

@app.route('/')
def participants():
	pax = session.query(Participant).all()
	ac = list()
	if 'pax' in login_session:
		ac = login_session['pax']
	return render_template('Participants/index.html', list=pax, active=ac)

@app.route('/pax/delete/<pax>')
def deleteParticipant(pax):
	session.query(Participant).filter_by(id=pax).delete()
	session.commit()
	return redirect(url_for('participants'))

@app.route('/pax/new')
def newParticipant():
	return render_template('Participants/form.html')

@app.route('/pax/create', methods=['POST'])
def createParticipant():
	pax = Participant()
	name = format(request.form['name'])
	status = format(request.form['status'])
	if name!="":
		pax.name=name
	if status!="":
		pax.status=status
	try:
		session.add(pax)
		session.commit()
		photos.save(request.files['photo'],name = name+".jpg")
		return redirect(url_for('participants'))
	except exc.IntegrityError:
		session.rollback()
		return render_template('Participants/form.html', error=str(sys.exc_info()[1]).split(") ")[1].split(" [")[0])

@app.route('/sess/')
@app.route('/sess/<lista>')
def createSession(lista=None):
	# if 'pax' in login_session:
	# 	del login_session['pax']
	if lista == None:
		lista = list()
	else:
		lista = lista.split(",")
	if 'pax' in login_session:
		print lista
		print login_session['pax']
		lista += [x for x in login_session['pax'] if -x not in map(int,lista)]
		print lista


	if lista == [None]:
		flash("No participants selected")
		return redirect(url_for('participants'))
	else:
		ls = session.query(Participant).filter(Participant.id.in_(lista)).all()
		login_session['pax']=list()
		for i in ls:
			login_session['pax'].append(i.id)
		return render_template('Sessions/index.html', list=ls)

if __name__ == '__main__':
	app.secret_key = 'super_secret_key'
	app.debug = True
	app.run(host = '0.0.0.0',port=5000)