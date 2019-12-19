const express = require("express");
const app = express();
const connectMongoDB = require("./src/db/dbconnect");
//import routes
const authRoute = require("./src/routes/auth");

const PORT = process.env.PORT;

connectMongoDB();

app.use(express.json());

app.use("/api/user", authRoute);
app.use("/api/test", testRoutes);

app.listen(PORT, () => console.log(`server up and runing on port: ${PORT}`));
