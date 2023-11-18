const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); 
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.join(__dirname, '../assets'), // Gunakan __dirname
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage
})

router.post('/login', UserController.login);;
router.post('/register', UserController.register);; 
router.post('/superenkripsi', UserController.superenkripsi); 
router.post('/superdekripsi', UserController.superdekripsi); 
router.post('/history', UserController.history); 
router.post('/encryptImage', UserController.encryptImage); 
router.post('/masukgambar',upload.single('image') ,UserController.masukgambar); 

module.exports = router;
