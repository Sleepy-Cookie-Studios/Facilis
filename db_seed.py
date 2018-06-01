from db_setup import *
from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy import create_engine


engine = create_engine('sqlite:///pax.db')

Base.metadata.bind = engine
DBSession = sessionmaker(bind = engine)
session = DBSession()

if __name__ == '__main__':
    session.query(Participant).delete()
     
    pax = Participant()
    pax.surname = "Horse"
    pax.name = "Riding"
    pax.status = 1 # newbie
    session.add(pax)
    pax = Participant()
    pax.name = "Rat"
    pax.surname = "Rat"
    pax.status = 2 # baby
    session.add(pax)

    session.commit()