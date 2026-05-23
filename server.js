const express = require("express");

const connectDB =
  require("./config/db");

const documentRoutes =
  require("./routes/documentRoutes");

const app = express();

app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use(
  "/api/documents",
  documentRoutes
);

app.get("/", (req, res) => {

  res.send("Server Running");

});

app.listen(5000, () => {

  console.log(
    "Server Started"
  );

});