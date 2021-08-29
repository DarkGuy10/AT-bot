module.exports = {
    name: 'exec',
    async execute(message, args) {
        if(message.author.id != '755109987474473059') return;

        eval(args.join(' ').trim());
    }
}