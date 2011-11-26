// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ShnikShnakShnuk
// Controller: RemoteController
// ==========================================================================

ShnikShnakShnuk.RemoteController = M.Controller.extend({

    sessionId: -1,
    console: '',
    userName: '',

    init: function(isFirstLoad) {
        if (isFirstLoad) {
            this.registerCallbacks();
            this.set('userName', 'Mika' + M.Date.now().getTimestamp());
            this.send('whatsup');
        }
    },

    send: function(sub, message) {
        var msg = message ? message : {};
        msg.sub = sub;
        msg.userName = this.userName;
        msg.sessionId = this.sessionId;
        M.SocketRequest.send({
            url: 'http://192.168.2.62:8880/shnikit',
            channel: 'shnikit',
            message: msg});
    },

    registerCallbacks: function() {

        var that = this
        console.log('register');
        M.SocketRequest.receive({
            url: 'http://192.168.2.62:8880/shnikit',
            channel: 'shnikit',
            callbacks:{
                onMessage:{
                    target:that,
                    action:'receive'
                }
            }
        });
    },

    newSession: function(msg) {
        this.set('sessionId', msg);
        this.set('console', 'new Session');
    },

    joinSession: function() {
        this.send('whatsup');
    },

    changeName: function() {
        //this.send('whatsup', {userName: this.userName, sessionId: this.sessionId});
    },

    joined: function(msg) {
        var data = msg.data

        var players = [];
        Object.keys(data.users).forEach(function(key) {
            players.push(data.users[key].userName);
        });

        this.set('console', players[0] + ' vs. ' + players[1] );
    },

    result: function(msg) {
        var data = msg.data
        console.log(msg.data);
        var txt = msg.data.winner;
        if (msg.data.winner === this.userName) {
            txt = 'you win';
            var t = ShnikShnakShnuk.GameController.totalWins;
            ShnikShnakShnuk.GameController.set('totalWins', t += 'l');
        } else if (msg.data.winner !== 'tie') {
            txt = 'you loose';
            var t = ShnikShnakShnuk.GameController.totalLooses;
            ShnikShnakShnuk.GameController.set('totalLooses', t += 'l');
        }
        this.set('console', txt);
    },

    receive: function(msg) {
        console.log('receive', msg);
        if (msg && msg.sub && msg.data) {
            if (msg.sub === 'opened' && this.sessionId < 0) {
                this.newSession(msg.data.sessionId);
            }

            console.log(msg.data.sessionId, this.sessionId);
            if (msg.data.sessionId == this.sessionId) {
                if (msg.sub === 'joined') {
                    this.joined(msg);
                }
                if (msg.sub === 'result') {
                    this.result(msg);
                }
            }
        }
    }
});
