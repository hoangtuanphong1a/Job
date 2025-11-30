const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = '123321';
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password hash for "123321":', hash);
}

hashPassword();
