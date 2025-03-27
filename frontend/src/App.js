import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [constituents, setConstituents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    axios.get('http://localhost:3000/constituents')
      .then(response => setConstituents(response.data))
      .catch(error => console.error('Error fetching constituents:', error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = () => {
    const sortedConstituents = [...constituents].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (nameA > nameB) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
    setConstituents(sortedConstituents);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredConstituents = constituents.filter((constituent) =>
    constituent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Constituents</h1>
      <input
        type="text"
        placeholder="Search by Name"
        value={searchTerm}
        onChange={handleSearch}
      />
      <button onClick={handleSort}>
        Sort by Name ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
      </button>
      <ul>
        {filteredConstituents.map((constituent, index) => (
          <li key={index}>
            <strong>{constituent.name}</strong>
            <p>{constituent.email}</p>
            <p>{constituent.address}</p>
            <p>Signed Up At: {new Date(constituent.signedUpAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
