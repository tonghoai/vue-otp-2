<script>
const ON_INPUT_COMPLETE_EVENT = "onComplete";
const ON_INPUT_CHANGE_EVENT = "onChange";

export default {
  name: "VueOtp2",
  props: ["length", "joinCharacter"],
  data: function() {
    return {
      otpLength: this.length || 6,
      character: this.joinCharacter,
      otp: [],
      isComplete: false
    };
  },
  methods: {
    handleInput(e, i) {
      this.$nextTick(() => {
        this.isComplete = false;
        if (e.keyCode === 8) {
          this.otp = this.otp.map((item, idx) => {
            if (idx >= i) {
              item = null;
            }
            return item;
          });
          if (i > 0) {
            this.$refs["input" + (i - 1)][0].focus();
          }
        } else {
          this.otp = this.otp.map((item, idx) => {
            if (idx === i) {
              item = e.key;
            }
            return item;
          });
          if (i < this.otpLength - 1) {
            this.$refs["input" + (i + 1)][0].focus();
          } else {
            this.isComplete = true;
          }
        }

        const dataChange = {
          index: i,
          value: this.otp[i]
        };
        this.$emit(ON_INPUT_CHANGE_EVENT, dataChange);
      });
    },
    handleFocus(e, i) {
      e.target.select();
      if (!this.otp[i]) {
        const c = this.otp.filter(item => item).length;
        this.$refs["input" + c][0].focus();
      }
    }
  },
  watch: {
    isComplete() {
      if (this.isComplete) {
        this.$emit(ON_INPUT_COMPLETE_EVENT, [...this.otp]);
        this.isComplete = false;
      }
    }
  }
};
</script>

<template>
  <div class="vue-otp-2">
    <div v-for="(v,i) in otpLength * 2 - 1" :key="i/2">
      <input
        v-if="i%2 === 0"
        :ref="'input' + (i/2)"
        @keyup="handleInput($event, i/2)"
        v-model="otp[i/2]"
        minlength="1"
        maxlength="1"
        @focus="handleFocus($event, i/2)"
      />
      <span v-if="i%2 !== 0 && true">{{character}}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vue-otp-2 {
  display: flex;
  justify-content: space-between;

  div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      max-width: 30px;
      padding: 10px 8px;
      font-size: 20px;
      border-radius: 3px;
      border: 1px solid #cecece;
      text-align: center;
    }

    span {
      display: block;
      flex: 1;
      text-align: center;
    }
  }
}
</style>
