#! /usr/bin/env node
//include socket-io and express (need to be installed first - try npm)
var _port = Number(process.argv.pop()) || 8880;

var io = require('socket.io').listen(_port);
io.set('log level', 1);

var shnikit = io
  .of('/shnikit')
  .on('connection', function (socket) {

    var that = this;
    socket.on('shnikit', function(msg){

        console.log(msg);
        if(msg && msg.sub){

            if(msg.sub === 'whatsup'){
                that.whatsup(msg);
            }
            if(msg.sub === 'changeName'){
                that.changeName(msg);
            }
            if(msg.sub === 'choosen'){
                that.choosen(msg);
            }
        }
    });
});

shnikit.sessions = [];
shnikit.sessionId = 0;

shnikit.findSession = function(msg){
    var sid = Number(msg.sessionId);
    var that = this;
    var ret = 0;
    if(sid && typeof(sid) === 'number'){
        Object.keys(that.sessions).forEach(function(key){
            if(that.sessions[key].sessionId === sid){
                   var session = that.sessions[key];
                   ret = that.sessions[key];
                   return;
               }
            });
    }
    return ret;
}

shnikit.changeName = function(msg){
    var session = that.findSession(msg);

}

shnikit.choosen = function(msg){
    var that = this;
    var session = that.findSession(msg);

    session.users[msg.userName].userItem = msg.item;

    var results = [];
    Object.keys(session.users).forEach(function(key){
       if(key !== 'sessionId' && session.users[key].userItem){
           results.push(session.users[key].userItem);
       }
    });
    if(results.length <= 1){
        return;
    }
    var winnerItem = that.detectWinner(results);
    var win = 'tie';
    Object.keys(session.users).forEach(function(key){
       if(key !== 'sessionId' && session.users[key].userItem){
           if(session.users[key].userItem == winnerItem && winnerItem){
               win = session.users[key].userName;
           }
           session.users[key].userItem = '';
       }
    });
    shnikit.emit('shnikit', {
        sub: 'result',
        data: {
            sessionId: session.sessionId,
            winner: win
        }
    });
    results = [];
}

shnikit.whatsup = function(msg){
    var that = this;

    this.checkExistingSession(msg.sessionId);

    if(msg.sessionId > 0){
        var session = that.findSession(msg);
        if(session){
            session['users'][msg.userName] = {
                userName: msg.userName,
                userItem: ''
            }
            console.log('join ->', session);
            shnikit.emit('shnikit', {
                sub: 'joined',
                data: session
            });
        }
    }else{
        that.sessionId += 1;
        var data = {
            sessionId: that.sessionId
        }
        data.users = {};
        data.users[msg.userName] = {
                userName: msg.userName,
                userItem: ''
            }
        that.sessions.push(data);
        shnikit.emit('shnikit', {
            data: {
                sessionId: that.sessionId
            },
            sub: 'opened'
        });
    }
    console.log(that.sessions);
}

shnikit.checkExistingSession = function(id){
    var that = this;
    var ret = -1;
    Object.keys(that.sessions).forEach(function(key){
        if(that.sessions[key].sessionId == id){
            ret = that.sessions[key];
        }
    });
    return ret;
}

shnikit.detectWinner = function(result){
    var scissor = 1;
    var rock = 2;
    var paper = 3;
    var tied = 0;
    var r0 = (result[0]);
    var r1 = (result[1]);
    var ret = -1
    if(r0 === r1){
        ret =  tied;
    }else if(r0 === paper){
        if(r1 === rock){
            ret =  r0;
        }else{
            ret =  r1;
        }
    }else if(r0 === rock){
        if(r1 === scissor){
            ret =  r0;
        }else{
            ret =  r1;
        }
    }else if(r0 === scissor){
        if(r1 === rock){
           ret = r1;
        }else{
            ret =  r0
        }
    }
    return ret;
}

/*
shnikit.lala= function(key){
    if(key === 1 || key === '1'){
        return 'scissor';
    }
    if(key === 2 || key === '2'){
        return 'rock';
    }
    if(key === 3 || key === '3'){
        return 'paper';
    }


    if(key === 'scissor'){
        return 1;
    }
    if(key === 'rock'){
        return 2;
    }
    if(key === 'paper'){
        return 3;
    }
    return 'error'
}*/