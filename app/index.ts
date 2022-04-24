import express, {Application, Request, Response } from 'express';

const app: Application = express();
const PORT = 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.listen(PORT, () => { console.log(`Server started on port ${PORT}`); });
