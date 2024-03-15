const {Router} = require('express');
const {verifyToken, isAdmin} = require('../middleware/verifyjwt.middleware');
const upload = require('../middleware/multer.middleware');
const { CreateBanner, DeleteBanner, AllBanners, GetBanner, UpdateBanner } = require('../controllers/banner.controller');

const router = Router();
router.route('/add').post(verifyToken, isAdmin, upload.single('banner'), CreateBanner);
router.route('/delete/:id').delete(verifyToken, isAdmin, DeleteBanner);
router.route('/all').get(AllBanners);
router.route('/:id').get(verifyToken, isAdmin, GetBanner).put(verifyToken, isAdmin, upload.single("banner"), UpdateBanner);

module.exports = router