<template>
    <v-chip v-bind="chipProps" :disabled="disabled">
        <template v-if="clearable && !isEmpty" #append>
            <v-icon size="small" icon="mdi-close" @click.stop="clear()" />
        </template>

        {{ selection ?? selectedStr }}

        <v-menu activator="parent" v-bind="menuProps">
            <v-list class="pa-0 ma-0">
                <v-row v-for="(itemRow, index1) in itemRows" :key="index1" no-gutters>
                    <v-col v-for="(item, index2) in itemRow" :key="index2">
                        <v-list-item v-if="item" class="vcron-v-item" :active="has(item)" @click="select(item)">
                            {{ item.text }}
                        </v-list-item>
                    </v-col>
                </v-row>
            </v-list>
        </v-menu>
    </v-chip>
</template>

<script lang="ts">
import { selectProps, setupSelect } from '@vue-js-cron/core'

export default {
    name: 'CustomSelect',
    inheritAttrs: false,
    props: {
        ...selectProps(),
        menuProps: {
            type: Object,
            default: () => { }
        },
        chipProps: {
            type: Object,
            default: () => { }
        }
    },
    emits: ['update:model-value'],
    setup (props, ctx) {
        return setupSelect(props, () => props.modelValue, ctx)
    }
}
</script>

<style>
.vcron-v-item div {
  overflow: visible;
}
</style>
