const express = require("express");
const app = express();
const cors = require("cors");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ hello: "World" });
});

app.post("/run", async (req, res) => {
  const { language, code } = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  // we need to generate a c++ file with content from the request
  const filePath = await generateFile(language, code);
  // we need ti run the file and send the response
  const output = await executeCpp(filePath);
  return res.json({ filePath, output });
});
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
