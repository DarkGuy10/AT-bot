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

client.once('ready', () => {
    console.log('Bot online!');
    // load info from config channel
})

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