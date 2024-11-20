import db from '../db';

class ActionsController {
	async getActions(req, res) {
		try {
			const body = req.body;

			await db.query(
				`INSERT INTO history_of_actions (shop_id, product_id, actions, created_at) values ($1, $2, $3, $4)`,
				[body.shopId, body.productId, body.actions, new Date()]
			);

			res.send({ success: true });
		} catch (e) {
			console.log(e);
			res.status(500).send({ success: false, message: 'Server error' });
		}
	}

	async getActionsByFilter(req, res) {
		try {
			const filter = req.query;

			const actionsByFilter: object[] = [];

			if (filter?.shop_id) {
				const { rows } = await db.query(
					`SELECT * FROM history_of_actions where shop_id = $1`,
					[filter.shop_id]
				);

				rows.forEach((index) => actionsByFilter.push(index));
			}

			if (filter?.plu) {
				const product = await fetch(
					`http://localhost:3000/api/product?plu=${filter.plu}`
				);

				const productByPlu = await product.json();

				const { rows } = await db.query(
					`SELECT * FROM history_of_actions where product_id = $1`,
					[productByPlu.body[0].id]
				);

				rows.forEach((index) => actionsByFilter.push(index));
			}

			if (filter?.date) {
				const { rows } = await db.query(
					`SELECT * FROM history_of_actions where created_at = $1`,
					[filter.date]
				);

				rows.forEach((index) => actionsByFilter.push(index));
			}

			if (filter?.action) {
				const { rows } = await db.query(
					`SELECT * FROM history_of_actions where actions = $1`,
					[filter.action]
				);

				rows.forEach((index) => actionsByFilter.push(index));
			}

			if (!actionsByFilter[0]) {
				res.status(400).send({
					success: false,
					message: 'Actions is not found',
				});
			} else {
				const uniqueActionsByFilter = [
					...new Map(
						actionsByFilter.map((item) => [item['id'], item])
					).values(),
				];

				res.send({ success: true, body: uniqueActionsByFilter });
			}
		} catch (e) {
			console.log(e);
			res.status(500).send({ success: false, message: 'Server error' });
		}
	}
}

export default ActionsController;
