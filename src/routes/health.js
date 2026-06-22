const express = require('express');
const { version } = require('../../package.json');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    version: process.env.APP_VERSION || version,
  });
});

module.exports = router;
