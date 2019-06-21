const apiClient = require('./chiBot-api-client');

var discordGuilds;
var snowflakeGuildMap = {};

exports.buildMap = async function buildMap(){
    discordGuilds = await apiClient.getDiscordGuilds();
    discordGuilds.forEach(guild =>{
        //cast to string.
        snowflakeGuildMap[guild.Snowflake] = guild;
    });
}


exports.knownGuild = function knownGuilds(snowflake){
    return typeof snowflakeGuildMap[snowflake] != 'undefined' ? true : false;
};

exports.getPersonalityForGuild = function getPersonalityForGuild(snowflake){
    return snowflakeGuildMap[snowflake]
}

exports.getPersonalityIdForGuild = function getPersonalityIdForGuild(snowflake){
    return snowflakeGuildMap[snowflake].PersonalityId;
};

