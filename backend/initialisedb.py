from workouttracker.models import (
    create_database, MassUnit, WeightType, QuantityType,
    ExerciseGroup
)
from workouttracker.database import session_scope

create_database()
# Add mass units
kg = MassUnit(description='KILOGRAM', symbol='kg', ratio_to_kg=1)
lb = MassUnit(description='POUND', symbol='lb', ratio_to_kg=0.453592)
with session_scope() as session:
    session.add(kg)
    session.add(lb)
# Add weight types
weight = WeightType(description='WEIGHT')
pct = WeightType(description='PERCENTAGE')
with session_scope() as session:
    session.add(weight)
    session.add(pct)
# Add quantity types
repititions = QuantityType(description='REPITITIONS')
duration = QuantityType(description='DURATION')
with session_scope() as session:
    session.add(repititions)
    session.add(duration)
# Add default exercise groups
with open('defaultExerciseGroups.txt', 'r') as f:
    names = [line.strip() for line in f]
exercise_groups = [ExerciseGroup(description=name) for name in names]
with session_scope() as session:
    session.add_all(exercise_groups)
