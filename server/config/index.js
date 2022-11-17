import dotenv from 'dotenv';
dotenv.config();

const config = {
  db: {
    url: 'localhost:3001',
    name: 'bnb_chain',
  },
};

export default config;
