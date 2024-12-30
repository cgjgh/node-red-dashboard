<!-- eslint-disable vuetify/no-deprecated-components -->
<template class="pa-0 main">
    <v-container class="pa-0 main" style="border: 1.5px solid grey; border-radius: 10px">
        <v-toolbar border color="navigation-background" rounded="lg">
            <v-toolbar-title>{{ props.label }}</v-toolbar-title>
            <v-select
                v-model="selectedTopic" :items="['All', ...uniqueTopics]" label="Topic"
                style="max-width: fit-content" rounded="lg" variant="solo-inverted"
                @update:model-value="filterSchedules"
            />
            <v-btn @click="openDialog()">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-toolbar>
        <v-data-table
            v-model:expanded="expanded" :headers="filteredHeaders" :items="filteredSchedules"
            hide-default-footer density="compact" :show-expand="!$vuetify.display.xs" item-value="name"
            :expand="expandedItem" @click:row="handleRowClick"
        >
            <template #item.rowNumber="{ item }">
                <v-chip :color="item.active === undefined ? 'gray' : (item.active ? 'green' : 'red')">
                    {{ item.rowNumber }}
                </v-chip>
            </template>

            <template #item.name="{ item }">
                <div v-if="item.active === undefined">{{ item.name }}</div>
                <v-chip v-else :color="item.active ? 'green' : 'red'">
                    {{ item.name }}
                </v-chip>
            </template>
            <template #item.action="{ item }">
                <div style="padding-right: 0; margin-right: 0; width: fit-content;">
                    <v-switch
                        v-model="item.enabled" color="primary" hide-details :disabled="item.isStatic"
                        @click.stop="toggleSchedule(item)"
                    />
                </div>
            </template>
            <template #expanded-row="{ columns, item }">
                <tr v-if="item">
                    <td :colspan="columns.length">
                        <v-card>
                            <v-progress-linear
                                v-if="item.active" :color="progressColor(item)"
                                :model-value="progressValue(item)" stream rounded :height="6"
                            />
                            <v-card-title class="d-flex align-items-center justify-space-between">
                                <div v-if="item && item.name">
                                    <strong>Name:</strong> {{ item.name }}
                                </div>
                                <div v-else>
                                    <em>No item selected</em>
                                </div>
                                <v-btn
                                    v-if="item" icon color="primary" :disabled="item.isStatic || item.readonly"
                                    @click="editSchedule(item)"
                                >
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col v-if="item.topic" cols="12" sm="6">
                                        <strong>Topic:</strong> {{ item.topic }}
                                    </v-col>
                                    <v-col v-if="item.period" cols="12" sm="6">
                                        <strong>Period:</strong> {{ toTitleCase(item.period) }}
                                    </v-col>
                                    <v-col v-if="item.yearlyMonth" cols="12" sm="6">
                                        <strong>Month:</strong> {{ item.yearlyMonth }}
                                    </v-col>
                                    <v-col v-if="item.days" cols="12" sm="6">
                                        <strong>Days:</strong>
                                        {{ item.period === 'monthly' || item.period === 'yearly' ?
                                            item.days.join(', ') : item.days.map((day) => day.slice(0,
                                                                                                    3)).join(', ') }}
                                    </v-col>
                                    <v-col v-if="item.time" cols="12" sm="6">
                                        <strong>Start Time:</strong> {{ formatTime(item.time) }}
                                    </v-col>
                                    <v-col v-if="item.hasEndTime" cols="12" sm="6">
                                        <strong>End Time:</strong>
                                        {{ item.hasEndTime ? formatTime(item.endTime) : '-' }}
                                    </v-col>
                                    <v-col v-if="item.minutesInterval" cols="12" sm="6">
                                        <strong>Interval:</strong> {{ item.minutesInterval }}
                                    </v-col>
                                    <v-col v-if="item.hourlyInterval" cols="12" sm="6">
                                        <strong>Interval:</strong> {{ item.hourlyInterval }}
                                    </v-col>
                                    <v-col v-if="item.hasDuration" cols="12" sm="6">
                                        <strong>Duration:</strong> {{ item.duration }}
                                    </v-col>
                                    <v-col v-if="item.solarEvent" cols="12" sm="6">
                                        <strong>Solar Event:</strong> {{
                                            mapSolarEvent(item.solarEvent) }}
                                    </v-col>
                                    <v-col v-if="item.offset" cols="12" sm="6">
                                        <strong>Offset:</strong> {{ item.offset }}
                                    </v-col>
                                    <v-col v-if="item.nextDate" cols="12" sm="6">
                                        <strong>Next Date:</strong> {{ item.nextDate }}
                                    </v-col>
                                    <v-col v-if="item.nextDescription" cols="12" sm="6" @click="requestStatus(item)">
                                        <strong>Next Description:</strong> {{ item.nextDescription }}
                                    </v-col>

                                    <v-col cols="12" sm="6">
                                        <span v-if="item.hasDuration || item.hasEndTime">
                                            <strong>Output:</strong><em>True</em> on start and
                                            <em>False</em> on end.
                                        </span>
                                        <span v-else-if="item.payloadValue"><strong>Output:</strong> {{
                                            item.payloadValue }}</span>
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

        <v-dialog v-model="dialog" color="background" max-width="450px">
            <v-alert v-model="validationResult.alert" type="error" closable>
                {{ validationResult.message }}
            </v-alert>
            <v-card>
                <v-card-title class="d-flex align-items-center justify-space-between">
                    <span class="text-h5">{{ isEditing ? 'Edit Schedule' : 'New Schedule' }}</span>
                    <div class="d-flex align-items-center">
                        <v-switch
                            v-model="enabled" :label="enabled ? 'Enabled' : 'Disabled'"
                            :color="enabled ? 'primary' : 'default'" required class="mr-2"
                        />
                        <v-btn v-if="isEditing" icon max-height="50" color="red-lighten-1" @click="openDeleteDialog()">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>
                <v-card-text>
                    <v-row class="justify-center">
                        <v-col cols="12">
                            <v-text-field
                                v-model="name" label="Schedule Name" :rules="[rules.required]" required
                                :disabled="isEditing"
                            />
                        </v-col>
                        <v-divider inset />

                        <v-col cols="12">
                            <v-col cols="12" class="d-flex justify-center">
                                <v-label>Topic</v-label>
                            </v-col>
                            <v-select
                                v-model="topic" :items="props.topics" label="Select Topic" required
                                :rules="[rules.required]"
                            />
                        </v-col>
                        <v-divider inset />
                        <div>
                            <v-col cols="12">
                                <v-col cols="12" class="d-flex justify-center">
                                    <v-label>Type</v-label>
                                </v-col>
                                <v-btn-toggle
                                    v-model="scheduleType" label="Schedule Type" mandatory divided
                                    variant="elevated" border="sm" rounded="xl"
                                >
                                    <v-btn prepend-icon="mdi-clock-outline" value="time">
                                        Time
                                    </v-btn>
                                    <v-btn prepend-icon="mdi-sun-clock" value="solar">
                                        Solar
                                    </v-btn>
                                </v-btn-toggle>
                            </v-col>
                        </div>
                        <v-divider inset />

                        <div v-if="scheduleType === 'time'">
                            <v-col cols="12" class="d-flex justify-center">
                                <v-label>Period</v-label>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-center">
                                <v-btn-toggle
                                    v-model="period" class="d-flex flex-wrap" style="min-height: fit-content"
                                    min-width="100%" label="Period" mandatory border="sm"
                                >
                                    <v-col>
                                        <v-row min-width="fit-content">
                                            <v-btn
                                                prepend-icon="mdi-timer-refresh-outline" value="minutes"
                                                max-width="fit-content"
                                            >
                                                Minute
                                            </v-btn>
                                            <v-btn
                                                prepend-icon="mdi-timer-refresh" value="hourly"
                                                max-width="fit-content"
                                            >
                                                Hour
                                            </v-btn>
                                            <v-btn
                                                prepend-icon="mdi-calendar-range" value="daily"
                                                max-width="fit-content"
                                            >
                                                Day
                                            </v-btn>
                                        </v-row>
                                        <v-row>
                                            <v-btn
                                                prepend-icon="mdi-calendar-weekend" value="weekly"
                                                max-width="fit-content"
                                            >
                                                Week
                                            </v-btn>
                                            <v-btn
                                                prepend-icon="mdi-calendar-month-outline" value="monthly"
                                                max-width="fit-content"
                                            >
                                                Month
                                            </v-btn>
                                            <v-btn
                                                prepend-icon="mdi-calendar-today-outline" value="yearly"
                                                max-width="fit-content"
                                            >
                                                Year
                                            </v-btn>
                                        </v-row>
                                    </v-col>
                                </v-btn-toggle>
                            </v-col>

                            <v-col v-if="period === 'daily'" cols="12" class="d-flex justify-center">
                                <v-select
                                    v-model="dailyDays" prepend-icon="mdi-calendar-range" :items="daysOfWeek"
                                    label="Select Days" multiple required :rules="[rules.required]"
                                />
                            </v-col>

                            <v-col v-if="period === 'weekly'" cols="12" class="d-flex justify-center">
                                <v-select
                                    v-model="weeklyDays" prepend-icon="mdi-calendar-weekend" :items="daysOfWeek"
                                    label="Select Days" multiple required :rules="[rules.required]"
                                />
                            </v-col>

                            <v-col v-if="period === 'monthly'" cols="12" class="d-flex justify-center">
                                <v-select
                                    v-model="monthlyDays" prepend-icon="mdi-calendar-month-outline"
                                    :items="daysOfMonth" label="Select Days" multiple required
                                    :rules="[rules.required]"
                                />
                            </v-col>

                            <v-col v-if="period === 'yearly'" cols="12" class="d-flex justify-center">
                                <v-select
                                    v-model="yearlyMonth" prepend-icon="mdi-calendar-month-outline"
                                    :items="months" label="Select Month" required :rules="[rules.required]"
                                />
                            </v-col>

                            <v-col v-if="period === 'yearly'" cols="12" class="d-flex justify-center">
                                <v-select
                                    v-model="yearlyDay" prepend-icon="mdi-calendar-today-outline"
                                    :items="daysOfMonth" label="Select Day" required :rules="[rules.required]"
                                />
                            </v-col>

                            <v-col v-if="period === 'minutes'" cols="12" class="d-flex justify-center">
                                <v-select
                                    v-model="minutesInterval" prepend-icon="mdi-timer-refresh-outline"
                                    :items="generateNumberArray(1, 59)" label="Interval (Minutes)"
                                    :rules="[rules.required]"
                                />
                            </v-col>

                            <v-col v-if="period === 'hourly'" cols="12" class="d-flex justify-center">
                                <v-select
                                    v-model="hourlyInterval" prepend-icon="mdi-timer-refresh"
                                    :items="generateNumberArray(1, 23)" label="Interval (Hours)"
                                    :rules="[rules.required]"
                                />
                            </v-col>

                            <v-col
                                v-if="period !== 'minutes' && period !== 'hourly'" cols="12"
                                class="d-flex justify-center"
                            >
                                <v-text-field
                                    v-model="formattedTime" :active="modalTime" :focused="modalTime"
                                    label="Start Time" prepend-icon="mdi-clock-time-four-outline" readonly
                                    :rules="[rules.required]"
                                >
                                    <v-dialog v-model="modalTime" activator="parent" width="auto">
                                        <v-time-picker
                                            v-if="modalTime" v-model="time"
                                            :max="hasEndTime ? endTime : undefined"
                                            :format="props.use24HourFormat ? '24hr' : 'ampm'"
                                            :ampm-in-title="!props.use24HourFormat"
                                        />
                                    </v-dialog>
                                </v-text-field>
                            </v-col>

                            <v-col
                                v-if="hasEndTime && period !== 'minutes' && period !== 'hourly'" cols="12"
                                class="d-flex justify-center"
                            >
                                <v-text-field
                                    v-model="formattedEndTime" :active="modalEndTime" :focused="modalEndTime"
                                    label="End Time" prepend-icon="mdi-clock-time-four-outline" readonly
                                    :rules="[rules.endTimeRule]"
                                >
                                    <v-dialog v-model="modalEndTime" activator="parent" width="auto">
                                        <v-time-picker
                                            v-if="modalEndTime" v-model="endTime" :min="time"
                                            :format="props.use24HourFormat ? '24hr' : 'ampm'"
                                            :ampm-in-title="!props.use24HourFormat"
                                        />
                                    </v-dialog>
                                </v-text-field>
                            </v-col>
                            <v-divider inset />

                            <v-col
                                v-if="period !== 'minutes' && period !== 'hourly'" cols="12"
                                class="d-flex flex-column align-center"
                            >
                                <v-col cols="12" class="d-flex justify-center">
                                    <v-label>Timespan</v-label>
                                </v-col>
                                <v-btn-toggle
                                    v-model="hasEndTime" mandatory divided variant="elevated" border="sm"
                                    rounded="xl" @update:model-value="setEndTime"
                                >
                                    <v-btn :value="false">No End Time</v-btn>
                                    <v-btn :value="true">End Time</v-btn>
                                </v-btn-toggle>
                            </v-col>
                        </div>
                        <div v-if="scheduleType === 'solar'" :style="{ width: '100%' }">
                            <v-col cols="12" class="d-flex justify-center">
                                <v-label>Event</v-label>
                            </v-col>
                            <v-select
                                v-model="solarEvent" :items="solarEvents" label="Select Event" required
                                :rules="[rules.required]" prepend-icon="mdi-sun-clock-outline"
                            />

                            <v-col cols="12" class="d-flex justify-center">
                                <v-select
                                    v-model="offset" prepend-icon="mdi-plus-minus" :items="offsetItems"
                                    label="Offset (minutes)" :rules="[rules.required]"
                                />
                            </v-col>
                            <v-divider inset />
                        </div>

                        <div :style="{ width: '100%' }">
                            <v-col
                                v-if="((period === 'minutes' || period === 'hourly') || scheduleType === 'solar')"
                                cols="12" class="d-flex flex-column align-center"
                            >
                                <v-col cols="12" class="d-flex justify-center">
                                    <v-label>Timespan</v-label>
                                </v-col>
                                <v-btn-toggle
                                    v-model="hasDuration" mandatory divided variant="elevated" border="sm"
                                    rounded="xl"
                                >
                                    <v-btn :value="false">No Duration</v-btn>
                                    <v-btn :value="true">Duration</v-btn>
                                </v-btn-toggle>
                            </v-col>
                            <v-col
                                v-if="((period === 'minutes' || period === 'hourly') || scheduleType === 'solar') && hasDuration"
                                cols="12" class="d-flex justify-center"
                            >
                                <v-select
                                    v-model="duration" prepend-icon="mdi-timer-sand-complete"
                                    :items="durationItems" label="Duration (minutes)" :rules="[rules.required]"
                                />
                            </v-col>
                            <v-divider inset />
                            <v-col cols="12" class="d-flex flex-column align-center">
                                <v-col cols="12" class="d-flex justify-center">
                                    <v-label>Output</v-label>
                                </v-col>
                                <v-btn-toggle
                                    v-if="(scheduleType === 'time' && (period === 'daily' || period === 'weekly' || period === 'monthly' || period === 'yearly')) && !hasEndTime || (scheduleType === 'time' && (period === 'minutes' || period === 'hourly') || scheduleType === 'solar') && !hasDuration"
                                    v-model="payloadValue" mandatory divided variant="elevated" border="sm"
                                    rounded="xl"
                                >
                                    <v-btn :value="false">False</v-btn>
                                    <v-btn :value="true">True</v-btn>
                                </v-btn-toggle>
                                <span v-else><em>True</em> on start and <em>False</em> on end.</span>
                            </v-col>
                        </div>
                    </v-row>
                </v-card-text>
                <v-card-actions class="d-flex justify-center">
                    <v-btn variant="tonal" color="success" @click="saveSchedule">Save</v-btn>
                    <v-btn variant="tonal" color="error" @click="closeDialog">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialogDelete" color="background" max-width="500px">
            <v-card>
                <v-card-title class="text-h6">
                    Are you sure you want to delete this schedule?
                </v-card-title>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="tonal" @click="closeDelete">Cancel</v-btn>
                    <v-btn variant="tonal" color="error" @click="deleteConfirm">Delete</v-btn>
                    <v-spacer />
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import { useDisplay } from 'vuetify'
</script>
<script>
import { VTimePicker } from 'vuetify/labs/VTimePicker'
import { mapState } from 'vuex'

function hsvToRgb (h, s, v) {
    let r, g, b
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)
    switch (i % 6) {
    case 0:
        r = v
        g = t
        b = p
        break
    case 1:
        r = q
        g = v
        b = p
        break
    case 2:
        r = p
        g = v
        b = t
        break
    case 3:
        r = p
        g = q
        b = v
        break
    case 4:
        r = t
        g = p
        b = v
        break
    case 5:
        r = v
        g = p
        b = q
        break
    }

    return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`
}

export default {
    name: 'UIScheduler',
    components: { VTimePicker },
    inject: ['$socket', '$dataTracker'],
    props: {
        id: {
            type: String,
            required: true
        },
        props: {
            type: Object,
            default: () => ({})
        },
        state: {
            type: Object,
            default: () => ({})
        }
    },
    data () {
        return {
            // General state
            items: null,
            currentSchedule: null,
            isEditing: false,
            selectedTopic: 'All',
            now: new Date().getTime(),
            validationResult: {
                alert: false,
                message: ''
            },

            // Scheduling options
            name: '',
            enabled: true,
            topic: null,
            scheduleType: 'time',
            period: 'daily',
            time: null,
            endTime: null,
            hasEndTime: false,
            hasDuration: false,
            duration: null,
            dailyDays: [],
            dailyDaysOfWeek: [],
            weeklyDays: [],
            monthlyDays: [],
            yearlyDay: 1,
            yearlyMonth: null,
            minutesInterval: null,
            hourlyInterval: null,
            solarEvent: 'sunrise',
            offset: 0,
            payloadValue: true,

            // Modal controls
            modalTime: false,
            modalEndTime: false,
            dialog: false,
            dialogDelete: false,

            // Datatable
            expanded: [],
            expandedItem: null,
            updatingExpanded: false, // Flag to control updates
            headers: [
                { title: 'Name', align: 'start', key: 'name' },
                { title: 'Description', align: 'start', key: 'description' },
                { title: 'Enabled', align: 'center', key: 'action' }
            ],

            // Date and time arrays
            months: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ],
            daysOfWeek: [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',
                'Saturday', 'Sunday'
            ],

            // Solar events
            solarEvents: [
                { title: 'Night End', value: 'nightEnd' },
                { title: 'Nautical Dawn', value: 'nauticalDawn' },
                { title: 'Civil Dawn', value: 'civilDawn' },
                { title: 'Sunrise', value: 'sunrise' },
                { title: 'Sunrise End', value: 'sunriseEnd' },
                { title: 'Morning Golden Hour End', value: 'morningGoldenHourEnd' },
                { title: 'Solar Noon', value: 'solarNoon' },
                { title: 'Evening Golden Hour Start', value: 'eveningGoldenHourStart' },
                { title: 'Sunset Start', value: 'sunsetStart' },
                { title: 'Sunset', value: 'sunset' },
                { title: 'Civil Dusk', value: 'civilDusk' },
                { title: 'Nautical Dusk', value: 'nauticalDusk' },
                { title: 'Night Start', value: 'nightStart' },
                { title: 'Nadir', value: 'nadir' }
            ],

            // Validation rules
            rules: {
                required: value => !!value || 'Required.',
                endTimeRule: value => this.endTime > this.time || 'End time must be after start time'
            }
        }
    },

    computed: {
        ...mapState('data', ['messages']),
        schedules: {
            get () {
                return this.items || this.getProperty('schedules')
            },
            set (value) {
                this.items = value
            }
        },
        formattedTime () {
            if (!this.time) return ''
            return this.formatTime(this.time)
        },
        formattedEndTime () {
            if (!this.endTime) return ''
            return this.formatTime(this.endTime)
        },
        durationItems () {
            if (this.scheduleType === 'time') {
                if (this.period === 'minutes') {
                    return this.generateNumberArray(1, this.minutesInterval)
                } else if (this.period === 'hourly') {
                    return this.generateNumberArray(1, (this.hourlyInterval * 60) - 1)
                }
            } else if (this.scheduleType === 'solar') {
                return this.generateNumberArray(1, 360)
            }
            return []
        },
        offsetItems () {
            return this.generateNumberArray(-120, 120)
        },
        daysOfMonth () {
            if (this.period === 'yearly') {
                const maxDays = this.getMaxDaysInMonth(this.yearlyMonth)
                if (maxDays === 0) {
                    return []
                }
                return this.generateNumberArray(1, maxDays)
            } else {
                const days = this.generateNumberArray(1, 31)
                days.push('Last')
                return days
            }
        },
        uniqueTopics () {
            if (this.schedules && Array.isArray(this.schedules)) {
                const topics = this.schedules.map((schedule2) => schedule2.topic)
                return [...new Set(topics)]
            } else {
                return [] // Or handle the case where schedules are undefined
            }
        },
        filteredSchedules () {
            if (!this.schedules) {
                return []
            }

            const filteredSchedules = this.selectedTopic === 'All'
                ? this.schedules
                : this.schedules.filter((schedule) => schedule.topic === this.selectedTopic)

            return filteredSchedules.map((item, index) => {
                if (this.$vuetify.display.xs) {
                    return {
                        ...item,
                        rowNumber: index + 1
                    }
                }
                return item
            })
        },

        filteredHeaders () {
            return this.$vuetify.display.xs
                ? this.headers.map((header) => {
                    if (header.key === 'name') {
                        return { title: 'No.', align: 'start', key: 'rowNumber', width: '0%' }
                    }
                    return header
                })
                : this.headers
        }
    },

    watch: {
        expanded (val) {
            if (this.updatingExpanded) return

            if (val.length > 0) {
                const lastItem = val[val.length - 1]

                // only request status if only one item is expanded
                if (val.length === 1) {
                    this.$nextTick(() => this.highlightExpandedRow())
                    const expandedItem = this.schedules.find(
                        schedule => schedule.name === lastItem
                    )
                    this.requestStatus(expandedItem)
                }

                // if only one item is expanded, don't collapse others
                if (this.expanded[0] === lastItem) return

                // Prevent recursive updates when updating expanded
                this.updatingExpanded = true
                this.expanded = [val[val.length - 1]]
                this.updatingExpanded = false
            }
        },
        yearlyMonth (newMonth) {
            const maxDays = this.getMaxDaysInMonth(newMonth)
            if (this.yearlyDay > maxDays) {
                this.yearlyDay = null // Reset if the selected day is no longer valid
            }
        }
    },

    created () {
        this.$dataTracker(
            this.id,
            this.onInput,
            this.onLoad,
            this.onDynamicProperties
        )
        this.$socket.emit('widget-load', this.id)
    },
    mounted () {
        this.updateNowUTC()
        setInterval(this.updateNowUTC, 1000)
    },
    unmounted () {
        window.removeEventListener('resize', this.handleResize)
    },

    methods: {
        onLoad (msg) {
            if (msg) {
                this.$store.commit('data/bind', { widgetId: this.id, msg })
                if (msg.payload !== undefined) {
                    this.schedules = msg.payload?.schedules || []
                }
            }
        },
        onInput (msg) {
            this.$store.commit('data/bind', { widgetId: this.id, msg })
            console.log('onInput', msg)
        },
        onDynamicProperties (msg) {
            const schedules = msg.ui_update?.schedules
            if (schedules) {
                if (Array.isArray(schedules)) {
                    this.schedules = schedules || []
                }
            }
            const updates = msg.ui_update
            if (updates) {
                // handle updates if needed
            }
        },
        isRowExpanded (item) { return this.expanded.includes(item.name) },
        highlightExpandedRow () { const rows = this.$el.querySelectorAll('tr'); rows.forEach(row => { const itemName = row.querySelector('td:first-child')?.textContent.trim(); if (this.expanded.includes(itemName)) { row.classList.add('highlighted-row') } else { row.classList.remove('highlighted-row') } }) },
        handleRowClick (item, index) {
            if (this.expanded.length === 0 || this.expanded[0] !== index.item.name) {
                this.expanded = [index.item.name]
            } else {
                this.expanded = []
            }
        },

        filterSchedules () {
            // This will automatically trigger the computed property 'filteredSchedules'
        },
        generateNumberArray (min, max) {
            const array = []
            for (let i = min; i <= max; i++) {
                array.push(i)
            }
            return array
        },
        getMaxDaysInMonth (monthName) {
            const month = this.months.indexOf(monthName) + 1
            if (month === 0) {
                return 0
            }
            return month === 2 ? 29 : new Date(2024, month, 0).getDate()
        },
        mapSolarEvent (event, toTitle = true) {
            const found = this.solarEvents.find(e => toTitle ? e.value === event : e.title === event)
            return found ? (toTitle ? found.title : found.value) : event
        },
        sendSchedule (schedule) {
            const msg = { _event: 'submit', payload: { schedules: [schedule] } }
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
        updateNowUTC () { this.now = new Date().getTime() },
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
        progressValue (item) {
            const { nextEndUTC, currentStartTime } = item

            // Ensure the dates are converted into timestamps
            const nextEndMillis = new Date(nextEndUTC).getTime()
            const currentStartMillis = new Date(currentStartTime).getTime()

            if (!nextEndMillis || !currentStartMillis) {
                return 0
            }

            const value = Math.round(((this.now - currentStartMillis) / (nextEndMillis - currentStartMillis)) * 100)

            return Math.min(Math.max(value, 0), 100) // Ensure the value stays between 0 and 100
        },

        progressColor (item) {
            const progress = this.progressValue(item) / 100 // Normalize to 0-1 range
            const hue = (progress * 120) / 360
            const saturation = 1
            const value = 1
            return hsvToRgb(hue, saturation, value)
        },

        saveSchedule () {
            this.validationResult = this.validateSchedule()
            if (this.validationResult.alert) {
                return
            }
            const newSchedule = {
                name: this.name,
                enabled: this.enabled,
                topic: this.topic,
                scheduleType: this.scheduleType
            }

            if (this.scheduleType === 'time') {
                newSchedule.period = this.period

                if (['daily', 'weekly', 'monthly', 'yearly'].includes(this.period)) {
                    newSchedule.time = this.time
                    newSchedule.days = this.getSelectedDays()
                    newSchedule.hasEndTime = this.hasEndTime
                    newSchedule.endTime = this.hasEndTime ? this.endTime : null
                }

                if (this.period === 'yearly') {
                    newSchedule.month = this.yearlyMonth
                }

                if (this.period === 'minutes') {
                    newSchedule.minutesInterval = this.minutesInterval
                    newSchedule.hasDuration = this.hasDuration
                    newSchedule.duration = this.duration
                }

                if (this.period === 'hourly') {
                    newSchedule.hourlyInterval = this.hourlyInterval
                    newSchedule.hasDuration = this.hasDuration
                    newSchedule.duration = this.duration
                }
            }

            if (this.scheduleType === 'solar') {
                newSchedule.solarEvent = this.mapSolarEvent(this.solarEvent, false)
                newSchedule.offset = this.offset

                if (this.hasDuration) {
                    newSchedule.hasDuration = this.hasDuration
                    newSchedule.duration = this.duration
                }
            }

            if (this.hasDuration || this.hasEndTime) {
                newSchedule.payloadValue = true
                newSchedule.endPayloadValue = false
            } else {
                newSchedule.payloadValue = this.payloadValue
            }

            if (this.isEditing) {
                Object.assign(this.currentSchedule, newSchedule)
            } else {
                if (!this.schedules) {
                    this.schedules = []
                }
                // this.schedules.push(newSchedule)
            }
            this.sendSchedule(newSchedule)
            this.closeDialog()
        },
        validateSchedule () {
            if (!this.name) {
                return { alert: true, message: 'Schedule Name is required.' }
            }

            const isNameDuplicate = this.schedules
                ? this.schedules.some(
                    schedule =>
                        schedule.name === this.name && schedule !== this.currentSchedule && !this.isEditing
                )
                : false
            if (isNameDuplicate) {
                return { alert: true, message: 'Schedule Name must be unique.' }
            }

            if (!this.topic) {
                return { alert: true, message: 'Topic is required.' }
            }

            if (this.scheduleType === 'time') {
                if (['daily', 'weekly', 'monthly', 'yearly'].includes(this.period)) {
                    if (!this.time) {
                        return { alert: true, message: 'Start Time is required.' }
                    }
                    if (this.hasEndTime) {
                        if (!this.endTime) {
                            return {
                                alert: true,
                                message: 'End Time is required.'
                            }
                        }
                        if (this.endTime <= this.time) {
                            return {
                                alert: true,
                                message: 'End Time must be after Start Time.'
                            }
                        }
                    }
                    const days = this.getSelectedDays()
                    if (!days.length) {
                        return {
                            alert: true,
                            message: `At least one day must be selected for ${this.period} period.`
                        }
                    }
                } else if (this.period === 'minutes') {
                    if (!this.minutesInterval) {
                        return { alert: true, message: 'Interval is required for Minutes period.' }
                    }
                    if (this.hasDuration && !this.duration) {
                        return {
                            alert: true,
                            message: 'Duration is required when Duration is enabled for Minutes period.'
                        }
                    }
                } else if (this.period === 'hourly') {
                    if (!this.hourlyInterval) {
                        return { alert: true, message: 'Interval is required for Hourly period.' }
                    }
                    if (this.hasDuration && !this.duration) {
                        return {
                            alert: true,
                            message: 'Duration is required when Duration is enabled for Hourly period.'
                        }
                    }
                }
            } else if (this.scheduleType === 'solar') {
                if (!this.props.defaultLocation || this.defaultLocation === '') {
                    return { alert: true, message: 'Solar Event requires a location to be configured in editor settings.' }
                }
                if (!this.solarEvent) {
                    return { alert: true, message: 'Solar Event is required.' }
                }
                if (!this.offset && this.offset !== 0) {
                    return { alert: true, message: 'Offset is required for Solar schedule type.' }
                }
                if (this.hasDuration && !this.duration) {
                    return {
                        alert: true,
                        message: 'Duration is required when Duration is enabled for Solar schedule type.'
                    }
                }
            }

            if (this.payloadValue === null && (this.hasDuration || this.hasEndTime)) {
                return {
                    alert: true,
                    message: 'Output value is required.'
                }
            }

            return { alert: false, message: '' }
        },

        getSelectedDays () {
            if (this.period === 'daily') {
                return this.dailyDays
            } else if (this.period === 'weekly') {
                return this.weeklyDays
            } else if (this.period === 'monthly') {
                return this.monthlyDays
            } else if (this.period === 'yearly') {
                return [this.yearlyDay]
            }
            return []
        },
        toggleSchedule (item) {
            const enabled = !item.enabled
            if (item.name) {
                this.$socket.emit('setEnabled', this.id, {
                    _event: 'setEnabled',
                    payload: { name: item.name, enabled }
                })
            }
        },
        requestStatus (item) {
            if (item.name) {
                this.$socket.emit('requestStatus', this.id, {
                    _event: 'requestStatus',
                    payload: {
                        name: item.name
                    }
                })
            }
        },
        toggleExpandedItem (item) {
            this.expandedItem = this.expandedItem === item ? null : item
            this.requestStatus(item)
        },
        editSchedule (item) {
            this.currentSchedule = item
            this.isEditing = true
            this.name = item.name
            this.topic = item.topic
            this.period = item.period
            this.time = item.time
            this.enabled = item.enabled
            if (item.period === 'minutes') {
                this.minutesInterval = item.minutesInterval
                this.duration = item.duration
                this.hasDuration = !!item.duration
            } else if (item.period === 'hourly') {
                this.hourlyInterval = item.hourlyInterval
                this.duration = item.duration
                this.hasDuration = !!item.duration
            } else if (item.period === 'daily') {
                this.dailyDays = item.days
            } else if (item.period === 'weekly') {
                this.weeklyDays = item.days
            } else if (item.period === 'monthly') {
                this.monthlyDays = item.days.map(day => day === 'Last' ? 'Last' : Number(day))
            } else if (item.period === 'yearly') {
                this.yearlyDay = item.days[0]
                this.yearlyMonth = item.month
            }
            this.hasEndTime = item.hasEndTime
            if (this.hasEndTime) {
                this.endTime = item.endTime
            }
            this.scheduleType = item.scheduleType || 'time'
            this.offset = item.offset || 0
            this.solarEvent = this.mapSolarEvent(item.solarEvent) || ''
            this.hasDuration = item.hasDuration || false
            this.duration = item.hasDuration ? item.duration : null
            this.dialog = true
        },
        resetForm () {
            const baseName = 'New Schedule'
            let newName = baseName
            let index = 2

            if (this.schedules) {
                while (this.schedules.some(schedule => schedule.name === newName)) {
                    newName = `${baseName} ${index}`
                    index++
                }
            }

            this.name = newName
            if (Array.isArray(this.props.topics) && this.props.topics.length > 0) {
                if (this.selectedTopic === 'All') {
                    this.topic = this.props.topics[0]
                } else {
                    this.topic = this.selectedTopic
                }
            } else {
                this.topic = null
            }
            this.period = 'daily'
            this.dailyDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            this.weeklyDays = ['Monday']
            this.monthlyDays = [1]
            this.yearlyDay = 1
            this.yearlyMonth = 'January'
            this.solarEvent = 'Sunrise'
            this.time = '00:00'
            this.hasEndTime = false
            this.endTime = '00:01'
            this.enabled = true
            this.offset = 0
            this.scheduleType = 'time'
            this.hasDuration = false
            this.duration = 1
            this.payloadValue = true
        },
        setEndTime () {
            if (!this.hasEndTime) {
                this.endTime = null
            } else {
                if (!this.time) {
                    this.endTime = null
                } else {
                    const [hours, minutes] = this.time.split(':').map(Number)
                    let endTimeHours = hours
                    let endTimeMinutes = minutes + 5

                    if (endTimeMinutes >= 60) {
                        endTimeMinutes -= 60
                        endTimeHours += 1
                    }

                    if (endTimeHours >= 24) {
                        endTimeHours -= 24
                    }

                    const formattedHours = String(endTimeHours).padStart(2, '0')
                    const formattedMinutes = String(endTimeMinutes).padStart(2, '0')

                    this.endTime = `${formattedHours}:${formattedMinutes}`
                }
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
                    this.$socket.emit('remove', this.id, {
                        _event: 'remove',
                        payload: { name: this.currentSchedule.name }
                    })
                }
                this.closeDialog()
            }
            this.dialogDelete = false
        }
    }
}
</script>

<style scoped>
@import "../stylesheets/ui-scheduler.css";
</style>
