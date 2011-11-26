#! /usr/bin/env node

var _port = Number(process.argv.pop()) || 8880;

var io = require('socket.io').listen(_port);
io.set('log level', 1);

var shnikit = io
        .of('/shnikit')
        .on('connection', function (socket) {

            var that = this;
            socket.on('shnikit', function(msg) {

                if (msg && msg.sub) {

                    if (msg.sub === 'whatsup') {
                        that.whatsup(msg);
                    }
                    if (msg.sub === 'changeName') {
                        that.changeName(msg);
                    }
                    if (msg.sub === 'choosen') {
                        that.choosen(msg);
                    }
                }
            });
        });

shnikit.sessions = [];
shnikit.sessionId = 0;

shnikit.whatsup = function(msg) {
    var that = this;

    if (that.sessions[msg.sessionId]) {
        that.join(msg);
    } else {
        that.create(msg);
    }
}

shnikit.create = function(msg) {
    var that = this;

    that.sessions[msg.sessionId] = {};
    that.sessions[msg.sessionId].firstUser = {
        name: msg.userName,
        item: '',
        totalWins: 0
    };

    shnikit.emit('shnikit', {
        sub: 'create',
        data: {
            sessionId: msg.sessionId,
            session: that.sessions[msg.sessionId]
        }
    });

    console.log('create', that.sessions);
}

shnikit.join = function(msg) {
    var that = this;
    if (that.sessions[msg.sessionId].secondUser || that.sessions[msg.sessionId].firstUser.name === msg.userName) {
//        TODO SHOW ERROR MESSAGE - session full, nick allready taken
        return
    }
    that.sessions[msg.sessionId].secondUser = {
        name: msg.userName,
        item: '',
        totalWins: 0
    };

    shnikit.emit('shnikit', {
        sub: 'joined',
        data: {
            sessionId: msg.sessionId,
            session: that.sessions[msg.sessionId]
        }
    });

    console.log('joined', that.sessions);
}

shnikit.choosen = function(msg) {
    var that = this;
    var session = that.sessions[msg.sessionId];

    var user1 = that.sessions[msg.sessionId].firstUser;
    var user2 = that.sessions[msg.sessionId].secondUser;

    var go = [];

    if (session) {
        if (user1 && user1.name === msg.userName) {
            user1.item = msg.item;
        }
        if (user2 && user2.name === msg.userName) {
            user2.item = msg.item;
        }

        if (user1 && user1.item && user2 && user2.item) {
            var winner = that.detectWinner(user1, user2);
            
            user1.item = '';
            user2.item = '';
            shnikit.emit('shnikit', {
                sub: 'result',
                data: {
                    sessionId: msg.sessionId,
                    winner: winner ? winner : 'tie',
                    session: that.sessions[msg.sessionId]
                }
            });
        }
    }
}

shnikit.detectWinner = function(u1, u2) {
    var scissor = 1;
    var rock = 2;
    var paper = 3;
    var tied = 0;
    var r0 = u1.item;
    var r1 = u2.item;
    var ret = -1

    if (r0 === r1) {
        ret = tied;
    } else if (r0 === paper) {
        if (r1 === rock) {
            u1.totalWins +=1;
            ret = u1;
        } else {
            u2.totalWins +=1;
            ret = u2;
        }
    } else if (r0 === rock) {
        if (r1 === scissor) {
            u1.totalWins +=1;
            ret = u1;
        } else {
            u2.totalWins +=1;
            ret = u2;
        }
    } else if (r0 === scissor) {
        if (r1 === rock) {
            u2.totalWins +=1;
            ret = u2;
        } else {
            u1.totalWins +=1;
            ret = u1;
        }
    }
    return ret;
}