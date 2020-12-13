require('dotenv').config();

const ENV = process.env;

module.exports = {

   APP: {
      PORT: ENV['PORT'] || 5000,
   },
   MONGO: {
      URI: ENV['MONGO_URI'] || 'mongodb://localhost:27017/parse-test',
   },
   NGROK: {
      ENABLED: ENV['NGROK_ENABLED'] || false,
      AUTH_TOKEN: ENV['NGROK_AUTH_TOKEN'] || null,
   },
   PARSE: {
      APP_ID: ENV['PARSE_APP_ID'] || 'appId',
      APP_NAME: ENV['PARSE_APP_NAME'] || 'Parse Server Example',
      MASTER_KEY: ENV['PARSE_MASTER_KEY'] || 'masterKey',
      ROUTE: ENV['PARSE_ROUTE'] || 'parse',
   },
   PARSE_DASHBOARD: {
      ROUTE: ENV['PARSE_DASHBOARD_ROUTE'] || 'dashboard',
      USERNAME: ENV['PARSE_DASHBOARD_USERNAME'] || 'admin',
      PASSWORD: ENV['PARSE_DASHBOARD_PASSWORD'] || 'password'
   }
}