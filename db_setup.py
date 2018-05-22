# Standard Configuration for SQLAlchemy 
import sys
import os

from sqlalchemy import Column, ForeignKey, Integer, String, Table, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import create_engine

Base = declarative_base()

# End of Standard Configuration

class Participant(Base):
    __tablename__ = 'particpant'

    id = Column(Integer, primary_key = True)
    name = Column(String(25), nullable = False, unique= True)
    status = Column(Integer, nullable = False)

engine = create_engine('sqlite:///pax.db')

Base.metadata.create_all(engine)
