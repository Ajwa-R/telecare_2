const express = require('express');
const http = require("http"); //for socket server
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');
const { initSocket } = require("./socket");

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app); //  server create kera

// In production behind a proxy (NGINX/Render/Vercel Edge), secure cookies work
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

//cors cookies
const allow = new Set(
  [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ].filter(Boolean)
);


const corsOptions = {
  origin: (origin, cb) => cb(null, !origin || allow.has(origin)),
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions)); // preflight handled by middleware
//...

//parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//health single
app.get('/', (_req, res) => res.send('TeleCare API Running'));

//Routes...
app.use('/api/auth', require('./routes/authRoutes'));
// const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use("/api/doctors", require("./routes/doctors"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));

//Sockets & Jobs
const io = initSocket(server, {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
});

// ---- Jobs (start AFTER io exists) ----
const { startAppointmentNotifier } = require('./jobs/appointmentNotifier');
startAppointmentNotifier(io);

app.set("io", io);

// Error Middleware
app.use(errorHandler);

// start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
