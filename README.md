Konfiguracija baze je u src/config/db.js:
DB_NAME: 'yettel'
DB_USER: 'postgres'
DB_PASS: 'super'
DB_HOST: 'localhost'
DIALECT: 'postgres'
logging: false

Instalacija zavisnosti: npm install

Start servera: node server.js
Provera:
Swagger UI: http://localhost:3000/api-docs

Pokretanje Dockera:
docker compose up --build

Postman
Environment: base = http://localhost:3000/api, token = (prazno)
Kolekcija koristi Bearer {{token}}
Login request u Tests ima:
pm.environment.set('token', pm.response.json().token);

E2E testovi (Jest + Supertest)
Preduuslovi:
- U PostgreSQL kreiraj bazu: yettel_test

Pokretanje:
- Instaliraj zavisnosti: npm install
- Startuj testove: npm test
