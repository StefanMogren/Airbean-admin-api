//General Imports
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

//Middleware Imports
import errorHandler from "./middlewares/errorHandler.middleware.js";

//Routers Import
import authRouter from "./routes/auth.routes.js";
import menuRouter from "./routes/menu.routes.js";
import cartRouter from "./routes/cart.routes.js";
import ordersRouter from "./routes/orders.routes.js";

//Utils Import
import CustomError from "./utils/customError.util.js";

// ----------------------------------------------------------------------------- //

//Config
dotenv.config();

const app = express();
const now = () => new Date().toLocaleString();

const PORT = process.env.PORT;
const CONNECTION_STRING = process.env.CONNECTION_STRING;

//Middlewares
app.use(express.json());

//Routes
app.use("/api/auth", authRouter);
app.use("/api/menu", menuRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);

// Error Handler
app.use((req, res, next) => {
	next(new CustomError("Route not found", 404));
});

app.use(errorHandler);

// ----------------------------------------------------------------------------- //

//Mongoose Connection
mongoose.connect(CONNECTION_STRING);
const database = mongoose.connection;

database.on("error", (error) => console.log(error));
database.once("connected", () => {
	console.log("Database is connected.");
	app.listen(PORT, () => {
		console.log(`Server is running on ${PORT} since ${now()}`);
	});
});

// ----------------------------------------------------------------------------- //
