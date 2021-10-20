<script>
const ON_INPUT_COMPLETE_EVENT = "onComplete";
const ON_INPUT_CHANGE_EVENT = "onChange";

export default {
  name: "VueOtp2",
  props: ["length", "joinCharacter", "inputmode", "pattern"],
  data: function () {
    return {
      otpLength: +this.length || 6,
      inputMode: this.inputmode || "numeric",
      inputPattern: this.pattern || "[0-9]*",
      character: this.joinCharacter,
      otp: [],
      currentInputCursorIndex: 0,
      inputRefs: [],
      isDeleteKey: false, // emulator delete key
    };
  },
  mounted() {
    this.initInputRefs(this.otpLength);
    this.initOtpLength(this.otpLength);
  },
  computed: {
    currentOtpLength() {
      return this.otp.filter((item) => item).length;
    },
  },
  methods: {
    handleInput(e) {
      // fix samsung keyboard with keyCode on press not working normally
      const keyData = e.data;
      const keyCode = keyData ? keyData.charCodeAt(0) : 0;

      return this.isDeletePress(keyCode)
        ? this.onDelete()
        : this.onType(keyData);
    },
    handleKeyup() {
      if (this.isDeleteKey) {
        this.prevInput();
      }
      this.riseChangeIsDeleteKey(true);
    },
    isDeletePress(keyCode) {
      return keyCode === 0;
    },
    onType(keyData) {
      this.clearSoftAfterInput(this.currentInputCursorIndex);
      this.riseChangeOtp(this.currentInputCursorIndex, keyData);
      this.fillInputValue(
        this.currentInputCursorIndex,
        this.otp[this.currentInputCursorIndex]
      );
      // continue if input has value
      this.getInputValue(this.currentInputCursorIndex) && this.nextInput();
      this.riseChangeIsDeleteKey(false);
    },
    onDelete() {
      // this.otp[this.currentInputCursorIndex]
      //   ? this.removeInputValue(this.inputRefs[this.currentInputCursorIndex])
      //   : this.prevInput();
      if (this.otp[this.currentInputCursorIndex]) {
        this.removeInputValue(this.inputRefs[this.currentInputCursorIndex]);
      } else {
        this.prevInput();
        this.riseChangeIsDeleteKey(true);
      }
      // if press delete, delete all after input
      this.clearSoftAfterInput(this.currentInputCursorIndex);
    },
    riseChangeOtp(index, data) {
      this.otp.splice(index, 1, data);
    },
    riseChangeIsDeleteKey(data) {
      this.isDeleteKey = !!data;
    },
    handleFocus(e, i) {
      e.target.select();
      const inputFilled = this.otp.filter((item) => item).length;
      this.currentInputCursorIndex = i > inputFilled ? inputFilled : i;
      this.focusInput(this.inputRefs[this.currentInputCursorIndex]);
    },
    initInputRefs(inputNums) {
      let i = 0;
      while (i < inputNums) {
        this.inputRefs = [...this.inputRefs, this.$refs[`input${i}`]];
        i++;
      }
    },
    initOtpLength(length) {
      let i = 0;
      while (i < length) {
        this.otp = [...this.otp, null];
        i++;
      }
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
    validKeyCode(code) {
      const isLetter = code >= 65 && code <= 90;
      const isLowercaseLetter = code >= 97 && code <= 122;
      const isNumber = code >= 48 && code <= 57;
      const isDelete = code === 0;
      return isNumber || isLetter || isLowercaseLetter || isDelete;
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
    emitEvent(eventName, payload) {
      this.$emit(eventName, payload);
    },
    emitEventChange(payload) {
      this.emitEvent(ON_INPUT_CHANGE_EVENT, payload);
    },
    emitEventComplete(payload) {
      this.emitEvent(ON_INPUT_COMPLETE_EVENT, payload);
    },
  },
  watch: {
    otp() {
      const otpLength = this.currentOtpLength;

      const idxCanGet =
        otpLength === this.otpLength
          ? this.currentInputCursorIndex
          : this.currentInputCursorIndex - 1;

      // onchange
      if (otpLength || otpLength === this.otpLength - 1) {
        const dataChange = {
          index: idxCanGet,
          value: this.otp[idxCanGet],
        };
        this.emitEventChange(dataChange);
      }

      // on complete
      if (otpLength === this.otpLength) {
        this.emitEventComplete([...this.otp]);
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
        @input="handleInput"
        @keyup="handleKeyup"
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
