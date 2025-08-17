import App from './app.js'
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;



App.listen(port, () => console.log(`http://localhost:${port}`));