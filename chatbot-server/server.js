const express = require('express')
const axios = require('axios')
const cors = require('cors')
const OpenAI = require('openai')

require('dotenv').config()
// console.log("API KEY:", process.env.NEBIUS_API_KEY);

const app = express();
app.use(cors())
app.use(express.json())

// const client = new OpenAI({
//     apikey: process.env.NEBIUS_API_KEY,
//     baseURL: 'https://api.studio.nebius.com/v1/',
// })

const client = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/', // Nebius API endpoint
  apiKey: process.env.NEBIUS_API_KEY,          // Your Nebius API key here
});

app.post('/api/chat', async(req,res) =>{
    const startTime = Date.now()
    try{
        const userMessage = req.body.message;

        const response = await client.chat.completions.create({
           "model": 'deepseek-ai/DeepSeek-R1-0528',
            "max_tokens": 2048,
            "temperature": 0.6,
            "top_p": 0.95,
            "messages": [
                { role: 'user', content: userMessage }
            ]
        });
        console.log('Full API response: ', JSON.stringify(response,null,2))
        let botReply = response.choices[0].message.content;
        botReply = botReply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

     
        const endTime = Date.now();
        console.log(`Request completed in ${endTime - startTime}ms`)
        res.json({reply: botReply})
    }  catch (err){
        console.error(err);
        res.status(500).json({error: 'something went wrong'})
    }
})

const PORT = 3001
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})