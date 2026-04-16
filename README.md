# Backend Programming Template (2025)

## Development Setup

1. Fork and clone this repository to your local computer.
2. Open the project using VS Code.
3. Install the recommended VS Code extensions: `ESLint` and `Prettier`.
4. Copy and rename `.env.example` to `.env`. Open `.env` and change the database connection string.
5. Run `npm install` to install the project dependencies.
6. Run `npm run dev` to start the dev server.
7. Test the endpoints in the API client app.

## Add New API Endpoints

1. Create a new database schema in `./src/models`.
2. Create a new folder in `./src/api/components` (if needed). Remember to separate your codes to repositories, services, controllers, and routes.
3. Add the new route in `./src/api/routes.js`.
4. Test your new endpoints in the API client app.

penjelasan untuk setiap endpoint yang saya buat

1. ## POST GACHA

   Endpoint ini digunakan untuk melakukan Gacha Hadiah setiap user berdasarkan nama
   cara mengaksesnya dengan POST http://localhost:5000/api/gacha/ di ECHOAPI
   lalu dengan format BODY RAW JSON lalu ketikan seperti ini
   {
   "userName": "<ketikan nama yang ingin diinput>"
   }

2. ## GET HISTORY

   Endpoint ini digunakan untuk mendapatkan semua history gacha yang pernah dilakukan semua user
   sesuai dengan hadiah yang didapat dan kapan user melakukan gacha
   cara mengaksesnya dengan GET http://localhost:5000/api/gacha/history di ECHOAPI

3. ## GET HISTORY USER

   Endpoint ini digunakan untuk mendapatkan semua history gacha berdasarkan username pengguna
   sesuai dengan hadiah yang didapat dan kapan user melakukan gacha
   cara mengaksesnya dengan GET http://localhost:5000/api/gacha/history/<masukan userName>
   MISAL : GET http://localhost:5000/api/gacha/history/PakJonson

4. ## GET PRIZES

   Endpoint ini digunakan untuk melihat berapa total hadiah yang masih ada, total hadiah yang sudah
   terambil, dan berapa total stock hadiah yang dimasukan.
   cara mengaksesnya dengan GET http://localhost:5000/api/gacha/prizes

5. ## GET WINNERS
   Endpoint ini digunakan untuk melihat hadiah yang didapatkan oleh user saat melakukan gacha.
   nama user akan disamarkan
   cara mengaksesnya dengan GET http://localhost:5000/api/gacha/winners
