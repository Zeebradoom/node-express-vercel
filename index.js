// Import packages
const express = require("express");
const home = require("./routes/home");

// Middlewares
const app = express();
app.use(express.json());

// Routes

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});


// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
//hi