require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const tenantResolver = require("./middleware/tenantResolver");
const apiRoutes = require("./routes/api");

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization", "X-Tenant-ID"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
require("./config/passport")(passport);

app.use(tenantResolver);

app.use("/api", apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An internal server error occurred." });
});

module.exports = app;
