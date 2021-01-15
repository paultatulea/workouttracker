from sqlalchemy import (
    Column, Integer, String, DateTime, Boolean,
    Numeric, Text,
    ForeignKey
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

import workouttracker.database as database

import datetime


Base = declarative_base(database.__engine)

def create_database():
    Base.metadata.create_all()


class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    updated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    programs = relationship('Program', back_populates='user', cascade='all, delete, delete-orphan')
    user_settings = relationship('UserSetting', back_populates='user', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return f'<User(id={self.id}, email={self.email})>'


class UserSetting(Base):
    __tablename__ = 'user_setting'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    settings = Column(Text, nullable=False)

    user = relationship('User', back_populates='user_settings')

    def __repr__(self):
        return f'<UserSetting(id={self.id}, user_id={self.user_id}, settings={self.settings}>'


class Program(Base):
    __tablename__ = 'program'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))
    updated_at  = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    user = relationship('User', back_populates='programs')
    workouts = relationship('Workout', back_populates='program', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return f'<Program(id={self.id}, name={self.name}, user_id={self.user_id})>'


class Workout(Base):
    __tablename__ = 'workout'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    program_id = Column(Integer, ForeignKey('program.id'))
    updated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    program = relationship('Program', back_populates='workouts')
    exercises = relationship('Exercise', back_populates='workout', cascade='all, delete, delete-orphan')
    workout_sessions = relationship('WorkoutSession', back_populates='workout', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return f'<Workout(id={self.id}, name={self.name}, program_id={self.program_id})>'


class Exercise(Base):
    __tablename__ = 'exercise'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    rest_lowerbound = Column(Integer, nullable=True)
    rest_upperbound = Column(Integer, nullable=False)
    workout_id = Column(Integer, ForeignKey('workout.id'))
    weight_type_id = Column(Integer, ForeignKey('weight_type.id'))
    updated_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    workout = relationship('Workout', back_populates='exercises')
    workout_sets = relationship('WorkoutSet', back_populates='exercise', cascade='all, delete, delete-orphan')
    weight_type = relationship('WeightType', back_populates='exercises')

    def __repr__(self):
        return f'<Exercise(id={self.id}, name={self.name}, workout_id={self.workout_id}, ' \
            f'weight_type_id={self.weight_type_id})>'


class WorkoutSet(Base):
    __tablename__ = 'workout_set'

    id = Column(Integer, primary_key=True)
    order_index = Column(Integer, nullable=False)
    repititions = Column(Integer, nullable=False)
    weight = Column(Numeric(4, 4), nullable=True)
    mass_unit_id = Column(Integer, ForeignKey('mass_unit.id'), nullable=True)
    is_amrap = Column(Boolean, nullable=False, default=False)
    exercise_id = Column(Integer, ForeignKey('exercise.id'))
    created_at = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)

    exercise = relationship('Exercise', back_populates='workout_sets')
    set_logs = relationship('SetLog', back_populates='workout_set', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return f'<WorkoutSet(id={self.id}, order_index={self.order_index}, repititions={self.repititions}, ' \
            f'weight={self.weight}, mass_unit_id={self.mass_unit_id}, max_weight_ratio={self.max_weight_ratio}, ' \
            f'exercise_id={self.exercise_id}, is_amrap={self.is_amrap})>'


class WorkoutSession(Base):
    __tablename__ = 'workout_session'

    id = Column(Integer, primary_key=True)
    workout_id = Column(Integer, ForeignKey('workout.id'))
    start_time = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)

    workout = relationship('Workout', back_populates='workout_sessions')
    set_logs = relationship('SetLog', back_populates='workout_session', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return f'<WorkoutSession(id={self.id}, workout_id={self.workout_id}, ' \
            f'start_time={self.start_time}, end_time={self.end_time})>'


class SetLog(Base):
    __tablename__ = 'set_log'

    id = Column(Integer, primary_key=True)
    workout_session_id = Column(Integer, ForeignKey('workout_session.id'))
    workout_set_id = Column(Integer, ForeignKey('workout_set.id'))
    repititions = Column(Integer, nullable=False)
    weight = Column(Numeric(4, 4), nullable=True)
    mass_unit_id = Column(Integer, ForeignKey('mass_unit.id'), nullable=True)

    workout_set = relationship('WorkoutSet', back_populates='set_logs')
    workout_session = relationship('WorkoutSession', back_populates='set_logs')

    def __repr__(self):
        return f'<SetLog(id={self.id}, workout_session_id={self.workout_session_id}, ' \
            f'workout_set_id={self.workout_set_id}, repititions={self.repititions}, ' \
            f'weight={self.weight}, mass_unit_id={self.mass_unit_id})>'


class MassUnit(Base):
    __tablename__ = 'mass_unit'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    symbol = Column(String, nullable=False)
    ratio_to_kg = Column(Numeric(10,6), nullable=False)

    def __repr__(self):
        return f'<MassUnit(id={self.id}, description={self.description}, ' \
            f'symbol={self.symbol})>'


class WeightType(Base):
    __tablename__ = 'weight_type'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)

    exercises = relationship('Exercise', back_populates='weight_type', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return f'<WeightType(id={self.id}, description={self.description})>'