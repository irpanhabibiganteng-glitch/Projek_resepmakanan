import "dotenv/config";
import express from "express";
import cors from "cors";
import router from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "API Resep Kita berjalan",
    status: "ok",
  });
});

app.use("/api", router);

export default app;
