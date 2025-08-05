require('dotenv').config();
require('./config/db-connection.js');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const {  resumeRoute } = require('./api/v1/resume/routes/upload-route.js');
const { jobsRoute } = require('./api/v1/jobs/routes/jobs-routes.js');
const { userRoute } = require('./api/v1/users/routes/user-routes.js');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

app.use('/api/v1/users',userRoute)

app.use('/api/v1/resume',resumeRoute);

app.use('/api/v1/jobs',jobsRoute);


app.listen(PORT , ()=>{
    console.log('server is started');
})