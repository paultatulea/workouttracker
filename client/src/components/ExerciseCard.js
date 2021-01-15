import React from 'react';

export default function ExerciseCard({
    exercise,
    exerciseIndex,
    workoutIndex,
    dispatch,
    children
}) {
    
    return (
        <div className="border border-secondary my-3">
            <div className='row justify-content-start'>
                <h3 className='col-4'>{`Exercise #${exerciseIndex + 1}`}</h3>
                <button 
                    className='btn btn-danger col-2' 
                    onClick={() => dispatch({ type: 'DELETE_EXERCISE', payload: {workoutIndex, exerciseIndex}})}
                >
                    Delete Exercise
                </button>
            </div>
            <label>Exercise name</label>
            <input 
                className='form-control' 
                type='text' 
                value={exercise.name} 
                onChange={e => dispatch({ type: 'UPDATE_EXERCISE_FIELD', payload: {workoutIndex, exerciseIndex, field: 'name', value: e.target.value}})}
            />
            <label>Weight type</label>
            <select 
                className="form-control col-4" 
                value={exercise.weightType}
                onChange={e => dispatch({ type: 'UPDATE_EXERCISE_FIELD', payload: {workoutIndex, exerciseIndex, field: 'weightType', value: e.target.value}})}
            >
                <option>Weight</option>
                <option>Percentage</option>
            </select>
            <div>
                <div className="form-group">
                    <label>Min Rest (*)</label>
                    <input 
                        className="form-control" 
                        type="number" 
                        min={0} 
                        step={5} 
                        value={exercise.restLowerbound || ''}
                        onChange={e => dispatch({ type: 'UPDATE_EXERCISE_FIELD', payload: {workoutIndex, exerciseIndex, field: 'restLowerbound', value: e.target.value}})}
                    />
                    <small className="text-muted">* Minimum rest not required, set max rest only if range not desired.</small>
                </div>
                <div className="form-group">
                    <label>Max Rest</label>
                    <input 
                        className="form-control" 
                        type="number" 
                        min={0} 
                        step={5} 
                        value={exercise.restUpperbound}
                        onChange={e => dispatch({ type: 'UPDATE_EXERCISE_FIELD', payload: { workoutIndex, exerciseIndex, field: 'restUpperbound', value: e.target.value}})}
                    />
                </div>
            </div>
            {children}
            <button 
                className="btn btn-primary" 
                onClick={() => dispatch({ type: 'ADD_WORKOUTSET', payload: {workoutIndex, exerciseIndex }})}
            >
                Add set
            </button>
        </div>
    )
}