# VUE OTP INPUT

> A OTP input component for Vue

![](https://i.imgur.com/aGuMJff.gif)

DEMO: [https://vue-otp-2-hoaitx.vercel.app/](https://vue-otp-2-hoaitx.vercel.app/)

![NPM Version](https://img.shields.io/npm/v/vue-otp-2)

## Installation

``` sh
npm i vue-otp-2
```

## Usage example

In main.js

``` javascript
import Vue from 'vue'
import VueOtp2 from 'vue-otp-2';

Vue.use(VueOtp2)
```

In App.vue

``` vue
<vue-otp-2
  length="6"
  join-character="-"
  inputmode="numeric"
  pattern="[0-9]*"
  @onChange="console.log"
  @onComplete="console.log" 
/>
```

## Props

|Name|Type|Default|Description|
|---|---|---|---|
|length|String|6|The number of input|
|join-character|String||character to join inputs|
|inputmode|String|numeric|numeric/text|
|pattern|String|[0-9]*|[HTML attribute: pattern](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/pattern)|

## Events

|Name|Description|
|---|---|
|onComplete|All input typed|
|onChange|Input filled|

## Style

``` scss
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
```

## Release History

### 1.0.3: Fixed some bugs & improvement

- Fix: Keypress not working on Samsung devices
- Added inputmode & pattern html input
- Improvement style
- And more...

### 1.0.2: Fixed some bugs

- Fix: Event emit not correct

### 1.0.1: RELEASE

## License

MIT
