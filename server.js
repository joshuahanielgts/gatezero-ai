import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import compression from 'compression';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// Enable gzip compression
app.use(compression());

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Serve static files from dist folder
app.use(express.static(join(__dirname, 'dist'), {
    maxAge: '1d',
    etag: true,
}));

// Health check endpoint for Render
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'gatezero-web' });
});

// API info endpoint
app.get('/api/info', (req, res) => {
    res.json({
        name: 'GateZero',
        version: '1.0.0',
        tagline: 'Zero Penalties. Zero Friction.',
        environment: process.env.NODE_ENV || 'development',
    });
});

// SPA fallback - serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GateZero server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
});