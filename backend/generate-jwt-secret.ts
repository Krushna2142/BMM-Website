import { randomBytes } from 'crypto';

function generateJWTSecret() {
  const secret = randomBytes(64).toString('hex');
  console.log('\nJWT Secret:\n');
  console.log(secret);
}

generateJWTSecret();