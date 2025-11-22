require('dotenv').config();
const app = require('./src/app');
const sequelize = require('./src/config/db'); // OVDE direktno db.js
const { User } = require('./src/Model/User');
const { Task } = require('./src/Model/Task');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Poveži se sa bazom
    await sequelize.authenticate();
    console.log('Baza je povezana');

    // Automatski kreira ili ažurira tabele prema modelima
    await User.sync({ alter: true }); 
    console.log('Tabela users je spremna');
    await Task.sync({ alter: true }); 
    console.log('Tabela tasks je spremna');

    // Pokreće server tek kad je baza spremna
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Greška pri povezivanju sa bazom:', err);
  }
})();
