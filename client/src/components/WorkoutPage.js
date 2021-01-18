import React, { useState, useEffect } from "react";
import '../style/WorkoutPage.css';
import { getWorkoutById } from "../api/api";
import { useAuth } from "../contexts/AuthContext";
import ExerciseItem from './ExerciseItem';

export default function WorkoutPage(props) {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const [workoutData, setWorkoutData] = useState(null);

  useEffect(() => {
    async function getWorkoutData() {
      const res = await getWorkoutById(
        currentUser.token,
        props.match.params.id
      );
      setWorkoutData(res.resultSet[0]);
      setIsLoading(false);
      console.log(res.resultSet[0])
    }
    getWorkoutData();
  }, []);

  return (
    <div className="workoutPage">
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <>
            <div className='workoutPage__header'>
                <div className='workoutPage__header__top'>
                    <h3>{`Workout: ${workoutData.name}`}</h3>
                    <button className='btn btn-secondary' disabled={true}>Edit Workout</button>
                </div>
                <button className='btn-lg btn-success mx-2'>Start workout session</button>
            </div>
            <div className='workoutPage__exerciseList'>
                {workoutData.exercises.map(exercise => <ExerciseItem key={exercise.id} exercise={exercise} />)}
            </div>
        </>
      )}
    </div>
  );
}
