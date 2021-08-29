module.exports = {
    name: 'reload',
    async execute(message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName);
        if(!command)
            return message.channel.send('Command not found!');

        message.channel.send(`Reloading \`${command.name}\`...`)
            .then(msg => {
                delete require.cache[require.resolve(`./${command.name}.js`)];
                try{
                    const newCommand = require(`./${command.name}.js`);
                    message.client.commands.set(newCommand.name, newCommand);
                    msg.edit(`\`${newCommand.name}\` reloaded!`);
                } catch(error) {
                    console.error(error);
                    msg.edit(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
                }
            });
    }
}