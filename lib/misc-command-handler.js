
async function eightBallProcessorFunction(message) {
    if (message.content.trim() === '!8') {
        message.reply(`I'm a bot, not a mind reader. Ask a question.`);
    } else {
        var answers = ["It is certain", "It is decidedly so", "Without a doubt",
            "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely",
            "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later",
            "Better not tell you now", "Cannot predict now", "Concentrate and ask again", "Don't count on it",
            "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful"];

        var min = Math.ceil(0);
        var max = Math.floor(answers.length - 1);
        message.reply(answers[Math.floor(Math.random() * (max - min + 1)) + min]);
    }
}

async function rollProcessorFunction(message) {
    //Validate input
    var re = /!roll (\d*)?[Dd](\d*)(\+\d*|-\d*)?/;
    var result = re.exec(message.content);
    if (result == null) {
        return null;
    }

    //Set the max number we can get per simulated die roll. If we're passed a bad die size,
    //return false.
    var min = Math.ceil(1);
    var max;
    var allowedDiceSizes = [4, 6, 8, 10, 12, 20, 100];
    var diceSize = Number(result[2])
    if (allowedDiceSizes.includes(diceSize)) {
        max = Math.floor(diceSize + 1);
    } else {
        return null;
    }

    //Figure out how many dice we're rolling.
    var loopLimit = 1;
    if (result[1] && result[1] >= 2)
        loopLimit = result[1]

    //ROLL THE DICE
    var rollTotal = 0;
    for (let i = 0; i < loopLimit; i++) {
        rollTotal += Math.floor(Math.random() * (max - min)) + min
    }

    //Apply modifiers
    if (result[3])
        rollTotal += Number(result[3]);

    //return result
    message.reply(rollTotal);
}


exports.handleCommand = async function handleCommand(command, message) {
    switch (command) {
        case '!8':
            eightBallProcessorFunction(message);
            return true;
        case '!roll':
            rollProcessorFunction(message);
            return true;
        default:
            return false;
    }
}

exports.canHandleCommand = function miscCommandHandlerFilter(message) {
    return true;
}