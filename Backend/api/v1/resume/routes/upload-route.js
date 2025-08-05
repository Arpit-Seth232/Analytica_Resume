const express = require('express');
const multer = require('multer');

const { postUploadController } = require('../controller/post-upload-controller.js');
const { getAnalysisController } = require('../controller/get-analysis-controller.js');

const storage = multer.memoryStorage();
const upload = multer({storage});

const resumeRoute = express.Router();

resumeRoute.post('/upload',upload.single('resume'),postUploadController);

resumeRoute.post('/upload/analysis',getAnalysisController);

module.exports= {
    resumeRoute
}