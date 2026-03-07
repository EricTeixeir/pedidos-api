git clone repo
cd order-api

cp .env.example .env

npm install

npm run migrate
npm run seed

npm run dev