import createServer from "./app";

const startServer = async () => {
  const port = process.env.port || 8000;
  const app = createServer();

  try {
    //await initConfig();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  } catch (error) {}
};

startServer();
