const helper = require('node-red-node-test-helper')
const should = require('should')

// load test 1 standard test data (base, page, group, theme, slider)
// eslint-disable-next-line no-unused-vars
const { testData1 } = require('../fixtures/index.js')
const { verifyFlowLoaded } = require('../utils.js')
const testFlow1 = testData1.flows
const nodeImports = testData1.getImports(null, ['ui_number_input'])

helper.init(require.resolve('node-red'))

describe('ui-number-input node', function () {
    beforeEach(function (done) {
        helper.startServer(done)
    })

    afterEach(function (done) {
        helper.unload()
        helper.stopServer(done)
    })

    const flow = [
        {
            id: 'helper-node',
            type: 'helper'
        },
        {
            id: 'node-ui-number-input',
            type: 'ui-number-input',
            z: 'tab-id',
            group: 'config-ui-group',
            name: '',
            label: 'number',
            tooltip: 'some tooltip',
            order: 0,
            width: 0,
            height: 0,
            min: 0,
            max: 10,
            step: 1,
            passthru: true,
            x: 920,
            y: 220,
            wires: [
                ['helper-node']
            ]
        },
        {
            id: 'helper-node-complete',
            type: 'helper'
        },
        {
            id: 'node-on-complete',
            type: 'complete',
            z: 'tab-id',
            name: '',
            scope: [
                'node-ui-number-input'
            ],
            uncaught: false,
            x: 0,
            y: 0,
            wires: [
                ['helper-node-complete']
            ]
        },
        ...testFlow1
    ]

    it('should be loaded', async function () {
        await helper.load(nodeImports, flow)
        verifyFlowLoaded(helper, flow)
        const n = helper.getNode('node-ui-number-input')
        should(n).be.an.Object()
    })

    it('should be registered with the ui-base', async function () {
        await helper.load(nodeImports, flow)
        verifyFlowLoaded(helper, flow)

        const base = helper.getNode('config-ui-base')
        should(base).be.an.Object()
        base.should.have.property('ui')
        base.ui.should.have.property('widgets')
        base.ui.widgets.has('node-ui-number-input').should.be.true()

        const widget = base.ui.widgets.get('node-ui-number-input')
        widget.props.should.have.property('tooltip', 'some tooltip')
    })

    it('should set topic on any messages emitted from this node', async function () {
        await helper.load(nodeImports, flow)
        verifyFlowLoaded(helper, flow)

        const sNode = helper.getNode('node-ui-number-input')
        const hNode = helper.getNode('helper-node')
        hNode.on('input', (msg) => {
            // check the message passed to the next node contains the correct topic
            msg.should.have.property('topic', 'topic')
        })

        sNode.receive({ payload: true })
    })

    it('should not send on msg if passthru is set to false', async function () {
        const flow2 = flow.map((node) => {
            return { ...node }
        })

        flow2[1].passthru = false

        await helper.load(nodeImports, flow2)
        verifyFlowLoaded(helper, flow2)

        await new Promise((resolve, reject) => {
            const tNode = helper.getNode('node-ui-number-input')

            const helperAfterSlider = helper.getNode('helper-node')
            const helperAfterComplete = helper.getNode('helper-node-complete')
            helperAfterComplete.on('input', (msg) => {
                try {
                    tNode.getState().payload.should.equal(msg.payload)
                    msgSent.should.be.false()
                    resolve()
                } catch (err) {
                    reject(err)
                }
            })

            let msgSent = false
            helperAfterSlider.on('input', (msg) => {
                msgSent = true
            })

            tNode.receive({
                payload: 'a'
            })
        })
    })
})
