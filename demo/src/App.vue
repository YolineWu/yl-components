<script lang="ts">
import Vue from "vue";
import store from "./store";

export default Vue.extend({
  store,
  mpType: "app",
  onLaunch() {
    console.log("App Launch");
  },
  onShow() {
    console.log("App Show");
  },
  onHide() {
    console.log("App Hide");
  },
});
</script>

<style>
/*每个页面公共css */
/* #ifdef H5 */
@import "yl-uni-components/src/assets/styles/export/index.css";
/* #endif */
</style>
