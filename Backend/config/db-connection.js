const mongoose = require('mongoose');

const MONGO_DB_URL = process.env.MONGO_DB_URL

mongoose.connect(MONGO_DB_URL,{
        dbName : 'Analytica_Resume'
}).then(()=>{
    console.log('--------------------------------- DB Connected --------------------------------');
}).catch((err)=>{
     console.log('---------------------------- DB Connection error -----------------------------');
     console.log(err.message);
      console.log('-----------------------------------------------------------------------------');
})