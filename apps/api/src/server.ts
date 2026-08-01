import express from "express";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(express.json());

const PORT = 5000;

app.get("/", (req, res) => {
  res.end("Hello, World!");
});

app.listen(PORT, () => {
  console.log("Server started at port", PORT);
});
