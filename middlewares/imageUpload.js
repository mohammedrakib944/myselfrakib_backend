const multer = require("multer");
const path = require("path");

const UPLOAD_FOLDER = `./public/uploads`;

// Set storage engine
const storage = multer.diskStorage({
  destination: UPLOAD_FOLDER,
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, //1MB
  },
  fileFilter: (res, file, cb) => {
    if (file.mimetype.includes("image")) {
      cb(null, true);
    } else {
      cb("You can upload only images.", false);
    }
  },
});

//Main Middleware
const imageUpload = (req, res, next) => {
  // multer middleware
  upload.single("image")(req, res, (err) => {
    if (err) {
      let errorMessage = err.message || err || "File upload failed!";
      next(errorMessage);
    } else {
      //If everything ok, go to next middleware
      next();
    }
  });
};
module.exports = imageUpload;
