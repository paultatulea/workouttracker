import React, { useState, useEffect, useReducer } from "react";
import { getWorkoutById, updateWorkout } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import EditExercise from "./EditExercise";
import EditWorkoutSet from "./EditWorkoutSet";
import "../style/EditWorkoutPage.css";

const INITIAL_WORKOUTSET = { repititions: 8, weight: null, isAmrap: false };
const INITIAL_EXERCISE = {
  id: null,
  name: "New Exercise",
  weightType: "WEIGHT",
  restLowerbound: null,
  restUpperbound: 90,
  workoutSets: [INITIAL_WORKOUTSET, INITIAL_WORKOUTSET, INITIAL_WORKOUTSET],
};

function editWorkoutReducer(workout, action) {
  switch (action.type) {
    case "LOAD_WORKOUT": {
      return action.payload.workout;
    }
    case "UPDATE_WORKOUT_FIELD": {
      return { ...workout, [action.payload.field]: action.payload.value };
    }
    case "UPDATE_EXERCISE_FIELD": {
      return {
        ...workout,
        exercises: workout.exercises.map((exercise, exerciseIndex) => {
          if (exerciseIndex === action.payload.exerciseIndex) {
            return {
              ...exercise,
              [action.payload.field]: action.payload.value,
            };
          }
          return exercise;
        }),
      };
    }
    case "ADD_EXERCISE": {
      return {
        ...workout,
        exercises: [...workout.exercises, INITIAL_EXERCISE],
      };
    }
    case "DELETE_EXERCISE": {
      return {
        ...workout,
        exercises: workout.exercises.filter(
          (exercise, exerciseIndex) =>
            exerciseIndex !== action.payload.exerciseIndex
        ),
      };
    }
    case "ADD_WORKOUTSET": {
      return {
        ...workout,
        exercises: workout.exercises.map((exercise, exerciseIndex) => {
          if (exerciseIndex === action.payload.exerciseIndex) {
            return {
              ...exercise,
              workoutSets: [...exercise.workoutSets, INITIAL_WORKOUTSET],
            };
          }
          return exercise;
        }),
      };
    }
    case "DELETE_WORKOUTSET": {
      return {
        ...workout,
        exercises: workout.exercises.map((exercise, exerciseIndex) => {
          if (exerciseIndex === action.payload.exerciseIndex) {
            return {
              ...exercise,
              workoutSets: exercise.workoutSets.filter(
                (workoutSet, workoutSetIndex) =>
                  workoutSetIndex !== action.payload.workoutSetIndex
              ),
            };
          }
          return exercise;
        }),
      };
    }
    case "UPDATE_WORKOUTSET_FIELD": {
      return {
        ...workout,
        exercises: workout.exercises.map((exercise, exerciseIndex) => {
          if (exerciseIndex === action.payload.exerciseIndex) {
            return {
              ...exercise,
              workoutSets: exercise.workoutSets.map(
                (workoutSet, workoutSetIndex) => {
                  if (workoutSetIndex === action.payload.workoutSetIndex) {
                    return {
                      ...workoutSet,
                      [action.payload.field]: action.payload.value,
                    };
                  }
                  return workoutSet;
                }
              ),
            };
          }
          return exercise;
        }),
      };
    }
    case "TOGGLE_WORKOUTSET_ISAMRAP": {
      return {
        ...workout,
        exercises: workout.exercises.map((exercise, exerciseIndex) => {
          if (exerciseIndex === action.payload.exerciseIndex) {
            return {
              ...exercise,
              workoutSets: exercise.workoutSets.map(
                (workoutSet, workoutSetIndex) => {
                  if (workoutSetIndex === action.payload.workoutSetIndex) {
                    return {
                      ...workoutSet,
                      isAmrap: !workoutSet.isAmrap,
                    };
                  }
                  return workoutSet;
                }
              ),
            };
          }
          return exercise;
        }),
      };
    }
    default:
      break;
  }
}

function EditWorkoutPage(props) {
  const [workout, dispatch] = useReducer(editWorkoutReducer, {
    name: "",
    exercises: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function getWorkoutData() {
      const res = await getWorkoutById(
        currentUser.token,
        props.match.params.id
      );
      dispatch({
        type: "LOAD_WORKOUT",
        payload: { workout: res.resultSet[0] },
      });
      setIsLoading(false);
    }
    getWorkoutData();
  }, []);

  async function handleSaveWorkout() {
    const res = await updateWorkout(
      currentUser.token,
      props.match.params.id,
      workout
    );
  }

  return (
    <div>
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <div className="editWorkoutPage">
          <label>Workout Name</label>
          <input
            type="text"
            value={workout.name}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_WORKOUT_FIELD",
                payload: { field: "name", value: e.target.value },
              })
            }
          />
          <div className="exerciseList">
            {workout.exercises.map((exercise, exerciseIndex) => (
              <EditExercise
                key={exerciseIndex}
                exercise={exercise}
                dispatch={dispatch}
                exerciseIndex={exerciseIndex}
              >
                {exercise.workoutSets.map((workoutSet, workoutSetIndex) => (
                  <EditWorkoutSet
                    key={workoutSetIndex}
                    workoutSet={workoutSet}
                    dispatch={dispatch}
                    weightType={exercise.weightType}
                    exerciseIndex={exerciseIndex}
                    workoutSetIndex={workoutSetIndex}
                  />
                ))}
              </EditExercise>
            ))}
          </div>
          <div className="editWorkoutPage__bottom">
            <button onClick={() => dispatch({ type: "ADD_EXERCISE" })}>
              Add Exercise
            </button>
            <button disabled={isSubmitting} onClick={handleSaveWorkout}>
              Save
            </button>
            <button onClick={() => console.log(workout)}>Log</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditWorkoutPage;
