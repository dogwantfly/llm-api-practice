import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import imageRouter from './routes/image.js';
import weatherRouter from './routes/weather.js';
import categoryRouter from './routes/categories.js';
import generateImageRouter from './routes/gen-image.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({
    service: 'llm-api-practice',
    ok: true,
}));
app.use('/image-analysis', imageRouter);
app.use('/product-categories', categoryRouter);
app.use('/image-generation', generateImageRouter);
app.use('/api/weather', weatherRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));