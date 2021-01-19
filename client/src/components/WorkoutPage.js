import React, { useState, useEffect } from "react";
import '../style/WorkoutPage.css';
import { getWorkoutById } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import ExerciseItem from './ExerciseItem';

export default function WorkoutPage(props) {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const [workoutData, setWorkoutData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function getWorkoutData() {
      const res = await getWorkoutById(
        currentUser.token,
        props.match.params.id
      );
      setWorkoutData(res.resultSet[0]);
      setIsLoading(false);
    }
    getWorkoutData();
  }, []);

  function renderRegularView() {
    return (
      <>
        <div className='workoutPage__header'>
            <div className='workoutPage__header__top'>
                <h3>{`Workout: ${workoutData.name}`}</h3>
                <button className='btn btn-secondary' onClick={() => setIsEditing(true)}>Edit Workout</button>
            </div>
            <button className='btn-lg btn-success mx-2'>Start workout session</button>
        </div>
        <div className='workoutPage__exerciseList'>
            {workoutData.exercises.map(exercise => <ExerciseItem key={exercise.id} exercise={exercise} />)}
        </div>
      </>
    )
  }

  function renderEditingView() {
    return (
      <>
        <label>Workout name</label>
        <input type='text' name='name' placeholder='Workout name' defaultValue={workoutData.name}/>
        {workoutData.exercises.map(exercise => {
          return (
            <div>
              <label>Exercise name</label>
              <input type='text' name='name' placeholder='Exercise name' defaultValue={exercise.name} />
              <label>Min Rest</label>
              <input type='number' name='restLowerbound' defaultValue={exercise.restLowerbound || ''} />
              <label>Max Rest</label>
              <input type='number' name='restUpperbound' defaultValue={exercise.restUpperbound} />
              {exercise.workoutSets.map(workoutSet => {
                return (
                  <div>
                    <label>Reps</label>
                    <input type='number' defaultValue={workoutSet.repititions} />
                    <label>Weight</label>
                    <input type='number' defaultValue={workoutSet.weight || ''} />
                  </div>
                )
              })}
            </div>
          )
        })}
        <button className='btn-lg btn-success' onClick={() => setIsEditing(false)}>Save Program</button>
      </>
    )
  }

  return (
    <div className="workoutPage">
      {isLoading ? (
        <h2>Loading...</h2>
      ) : isEditing ? renderEditingView() : renderRegularView()}
    </div>
  );
}
