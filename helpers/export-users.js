const users = require('./users.json');
for (const [key, value] of Object.entries(users)) {
  if (value.confirmedEmail) {
    console.log(value.email);
  }
}
