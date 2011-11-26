// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ShnikShnakShnuk
// View: StartScreen
// ==========================================================================

ShnikShnakShnuk.StartScreen = M.PageView.design({


    events: {
        pageshow: {
            target: ShnikShnakShnuk.RemoteController,
            action: 'init'
        }
    },


    childViews: 'content',

    content: M.ScrollView.design({
        childViews: 'username sessionname rock paper scissors console totalLooses totalWins',

        cssClass: 'startScreen',

        username: M.TextFieldView.design({
            initialText: M.I18N.l('username'),
            isEnabled: false,
            value: '',
            contentBinding:{
                target: ShnikShnakShnuk.RemoteController,
                property: 'userName'
            },
            contentBindingReverse:{
                target: ShnikShnakShnuk.RemoteController,
                property: 'userName'
            },
            events:{
                blur:{
                    target: ShnikShnakShnuk.RemoteController,
                    action: 'changeName'
                }
            }
        }),

        sessionname: M.TextFieldView.design({
            value: M.I18N.l('sessionname'),
            contentBinding:{
                target: ShnikShnakShnuk.RemoteController,
                property: 'sessionId'
            },
            contentBindingReverse:{
                target: ShnikShnakShnuk.RemoteController,
                property: 'sessionId'
            },
            events:{
                blur:{
                    target: ShnikShnakShnuk.RemoteController,
                    action: 'joinSession'
                }
            }
        }),

        rock: M.LabelView.design({
            value: M.I18N.l('rock'),
            events: {
                click: {
                    target: ShnikShnakShnuk.GameController,
                    action: 'choosen'
                }
            },
            cssClass: 'pseudoButton'

        }),
        paper: M.LabelView.design({
            value: M.I18N.l('paper'),
            events: {
                click: {
                    target: ShnikShnakShnuk.GameController,
                    action: 'choosen'
                }
            },
            cssClass: 'pseudoButton'
        }),

        scissors: M.LabelView.design({
            value: M.I18N.l('scissor'),
            events: {
                click: {
                    target: ShnikShnakShnuk.GameController,
                    action: 'choosen'
                }
            },
            cssClass: 'pseudoButton'
        }),

        console: M.LabelView.design({
            value:'',
            contentBinding:{
                target: ShnikShnakShnuk.RemoteController,
                property: 'console'
            }
        }),

        totalWins: M.LabelView.design({
            value:'',
            contentBinding:{
                target: ShnikShnakShnuk.GameController,
                property: 'totalWins'
            }
        }),

        totalLooses: M.LabelView.design({
            value:'',
            contentBinding:{
                target: ShnikShnakShnuk.GameController,
                property: 'totalLooses'
            }
        })
    })

});

