import "../styles.css";
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const BooksTable = ({ showBooks, setShowBooks, error, setError }) => {
  const [books, setBooks] = useState([]); //State to store fetched books
  const [authorBooks, setAuthorBooks] = useState([]); //State to select books by a selected author
  const [selectedAuthor, setSelectedAuthor] = useState(""); // state to store selected author
  const [open, setOpen] = useState(false); // State to manage modal open/close
  const [loading, setLoading] = useState(false); // State to manage loading state for author books
  const [loadingBooks, setLoadingBooks] = useState(true); //State to manage loading state for fetching books

  //Function top open and close the modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  /*This function is responsible to call the Open Library API fpr fetching all the book details with title = Lord of the rings"*/
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        /*Calling the API*/
        const response = await fetch(
          'https://openlibrary.org/search.json?q=title:"lord of the rings"',
        );
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data.docs);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Error fetching books. Please try again later.");
      } finally {
        setLoadingBooks(false);
      }
    };

    fetchBooks(); //Fetch books
    console.log(books);
  }, []);

  //Function to handle the click on Author names
  const handleAuthorClick = async (author) => {
    handleOpen();
    setLoading(true);
    setSelectedAuthor(author);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?author=${author}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch books by author");
      }
      const data = await response.json();
      console.log(data);
      setAuthorBooks(data.docs.slice(0, 5));
    } catch (error) {
      console.error("Error fetching books by author:", error);
      setError("Error fetching books by this author. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const analyzeAuthorBooks = () => {
    const decadeCount = {};
    authorBooks.forEach((book) => {
      const decade = Math.floor(book.first_publish_year / 10) * 10;
      if (decadeCount[decade]) {
        decadeCount[decade]++;
      } else {
        decadeCount[decade] = 1;
      }
    });

    const bookTypes = {};
    authorBooks.forEach((book) => {
      const type = book.type ? book.type : "Unknown";
      if (bookTypes[type]) {
        bookTypes[type]++;
      } else {
        bookTypes[type] = 1;
      }
    });

    return {
      decadeCount,
      bookTypes,
    };
  };

  const chartData = {
    labels: Object.keys(analyzeAuthorBooks().decadeCount),
    datasets: [
      {
        label: "Books Published",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.4)",
        hoverBorderColor: "rgba(75,192,192,1)",
        data: Object.values(analyzeAuthorBooks().decadeCount),
      },
    ],
  };

  return (
    <div className="App">
      <h2>Lord of the Rings Books</h2>
      {loadingBooks ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author(s)</th>
              <th>First Publish Year</th>
              <th>Work</th>
              <th>Average Ratings</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.key}>
                <td>{book.title_suggest}</td>
                <td>
                  {book.author_name
                    ? book.author_name.map((author) => (
                        <span
                          key={author}
                          onClick={() => handleAuthorClick(author)}
                          style={{ cursor: "pointer", color: "blue" }}
                        >
                          {author}
                        </span>
                      ))
                    : "Unknown"}
                </td>
                <td>{book.first_publish_year}</td>
                <td>{book.type ? book.type : "Unknown"}</td>
                <td>
                  {book.ratings_average ? book.ratings_average : "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Author Details
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <div>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                {selectedAuthor && (
                  <div>
                    <h3>Books by {selectedAuthor}</h3>
                    <ul>
                      {authorBooks.map((book) => (
                        <li key={book.key}>
                          <strong>{book.title}</strong> (
                          {book.first_publish_year})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Typography>

              <div style={{ marginTop: 20 }}>
                <h3>Data Analysis</h3>
                <Bar
                  data={chartData}
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
          <Button onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default BooksTable;
