import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from "@mui/material";
import { getAllLinks } from "../services/urlService";

export default function StatsPage() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const data = getAllLinks();
    setLinks(data);
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Shortened URL Statistics
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Shortcode</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell>Clicks</TableCell>
            <TableCell>Expiry</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.shortcode}>
              <TableCell>{link.shortcode}</TableCell>
              <TableCell>{link.originalUrl}</TableCell>
              <TableCell>{link.clicks.length}</TableCell>
              <TableCell>
                {new Date(link.expiresAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
