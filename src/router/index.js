import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

import withLoading from "@/utils/withLoading";
import { getData } from "@/api/home";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: withLoading(Home, () => getData("test"))
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
