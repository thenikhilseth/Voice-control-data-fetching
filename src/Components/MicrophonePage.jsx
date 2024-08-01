// MicrophonePage.js
import React, { useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import DatatonicBanner from "../assets/air_canada.png";
import { useNavigate } from "react-router-dom";

const MicrophonePage = ({ setShowBooks }) => {
  const [isListening, setIsListening] = useState(false); // State to manage if the microphone is listening or not

  const navigate = useNavigate(); //Used to navigate between pages

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition; // Voice Recognition API
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported"); //Alert if speech recognition is not supported.
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US"; //Language set to English (US)
    recognition.interimResults = false;
    recognition.maxAlternatives = 1; //Only 1 alternative result

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase(); //Get transcript from event
      if (transcript.includes("lord of the rings")) {
        //If transcript inlude- "Lord of the Rings", show Books
        setShowBooks(true);
        navigate("/books");
      } else {
        // Show alert and re-enable the button after user clicks "OK"
        window.confirm(
          "Please say 'Give me all the books with title Lord of the Rings'",
        );
        setIsListening(false); // Re-enable the button
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Error recognizing speech");
      setIsListening(false); // Re-enable the button in case of error
    };

    recognition.start();
    setIsListening(true); // Disable the button while listening
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      sx={{ overflow: "hidden" }}
    >
      <Box
        style={{
          width: "100%",
          height: "130px",
          backgroundImage: `url(${DatatonicBanner})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          mt: 5,
        }}
      ></Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex="1"
        sx={{ textAlign: "center" }}
      >
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          <span role="img" aria-label="microphone" style={{ fontSize: "55px" }}>
            🎙️
          </span>
          <br />
          Got a 'Lord of the Rings' obsession? <br />
          📚Note: <span style={{ color: "red" }}>Say</span> 'Give me all the
          books with title Lord of the Rings'
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={startListening}
          disabled={isListening}
          sx={{ display: "block", mx: "auto", mt: 3 }}
        >
          Start Listening
        </Button>
      </Box>
      {/* Footer Section */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#f1f1f1",
          py: 2,
          textAlign: "center",
          borderTop: "1px solid #ccc",
        }}
      >
        <Typography variant="h5">Assignment by: Nikhil Seth</Typography>
        <Typography variant="h5">
          Education: Master of Engineering, Concordia University
        </Typography>
      </Box>
    </Box>
  );
};

export default MicrophonePage;
