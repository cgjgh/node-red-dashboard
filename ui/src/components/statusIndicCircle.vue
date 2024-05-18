<template>
    <!-- Add a circle indicator for connection status -->
    <span class="status-indicator" :style="{ backgroundColor: connected ? '#1BC318' : 'red' }" />
</template>

<script>
// import { mapState } from 'vuex'

export default {
    name: 'StatusIndicator',
    props: {
        connected: {
            type: Boolean,
            required: true
        }
    }
    // computed: {
    //     ...mapState('ui/connectionStatus', 'connectionStatus')
    // }
}
</script>

  <style scoped>
  .status-indicator {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
    margin-left: auto;
}
  </style>
