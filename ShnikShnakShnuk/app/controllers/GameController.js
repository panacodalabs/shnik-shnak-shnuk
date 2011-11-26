// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ShnikShnakShnuk
// Controller: RemoteController
// ==========================================================================

ShnikShnakShnuk.GameController = M.Controller.extend({

    user1 : 'looser: ',
    user2 : 'winner: ',
    console: '',

    makeWinnerStrings: function(wins){

        var fives = M.Math.round(wins/5, M.FLOOR);
        var ones = wins%5;
        var str = '';

        for(var i = 0; i < fives; i++){
            str += '||||<span class="five">|</span><span class="ws"></span>';
        }
        for(var i = 0; i < ones; i++){
            str += '|';
        }

        return str;
    },

    startGame: function(isFirstLoad) {

        var page = M.ViewManager.getCurrentPage();
        M.ViewManager.getView(page, 'content').toggleView();

        ShnikShnakShnuk.GameController.set('user1', 'user1Txt: ' + this.makeWinnerStrings(5));
        ShnikShnakShnuk.GameController.set('user2', 'user2Txt: ' + this.makeWinnerStrings(6));

        var userName = M.ViewManager.getView(page, 'username').getValue();
        var sessionId = M.ViewManager.getView(page, 'sessionname').getValue();

        if(!userName && !sessionId) return

        ShnikShnakShnuk.RemoteController.registerCallbacks();
        ShnikShnakShnuk.RemoteController.set('userName', userName);
        ShnikShnakShnuk.RemoteController.set('sessionId', sessionId);

        ShnikShnakShnuk.RemoteController.send('whatsup');
    },

    update: function(msg){

        console.log(msg);
        var winner = msg.winner.name ? msg.winner.name : msg.winner;

        if(winner === 'tie'){
            ShnikShnakShnuk.GameController.set('console', M.I18N.l('tie'));
        }else{
            ShnikShnakShnuk.GameController.set('console', M.I18N.l('winner') + ': ' + winner);
        }

        var user1 = msg.session.firstUser;
        var user2 = msg.session.secondUser;

        var user1Txt = user1.name + ': ' + this.makeWinnerStrings(user1.totalWins);
        var user2Txt = user2.name + ': ' + this.makeWinnerStrings(user2.totalWins);

        ShnikShnakShnuk.GameController.set('user1', user1Txt);
        ShnikShnakShnuk.GameController.set('user2', user2Txt);

    },

    choosen: function(btnId) {
        var btn = M.ViewManager.getViewById(btnId);
        if (btn) {
            var value = this.getValue(btn);
            ShnikShnakShnuk.GameController.set('console', M.I18N.l('choosen') + ': ' + btn.value);
            ShnikShnakShnuk.RemoteController.send('choosen', {item: value});
            ShnikShnakShnuk.RemoteController.set('console', value + 'gewählt')
        }
    },

    getValue: function(obj) {

        //'scissors' : 'Schere' 1
        //'rock' : 'Stein', 2
        //'paper' : 'Papier', 3

        console.log('val', obj.value);

        if (obj.value === M.I18N.l('scissor')) {
            return 1;
        } else if (obj.value === M.I18N.l('rock')) {
            return 2;
        } else if (obj.value === M.I18N.l('paper')) {
            return 3;
        } else {
            return 0;
        }
    }
});
