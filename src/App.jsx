import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ShortenPage from './pages/ShortenPage';
import StatsPage from './pages/StatsPage';
import RedirectHandler from './pages/RedirectHandler';
import LoggingMiddleware from './services/loggingMiddleware';


// Initialize logging middleware (if you already have one, swap the file)
LoggingMiddleware.init({ clientID: '7e818e1f-b255-4151-91f9-4f60a05f4eee' });


export default function App() {
return (
<>
<AppBar position="static">
<Toolbar>
<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
React URL Shortener
</Typography>
<Button color="inherit" component={Link} to="/">Shorten</Button>
<Button color="inherit" component={Link} to="/stats">Statistics</Button>
</Toolbar>
</AppBar>
<Container sx={{ mt: 4 }}>
<Routes>
<Route path="/" element={<ShortenPage />} />
<Route path="/stats" element={<StatsPage />} />
<Route path="/:shortcode" element={<RedirectHandler />} />
</Routes>
<Box sx={{ mt: 4, color: 'text.secondary' }}>
<Typography variant="caption">Runs on http://localhost:3000 (dev server)</Typography>
</Box>
</Container>
</>
);
}

