import Vue from "vue";
import Vuex from "vuex";
import localforage from "localforage";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    theme: ""
  },
  mutations: {
    SET_THEME(state, theme) {
      state.theme = theme;
      if (theme === "light-mode") {
        localforage.setItem("theme", "light-mode");
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
      }
      if (theme === "dark-mode") {
        localforage.setItem("theme", "dark-mode");
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
      }
    },
    TOGGLE_THEME(state) {
      if (!state.theme || state.theme === "dark-mode") {
        this.commit("SET_THEME", "light-mode");
      } else {
        this.commit("SET_THEME", "dark-mode");
      }
    }
  },
  actions: {
    async initTheme({ commit }) {
      const theme = (await localforage.getItem("theme")) || "light-mode";
      commit("SET_THEME", theme);
    }
  },
  modules: {}
});
