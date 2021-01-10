import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function WorkoutSetList({
    workoutSets,
    workoutIndex,
    exerciseIndex,
    weightType,
    dispatch
}) {
    const { userData } = useAuth();

    function renderWoroutSetRow(workoutSet, workoutSetIndex) {
        return (
            <li className="row" key={workoutSetIndex}>
                <button 
                    className="col btn btn-danger" 
                    onClick={() => dispatch({ type: 'DELETE_WORKOUTSET', payload: {workoutIndex, exerciseIndex, workoutSetIndex}})}
                >
                    Delete
                </button>
                <div className="col text-center">{workoutSetIndex + 1}</div>
                <input 
                    className="col text-center" 
                    type="number" 
                    min={0} 
                    step={1} 
                    value={workoutSet.repititions || ''} 
                    onChange={e => dispatch({type: 'UPDATE_WORKOUTSET_FIELD', payload: {workoutIndex, exerciseIndex, workoutSetIndex, field: 'repititions', value: e.target.value}})}
                />
                <div className='col'>
                    <div className='row'>
                        <input 
                            className="col text-center" 
                            type="number" 
                            min={0} 
                            step={2.5} 
                            value={workoutSet.weight || ''} 
                            onChange={e => dispatch({type: 'UPDATE_WORKOUTSET_FIELD', payload: {workoutIndex, exerciseIndex, workoutSetIndex, field: 'weight', value: e.target.value}})}
                        />
                    </div>
                </div>
                <div></div>
                <input 
                    type="checkbox" 
                    className="col" 
                    checked={workoutSet.isAmrap} 
                    onChange={e => dispatch({type: 'TOGGLE_WORKOUTSET_ISAMRAP', payload: {workoutIndex, exerciseIndex, workoutSetIndex}})}
                />
            </li>
        )
    }

    return (
        <>
            <ul className="list-unstyled">
                <li className="row text-center">
                    <div className="col"> </div>
                    <strong className="col">Set #</strong>
                    <strong className="col">Reps</strong>
                    <strong className="col">Weight</strong>
                    <strong className="col">AMRAP</strong>
                </li>
                {workoutSets.map((workoutSet, workoutSetIndex) => renderWoroutSetRow(workoutSet, workoutSetIndex))}
            </ul>
        </>
    )
}