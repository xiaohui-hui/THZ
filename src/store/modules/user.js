export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    alarmValue: 0
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    setAlarmValue (state, data) {
      state.alarmValue = data
    },
    updateAlarmValue (state, data) {
      state.alarmValue = data
    }
  }
}
