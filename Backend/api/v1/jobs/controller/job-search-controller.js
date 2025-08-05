const jobSearchController = async(req,res)=>{

     try{
    
    const {query,country,employment_types} = req.body;

    const RAPID_API_KEY = process.env.RAPID_API_KEY;
    const RAPID_API_HOST = process.env.RAPID_API_HOST;

    const url = `https://jsearch.p.rapidapi.com/search?query=${query}&num_pages=19&country=${country || 'in'}&date_posted=all&employment_types=${employment_types || 'FULLTIME'}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPID_API_KEY,
            'x-rapidapi-host': RAPID_API_HOST 
        }
    };

   

        const apiResponse = await fetch(url,options);
        const jsonData = await apiResponse.json();

        res.status(200);

        res.json({
            isSearchSuccessFull : true,
            data : jsonData
        })


    }
    catch(err){
        
        res.status(500);
        res.json({
            isSearchSuccessFull : false,
            message : err.message
        })
    }



}

module.exports = {
    jobSearchController
}