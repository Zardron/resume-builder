import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
