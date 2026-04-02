const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get("/schools", (req, res) => {
  res.json([
    { id: 1, name: "ABC School", city: "Delhi" },
    { id: 2, name: "XYZ School", city: "Mumbai" }
  ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
