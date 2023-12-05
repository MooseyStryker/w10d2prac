const express = require("express");
const app = express();

const dogRouter = require("./routes/dogs");

app.use(express.json());
app.use("/dogs", dogRouter);

const logger = (req, res, next) => {
  console.log(`${req.method} has made a request for ${req.path}`);
  res.on("finish", () => {
    console.log(`${res.statusCode} is the status code`);
  });
  next();
};

// For testing purposes, GET /
app.get("/", logger, (req, res) => {
  res.json(
    "Express server running. No content provided at root level. Please use another route."
  );
});

// For testing express.json middleware
app.post("/test-json", logger, (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get("/test-error", async (req, res) => {
  throw new Error("Hello World!");
});

app.use((req, res, next) => {
  const noMethodFound = new Error("The requested resource couldn't be found.");
  noMethodFound.statusCode = 404;
  next(noMethodFound);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    statusCode,
  });
});

const port = 5000;
app.listen(port, () => console.log("Server is listening on port", port));
