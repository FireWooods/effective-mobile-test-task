const Router = require('express');
const remainsController = require('../controller/remains_controller');

const router = new Router();

router.post('/order/:id', remainsController.createOrder);
router.patch('/add/:id', remainsController.addMoreProduct);
router.get('/shelf', remainsController.getRemainsOnShelf);
router.get('/order', remainsController.getRemainsOnOrder);

module.exports = router;
