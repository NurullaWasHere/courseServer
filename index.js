const express = require('express');
const sequelize = require('./src/utils/db.js');
const cors = require('cors')

const userRouter = require('./src/routes/UserRouter');
const adminRouter = require('./src/routes/AdminRouter')

require('dotenv').config();

const app = express();

app.use(cors())
app.use(express.json())
app.use(express.static('static'))

app.use('/user', userRouter);
app.use('/admin', adminRouter);

const server = app.listen(process.env.PORT,async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log("DB connected");
    } catch (error) {
        console.log("Problem with connection", error);
    }
    console.log("App started")
})
server.timeout = 3600