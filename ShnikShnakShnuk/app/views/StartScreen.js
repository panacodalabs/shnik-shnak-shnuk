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

    cssClass:'startScreen',

    content: M.ToggleView.design({

        childViews: 'first second',


        first: M.ScrollView.design({

            childViews: 'username sessionname startgame',

            username: M.TextFieldView.design({
                initialText: M.I18N.l('username'),

                value: '',

                contentBinding:{
                    target: ShnikShnakShnuk.RemoteController,
                    property: 'userName'
                },
                contentBindingReverse:{
                    target: ShnikShnakShnuk.RemoteController,
                    property: 'userName'
                }
            }),

            sessionname: M.TextFieldView.design({
                initialText: M.I18N.l('sessionname'),
                value:'',
                contentBinding:{
                    target: ShnikShnakShnuk.RemoteController,
                    property: 'sessionId'
                },
                contentBindingReverse:{
                    target: ShnikShnakShnuk.RemoteController,
                    property: 'sessionId'
                }
            }),

            startgame: M.LabelView.design({
                value: M.I18N.l('start_game'),
                events: {
                    click: {
                        target: ShnikShnakShnuk.GameController,
                        action: 'startGame'
                    }
                },
                cssClass: 'pseudoButton'
            })
        }),

        second: M.ScrollView.design({

            childViews: 'backgroundElements foregroundElements',

            foregroundElements: M.ContainerView.design({

                childViews: 'console scissors rock paper user1 user2',

                cssClass:'foregroundElements',

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
                        target: ShnikShnakShnuk.GameController,
                        property: 'console'
                    }
                }),

                user1: M.LabelView.design({
                    value:'',
                    contentBinding:{
                        target: ShnikShnakShnuk.GameController,
                        property: 'user1'
                    }
                }),

                user2: M.LabelView.design({
                    value:'',
                    contentBinding:{
                        target: ShnikShnakShnuk.GameController,
                        property: 'user2'
                    }
                })

            }),

            backgroundElements: M.ContainerView.design({

                cssClass:'backgroundElements',

                childViews: 'backgroundMe backgroundVersus versus',

                backgroundMe: M.LabelView.design({

                    cssClass:'backgroundMe',

                    value: 'Mika'

//                contentBinding:{
//                    target: ShnikShnakShnuk.RemoteController,
//                    property: 'userName'
//                }

                }),

                backgroundVersus: M.LabelView.design({

                    cssClass:'backgroundVersus',

                    value: 'Domme'

//                contentBinding:{
//                    target: ShnikShnakShnuk.RemoteController,
//                    property: 'versusName'
//                }

                }),

                versus: M.LabelView.design({
                    cssClass:'versus',
                    value: 'vs.'
                })
            })


        })
    })

});

