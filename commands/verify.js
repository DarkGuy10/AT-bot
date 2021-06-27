module.exports = {
    name: 'verify',
    execute(message, args){
        const toVerifyID =  args.join(' ').match(/<@![0-9]{18}>/)[0].slice(3, 21);
        message.guild.members.fetch(toVerifyID)
            .then(member => {
                if(!member.roles.cache.has('852849206858088488'))
                    return message.channel.send(`Already verified ${member}`);
                member.roles.remove('852849206858088488')
                    .then(() => {
                        return message.channel.send(`Verified ${member}`)
                    });
            });
    }
}