<template>
    <div class="status-indicator" :style="backgroundStyle" />
</template>

<script>
export default {
    name: 'StatusIndicator',
    props: {
        connected: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        backgroundStyle () {
            const color = this.connected ? '#1BC318' : 'red'
            return {

                width: '10px',
                background: `linear-gradient(to right, transparent, ${color})`
            }
        }
    }
}
</script>

  <style scoped>
  .status-indicator {
    /* Ensures the rectangle takes full height of the parent container */
    height: 100%;
    margin-right: 0 !important;
  }
  </style>
