const apiClient = require('./chiBot-api-client');
const guildPersonalityMapper = require('./guild-personality-mapper');


exports.handleCommand = async function handleCommand(command, message){
    var result = await apiClient.getPersonalityCommand(guildPersonalityMapper.getPersonalityIdForGuild(message.guild.id), command);
    if(result){
        message.channel.send(result.Response);
        return true;
    } else {
        return false;
    }
}

exports.canHandleCommand = async function personalityCommandCommandHandlerFilter(message){
    return guildPersonalityMapper.knownGuild(message.guild.id);
}