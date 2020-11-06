<template>
  <div class="switch" :class="{ active: status }" @click="toggleStatus">
    <i class="fa" :class="icon"></i>
  </div>
</template>
<script>
export default {
  name: "SwitchBtn",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      status: this.value
    };
  },
  watch: {
    value: {
      handler(val) {
        this.status = val;
      }
    }
  },
  methods: {
    toggleStatus() {
      this.status = !this.status;
      this.$emit("input", this.status);
      this.$emit("change", this.status);
    }
  }
};
</script>
<style lang="scss" scoped>
.switch {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: #eee;
  }
  &.active {
    background-color: #ddd;
    &:hover {
      background-color: #ccc;
    }
  }
}
</style>
