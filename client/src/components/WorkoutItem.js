import React, { useRef }from "react";
import "../style/WorkoutItem.css";
import { useHistory } from "react-router-dom";

function WorkoutItem({ workout, onDeleteWorkout }) {
  const { id, name, numExercises } = workout;
  const history = useHistory();
  const workoutItemRef = useRef();

  function handleClickWorkoutItem(e) {
    if (e.target === workoutItemRef.current) {
      history.push(`/workouts/${id}`)
    }
  }

  return (
    <div
      className="workoutItem"
      ref={workoutItemRef}
      onClick={handleClickWorkoutItem}
    >
      <div className='workoutItem__left'>
        <p className="workoutItem__name">{name}</p>
        <p className="workoutItem__numExercises">{`${numExercises} ${
          numExercises === 1 ? "exercise" : "exercises"
        }`}</p>
      </div>
      <div className='workoutItem__right'>
        <button className='btn btn-secondary mx-2' disabled={true} onClick={() => console.log('edit')}>Edit</button>
        <button className='btn btn-danger' onClick={() => onDeleteWorkout(id)}>Delete</button>
      </div>
    </div>
  );
}

export default WorkoutItem;
