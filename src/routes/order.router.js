const {Router} = require('express');
const { newOrder, GetOrder, myOrders, GetAllOrders, DeleteOrder, updateOrder } = require('../controllers/order.controller.js');
const { verifyToken, isAdmin, isAdminAndSeller } = require('../middleware/verifyjwt.middleware.js');

const router = Router();
router.route('/add').post(verifyToken, newOrder);
router.route('/detail/:id').get(verifyToken, GetOrder);
router.route('/myorder').get(verifyToken, myOrders);
router.route('/lists').get(verifyToken, isAdmin, GetAllOrders)
router.route('/delete/:id').delete(verifyToken, isAdminAndSeller, DeleteOrder);
router.route('/:id').put(verifyToken, isAdmin, updateOrder);

module.exports = router