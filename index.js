const express = require("express");
const connectMongoDB = require("./src/db/dbconnect");
//import routes
const authRoutes = require("./src/routes/auth");
const profileRoutes = require("./src/routes/profile");
const statisticRoutes = require("./src/routes/statistic");
const testsRoutes = require("./src/routes/tests");
const theoryRoutes = require("./src/routes/theorys");
const studentsRoutes = require("./src/routes/students");
const themeRoutes = require("./src/routes/theme");

const PORT = process.env.PORT;
const app = express();

connectMongoDB();

app.use(express.json());

app.use("/api/user", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/statistics", statisticRoutes);
app.use("/api/tests", testsRoutes);
app.use("/api/theory", theoryRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/themes", themeRoutes);

app.listen(PORT, () => console.log(`server up and runing on port: ${PORT}`));
