import React from 'react'

function WorkoutItem({
    name
}) {
    return (
        <div className='workoutItem'>
            <h3 className='workoutItem__name'>{name}</h3>
        </div>
    )
}

export default WorkoutItem
