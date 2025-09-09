import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findLinkByShortcode, upsertLink } from '../services/storage';
import LoggingMiddleware from '../services/loggingMiddleware';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function RedirectHandler() {
const { shortcode } = useParams();
const navigate = useNavigate();


useEffect(() => {
const link = findLinkByShortcode(shortcode);
if (!link) {
LoggingMiddleware.log('redirect_failed', { shortcode, reason: 'not_found' });
// show not found message briefly then redirect to home
setTimeout(() => navigate('/'), 1500);
return;
}
// check expiry
if (new Date(link.expiresAt).getTime() < Date.now()) {
LoggingMiddleware.log('redirect_failed', { shortcode, reason: 'expired' });
setTimeout(() => navigate('/'), 1500);
return;
}


// collect coarse click data
const click = {
ts: new Date().toISOString(),
source: navigator.userAgent || 'unknown',
tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown'
// Note: For privacy and offline usage we don't call external geo APIs.
};
link.clicks = link.clicks || [];
link.clicks.push(click);
upsertLink(link);
LoggingMiddleware.log('redirect', { shortcode, click });


// perform client-side redirect to original
window.location.href = link.originalUrl;
}, [shortcode, navigate]);


return (
<Box sx={{ textAlign: 'center', mt: 6 }}>
<CircularProgress />
<Typography variant="body1" sx={{ mt: 2 }}>Redirecting...</Typography>
</Box>
);
}