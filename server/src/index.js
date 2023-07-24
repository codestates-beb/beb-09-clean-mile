const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('OK');
});

console.log(process.env.EXAMPLE_ENV);

app.listen(8080, () => {
  console.log('Listening on port 8080');
});
