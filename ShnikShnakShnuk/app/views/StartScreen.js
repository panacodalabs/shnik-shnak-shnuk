// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ShnikShnakShnuk
// View: StartScreen
// ==========================================================================

ShnikShnakShnuk.StartScreen = M.PageView.design({

    /*
     events: {
     pageshow: {
     target: ShnikShnakShnuk.MyController,
     action: 'init'
     }
     },
     */

    childViews: 'content',

    content: M.ScrollView.design({
        childViews: 'rock paper scissors',

        cssClass: 'startScreen',

        rock: M.LabelView.design({
            value: M.I18N.l('rock'),
            events: {
                click: {
//                    target: ,
//                    action: ''
                }
            },
            cssClass: 'pseudoButton'

        }),
        paper: M.LabelView.design({
            value: M.I18N.l('paper'),
            events: {
                click: {
//                    target: ,
//                    action: ''
                }
            },
            cssClass: 'pseudoButton'
        }),

        scissors: M.LabelView.design({
            value: M.I18N.l('scissor'),
            events: {
                click: {
//                    target: ,
//                    action: ''
                }
            },
            cssClass: 'pseudoButton'
        })
    })

});

