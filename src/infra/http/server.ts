import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';
import errorHandler from './middleware/error-handler';
import notFoundHandler from './middleware/not-found-handler';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(routes);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(port, () => {
  console.log(`🚀 server is running at port ${port}`);
});
