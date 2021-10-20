const ON_INPUT_COMPLETE_EVENT = "onComplete";
const ON_INPUT_CHANGE_EVENT = "onChange";
var script = {
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
      isDeleteKey: false // emulator delete key

    };
  },

  mounted() {
    this.initInputRefs(this.otpLength);
    this.initOtpLength(this.otpLength);
  },

  computed: {
    currentOtpLength() {
      return this.otp.filter(item => item).length;
    }

  },
  methods: {
    handleInput(e) {
      // fix samsung keyboard with keyCode on press not working normally
      const keyData = e.data;
      const keyCode = keyData ? keyData.charCodeAt(0) : 0;
      return this.isDeletePress(keyCode) ? this.onDelete() : this.onType(keyData);
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
      this.fillInputValue(this.currentInputCursorIndex, this.otp[this.currentInputCursorIndex]); // continue if input has value

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
      } // if press delete, delete all after input


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
      const inputFilled = this.otp.filter(item => item).length;
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
      const index = currentIdx < this.otpLength - 1 ? currentIdx + 1 : this.otpLength - 1;
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
      inputRefs && inputRefs[0] && (() => inputRefs[0].value = null)();
    },

    getInputValue(idx) {
      return this.inputRefs[idx] && this.inputRefs[idx][0] && this.inputRefs[idx][0].value;
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
      this.otp.splice(idx, this.otpLength - idx, ...Array(this.otpLength - idx).fill(null));

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
    }

  },
  watch: {
    otp() {
      const otpLength = this.currentOtpLength;
      const idxCanGet = otpLength === this.otpLength ? this.currentInputCursorIndex : this.currentInputCursorIndex - 1; // onchange

      if (otpLength || otpLength === this.otpLength - 1) {
        const dataChange = {
          index: idxCanGet,
          value: this.otp[idxCanGet]
        };
        this.emitEventChange(dataChange);
      } // on complete


      if (otpLength === this.otpLength) {
        this.emitEventComplete([...this.otp]);
        this.blurInput(this.inputRefs[this.otpLength - 1]);
      }
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "vue-otp-2"
  }, _vm._l(_vm.otpLength * 2 - 1, function (v, i) {
    return _c('div', {
      key: i / 2
    }, [i % 2 === 0 ? _c('input', {
      ref: 'input' + i / 2,
      refInFor: true,
      attrs: {
        "minlength": "1",
        "maxlength": "1",
        "type": "text",
        "inputmode": _vm.inputMode,
        "pattern": _vm.inputPattern
      },
      on: {
        "input": _vm.handleInput,
        "keyup": _vm.handleKeyup,
        "focus": function ($event) {
          return _vm.handleFocus($event, i / 2);
        }
      }
    }) : _vm._e(), _vm._v(" "), i % 2 !== 0 && true ? _c('span', [_vm._v(_vm._s(_vm.character))]) : _vm._e()]);
  }), 0);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-10e5d926_0", {
    source: ".vue-otp-2[data-v-10e5d926]{display:flex;justify-content:space-between}.vue-otp-2 div[data-v-10e5d926]{flex:1;display:flex;align-items:center;justify-content:center}.vue-otp-2 div input[data-v-10e5d926]{max-width:30px;padding:11.5px 8px;font-size:20px;border-radius:3px;border:1px solid #cecece;text-align:center}.vue-otp-2 div span[data-v-10e5d926]{display:block;flex:1;text-align:center}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-10e5d926";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component

const install = function installVueOtp2(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('VueOtp2', __vue_component__);
}; // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

let GlobalVue = null;

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

export default __vue_component__;
