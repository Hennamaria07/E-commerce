const {Router} = require('express');
const {verifyToken, isAdminAndSeller} = require('../middleware/verifyjwt.middleware');
const { CreateProduct, GetAllProducts, UpdateProduct, GetProduct, DeleteProduct, productFilteredByCategory, productFilteredByPrice, UpdateImg, BestDeals, LatestProduct } = require('../controllers/product.controller.js');
const upload = require('../middleware/multer.middleware.js');

const router = Router();
router.route('/add').post(verifyToken, isAdminAndSeller, upload.array('product', 5), CreateProduct);
router.route('/all').get(GetAllProducts);
router.route('/best-deals').get(BestDeals);
router.route('/hero-product').get(LatestProduct);
router.route('/update/:id').put(verifyToken, isAdminAndSeller,  UpdateProduct);
router.route('/update-image/:id').put(verifyToken, isAdminAndSeller,  upload.array('product', 5), UpdateImg);
router.route('/:id').get( GetProduct);
router.route('/delete/:id').delete(verifyToken, isAdminAndSeller, DeleteProduct)
router.route('/category-filter').post(productFilteredByCategory)
router.route('/price-filter').get(productFilteredByPrice)

module.exports = router;