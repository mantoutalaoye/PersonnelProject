import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken()
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
      setToken(payload)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    }
  },
  actions: {
    async login(context, data) {
      const result = await login(data)
      console.log(result)
      context.commit('setToken', result)
    }
  }
}
