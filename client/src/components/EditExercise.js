import React from "react";
import "../style/EditExercise.css";

function EditExercise({ exercise, dispatch, exerciseIndex, children }) {
  const { id, name, weightType, restLowerbound, restUpperbound } = exercise;

  return (
    <div className="editExercise">
      <div className="editExercise__top">
        <div className="editExercise__name">
          <label>Exercise name</label>
          <input
            type="text"
            value={name}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_EXERCISE_FIELD",
                payload: {
                  exerciseIndex,
                  field: "name",
                  value: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="editExercise__weightType">
          <label>Weight Type</label>
          <select
            value={weightType}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_EXERCISE_FIELD",
                payload: {
                  exerciseIndex,
                  field: "weightType",
                  value: e.target.value,
                },
              })
            }
          >
            <option>WEIGHT</option>
            <option>PERCENTAGE</option>
          </select>
        </div>
        <div className="editExercise__rest">
          <label>Min Rest*</label>
          <input
            type="number"
            value={restLowerbound || ""}
            min={0}
            step={1}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_EXERCISE_FIELD",
                payload: {
                  exerciseIndex,
                  field: "restLowerbound",
                  value: e.target.value,
                },
              })
            }
          />
          <label>Max Rest</label>
          <input
            type="number"
            value={restUpperbound || ""}
            min={0}
            step={1}
            onChange={(e) =>
              dispatch({
                type: "UPDATE_EXERCISE_FIELD",
                payload: {
                  exerciseIndex,
                  field: "restUpperbound",
                  value: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
      <div>{children}</div>
      <div className="editExercise__bottom">
        <button
          onClick={() =>
            dispatch({ type: "ADD_WORKOUTSET", payload: { exerciseIndex } })
          }
        >
          Add set
        </button>
        <button
          onClick={() =>
            dispatch({ type: "DELETE_EXERCISE", payload: { exerciseIndex } })
          }
        >
          Delete Exercise
        </button>
      </div>
    </div>
  );
}

export default EditExercise;
