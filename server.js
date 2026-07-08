const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'donations-db.json');

// Create the JSON data file automatically if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ donation_clicks: [] }, null, 2));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Listen for button clicks from your frontend layout
app.post('/api/contribute', (req, res) => {
    const itemClicked = req.body.item || 'Unknown Campaign';
    
    try {
        const fileData = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        
        const newLog = {
            id: fileData.donation_clicks.length + 1,
            item_clicked: itemClicked,
            timestamp: new Date().toISOString()
        };
        
        fileData.donation_clicks.push(newLog);
        fs.writeFileSync(DB_FILE, JSON.stringify(fileData, null, 2));
        
        console.log(`[Database Logged] Interaction saved for: "${itemClicked}"`);
        res.json({ 
            success: true, 
            message: `Thank you! Your interest in "${itemClicked}" has been recorded locally.` 
        });
    } catch (err) {
        console.error('Database write error:', err.message);
        res.status(500).json({ success: false, message: 'Local storage logging failed.' });
    }
});

app.listen(PORT, () => {
    console.log(`Charity platform backend active on port ${PORT}`);
});

