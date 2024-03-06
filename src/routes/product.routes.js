const {Router} = require('express');
const {verifyToken, isAdminAndSeller} = require('../middleware/verifyjwt.middleware');
const { CreateProduct, GetAllProducts, UpdateProduct, GetProduct, DeleteProduct } = require('../controllers/product.controller.js');
const upload = require('../middleware/multer.middleware.js');

const router = Router();
router.route('/add').post(verifyToken, isAdminAndSeller, upload.array('product', 5), CreateProduct);
router.route('/all').get(verifyToken, isAdminAndSeller, GetAllProducts);
// router.route('/update/:id').put(verifyToken, isAdminAndSeller, upload.array('product', 5), UpdateProduct);
router.route('/update/:id').put(verifyToken, isAdminAndSeller,  UpdateProduct);
router.route('/detail/:id').get(verifyToken, GetProduct);
router.route('/delete/:id').delete(verifyToken, isAdminAndSeller, DeleteProduct)

module.exports = router;