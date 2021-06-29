module.exports = {
    name: 'exec',
    execute(message, args) {
        if(message.author.id != '755109987474473059') return;

        eval(args.join(' ').trim());
    }
}