const fs = require('fs');
const readline = require('readline');

const oldEmails = {};
const input = fs.createReadStream('old.csv');
const lineReader = readline.createInterface({ input });

lineReader.on('line', line => {
  oldEmails[line] = true;
});

lineReader.on('close', () => {
  printNewEmails();
});

function printNewEmails() {
  const newEmails = {};
  const input = fs.createReadStream('new.csv');
  const lineReader = readline.createInterface({ input });

  lineReader.on('line', line => {
    if (!oldEmails[line]) {
      newEmails[line] = true;
    }
  });

  lineReader.on('close', () => {
    Object.keys(newEmails).forEach(email => {
      console.log(email);
    });
  });
}
