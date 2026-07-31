import express from "express";

const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.end("Hello, World!");
});

app.listen(PORT, () => {
  console.log("Server started at port", PORT);
});
