import React, { useState } from 'react';
import { Box, TextField, Button, Grid, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const defaultRow = { url: '', validity: '', shortcode: '' };

export default function UrlShortenerForm({ onSubmit }) {
  const [rows, setRows] = useState([{ ...defaultRow }]);
  const [errors, setErrors] = useState([{}]);

  const handleChange = (idx, field, value) => {
    const newRows = [...rows];
    newRows[idx][field] = value;
    setRows(newRows);
  };

  const handleAddRow = () => {
    if (rows.length < 5) {
      setRows([...rows, { ...defaultRow }]);
      setErrors([...errors, {}]);
    }
  };

  const handleRemoveRow = (idx) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== idx));
      setErrors(errors.filter((_, i) => i !== idx));
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = rows.map((row) => {
      const err = {};
      if (!row.url || !/^https?:\/\/.+\..+/.test(row.url)) {
        err.url = 'Enter a valid URL (must start with http:// or https://)';
        valid = false;
      }
      if (row.validity && (!/^[0-9]+$/.test(row.validity) || parseInt(row.validity) <= 0)) {
        err.validity = 'Enter a positive integer for validity (minutes)';
        valid = false;
      }
      if (row.shortcode && !/^[a-zA-Z0-9_-]{3,20}$/.test(row.shortcode)) {
        err.shortcode = 'Shortcode must be 3-20 chars, letters, numbers, - or _';
        valid = false;
      }
      return err;
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(rows);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>Shorten up to 5 URLs</Typography>
      {rows.map((row, idx) => (
        <Grid container spacing={2} alignItems="center" key={idx} sx={{ mb: 1 }}>
          <Grid item xs={12} md={5}>
            <TextField
              label="Original URL"
              value={row.url}
              onChange={e => handleChange(idx, 'url', e.target.value)}
              required
              fullWidth
              error={!!errors[idx]?.url}
              helperText={errors[idx]?.url}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              label="Validity (minutes)"
              value={row.validity}
              onChange={e => handleChange(idx, 'validity', e.target.value)}
              fullWidth
              error={!!errors[idx]?.validity}
              helperText={errors[idx]?.validity || 'Default: 30'}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Custom Shortcode (optional)"
              value={row.shortcode}
              onChange={e => handleChange(idx, 'shortcode', e.target.value)}
              fullWidth
              error={!!errors[idx]?.shortcode}
              helperText={errors[idx]?.shortcode}
            />
          </Grid>
          <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
            {rows.length > 1 && (
              <IconButton color="error" onClick={() => handleRemoveRow(idx)} aria-label="Remove row">
                <RemoveCircleOutlineIcon />
              </IconButton>
            )}
            {idx === rows.length - 1 && rows.length < 5 && (
              <IconButton color="primary" onClick={handleAddRow} aria-label="Add row">
                <AddCircleOutlineIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      ))}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Shorten URLs
      </Button>
    </Box>
  );
} 