import App from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const isDocker = process.env.NODE_ENV === "docker";

if (isDocker) {
  const host = process.env.API_HOST;
  const portname = process.env.API_PORT;
  const port = process.env.PORT || 3000;
  App.listen(port, "0.0.0.0", () => console.log(`http://${host}:${portname}`));
} else {
  const port = process.env.PORT || 3000;
  const localHost = process.env.DB_HOST_LOCAL;
  App.listen(port, "0.0.0.0", () => console.log(`http://${localHost}:${port}`));
}
