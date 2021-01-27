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
    created_at = Column(DateTime, nullable=False,
                        default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)

    programs = relationship('Program', back_populates='user',
                            cascade='all, delete, delete-orphan')
    user_settings = relationship(
        'UserSetting', back_populates='user', cascade='all, delete, delete-orphan')
    exercise_groups = relationship(
        'ExerciseGroup', back_populates='user', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return (f'<User(id={self.id}, email={self.email}, created_at={self.created_at}, '
                f'updated_at={self.updated_at}) >')


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
    created_at = Column(DateTime, nullable=False,
                        default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, nullable=True)

    user = relationship('User', back_populates='programs')
    workouts = relationship(
        'Workout', back_populates='program', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return f'<Program(id={self.id}, name={self.name}, user_id={self.user_id})>'


class Workout(Base):
    __tablename__ = 'workout'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    program_id = Column(Integer, ForeignKey('program.id'))
    created_at = Column(DateTime, nullable=False,
                        default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, nullable=True)

    program = relationship('Program', back_populates='workouts')
    exercises = relationship(
        'Exercise', back_populates='workout', cascade='all, delete, delete-orphan')
    workout_sessions = relationship(
        'WorkoutSession', back_populates='workout', cascade='all, delete, delete-orphan')

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
    quantity_type_id = Column(Integer, ForeignKey('quantity_type.id'))
    created_at = Column(DateTime, nullable=False,
                        default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, nullable=True)

    workout = relationship('Workout', back_populates='exercises')
    weight_type = relationship('WeightType', back_populates='exercises')
    quantity_type = relationship('QuantityType', back_populates='exercises')

    workout_sets = relationship(
        'WorkoutSet', back_populates='exercise', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return (f'<Exercise(id={self.id}, name={self.name}, workout_id={self.workout_id}, '
                f'weight_type_id={self.weight_type_id})>')


class Superset(Base):
    __tablename__ = 'superset'

    id = Column(Integer, primary_key=True)
    exercise1_id = Column(Integer, ForeignKey('exercise.id'))
    exercise2_id = Column(Integer, ForeignKey('exercise.id'))
    created_at = Column(DateTime, nullable=False,
                        default=datetime.datetime.utcnow)

    exercise1 = relationship(
        'Exercise', foreign_keys=[exercise1_id])
    exercise2 = relationship('Exercise', foreign_keys=[exercise2_id])

    def __repr__(self):
        return f'<Superset(id={self.id}, exercise1_id={self.exercise1_id}, exercise2_id={self.exercise2_id})>'


class WorkoutSet(Base):
    __tablename__ = 'workout_set'

    id = Column(Integer, primary_key=True)
    exercise_id = Column(Integer, ForeignKey('exercise.id'))
    mass_unit_id = Column(Integer, ForeignKey('mass_unit.id'), nullable=True)
    set_order_index = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    weight = Column(Numeric(4, 4), nullable=True)
    is_amrap = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False,
                        default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, nullable=True)

    exercise = relationship('Exercise', back_populates='workout_sets')
    set_logs = relationship(
        'SetLog', back_populates='workout_set', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return (f'<WorkoutSet(id={self.id}, order_index={self.order_index}, repititions={self.repititions}, '
                f'weight={self.weight}, mass_unit_id={self.mass_unit_id}, max_weight_ratio={self.max_weight_ratio}, '
                f'exercise_id={self.exercise_id}, is_amrap={self.is_amrap})>')


class WorkoutSession(Base):
    __tablename__ = 'workout_session'

    id = Column(Integer, primary_key=True)
    workout_id = Column(Integer, ForeignKey('workout.id'))
    created_at = Column(DateTime, nullable=False,
                        default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    workout = relationship('Workout', back_populates='workout_sessions')

    set_logs = relationship(
        'SetLog', back_populates='workout_session', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return (f'<WorkoutSession(id={self.id}, workout_id={self.workout_id}, '
                f'start_time={self.start_time}, end_time={self.end_time})>')


class SetLog(Base):
    __tablename__ = 'set_log'

    id = Column(Integer, primary_key=True)
    workout_session_id = Column(Integer, ForeignKey('workout_session.id'))
    workout_set_id = Column(Integer, ForeignKey('workout_set.id'))
    mass_unit_id = Column(Integer, ForeignKey('mass_unit.id'), nullable=True)
    quantity = Column(Integer, nullable=False)
    weight = Column(Numeric(4, 4), nullable=True)
    created_at = Column(DateTime, nullable=False,
                        default=datetime.datetime.utcnow)

    workout_set = relationship('WorkoutSet', back_populates='set_logs')
    workout_session = relationship('WorkoutSession', back_populates='set_logs')
    mass_unit = relationship('MassUnit', back_populates='set_logs')

    def __repr__(self):
        return (f'<SetLog(id={self.id}, workout_session_id={self.workout_session_id}, '
                f'workout_set_id={self.workout_set_id}, repititions={self.repititions}, '
                f'weight={self.weight}, mass_unit_id={self.mass_unit_id})>')


class MassUnit(Base):
    __tablename__ = 'mass_unit'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)
    symbol = Column(String, nullable=False)
    ratio_to_kg = Column(Numeric(10, 6), nullable=False)

    set_logs = relationship('SetLog', back_populates='mass_unit')

    def __repr__(self):
        return (f'<MassUnit(id={self.id}, description={self.description}, '
                f'symbol={self.symbol})>')


class WeightType(Base):
    __tablename__ = 'weight_type'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)

    exercises = relationship(
        'Exercise', back_populates='weight_type', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return f'<WeightType(id={self.id}, description={self.description})>'


class QuantityType(Base):
    __tablename__ = 'quantity_type'

    id = Column(Integer, primary_key=True)
    description = Column(String, nullable=False)

    exercises = relationship(
        'Exercise', back_populates='quantity_type', cascade='all, delete, delete-orphan')

    def __repr__(self):
        return f'<QuantityType(id={self.id}, description={self.description})>'


class ExerciseGroup(Base):
    __tablename__ = 'exercise_group'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('user.id'), nullable=True)
    description = Column(String, nullable=False)
    created_at = Column(
        DateTime, nullable=False, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, nullable=True)
    deleted_at = Column(DateTime, nullable=True)

    user = relationship('User', back_populates='exercise_groups')

    def __repr__(self):
        return (f'<ExerciseGroup(id={self.id}, description={self.description}, '
                f'user_id={self.user_id}, created_at={self.created_at}, '
                f'updated_at={self.updated_at}, deleted_at={self.deleted_at}) >')
