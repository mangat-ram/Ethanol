import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
  origin: process.env.CORS,
  credentials:true
}));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"));
app.use(cookieParser());

//Api Version Declaration
const apiVersion = "/api/v1";

//Route Variables
const users = "/users";
const tasks = "/tasks";
const category = "/category";
const labs = "/labs";

//Routes
import userRouter from "./routes/user.routes.js";
import tasksRouter from "./routes/task.routes.js";
import categoryRouter from "./routes/category.route.js";
import labsRouter from "./routes/lab.routes.js";

//Router Declaration
app.use(`${apiVersion}${users}`,userRouter);
app.use(`${apiVersion}${tasks}`, tasksRouter);
app.use(`${apiVersion}${category}`, categoryRouter);
app.use(`${apiVersion}${labs}`, labsRouter);

//for eg. http://localhost:3000/api/v1/users/register
export { app }