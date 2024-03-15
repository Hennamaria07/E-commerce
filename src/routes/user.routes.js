const {Router} = require('express');
const { Signup, login, GetAllUsers, GetUser, DeleteUser, UpdateUser, UpdatePassword, logOut } = require('../controllers/user.controller.js');
const {verifyToken, isAdmin} = require('../middleware/verifyjwt.middleware.js');
const upload = require('../middleware/multer.middleware.js');

const router = Router();
router.route('/signup').post(upload.single('avatar'), Signup);
router.route('/login').post(login);

// secure route
router.route('/all-users').get(verifyToken, isAdmin, GetAllUsers);
router.route('/details').get(verifyToken, GetUser);
router.route('/delete/:id').delete(verifyToken, DeleteUser);
router.route('/update').put(verifyToken, UpdateUser);
router.route('/update-password').put(verifyToken, UpdatePassword);
router.route('/logout').post(verifyToken, logOut);
module.exports = router;