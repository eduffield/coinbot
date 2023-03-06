// Optional direct input of token instead of file
const TOKEN_LITERAL = "PASTE DISCORD TOKEN HERE"
const useLiteral = true

const fs = require("fs");
const request = require("request");

const {Client, Events, Intents, GatewayIntentBits, VoiceChannel} = require('discord.js');
const {joinVoiceChannel, AudioPlayerStatus, createAudioPlayer, AudioResource, createAudioResource} = require("@discordjs/voice");

function readCmd(cmd) {
    switch(cmd.content) {
        case "&start":
            let voiceChannel = cmd.member.voice.channel;
            const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: cmd.guild.id,
            adapterCreator: cmd.guild.voiceAdapterCreator
            });
            randSend();
            break;
        case "&coinprice":
            coinPrice();
            break;
        case "&shazam":
            playOGG(15);
            break;
        case "&wayitgoes":
            playOGG(18);
            break;
        case "&hehe":
            playOGG(19);
            break
        default:
            break;
    }
}

function randOption(max) {
    return Math.floor(Math.random() * max);
}

function randSend() {
    let time = randOption(500000) + 10000;
    console.log("> Next taunt in " + time / 1000 + " seconds");
    setTimeout(function() {playOGG(randOption(19) + 1); randSend();}, time);
}

function playOGG(num) {
        let oggFile = "ogg/"+num+".ogg";
        const clip = createAudioResource(__dirname + oggFile);
        const player = createAudioPlayer();
        player.play(clip);
        connection.subscribe(player);
        console.log("> played " + num);
}

function coinPrice() {
    request("https://blockchain.info/ticker", (error, response, body) => {
        const data = JSON.parse(body);
        price = (parseInt(data.USD.buy, 10) + parseInt(data.USD.sell, 10)) / 2;
        client.channels.cache.get("809565010983518288").send("BTC Price: $"+price);
    });
}

// Load Discord bot token
var token = "";
if (useLiteral == true) {
    token = TOKEN_LITERAL;
} else {
    try {
        token = fs.readFileSync("token.txt", "utf8");
        console.log("> Token Loaded.");
    } catch(e) {
        console.error("> Token not found!");
    }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.login(token);

function readyBot() {
    console.log("> Bot is online.");
}
client.on("ready", readyBot);
client.on("messageCreate", readCmd);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === '&coinprice') {
		coinPrice();
	}
});

var connection = null;
