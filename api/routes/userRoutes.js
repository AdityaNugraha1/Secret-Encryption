const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); 
const multer = require('multer');
const path = require('path');

// Set up storage options for multer
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../assets'), // Gunakan __dirname
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Set up multer with size limits
const upload = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10 MB file size limit
      fieldSize: 10 * 1024 * 1024  // 10 MB field size limit
    }
  });

// Define routes
router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/superenkripsi', UserController.superenkripsi); 
router.post('/superdekripsi', UserController.superdekripsi); 
router.post('/history', UserController.history); 
router.post('/masukgambar',upload.single('image') ,UserController.masukgambar); 
router.post('/dekripgambar',upload.single('image') ,UserController.dekripgambar); 
router.post('/sendToServer',upload.single('imageLoader') ,UserController.sendToServer); 
router.post('/sendToServer2',upload.single('imageLoader2') ,UserController.sendToServer2); 
// Export the router
module.exports = router;
