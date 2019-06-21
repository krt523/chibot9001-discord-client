const jsonfile = require('jsonfile');
var botdata = jsonfile.readFileSync('botData.json');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

async function mooseProcessorFunction(message){
    message.reply('get kicked! <:moose:339702900731281408> - https://www.twitch.tv/videos/131649435');
};

async function boopProcessorFunction(message){
    message.channel.sendMessage(`B O O P!`);
}

async function teemoProcessorFunction(message){
    var kills = parseInt(message.content.replace('!teemo ', ''), 10);
    if (isNaN(kills)) {
        message.reply(`<:teemo:338209808241000448> has been killed ` + botdata[message.channel.guild.name].teemoKills + ` times by users in this Discord.`)
    } else {
        botdata[message.channel.guild.name].teemoKills += kills;
        message.reply(`<:teemo:338209808241000448> has been killed ` + botdata[message.channel.guild.name].teemoKills + ` times by users in this Discord.`)
        jsonfile.writeFile('botData.json', botdata);
    }
}

async function deadnoobQuoteProcessorFunction(message) {
    var quotes = botdata[message.channel.guild.name].quotes;
    message.channel.sendMessage(quotes[getRandomInt(0, quotes.length)]);
}

async function deadnoobAddQuoteProcessorFunction(message){
    var quote = message.content.substring(9).trim();
    botdata[message.channel.guild.name].quotes.push(quote);
    jsonfile.writeFile('botData.json', botdata);
    message.reply('quote added.');
}

exports.handleCommand = async function handleCommand(command, message){
    switch(command){
        case '!moose':
            mooseProcessorFunction(message);
            return true;
        case '!boop':
            boopProcessorFunction(message);
            return true;
        case '!teemo':
            teemoProcessorFunction(message);
            return true;
        case '!quote':
            deadnoobQuoteProcessorFunction(message);
            return true;
        case '!addquote':
            deadnoobAddQuoteProcessorFunction(message);
            return true;
        default:
            return false;
    }
}

exports.canHandleCommand = function deadNoobCommandHandlerFilter(message){
    return (message.guild.name === 'DeadNoob');
}