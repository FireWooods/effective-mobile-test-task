const express = require('express');
const productRouter = require('./routes/product_routes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use('/api', productRouter);

app.listen(PORT, () => console.log(`Сервер запущен на порте ${PORT}`));
