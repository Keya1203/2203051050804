import React, { useState, useEffect } from 'react';
import UrlShortenerForm from '../components/UrlShortenerForm';
import Log from '../components/LoggingMiddleware';
import { Alert, Box, IconButton, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar } from '@mui/material';
import { generateShortcode, isShortcodeUnique, getExpiryDate } from '../utils/urlUtils';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ShortenerPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [shortened, setShortened] = useState(() => {
    // Load from localStorage if available
    const stored = localStorage.getItem('shortenedUrls');
    return stored ? JSON.parse(stored) : [];
  });
  const [copied, setCopied] = useState('');

  // Persist to localStorage whenever shortened changes
  useEffect(() => {
    localStorage.setItem('shortenedUrls', JSON.stringify(shortened));
  }, [shortened]);

  const handleShorten = (rows) => {
    let newShortened = [...shortened];
    let hasError = false;
    let errorMsg = '';

    rows.forEach((row) => {
      let shortcode = row.shortcode || generateShortcode();
      let validity = row.validity ? parseInt(row.validity) : 30;
      // Ensure shortcode uniqueness
      if (!isShortcodeUnique(shortcode, newShortened)) {
        hasError = true;
        errorMsg = `Shortcode '${shortcode}' already exists. Please choose another.`;
        Log("frontend", "error", "component", `Shortcode collision: ${shortcode}`);
        return;
      }
      // Add to list
      const now = new Date();
      const expiry = getExpiryDate(validity);
      const item = {
        url: row.url,
        shortcode,
        created: now,
        expiry,
        clicks: [], // { timestamp, referrer, location }
      };
      newShortened.push(item);
      Log("frontend", "info", "api", `Short link created: ${shortcode} for ${row.url}`);
    });

    if (hasError) {
      setError(errorMsg);
      setSuccess(false);
      setTimeout(() => setError(''), 4000);
      return;
    }
    setShortened(newShortened);
    setSuccess(true);
    setError('');
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleCopy = (shortUrl) => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(shortUrl);
    setTimeout(() => setCopied(''), 2000);
    Log("frontend", "info", "component", `Short URL copied: ${shortUrl}`);
  };

  return (
    <div>
      {success && <Alert severity="success">Shorten request successful!</Alert>}
      {error && <Alert severity="error">{error}</Alert>}
      <UrlShortenerForm onSubmit={handleShorten} />
      {/* Preview of shortened URLs */}
      {shortened.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Expiry</TableCell>
                  <TableCell>Copy</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shortened.map((row) => {
                  const shortUrl = `${window.location.origin}/${row.shortcode}`;
                  return (
                    <TableRow key={row.shortcode}>
                      <TableCell>
                        <a href={`/${row.shortcode}`} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
                      </TableCell>
                      <TableCell>{row.url}</TableCell>
                      <TableCell>{new Date(row.expiry).toLocaleString()}</TableCell>
                      <TableCell>
                        <Tooltip title="Copy to clipboard">
                          <IconButton onClick={() => handleCopy(shortUrl)}>
                            <ContentCopyIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Snackbar
            open={!!copied}
            message="Short URL copied!"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={2000}
            onClose={() => setCopied('')}
          />
        </Box>
      )}
    </div>
  );
} 