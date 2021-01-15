import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getProgramById } from '../api/api'
import WorkoutItem from './WorkoutItem'

function ProgramPage(props) {
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [programData, setProgramData] = useState(null);

    useEffect(() => {
        async function fetchProgramData() {
            const res = await getProgramById(currentUser.token, props.match.params.id);
            setProgramData(res.resultSet[0]);
            setIsLoading(false);
        }

        setIsLoading(true);
        fetchProgramData();
    }, [])

    return (
        <div className='programPage'>
            {isLoading ? (
                <h2>Loading...</h2>
            ) : (
                <div>
                    <h3 className='programPage__name'>{programData.name}</h3>
                    <div className='programPage__workoutList'>
                        {programData.workouts.map(workout => <WorkoutItem
                                workout={workout}
                            />)}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProgramPage
