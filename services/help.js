module.exports = function (data) {
    var available_command = '\nAvailable commands: ';
    var command_tips = '';
    var command;
    if (!data) {
        for(command in global.Core) {
            available_command += command + ' ';
        }
        available_command += '\n For detail information send: help <command_name>';
        return available_command + '\n';
    } else {
        data = data.replace(/ +/, '');
        for(command in global.Core) {
            if (command.indexOf(data) !== -1) {
                if (global.Core[command].help_message !== undefined) {
                    command_tips += global.Core[command].help_message + '\n';
                }

            }
        }
        return command_tips;
    }
};