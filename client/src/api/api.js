const API_URL = "http://localhost:5000/api/v1";

export async function createUser(email, password) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  if (!res.ok) {
    // handle errors
    console.log("Something bad happened");
  }
  return res.json();
}

export async function authenticateUser(email, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  if (!res.ok) {
    // handle errors
    console.log("Could not authenticate user");
  }
  return res.json();
}

export async function validateAuthToken(token) {
  const res = await fetch(`${API_URL}/validateAuthToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    // handle errors
    console.log("Could not validate token");
  }
  return res.json();
}

export async function getUserPrograms(token) {
  try {
    const res = await fetch(`${API_URL}/programs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      console.log("Could not get user programs");
    }
    return res.json();
  } catch (err) {
    console.log(err.json());
  }
}

export async function getProgramById(token, programId) {
  try {
    const res = await fetch(`${API_URL}/programs/${programId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      console.log("Could not get program data");
    }
    return res.json();
  } catch (err) {
    console.log(err.json());
  }
}

export async function deleteProgram(token, programId) {
  try {
    const res = await fetch (`${API_URL}/programs/${programId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      console.log('Could not delete program');
    }
  } catch (err) {
    console.log(err.json())
  }
}

export async function saveProgram(token, programData) {
  try {
    const res = await fetch(`${API_URL}/programs/saveprogram`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        programData,
      }),
    });
    if (!res.ok) {
      console.log("Could not save program");
    }
    return res.json();
  } catch (err) {
    console.log(err.json());
  }
}

export async function getWorkoutById(token, workoutId) {
  try {
    const res = await fetch(`${API_URL}/workouts/${workoutId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      console.log("Could not fetch workout");
    }
    return res.json();
  } catch (err) {
    console.log(err.json());
  }
}

export async function deleteWorkout(token, workoutId) {
  try {
    const res = await fetch(`${API_URL}/workouts/${workoutId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      console.log("Could not delete workout");
    }
    return res.json();
  } catch (err) {
    console.log(err.json());
  }
}