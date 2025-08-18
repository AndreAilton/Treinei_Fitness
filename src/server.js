import App from "./app.js";
import dotenv from "dotenv";
dotenv.config();

import os from "os";

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address; // retorna o IP real
      }
    }
  }
  return "localhost"; // fallback
}


const isDocker = process.env.NODE_ENV === "docker";

if (isDocker) {
  const host = getLocalIP();
  const portname = process.env.API_PORT;
  const port = process.env.PORT || 3000;
  App.listen(port, () => console.log(`http://${host}:${portname}`));
} else {
  const port = process.env.PORT || 3000;
  const localHost = process.env.DB_HOST_LOCAL;
  App.listen(port, () => console.log(`http://${localHost}:${port}`));
}
