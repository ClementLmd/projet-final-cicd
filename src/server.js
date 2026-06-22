const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`TaskFlow API running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
