```
npm install --legacy-peer-deps
```

```
PORT=4001 npm start
```

```
curl \
--request POST \
--header 'content-type: application/json' \
--header 'accept: multipart/mixed; deferSpec=20220824, application/json' \
--url http://localhost:4001/ \
--data '{"query":"query ComputersQuery {\n  computers {\n    id\n    \n    screen {\n    ... ScreenFragment @defer\n    }\n  }\n}\n\nfragment ScreenFragment on Screen {\n  isColor\n}","variables":{}}'
```
