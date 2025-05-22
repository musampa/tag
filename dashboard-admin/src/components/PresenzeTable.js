import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, CircularProgress } from "@mui/material";
import axios from "axios";

export default function PresenzeTable({ filters, token }) {
  const [presenze, setPresenze] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3001/api/presenze/giorno", {
        params: { data: filters.data },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setPresenze(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters.data, token]);

  // Filtri lato client su luogo e nome
  const filtered = presenze
    .filter((p) => (filters.luogo ? p.luogo_id === Number(filters.luogo) : true))
    .filter((p) => (filters.nome ? p.nome.toLowerCase().includes(filters.nome.toLowerCase()) : true));

  return (
    <Paper>
      {loading ? (
        <CircularProgress sx={{ m: 3 }} />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome Dipendente</TableCell>
              <TableCell>Entrata</TableCell>
              <TableCell>Uscita</TableCell>
              <TableCell>Stato</TableCell>
              <TableCell>Dettagli</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.nome}</TableCell>
                <TableCell>{row.entrata || "-"}</TableCell>
                <TableCell>{row.uscita || "-"}</TableCell>
                <TableCell>{row.stato}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">
                    Info
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Nessun dato disponibile
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}