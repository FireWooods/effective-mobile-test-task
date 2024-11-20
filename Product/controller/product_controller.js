const db = require('../db');

async function sendActions(action) {
    await fetch('http://localhost:3001/api/actions', {
        method: 'POST',
        body: JSON.stringify(action),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return action;
}

class ProductController {
    // Создание товара
    async createProduct(req, res) {
        try {
            const { productName, plu } = req.body;

            const product = await db.query(
                `SELECT * FROM product where productName = $1`,
                [productName]
            );

            const isProductAlreadyExist = product.rows[0];

            if (!isProductAlreadyExist) {
                const newProduct = await db.query(
                    `INSERT INTO product (productName, plu) values ($1, $2) RETURNING *`,
                    [productName, plu]
                );

                res.send({ success: true, body: newProduct.rows[0], action });
            } else {
                res.status(400).send({
                    success: false,
                    message: 'Product is already exist',
                });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send({ success: false, message: 'Server error' });
        }
    }

    // Создание остатка
    async addProductOnShelf(req, res) {
        try {
            const productId = req.params.id;
            const { shopName, quantity } = req.body;

            const product = await db.query(
                `SELECT * FROM product where id = $1`,
                [productId]
            );

            const isProductAlreadyExist = product.rows[0];

            if (!isProductAlreadyExist) {
                res.status(400).send({
                    success: false,
                    message: 'Product is not found',
                });
            }

            const shop = await db.query(
                `SELECT * FROM shop where shopname = $1`,
                [shopName]
            );

            const shopIsAlreadyExist = shop.rows[0];

            if (!shopIsAlreadyExist) {
                res.status(400).send({
                    success: false,
                    message: 'Shop is not found',
                });
            }

            const productOnShelf = await db.query(
                `SELECT * FROM shelf where product_id = $1 AND shop_id = (SELECT id FROM shop where shopName = $2)`,
                [productId, shopName]
            );

            const isProductOnShelfAlreadyExist = productOnShelf.rows[0];

            if (!isProductOnShelfAlreadyExist) {
                const newProductOnShelf = await db.query(
                    `INSERT INTO shelf (product_id, shop_id, quantity, created_at) values ((SELECT id FROM product where id = $1), (SELECT id FROM shop where shopname = $2), $3, $4) RETURNING *`,
                    [productId, shopName, quantity, new Date()]
                );

                const action = {
                    shopId: newProductOnShelf.rows[0].shop_id,
                    productId: newProductOnShelf.rows[0].product_id,
                    actions: 'Create_remains_on_shelf',
                };

                sendActions(action);

                const productOnShelf = newProductOnShelf.rows[0];

                res.send({ success: true, body: productOnShelf });
            } else {
                const availableProductOnShelf = await db.query(
                    `UPDATE shelf set quantity = quantity + $1 where product_id = $2 AND shop_id = (SELECT id FROM shop where shopName = $3) RETURNING *`,
                    [quantity, productId, shopName]
                );

                const action = {
                    shopId: availableProductOnShelf.rows[0].shop_id,
                    productId: availableProductOnShelf.rows[0].product_id,
                    actions: 'Create_remains_on_shelf',
                };

                sendActions(action);

                const productOnShelf = availableProductOnShelf.rows[0];

                res.send({ success: true, body: { productOnShelf } });
            }
        } catch (e) {
            console.log(e);
            res.status(500).send({ success: false, message: 'Server error' });
        }
    }

    // Получение товара по фильтрам: name, plu
    async getProduct(req, res) {
        try {
            const filter = req.query;

            const productsByFilter = [];

            if (filter?.name) {
                const { rows } = await db.query(
                    `SELECT * FROM product where productName = $1`,
                    [filter.name]
                );

                rows.forEach((index) => {
                    productsByFilter.push(index);
                });
            }
            if (filter?.plu) {
                const { rows } = await db.query(
                    `SELECT * FROM product where plu = $1`,
                    [filter.plu]
                );

                rows.forEach((index) => {
                    productsByFilter.push(index);
                });
            }

            if (!productsByFilter[0]) {
                res.status(400).send({
                    success: false,
                    message: 'Product is not found',
                });
            } else {
                res.send({ success: true, body: productsByFilter });
            }
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new ProductController();
