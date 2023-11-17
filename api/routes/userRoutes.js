const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); 

router.post('/register', UserController.register);
router.post('/login', UserController.login); 
router.get('/users', UserController.getAllUsers); 
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser); 

module.exports = router;
