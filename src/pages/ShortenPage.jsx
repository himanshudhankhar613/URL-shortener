import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ShortenForm from '../shared/ShortenForm';
import { loadAllLinks } from '../services/storage';


export default function ShortenPage() {
const [recent, setRecent] = useState(loadAllLinks().slice().reverse().slice(0,5));


return (
<Grid container spacing={2}>
<Grid item xs={12} md={7}>
<Paper sx={{ p: 3 }}>
<Typography variant="h6" gutterBottom>Shorten up to 5 URLs</Typography>
<ShortenForm onCreated={() => setRecent(loadAllLinks().slice().reverse().slice(0,5))} />
</Paper>
</Grid>
<Grid item xs={12} md={5}>
<Paper sx={{ p: 3 }}>
<Typography variant="subtitle1">Recent Shortened Links</Typography>
{recent.length === 0 && <Typography variant="body2">No links yet.</Typography>}
{recent.map(l => (
<Paper key={l.shortcode} sx={{ p: 1, mt: 1 }} variant="outlined">
<Typography variant="body2"><strong>Short:</strong> http://localhost:3000/{l.shortcode}</Typography>
<Typography variant="body2"><strong>Original:</strong> {l.originalUrl}</Typography>
<Typography variant="caption">Expires: {new Date(l.expiresAt).toLocaleString()}</Typography>
</Paper>
))}
</Paper>
</Grid>
</Grid>
);
}

