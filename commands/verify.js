const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'verify',
    async execute(message){
        const guildConfigs = message.client.guildConfigs.get(message.guild.id);
        if(message.channel.id != guildConfigs.waitingRoomChannelID || !message.member.roles.cache.has(guildConfigs.verifierRoleID))
            return;

        const member = message.mentions.members.first();
        if(!member.roles.cache.has(guildConfigs.unverifiedRoleID))
            return message.channel.send(`**${member}** is already verified!`);
        member.roles.remove(guildConfigs.unverifiedRoleID);
        member.roles.add(guildConfigs.defaultRoleID);
        const embed = new MessageEmbed().setColor('YELLOW').setImage('https://animeraifu.files.wordpress.com/2014/12/brdurw_chu2byo_lite_05_360p-mkv_snapshot_07-01_2012-10-27_15-00-58.jpg').setAuthor(message.author.tag, member.user.displayAvatarURL()).setTimestamp().setDescription(`**${member.user.tag}** was verified by **${message.author.tag}**!`);
        message.channel.send({ embeds: [embed] });
        const logEmbed = new MessageEmbed().setColor('YELLOW').setAuthor(message.author.tag, message.author.displayAvatarURL()).setTimestamp().setDescription(`**${member.user.tag}** was verified by **${message.author.tag}** at ${new Date().toUTCString()}`);
        message.guild.channels.resolve(guildConfigs.logsChannelID).send({embeds:[logEmbed]});
    }
}