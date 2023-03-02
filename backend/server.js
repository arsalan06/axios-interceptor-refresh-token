//Installed Modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

//Imported  Modules
const connectDB = require("./config/db");
const { upload } = require("./middlewares/multerMiddleware");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

//Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/user", userRoutes);
app.use("/api/book", bookRoutes);

app.post("/api/upload", upload.single("file"), (req, res) => {
  res.json({ filename: req.file.filename });
});

app.use((error, req, res, next) => {
  res.json({
    errorMessage: error.message,
    statusCode: res.statusCode,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server Started Listening on PORT:${PORT}`);
});
