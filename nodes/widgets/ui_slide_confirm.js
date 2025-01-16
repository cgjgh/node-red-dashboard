const statestore = require('../store/state.js')

module.exports = function (RED) {
    function SlideConfirmNode (config) {
        RED.nodes.createNode(this, config)

        function getSelectedWidgets (widgetIDs) {
            const selectedWidgets = []

            RED.nodes.eachNode(function (n) {
                if (/^ui-/.test(n.type) && widgetIDs.includes(n.id)) {
                    selectedWidgets.push(n)
                }
            })

            return selectedWidgets || []
        }

        const node = this
        // which group are we rendering this widget
        const group = RED.nodes.getNode(config.group)
        const base = group.getBase()
        node.pt = config.passthru
        node.widgets = config.widgets

        node.state = [' ', ' ']

        const uiWidgets = getSelectedWidgets(node.widgets)

        uiWidgets.forEach(node => {
            base.stores.state.set(base, node, null, 'visible', false)
            base.stores.state.set(base, node, null, 'enabled', false)
        })

        const evts = {
            onAction: true,
            beforeSend: function (msg) {
                /**
                 * Dynamic Properties
                 * */
                const updates = msg.ui_update
                if (updates) {
                    if (typeof (updates.label) !== 'undefined') {
                        // dynamically set "label" property
                        statestore.set(group.getBase(), node, msg, 'label', updates.label)
                    }
                }
                return msg
            }
        }

        // inform the dashboard UI that we are adding this node
        group.register(node, config, evts)
    }
    RED.nodes.registerType('ui-slide-confirm', SlideConfirmNode)
}
