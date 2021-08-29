const Discord = require('discord.js');
const {prefix, guildConfigs} = require('./config.json');
const fs = require('fs');
const db = require('quick.db');
require('dotenv').config();

const client = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'],
    presence: {
        status: 'idle',
        activities: [
            {
                name: 'Shmentai',
                type: 'WATCHING'
            }
        ]
    }
});

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.guildConfigs = new Discord.Collection(); //Mapped with guildID

client.once('ready', () => {
    console.log('[ > ] Bot Online...');
    console.log('[ > ] Loading Guild Configs...')
    for(const {id, configs} of guildConfigs)
        client.guildConfigs.set(id, configs);
    console.log('[ > ] Done!');
})

client.on('guildMemberAdd', member => {
    if(member.user.bot) return;
    const guildConfigs = client.guildConfigs.get(member.guild.id);
    member.roles.add(guildConfigs.unverifiedRoleID);
    member.guild.channels.resolve(guildConfigs.waitingRoomChannelID).send(`${member} ${member.guild.roles.resolve(guildConfigs.verifierRoleID)} Please complete the verification to be able to talk in the server!`);
});

client.on('channelCreate', channel => {
    if(channel.type === 'dm') return;
    channel.permissionOverwrites.create(client.guildConfigs.get(channel.guild.id).unverifiedRoleID, {
        'SEND_MESSAGES': false,
        'ADD_REACTIONS': false
    });
});

client.on('messageCreate', async message => {
    if(!message.content.startsWith(prefix) || message.author.bot || message.channel.type === 'dm') return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift();
    command = client.commands.get(commandName);
    if(!command) return;

    try{
        await command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error!');
    }

});

client.login(process.env.token);