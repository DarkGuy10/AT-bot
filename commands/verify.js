const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'verify',
    execute(message, args){
        const guildConfigs = message.client.guildConfigs.get(message.guild.id);
        if(message.channel.id != guildConfigs.waitingRoomChannelID || !message.member.roles.cache.has(guildConfigs.verifierRoleID))
            return;

        const toVerifyID =  args.join(' ').match(/<@![0-9]{18}>/)[0].slice(3, 21);
        message.guild.members.fetch(toVerifyID)
            .then(async member => {
                if(!member.roles.cache.has(guildConfigs.unverifiedRoleID))
                    return message.channel.send(`**${member.tag}** is already verified!`);
                await member.roles.remove(guildConfigs.unverifiedRoleID);
                await member.roles.add(guildConfigs.defaultRoleID);
                message.channel.send(`**${member.user.tag}** was verified by **${message.author.tag}**!`);
                message.guild.channels.resolve(guildConfigs.logsChannelID).send(new MessageEmbed().setColor('YELLOW').setAuthor(message.author.tag, message.author.displayAvatarURL()).setTimestamp().setDescription(`**${member.user.tag}** was verified by **${message.author.tag}** at ${new Date().toUTCString()}`));
            });
    }
}