const unirest = require('unirest');
const baseUrl = process.env.BASE_API_URL;



exports.getDiscordGuilds = function getDiscordGuilds(){
    return new Promise((resolve, reject) =>{
        unirest.get(`${baseUrl}/DiscordGuilds`)
        .headers({'Accept': 'application/json'})
        .send()
        .end(response => {
            if(response.ok){
                resolve(response.body);
            } else {
                console.log(response);
                reject(response);
            }
        });
    })
}

exports.postPersonalityQuote = function postPersonalityQuote(personalityId, Quote){
    return new Promise((resolve, reject) =>{
        var quote = {content: Quote};
        unirest.post(`${baseUrl}/Personality/${personalityId}/Quotes`)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .send(JSON.stringify(quote))
        .end(response => {
            if(response.ok){
                resolve(response.body);
            } else {
                reject(response);
            }
        });
    })
}

exports.getPersonalityQuote = function getPersonalityQuote(personalityId, quoteNumber){
    return new Promise((resolve, reject) =>{
        unirest.get(`${baseUrl}/Personality/${personalityId}/Quotes?index=${quoteNumber}`)
        .headers({'Accept': 'application/json'})
        .send()
        .end(response => {
            if(response.ok){
                resolve(response.body);
            } else {
                reject(response);
            }
        });
    })
}

exports.getRandomPersonalityQuote = function getRandomPersonalityQuote(personalityId){
    return new Promise((resolve, reject) =>{
        unirest.get(`${baseUrl}/Personality/${personalityId}/Quotes?random=true`)
        .headers({'Accept': 'application/json'})
        .send()
        .end(response => {
            if(response.ok){
                resolve(response.body);
            } else {
                reject(response);
            }
        });
    })
}

exports.getPersonalityCommand = function getPersonalityCommand(personalityId, command){
    return new Promise((resolve, reject) =>{
        unirest.get(`${baseUrl}/Personality/${personalityId}/PersonalityCommands/${command}`)
        .headers({'Accept': 'application/json'})
        .send()
        .end(response => {
            if(response.ok){
                resolve(response.body);
            } else if(response.code = 404) {
                resolve(null);
            } else {
                reject(response);
            }
        });
    })
}