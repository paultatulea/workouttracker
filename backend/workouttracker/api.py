from flask import request, jsonify
import jwt

from workouttracker import app
from workouttracker.models import (
    User, Program, Workout, Exercise, WorkoutSet,
    UserSetting, WorkoutSession, SetLog
)
from workouttracker.database import session_scope
from workouttracker.preferences import verify_settings_integrity, default_settings_json_string

import datetime
import json
from functools import wraps


# User related endpoints
# --------------------------------------------------
@app.route('/api/v1/users', methods=['GET'])
def fetch_users():
    with session_scope() as session:
        result = session.query(User).all()
        users = [{
            'id': user.id, 
            'email': user.email,
            'created_at': user.created_at,
            'updated_at': user.updated_at,
            } 
            for user in result]
    return {'resultSet': users}


@app.route('/api/v1/users', methods=['POST'])
def create_user():
    email = request.json['email']
    password = request.json['password']
    user = User(email=email, password=password)
    with session_scope() as session:
        session.add(user)
        session.flush()
        insert_default_settings(user.id, session)
    return {'message': 'User successfully created'}, 201


def insert_default_settings(user_id, session):
    user_setting = UserSetting(user_id=user_id, settings=default_settings_json_string)
    session.add(user_setting)


@app.route('/api/v1/users/<user_id>', methods=['GET'])
def fetch_user_by_id(user_id):
    with session_scope() as session:
        result = session.query(User).filter_by(id=user_id).one()
        user = {'id': result.id, 'email': result.email}
    return {'resultSet': [user]}


@app.route('/api/v1/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    with session_scope() as session:
        session.query(User).filter_by(id=user_id).update({
            'email': request.json['email'],
            'password': request.json['password'],
            'updated_at': datetime.datetime.utcnow()
        })
    return {'message': 'User successfully updated'}


@app.route('/api/v1/users/<user_id>', methods=['DELETE'])
def delete_user_by_id(user_id):
    with session_scope() as session:
        user = session.query(User).filter_by(id=user_id).one()
        session.delete(user)
    return {'message': 'User successfully deleted'}

# Authentication
# --------------------------------------------------

@app.route('/api/v1/login', methods=['POST'])
def authenticate_user():
    email = request.json['email']
    password = request.json['password']
    with session_scope() as session:
        user = session.query(User).filter(User.email.like(email)).first()
        # Check if email does not exist or password does not match
        if user is None or password != user.password:
            return {'message': 'Incorrect email or password'}, 400
        token = encode_auth_token(user.id)
        user_data = build_user_data(user.id)
        return {
            'token': token,
            'user': user_data
        }


def build_user_data(user_id):
    with session_scope() as session:
        user = session.query(User).filter_by(id=user_id).first()
        user_settings = session.query(UserSetting).filter_by(user_id=user_id).first()
        return {
            'id': user.id,
            'email': user.email,
            'settings': json.loads(user_settings.settings)
        }


def auth_token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if auth_header is None:
            return {'message': 'A token is required'}
        # Authorization header should be in the form 'Bearer {token}'
        token = auth_header.split()[-1]
        try:
            user_id = decode_auth_token(token)
        except Exception:
            return {'message': 'Token is invalid'}
        with session_scope() as session:
            current_user = session.query(User).filter_by(id=user_id).first()
            session.expunge(current_user)
        return f(current_user, *args, **kwargs)
    return decorator


def encode_auth_token(user_id):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    token = jwt.encode(payload, app.config['AUTH_SECRET_KEY'])
    return token


def decode_auth_token(token):
    payload = jwt.decode(token, app.config['AUTH_SECRET_KEY'], algorithms=['HS256'])
    # Handle decoding errors
    # except jwt.ExpiredSignatureError:
        # pass
    # except jwt.InvalidTokenError:
        # pass
    # Return subject of payload if no decoding errors
    return payload['sub']


@app.route('/api/v1/validateAuthToken', methods=['POST'])
def validate_auth_token():
    auth_header = request.headers.get('Authorization')
    if auth_header is None:
        return {'result': 'failure', 'message': 'Token required'}, 400
    # Authorization header in the form 'Bearer {token}'
    token = auth_header.split()[-1]
    try:
        user_id = decode_auth_token(token)
    except Exception:
        return {'result': 'failure', 'message': 'Could not validate token'}, 400
    user_data = build_user_data(user_id)
    return {'result': 'success', 'userData': user_data}

# User settings related endpoints
# --------------------------------------------------
@app.route('/api/v1/usersettings', methods=['GET'])
def fetch_user_settings_by_user_id():
    user_id = request.args.get('user_id', type=int)
    with session_scope() as session:
        result = session.query(UserSetting).filter_by(user_id=user_id).one()
        settings = json.loads(result.settings)
        user_setting = {'id': result.id, 'user_id': result.user_id, 'settings': settings}
    return {'resultSet': [user_setting]}


@app.route('/api/v1/usersettings', methods=['PUT'])
def update_user_settings():
    user_id = request.args.get('user_id', type=int)
    updated_settings = request.json['settings']
    if not verify_settings_integrity(updated_settings):
        return {'error': 'Integrity of settings did not pass validation'}, 400
    # Serialize settings JSON/dict object to string if required
    if isinstance(updated_settings, dict):
        updated_settings = json.dumps(updated_settings)
    with session_scope() as session:
        session.query(UserSetting).filter_by(user_id=user_id).update({
            'settings': updated_settings
        })
    return {'message': 'User settings successfully updated'}



# Program related endpoints
# --------------------------------------------------

@app.route('/api/v1/programs', methods=['GET'])
@auth_token_required
def fetch_programs(current_user):
    with session_scope() as session:
        result = (session.query(Program)
            .filter_by(user_id=current_user.id)
            .order_by(Program.created_at.desc())
            .all()
            )
        programs = [{
            'id': program.id,
            'name': program.name,
            'createdAt': program.created_at,
            'updatedAt': program.updated_at,
        } for program in result]
    return {'resultSet': programs}


@app.route('/api/v1/programs', methods=['POST'])
def create_program():
    user_id = request.args.get('user_id', type=int)
    name = request.json['name']
    program = Program(name=name, user_id=user_id)
    with session_scope() as session:
        session.add(program)
    return {'message': 'Program successfully created'}, 201


@app.route('/api/v1/programs/<program_id>', methods=['GET'])
@auth_token_required
def fetch_program_by_id(current_user, program_id):
    with session_scope() as session:
        result = session.query(Program).filter_by(id=program_id).first()
        program = {
            'id': result.id,
            'name': result.name,
            'userId': result.user_id,
            'createdAt': result.created_at,
            'updatedAt': result.updated_at,
            'workouts': result.workouts
        }
        # print(program['workouts'])
    return {'resultSet': [program]}


@app.route('/api/v1/programs/<program_id>', methods=['PUT'])
def update_program(program_id):
    with session_scope() as session:
        session.query(Program).filter_by(id=program_id).update({
            'name': request.json['name'],
            'updated_at': datetime.datetime.utcnow()
        })
    return {'message': 'Program successfully updated'}


@app.route('/api/v1/programs/<program_id>', methods=['DELETE'])
def delete_program_by_id(program_id):
    with session_scope() as session:
        program = session.query(Program).filter_by(id=program_id).one()
        session.delete(program)
    return {'message': 'Program successfully deleted'}


@app.route('/api/v1/programs/buildprogram', methods=['POST'])
@auth_token_required
def save_program(current_user):
    program_data = request.json['programData']
    weight_type_map = {
        'Weight': 1,
        'Percentage': 2
    }
    print(program_data)
    with session_scope() as session:
        program = Program(name=program_data['name'], user_id=current_user.id)
        session.add(program)
        session.flush()

        for workout_data in program_data['workouts']:
            workout = Workout(name=workout_data['name'], program_id=program.id)
            session.add(workout)
            session.flush()

            for exercise_data in workout_data['exercises']:
                exercise = Exercise(
                    name=exercise_data['name'],
                    rest_lowerbound=exercise_data['restLowerbound'],
                    rest_upperbound=exercise_data['restUpperbound'],
                    workout_id=workout.id,
                    weight_type_id=weight_type_map[exercise_data['weightType']]
                )
                session.add(exercise)
                session.flush()

                for idx, workout_set_data in enumerate(exercise_data['workoutSets'], 1):
                    workout_set = WorkoutSet(
                        order_index=idx,
                        repititions=workout_set_data['repititions'],
                        weight=workout_set_data['weight'],
                        is_amrap=workout_set_data['isAmrap'],
                        exercise_id=exercise.id,
                        mass_unit_id=1  # TODO dynamically set
                    )
                    session.add(workout_set)
    return {'message': 'Program successfully saved'}, 201


# Workout related endpoints
# --------------------------------------------------

@app.route('/api/v1/workouts', methods=['GET'])
def fetch_workouts():
    program_id = request.args.get('program_id', type=int)
    with session_scope() as session:
        if program_id is None:
            result = session.query(Workout).all()
        else:
            result = session.query(Workout).filter_by(program_id=program_id).all()
        workouts = [{
            'id': workout.id,
            'name': workout.name,
            'program_id': workout.program_id,
            'created_at': workout.created_at,
            'updated_at': workout.updated_at,
        } for workout in result]
    return {'resultSet': workouts}


@app.route('/api/v1/workouts', methods=['POST'])
def create_workout():
    program_id = request.args.get('program_id', type=int)
    name = request.json['name']
    workout = Workout(name=name, program_id=program_id)
    with session_scope() as session:
        session.add(workout)
    return {'message': 'Workout successfully created'}, 201


@app.route('/api/v1/workouts/<workout_id>', methods=['GET'])
def fetch_workout_by_id(workout_id):
    with session_scope() as session:
        result = session.query(Workout).filter_by(id=workout_id).one()
        workout = {
            'id': result.id,
            'name': result.name,
            'program_id': result.program_id,
            'created_at': result.created_at,
            'updated_at': result.updated_at,
        }
    return {'resultSet': [workout]}


@app.route('/api/v1/workouts/<workout_id>', methods=['PUT'])
def update_workout(workout_id):
    with session_scope() as session:
        session.query(Workout).filter_by(id=workout_id).update({
            'name': request.json['name'],
            'updated_at': datetime.datetime.utcnow()
        })
    return {'message': 'Workout successfully updated'}


@app.route('/api/v1/workouts/<workout_id>', methods=['DELETE'])
def delete_workout_by_id(workout_id):
    with session_scope() as session:
        workout = session.query(Workout).filter_by(id=workout_id).one()
        session.delete(workout)
    return {'message': 'Workout successfully deleted'}

# Exercise related endpoints
# --------------------------------------------------

@app.route('/api/v1/exercises', methods=['GET'])
def fetch_exercises():
    workout_id = request.args.get('workout_id', type=int)
    with session_scope() as session:
        if workout_id is None:
            result = session.query(Exercise).all()
        else:
            result = session.query(Exercise).filter_by(workout_id=workout_id).all()
        exercises = [{
            'id': exercise.id,
            'name': exercise.name,
            'rest_lowerbound': exercise.rest_lowerbound,
            'rest_upperbound': exercise.rest_upperbound,
            'workout_id': exercise.workout_id,
            'weight_type_id': exercise.weight_type_id,
            'created_at': exercise.created_at,
            'updated_at': exercise.updated_at,
        } for exercise in result]
    return {'resultSet': exercises}


@app.route('/api/v1/exercises', methods=['POST'])
def create_exercise():
    workout_id = request.args.get('workout_id', type=int)
    name = request.json['name']
    rest_lowerbound = request.json['rest_lowerbound']
    rest_upperbound = request.json['rest_upperbound']
    weight_type_id = request.json['weight_type_id']
    exercise = Exercise(name=name, rest_lowerbound=rest_lowerbound, 
        rest_upperbound=rest_upperbound, workout_id=workout_id, 
        weight_type_id=weight_type_id)
    with session_scope() as session:
        session.add(exercise)
    return {'message': 'Exercise successfully created'}, 201


@app.route('/api/v1/exercises/<exercise_id>', methods=['GET'])
def fetch_exercise_by_id(exercise_id):
    with session_scope() as session:
        result = session.query(Exercise).filter_by(id=exercise_id).one()
        exercise = {
            'id': result.id,
            'name': result.name,
            'workout_id': result.workout_id,
            'rest_lowerbound': result.rest_lowerbound,
            'rest_upperbound': result.rest_upperbound,
            'weight_type_id': result.weight_type_id,
            'created_at': result.created_at,
            'updated_at': result.updated_at,
        }
    return {'resultSet': [exercise]}


@app.route('/api/v1/exercise/<exercise_id>', methods=['PUT'])
def update_exercise(exercise_id):
    with session_scope() as session:
        session.query(Exercise).filter_by(id=exercise_id).update({
            'name': request.json['name'],
            'rest_lowerbound': request.json['rest_lowerbound'],
            'rest_upperbound': request.json['rest_upperbound'],
            'weight_type_id': request.json['weight_type_id'],
            'updated_at': datetime.datetime.utcnow()
        })
    return {'message': 'Exercise successfully updated'}


@app.route('/api/v1/exercises/<exercise_id>', methods=['DELETE'])
def delete_exercise_by_id(exercise_id):
    with session_scope() as session:
        exercise = session.query(Exercise).filter_by(id=exercise_id).one()
        session.delete(exercise)
    return {'message': 'Exercise successfully deleted'}


# WorkoutSet related endpoints
# --------------------------------------------------

@app.route('/api/v1/workoutsets', methods=['GET'])
def fetch_workout_sets():
    exercise_id = request.args.get('exercise_id', type=int)
    with session_scope() as session:
        if exercise_id is None:
            result = session.query(WorkoutSet).all()
        else:
            result = session.query(WorkoutSet).filter_by(exercise_id=exercise_id) \
                .order_by(WorkoutSet.order_index) \
                .all()
        workout_sets = [{
            'id': workoutset.id,
            'order_index': workoutset.order_index,
            'repititions': workoutset.repititions,
            'weight': workoutset.weight,
            'mass_unit_id': workoutset.mass_unit_id,
            'is_amrap': workoutset.is_amrap,
            'exercise_id': workoutset.exercise_id,
            'created_at': workoutset.created_at
        } for workoutset in result]
    return {'resultSet': workout_sets}


@app.route('/api/v1/workoutsets/<workoutset_id>', methods=['GET'])
def fetch_workout_set_by_id(workoutset_id):
    with session_scope() as session:
        result = session.query(WorkoutSet).filter_by(id=workoutset_id).one()
        workout_set = {
            'id': result.id,
            'order_index': result.order_index,
            'repititions': result.repititions,
            'weight': result.weight,
            'is_amrap': result.is_amrap,
            'mass_unit_id': result.mass_unit_id,
            'exercise_id': result.exercise_id,
            'created_at': result.created_at
        }
    return {'resultSet': [workout_set]}


@app.route('/api/v1/workoutsets', methods=['POST'])
def create_workout_sets():
    exercise_id = request.args.get('exercise_id', type=int)
    workout_sets = request.json['workout_sets']
    sets_to_add = [WorkoutSet(
        order_index=idx,
        repititions=workoutset.get('repititions'),
        weight=workoutset.get('weight'),
        mass_unit_id=workoutset.get('mass_unit_id'),
        is_amrap=workoutset.get('is_amrap'),
        exercise_id=exercise_id
    ) for idx, workoutset in enumerate(workout_sets, start=1)]
    with session_scope() as session:
        session.add_all(sets_to_add)
    return {'message': 'Workout sets successfully created'}, 201


@app.route('/api/v1/workoutsets/<workoutset_id>', methods=['DELETE'])
def delete_workout_set_by_id(workoutset_id):
    with session_scope() as session:
        workout_set = session.query(WorkoutSet).filter_by(id=workoutset_id).one()
        session.delete(workout_set)
    return {'message': 'Workout set successfully deleted'}


@app.route('/api/v1/workoutsets', methods=['DELETE'])
def delete_workout_sets():
    exercise_id = request.args.get('exercise_id')
    with session_scope() as session:
        session.query(WorkoutSet).filter_by(exercise_id=exercise_id).delete()
    return {'message': 'Workout sets successfully deleted'}


# WorkoutSet related endpoints
# --------------------------------------------------
@app.route('/api/v1/workoutsessions', methods=['GET'])
def fetch_workout_sessions():
    workout_session_id = request.args.get('workout_session_id', type=int)
    workout_id = request.args.get('workout_id', type=int)
    with session_scope() as session:
        if workout_id is not None:
            result = session.query(WorkoutSession).filter_by(workout_id=workout_id).all()
        else:
            result = session.query(WorkoutSession).filter_by(id=workout_session_id).all()
        workout_sessions = [{
            'id': sesh.id,
            'workout_id': sesh.workout_id,
            'start_time': sesh.start_time,
            'end_time': sesh.end_time,
        } for sesh in result]
    return {'resultSet': workout_sessions}


@app.route('/api/v1/workoutsessions', methods=['POST'])
def create_workout_session():
    workout_id = request.args.get('workout_id', type=int)
    sesh = WorkoutSession(workout_id=workout_id, start_time=datetime.datetime.utcnow())
    with session_scope() as session:
        session.add(sesh)
    return {'message': 'Workout sesssion successfully created'}, 201


@app.route('/api/v1/workoutsessions', methods=['PUT'])
def end_workout_session():
    workout_session_id = request.args.get('workout_session_id', type=int)
    with session_scope() as session:
        result = session.query(WorkoutSession).filter_by(id=workout_session_id).update({
            'end_time': datetime.datetime.utcnow()
        })
    return {'message': 'Workout sesssion successfully updated'}, 201


@app.route('/api/v1/workoutsessions', methods=['DELETE'])
def delete_workout_session():
    workout_session_id = request.args.get('workout_session_id', type=int)
    with session_scope() as session:
        session.query(WorkoutSession).filter_by(id=workout_session_id).delete()
    return {'message': 'Workout sesssion successfully deleted'}


# SetLog related endpoints
# --------------------------------------------------
@app.route('/api/v1/setlogs', methods=['GET'])
def fetch_set_logs():
    set_log_id = request.args.get('set_log_id', type=int)
    workout_session_id = request.args.get('workout_session_id', type=int)
    workout_set_id = request.args.get('workout_set_id', type=int)
    with session_scope() as session:
        if set_log_id is not None:
            result = session.query(SetLog).filter_by(id=set_log_id).all()
        elif workout_set_id is not None:
            result = session.query(SetLog).filter_by(workout_set_id=workout_set_id).all()
        else:
            result = session.query(SetLog).filter_by(workout_session_id=workout_session_id).all()
        set_logs = [{
            'id': log.id,
            'workout_session_id': log.workout_session_id,
            'workout_set_id': log.workout_set_id,
            'repititions': log.repititions,
            'weight': log.weight,
            'mass_unit_id': log.mass_unit_id
        } for log in result]
    return {'resultSet': set_logs}


@app.route('/api/v1/setlogs', methods=['POST'])
def insert_set_logs():
    workout_session_id = request.args.get('workout_session_id', type=int)
    set_logs = request.json['set_logs']
    set_logs_to_add = [SetLog(
        workout_session_id=workout_session_id,
        workout_set_id=log.workout_set_id,
        repitiions=log.repititions,
        weight=log.weight,
        mass_unit_id=log.mass_unit_id
    ) for log in set_logs]
    with session_scope() as session:
        session.add_all(set_logs_to_add)
    return {'message': 'Set logs successfully created'}