module.exports = {
    name: 'ping',
    async execute(ping) {
        const pong = await ping.channel.send(`🏓 **Pong**  | in ...`)
        pong.edit(`🏓 **Pong**  | in ${pong.createdTimestamp - ping.createdTimestamp}ms!`);
    }
}