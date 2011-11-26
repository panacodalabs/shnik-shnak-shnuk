// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ShnikShnakShnuk
// Controller: RemoteController
// ==========================================================================

ShnikShnakShnuk.RemoteController = M.Controller.extend({

    sessionId: '',
    userName: '',

    send: function(sub, message) {
        console.log('send');
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
        var data = msg.data.session;

        var n1 = data.firstUser.name;
        var n2 = data.secondUser.name;
        ShnikShnakShnuk.GameController.set('background', n1 + ' ' + M.I18N.l('vs') + ' ' + n2);
    },

    result: function(msg) {
        ShnikShnakShnuk.GameController.update(msg);
    },

    receive: function(msg) {

        if(msg && msg.data && msg.data.sessionId === this.sessionId){
            
            if(msg.sub === 'joined'){
                this.joined(msg);
                var page = M.ViewManager.getCurrentPage();
                var view = M.ViewManager.getView(page, 'content').currentView;
                if(view._name != 'second'){
                    M.ViewManager.getView(page, 'content').toggleView();
                }
            }
            if(msg.sub === 'create'){
                var page = M.ViewManager.getCurrentPage();

                M.ViewManager.getView(page, 'content').toggleView();
            }
            if(msg.sub === 'result'){
                this.result(msg.data);
            }
        }
    }
});
