module.exports = {
    name: 'init',
    execute(message, args) {
        const waitingRoom = message.content.match(/<#[0-9]{18}>/g)[0].slice(2, 20);
        const unverifiedRole = message.content.match(/<@&[0-9]{18}>/)[0].slice(3, 21);
        const init_config = {
            "waitingRoom": waitingRoom,
            "unverifiedRole": unverifiedRole
        }
        
        if(message.guild.channels.cache.some(channel => channel.name === 'AT-bot-logs'))
            return message.channel.send('Bot already initialised!');

        const msg = message.channel.send('Initing...');
        message.guild.channels.create('AT-bot-logs', {
            type: 'text',
            //permissionOverwrites: [
            //    {   
            //        id: '771033339665842227', //@everyone
            //        deny: ['VIEW_CHANNEL'],
            //    },
            //],
        }).then(channel => {
            channel.send(`**Bot Details**\n${JSON.stringify(init_config)}`);
        });
    }
}