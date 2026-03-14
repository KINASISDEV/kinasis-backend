import mongoose from 'mongoose';

const buildMongoUri = () => {
  if (process.env.MONGODB_URI) { return process.env.MONGODB_URI;}

  const {MONGO_USER_NAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB_NAME } = process.env;

  const hasCredentials = Boolean(MONGO_USER_NAME);
  const authSegment = hasCredentials ? `${encodeURIComponent(MONGO_USER_NAME)}:${encodeURIComponent(MONGO_PASSWORD ?? '')}@` : '';

  if (MONGO_HOST.endsWith('.mongodb.net')) {
    return `mongodb+srv://${authSegment}${MONGO_HOST}/${MONGO_DB_NAME}?retryWrites=true&w=majority`;
  }

  const hostSegment = MONGO_PORT ? `${MONGO_HOST}:${MONGO_PORT}` : MONGO_HOST;
  return `mongodb://${authSegment}${hostSegment}/${MONGO_DB_NAME}`;
};

export const connectToDatabase = async () => {
  const mongoUri = buildMongoUri();
  await mongoose.connect(mongoUri);
  return mongoose.connection;
};

export const startServer = async (app) => {
  const port = Number(process.env.PORT);

  try {
    await connectToDatabase();

    app.listen(port, () => {
      console.log(`API listening on port ${port}.`);
    });
  } catch (error) {
    console.error('Failed to start API.', error);
    process.exit(1);
  }
};
