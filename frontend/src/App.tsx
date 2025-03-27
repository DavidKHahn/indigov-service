import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";

interface Constituent {
  email: string;
  name: string;
  address: string;
  signedUpAt: string;
}

const App = () => {
  const [constituents, setConstituents] = useState<Constituent[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Fetch constituents data
  useEffect(() => {
    axios
      .get("http://localhost:3000/constituents")
      .then((response) => setConstituents(response.data))
      .catch((error) => console.error("Error fetching constituents:", error));
  }, []);

  // Handle search input
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handle sorting by name
  const handleSort = () => {
    const sortedConstituents = [...constituents].sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (nameA > nameB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });
    setConstituents(sortedConstituents);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Filter constituents by search
  const filteredConstituents = constituents.filter((constituent) =>
    constituent.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete a constituent
  const handleDelete = (email: string) => {
    axios
      .delete(`http://localhost:3000/constituents/${email}`)
      .then((response) => {
        setConstituents(response.data);
        alert(response.data.message);
      })
      .catch((error) => console.error("Error deleting constituent:", error));
  };

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
        Sort by Name ({sortOrder === "asc" ? "Ascending" : "Descending"})
      </button>
      <ul>
        {filteredConstituents.map((constituent) => (
          <li key={constituent.email}>
            <strong>{constituent.name}</strong>
            <p>{constituent.email}</p>
            <p>{constituent.address}</p>
            <p>
              Signed Up At: {new Date(constituent.signedUpAt).toLocaleString()}
            </p>
            <button onClick={() => handleDelete(constituent.email)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
