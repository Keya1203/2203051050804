import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Alert, CircularProgress, Box } from '@mui/material';
import Log from './LoggingMiddleware';

function getLocation() {
  // Try to get coarse location from browser (if allowed)
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve(`${pos.coords.latitude.toFixed(2)},${pos.coords.longitude.toFixed(2)}`);
      },
      () => resolve(null),
      { timeout: 2000 }
    );
  });
}

export default function RedirectHandler() {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // loading, error, expired, success
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function handleRedirect() {
      const stored = localStorage.getItem('shortenedUrls');
      if (!stored) {
        setStatus('error');
        setMessage('Short link not found.');
        Log("frontend", "error", "page", `Short link not found: ${shortcode}`);
        return;
      }
      let urls = JSON.parse(stored);
      const idx = urls.findIndex(u => u.shortcode === shortcode);
      if (idx === -1) {
        setStatus('error');
        setMessage('Short link not found.');
        Log("frontend", "error", "page", `Short link not found: ${shortcode}`);
        return;
      }
      const urlObj = urls[idx];
      const now = new Date();
      if (now > new Date(urlObj.expiry)) {
        setStatus('expired');
        setMessage('This short link has expired.');
        Log("frontend", "warn", "page", `Short link expired: ${shortcode}`);
        return;
      }
      // Log the click
      const referrer = document.referrer || null;
      const location = await getLocation();
      const click = {
        timestamp: new Date().toISOString(),
        referrer,
        location,
      };
      urlObj.clicks.push(click);
      urls[idx] = urlObj;
      localStorage.setItem('shortenedUrls', JSON.stringify(urls));
      Log("frontend", "info", "page", `Short link clicked: ${shortcode}`);
      setStatus('success');
      setTimeout(() => {
        window.location.href = urlObj.url;
      }, 1200);
    }
    handleRedirect();
  }, [shortcode, navigate]);

  if (status === 'loading') {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>;
  }
  if (status === 'error' || status === 'expired') {
    return <Alert severity="error" sx={{ mt: 4 }}>{message}</Alert>;
  }
  if (status === 'success') {
    return <Alert severity="success" sx={{ mt: 4 }}>Redirecting to the original URL...</Alert>;
  }
  return null;
} 