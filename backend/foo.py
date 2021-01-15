from workouttracker.models import (
    create_database,
    User, Program, Workout, Exercise, WorkoutSet, MassUnit, WeightType,
    UserSetting, WorkoutSession, SetLog
)
from workouttracker.database import session_scope

# create_database()

# lb = MassUnit(description='POUND', symbol='lb', ratio_to_kg=0.453592)
# kg = MassUnit(description='KILOGRAM', symbol='kg', ratio_to_kg=1)

# with session_scope() as session:
#     session.add(kg)
#     session.add(lb)

# weight = WeightType(description='WEIGHT')
# pct = WeightType(description='PERCENTAGE')

# with session_scope() as session:
#     session.add(weight)
#     session.add(pct)


# -----------------------------------
# Insert test programs and workout data
def insert_dummy_test_data():
    from random import randint
    with session_scope() as session:
        # Create a dummy user
        username = 'testuser' + str(randint(100, 999))
        test_user = User(username=username, email=f"{username}@gmail.com", password="testpassword")
        session.add(test_user)
        session.flush()
        # Create a dummy program
        test_program = Program(name='Mesocycle 1', user_id=test_user.id)
        session.add(test_program)
        session.flush()
        # Create dummy workouts
        test_workout_one = Workout(name='Push V1', program_id=test_program.id)
        test_workout_two = Workout(name='Push V2', program_id=test_program.id)
        session.add(test_workout_one)
        session.add(test_workout_two)
        session.flush()
        # Create dummy exercises
        test_exercise_one = Exercise(name='Incline Barbell Bench Press', rest_lowerbound=60, rest_upperbound=90, workout_id=test_workout_one.id, weight_type_id=1)
        test_exercise_two = Exercise(name='Anterior Barbell Raise', rest_upperbound=60, workout_id=test_workout_one.id, weight_type_id=1)
        test_exercise_three = Exercise(name='Lateral Cable Raises', rest_upperbound=60, workout_id=test_workout_one.id, weight_type_id=1)
        test_exercise_four = Exercise(name='Pull-Ups', rest_lowerbound=60, rest_upperbound=90, workout_id=test_workout_two.id, weight_type_id=1)
        test_exercise_five = Exercise(name='Bent Over Barbell Rows', rest_upperbound=60, workout_id=test_workout_two.id, weight_type_id=1)
        test_exercise_six = Exercise(name='Dumbell Shrugs', rest_upperbound=60, workout_id=test_workout_two.id, weight_type_id=1)
        session.add_all([test_exercise_one, test_exercise_two, test_exercise_three, test_exercise_four, test_exercise_five, test_exercise_six])
        session.flush()
        # Create dummy sets
        testset1 = WorkoutSet(order_index=1, repititions=12, mass_unit_id=1, exercise_id=test_exercise_one.id)
        testset2 = WorkoutSet(order_index=2, repititions=12, mass_unit_id=1, exercise_id=test_exercise_one.id)
        testset3 = WorkoutSet(order_index=3, repititions=12, mass_unit_id=1, exercise_id=test_exercise_one.id)
        testset4 = WorkoutSet(order_index=4, repititions=12, mass_unit_id=1, exercise_id=test_exercise_one.id)
        testset4 = WorkoutSet(order_index=1, repititions=12, mass_unit_id=1, exercise_id=test_exercise_two.id)
        testset5 = WorkoutSet(order_index=2, repititions=12, mass_unit_id=1, exercise_id=test_exercise_two.id)
        testset6 = WorkoutSet(order_index=3, repititions=12, mass_unit_id=1, exercise_id=test_exercise_two.id)
        testset7 = WorkoutSet(order_index=1, repititions=15, mass_unit_id=1, exercise_id=test_exercise_three.id)
        testset8 = WorkoutSet(order_index=2, repititions=12, mass_unit_id=1, exercise_id=test_exercise_three.id)
        testset9 = WorkoutSet(order_index=3, repititions=12, mass_unit_id=1, exercise_id=test_exercise_three.id)
        testset10 = WorkoutSet(order_index=4, repititions=10, mass_unit_id=1, exercise_id=test_exercise_three.id, is_amrap=True)
        testset11 = WorkoutSet(order_index=1, repititions=12, mass_unit_id=1, exercise_id=test_exercise_four.id)
        testset12 = WorkoutSet(order_index=2, repititions=12, mass_unit_id=1, exercise_id=test_exercise_four.id)
        testset13 = WorkoutSet(order_index=1, repititions=12, mass_unit_id=1, exercise_id=test_exercise_five.id)
        testset14 = WorkoutSet(order_index=2, repititions=12, mass_unit_id=1, exercise_id=test_exercise_five.id)
        testset15 = WorkoutSet(order_index=3, repititions=12, mass_unit_id=1, exercise_id=test_exercise_five.id)
        testset16 = WorkoutSet(order_index=1, repititions=12, mass_unit_id=1, exercise_id=test_exercise_six.id)
        testset17 = WorkoutSet(order_index=2, repititions=12, mass_unit_id=1, exercise_id=test_exercise_six.id)
        testset18 = WorkoutSet(order_index=3, repititions=12, mass_unit_id=1, exercise_id=test_exercise_six.id)
        testset19 = WorkoutSet(order_index=4, repititions=12, mass_unit_id=1, exercise_id=test_exercise_six.id, is_amrap=True)
        session.add_all([testset1, testset2, testset3, testset4, testset5, testset6, testset7, testset8, testset9,
            testset10, testset11, testset12, testset13, testset14, testset15, testset16, testset17, testset18, testset19
        ])

# insert_dummy_test_data()