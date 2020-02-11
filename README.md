# VUE OTP INPUT

> A OTP input component for Vue

![](https://i.imgur.com/aGuMJff.gif)

DEMO: [https://vue-otp-2.hoaitx.now.sh/](https://vue-otp-2.hoaitx.now.sh/)

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

``` js
<vue-otp-2
  length="6"
  join-character="-"
  @onChange=""
  @onComplete="" 
/>
```

## Props

|Name|Type|Default|Description|
|---|---|---|---|
|length|String|6|The number of input|
|join-character|String||character to join inputs|

## Events

|Name|Description|
|---|---|
|onComplete|Trigger when done|
|onChange|Trigger when input change|

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
```

## Release History

* 1.0.0: RELEASE

## License

MIT

