<template>
    <div class="stack-view">
        <v-dialog v-model="dialogVisible" persistent max-width="600px" rounded>
            <v-card class="rounded-lg">
                <v-card-title class="justify-center">
                    <v-icon color="red" size="x-large">mdi-alert-circle-outline</v-icon>
                    Dashboard Status:
                </v-card-title>
                <v-card-text>
                    <v-container class="text-center">
                        <h3>
                            <v-icon color="red" size="x-large">mdi-cloud-off-outline</v-icon> Offline
                        </h3>
                        <p>Dashboard is disconnected</p>
                    </v-container>
                </v-card-text>
                <v-card-actions class="justify-center">
                    <v-btn color="blue-darken-1" @click="reload">
                        <v-icon start size="x-large">mdi-reload</v-icon> Reload
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'StatusDialog',
    props: {
        connected: {
            type: Boolean,
            required: true
        }
    },
    data () {
        return {
            dialogVisible: !this.connected
        }
    },
    watch: {
        connected (newVal) {
            this.dialogVisible = !newVal
        }
    },
    methods: {
        reload () {
            location.reload()
        }
    }
}
</script>

  <style scoped>
    .stack-view {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .rounded-lg {
      border-radius: 12px !important;
    }
  </style>
