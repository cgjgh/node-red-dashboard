<template>
    <div class="status-wrapper">
        <!-- Reload icon that fades in and out -->
        <span
            v-if="!connected"
            class="mdi mdi-reload reload-icon"
            :class="{ 'dark-theme': $vuetify.theme.dark }"
        />
        <!-- Circle indicator for connection status -->
        <span
            v-else
            class="status-indicator-green"
            :style="{ backgroundColor: '#1BC318' }"
        />
        <span
            v-if="!connected"
            class="status-indicator-red"
            :style="{ backgroundColor: 'red' }"
        />
    </div>
</template>

<script>
export default {
    name: 'StatusIndicator',
    props: {
        connected: {
            type: Boolean,
            required: true
        }
    }
}
</script>

  <style scoped>
    .status-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      height: 100%;
      width: 30px;
    }

    .reload-icon,
    .status-indicator {
      position: absolute;
      top: 50%;
      left: 50%;
    }

    .reload-icon {
      font-size: 30px;
      /* Adjust size to fit behind the circle */
      animation: blinkIcon 4s infinite;
      transform: translate(-50%, -50%);
      z-index: 2;
      /* Ensures the icon is above the red indicator */
    }

    .status-indicator-red {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      z-index: 1;
      /* Ensures the red indicator is behind the icon */
      animation: blinkIndicator 4s infinite;
    }

    .status-indicator-green {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      z-index: 0;
      /* Ensures the red indicator is behind the icon */
    }

    .dark-theme {
      color: white;
      /* Icon color for dark theme */
    }

    @keyframes blinkIcon {
      0%,
      100% {
        opacity: 1;
      }

      50% {
        opacity: 0;
      }
    }

    @keyframes blinkIndicator {
      0%,
      100% {
        opacity: 0;
      }

      50% {
        opacity: 1;
      }
    }
  </style>
