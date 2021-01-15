from workouttracker.models import (
    create_database,
    User, Program, Workout, Exercise, WorkoutSet, MassUnit, WeightType,
    UserSetting, WorkoutSession, SetLog
)
from workouttracker.database import session_scope
from functools import wraps


with session_scope() as session:
    result = session.query(Program).all()

    print(result)