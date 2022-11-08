import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) =>
  res.send({
    message: 'Hello World',
  }),
);

app.listen(port, () => {
  console.log('🚀 server is running');
});
