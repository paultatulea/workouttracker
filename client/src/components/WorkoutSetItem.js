import React from 'react';
import '../style/WorkoutSetItem.css'

export default function WorkoutSetItem({
    workoutSet,
    exerciseWeightType
}) {
    const { id, repititions, weight, isAmrap, massUnit } = workoutSet;

    return (
        <div className='workoutSetItem'>
            <p className='workoutSetItem__repScheme'>{`${repititions}${isAmrap ? '+' : ''} reps ${weight === null ? '' : `x ${weight} ${massUnit === null ? '%' : massUnit}`}`}</p>
        </div>
    )
}