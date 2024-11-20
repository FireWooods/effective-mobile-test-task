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

class RemainsController {
	//Уменьшение остатка на полке, создание заказа
	async createOrder(req, res) {
		try {
			const productId = req.params.id;
			const { shopName, quantity } = req.body;

			const product = await db.query(
				`SELECT * FROM product where id = $1`,
				[productId]
			);

			const productIsAlreadyExist = product.rows[0];

			if (!productIsAlreadyExist) {
				res.status(400).send({
					success: false,
					message: 'Product is not found',
				});
			}

			const shop = await db.query(
				`SELECT * FROM shop where shopName = $1`,
				[shopName]
			);

			const shopIsAlreadyExist = shop.rows[0];

			if (!shopIsAlreadyExist) {
				res.status(400).send({
					success: false,
					message: 'Shop is not found',
				});
			}

			const productOnShelfAlreadyExist = await db.query(
				`SELECT * FROM shelf where product_id = $1 AND shop_id = (SELECT id FROM shop where shopName = $2)`,
				[productId, shopName]
			);

			if (productOnShelfAlreadyExist) {
				const newProductOnOrder = await db.query(
					`INSERT INTO orders (product_id, shop_id, quantity, created_at) values ((SELECT id FROM product where id = $1), (SELECT id FROM shop where shopName = $2), $3, $4) RETURNING *`,
					[productId, shopName, quantity, new Date()]
				);

				await db.query(
					`UPDATE shelf set quantity = quantity - $1 where product_id = $2 AND shop_id = (SELECT id FROM shop where shopName = $3) RETURNING *`,
					[quantity, productId, shopName]
				);

				const action = {
					shopId: newProductOnOrder.rows[0].shop_id,
					productId: newProductOnOrder.rows[0].product_id,
					actions: 'Create_order',
				};

				sendActions(action);

				const productOnOrder = newProductOnOrder.rows[0];

				res.send({ success: true, body: { productOnOrder } });
			} else {
				res.status(400).send({
					success: false,
					message: 'Product on shelf is not found',
				});
			}
		} catch (e) {
			console.log(e);
			res.status(500).send({ success: false, message: 'Server error' });
		}
	}

	//Увеличение остатка
	async addMoreProduct(req, res) {
		try {
			const productId = req.params.id;
			const { shopName, quantity } = req.body;

			const product = await db.query(
				`SELECT * FROM product where id = $1`,
				[productId]
			);

			const productIsAlreadyExist = product.rows[0];

			if (!productIsAlreadyExist) {
				res.status(400).send({
					success: false,
					message: 'Product is not found',
				});
			}

			const shop = await db.query(
				`SELECT * FROM shop where shopName = $1`,
				[shopName]
			);

			const shopIsAlreadyExist = shop.rows[0];

			if (!shopIsAlreadyExist) {
				res.status(400).send({
					success: false,
					message: 'Shop is not found',
				});
			}

			const productOnShelfAlreadyExist = await db.query(
				`SELECT * FROM shelf where product_id = $1 AND shop_id = (SELECT id FROM shop where shopName = $2)`,
				[productId, shopName]
			);

			if (productOnShelfAlreadyExist) {
				const updateProduct = await db.query(
					`UPDATE shelf set quantity = quantity + $1 where product_id = $2 AND shop_id = (SELECT id FROM shop where shopName = $3) RETURNING *`,
					[quantity, productId, shopName]
				);

				const action = {
					shopId: updateProduct.rows[0].shop_id,
					productId: updateProduct.rows[0].product_id,
					actions: 'Increase_in_remains',
				};

				sendActions(action);

				const updateProductOnShelf = updateProduct.rows[0];

				res.send({ success: true, body: { updateProductOnShelf } });
			} else {
				res.status(400).send({
					success: false,
					message: 'Product on shelf is not found',
				});
			}
		} catch (e) {
			console.log(e);
			res.status(500).send({ success: false, message: 'Server error' });
		}
	}

	//Получение остатков на полке по фильтрам
	async getRemainsOnShelf(req, res) {
		try {
			const filter = req.query;

			const productOnShelfByFilter = [];

			if (filter?.plu) {
				const { rows } = await db.query(
					`SELECT * FROM shelf where product_id = (SELECT (id) FROM product where plu = $1)`,
					[filter.plu]
				);

				console.log(rows[0]);

				rows.forEach((index) => {
					productOnShelfByFilter.push(index);
				});
			}

			if (filter?.shopId) {
				const { rows } = await db.query(
					`SELECT * FROM shelf where shop_id = $1`,
					[filter.shopId]
				);

				rows.forEach((index) => {
					productOnShelfByFilter.push(index);
				});
			}

			if (filter?.startDate && filter?.endDate) {
				const { rows } = await db.query(
					`SELECT * FROM shelf where created_at BETWEEN $1 AND $2`,
					[filter?.startDate, filter?.endDate]
				);

				rows.forEach((index) => {
					productOnShelfByFilter.push(index);
				});
			}

			if (!productOnShelfByFilter[0]) {
				res.status(400).send({
					success: false,
					message: 'Product is not found',
				});
			} else {
				const uniqueProductOnShelf = [
					...new Map(
						productOnShelfByFilter.map((item) => [item['id'], item])
					).values(),
				];
				res.send({ success: true, body: uniqueProductOnShelf });
			}
		} catch (e) {
			console.log(e);
			res.status(500).send({ success: false, message: 'Server error' });
		}
	}

	//Получение остатков в заказе по фильтрам
	async getRemainsOnOrder(req, res) {
		try {
			const filter = req.query;

			const productOnOrderfByFilter = [];

			if (filter?.plu) {
				// const { rows } = await db.query(
				// 	`SELECT * FROM orders LEFT JOIN product ON orders.product_id = product.id where product.plu = $1`,
				// 	[filter.plu]
				// );

				const { rows } = await db.query(
					`SELECT * FROM orders where product_id = (SELECT (id) FROM product where plu = $1)`,
					[filter.plu]
				);

				rows.forEach((index) => {
					productOnOrderfByFilter.push(index);
				});
			}

			if (filter?.shopId) {
				const { rows } = await db.query(
					`SELECT * FROM orders where shop_id = $1`,
					[filter.shopId]
				);

				rows.forEach((index) => {
					productOnOrderfByFilter.push(index);
				});
			}

			if (filter?.startDate && filter?.endDate) {
				const { rows } = await db.query(
					`SELECT * FROM orders where created_at BETWEEN $1 AND $2`,
					[filter?.startDate, filter?.endDate]
				);

				rows.forEach((index) => {
					productOnOrderfByFilter.push(index);
				});
			}

			if (!productOnOrderfByFilter[0]) {
				res.status(400).send({
					success: false,
					message: 'Product is not found',
				});
			} else {
				const uniqueProductOnOrder = [
					...new Map(
						productOnOrderfByFilter.map((item) => [
							item['id'],
							item,
						])
					).values(),
				];
				res.send({ success: true, body: uniqueProductOnOrder });
			}
		} catch (e) {
			console.log(e);
			res.status(500).send({ success: false, message: 'Server error' });
		}
	}
}

module.exports = new RemainsController();
