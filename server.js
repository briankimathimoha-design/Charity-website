const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve your static website files (HTML, CSS, Images)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Handle contribution submissions
app.post('/api/contribute', (req, res) => {
    console.log('Contribution intent received!');
    res.json({ success: true, message: 'Redirecting to secure processing gateway...' });
});

app.listen(PORT, () => {
    console.log(`Charity platform backend active on port ${PORT}`);
});

