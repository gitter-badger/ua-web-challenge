/**
 * Created by Роман on 28.03.2015.
 */
var ACCESS_TOKEN = '639c14a2fbdc4aa5e42cd691b7b01c6eee9b8f43';
var RoomsToWatch = process.argv.splice(2);
var Gitter = require('node-gitter');
var gitter = new Gitter(ACCESS_TOKEN);
/**
 * core object it is a source of power... really...
 * @type {{calc : {help_message: string, service: exports}, sense_of_life: {help_message: string, service: service}, help: {help_message: string, service: exports}}}
 */
global.Core = {
    "calc ": {
        help_message: "provide simple calculation: calc 1 + 2 -> 1 + 2 = 3",
        service: require('./services/calc')
    },
    "sense_of_life": {
        help_message: 'define the main sense of life',
        service: function (data, Room) {
            setTimeout(function () {
                Room.send('The result is: ' + 42);
            }, 20000);
            return 'please, be patient and wait, calculation will be done soon) '
        }
    },
    "help": {
        help_message: 'type: help <method> for more information',
        service: require('./services/help')
    }
};
/**
 * login
 */
gitter.currentUser()
    .then(function(user) {
        console.log('You are logged in as:', user.username);
        JoinToRooms(RoomsToWatch);
    });
/**
 * join to rooms
 * @param {Array} Rooms
 */
function JoinToRooms (Rooms) {
    Rooms.forEach(function (room_id, index) {
        console.log(room_id);
        gitter.rooms.join(room_id, function(err, Room) {
            if (err) {
                console.error('Not possible to join the room: ', err);
                return;
            }
            console.log('Joined room: ', Room.name);
            Room.send('Hello, I\'m a "Deep Thought" bot. For more information, please, send command help');
            listerRoom(Room);
        });
    });
}
/**
 * listen room's messages
 * @param Room
 */
function listerRoom (Room) {
    var events = Room.listen();
    events.on('message', function(message) {
        console.log("**********Message start**********");
        console.log("Room      |", Room.name);
        console.log("User      |", message.fromUser.username);
        console.log("Message   |", message.text);
        detectCommand(message.text, Room);
        console.log("***********Message end***********");
    });
}
/**
 * method check of matching of command in message text
 * available command is the keys in core object
 * @param {string} text - of message
 * @param {Object} [Room]
 */
function detectCommand (text, Room) {
    var command_name, serializeRegExp, data;
    for (command_name in global.Core) {
        if (text.indexOf(command_name) === 0) {
            console.log('!!!Command _', command_name, '_ detected!!!');
            serializeRegExp = new RegExp(command_name, 'i');
            data = text.replace(serializeRegExp, '');
            if (typeof global.Core[command_name].service === 'function') {
                console.time(command_name);
                runCommand (command_name, data, Room);
                console.timeEnd(command_name);
            } else {
                console.error('something wrong with service for command: ' , command_name);
            }
        }
    }
}
/**
 * runCommand
 * @param {string} command_name
 * @param {string} data
 * @param {Object} [Room]
 */
function runCommand (command_name, data, Room) {
    var command_result = Core[command_name].service(data, Room);
    if (typeof Room === 'object') {
        Room.send(command_result)
    }
    return command_result
}