const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const app = express();

const allowedOrigins = [
	"http://localhost:3000",
	"https://others-covers-0f4265de0975.herokuapp.com",
];

const corsOptions = {
	origin: function (origin, callback) {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
	optionsSuccessStatus: 204,
};

// Log All Incoming Requests Middleware
app.use((req, res, next) => {
	console.log(`Incoming request: ${req.method} ${req.path}`);
	console.log("Headers:", req.headers);
	next();
});

// Middlewares
app.use(cors(corsOptions)); // Apply CORS middleware
app.use(express.json()); // For parsing application/json

// MongoDB Connection
const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/others-covers-database";

mongoose
	.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("MongoDB Connected"))
	.catch((err) => console.log("there is a problem with mongoose " + err));

// Import and use routes
const bookRoutes = require("./routes/books"); // Adjusted for simplicity
const userRoutes = require("./routes/users");

app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);

// Deployment - Serving the static files from express
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../build")));

	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../build", "index.html"));
	});
}

// Server Listening
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = {
	MONGODB_URI,
};
