## 类的初始化顺序
```java
class Parent {

    public static String p_StaticField = "父类-静态变量";

    public String    p_Field = "父类-变量";
    protected int    i = 9;
    protected int    j = 0;

    static {
        System.out.println( p_StaticField );    // 1. 
        System.out.println( "父类-静态初始化块" );  //2. 
    }

    {
        System.out.println( p_Field );  // 7.
        System.out.println( "父类-初始化块" );  // 8.
    }

    public Parent()
    {
        System.out.println( "父类-构造器" );    // 9.
        System.out.println( "i=" + i + ", j=" + j );    // 10.
        j = 20;
    }
}

public class SubClass extends Parent {

    public static String s_StaticField = "子类-静态变量";

    public String s_Field = "子类-变量";

    static {
        System.out.println( s_StaticField );    // 3.
        System.out.println( "子类-静态初始化块" );  // 4.
    }

    {
        System.out.println( s_Field );  // 11.
        System.out.println( "子类-初始化块" );  // 12.
    }

    public SubClass()
    {
        System.out.println( "子类-构造器" );    // 13.
        System.out.println( "i=" + i + ",j=" + j ); //14.
    }

    public static void main( String[] args )
    {
        System.out.println( "子类main方法" );   // 5.
        new SubClass(); // 6.
    }
}
```
* 静态初始化块位于类的第一次初始化最前端执行，先父类后子类，是类的初始化块。  
* 初始化块位于每次对象被构造器初始化前执行，是对象的初始化块。 
* 类的装载不论是否会被创建对象都会发生，装载会触发静态初始化块执行，扫描到了extends的类先被执行，构造时顺序相同
* 总体顺序：new 子类() -> 父类静态初始化块 -> 子类静态初始化块 -> 子类main方法 -> 父类初始化块 -> 父类构造器 -> 子类初始化块 -> 子类构造器

## 继承关系方法执行顺序以及this作用域
```java
public class ClassInitSequence {

    public static void main(String[] args) {
        System.out.println(new B().getValue());
    }

    static class A {
        protected int value;

        public A(int v) {
            setValue(v);    // 若A的构造函数是子函数调用的则执行函数会先在子类里找同名函数执行
        }

        public void setValue(int value) {
            this.value = value;
        }

        public int getValue() {
            try {
                value++;
                return value;
            } catch (Exception e) {
                System.out.println(e.toString());
            } finally {
                this.setValue(value);       // 若此方法起初为子类调用则this指向子类作用域
                System.out.println(value);
            }
            return value;
        }
    }

    static class B extends A {
        public B() {
            super(5);
            setValue(getValue() - 3);
        }

        public void setValue(int value) {
            super.setValue(2 * value);
        }
    }
}
```
1. 子类方法调用父类方法，若父类方法调用方法，会先检查子类是否有重写的方法，先执行子类的重写方法
2. 子类方法调用父类方法，this指向的作用域依然在子类
3. try、catch、finally块中return后没有报错会继续执行finally块内代码而非直接返回，但此时函数返回值已为return的值
```java
// 结果为
22
34
17
```