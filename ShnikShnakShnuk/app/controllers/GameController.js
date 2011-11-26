// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ShnikShnakShnuk
// Controller: RemoteController
// ==========================================================================

ShnikShnakShnuk.GameController = M.Controller.extend({

    totalLooses : 'looser: ',
    totalWins : 'winner: ',


    choosen: function(btnId){
        var btn = M.ViewManager.getViewById(btnId);
        if(btn){
            var value = this.getValue(btn);
            ShnikShnakShnuk.RemoteController.send('choosen', {item: value});
            ShnikShnakShnuk.RemoteController.set('console', value + 'gewählt')
        }
    },

    getValue: function(obj){

    //'scissors' : 'Schere' 1
    //'rock' : 'Stein', 2
    //'paper' : 'Papier', 3

        console.log('val', obj.value);

        if(obj.value === M.I18N.l('scissor')){
            return 1;
        }else if(obj.value === M.I18N.l('rock')){
            return 2;
        }else if(obj.value === M.I18N.l('paper')){
            return 3;
        }else{
            return 0;
        }
    }
});
