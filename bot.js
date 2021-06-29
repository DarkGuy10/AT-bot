const Discord = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
require('dotenv').config();

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.guildConfigs = new Discord.Collection(); //Mapped with guildID

client.once('ready', () => {
    console.log('Bot Online...');
    console.log('Loading Guild Configs...')
    client.guilds.cache.each(guild => {
        const configChannel = guild.channels.cache.find(channel => channel.parent && channel.parent.name === 'AT-bot-zone' && channel.name === 'config');
        if(configChannel){
            try {
                configChannel.messages.fetch({ limit: 10 })
                    .then(messages => {
                        const configMessage = messages.find(message => message.author == client.user && message.content.includes('json'));
                        if(!configMessage)
                            throw 'Mis-configured'
                        const config = JSON.parse(configMessage.content.replaceAll('```', '').replace('json', ''));
                        client.guildConfigs.set(guild.id, config);
                        console.log('Done!');
                    })
            } catch(error) {
                console.error(error);
                guild.systemChannel()?.send('Server mis-configured!');
            }
        }
    });
})

client.on('guildMemberAdd', member => {
    if(member.user.bot) return;
    const guildConfigs = client.guildConfigs.get(member.guild.id);
    member.roles.add(guildConfigs.unverifiedRoleID);
    member.guild.channels.resolve(guildConfigs.waitingRoomChannelID).send(`${member} ${member.guild.roles.resolve(guildConfigs.verifierRoleID)} Please complete the verification to be able to talk in server!`)
});

client.on('message', message => {
    if(!message.content.startsWith(config.prefix) || message.author.bot || message.channel.type === 'dm') return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift();
    command = client.commands.get(commandName);
    if(!command) return;

    try{
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error!');
    }

});

client.login(process.env.token)