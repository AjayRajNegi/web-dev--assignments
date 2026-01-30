import express, { Application, Request, Response } from "express";
import cors from "cors";
import apiRoutes from "./routes/api/index";

//const isDev = process.env.NODE_ENV === "DEV";
const isDev = true;
const allowedOrigins = [process.env.FRONTEND_URL];

const createServer = (): express.Application => {
  const app: Application = express();

  // CORS configuration
  app.use(
    cors({
      origin: (origin, callback) => {
        console.log(`CORS check for origin: ${origin}: isDev=${isDev}`);
        if (isDev) {
          // Allow all origin for dev
          return callback(null, origin || "*");
        } else {
          if (!origin) return callback(null, origin);
          console.log(`CORS check for origin: ${origin}`);

          if (allowedOrigins.includes(origin)) {
            return callback(null, origin);
          } else {
            return callback(new Error("Not allowed by CORS"));
          }
        }
      },
      credentials: true,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }),
  );

  app.use(express.json({ limit: "60mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", async (_req: Request, res: Response): Promise<Response> => {
    return res.status(200).send({
      success: true,
      message: "The server is running",
    });
  });

  app.use("/api", apiRoutes);

  //   app.use("*", async (_req: Request, res: Response): Promise<Response> => {
  //     return res.status(404).send({
  //       success: false,
  //       message: "URL_NOT_FOUND",
  //     });
  //   });

  return app;
};

export default createServer;
