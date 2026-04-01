const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// distance function
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI/180;
  const dLon = (lon2 - lon1) * Math.PI/180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ADD SCHOOL
app.post('/addSchool', (req, res) => {
  const {name, address, latitude, longitude} = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({error: "All fields required"});
  }

  db.run(
    `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`,
    [name, address, latitude, longitude],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({message: "School added", id: this.lastID});
    }
  );
});

// LIST SCHOOLS
app.get('/listSchools', (req, res) => {
  const {lat, lon} = req.query;

  db.all(`SELECT * FROM schools`, [], (err, rows) => {
    if (err) return res.status(500).json(err);

    const sorted = rows.map(school => {
      const distance = getDistance(lat, lon, school.latitude, school.longitude);
      return {...school, distance};
    }).sort((a, b) => a.distance - b.distance);

    res.json(sorted);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));