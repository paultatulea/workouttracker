import React from 'react';

export default function WorkoutCard({
    workout,
    workoutIndex,
    dispatch,
    children
}) {

    return (
        <>
            <div className='row justify-content-start'>
                <h2 className='col-4'>{`Workout #${workoutIndex + 1}`}</h2>
                <button className='btn btn-danger col-2' onClick={() => dispatch({ type: 'DELETE_WORKOUT', payload: {workoutIndex}})}>
                    Delete Workout
                </button> 
            </div>
            <label>Workout name</label>
            <input 
                className='form-control' 
                type='text' 
                value={workout.name} 
                onChange={e => dispatch({ type: 'UPDATE_WORKOUT_FIELD', payload: {workoutIndex, field: 'name', value: e.target.value}})}
            />
            {children}
            <button 
                className="btn btn-success" 
                onClick={() => dispatch({ type: 'ADD_EXERCISE', payload: {workoutIndex }})}
            >
                Add exercise
            </button>
        </>
    )
}