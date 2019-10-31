## 基础
Java注解（Annotation）可以被用于
* 编译器配置
* 打包过程配置
* 生成XML配置
* 运行时配置
配合Java反射特性，Java注解可以被程序在运行时被解析。

```java
@Retention(RetentionPolicy.RUNTIME) // 标记注解在运行时通过反射获取
@Target(ElementType.TYPE)   // 该注解只能被用在类和接口上

public @interface MyAnnotation {    // 使用@interface标注这是一个注解的定义
    public String name();   // 注解有两个属性name和value
    public String value();  // 这两个注解可以在使用时被赋值
}
```

