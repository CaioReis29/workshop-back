import express from 'express';
import bodyParser from 'body-parser';
import colaboradorRoutes from './routes/colaborador_routes';
import workshopRoutes from './routes/workshop_routes';
import ataRoutes from './routes/ata_routes';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.use('/api/colaboradores', colaboradorRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/atas', ataRoutes);

app.get('/', (req, res) => {
  res.send('API está funcionando!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
