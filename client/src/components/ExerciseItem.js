import React from 'react'
import WorkoutSetItem from './WorkoutSetItem'
import '../style/ExerciseItem.css'


export default function ExerciseItem({
    exercise
}) {
    const { name, restLowerbound, restUpperbound, workoutSets } = exercise;
    return (
        <div className='exerciseItem'>
            <h4 className='exerciseItem__name'>{name}</h4>
            <p className='exerciseItem__rest'>{`Rest: ${restLowerbound === null ? restUpperbound : `${restLowerbound}-${restUpperbound}`} seconds`}</p>
            {workoutSets.map(workoutSet => <WorkoutSetItem key={workoutSet.id} workoutSet={workoutSet} />)}
        </div>
    )
}