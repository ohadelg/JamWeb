import React, { useEffect, useState } from 'react';

function Index() {
  const [message, setMessage] = useState('Loading...'); // Set the initial message
  const [people, setPeople] = useState([]); // Set the initial message
  const [abilities, setAbilities] = useState({}); // Set the initial message

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message); // Set the new message from response
        setPeople(data.people); // Set the new people from response
        console.log('data: ', data);
        console.log('people: ', people);
        // Initialize abilities object with empty strings for each person
        setAbilities(data.people.reduce((acc, person) => ({ ...acc, [person]: '' }), {}));
      });
  }, []);

  const handleAbilityChange = (person, event) => {
    const newAbilities = { ...abilities, [person]: event.target.value };
    setAbilities(newAbilities);
    console.log('newAbilities: ', newAbilities);
  }

  return (
    <div>
      <div>{message}</div>

      {people.map((person, index) => (
        <div key={index}>
          <h1>{person}</h1>
          <input 
            type="text" 
            value={abilities[person]} 
            onChange={(event) => handleAbilityChange(person, event)} 
            placeholder="Enter ability" 
          />
        </div>
      ))}

      {/* Display the abilities for debugging */}
      <pre>{JSON.stringify(abilities, null, 2)}</pre> 
    </div>
  )
}

export default Index
