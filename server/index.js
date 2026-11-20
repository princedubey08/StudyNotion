
// Load environment variables FIRST
require("dotenv").config();

// Import necessary modules
const express = require("express");
const app = express();

const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");

const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");

// Port configuration
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS configuration for deployed frontend
const allowedOrigins = [
    "https://studynotionsaass.netlify.app",
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without an Origin header
            // (for example, server-to-server requests)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    })
);

// File upload configuration
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

// Connect to database
database.connect();

// Connect Cloudinary
cloudinaryConnect();

// API routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// Health check route
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "Your StudyNotion server is up and running!",
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyNotion server is listening on port ${PORT}`);
});
