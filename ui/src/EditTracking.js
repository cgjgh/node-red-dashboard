import { computed, reactive } from 'vue'

// A simple non-vuex state store for edit tracking
const state = reactive({
    editKey: '',
    editPage: '',
    editMode: false,
    editorPath: '', // the custom httpAdminRoot path for the NR editor
    isTrackingEdits: false,
    originalGroups: []
})

// Methods

/**
 * Initialise the edit tracking state
 * @param {String} editKey - The edit key provided by the server
 * @param {String} editPage - The page id to edit (provided by the server)
 */
function initialise (editKey, editPage, editorPath) {
    state.editKey = editKey
    state.editPage = editPage
    state.editMode = !!editKey && !!editPage
    state.editorPath = editorPath || ''
}

/**
 * Start tracking edits
 */
function startEditTracking (groups) {
    state.isTrackingEdits = true
    updateEditTracking(groups)
}

/**
 * Stop tracking edits, clear editKey/editPage & exit edit mode
 */
function exitEditMode () {
    state.editKey = ''
    state.editPage = ''
    state.editMode = false
    state.isTrackingEdits = false
    state.initialised = false
    state.originalGroups = []
}

/**
 * Update the original groups with the current groups
 */
function updateEditTracking (groups) {
    state.originalGroups = JSON.parse(JSON.stringify(groups))
}

// RO computed props
const editKey = computed(() => state.editKey)
const editPage = computed(() => state.editPage)
const editMode = computed(() => !!state.editKey && !!state.editPage)
const editorPath = computed(() => state.editorPath)
const originalGroups = computed(() => state.originalGroups)
const isTrackingEdits = computed(() => state.isTrackingEdits)

export { editKey, editMode, editPage, editorPath, originalGroups, isTrackingEdits, initialise, exitEditMode, startEditTracking, updateEditTracking }
