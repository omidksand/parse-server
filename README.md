# Parse Server & Dashboard
Simpel Parse server and dashboard setup publicly accessible via Ngrok.


## How to Run
```
npm i && npm start
```

## How to test
Via curl request
```
curl --location --request POST '<YOUR_PARSE_PUBLIC_URL>/parse/functions/hello' \
--header 'X-PARSE-APPLICATION-ID: <YOUR_APP_ID>' \
--header 'Content-Type: application/json'
```
