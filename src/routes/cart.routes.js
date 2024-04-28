const { Router } = require("express");
const { create, allProducts } = require("../controllers/cart.controller");
const { verifyToken } = require("../middleware/verifyjwt.middleware");

const router = new Router();

router.route("/").post(verifyToken, create);
router.route("/lists").get(verifyToken, allProducts);

module.exports = router