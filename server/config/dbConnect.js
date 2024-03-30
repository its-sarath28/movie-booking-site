import { connect } from "mongoose";

export const dbConnect = async () => {
  try {
    await connect(process.env.MONGO_URL);
    console.log(`Connected to DB`);
  } catch (err) {
    console.log(`Error connecting to the database: ${err}`);
    process.exit(1);
  }
};
