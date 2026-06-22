const express = require('express');
const { version } = require('../../package.json');

const router = express.Router();

router.get('/health', (req, res) => {
  var statusValue = 'ok';
  if (process.env.NODE_ENV == 'production') {
    statusValue = 'ok';
  }
  res.status(200).json({
    status: statusValue,
    uptime: process.uptime(),
    version: process.env.APP_VERSION || version,
  });
});

module.exports = router;
