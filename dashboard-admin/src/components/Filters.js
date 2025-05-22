import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import axios from "axios";

export default function Filters({ filters, setFilters, token }) {
  const [luoghi, setLuoghi] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/luoghi", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLuoghi(res.data))
      .catch(() => setLuoghi([]));
  }, [token]);

  return (
    <Box display="flex" gap={2}>
      <TextField
        label="Data"
        type="date"
        value={filters.data}
        onChange={(e) => setFilters((f) => ({ ...f, data: e.target.value }))}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Luogo"
        select
        value={filters.luogo}
        onChange={(e) => setFilters((f) => ({ ...f, luogo: e.target.value }))}
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="">Tutti</MenuItem>
        {luoghi.map((l) => (
          <MenuItem key={l.id} value={l.id}>{l.nome}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Nome dipendente"
        value={filters.nome}
        onChange={(e) => setFilters((f) => ({ ...f, nome: e.target.value }))}
      />
      <Button
        variant="outlined"
        onClick={() => setFilters({ data: filters.data, luogo: "", nome: "" })}
      >
        Reset
      </Button>
    </Box>
  );
}