const Router = require('express');
const productController = require('../controller/product_controller');
const remainsRouter = require('../routes/remains_routes');

const router = new Router();

router.post('/product', productController.createProduct);
router.post('/product/:id', productController.addProductOnShelf);
router.get('/product', productController.getProduct);

router.use('/remains', remainsRouter);

module.exports = router;
