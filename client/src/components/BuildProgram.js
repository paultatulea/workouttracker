import React, {useReducer} from 'react';
import ExerciseCard from './ExerciseCard';
import WorkoutCard from './WorkoutCard';
import WorkoutSetList from './WorkoutSetList';

const INITIAL_WORKOUTSET = {repititions: 8, weight: null, isAmrap: false};
const INITIAL_EXERCISE = {
    name: "New Exercise", 
    weightType: "Weight-based", 
    restLowerbound: null, 
    restUpperbound: 90, workoutSets: [INITIAL_WORKOUTSET, INITIAL_WORKOUTSET, INITIAL_WORKOUTSET]}
const INITIAL_WORKOUT = {name: "New Workout", exercises: [INITIAL_EXERCISE]}
const INITIAL_PROGRAM = {name: "New Program", workouts: [INITIAL_WORKOUT]}
const INITIAL_STATE = {program: INITIAL_PROGRAM};

function buildProgramReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_PROGRAM_FIELD': {
            return {
                ...state,
                program: {
                    ...state.program,
                    [action.payload.field]: action.payload.value
                }
            }
        }
        case 'ADD_WORKOUT': {
            return {
                ...state,
                program: {
                    ...state.program,
                    workouts: [
                        ...state.program.workouts,
                        INITIAL_WORKOUT
                    ]
                } 
            };
        }
        case 'DELETE_WORKOUT': {
            return {
                ...state,
                program: {
                    ...state.program,
                    workouts: state.program.workouts.filter((workout, index) => index !== action.payload.workoutIndex)
                }
            };
        }
        case 'UPDATE_WORKOUT_FIELD': {
            return {
                ...state,
                program: {
                    ...state.program,
                    workouts: state.program.workouts.map((workout, workoutIndex) => {
                        if (workoutIndex === action.payload.workoutIndex) {
                            return {
                                ...workout,
                                [action.payload.field]: action.payload.value
                            };
                        }
                        return workout;
                    })
                }
            };
        }
        case 'ADD_EXERCISE': {
            return {
                ...state,
                program: {
                    ...state.program,
                    workouts: state.program.workouts.map((workout, workoutIndex) => {
                        if (workoutIndex === action.payload.workoutIndex) {
                            return {
                                ...workout,
                                exercises: [
                                    ...workout.exercises,
                                    INITIAL_EXERCISE
                                ]
                            };
                        }
                        return workout;
                    })
                }
            };
        }
        case 'DELETE_EXERCISE': {
            return {
                ...state,
                program: {
                    ...state.program,
                    workouts: state.program.workouts.map((workout, workoutIndex) => {
                        if (workoutIndex === action.payload.workoutIndex) {
                            return {
                                ...workout,
                                exercises: workout.exercises.filter((exercise, exerciseIndex) => exerciseIndex !== action.payload.exerciseIndex)
                            };
                        }
                        return workout;
                    })
                }
            };
        }
        case 'UPDATE_EXERCISE_FIELD': {
            return {
                ...state,
                program: {
                    ...state.program,
                    workouts: state.program.workouts.map((workout, workoutIndex) => {
                        if (workoutIndex === action.payload.workoutIndex) {
                            return {
                                ...workout,
                                exercises: workout.exercises.map((exercise, exerciseIndex) => {
                                    if (exerciseIndex === action.payload.exerciseIndex) {
                                        return {
                                            ...exercise,
                                            [action.payload.field]: action.payload.value
                                        };
                                    }
                                    return exercise;
                                })
                            };
                        }
                        return workout;
                    })
                }
            }
        }
        case 'ADD_WORKOUTSET': {
            return {
                ...state,
                program: {
                    ...state.program,
                    workouts: state.program.workouts.map((workout, workoutIndex) => {
                        if (workoutIndex === action.payload.workoutIndex) {
                            return {
                                ...workout,
                                exercises: workout.exercises.map((exercise, exerciseIndex) => {
                                    if (exerciseIndex === action.payload.exerciseIndex) {
                                        return {
                                            ...exercise,
                                            workoutSets: [
                                                ...exercise.workoutSets,
                                                INITIAL_WORKOUTSET
                                            ]
                                        };
                                    }
                                    return exercise;
                                })
                            };
                        }
                        return workout;
                    })
                }
            };
        }
        case 'DELETE_WORKOUTSET': {
            return {
                ...state,
                program: {
                    ...state.program,
                    workouts: state.program.workouts.map((workout, workoutIndex) => {
                        if (workoutIndex === action.payload.workoutIndex) {
                            return {
                                ...workout,
                                exercises: workout.exercises.map((exercise, exerciseIndex) => {
                                    if (exerciseIndex === action.payload.exerciseIndex) {
                                        return {
                                            ...exercise,
                                            workoutSets: exercise.workoutSets.filter((workoutSet, workoutSetIndex) => workoutSetIndex !== action.payload.workoutSetIndex)
                                        };
                                    }
                                    return exercise;
                                })
                            };
                        }
                        return workout;
                    })
                }
            };
        }
        case 'UPDATE_WORKOUTSET_FIELD': {
            return {
                ...state,
                program: {
                    ...state.program,
                    workouts: state.program.workouts.map((workout, workoutIndex) => {
                        if (workoutIndex === action.payload.workoutIndex) {
                            return {
                                ...workout,
                                exercises: workout.exercises.map((exercise, exerciseIndex) => {
                                    if (exerciseIndex === action.payload.exerciseIndex) {
                                        return {
                                            ...exercise,
                                            workoutSets: exercise.workoutSets.map((workoutSet, workoutSetIndex) => {
                                                if (workoutSetIndex === action.payload.workoutSetIndex) {
                                                    return {
                                                        ...workoutSet,
                                                        [action.payload.field]: action.payload.value
                                                    };
                                                }
                                                return workoutSet;
                                            })
                                        };
                                    }
                                    return exercise;
                                })
                            };
                        }
                        return workout;
                    })
                }
            };
        }
        case 'TOGGLE_WORKOUTSET_ISAMRAP': {
            return {
                ...state,
                program: {
                    ...state.program,
                    workouts: state.program.workouts.map((workout, workoutIndex) => {
                        if (workoutIndex === action.payload.workoutIndex) {
                            return {
                                ...workout,
                                exercises: workout.exercises.map((exercise, exerciseIndex) => {
                                    if (exerciseIndex === action.payload.exerciseIndex) {
                                        return {
                                            ...exercise,
                                            workoutSets: exercise.workoutSets.map((workoutSet, workoutSetIndex) => {
                                                if (workoutSetIndex === action.payload.workoutSetIndex) {
                                                    return {
                                                        ...workoutSet,
                                                        isAmrap: !workoutSet.isAmrap
                                                    };
                                                }
                                                return workoutSet;
                                            })
                                        };
                                    }
                                    return exercise;
                                })
                            };
                        }
                        return workout;
                    })
                }
            };
        }
        default:
            break;
    }
}

export default function BuildProgram() {
    const [state, dispatch] = useReducer(buildProgramReducer, INITIAL_STATE);

    return (
        <>
            <h1>Build Program</h1>
            <label>Program name</label>
            <input 
                className='form-control' 
                type='text' 
                value={state.program.name} 
                onChange={e => dispatch({ type: 'UPDATE_PROGRAM_FIELD', payload: {field: 'name', value: e.target.value}})} 
            />
            {state.program.workouts.map((workout, workoutIndex) => <WorkoutCard
                key={workoutIndex}
                workoutIndex={workoutIndex}
                workout={workout}
                dispatch={dispatch}
                >
                    {workout.exercises.map((exercise, exerciseIndex) => <ExerciseCard
                        key={exerciseIndex}
                        exercise={exercise}
                        exerciseIndex={exerciseIndex}
                        workoutIndex={workoutIndex}
                        dispatch={dispatch}
                    >
                        <WorkoutSetList
                            workoutSets={exercise.workoutSets}
                            workoutIndex={workoutIndex}
                            exerciseIndex={exerciseIndex}
                            weightType={exercise.weightType}
                            dispatch={dispatch}
                        />
                    </ExerciseCard>
                    )}
                </WorkoutCard>
            )}
            <button 
                className="btn btn-success" 
                onClick={() => dispatch({ type: 'ADD_WORKOUT'})}
            >
                Add Workout
            </button>
            <button 
                className="btn btn-primary" 
                onClick={() => console.log(state.program)}
            >
                Save Program
            </button>
        </>
    )
}