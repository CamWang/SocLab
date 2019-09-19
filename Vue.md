# Vue.js

## Vue大坑

### 同一组件间路由变化页面不刷新
解决方法：使用watch
```javascript
 watch: {
 // 方法1
  '$route' (to, from) { //监听路由是否变化
    if(this.$route.params.articleId){// 判断条件1  判断传递值的变化
      //获取文章数据
    }
  }
  //方法2
  '$route'(to, from) {
    if (to.path == "/page") {    /// 判断条件2  监听路由名 监听你从什么路由跳转过来的
       this.message = this.$route.query.msg     
    }
  }
  
}
```
### 异步回调中使用this无法指向vue实例
问题描述：事故高发于setTimeout、setInterval、ajax、Promise内的this指针为undifined  
解决方法：定义变量或使用箭头函数
```javascript
 //使用变量访问this实例
let self=this;   
    setTimeout(function () {  
      console.log(self);//使用self变量访问this实例
    },1000);
    
 //箭头函数访问this实例 因为箭头函数本身没有绑定this
 setTimeout(() => { 
   console.log(this);
 }, 500);
```

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

<!-- 点击事件只会触发一次 -->
<div v-on:click.once="doThis">...</div>

<!-- 滚动事件的默认行为 (即滚动行为) 将会立即触发 -->
<!-- 而不会等待 `onScroll` 完成  -->
<!-- 这其中包含 `event.preventDefault()` 的情况 -->
<div v-on:scroll.passive="onScroll">...</div>
```
按键修饰符
.enter
.tab
.delete
.esc
.space
.up
.down
.left
.right
```html
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.enter="submit">
<!-- 只有在 `key` 是 `Enter` 时调用 `vm.submit()` -->
<input v-on:keyup.page-down="onPageDown">
```
#### 表单输入绑定 v-model
1. v-model指令可以在input、textarea以及select元素上创建双向数据绑定。
2. 单个复选框绑定到单个布尔值，多个复选框绑定到同一数组
3. 单选时绑定到一个变量
```javascript
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"  // 若被选中toggle===yes  
  false-value="no"  // 若未被选中toggle===no
>

// v-bind:value="这里可以是个对象"
<input type="radio" v-model="pick" v-bind:value="a">  // 选中时vm.pick===vm.a

// 一些简单
<select v-model="selected"> // v-model绑定选项的value值
  <option v-for="option in options" v-bind:value="option.value">
    {{ option.text }}
  </option>
</select>
<span>Selected: {{ selected }}</span>

// 当选中时，`picked` 为字符串 "a"
<input type="radio" v-model="picked" value="a">

// `toggle` 为 true 或 false
<input type="checkbox" v-model="toggle">

// 当选中第一个选项时，`selected` 为字符串 "abc"
<select v-model="selected">
  <option value="abc">ABC</option>
</select>
```
修饰符
```html
<!-- 在“change”时而非“input”时更新 -->
<input v-model.lazy="msg" >
<input v-model.number="age" type="number"> // .number限制使用数字
<input v-model.trim="msg">  // 去空格

```

### 组件注册

#### 全局注册
使用Vue.component进行全局注册，任何new Vue的vue根实例都可以使用。  
```javascript
Vue.component('component-a', { /* ... */ })
Vue.component('component-b', { /* ... */ })
Vue.component('component-c', { /* ... */ })
```
这样注册之后这三个组件在各自组件内部也可以调用

#### 局部注册
在父组件的script中使用import...from...语句引入，并在export default中的components中注册该组件
```javascript
<script>
    import 组件名 from "组件路径";
    // 或
    var 组件名 = { 组件属性 }

    export default {
        components: {
            组件名,
            组件别名:组件名 // 之后就可以用<组件别名></组件别名>来使用组件了
        }
    }
</script>
// 实例
import Component A from './ComponentA'
var ComponentB = {  }

var ComponentC = {
  components: {
    'component-a': ComponentA,
    'component-b': ComponentB,
  },
}
```
局部注册的组件在父模板中其它组件中不可用，可以通过其他组件的components属性中注册该组件

### 核心概念
1. 分为属性、事件和插槽  
2. Vue是单向数据流，不是双向绑定，而双向绑定是语法糖，Vue使用Object.defineProperty做响应式更新
3. 组件命名使用kebab-case命名法，即my-component-name形式

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

// v-bind使用太多也不好，直接传进去post更直接
<blog-post
  v-for="post in posts"
  v-bind:key="post.id"
  v-bind:post="post"
></blog-post>
```
在父模板中通过vue自带component元素并绑定一个is特性即可实现动态组件切换，下面是三个组件切换的实例
```javascript
<button
  v-for="tab in tabs"
  v-bind:key="tab"
  v-bind:class="['tab-button', { active: currentTab === tab }]"
  v-on:click="currentTab = tab"
>{{ tab }}</button>

<component
  v-bind:is="currentTabComponent"
  class="tab"
></component>

Vue.component('tab-home', { template: '<div>Home component</div>' })
Vue.component('tab-posts', { template: '<div>Posts component</div>' })
Vue.component('tab-archive', { template: '<div>Archive component</div>' })

new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Home',
    tabs: ['Home', 'Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
```
prop在组件声明与模板中使用camelCase，由于DOM对大小写不敏感所以在调用组件时添加的传参属性中使用kebab-case
```javascript
Vue.component('blog-post', {
  // 在 JavaScript 中是 camelCase 的
  props: ['postTitle'],
  template: '<h3>{{ postTitle }}</h3>'
})
<blog-post post-title="hello!"></blog-post>
```
prop可以绑定动态的值也可以绑定静态的值，但是都需要通过v-bind来进行
```javascript
<blog-post v-bind:likes="42"></blog-post>
<blog-post v-bind:is-published="post.isPublished"></blog-post>
```
prop验证可以使用带需求验证需求的对象来为每个值进行检查
```javascript
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    },
    author: Person  // 如果限定一个构造函数则检查传进来的对象是否是由该构造函数实例化生成的
  }
})

// Person的构造函数
function Person (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
}
```
如果是未在子组件中定义的prop，而在父模板调用组件时又定义了，则该属性将会被挂载到子组件根元素的属性上  
  
挂载时被父模板与子组件定义的大多数属性将会由父模板覆盖掉，而class和style将会智能的合并起来。    
  
为子组件属性内添加inheritAttrs:false即可防止属性被自动挂载到根节点上，但是子组件依然可以使用$attrs属性（一个包含父组件传递到子组件所有特姓名和特性值的一个对象）来调用这些没有挂载到根节点上的元素
```javascript
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```
#### 事件

* 普通事件：
@click，@input，@change，@xxx等事件，通过this.$emit('xxx',...)触发  

* 修饰符事件：
@input.trim，@click.stop，@submit.prevent等，一般用于原生HTML元素，自定义组件需要自行开发支持  

子组件抛出事件或值给父组件
```javascript
// 抛出事件
// 父模板中
<blog-post
  v-on:enlarge-text="postFontSize += 0.1"   // 响应子组件中发出的事件
></blog-post>

// 子组件中
<button v-on:click="$emit('enlarge-text')"> // 触发一个事件
  Enlarge text
</button>

// 抛出值
// 父模板中
<blog-post
  v-on:enlarge-text="postFontSize += $event"
></blog-post>
// 子组件中
<button v-on:click="$emit('enlarge-text', 0.1)">  // 绑定一个值
  Enlarge text
</button>

// 如果父模板中使用了一个事件处理方法
<blog-post
  v-on:enlarge-text="onEnlargeText"
></blog-post>

methods: {
  onEnlargeText: function (enlargeAmount) { // 子组件中发出的值将会以第一参数的形式传入
    this.postFontSize += enlargeAmount
  }
}
```
使用v-model来实现父子组件事件传递的双向绑定，下面的代码展示子组件input输入内容与父组件中serarchText数据进行绑定
```javascript
// 父组件中
<custom-input v-model="searchText">
// 与下方这个表达方式相等
<custom-input
  v-bind:value="searchText"
  v-on:input="searchText = $event"
></custom-input>

// 子组件中
<input
  v-bind:value="value"
  v-on:input="$emit('input', $event.target.value)"
>
// value特性必须绑定到叫value的prop上
// input事件被触发时将新的值通过自定义的input事件抛出

```
但是单选框复选框会将value属性占用，可以在定义组件时设置model选项
```javascript
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
    `
})
<base-checkbox v-model="lovingVue"></base-checkbox>
```
这里的 lovingVue 的值将会传入这个名为 checked 的 prop。同时当base-checkbox触发一个 change 事件并附带一个新的值的时候，这个lovingVue的属性将会被更新。但是依然需要在子组件的props选项中声明checked这个prop
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
不同于组件和 prop，事件名不存在任何自动化的大小写或camelCase与kabab-case转换。而是触发的事件名需要完全匹配监听这个事件所用的名称。事件要都命名为kabab-case
```javascript
this.$emit('myEvent')
// 下面这个监听卵用没有，但dom上必须使用全小写
<my-component v-on:my-event="doSomething"></my-component>
// 所以事件要都使用kabab-case来命名
this.$emit('my-event')
```

#### 插槽

1. 在父组件的元素间插入任何html包括组件，子组件中使用插槽slot将父组件中定义的内容传递过来。
2. 在子组件中使用多个slot时，在父组件中使用v-slot:slot名称，在子组件中在name属性。
3. 子组件slot元素中可以放一些东西作为默认渲染。
```html
<!-- 父组件中 -->
<template v-slot:slotname>在子组件中使用slot插入的内容</template>
<!-- 子组件中 -->
<div><slot name="slotname">默认展示的东西</slot></div>
```
4. 父模板的所有内容都是在父作用域中编译的，子模版中所有内容都是在子作用域中编译的。
5. 在父模板中的组件上使用v-slot:slotname="子组件中属性名的根节点名"，在子组件中使用v-bind:绑定属性名:"子组件中属性名"来将子组件作用域中属性传递上去
```javascript
// 子组件中
<span>
  <slot v-bind:user="user">
    {{ user.lastName }}
  </slot>
</span>
// 父模板中
<current-user>
  <template v-slot:default="slotProps">
    {{ slotProps.user.firstName }}
  </template>
</current-user>
// 因为只有一个默认插槽，也可以这样写，如有多个插槽就使用template定义
<current-user v-slot:default="slotProps">
  {{ slotProps.user.firstName }}
</current-user>
```
v-slot的值可以是任何作为函数参数的js表达式，所以可以重命名、提供默认值等形式
```javascript
<current-user v-slot="{ user }">
  {{ user.firstName }}
</current-user>
<current-user v-slot="{ user: person }">  // 重命名
  {{ person.firstName }}
</current-user>
<current-user v-slot="{ user = { firstName: 'Guest' } }"> // 提供默认值
  {{ user.firstName }}
</current-user>
```
* 普通插槽：
<template v-slot:slotname="xxx">...</template>，为2.6新语法

* 作用域插槽：
<template slot="xxx" slot-scope="props">...</template>或<template v-slot:slotname="props">...</template>，props为子组件传递的参数对象的父对象

```javascript
// 父组件
<h2>新语法</h2>
<SlotDemo>
    <p>default slot</p>
    <template v-slot:title> // 使用名称对应子组件的插槽
        <p>title slot1</p>
        <p>title slot2</p>
    </template>
    <p>字符</p>  // 未使用带有v-slot属性的template元素包裹的元素将被视为默认插槽的内容即v-slot:default
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
        <slot name="item" v-bind="{ value: 'vue' }" /> // 使用v-bind从父组件
        <slot name="aslot">这是插槽</slot>  // 插槽中间的内容将会作为默认值
    </div>
</template>

<script>
export default {
    name: "SlotDemo"
};
</script>
```
插槽名可以是动态的
```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```
插槽v-slot:可以简写为#
```javascript
<template #header>
  <h1>Here might be a page title</h1>
</template>
<template #header="{ bla }"> // #="{bla}"是无效的，是默认就必须用default
  <h1>{{bla.name}}</h1>
</template>
```

#### 动态、异步组件
在一个位置切换多个组件
```html
<component v-bind:is="currentTabComponent"></component>
```
例如
```javascript
<div id="dynamic-component-demo">
  <button
    v-for="tab in tabs"
    v-bind:key="tab"
    v-bind:class="['tab-button', { active: currentTab === tab }]"
    v-on:click="currentTab = tab"
  >{{ tab }}</button>

  <keep-alive>  // 如果不加keep-alive，vue会销毁旧组件，即不保持旧组件状态
    // 切换组件
    <component v-bind:is="currentTabComponent" class="tab"></component>
  </keep-alive>
</div>

Vue.component('tab-posts', { // 组件1
  data: function () {
  	return {
      posts: [{ id: 1, title: 'Cat Ipsum',content: '<p></p>'},
        { id: 2, title: 'Hipster Ipsum',content: '<p></p>'},
        { id: 3, title: 'Cupcake Ipsum',content: '<p></p>'}],
      selectedPost: null
    }
  },
  // 这是一个带侧栏的多页切换的实例
	template: `
  	<div class="posts-tab">
      <ul class="posts-sidebar">
        <li v-for="post in posts" v-bind:key="post.id" 
          v-bind:class="{ selected: post === selectedPost }"
					v-on:click="selectedPost = post">
          {{ post.title }}
        </li>
      </ul>
      <div class="selected-post-container">
      	<div v-if="selectedPost" class="selected-post">
          <h3>{{ selectedPost.title }}</h3>
          <div v-html="selectedPost.content"></div>
        </div>
        <strong v-else>
          Click on a blog title to the left to view it.
        </strong>
      </div>
    </div>
  `
})

Vue.component('tab-archive', {  // 组件2
	template: '<div>Archive component</div>'  // 组件内容
})

new Vue({
  el: '#dynamic-component-demo',
  data: {
    currentTab: 'Posts',
    tabs: ['Posts', 'Archive']
  },
  computed: {
    currentTabComponent: function () {
      return 'tab-' + this.currentTab.toLowerCase()
    }
  }
})
```

#### 访问元素和组件
此节为了父子组件之间数据流通，建议使用Vuex进行管理  
在Vue组件中，根实例可以通过$root属性进行访问，所有属性data、计算属性computed、方法methods均挂载到根实例上。但尽量使用Vuex来管理应用状态。  
在子组件中可以使用$parent来访问父组件的实例。  
在父组件中也可以使用$refs访问子组件实例，但不是响应式的，可以通过调用methods里的方法来一次性获取。  
```javascript
// 父组件中
<base-input ref="usernameInput"></base-input>
this.$refs.usernameInput
// 例如可以通过父模板的方法来聚焦到子组件的输入框
methods: {
  focus: function () {
    this.$refs.usernameInput.focus()
  }
}
```
如果子组件想要访问父组件的数据或方法，而此时又有多层嵌套或不想让子组件使用$parent属性从而暴露整个父模板，就可以在父组件内定义provide属性并返回想要子组件访问的值，并在子组件中使用inject来获取这个值或方法。
```javascript
// 父组件中
provide: function () {
  return {
    getMap: this.getMap
  }
}
// 子组件中
inject: ['getMap']
```
#### 循环引用
你想搞一个文件目录树，使用tree-folder组件来展示一个文件夹，使用tree-folder-contents来展示多个tree-folder，tree-folder下又有tree-folder-contents，这时如果用了Vue.component全局注册则没有问题，但是如果使用webpack则会报错。所以我们要设定一个解析起点（tree-folder），等到生命周期钩子beforeCreate时注册组件而不是模块系统反复解析时。
```javascript
beforeCreate: function () {
  this.$options.components.TreeFolderContents = require('./tree-folder-contents.vue').default
}

// 或使用webpack在注册组件时异步import
components: {
  TreeFolderContents: () => import('./tree-folder-contents.vue')
}
```

### 过渡与动画

#### 单元素/组件过渡
Vue提供transition组件给任何元素和组件添加进入和离开过渡。
```javascript
<div id="demo">
  <button v-on:click="show = !show">
    Toggle
  </button>
  <transition name="fade">  // 包裹transition的元素将过渡，并定制了过渡时间与动画效果
    <p v-if="show">hello</p>
  </transition>
</div>

new Vue({
  el: '#demo',
  data: {
    show: true
  }
})

// 这里css样式命名格式为“[transitionName-class切换步骤]”
.fade-enter-active, .fade-leave-active {  // 覆写name为enter的transition的enter-active和leave-active状态
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
```
过渡中有6个class切换：
1. v-enter 过渡开始，在元素插入前临时插入，插入后一帧移除
2. **v-enter-active** 元素进入过渡生效状态，整个进入过渡中有效，可以用来定义过渡时间、延迟、曲线
3. v-enter-to 定义进入过渡的结束状态
4. v-leave 定义离开过渡的开始状态
5. **v-leave-active** 元素离开过渡生效状态，整个离开过渡中有效，可以用来定义过渡时间、延迟、曲线
6. v-leave-to 定义离开过渡的结束状态，在离开过渡被触发之后下一帧生效，完成后删除

```javascript
<div>
  <button @click="show = !show">Toggle show</button>
  <transition name="bounce">
    <p v-if="show">Lorem ipsum dolor sit</p>
  </transition>
</div>

.bounce-enter-active {  // 定义enter-active状态下的效果
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
```
在transition元素上可以使用enter-class、enter-active-class、enter-to-class、leave-class、leave-active-class、leave-to-class来为各个状态指定自定义的过渡类名，方便结合CSS动画库。
```html
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet" type="text/css">
<div id="example-3">
  <button @click="show = !show">Toggle render</button>
  <transition
    name="custom-classes-transition"
    enter-active-class="animated tada"
    leave-active-class="animated bounceOutRight"
  >
    <p v-if="show">hello</p>
  </transition>
</div>
```
可以直接在属性上定制过渡持续时间
```html
<transition :duration="1000">...</transition>
<transition :duration="{ enter: 500, leave: 800 }">...</transition>
```
JavaScript钩子，这里直接使用使用Velocity.js的例子展示，注意enter和leave函数中必须使用done进行回调。
```javascript
<div>
  <button @click="show = !show">
    Toggle
  </button>
  <transition
    v-on:before-enter="beforeEnter" // 使用before-enter钩子调用method：beforeEnter
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false"
  >
    <p v-if="show">
      Demo
    </p>
  </transition>
</div>

new Vue({
  el: '',
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transformOrigin = 'left'
    },
    enter: function (el, done) {  // 在enter和leave函数中必须调用done函数，否则会被同步调用即会立即结束
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
})
```
初始渲染的过渡，即页面一刷新立刻执行的过渡，不需要toggle的那种
```html
<!-- 使用appear标记，可以自定义css类名与定义js钩子 -->
<transition
  appear

  appear-class="custom-appear-class"
  appear-to-class="custom-appear-to-class"
  appear-active-class="custom-appear-active-class"

  v-on:before-appear="customBeforeAppearHook"
  v-on:appear="customAppearHook"
  v-on:after-appear="customAfterAppearHook"
  v-on:appear-cancelled="customAppearCancelledHook"
>
  <!-- ... -->
</transition>
```

#### 多元素过渡
原生元素使用v-if/v-else可以进行过渡，需要注意的一点是，如果有多个相同标签的元素，一定要为每个元素绑定一个key。
```html
<transition>
  <table v-if="items.length > 0">
    <!-- ... -->
  </table>
  <p v-else>Sorry, no items found.</p>
</transition>

<!-- 多个相同标签元素时绑定一个key -->
<transition>
  <button v-if="isEditing" key="save">
    Save
  </button>
  <button v-else key="edit">
    Edit
  </button>
</transition>

<!-- 可以通过为同一元素的key设置不同状态来替代v-if和v-else -->
<transition>
  <button v-bind:key="isEditing">
    {{ isEditing ? 'Save' : 'Edit' }}
  </button>
</transition>
```
如果使用多个v-if对于多个相同标签元素进行切换，可以覆写成使用动态绑定key的形式切换。
```javascript
<transition>
  <button v-if="docState === 'saved'" key="saved">Edit</button>
  <button v-if="docState === 'edited'" key="edited">Save</button>
  <button v-if="docState === 'editing'" key="editing">Cancel</button>
</transition>
// 可以重写为
<transition>
  <button v-bind:key="docState">
    {{ buttonMessage }}
  </button>
</transition>

computed: {
  buttonMessage: function () {
    switch (this.docState) {
      case 'saved': return 'Edit'
      case 'edited': return 'Save'
      case 'editing': return 'Cancel'
    }
  }
}
```
上述情况可能导致前一个元素未fadeout，后一个元素就已经fadein了。Vue为此提供了过渡模式，可以定义前后两个元素出现以及消失的配合问题。
* in-out ：新元素先行过渡，完成后当前元素过渡离开
* out-in ：当前元素先行过渡，完成后新元素过渡进入
```javascript
<transition name="fade" mode="out-in">
  <!-- ...需要过渡的元素... -->
</transition>
```
当多个组件之间进行过渡的时候，使用动态组件特性，即v-bind:is。
```javascript
<transition name="component-fade" mode="out-in">  // 这会在两个组件之间切换
  <component v-bind:is="view"></component>
</transition>

new Vue({
  el: '#transition-components-demo',
  data: {
    view: 'a'
  },
  components: {
    'a': {
      template: '<div>Component A</div>'
    },
    'b': {
      template: '<div>Component B</div>'
    }
  }
})

.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
```
列表过渡使用transition-group组件，包裹v-for的列表，transition-group会以一个span的形式出现在html里。  
使用v-move特性，即在css中为name-move添加过渡效果防止元素插入时其他元素生硬空出该位置。
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.14.1/lodash.min.js"></script>

<div id="list-complete-demo" class="demo">
  <button v-on:click="shuffle">Shuffle</button>
  <button v-on:click="add">Add</button>
  <button v-on:click="remove">Remove</button>
  <transition-group name="list-complete" tag="p" mode="out-in"> 
    <span
      v-for="item in items"
      v-bind:key="item"
      class="list-complete-item"
    >
      {{ item }}
    </span>
  </transition-group>
</div>

new Vue({
  el: '#list-complete-demo',
  data: {
    items: [1,2,3,4,5,6,7,8,9],
    nextNum: 10
  },
  methods: {
    randomIndex: function () {
      return Math.floor(Math.random() * this.items.length)
    },
    add: function () {
      this.items.splice(this.randomIndex(), 0, this.nextNum++)
    },
    remove: function () {
      this.items.splice(this.randomIndex(), 1)
    },
    shuffle: function () {
      this.items = _.shuffle(this.items)
    }
  }
})

.list-complete-item {
  transition: all 1s;
  display: inline-block;
  margin-right: 10px;
}
.list-complete-enter, .list-complete-leave-to
/* .list-complete-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
// 让旧元素在leave的时候脱离文档流
.list-complete-leave-active {
  position: absolute;
}
// 定义v-move过渡平滑时间
.flip-list-move {
	transition: all 1s;
}
```
列表使用v-for去遍历一个动态更新的数组即可实现列表的交错过渡。这里使用js动画库velocity来做实例。
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

<div id="staggered-list-demo">
  <input v-model="query">
  <transition-group
    name="staggered-fade"
    tag="ul"
    v-bind:css="false"  // 让其他css效果失效
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
  >
    <li
      v-for="(item, index) in computedList" // 使用动态更新的列表
      v-bind:key="item.msg"
      v-bind:data-index="index"
    >{{ item.msg }}</li>
  </transition-group>
</div>

new Vue({
  el: '#staggered-list-demo',
  data: {
    query: '',
    list: [
      { msg: 'Bruce Lee' },
      { msg: 'Jackie Chan' },
      { msg: 'Chuck Norris' },
      { msg: 'Jet Li' },
      { msg: 'Kung Fury' }
    ]
  },
  computed: {
    computedList: function () {
      var vm = this
      return this.list.filter(function (item) {
        return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
      })
    }
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.height = 0
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 1, height: '1.6em' },
          { complete: done }
        )
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 150
      setTimeout(function () {
        Velocity(
          el,
          { opacity: 0, height: 0 },
          { complete: done }
        )
      }, delay)
    }
  }
})
```
所有过渡特性都可以被动态绑定，即可以动态改变动画效果。[动态绑定过渡/动画效果](https://cn.vuejs.org/v2/guide/transitions.html#%E5%8A%A8%E6%80%81%E8%BF%87%E6%B8%A1)
#### 元素内部过渡/状态过渡
对于元素内部：数字和运算结果、颜色显示、svg显示、元素的大小等过渡，这些过渡都依赖数值，使用这些数值结合Vue响应式系统就可以实现元素内部的过渡。
[下例的演示](https://cn.vuejs.org/v2/guide/transitioning-state.html#%E7%8A%B6%E6%80%81%E5%8A%A8%E7%94%BB%E4%B8%8E%E4%BE%A6%E5%90%AC%E5%99%A8)
```javascript
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>

<div id="animated-number-demo">
  <input v-model.number="number" type="number" step="20">
  <p>{{ animatedNumber }}</p> // input的数值会被计算属性++或--实现数值的动画过渡
</div>

new Vue({
  el: '#animated-number-demo',
  data: {
    number: 0,
    tweenedNumber: 0
  },
  computed: {
    animatedNumber: function() {
      return this.tweenedNumber.toFixed(0);
    }
  },
  watch: {
    number: function(newValue) {
      TweenLite.to(this.$data, 0.5, { tweenedNumber: newValue });
    }
  }
})
```
[颜色过渡的演示](https://cn.vuejs.org/v2/guide/transitioning-state.html#%E7%8A%B6%E6%80%81%E5%8A%A8%E7%94%BB%E4%B8%8E%E4%BE%A6%E5%90%AC%E5%99%A8)
```javascript
<script src="https://cdn.jsdelivr.net/npm/tween.js@16.3.4"></script>
<script src="https://cdn.jsdelivr.net/npm/color-js@1.0.3"></script>

<div id="example-7">
  <input
    v-model="colorQuery"
    v-on:keyup.enter="updateColor"
    placeholder="Enter a color"
  >
  <button v-on:click="updateColor">Update</button>
  <p>Preview:</p>
  <span
    v-bind:style="{ backgroundColor: tweenedCSSColor }"
    class="example-7-color-preview"
  ></span>
  <p>{{ tweenedCSSColor }}</p>
</div>

var Color = net.brehaut.Color
new Vue({
  el: '#example-7',
  data: {
    colorQuery: '',
    color: {
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1
    },
    tweenedColor: {}
  },
  created: function () {
    this.tweenedColor = Object.assign({}, this.color)
  },
  watch: {
    color: function () {
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }

      new TWEEN.Tween(this.tweenedColor)
        .to(this.color, 750)
        .start()

      animate()
    }
  },
  computed: {
    tweenedCSSColor: function () {
      return new Color({
        red: this.tweenedColor.red,
        green: this.tweenedColor.green,
        blue: this.tweenedColor.blue,
        alpha: this.tweenedColor.alpha
      }).toCSS()
    }
  },
  methods: {
    updateColor: function () {
      this.color = new Color(this.colorQuery).toRGB()
      this.colorQuery = ''
    }
  }
})
```
把动画放入组件中以减少复杂性，参考[把过渡放到组件里](https://cn.vuejs.org/v2/guide/transitioning-state.html#%E6%8A%8A%E8%BF%87%E6%B8%A1%E6%94%BE%E5%88%B0%E7%BB%84%E4%BB%B6%E9%87%8C)

### 组件可复用性

#### 混入Mixin
混入可以把一个组件内的元素添加到其他组件里面。
```javascript
// 定义一个混入对象
var mixin = {
  data: function () {
    return {
      message: 'hello',
      foo: 'abc'
    }
  }
}

new Vue({
  mixins: [mixin],  // 使用mixin来混入
  data: function () {
    return {
      message: 'goodbye',
      bar: 'def'
    }
  },
  created: function () {
    console.log(this.$data)
    // => { message: "goodbye", foo: "abc", bar: "def" }
  }
})
```
#### 自定义指令
自定义一个v-focus指令来实现自动聚焦
```javascript
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 指定动作时间以及动作，这里为当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
// 组件需要接受focus指令
directives: {
  focus: {
    // 指令的定义
    inserted: function (el) {
      el.focus()
    }
  }
}

<input v-focus>
```
钩子函数
* bind: 指令第一次绑定到元素时调用，可做初始化，只调用一次
* inserted: 被绑定的元素插入到DOM的父节点时调用
* update: 所在组件的VNode更新时调用
* componentUpdated: 指令所在组建的VNode以及子VNode全部更新后调用
* unbind: 指令与元素解绑时使用，只调用一次
钩子函数的参数
* el: 指令所绑定的元素，可以操作DOM
* binding: 一个具有自定义指令只读属性的对象
* vnode: vue生成的虚拟节点只读
* oldVnode: 上一个虚拟节点只读
```javascript
// 一个自定义指令所可以访问属性集合的示例
<div id="hook-arguments-example" v-demo:foo.a.b="message"></div>
<div id="hook-arguments-example" v-demo:[arguement].a.b="message"></div>  // 指令参数也是动态的
Vue.directive('demo', {
  bind: function (el, binding, vnode) {
    var s = JSON.stringify
    el.innerHTML =
      'name: '       + s(binding.name) + '<br>' + // 指令名称不包含v-
      'value: '      + s(binding.value) + '<br>' +  // 绑定的数据，等号后的js的结果
      'expression: ' + s(binding.expression) + '<br>' + // 绑定的表达式，等号后的js
      'argument: '   + s(binding.arg) + '<br>' +  // 指令:后的词
      'modifiers: '  + s(binding.modifiers) + '<br>' +  // 返回一个foo.a.b中ab是否存在的对象
      'vnode keys: ' + Object.keys(vnode).join(', ')
  }
})

new Vue({
  el: '#hook-arguments-example',
  data: {
    message: 'hello!'
  }
})

// 输出结果

```

### 插件

#### 使用插件

使用全局方法Vue.use()使用插件，但是要在调用new Vue()之前完成。

#### 开发插件

Vue.js插件应该暴露一个install方法，这个方法的第一个参数是Vue构造器，第二个参数是一个可选的选项对象。
```javascript
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }
  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })
  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })
  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

### 过滤器 Filter

过滤器用于常见的文本格式化，可以用在Mustache语法与v-bind上，添加在javascript语法尾部
```javascript
<!-- 在双花括号中 -->
{{ message | capitalize }}

<!-- 在 `v-bind` 中 -->
<div v-bind:id="rawId | formatId"></div>

filters: {
  capitalize: function (value) {  // 第一个参数就是message的信息
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
}

// 或者在Vue实例之前定义全局过滤器
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

new Vue({
  // ...
})
```
过滤器可以被串联，参数的值会先被传到filterA中，filterA中的结果会被传入到filterB中并最终输出。  
过滤器是javascript函数所以也可以定义参数，message的值不用显式的传入也会作为第一个参数传递进去。
```javascript
{{ message | filterA | filterB }}

{{ message | filterA('arg1', arg2) }} // 'arg1'为第二个参数，arg2为第三个参数
```

## Vue路由

### 基础
#### 路由对象
路由对象是Vue路由成功导航后创建的不可变的路由状态信息对象，包含了当前URL解析得到的信息，以及URL匹配到的路由记录，可由this.&route访问。  
路由对象属性
* $route.path 对应当前路由的绝对路径
* $route.params 路由路径参数的key/value对象，对于模式为/user/:username，该对象为{ username: 'username' }，$route.params.username === 'username'
* $route.query URL路径参数的key/value对象，例如/user?page=1，该对象为{ page : 1 }，$route.query.page === 1
* $route.hash 当前路由的string类型hash值
* $route.fullPath 解析完成后的URL带查询参数和哈希
* $route.matched 当前路由所有嵌套路径片段的记录，一个数组，包含children数组
* $route.name 当前路由的名称
* $route.redirectedFrom 如果有重定向则为来源路由名称

#### 引入路由
```html
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航.通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <router-view></router-view> <!-- 路由出口，路由匹配到的组件将渲染在这里 -->
</div>
```
```javascript
// 0. 如果使用模块化机制编程，导入Vue和VueRouter，要调用 Vue.use(VueRouter)

// 1. 定义 (路由) 组件。可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。我们晚点再讨论嵌套路由。
const routes = [
  { path: '/foo', component: Foo , name : 'foo'}, // 使用name为路由起名字
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置，你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

// 4. 创建和挂载根实例。记得要通过 router 配置参数注入路由，从而让整个应用都有路由功能
const app = new Vue({
  router
}).$mount('#app')
```
经过这四步，就可以在组件中通过this.$router访问路由器或使用this.$route访问当前路由了。
```javascript
export default {
  computed: {
    username () {
      return this.$route.params.username
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
```

#### 参数路由匹配

如果希望在跳转路由时匹配一个路径模式可使用冒号标记
```javascript
const User = {
  // 通过$route访问当前路由，通过params.id访问参数
  template: '<div>User {{ $route.params.id }}</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }  // 所有/user/blabla的路径都会被匹配到该路由上
  ]
})

```
> 模式：/user/:username/post/:post_id  
> 示例路径：/user/evan/post/123  
> $route.params：{ username: 'evan', post_id: '123' }  

如果从/user/foo导航到/user/bar，组件会被复用，但是组件生命钩子也不会被调用。但是可以去watch '$route'对象。
```javascript
const User = {
  template: '...',
  watch: {
    '$route' (to, from) {
      // 对路由变化作出响应...
    }
  }
}
```
或者使用beforeRouteUpdate导航守卫
```javascript
const User = {
  template: '...',
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
  }
}
```
将路由匹配的path定义为'\*'则会捕捉任意路径，如果使用'/user-*'则会匹配所有user-开头的路径，但是一定保证\*处在路由的最后方，否则就会全局捕获。可以使用这个特性来捕获404 Not Found路由。
```javascript
{
  // 会匹配所有路径，一定要放在路由最后
  path: '*'
}
{
  // 会匹配以 `/user-` 开头的任意路径
  path: '/user-*'
}
```
在使用通配符时会在$route.params里添加一个pathMatch属性，这个属性的值为被通配符匹配的部分
```javascript
this.$router.push('/user-admin')
this.$route.params.pathMatch // 'admin'
```
#### 嵌套路由
使用嵌套路由可以在路由转向的页面中继续定义路由
```javascript
<div id="app">
  <router-view></router-view>
</div>

const User = {
  template: `
    <div class="user">
      <h2>User {{ $route.params.id }}</h2>
      <router-view></router-view>
    </div>
  `
}

const router = new VueRouter({
  routes: [
    { path: '/user/:id',  // 跳转/user/:id依然会来到这一页
      component: User,
      children: [
        {
          // 但当 /user/:id/profile 匹配成功，UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功 UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

#### 编程式导航

可以使用**router.push(location, onComplete?, onAbort?)**方法，与使用router-link创建a标签来实现导航，来将页面重定向至指定url。
> 声明式导航：<router-link :to"url">
> 编程式导航：router.push()
可以为push方法提供url字符串、带path的对象、带路由名字name与params对象的对象，或使用path配合query对象
```javascript
// 字符串
router.push('home') // 导航到/home

// 对象
router.push({ path: 'home' }) // 导航到/home

// 命名的路由
router.push({ name: 'user', params: { userId: '123' }}) // 导航到/user/:userId，userId值为123

// 带查询参数，变成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```
如果提供了path则params不会生效，以上规则均同样可以使用在router-link组件的to属性上
```javascript
const userId = '123'
router.push({ name: 'user', params: { userId }}) // -> /user/123 可以使用这个方法插入变量
router.push({ path: `/user/${userId}` }) // -> /user/123 可以使用这个方法来插入变量
// 这里的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user
```
push的第二第三个参数则可定义当导航结束或失败所执行的函数，如果路径相同只有参数发生变化则使用beforeRouteUpdate来响应这个变化。  
使用**router.replace(location, onComplete?, onAbort?)**可以实现不向history添加记录替换掉当前记录的跳转。
> 声明式：<router-link :to="..." replace>
> 编程式：router.replace(...)

使用**router.go(integer)**可以在history记录中退后整数步，类似于window.history.go(n)
```javascript
// 在浏览器记录中前进一步，等同于 history.forward()
router.go(1)
// 后退一步记录，等同于 history.back()
router.go(-1)
// 前进 3 步记录
router.go(3)
// 如果 history 记录不够用，那就默默地失败呗
router.go(-100)
router.go(100)
```
#### 命名视图
如果想要加多个同级路由元素就需要给视图命名了，默认名字为default
```javascript
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>

const router = new VueRouter({
  routes: [
    {
      path: '/view1',
      components: {
        default: Foo, // 多个component对应多个视图
        a: Bar,
        b: Baz
      }
    },{
      path: '/view2',
      // ....
    }
  ]
})
```
一个拥有两层嵌套的router实例
```javascript
<script src="https://unpkg.com/vue/dist/vue.js"></script>
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>

<div id="app">
  <h1>Nested Named Views</h1>
  <router-view></router-view>
</div>

const UserSettingsNav = {
	template: `
<div class="us__nav">
  <router-link to="/settings/emails">emails</router-link>
  <br>
  <router-link to="/settings/profile">profile</router-link>
</div>
`
}
const UserSettings = {
	template: `
<div class="us">
  <h2>User Settings</h2>
  <UserSettingsNav/>
  <router-view class ="us__content"/>
  <router-view name="helper" class="us__content us__content--helper"/>
</div>
  `,
  components: { UserSettingsNav }
}

const UserEmailsSubscriptions = {
	template: `
<div>
	<h3>Email Subscriptions</h3>
</div>
  `
}

const UserProfile = {
	template: `
<div>
	<h3>Edit your profile</h3>
</div>
  `
}

const UserProfilePreview = {
	template: `
<div>
	<h3>Preview of your profile</h3>
</div>
  `
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/settings',  // 顶层路由
      component: UserSettings,
      children: [{    // 子路由视图
      	path: 'emails', // 这里push路径为/settings/emails
        component: UserEmailsSubscriptions
      }, {
      	path: 'profile',
        components: {
        	default: UserProfile, // 为多个路由视图不同名字分配不同components
          helper: UserProfilePreview
        }
      }]
    }
  ]
})

router.push('/settings/emails')

new Vue({
	router,
  el: '#app'
})
```
#### 重定向和别名
使用重定向在访问/a时重定向URL到/b
```javascript
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' },
    { path: '/a', redirect: { name: 'foo' }},
    { path: '/a', redirect: to => {
      // 方法接收目标路由作为参数 return 重定向的字符串路径/路径对象
    }}
  ]
})
```
别名可以将任意UI结构映射到任意URL，比如你希望指定从主页跳转到用户界面，并把用户界面的router view渲染成指定组件，则使用别名方式实现，不用局限于使用/userpanel/:id/childrenRouterName的形式了。
```javascript
const router = new VueRouter({
  routes: [
    { path: '/a', component: { default: baz, sidebar: bar}, alias: '/b' } // 直接导航至某一特定的视图组合上
  ]
})
```
使用prop传参取代$route，从而防止路由只能使用路由在特定url下访问
```javascript
const User = {
  props: ['id'],  // 不使用this.$router.params.id而是使用传参的形式
  template: '<div>User {{ id }}</div>'
}
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },  // props标记为true

    // 对于包含命名视图的路由，你必须分别为每个命名视图添加 `props` 选项：
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }  // 多个组件则分别添加props选项
    }
  ]
})
```
若props设置为true，route.params将会被设置为组件属性，使用props接受父组件传参

#### 导航守卫
导航守卫可以在跳转时检查跳转条件，可以做登录拦截等操作。可以使用router.beforeEach来注册一个全局守卫  
* to 即将要进入的路由对象
* from 当前导航正在离开的路由
* next 最后处理守卫的函数，在函数内直接调用next()则执行管道中下一个钩子即继续，next(false)为终端导航，next('path')跳转到一个不同的路径，next(error)导航会被终止且该错误传递给router.onError()的回调
```javascript
const router = new VueRouter({ ... }) // 或
import router from './router';

router.beforeEach((to, from, next) => {
  if (to.meta.isLogined) {  // 使用to.meta解析路由的meta元信息字段判断是否需要登录判断
    if(store.getters.getLogined) {
      next()
    } else {
      alert("请先进行登陆操作");
      next('/');
    }
  } else {
    next()
  }
})
```
离开守卫则通常可用于在用户为保存前突然离开
```javascript
beforeRouteLeave (to, from , next) {
  const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
  if (answer) {
    next()
  } else {
    next(false)
  }
}
```
完整的导航解析过程
1. 导航被触发。
2. 在失活的组件里调用离开守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。

#### 路由元信息

路由元信息meta用于为每条路由记录添加附带数据，例如是否需要登陆等
```javascript
const router = new VueRouter({
  routes: [{
    path: '/foo',
    component: Foo,
    children: [{
      path: 'bar',
      component: Bar,
      meta: { requiresAuth: true }  // 一个meta元数据
    }]
  }]
})

// 使用$route.matched来检查路由记录中的meta字段，或直接访问to.meta.requiresAuth
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next() // 确保一定要调用 next()
  }
})
```

#### 数据获取
可以导航之前获取或导航之后获取。  
导航完成后通过created钩子中获取数据。
```javascript
<template>
  <div class="post">
    <div class="loading" v-if="loading">Loading...</div>  // 这里可以显示加载动画

    <div v-if="error" class="error">{{ error }}</div> // 这里显示错误信息

    <div v-if="post" class="content"> // 这里显示加载后的
      <h2>{{ post.title }}</h2>
      <p>{{ post.body }}</p>
    </div>
  </div>
</template>

export default {
  data () {
    return {
      loading: false,
      post: null,
      error: null
    }
  },
  created () {
    // 组件创建完后获取数据，此时 data 已经被 observed 了
    this.fetchData()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      this.error = this.post = null
      this.loading = true
      getPost(this.$route.params.id, (err, post) => { // 这是个模仿的api，需要使用第三方插件来获取数据
        this.loading = false
        if (err) {
          this.error = err.toString()
        } else {
          this.post = post
        }
      })
    }
  }
}
```
#### 滚动行为
在创建Router的时候提供一个scrollBehavior方法来控制跳转滚动
```javascript
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
```

### Vuex
Vuex是用来在组件间共享数据的，Vuex的状态数据是响应式的，使用单一状态树，每个应用仅包含一个store实例来实现数据共享。
#### 开始
```javascript
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

store.commit('increment') // 触发状态变更
console.log(store.state.count) // -> 1
```
在Vue实例化时通过store选项将Vuex根组件注册进去，并在组件中在computed中定义一下拿出来用。
```javascript
const app = new Vue({
  el: '#app',
  // 把 store 对象提供给 “store” 选项，这可以把 store 的实例注入所有的子组件
  store,
})

const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count  // 拿到store内的count
    }
  }
}
```
如果一个一个在computed内注册太过繁琐，可以使用mapState函数来帮助生成计算属性。
```javascript
import { mapState } from 'vuex'

export default {
  computed: mapState({
    count: state => state.count,// 箭头函数可使代码更简练
    // 传字符串参数 'count' 等同于 `state => state.count`
    countAlias: 'count',
    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```
Vuex更新内容只能使用mutation函数中执行，所以表单不能直接绑定store内的数据，转而使用侦听input或change事件在回调中调用mutation
```javascript
<input :value="message" @input="updateMessage">
computed: {
  ...mapState({
    message: state => state.obj.message
  })
},
methods: {
  updateMessage (e) {
    this.$store.commit('updateMessage', e.target.value)
  }
}

// mutation中
mutations: {
  updateMessage (state, message) {
    state.obj.message = message
  }
}
```
不过更好的实现是使用computed来双向绑定元素
```javascript
<input v-model="message">
computed: {
  message: {
    get () {
      return this.$store.state.obj.message
    },
    set (value) {
      this.$store.commit('updateMessage', value)
    }
  }
}
```
