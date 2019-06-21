const guildPersonalityMapper = require('./guild-personality-mapper');
const apiClient = require('./chiBot-api-client');



async function quoteProcessorFunction(message){
    var quoteNumber = parseInt(message.content.replace('!quote ', ''), 10);
    if (isNaN(quoteNumber)) {
        let quote = await apiClient.getRandomPersonalityQuote(guildPersonalityMapper.getPersonalityIdForGuild(message.guild.id));
        message.channel.send(quote.Content);
    } else {
        let quote = await apiClient.getPersonalityQuote(guildPersonalityMapper.getPersonalityIdForGuild(message.guild.id), quoteNumber);
        message.channel.send(quote.Content);
    }
}

exports.commandProcessors = {
    '!quote': 'quoteProcessorFunction'
}

exports.handleCommand = async function handleCommand(command, message){
    switch(command){
        case `!quote`:
            await quoteProcessorFunction(message)
            return true;
        default:
            return false;
    }
}

exports.canHandleCommand = async function quoteCommandHandlerFilter(message){
    return guildPersonalityMapper.knownGuild(message.guild.id);
}