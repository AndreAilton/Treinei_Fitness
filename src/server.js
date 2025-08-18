import App from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const isDocker = process.env.NODE_ENV === "docker";

if (isDocker) {
  const port = process.env.API_PORT;
  const localHost = process.env.DB_HOST;
  App.listen(port, () => console.log(`http://${localHost}:${port}`));
} else {
  const port = process.env.PORT || 3000;
  const localHost = process.env.DB_HOST_LOCAL;
  App.listen(port, () => console.log(`http://${localHost}:${port}`));
}
