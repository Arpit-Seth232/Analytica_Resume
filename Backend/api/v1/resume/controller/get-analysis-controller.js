

const getAnalysisController = async(req,res)=>{

    const resumeText = req.body.resumeText;

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const prompt = `You are a smart resume analyzer.

Given the following resume text, extract key information and return the response strictly in this JSON format:
{
  "skills": [string],
  "experience_years": number,
  "recommended_roles": [string],
  "match_score": number, // from 0 to 100
  "suggestions": [string]
}

Only output valid JSON. No additional explanation.

Resume Text:
"""
${resumeText}
"""`

    try{

        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions',{
            method:'POST',
            
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            

            body: JSON.stringify({model: 'llama3-70b-8192', // or 'mixtral-8x7b-32768'
             messages: [
            { role: 'user', content: prompt }
            ],
            temperature: 0.7
             }),
            

    });

        const jsonData = await groqResponse.json();
        const aiReply = JSON.parse(jsonData['choices'][0].message.content)
        
        

        res.status(200);

        res.json({
            isAnalysisSuccessFull : true,
            analysed_data : aiReply
        })
      

    }
    catch(err){

        res.status(400);
        res.json({
            IsAnalysisSuccessful:false,
            message : err.message
        })

    }


}

module.exports = {
    getAnalysisController
}