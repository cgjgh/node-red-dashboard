<!-- eslint-disable vuetify/no-deprecated-components -->
<template>
    <v-container>
        <v-toolbar flat>
            <v-toolbar-title>{{ props.label }}</v-toolbar-title>
            <v-spacer />
            <v-btn @click="openDialog()">New</v-btn>
        </v-toolbar>
        <v-data-table
            :headers="headers"
            :items="schedules"
            hide-default-footer
            item-value="name"
            show-expand
            @click:row="editSchedule"
        >
            <template #item.action="{ item }">
                <v-icon @click.stop="toggleSchedule(item)">
                    {{ item.enabled ? 'mdi-toggle-switch' : 'mdi-toggle-switch-off' }}
                </v-icon>
            </template>
            <template #expanded-row="{ columns, item }">
                <tr>
                    <td :colspan="columns.length">
                        Info
                        <v-card>
                            <v-card-text>
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <strong>Start Time:</strong> {{ formatTime(item.time) }}
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <strong>End Time:</strong> {{ item.hasEndTime ?
                                            formatTime(item.endTime) : '-' }}
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <strong>Frequency:</strong> {{ toTitleCase(item.frequency)
                                        }}
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <strong>Days:</strong> {{ item.frequency === 'monthly' ?
                                            item.days.join(', ') : item.days.map(day => day.slice(0,
                                                                                                  3)).join(', ') }}
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </td>
                </tr>
            </template>
            <template #no-data>
                <div class="text-center my-4">No Schedules</div>
            </template>
        </v-data-table>

        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-card-title class="d-flex align-items-center justify-space-between">
                    <span class="text-h5">{{ isEditing ? 'Edit Schedule' : 'New Schedule' }}</span>
                    <div class="d-flex align-items-center">
                        <v-switch v-model="enabled" label="Enabled" required class="mr-2" />
                        <v-btn v-if="isEditing" icon @click="openDeleteDialog">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-text-field v-model="name" label="Schedule Name" :rules="[rules.required]" required />
                    <v-btn-toggle v-model="frequency" label="Frequency" mandatory>
                        <v-btn value="daily">Daily</v-btn>
                        <v-btn value="weekly">Weekly</v-btn>
                        <v-btn value="monthly">Monthly</v-btn>
                    </v-btn-toggle>
                    <v-select
                        v-if="frequency === 'daily'" v-model="dailyDays" :items="daysOfWeek" label="Select Days" multiple
                        required :rules="[rules.required]"
                    />
                    <v-select
                        v-if="frequency === 'weekly'" v-model="weeklyDays" :items="daysOfWeek" label="Select Days" multiple
                        required :rules="[rules.required]"
                    />
                    <v-select
                        v-if="frequency === 'monthly'" v-model="monthlyDays" :items="daysOfMonth" label="Select Days" multiple
                        required :rules="[rules.required]"
                    />
                    <v-text-field
                        v-model="formattedTime" :active="modalTime" :focused="modalTime" label="Start Time"
                        prepend-icon="mdi-clock-time-four-outline" readonly :rules="[rules.required]"
                    >
                        <v-dialog v-model="modalTime" activator="parent" width="auto">
                            <v-time-picker
                                v-if="modalTime" v-model="time" :max="hasEndTime ? endTime : undefined"
                                :format="props.use24HourFormat ? '24hr' : 'ampm'" :ampm-in-title="!props.use24HourFormat"
                            />
                        </v-dialog>
                    </v-text-field>
                    <v-text-field
                        v-if="hasEndTime" v-model="formattedEndTime" :active="modalEndTime" :focused="modalEndTime"
                        label="End Time" prepend-icon="mdi-clock-time-four-outline" readonly :rules="[rules.endTimeRule]"
                    >
                        <v-dialog v-model="modalEndTime" activator="parent" width="auto">
                            <v-time-picker
                                v-if="modalEndTime" v-model="endTime" :min="time" :format="props.use24HourFormat ? '24hr' : 'ampm'"
                                :ampm-in-title="!props.use24HourFormat"
                            />
                        </v-dialog>
                    </v-text-field>
                    <v-btn-toggle v-model="hasEndTime" mandatory @update:model-value="clearStartTimeMax">
                        <v-btn :value="false">No End Time</v-btn>
                        <v-btn :value="true">End Time</v-btn>
                    </v-btn-toggle>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="saveSchedule">Save</v-btn>
                    <v-btn @click="closeDialog">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h6">Are you sure you want to delete this item?</v-card-title>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="closeDelete">Cancel</v-btn>
                    <v-btn variant="text" @click="deleteConfirm">OK</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
    inject: ['$socket', '$dataTracker'],
    props: {
        id: { type: String, required: true },
        props: { type: Object, default: () => ({}) },
        state: { type: Object, default: () => ({}) }
    },
    data () {
        return {
            dialog: false,
            dialogDelete: false,
            modalTime: false,
            modalEndTime: false,
            isEditing: false,
            schedules: [],
            headers: [
                { title: 'Name', align: 'start', key: 'name' },
                { title: 'Description', align: 'start', key: 'description' },
                { title: 'Enabled', align: 'start', key: 'action' }
            ],
            currentSchedule: null,
            name: '',
            frequency: 'daily',
            dailyDays: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ],
            weeklyDays: [],
            monthlyDays: [],
            daysOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ],
            daysOfMonth: Array.from({ length: 31 }, (_, i) => i + 1),
            time: null,
            hasEndTime: false,
            endTime: null,
            enabled: true,
            endTimeRule: value =>
                this.endTime > this.time || 'End time must be after start time',
            rules: {
                required: value => !!value || 'Required.',
                endTimeRule: value =>
                    this.endTime > this.time || 'End time must be after start time'
            }
        }
    },

    computed: {
        ...mapState('data', ['messages']),
        formattedTime () {
            if (!this.time) return ''
            return this.formatTime(this.time)
        },
        formattedEndTime () {
            if (!this.endTime) return ''
            return this.formatTime(this.endTime)
        }
    },
    created () {
        // can't do this in setup as we are using custom onInput function that needs access to 'this'
        this.$dataTracker(this.id, this.onInput, this.onLoad, this.onDynamicProperties)

        // let Node-RED know that this widget has loaded
        this.$socket.emit('widget-load', this.id)
    },
    methods: {

        // given the last received msg into this node, load the state
        onLoad (msg) {
            if (msg) {
                // update vuex store to reflect server-state
                this.$store.commit('data/bind', {
                    widgetId: this.id,
                    msg
                })
                if (msg.payload !== undefined) {
                    this.schedules = msg.payload?.schedules || []
                }
            }
        },
        onInput (msg) {
            // update our vuex store with the value retrieved from Node-RED
            this.$store.commit('data/bind', {
                widgetId: this.id,
                msg
            })
            console.log('onInput', msg)
            // make sure our v-model is updated to reflect the value from Node-RED
            if (msg.payload !== undefined) {
                this.schedules = msg.payload?.schedules || []
            }
        },
        onDynamicProperties (msg) {
            // update the UI with any other changes
            const updates = msg.ui_update

            if (updates) {
                // this.updateDynamicProperty('label', updates.label)
            }
        },
        sendSchedules () {
            const msg = { _event: 'submit', payload: { schedules: this.schedules } }

            this.$store.commit('data/bind', {
                widgetId: this.id,
                msg
            })
            console.log('sendSchedules', msg)
            this.$socket.emit('submit', this.id, msg)
        },
        formatTime (time) {
            if (!time) return ''
            const [hours, minutes] = time.split(':')
            if (this.props.use24HourFormat) {
                return `${hours}:${minutes}`
            } else {
                const period = hours >= 12 ? 'PM' : 'AM'
                const formattedHours = hours % 12 || 12
                return `${formattedHours}:${minutes} ${period}`
            }
        },
        toTitleCase (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        },
        openDialog () {
            this.dialog = true
            this.isEditing = false
            this.resetForm()
        },
        closeDialog () {
            this.dialog = false
        },
        saveSchedule () {
            const validationResult = this.validateSchedule()
            if (!validationResult.isValid) {
                alert(validationResult.message)
                return
            }
            const days = this.getSelectedDays()
            if (this.isEditing) {
                Object.assign(this.currentSchedule, {
                    name: this.name,
                    time: this.time,
                    frequency: this.frequency,
                    days,
                    hasEndTime: this.hasEndTime,
                    endTime: this.hasEndTime ? this.endTime : null,
                    enabled: this.enabled
                })
            } else {
                const newSchedule = {
                    name: this.name,
                    time: this.time,
                    frequency: this.frequency,
                    days,
                    hasEndTime: this.hasEndTime,
                    endTime: this.hasEndTime ? this.endTime : null,
                    enabled: this.enabled
                }
                this.schedules.push(newSchedule)
            }
            this.sendSchedules()
            this.closeDialog()
        },
        validateSchedule () {
            if (!this.name) {
                return { isValid: false, message: 'Schedule Name is required.' }
            }

            // Ensure schedule name is unique
            const isNameDuplicate = this.schedules.some(
                schedule =>
                    schedule.name === this.name && schedule !== this.currentSchedule
            )
            if (isNameDuplicate) {
                return { isValid: false, message: 'Schedule Name must be unique.' }
            }

            if (!this.time) {
                return { isValid: false, message: 'Start Time is required.' }
            }
            if (this.hasEndTime && (!this.endTime || this.endTime <= this.time)) {
                return {
                    isValid: false,
                    message: 'End Time must be after Start Time.'
                }
            }
            const days = this.getSelectedDays()
            if (!days.length) {
                return {
                    isValid: false,
                    message: 'At least one day must be selected.'
                }
            }
            return { isValid: true, message: '' }
        },
        getSelectedDays () {
            if (this.frequency === 'daily') {
                return this.dailyDays
            } else if (this.frequency === 'weekly') {
                return this.weeklyDays
            } else if (this.frequency === 'monthly') {
                return this.monthlyDays
            }
            return []
        },
        toggleSchedule (item) {
            item.enabled = !item.enabled
            this.sendSchedules()
        },
        editSchedule (event, row) {
            const item = row.item
            this.currentSchedule = item
            this.isEditing = true
            this.name = item.name
            this.frequency = item.frequency
            this.time = item.time
            this.enabled = item.enabled
            if (item.frequency === 'daily') {
                this.dailyDays = item.days
            } else if (item.frequency === 'weekly') {
                this.weeklyDays = item.days
            } else if (item.frequency === 'monthly') {
                this.monthlyDays = item.days.map(Number) // Ensure days are numbers
            }
            this.hasEndTime = item.hasEndTime
            if (this.hasEndTime) {
                this.endTime = item.endTime
            }
            this.dialog = true
        },
        resetForm () {
            this.name = 'New Schedule'
            this.frequency = 'daily'
            this.dailyDays = [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ]
            this.weeklyDays = []
            this.monthlyDays = []
            this.time = null
            this.hasEndTime = false
            this.endTime = null
            this.enabled = true
        },
        clearStartTimeMax () {
            if (!this.hasEndTime) {
                this.endTime = null
            }
        },
        openDeleteDialog () {
            this.dialogDelete = true
        },
        closeDelete () {
            this.dialogDelete = false
        },
        deleteConfirm () {
            if (this.currentSchedule) {
                const index = this.schedules.indexOf(this.currentSchedule)
                if (index > -1) {
                    this.schedules.splice(index, 1)
                }
                this.closeDialog()
            }
            this.dialogDelete = false
        }
    }
}
</script>
