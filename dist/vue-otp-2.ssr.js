'use strict';Object.defineProperty(exports,'__esModule',{value:true});function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var ON_INPUT_COMPLETE_EVENT = "onComplete";
var ON_INPUT_CHANGE_EVENT = "onChange";
var script = {
  name: "VueOtp2",
  props: ["length", "joinCharacter", "inputmode", "pattern"],
  data: function data() {
    return {
      otpLength: +this.length || 6,
      inputMode: this.inputmode || "numeric",
      inputPattern: this.pattern || "[0-9]*",
      character: this.joinCharacter,
      otp: [],
      currentInputCursorIndex: 0,
      inputRefs: [],
      isDeleteKey: false // emulator delete key

    };
  },
  mounted: function mounted() {
    this.initInputRefs(this.otpLength);
    this.initOtpLength(this.otpLength);
  },
  computed: {
    currentOtpLength: function currentOtpLength() {
      return this.otp.filter(function (item) {
        return item;
      }).length;
    }
  },
  methods: {
    handleInput: function handleInput(e) {
      // fix samsung keyboard with keyCode on press not working normally
      var keyData = e.data;
      var keyCode = keyData ? keyData.charCodeAt(0) : 0;
      return this.isDeletePress(keyCode) ? this.onDelete() : this.onType(keyData);
    },
    handleKeyup: function handleKeyup() {
      if (this.isDeleteKey) {
        this.prevInput();
      }

      this.riseChangeIsDeleteKey(true);
    },
    isDeletePress: function isDeletePress(keyCode) {
      return keyCode === 0;
    },
    onType: function onType(keyData) {
      this.clearSoftAfterInput(this.currentInputCursorIndex);
      this.riseChangeOtp(this.currentInputCursorIndex, keyData);
      this.fillInputValue(this.currentInputCursorIndex, this.otp[this.currentInputCursorIndex]); // continue if input has value

      this.getInputValue(this.currentInputCursorIndex) && this.nextInput();
      this.riseChangeIsDeleteKey(false);
    },
    onDelete: function onDelete() {
      // this.otp[this.currentInputCursorIndex]
      //   ? this.removeInputValue(this.inputRefs[this.currentInputCursorIndex])
      //   : this.prevInput();
      if (this.otp[this.currentInputCursorIndex]) {
        this.removeInputValue(this.inputRefs[this.currentInputCursorIndex]);
      } else {
        this.prevInput();
        this.riseChangeIsDeleteKey(true);
      } // if press delete, delete all after input


      this.clearSoftAfterInput(this.currentInputCursorIndex);
    },
    riseChangeOtp: function riseChangeOtp(index, data) {
      this.otp.splice(index, 1, data);
    },
    riseChangeIsDeleteKey: function riseChangeIsDeleteKey(data) {
      this.isDeleteKey = !!data;
    },
    handleFocus: function handleFocus(e, i) {
      e.target.select();
      var inputFilled = this.otp.filter(function (item) {
        return item;
      }).length;
      this.currentInputCursorIndex = i > inputFilled ? inputFilled : i;
      this.focusInput(this.inputRefs[this.currentInputCursorIndex]);
    },
    initInputRefs: function initInputRefs(inputNums) {
      var i = 0;

      while (i < inputNums) {
        this.inputRefs = [].concat(_toConsumableArray(this.inputRefs), [this.$refs["input".concat(i)]]);
        i++;
      }
    },
    initOtpLength: function initOtpLength(length) {
      var i = 0;

      while (i < length) {
        this.otp = [].concat(_toConsumableArray(this.otp), [null]);
        i++;
      }
    },
    changeInputCursor: function changeInputCursor(idx) {
      this.currentInputCursorIndex = idx;
    },
    nextInputCursor: function nextInputCursor(currentIdx) {
      var index = currentIdx < this.otpLength - 1 ? currentIdx + 1 : this.otpLength - 1;
      this.changeInputCursor(index);
    },
    prevInputCursor: function prevInputCursor(currentIdx) {
      var index = currentIdx > 0 ? currentIdx - 1 : 0;
      this.changeInputCursor(index);
    },
    nextInput: function nextInput() {
      this.nextInputCursor(this.currentInputCursorIndex);
      this.focusInput(this.inputRefs[this.currentInputCursorIndex]);
    },
    prevInput: function prevInput() {
      this.prevInputCursor(this.currentInputCursorIndex);
      this.focusInput(this.inputRefs[this.currentInputCursorIndex]);
    },
    focusInput: function focusInput(inputRefs) {
      inputRefs && inputRefs[0] && inputRefs[0].focus();
    },
    blurInput: function blurInput(inputRefs) {
      inputRefs && inputRefs[0] && inputRefs[0].blur();
    },
    removeInputValue: function removeInputValue(inputRefs) {
      inputRefs && inputRefs[0] && function () {
        return inputRefs[0].value = null;
      }();
    },
    getInputValue: function getInputValue(idx) {
      return this.inputRefs[idx] && this.inputRefs[idx][0] && this.inputRefs[idx][0].value;
    },
    fillInputValue: function fillInputValue(idx, value) {
      if (this.inputRefs[idx] && this.inputRefs[idx][0]) {
        this.inputRefs[idx][0].value = value;
      }
    },
    validKeyCode: function validKeyCode(code) {
      var isLetter = code >= 65 && code <= 90;
      var isLowercaseLetter = code >= 97 && code <= 122;
      var isNumber = code >= 48 && code <= 57;
      var isDelete = code === 0;
      return isNumber || isLetter || isLowercaseLetter || isDelete;
    },
    clearAfterInput: function clearAfterInput(idx) {
      var _this$otp;

      (_this$otp = this.otp).splice.apply(_this$otp, [idx, this.otpLength - idx].concat(_toConsumableArray(Array(this.otpLength - idx).fill(null))));

      while (idx < this.otpLength) {
        this.removeInputValue(this.inputRefs[idx]);
        idx++;
      }
    },
    clearSoftAfterInput: function clearSoftAfterInput(idx) {
      if (idx < 0) idx = 0;

      while (idx < this.otpLength) {
        this.otp[idx] = null;
        this.removeInputValue(this.inputRefs[idx]);
        idx++;
      }
    },
    emitEvent: function emitEvent(eventName, payload) {
      this.$emit(eventName, payload);
    },
    emitEventChange: function emitEventChange(payload) {
      this.emitEvent(ON_INPUT_CHANGE_EVENT, payload);
    },
    emitEventComplete: function emitEventComplete(payload) {
      this.emitEvent(ON_INPUT_COMPLETE_EVENT, payload);
    }
  },
  watch: {
    otp: function otp() {
      var otpLength = this.currentOtpLength;
      var idxCanGet = otpLength === this.otpLength ? this.currentInputCursorIndex : this.currentInputCursorIndex - 1; // onchange

      if (otpLength || otpLength === this.otpLength - 1) {
        var dataChange = {
          index: idxCanGet,
          value: this.otp[idxCanGet]
        };
        this.emitEventChange(dataChange);
      } // on complete


      if (otpLength === this.otpLength) {
        this.emitEventComplete(_toConsumableArray(this.otp));
        this.blurInput(this.inputRefs[this.otpLength - 1]);
      }
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "vue-otp-2"
  }, [_vm._ssrNode(_vm._ssrList(_vm.otpLength * 2 - 1, function (v, i) {
    return "<div data-v-10e5d926>" + (i % 2 === 0 ? "<input minlength=\"1\" maxlength=\"1\" type=\"text\"" + _vm._ssrAttr("inputmode", _vm.inputMode) + _vm._ssrAttr("pattern", _vm.inputPattern) + " data-v-10e5d926>" : "<!---->") + " " + (i % 2 !== 0 && true ? "<span data-v-10e5d926>" + _vm._ssrEscape(_vm._s(_vm.character)) + "</span>" : "<!---->") + "</div>";
  }))]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-10e5d926_0", {
    source: ".vue-otp-2[data-v-10e5d926]{display:flex;justify-content:space-between}.vue-otp-2 div[data-v-10e5d926]{flex:1;display:flex;align-items:center;justify-content:center}.vue-otp-2 div input[data-v-10e5d926]{max-width:30px;padding:11.5px 8px;font-size:20px;border-radius:3px;border:1px solid #cecece;text-align:center}.vue-otp-2 div span[data-v-10e5d926]{display:block;flex:1;text-align:center}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-10e5d926";
/* module identifier */

var __vue_module_identifier__ = "data-v-10e5d926";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component

var install = function installVueOtp2(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('VueOtp2', __vue_component__);
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
} // Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__;