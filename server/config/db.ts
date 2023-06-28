import chalk from 'chalk';
import mongoose from 'mongoose';

mongoose.set('strictQuery', true);

export const connectDb = async () => {
  try {
    const { DB_HOST } = process.env;

    const db = await mongoose.connect(DB_HOST as string);
    console.log(chalk.bgGreen(`connected to DB: ${db.connection.name}`));
  } catch (error) {
    console.log(chalk.red(`${error}`));

    process.exit(1);
  }
};
