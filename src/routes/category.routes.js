const {Router} = require('express');
const {verifyToken, isAdmin} = require('../middleware/verifyjwt.middleware');
const { CreateCategory, DeleteCategory, AllCategories, GetCategory, UpdateCategory } = require('../controllers/category.controller.js');
const upload = require('../middleware/multer.middleware');

const router = Router();
router.route('/create').post(verifyToken, isAdmin, upload.single('icon'), CreateCategory);
router.route('/delete/:id').delete(verifyToken, isAdmin, DeleteCategory);
router.route('/all-categories').get(verifyToken, isAdmin, AllCategories);
router.route('/:id').get(verifyToken, isAdmin, GetCategory).put(verifyToken, isAdmin, upload.single("icon"), UpdateCategory);

module.exports = router