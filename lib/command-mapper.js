var commandHandlers = [];
exports.commandHandlers = commandHandlers;

exports.registerCommandHandler = function registerCommandHandler(commandHandler){
    commandHandlers.push(commandHandler);
};

exports.mapCommandToHandler = async function mapCommandToHandler(message){

    var command = getCommandFromMessage(message);
    if(!command){
        return;
    }
    
    for(let commandHandler of commandHandlers){
        if(commandHandler.canHandleCommand(message)){
            let wasCommandHandled = await commandHandler.handleCommand(command, message);
            if(wasCommandHandled){
                break;
            }
        }
    }
};

function getCommandFromMessage(message){
    var spaceIndex = message.content.indexOf(" ");
    if(spaceIndex == -1){
        return message.content;
    }
    if(spaceIndex > 1){
        return message.content.substr(0, spaceIndex);
    } else {
        return -1;
    }
}