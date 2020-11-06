<template>
  <div class="popover">
    <slot name="action"></slot>
    <div class="pop-content" v-show="visible">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "Popover",
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.value
    };
  },
  watch: {
    value: {
      handler() {
        this.visible = this.value;
      },
      immediate: true
    }
  }
};
</script>
<style lang="scss" scoped>
.popover {
  position: relative;
  .pop-content {
    left: -20px;
    margin-top: 10px;
    padding: 0 20px;
    position: absolute;
    background: #fff;
    display: flex;
    border-radius: 20px;
    box-shadow: 0 1px 2px 0 rgba(32, 33, 36, 0.28);
  }
}
</style>
