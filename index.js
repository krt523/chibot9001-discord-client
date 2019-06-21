require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const oceanMan = client.createVoiceBroadcast();
const ytdl = require('ytdl-core');
const jsonfile = require('jsonfile');
const commandMapper = require('./lib/command-mapper');
const deadNoobCommandHandler = require('./lib/dead-noob-command-handler');
const quoteCommandHandler = require('./lib/quote-command-handler');
const guildPersonalityMapper = require('./lib/guild-personality-mapper');
const personalityCommandCommandHandler = require('./lib/personality-command-command-handler');
const miscCommandHandler = require('./lib/misc-command-handler');
var playingOceanMan = false;

var botdata = jsonfile.readFileSync('botData.json');

async function applicationSetup(){
    
    //load DiscordGuilds from API. For now, this is only done on application start.
    await guildPersonalityMapper.buildMap();

    //register our command handlers
    commandMapper.registerCommandHandler(deadNoobCommandHandler);
    commandMapper.registerCommandHandler(miscCommandHandler);
    commandMapper.registerCommandHandler(quoteCommandHandler);
    commandMapper.registerCommandHandler(personalityCommandCommandHandler);
}


async function init(){

    await applicationSetup();
    
    client.on('ready', () => {
        var snowflakes = client.guilds.map(guild => {
            return guild.id;
        });
        console.log(`Bot Ready. connected guilds: ${snowflakes}`);
    });
    
    client.on('message', async message => {
    
        console.log(`Processing message from ${message.author.username}; User Snowflake ${message.author.id}; Guild ${message.guild.name}; Guild Snowflake ${message.guild.id}`);
        
        if (message.content.startsWith(`!`)) {
            commandMapper.mapCommandToHandler(message);
        } else {
            //do message handling here.
            //TODO: for more complex message handling, create a message handler similiar to command handlers
            if (message.guild.name == 'DeadNoob') {
                if (message.channel.name === 'discordquotes') {
                    botdata[message.channel.guild.name].quotes.push(message.toString() + '');
                    console.log("added quote: " + message.toString());
                    jsonfile.writeFile('botData.json', botdata);
                }
            }
        }
    });
    
    //Disabled for Release one.
    client.on('presenceUpdate', (oldMember, newMember) => {
        if((newMember.presence.game && newMember.presence.game.url) && (oldMember.presence.game == null || oldMember.presence.game.url == null)){
            let guild = newMember.guild
            if(guildPersonalityMapper.knownGuild(guild.id) && newMember.id == guildPersonalityMapper.getPersonalityForGuild(guild.id).Personality.User.DiscordSnowflake){
                var notificationChannel = guild.channels.find(channel => channel.name === 'general');
                //notificationChannel.send(`@everyone, Tmeme is now live playing ${newMember.presence.game.name}! ${newMember.presence.game.url}`);
            }
        } 
    }); 

    client.on('voiceStateUpdate', (oldMember, newMember) => {
        if (//(newMember.guild.name == 'DeadNoob') &&
                (typeof oldMember.voiceChannel == 'undefined' || oldMember.voiceChannel.name !== "The Ocean") &&
                (typeof newMember.voiceChannel != 'undefined' && newMember.voiceChannel.name === "The Ocean")) {
            let voiceChannel = newMember.voiceChannel;
            if (!playingOceanMan) {
                playingOceanMan = true;
                voiceChannel.join().then(connection => {
                    //starting playing ocean man
                    oceanMan.playFile('./OceanMan.mp3');
                    const dispatcher = connection.playBroadcast(oceanMan);
                    //adjust volume
                    dispatcher.setVolumeLogarithmic(.25);
                    //setup end event.
                    //wait long enough for ocean man to have finished playing, then send the end event.
                    setTimeout(() => {
                        playingOceanMan = false;
                        voiceChannel.leave();
                    }, 130000)
                });
            }
        }
    });

    client.on('error', (error) =>{
        console.log(error);
        console.log(`Client's status on error: ${client.status}`);
    });
    
    client.login(process.env.LOGIN_KEY);
}

init();