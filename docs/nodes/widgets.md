---
description: Explore the wide range of widgets available in Node-RED Dashboard 2.0 to enhance your dashboard's interactivity.
---

<script setup>
    import { ref } from 'vue'
    import WidgetCard from '../components/WidgetCard.vue'
    import WidgetGrid from '../components/WidgetGrid.vue'

    const general = [{
        name: 'Button',
        widget: 'ui-button',
        image: '/images/node-examples/ui-button.png',
        description: 'Adds a clickable button to your dashboard.'
    }, {
        name: 'Markdown',
        widget: 'ui-markdown',
        image: '/images/node-examples/ui-markdown.png',
        description: 'Renders dynamic Markdown (including Mermaid Charts).'
    }, {
        name: 'Notification',
        widget: 'ui-notification',
        image: '/images/node-examples/ui-notification.png',
        description: 'Displays a message for a defined duration of time.'
    }, {
        name: 'Template',
        widget: 'ui-template',
        image: '/images/node-examples/ui-template.png',
        description: 'Renders custom templates on your dashboard.'
    }, {
        name: 'Text',
        widget: 'ui-text',
        image: '/images/node-examples/ui-text.png',
        description: 'Displays a non-editable text field on your dashboard.'
    }]

    const form = [{
        name: 'Dropdown',
        widget: 'ui-button',
        image: '/images/node-examples/ui-dropdown.png',
        description: 'Adds a clickable button to your dashboard.'
    }, {
        name: 'Form',
        widget: 'ui-form',
        image: '/images/node-examples/ui-form.png',
        description: 'Adds a clickable button to your dashboard.'
    }, {
        name: 'Radio Group',
        widget: 'ui-radio-group',
        image: '/images/node-examples/ui-radio.png',
        description: 'Adds a radio group to your dashboard.'
    }, {
        name: 'Slider',
        widget: 'ui-slider',
        image: '/images/node-examples/ui-slider.png',
        description: 'Adds a slider to your dashboard.'
    }, {
        name: 'Switch',
        widget: 'ui-switch',
        image: '/images/node-examples/ui-switch.png',
        description: 'Adds a clickable switch to your dashboard.'
    }, {
        name: 'Text Input',
        widget: 'ui-text-input',
        image: '/images/node-examples/ui-text-input.png',
        description: 'Adds a text input to your dashboard.'
    }]

    const data = [{
        name: 'Chart',
        widget: 'ui-chart',
        image: '/images/node-examples/ui-chart-line.png',
        description: 'Adds a chart to your dashboard.'
    }, {
        name: 'Table',
        widget: 'ui-table',
        image: '/images/node-examples/ui-table.png',
        description: 'Adds a table to your dashboard.'
    }]
    const events = [{
        name: 'Event',
        widget: 'ui-event',
        description: 'Monitors for events in the Dashboard and emits accordingly.'
    }]
    const widgets = ref({
        general,
        form,
        data,
        events
    })
</script>

# Widgets

Dashboard widgets are the building blocks of your dashboard. Wire them together however you like to build out your custom data visualisations and user interfaces.

## General

<WidgetGrid>
    <WidgetCard v-for="widget in widgets.general" :widget="widget"></WidgetCard>
</WidgetGrid>

## Form & Controls

<WidgetGrid>
    <WidgetCard v-for="widget in widgets.form" :widget="widget"></WidgetCard>
</WidgetGrid>

## Data Visualisation

<WidgetGrid>
    <WidgetCard v-for="widget in widgets.data" :widget="widget"></WidgetCard>
</WidgetGrid>

## Events & Control

Collection of widgets that do not render content into the Dashboard, but instead allow communication to/from the Dashboard to monitor activity and control Dashboard state.

<WidgetGrid>
    <WidgetCard v-for="widget in widgets.events" :widget="widget"></WidgetCard>
</WidgetGrid>
