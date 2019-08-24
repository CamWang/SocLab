# Vue.js

## Vue组件

### 概述
Vue组件 = Vue实例 = new Vue(options)  
组件由<template>标签内的html，<script>标签内的js，<style [scoped]>标签内的css组成

### 引用方法
在父组件的script中使用import...from...语句引入，并在export default中的components中注册该组件
```javascript
<script>
    import 组件名 from "组件路径";

    export default {
        components: {
            组件名
        }
    }
</script>
```

### 核心概念
分为属性、事件和插槽  

#### 属性

* 自定义属性（props）：
组件props中声明的属性，父组件可以用v-bind:属性名="数据"，向子组件传数据，其中属性名为onChange需要在父组件中使用on-change作为属性名
```javascript
// 子组件中
export default {
    name: String,
    props: {    // 将属性以对象形式存在props里，父组件可以用v-bind:属性名="数据"，向子组件传数据
        info: {
            validator: function(value) {
                // 匹配校验，返回true、false
                return ["success", "warning", "danger"].includes(value);
            }
        },
        list: {
            type: Array,
            // 对象或数组默认值从一个工厂函数中获取，这里是个空数组
            default:() => []
        },
        isVisible: {
            type: Boolean,
            default: false  // 默认也是false
        },
        onChange: {
            type: Function,
            default: () = {}
        }
    },
    methods: {
        handleClick() {

        }
    }
}

// 父组件中，组件是为<component></component>（闭合标签）或<component />（自闭合标签）形式取决于需求
<Component
/>
```

* 原生属性（attrs）：
没有声明的属性，默认自动挂载到组件根元素上，设置inheritAttrs未false可以关闭自动挂载

* 特殊属性（class/style）：
挂载到组件根元素上，支持字符串、对象、数组等多种语法，最终底层恢复到字符串挂载在元素上