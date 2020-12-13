const Path = require('path');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const Ngrok = require('ngrok');
const compression = require('compression');
const express = require('express');

const CONFIG = require('./config');
const { APP, MONGO, NGROK, PARSE, PARSE_DASHBOARD } = CONFIG;

/**
 * Creates the Parse Server.
 * @returns {ParseServer}
 */
function createParseServer() {
   return new ParseServer({
      // Connection string for your MongoDB database
      databaseURI: MONGO.URI,
      // Absolute path to your Cloud Code
      cloud: Path.resolve(process.cwd(), 'server/index.js'),
      appId: PARSE.APP_ID,
      masterKey: PARSE.MASTER_KEY, // Keep this key secret!
      // fileKey: 'optionalFileKey',
      serverURL: `http://localhost:${APP.PORT}/${PARSE.ROUTE}` // Don't forget to change to https if needed
   });
}

/**
 * Creates the Parse Dashboard.
 * @returns {ParseDashboard}
 */
function createParseDashbaord() {
   return new ParseDashboard({
      apps: [
         {
            serverURL: `http://localhost:${APP.PORT}/${PARSE.ROUTE}`,
            appId: PARSE.APP_ID,
            appName: PARSE.APP_NAME,
            masterKey: PARSE.MASTER_KEY,
         }
      ],
      users: [
         {
            user: PARSE_DASHBOARD.USERNAME,
            pass: PARSE_DASHBOARD.PASSWORD
         }
      ],
   }, { allowInsecureHTTP: true });
}

(async function () {
   const app = express();

   app.use(compression({
      filter: (req, res) => {
         // don't compress responses with this request header
         let isShouldCompress = req.headers['x-no-compression'];

         // fallback to standard filter function
         return isShouldCompress ? false : compression.filter(req, res);
      },
      // threshold is the byte threshold for the response body size
      // before compression is considered, the default is 1kb
      // threshold: 0
   }));

   // Serve the Parse API & Dashboard on the /parse /dashboard URL prefix
   let parseServer = createParseServer(),
      parseDashboard = createParseDashbaord();

   app.use(`/${PARSE.ROUTE}`, parseServer);
   app.use(`/${PARSE_DASHBOARD.ROUTE}`, parseDashboard);

   /** Initial Server */
   const server = app.listen(APP.PORT, async () => {

      let serverPort = server.address().port;

      console.log(`Simple Parse API listening on port: ${serverPort}`);

      if (NGROK.ENABLED) {
         let accessibleUrl = await Ngrok.connect({
            authtoken: NGROK.AUTH_TOKEN,
            inspect: false,
            proto: 'http',
            addr: serverPort,
         });

         console.log(`Tunnel Inspector ->  http://127.0.0.1:4040`);
         console.log(`Public Accessible Url: ${accessibleUrl}`);
         console.log(`Dashboard Url: ${accessibleUrl}/${PARSE_DASHBOARD.ROUTE}`);
      }
   });

   /** Safely terminate the server and release the resources. */
   ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(sig => {
      process.on(sig, async () => {

         NGROK.ENABLED && await Ngrok.kill();

         /** Stops the server from accepting new connections and finishes existing connections. */
         server.close((err) => {
            if (err) {
               console.error('Terminating Err:', err.message);
            }
            console.log(`Sigal Received: ${sig}`);
            process.exit(err ? 1 : 0);
         })
      })
   })

})();
