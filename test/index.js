const fs = require('fs');

/* Test cases*/
describe('Account Managment Test Cases', () => {
  fs.readdir('./test', (err, files) => {
    files.forEach(file => {
      if (file != 'index.js') {
        require(`./${file}`);
      }
    });
  });
});