const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/connectDb");

const app = express();
app.use(express.json());
app.use(cors());

//Import route
const authRoutes = require("./routes/users");

//Middleware
app.use("/user", authRoutes);

//Server
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Server is up and running");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
