const express = require('express');
const { jobSearchController } = require('../controller/job-search-controller');

const jobsRoute = express.Router();

jobsRoute.post('/search',jobSearchController);

module.exports={
    jobsRoute
}