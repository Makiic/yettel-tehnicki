require('dotenv').config();
const app = require('./src/app');
const { connectSequelize } = require('./src/config/db');

const PORT = process.env.PORT || 3000;

(async () => {
  await connectSequelize();
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
})();