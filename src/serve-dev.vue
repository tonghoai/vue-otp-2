<script>
import Vue from "vue";
import VueOtp2 from "@/vue-otp-2.vue";

export default Vue.extend({
  name: "ServeDev",
  components: {
    VueOtp2
  },
  data: function() {
    return {
      changeJ: "",
      completeJ: ""
    };
  },
  methods: {
    complete(value) {
      this.completeJ = value;
    },
    change(value) {
      this.changeJ = value;
    }
  }
});
</script>

<template>
  <div id="app">
    <div class="vue-otp">
      <h1>VUE OTP 2</h1>
      <vue-otp-2 @onChange="change" @onComplete="complete" />

      <ul>
        <li>onChange: {{this.changeJ}}</li>
        <li>onComplete: {{this.completeJ}}</li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap&subset=vietnamese");

#app {
  font-family: "Roboto", sans-serif;
  color: #292929;

  .vue-otp {
    max-width: 500px;
    margin: 0 auto;

    ul {
      list-style: none;
      padding: 0;
      margin-left: 0;

      li {
        line-height: 25px;
      }
    }
  }
}
</style>
