# Vue.js

## Vue组件

### 概述
Vue组件 = Vue实例 = new Vue(options)  
组件由template标签内的html，script标签内的js，style[scoped]标签内的css组成

### 模板语法

#### 插值

```javascript
// mustache语法插入文本
<span>Message: {{ msg }}</span>
// 插入一次值
<span v-once>Message: {{ msg }}</span>
// 插入html
<span v-html="rawHtml"></span>
// 插入html属性
<div v-bind:id="dynamicId"></div>
// 插入布尔值时，若为null、undefined或false该属性不显示
<button v-bind:disabled="isButtonDisabled">Button</button>
// 对于所有的数据绑定都可支持简单的js表达式，语句也不行
{{ ok ? 'YES' : 'NO' }}
<div v-bind:id="'list-' + id"></div>
```

#### 指令
指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM。指令特性的值预期是单个 JavaScript 表达式 (v-for 是例外情况)。  指令可以以"v-指令名:参数"的形式接受一个参数，到vue2.6可以使用"v-指令名:[参数js表达式]"来接受一个动态的指令参数。  
修饰符 (modifier) 是以"v-指令:参数.修饰符"，用于指出一个指令应该以特殊方式绑定。

```javascript
// v-if表达式内为真即显示
<p v-if="seen">内容</p>
// 动态的为指令添加参数 2.6新增
<a v-bind:[attributeName]="url"> ... </a>
// 修饰符.prevent将指示v-on在触发事件时调用event.preventDefault()
<form v-on:submit.prevent="onSubmit">...</form>

// v-bind:可以缩写为":"
<a :href="url">...</a>
// v-on:可以缩写为"@"
<a @click="doSomething">...</a>
```

#### 计算属性和侦听器 computed/watch

对于想要将显示数据处理后输出的情况使用计算属性
```javascript
// data与计算computed属性内的数据都能被html调用
var vm = new Vue({
  el: '#example',
  data: {
    message: 'Hello',
    firstName: 'Foo',
    lastName: 'Bar'
  },
  computed: {
    // 计算属性的 getter
    reversedMessage: function () {
      // `this` 指向 vm 实例，vm.message也可以调用message
      return this.message.split('').reverse().join('')
    },
    // 由于computed是依赖于响应式的数据，但是Date.now()不是响应式的，所以这个computed属性的响应的值将不再更新。
    now: function() {
        return Date.now()
    },
    // 可以为computed属性元素设置getter与setter
    fullName: {
    get: function () {
      return this.firstName + ' ' + this.lastName
    },
    // setter
    set: function (newValue) {
      var names = newValue.split(' ')
      this.firstName = names[0]
      this.lastName = names[names.length - 1]
    }
  }
  },
  // 下面的表达式让你能通过reversedMessage()获取同样的结果，但是上面的方式是可以被缓存的，只有依赖的message属性被更改时才会被重新计算，而不像函数那样每次都会被计算
  methods: {
      reversedMessage: function() {
          return this.message.split('').reverse().join('')
      }
  }
})

var vm = new Vue({
  el: '#demo',
  data: {
    firstName: 'Foo',
    lastName: 'Bar',
    fullName: 'Foo Bar'
  },
  // 使用watch侦听属性可以观察响应Vue实例上的数据变动但明显效果不如使用computed属性
  watch: {
    firstName: function (val) {
      this.fullName = val + ' ' + this.lastName
    },
    lastName: function (val) {
      this.fullName = this.firstName + ' ' + val
    }
  }
})

// 一个带有AJAX请求的watch监听器实例
var watchExampleVM = new Vue({
  el: '#watch-example',
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  },
  created: function () {
    // `_.debounce` 是一个通过 Lodash 限制操作频率的函数。
    // 在这个例子中，我们希望限制访问 yesno.wtf/api 的频率
    // AJAX 请求直到用户输入完毕才会发出。想要了解更多关于
    // `_.debounce` 函数 (及其近亲 `_.throttle`) 的知识，
    // 请参考：https://lodash.com/docs#debounce
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 500)
  },
  methods: {
    getAnswer: function () {
      if (this.question.indexOf('?') === -1) {
        this.answer = 'Questions usually contain a question mark. ;-)'
        return
      }
      this.answer = 'Thinking...'
      var vm = this
      axios.get('https://yesno.wtf/api')
        .then(function (response) {
          vm.answer = _.capitalize(response.data.answer)
        })
        .catch(function (error) {
          vm.answer = 'Error! Could not reach the API. ' + error
        })
    }
  }
})
```

#### Class和Style绑定 v-bind:class/style
Class
```javascript
// 当isActive是true的时候active这个class将被添加
<div v-bind:class="{ active: isActive }"></div>
// 传入数组也可以，这俩是定义在data中的属性
<div v-bind:class="[activeClass, errorClass]"></div>
// 上边俩结合一下
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
// class与v-bind:class可以共存，后者将会在计算后被添加到class中
<div
  class="static"
  v-bind:class="{ active: isActive, 'text-danger': hasError }"
></div>
// 可以直接在data中绑定众多class的父元素而不用一个个添加到模板的v-bind:class中
<div v-bind:class="classObject"></div>
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
// 使用computed方式返回也阔以
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

Style
```javascript
// 跟Class很相似，只不过这回传值会被打印，CSS属性名可以用驼峰或短横线（用引号括起来）形式
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
data: {
  activeColor: 'red',
  fontSize: 30
}

// 封装成一个样式对象最好了
<div v-bind:style="styleObject"></div>
// 这样可以应用多个样式对象
<div v-bind:style="[baseStyles, overridingStyles]"></div>
data: {
  styleObject: {
    color: 'red',
    fontSize: '13px'
  }
}
```

#### 条件渲染 v-if v-show

动态的决定是否渲染改元素

```javascript
<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```
如果想要控制多个元素可以包裹一个template元素，最终渲染将不包括template
```html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```
else if语法同样支持
```html
<div v-if="type === 'A'">A</div>
<div v-else-if="type === 'B'">B</div>
<div v-else-if="type === 'C'">C</div>
<div v-else>Not A/B/C</div>
```
Vue会尽可能复用已有的元素，这就使得下面的input的已输入内容将不会被清除，如果不想重用元素可以为元素添加一个key
```html
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username" key="username-input" />
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address" key="email-input" />
</template>

```
使用v-show将会动态切换元素的display属性，template元素不支持
```html
<h1 v-show="ok">Hello!</h1>
```
> v-for比v-if有更高优先级，但不推荐在一个元素傻瓜同时使用v-if与v-for

#### 列表渲染 v-for

```javascript
<ul id="example-1">
  <li v-for="item in items">
    {{ item.message }}
  </li>
</ul>

var example1 = new Vue({
  el: '#example-1',
  data: {
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

```javascript
<ul id="example-2">
  <li v-for="(item, index) in items">
    {{ parentMessage }} - {{ index }} - {{ item.message }}
  </li>
</ul>

var example2 = new Vue({
  el: '#example-2',
  data: {
    parentMessage: 'Parent',
    items: [
      { message: 'Foo' },
      { message: 'Bar' }
    ]
  }
})
```

```javascript
<div v-for="(value, name, index) in object">
  {{ index }} - {{ name }} - {{ value }}
</div>

// 0 - title - How to do lists in Vue
// 1 - author - Jane Doe
// 2 - publishedAt - 2016-04-10
```
建议用v-for时一定要bind一个key
```html
<div v-for="item in items" v-bind:key="item.id">
  <!-- 内容 -->
</div>
```
Vue会自动侦听数组的编译方法，这些方法会出发视图更新
```
push()
pop()
shift()
unshift()
splice()
sort()
reverse()
```
也可以直接抛弃一个之前的数组
```javascript
example1.items = example1.items.filter(function (item) {
  return item.message.match(/Foo/)
})
```
直接使用索引更改一个数组项将不会引发Vue的响应式更新，转而使用Vue.set或Array.prototype.splice方法
```javascript
// Vue.set
Vue.set(vm.items, indexOfItem, newValue)
vm.$set(vm.items, indexOfItem, newValue)

// Array.prototype.splice
vm.items.splice(indexOfItem, 1, newValue)
```

Vue不能为Vue实例动态添加挂载在根节点的响应式属性，不过可以通过为已创建的挂载在根节点的属性添加响应式属性。
```javascript
// 不可以直接创建data内的挂载在根节点的响应式属性，但是可以通过为userProfile添加其他其他属性
var vm = new Vue({
  data: {
    userProfile: {
      name: 'Anika'
    }
  }
})

Vue.set(vm.userProfile, 'age', 27)
```

为已有对象赋值多个属性时可以使用Object.assign()，但是使用
```javascript
vm.userProfile = Object.assign({}, vm.userProfile, {
  age: 27,
  favoriteColor: 'Vue Green'
})
```
如果想返回处理后的结果
```javascript
<li v-for="n in evenNumbers">{{ n }}</li>
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
computed: {
  evenNumbers: function () {
    return this.numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
// 在计算属性不适用的情况下可以使用方法
<li v-for="n in even(numbers)">{{ n }}</li>
data: {
  numbers: [ 1, 2, 3, 4, 5 ]
},
methods: {
  even: function (numbers) {
    return numbers.filter(function (number) {
      return number % 2 === 0
    })
  }
}
```
v-for甚至可以接受整数，比如v-for="n in 10"，就会打印1-10  
```html
<span v-for="n in 10">{{ n }} </span>
```
v-for用在组件上时一定要加v-bind:key，这里使用v-bind:item/index将父组件传来的数据传入子组件
```html
<my-component
  v-for="(item, index) in items"
  v-bind:item="item"
  v-bind:index="index"
  v-bind:key="item.id"
></my-component>
```
如果有些元素内不支持模板嵌套，例如
```javascript
<ul>
    <li
      // 使用is标签与<todo-item></todo-item>效果相同
      is="todo-item"
      v-for="(todo, index) in todos"
      v-bind:key="todo.id"
      v-bind:title="todo.title"
      v-on:remove="todos.splice(index, 1)"
    ></li>
</ul>
```

#### 事件处理 v-on
用于监听DOM事件并在触发时运行一些js代码
```javascript
<div id="example-1">
  <button v-on:click="counter += 1">Add 1</button>
  <!-- 如果直接写写不开，就放到method里调用 -->
  <button v-on:click="greet">Greet</button>
  <p>The button above has been clicked {{ counter }} times.</p>
</div>

var example2 = new Vue({
  el: '#example-2',
  data: {
    name: 'Vue.js',
    data: 0
  },
  // 在 `methods` 对象中定义方法
  methods: {
    greet: function (event) {
      // `this` 在方法里指向当前 Vue 实例
      alert('Hello ' + this.name + '!')
      // `event` 是原生 DOM 事件
      if (event) {
        alert(event.target.tagName)
      }
    }
  }
})
```
也可以调用内联JavaScript语句来调用方法
```javascript
<div id="example-3">
  <button v-on:click="say('hi')">Say hi</button>
  <button v-on:click="say('what')">Say what</button>
</div>

new Vue({
  el: '#example-3',
  methods: {
    say: function (message) {
      alert(message)
    }
  }
})
```
事件修饰符
.stop
.prevent
.capture
.self
.once
.passive
```html
<!-- 阻止单击事件继续传播 -->
<a v-on:click.stop="doThis"></a>

<!-- 提交事件不再重载页面 -->
<form v-on:submit.prevent="onSubmit"></form>

<!-- 修饰符可以串联 -->
<a v-on:click.stop.prevent="doThat"></a>

<!-- 只有修饰符 -->
<form v-on:submit.prevent></form>

<!-- 添加事件监听器时使用事件捕获模式 -->
<!-- 即元素自身触发的事件先在此处理，然后才交由内部元素进行处理 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当在 event.target 是当前元素自身时触发处理函数 -->
<!-- 即事件不是从内部元素触发的 -->
<div v-on:click.self="doThat">...</div>
```
### 引用方法
在父组件的script中使用import...from...语句引入，并在export default中的components中注册该组件
```javascript
<script>
    import 组件名 from "组件路径";

    export default {
        components: {
            组件名,
            组件别名:组件名 // 之后就可以用<组件别名></组件别名>来使用组件了
        }
    }
</script>
```

### 核心概念
1. 分为属性、事件和插槽  
2. Vue是单向数据流，不是双向绑定，而双向绑定是语法糖，Vue使用Object.defineProperty做响应式更新

#### 属性

* 自定义属性（props）：
属性即html元素里定义的属性，组件props中声明的属性，父组件可以用v-bind:属性名="数据"，向子组件传数据，其中属性名为onChange需要在父组件中使用on-change作为属性名

* 原生属性（attrs）：
没有声明的属性，默认自动挂载到组件根元素上，设置inheritAttrs为false可以关闭自动挂载

* 特殊属性（class/style）：
挂载到组件根元素上，支持字符串、对象、数组等多种语法，最终底层恢复到字符串挂载在元素上


```javascript
// 子组件中
export default {
    name: "Attribute Demo",
    inheritAttrs: false,    // 父组件调用子组件时添加的原生属性例如title等将会被继承，添加这个去掉
    props: {    // 将属性以对象形式存在props里，父组件可以用v-bind:属性名="数据"，向子组件传数据
                // 子组件不能直接修改父组件传下来的属性值
        attribute1: String, // 将属性定义为String类型，下方其他写法也可以
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
    name="Hello Vue!"
    v-bind:type="type"
    v-bind:is-visible="false"
    v-bind:on-change="handlePropChange" //跟父组件函数绑定
    title="属性Demo"
    class="test1"
    v-bind:class="['test2']"
    v-bind:style="{ marginTop: '20px' }"
    style="margin-top: 10px"
/>
```


#### 事件

* 普通事件：
@click，@input，@change，@xxx等事件，通过this.$emit('xxx',...)触发

* 修饰符事件：
@input.trim，@click.stop，@submit.prevent等，一般用于原生HTML元素，自定义组件需要自行开发支持

```javascript
// 父组件中
<Event v-bind:name="name" v-on:change="handleEventChange" />

data: () => {
    return {
        name: "",
    };
},
methods: {
    handleEventChange(val) {
      this.name = val;
    },
}

// 子组件中
<template>
  <div>
    name: {{ name || "--" }}
    <br />
    <input :value="name" @change="handleChange" />
    <br />
    <br />
    <div @click="handleDivClick">
      <button @click="handleClick">重置成功</button>&nbsp;&nbsp;&nbsp;
      <button @click.stop="handleClick">重置失败</button> // .stop是阻止冒泡即向上传递参数的功能
    </div>
  </div>
</template>

export default {
  name: "EventDemo",
  props: {
    name: String
  },
  methods: {
    handleChange(e) {
      this.$emit("change", e.target.value); // 触发change事件，将input内的value传到上层，时间名,参数
    },
    handleDivClick() {
      this.$emit("change", "");
    },
    handleClick(e) {
      // 都会失败
      //e.stopPropagation();
    }
  }
}

```

#### 插槽

* 普通插槽：
<template slot="xxx">...</template>或<template v-slot="xxx">...</template>，后者为2.6新语法

* 作用域插槽：
<template slot="xxx" slot-scope="props">...</template>或<template v-slot:xxx="props">...</template>，props为子组件传递的参数

```javascript
// 父组件
<h2>新语法</h2>
<SlotDemo>
    <p>default slot</p>
    <template v-slot:title>
        <p>title slot1</p>
        <p>title slot2</p>
    </template>
    <template v-slot:item="props">
        <p>item slot-scope {{ props }}</p>
    </template>
</SlotDemo>

<h2>老语法</h2>
<SlotDemo>
    <p>default slot</p>
    <p slot="title">title slot1</p>
    <p slot="title">title slot2</p>
    <p slot="item" slot-scope="props">item slot-scope {{ props }}</p>
</SlotDemo>

// 子组件
<template>
    <div>
        <slot />
        <slot name="title" />
        <slot name="item" v-bind="{ value: 'vue' }" />
    </div>
</template>

<script>
export default {
    name: "SlotDemo"
};
</script>
```