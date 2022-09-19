import { getToken, setToken, removeToken } from '@/utils/auth'
import { getUserInfo, login, getUserDetailById } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {}
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
      setToken(payload)
    },
    removeToken(state) {
      state.token = null
      removeToken()
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
    removeuserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    async login(context, data) {
      const result = await login(data)
      context.commit('setToken', result)
    },
    async getUserInfo(context) {
      const result = await getUserInfo()
      const baseInfo = await getUserDetailById(result.userId)
      const baseResult = { ...result, ...baseInfo }
      context.commit('setUserInfo', baseResult)
      return result
    },
    logout(context) {
      context.commit('removeToken')
      context.commit('removeuserInfo')
    }
  }
}
