module.exports = {
    name: 'ping',
    execute(ping) {
        ping.channel.send(`🏓 **Pong**  | in ...`)
        .then(pong => pong.edit(`🏓 **Pong**  | in ${pong.createdTimestamp - ping.createdTimestamp}ms!`));
    }
}