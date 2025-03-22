// Import necessary modules
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		//GatewayIntentBits.GuildMembers,
	],
});

// Event listener for when the bot is ready
client.on('ready', () => {
    //console.log(`Logged in as ${client.user.tag}!`);
});

// Event listener for messages
client.on('messageCreate', msg => {
    if(msg.author.bot)
        return;
    let params = new URLSearchParams();
    params.append("api-version", "3.0");
    params.append("to", "en");

    axios({
        baseURL: process.env.AZURE_URL,
        url: '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': process.env.AZURE_KEY,
            // location required if you're using a multi-service or regional (not global) resource.
            'Ocp-Apim-Subscription-Region': process.env.AZURE_REGION,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: params,
        data: [{
            'text': msg.content
        }],
        responseType: 'json'
    }).then(function(response){
        //console.log(JSON.stringify(response.data, null, 4));
        var translation = response.data[0];
        if(translation.detectedLanguage.language != "en")
            msg.reply(`${translation.detectedLanguage.language}: ${translation.translations[0].text}`);
    })
});

// Log in to Discord with your client's token
client.login(process.env.TOKEN);