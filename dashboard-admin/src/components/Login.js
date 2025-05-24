import React, { useState } from "react";
import { Button, TextField, Box, Typography, Paper } from "@mui/material";
import axios from "axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:3001/api/utenti/login", {
        email,
        password,
      }, {
        headers: { 'x-dashboard-login': 'true' }
      });
      onLogin(res.data.token);
    } catch (err) {
      setError("Credenziali errate");
    }
  };

  return (
    <Box
      sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Paper sx={{ p: 4, maxWidth: 350 }}>
        <Typography variant="h5" mb={2}>
          Login Admin
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            value={email}
            required
            fullWidth
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            required
            fullWidth
            margin="normal"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" mb={1}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}