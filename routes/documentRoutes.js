const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
  uploadDocument,
} = require("../controllers/documentController");

// File upload settings
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads/");

  },

  filename: (req, file, cb) => {

    const fileName =
      Date.now() + "-" + file.originalname;

    cb(null, fileName);

  },

});

const upload = multer({
  storage,
});

// Upload API
router.post(
  "/upload",
  upload.single("file"),
  uploadDocument
);

module.exports = router;