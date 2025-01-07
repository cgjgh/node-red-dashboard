<template>
    <div style="display: inline-block">
        <v-row align="baseline" dense>
            <v-col v-if="period.prefix.value" class="flex-grow-0">{{ period.prefix.value }}</v-col>
            <v-col cols="auto">
                <custom-select
                    :model-value="period.selected.value.id"
                    item-value="id"
                    :items="period.items"
                    :disabled="disabled"
                    :chip-props="chipProps"
                    @update:model-value="period.select($event)"
                />
            </v-col>
            <v-col v-if="period.suffix.value" class="flex-grow-0">{{ period.suffix.value }}</v-col>

            <template v-for="f in selected" :key="f.id">
                <v-col v-if="f.prefix.value" class="flex-grow-0">{{ f.prefix.value }}</v-col>
                <v-col cols="auto">
                    <custom-select
                        :model-value="f.selected.value"
                        :items="f.items"
                        :cols="cols[f.id] || 1"
                        :selection="f.text.value"
                        multiple
                        clearable
                        :disabled="disabled"
                        :chip-props="chipProps"
                        :menu-props="{ closeOnContentClick: false }"
                        @update:model-value="f.select($event)"
                    />
                </v-col>
                <v-col v-if="f.suffix.value" class="flex-grow-0">{{ f.suffix.value }}</v-col>
            </template>
        </v-row>
    </div>
</template>

<script>

import { cronCoreProps, setupCron } from '@vue-js-cron/core'

import { defineComponent } from 'vue'

import CustomSelect from './select.vue'

export const cronVuetifyProps = () => ({
    /**
   * Properties of Vuetify VChip
   *
   * @remarks
   * See {@link https://vuetifyjs.com/en/api/v-chip/#props}
   */
    chipProps: {
        type: Object,
        default () {
            return {}
        }
    },
    ...cronCoreProps()
})

export default defineComponent({
    name: 'CronVuetify',
    components: {
        CustomSelect
    },
    props: cronVuetifyProps(),
    emits: ['update:model-value', 'update:period', 'error'],
    setup (props, ctx) {
        return setupCron(props, ctx)
    }
})
</script>

<style lang="css"></style>
