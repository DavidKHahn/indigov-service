const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');

const app = express();
app.use(cors());
app.use(express.json());

let constituents = [];

// Load existing data from JSON file if it exists
const dataFile = 'constituents.json';
if (fs.existsSync(dataFile)) {
  constituents = JSON.parse(fs.readFileSync(dataFile));
}

// Route to get all constituents
app.get('/constituents', (req, res) => {
  res.json(constituents);
});

// Route to add or update a constituent
app.post('/constituents', (req, res) => {
  const { email, name, address } = req.body;
  const existing = constituents.find(c => c.email === email);
  
  if (existing) {
    existing.name = name;
    existing.address = address;
  } else {
    constituents.push({ email, name, address, signedUpAt: new Date() });
  }
  
  fs.writeFileSync(dataFile, JSON.stringify(constituents, null, 2));
  res.json({ message: 'Constituent added/updated', data: constituents });
});

// Delete a constituent
app.delete('/constituents/:email', (req, res) => {
    const { email } = req.params;
    const index = constituents.findIndex(c => c.email === email);
  
    if (index !== -1) {
      constituents.splice(index, 1); // Remove constituent from the array
      fs.writeFileSync(dataFile, JSON.stringify(constituents, null, 2));
      res.json({ message: `Constituent with email ${email} deleted successfully`, data: constituents });
    } else {
      res.status(404).json({ message: `Constituent with email ${email} not found` });
    }
  });

// Route to export constituents to a CSV file
app.get('/export', (req, res) => {
  const csvWriter = createObjectCsvWriter({
    path: 'constituents.csv',
    header: [
      { id: 'email', title: 'Email' },
      { id: 'name', title: 'Name' },
      { id: 'address', title: 'Address' },
      { id: 'signedUpAt', title: 'Signed Up At' },
    ],
  });

  csvWriter.writeRecords(constituents).then(() => {
    res.download('constituents.csv');
  });
});

// connect our backend code with the frontend
const path = require('path');
app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
