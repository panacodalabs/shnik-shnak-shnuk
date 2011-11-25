// ==========================================================================
// The M-Project - Mobile HTML5 Application Framework
// Generated with: Espresso 
//
// Project: ShnikShnakShnuk
// View: StartScreen
// ==========================================================================

ShnikShnakShnuk.StartScreen = M.PageView.design({

    /* Use the 'events' property to bind events like 'pageshow' */
    events: {
        pageshow: {
            target: ShnikShnakShnuk.MyController,
            action: 'init'
        }
    },

    childViews: 'header content footer',

    header: M.ToolbarView.design({
        value: 'HEADER',
        anchorLocation: M.TOP
    }),

    content: M.ScrollView.design({
        childViews: 'label',
        label: M.LabelView.design({
            value: 'StartScreen'
        })
    }),

    footer: M.ToolbarView.design({
        value: 'FOOTER',
        anchorLocation: M.BOTTOM
    })

});

