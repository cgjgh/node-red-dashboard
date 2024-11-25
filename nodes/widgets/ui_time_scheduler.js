// eslint-disable-next-line no-unused-vars
const { scheduleTask, validate, CronosExpression, CronosTask } = require('cronosjs')
const cronstrue = require('cronstrue')

const datastore = require('../store/data.js')
const statestore = require('../store/state.js')
module.exports = function (RED) {
    function TimeSchedulerNode (config) {
        // create node in Node-RED
        RED.nodes.createNode(this, config)
        const node = this
        const group = RED.nodes.getNode(config.group)
        const base = group.getBase()
        // Function to check if context store exists
        function hasContextStore (storeName) {
            return RED.settings.contextStorage && Object.prototype.hasOwnProperty.call(RED.settings.contextStorage, storeName)
        }

        // Function to get context value with optional context store
        function getContextValue (key) {
            return config.contextStore && hasContextStore(config.contextStore) ? node.context().get(key, config.contextStore) : node.context().get(key)
        }

        // Function to set context value with optional context store
        function setContextValue (key, value) {
            config.contextStore && hasContextStore(config.contextStore) ? node.context().set(key, value, config.contextStore) : node.context().set(key, value)
        }

        // Load persisted schedules from context storage
        const initialSchedule = getContextValue('schedules') || {}

        const msg = { payload: initialSchedule, _event: 'init' }
        datastore.save(base, node, msg)

        // Send initial payload
        node.send(msg)

        const evts = {
            onAction: true,
            beforeSend: function (msg) {
                if (msg.ui_update) {
                    const update = msg.ui_update
                    if (typeof update.label !== 'undefined') {
                        // dynamically set "label" property
                        statestore.set(group.getBase(), node, msg, 'label', update.label)
                    }
                }
                if (config.persistSchedules && msg?.payload?.schedules) {
                    // store the latest msg passed to context storage
                    console.log('contextStorage', config.contextStore)
                    setContextValue('schedules', msg.payload)
                    node.log('Schedule persisted successfully')
                }
                return msg
            }
        }

        // Function to schedule cron jobs
        function scheduleCronJobs (schedules) {
            schedules.forEach(schedule => {
                const cronExpression = `0 ${schedule.time.split(':')[1]} ${schedule.time.split(':')[0]} * * ${schedule.days.map(day => day.substring(0, 3)).join(',')}`
                const cronstrueString = cronstrue.toString(cronExpression)
                node.log(`Scheduling job: ${schedule.name}`)
                node.log(`Cron Expression: ${cronExpression}`)
                node.log(`Cron Description: ${cronstrueString}`)

                const expression = CronosExpression.parse(cronExpression)
                const task = new CronosTask(expression)

                task.on('run', (timestamp) => {
                    const message = { payload: `Scheduled job ${schedule.name} triggered`, schedule }
                    node.send(message)
                    node.log(`Job ${schedule.name} triggered at ${timestamp}`)
                })

                task.on('started', () => {
                    node.log(`Job ${schedule.name} has started running`)
                })

                task.on('ended', () => {
                    node.log(`Job ${schedule.name} has ended`)
                })

                if (schedule.enabled) {
                    task.start()
                    node.log(`Job ${schedule.name} started`)
                } else {
                    node.log(`Job ${schedule.name} is disabled`)
                }
            })
        }

        // Schedule initial cron jobs
        scheduleCronJobs(initialSchedule.schedules || [])

        // Inform the dashboard UI that we are adding this node
        group.register(node, config, evts)
    }

    RED.nodes.registerType('ui-time-scheduler', TimeSchedulerNode)
}
