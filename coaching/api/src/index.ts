import express from 'express';
import cors from 'cors';
import router from './router';

const app = express();
const PORT = process.env['PORT'] ?? 4001;

app.use(cors({ origin: ['http://localhost:5174', 'http://localhost:5173'] }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    openai: Boolean(process.env['OPENAI_API_KEY']),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/coaching', router);

app.listen(PORT, () => {
  console.log(`Coaching API running on http://localhost:${PORT}`);
  if (!process.env['OPENAI_API_KEY']) {
    console.warn('⚠  OPENAI_API_KEY is not set — plan generation will return 503');
  }
});
