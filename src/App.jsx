import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MicrophonePage from "./Components/MicrophonePage";
import BooksTable from "./Components/BooksTable";

function App() {
  const [showBooks, setShowBooks] = useState(false); //State to decide the visibility of BooksTable component.
  const [error, setError] = useState(null); //State for Errors.

  return (
    <Router>
      <Routes>
        {/** Route to the Home Page */}
        <Route
          path="/"
          element={
            <MicrophonePage setShowBooks={setShowBooks} setError={setError} />
          }
        />
        {/** Route to the Books Table Page */}
        <Route
          path="/books"
          element={
            <BooksTable
              showBooks={showBooks}
              setShowBooks={setShowBooks}
              error={error}
              setError={setError}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
