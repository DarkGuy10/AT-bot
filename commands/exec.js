module.exports = {
    name: 'exec',
    execute(message, args) {
        eval(args.join(' ').trim());
    }
}