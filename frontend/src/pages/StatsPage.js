import React, { useEffect, useState } from 'react';
import UrlStatsTable from '../components/UrlStatsTable';
import { Typography, Box } from '@mui/material';

export default function StatsPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Try to load from localStorage
    const stored = localStorage.getItem('shortenedUrls');
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Shortened URL Statistics</Typography>
      {data.length === 0 ? (
        <Typography>No URLs have been shortened yet.</Typography>
      ) : (
        <UrlStatsTable data={data} />
      )}
    </Box>
  );
} 