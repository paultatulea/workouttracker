import React from "react";
import { useAuth } from "../contexts/AuthContext";
import "../style/EditWorkoutSet.css";

function EditWorkoutSet({
  workoutSet,
  dispatch,
  weightType,
  exerciseIndex,
  workoutSetIndex,
}) {
  const { repititions, weight, isAmrap } = workoutSet;
  const { currentUser } = useAuth();

  return (
    <div className="editWorkoutSet">
      <button
        onClick={() =>
          dispatch({
            type: "DELETE_WORKOUTSET",
            payload: { exerciseIndex, workoutSetIndex },
          })
        }
      >
        Delete
      </button>
      <p>{`Set ${workoutSetIndex + 1}`}</p>
      <label>Reps</label>
      <input
        type="text"
        value={repititions}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_WORKOUTSET_FIELD",
            payload: {
              exerciseIndex,
              workoutSetIndex,
              field: "repititions",
              value: e.target.value,
            },
          })
        }
      />
      <label>Weight</label>
      <input
        type="number"
        value={weight || ""}
        onChange={(e) =>
          dispatch({
            type: "UPDATE_WORKOUTSET_FIELD",
            payload: {
              exerciseIndex,
              workoutSetIndex,
              field: "weight",
              value: e.target.value,
            },
          })
        }
      />
      <p>
        {weightType === "PERCENTAGE" ? "%" : currentUser.user.massUnitSymbol}
      </p>
      <label>AMRAP</label>
      <input
        type="checkbox"
        value={isAmrap}
        onChange={() =>
          dispatch({
            type: "TOGGLE_WORKOUTSET_ISAMRAP",
            payload: {
              exerciseIndex,
              workoutSetIndex,
            },
          })
        }
      />
    </div>
  );
}

export default EditWorkoutSet;
