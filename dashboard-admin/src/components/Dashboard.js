import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Container, Paper } from "@mui/material";
import Filters from "./Filters";
import PresenzeTable from "./PresenzeTable";

export default function Dashboard({ token, onLogout }) {
  const [filters, setFilters] = useState({
    data: new Date().toISOString().slice(0, 10),
    luogo: "",
    nome: "",
  });

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Presenze Magazzino – Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Filters filters={filters} setFilters={setFilters} token={token} />
        </Paper>
        <PresenzeTable filters={filters} token={token} />
      </Container>
    </Box>
  );
}