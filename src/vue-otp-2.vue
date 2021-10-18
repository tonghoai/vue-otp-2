<script>
const ON_INPUT_COMPLETE_EVENT = "onComplete";
const ON_INPUT_CHANGE_EVENT = "onChange";

export default {
  name: "VueOtp2",
  props: ["length", "joinCharacter", "inputmode", "pattern"],
  data: function () {
    return {
      otpLength: this.length || 6,
      inputMode: this.inputmode || "numeric",
      inputPattern: this.pattern || "[0-9]*",
      character: this.joinCharacter,
      otp: [],
      currentInputCursorIndex: 0,
      inputRefs: [],
    };
  },
  mounted() {
    this.initInputRefs(this.otpLength);
    this.initOtpLength(this.otpLength);
  },
  methods: {
    handleInput(e, i) {
      if (!this.validKeyCode(e)) {
        return;
      }

      if (e.keyCode !== 8) {
        this.clearSoftAfterInput(this.currentInputCursorIndex);
        this.otp.splice(this.currentInputCursorIndex, 1, e.key);
        this.fillInputValue(
          this.currentInputCursorIndex,
          this.otp[this.currentInputCursorIndex]
        );
        if (this.getInputValue(this.currentInputCursorIndex)) {
          this.nextInput();
        }
      } else {
        if (this.otp[this.currentInputCursorIndex]) {
          this.removeInputValue(this.inputRefs[this.currentInputCursorIndex]);
        } else {
          this.prevInput();
        }
        this.clearSoftAfterInput(this.currentInputCursorIndex);
      }
    },
    handleFocus(e, i) {
      e.target.select();
      const inputFilled = this.otp.filter((item) => item).length;
      this.currentInputCursorIndex = i > inputFilled ? inputFilled : i;
      this.focusInput(this.inputRefs[this.currentInputCursorIndex]);
    },
    initInputRefs(inputNums) {
      [...Array(inputNums).keys()].forEach((_, idx) => {
        this.inputRefs = [...this.inputRefs, this.$refs[`input${idx}`]];
      });
    },
    initOtpLength(length) {
      [...Array(length).keys()].forEach((_, idx) => {
        this.otp = [...this.otp, null];
      });
    },
    changeInputCursor(idx) {
      this.currentInputCursorIndex = idx;
    },
    nextInputCursor(currentIdx) {
      const index =
        currentIdx < this.otpLength - 1 ? currentIdx + 1 : this.otpLength - 1;
      this.changeInputCursor(index);
    },
    prevInputCursor(currentIdx) {
      const index = currentIdx > 0 ? currentIdx - 1 : 0;
      this.changeInputCursor(index);
    },
    nextInput() {
      this.nextInputCursor(this.currentInputCursorIndex);
      this.focusInput(this.inputRefs[this.currentInputCursorIndex]);
    },
    prevInput() {
      this.prevInputCursor(this.currentInputCursorIndex);
      this.focusInput(this.inputRefs[this.currentInputCursorIndex]);
    },
    focusInput(inputRefs) {
      inputRefs && inputRefs[0] && inputRefs[0].focus();
    },
    blurInput(inputRefs) {
      inputRefs && inputRefs[0] && inputRefs[0].blur();
    },
    removeInputValue(inputRefs) {
      inputRefs && inputRefs[0] && (() => (inputRefs[0].value = null))();
    },
    getInputValue(idx) {
      return (
        this.inputRefs[idx] &&
        this.inputRefs[idx][0] &&
        this.inputRefs[idx][0].value
      );
    },
    fillInputValue(idx, value) {
      if (this.inputRefs[idx] && this.inputRefs[idx][0]) {
        this.inputRefs[idx][0].value = value;
      }
    },
    validKeyCode(key) {
      const isLetter = key.keyCode >= 65 && key.keyCode <= 90;
      const isNumber = key.keyCode >= 48 && key.keyCode <= 57;
      const isDelete = key.keyCode == 8;
      return isNumber || isLetter || isDelete;
    },
    clearAfterInput(idx) {
      this.otp.splice(
        idx,
        this.otpLength - idx,
        ...Array(this.otpLength - idx).fill(null)
      );

      while (idx < this.otpLength) {
        this.removeInputValue(this.inputRefs[idx]);
        idx++;
      }
    },
    clearSoftAfterInput(idx) {
      if (idx < 0) idx = 0;
      while (idx < this.otpLength) {
        this.otp[idx] = null;
        this.removeInputValue(this.inputRefs[idx]);
        idx++;
      }
    },
  },
  watch: {
    otp() {
      const otpLength = this.otp.filter((item) => item).length;
      const idxCanGet =
        otpLength === this.otpLength
          ? this.currentInputCursorIndex
          : this.currentInputCursorIndex - 1;

      if (otpLength || otpLength === this.otpLength - 1) {
        const dataChange = {
          index: idxCanGet,
          value: this.otp[idxCanGet],
        };
        this.$emit(ON_INPUT_CHANGE_EVENT, dataChange);
      }

      if (this.otp.filter((item) => item).length === this.otpLength) {
        this.$emit(ON_INPUT_COMPLETE_EVENT, [...this.otp]);
        this.blurInput(this.inputRefs[this.otpLength - 1]);
      }
    },
  },
};
</script>

<template>
  <div class="vue-otp-2">
    <div v-for="(v, i) in otpLength * 2 - 1" :key="i / 2">
      <input
        minlength="1"
        maxlength="1"
        type="text"
        v-if="i % 2 === 0"
        :ref="'input' + i / 2"
        :inputmode="inputMode"
        :pattern="inputPattern"
        @keyup="handleInput($event, i / 2)"
        @focus="handleFocus($event, i / 2)"
      />
      <span v-if="i % 2 !== 0 && true">{{ character }}</span>
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
      padding: 11.5px 8px;
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
