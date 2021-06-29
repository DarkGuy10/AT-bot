const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'init',
    async execute(message, args) {        
        if(message.guild.channels.cache.some(channel => channel.name === 'AT-bot-zone'))
            return message.channel.send('Bot already initialised!');

        if(args.length < 1)
        return message.channel.send('Missing `<Default Role>`');
        
        const outputs = [];
        outputs.push('> Starting...');
        const initEmbed = new MessageEmbed()
            .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
            .setColor('YELLOW')
            .setTitle('INITIALISING BOT')
            .setDescription(`\`\`\`\n${outputs.join('\n')}\`\`\``)
            .setTimestamp()
            .setFooter(`Started by ${message.author.tag}`, message.author.displayAvatarURL());
        
        const appendEmbed = async output => {
            outputs.push(output);
            initEmbed.setDescription(`\`\`\`\n${outputs.join('\n')}\`\`\``);
            await msg.edit(initEmbed);
        }

        const msg = await message.channel.send(initEmbed);
       
        await appendEmbed('> Creating unverified role...')
        const unverifiedRole = await message.guild.roles.create({
            data: {
                name: 'UNVERIFIED',
                color: 'RED',
                hoist: true,
                permissions: [],
                mentionable: true
            }});

        
        await appendEmbed(`> Editing perms for ${unverifiedRole}...`);
        message.guild.channels.cache.each(async (channel) => {
            await channel.createOverwrite(unverifiedRole.id, {
                SEND_MESSAGES: false
            })
        })

        await appendEmbed('> Creating verifier role...');
        const verifierRole = await message.guild.roles.create({
            data: {
                name: 'VERIFIER',
                color: 'BLUE',
                permissions: [],
                mentionable: true,
                position: 2
            }});

        await appendEmbed(`> Creating waiting-room channel...`);
        const waitingRoomChannel = await message.guild.channels.create('waiting-room', {
            type: 'text',
            permissionOverwrites: [
                {   
                    id: message.guild.roles.everyone.id, //@everyone
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: unverifiedRole.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                },
                {
                    id: verifierRole.id,
                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                }
            ],
        });

        await appendEmbed(`> Setting up private bot channels...`);
        const category = await message.guild.channels.create('AT-bot-zone', {
            type: 'category',
            permissionOverwrites: [
                {   
                    id: message.guild.roles.everyone.id, //@everyone
                    deny: ['VIEW_CHANNEL'],
                },
            ],
        });

        await appendEmbed('> Adding logs channel...');
        const logsChannel = await message.guild.channels.create('logs', {
            type: 'text',
            parent: category
        });

        await appendEmbed('> Adding config channel...');
        const configChannel = await message.guild.channels.create('config', {
            type: 'text',
            parent: category
        });

        await appendEmbed(`> Setting up bot configs...`);
        const config = {
            unverifiedRoleID: unverifiedRole.id,
            verifierRoleID: verifierRole.id,
            waitingRoomChannelID: waitingRoomChannel.id,
            defaultRoleID: args[0].slice(3, 21),
            logsChannelID: logsChannel.id,
            configChannelID: configChannel.id
        }
        message.client.guildConfigs.set(message.guild.id, config);
        await configChannel.send(`\`\`\`json\n${JSON.stringify(config, null, 4)}\`\`\``);

        await appendEmbed(`> Bot Successfully Initialised!`);
    }
}