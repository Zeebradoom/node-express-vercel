// Import packages
const express = require("express");
const home = require("./routes/home");
// const staticGzip = require('express-static-gzip');

// Middlewares
const app = express();
app.use(express.json());

// Routes
// app.use('/', staticGzip('frontend'));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});


// connection
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
//hi