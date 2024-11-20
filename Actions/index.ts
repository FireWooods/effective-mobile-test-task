import express from 'express';
import router from './routes/actions_routes';

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use('/api', router);
app.get('/', (req, res) => {
	res.send({ success: true });
});

app.listen(PORT, () => {
	console.log(`Сервер запущен на порте ${PORT}`);
});
