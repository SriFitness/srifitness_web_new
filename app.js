import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from the .next directory
app.use(express.static(path.join(__dirname, '.next')));

// For all other routes, serve the Next.js app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '.next', 'server', 'pages', 'index.html'));
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});