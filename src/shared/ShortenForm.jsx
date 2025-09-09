import React, { useState } from "react";
import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import LoggingMiddleware from "../services/loggingMiddleware";
import {
  generateShortcode,
  shortcodeExists,
  upsertLink,
} from "../services/urlService";

const ShortenForm = ({ onCreated }) => {
  const [rows, setRows] = useState([
    { originalUrl: "", validity: "", shortcode: "" },
  ]);
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([]);

  /** ✅ Update Row Inputs */
  const updateRow = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  /** ✅ Add New Row */
  const addRow = () => {
    if (rows.length >= 5) return;
    setRows([...rows, { originalUrl: "", validity: "", shortcode: "" }]);
  };

  /** ✅ URL Validator */
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  /** ✅ Form Submit Handler */
  const submitForm = (e) => {
    e.preventDefault();
    const newErrors = [];
    const newResults = [];

    rows.forEach((row, i) => {
      const originalUrl = row.originalUrl.trim();
      const validityMinutes = parseInt(row.validity) || 30;
      let codeToUse = row.shortcode.trim();
      let attempts = 0;

      // ✅ URL Validation
      if (!isValidUrl(originalUrl)) {
        newErrors.push(`Row ${i + 1}: Invalid URL`);
        return;
      }

      // ✅ Shortcode Handling
      if (codeToUse) {
        if (!/^[a-zA-Z0-9_-]+$/.test(codeToUse)) {
          newErrors.push(`Row ${i + 1}: Invalid shortcode format`);
          return;
        }
        if (shortcodeExists(codeToUse)) {
          newErrors.push(
            `Row ${i + 1}: Shortcode collision for provided shortcode`
          );
          return;
        }
      } else {
        // ✅ Auto-generate shortcode if none provided
        do {
          codeToUse = generateShortcode(6);
          attempts++;
          if (attempts > 5) {
            newErrors.push(
              `Row ${i + 1}: Unable to generate unique shortcode`
            );
            return;
          }
        } while (shortcodeExists(codeToUse));
      }

      // ✅ Link Creation
      const now = Date.now();
      const expiresAt = now + validityMinutes * 60 * 1000;
      const link = {
        shortcode: codeToUse,
        originalUrl,
        createdAt: new Date(now).toISOString(),
        expiresAt: new Date(expiresAt).toISOString(),
        clicks: [],
      };

      // ✅ Save link to storage
      upsertLink(link);
      newResults.push(link);

      // ✅ Log the event
      LoggingMiddleware.log("shorten_created", {
        shortcode: codeToUse,
        originalUrl,
        validityMinutes,
      });
    });

    setErrors(newErrors);
    setResults(newResults);
    if (newResults.length > 0 && onCreated) onCreated();
  };

  return (
    <Box component="form" onSubmit={submitForm} sx={{ p: 2 }}>
      {/* ✅ Display Errors */}
      {errors.length > 0 &&
        errors.map((err, i) => (
          <Alert severity="error" key={i} sx={{ mb: 1 }}>
            {err}
          </Alert>
        ))}

      {/* ✅ Input Rows */}
      <Stack spacing={2}>
        {rows.map((r, idx) => (
          <Box
            key={idx}
            sx={{ border: "1px solid #eee", p: 2, borderRadius: 1 }}
          >
            <TextField
              fullWidth
              label={`Original URL (row ${idx + 1})`}
              value={r.originalUrl}
              onChange={(e) => updateRow(idx, "originalUrl", e.target.value)}
              sx={{ mb: 1 }}
            />
            <TextField
              label="Validity (minutes)"
              value={r.validity}
              onChange={(e) => updateRow(idx, "validity", e.target.value)}
              sx={{ mr: 1, width: "40%" }}
            />
            <TextField
              label="Preferred shortcode (optional)"
              value={r.shortcode}
              onChange={(e) => updateRow(idx, "shortcode", e.target.value)}
              sx={{ width: "55%" }}
            />
          </Box>
        ))}

        {/* ✅ Buttons */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={addRow}
            disabled={rows.length >= 5}
          >
            Add Row
          </Button>
          <Button type="submit" variant="contained">
            Create Short Links
          </Button>
        </Stack>

        {/* ✅ Show Created Links */}
        {results.length > 0 && (
          <Box>
            <Typography variant="subtitle1">Created Short Links:</Typography>
            {results.map((r) => (
              <Box
                key={r.shortcode}
                sx={{
                  mt: 1,
                  p: 1,
                  border: "1px dashed #ddd",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">
                  Short:{" "}
                  <a
                    href={`http://localhost:3000/${r.shortcode}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    http://localhost:3000/{r.shortcode}
                  </a>
                </Typography>
                <Typography variant="body2">
                  Expires: {new Date(r.expiresAt).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ShortenForm;
