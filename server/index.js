/**
 * Parse Main Module
 */

Parse.Cloud.define('hello', async () => {
   return {
      succes: true,
      body: {
         message: 'Hello World.'
      }
   };
});