const express = require('express');
const Datastore = require('nedb');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize the database file
const db = new Datastore({ filename: './donations.db', autoload: true });

// Handle form submissions from the homepage
app.post('/report-donation', (req, res) => {
    const { name, amount, reference } = req.body;
    
    const newDonation = {
        name,
        amount: parseInt(amount) || 0,
        reference,
        date: new Date().toLocaleString()
    };

    db.insert(newDonation, (err, doc) => {
        if (err) {
            return res.status(500).send("Error saving submission.");
        }
        res.send(`
            <div style="text-align:center; padding: 3rem; font-family: Arial, sans-serif;">
                <h2 style="color: #2e7d32;">Thank you, ${name}!</h2>
                <p>Your contribution report has been logged successfully.</p>
                <a href="/" style="color: #007BFF; text-decoration: none; font-weight: bold;">Go Back Home</a>
            </div>
        `);
    });
});

// ADMIN DATA PORTAL
app.get('/admin', (req, res) => {
    db.find({}).sort({ date: -1 }).exec((err, docs) => {
        if (err) {
            return res.status(500).send("Error reading database.");
        }

        let tableRows = '';
        docs.forEach((row, index) => {
            tableRows += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${row.name}</td>
                    <td>KES ${row.amount}</td>
                    <td><code>${row.reference}</code></td>
                    <td>${row.date}</td>
                </tr>
            `;
        });

        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Brian Kimathi Foundation — Data Panel</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f4f6f9; color: #333; }
                    .dashboard-container { max-width: 900px; margin: auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                    h2 { color: #1b5e20; border-bottom: 3px solid #2e7d32; padding-bottom: 10px; margin-top: 0; }
                    .table-wrapper { overflow-x: auto; margin-top: 20px; }
                    table { width: 100%; border-collapse: collapse; text-align: left; }
                    th, td { padding: 14px; border-bottom: 1px solid #ddd; }
                    th { background-color: #2e7d32; color: white; font-weight: bold; }
                    tr:hover { background-color: #f1f8e9; }
                    .back-btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="dashboard-container">
                    <h2>Brian Kimathi Foundation — Data Dashboard</h2>
                    <p>Live transaction logs stored on your device:</p>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Donor / Name</th>
                                    <th>Amount</th>
                                    <th>M-Pesa Reference</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows || '<tr><td colspan="5" style="text-align:center; color:#888;">No submissions logged yet.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                    <a href="/" class="back-btn">← Back to Portal</a>
                </div>
            </body>
            </html>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`Server live at http://localhost:${PORT}`);
});

