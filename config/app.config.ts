import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  mongo: {
    uri: process.env.MONGO_URI,
  },
}));
