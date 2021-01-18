import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getProgramById, deleteWorkout } from "../api/api";
import WorkoutItem from "./WorkoutItem";
import "../style/ProgramPage.css";

function ProgramPage(props) {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [programData, setProgramData] = useState(null);

  useEffect(() => {
    async function fetchProgramData() {
      const res = await getProgramById(
        currentUser.token,
        props.match.params.id
      );
      setProgramData(res.resultSet[0]);
      setIsLoading(false);
    }

    setIsLoading(true);
    fetchProgramData();
  }, []);

  async function handleDeleteWorkout(workoutId) {
    const res = await deleteWorkout(currentUser.token, workoutId);
    // TODO check status of api call
    // Update state when deleted
    setProgramData({
      ...programData,
      workouts: programData.workouts.filter(workout => workout.id !== workoutId)
    });
  }

  return (
    <div className="programPage">
      {isLoading ? (
        <h2>Loading...</h2>
      ) : (
        <div>
          <h3 className="programPage__name">{`Program: ${programData.name}`}</h3>
          <h4>Workouts</h4>
          <div className="programPage__workoutList">
            {programData.workouts.map((workout) => (
              <WorkoutItem key={workout.id} workout={workout} onDeleteWorkout={handleDeleteWorkout}/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProgramPage;
