const pdf_parser = require('pdf-parse');

const postUploadController = async(req,res)=>{

    try{
        const pdfBuffer = req.file.buffer;

        const data = await pdf_parser(pdfBuffer);

    

    res.status(201);

    res.json({
        success : true,
        message : 'uploaded resume',
        resume : data
    })
}
catch(err){
    console.log(err.message);
    res.status(500);
    res.json({
        success:false,
        message : err.message
    })
}
    
}

module.exports = {
    postUploadController
}