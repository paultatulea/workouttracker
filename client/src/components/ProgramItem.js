import React, { useRef } from "react";
import "../style/ProgramItem.css";
import { useHistory } from "react-router-dom";

function ProgramItem({ program, onDeleteProgram }) {
  const { id, name, createdAt, numWorkouts } = program;
  const history = useHistory();
  const programItemRef = useRef();
  
  function handleClickProgramItem(e) {
    if (e.target === programItemRef.current) {
      history.push(`/programs/${id}`)
    }
  }

  return (
    <div
      className="programItem"
      onClick={handleClickProgramItem}
      ref={programItemRef}
    >
      <div className='programItem__left'>
        <p className="programItem__name">{name}</p>
        <p className="programItem__numWorkouts">{`${numWorkouts} ${
          numWorkouts === 1 ? "workout" : "workouts"
        }`}</p>
        <p className="programItem__createdAt">{createdAt}</p>
      </div>
      <div className='programItem__right'>
        <button className='btn btn-secondary mx-2' disabled={true} onClick={() => console.log('edit')}>Edit</button>
        <button className='btn btn-danger' onClick={() => onDeleteProgram(id)}>Delete</button>
      </div>
    </div>
  );
}

export default ProgramItem;
