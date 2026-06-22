require('dotenv').config();

const express = require('express');
const healthRoutes = require('./routes/health');
const taskRoutes = require('./routes/tasks');

const app = express();

app.use(express.json());
app.use(healthRoutes);
app.use(taskRoutes);

module.exports = app;
