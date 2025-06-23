import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Collapse, Box, Typography
} from '@mui/material';

export default function UrlStatsTable({ data }) {
  const [openIdx, setOpenIdx] = useState(-1);

  const handleToggle = idx => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Short URL</TableCell>
            <TableCell>Original URL</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Expiry</TableCell>
            <TableCell>Total Clicks</TableCell>
            <TableCell>Click Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <React.Fragment key={row.shortcode}>
              <TableRow>
                <TableCell>
                  <a href={`/${row.shortcode}`} target="_blank" rel="noopener noreferrer">
                    {window.location.origin}/{row.shortcode}
                  </a>
                </TableCell>
                <TableCell>{row.url}</TableCell>
                <TableCell>{new Date(row.created).toLocaleString()}</TableCell>
                <TableCell>{new Date(row.expiry).toLocaleString()}</TableCell>
                <TableCell>{row.clicks.length}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleToggle(idx)}>
                    {openIdx === idx ? 'Hide' : 'Show'}
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                  <Collapse in={openIdx === idx} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Typography variant="subtitle2">Click Details</Typography>
                      {row.clicks.length === 0 ? (
                        <Typography variant="body2">No clicks yet.</Typography>
                      ) : (
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Timestamp</TableCell>
                              <TableCell>Referrer</TableCell>
                              <TableCell>Location</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.clicks.map((click, cidx) => (
                              <TableRow key={cidx}>
                                <TableCell>{new Date(click.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{click.referrer || '-'}</TableCell>
                                <TableCell>{click.location || '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
