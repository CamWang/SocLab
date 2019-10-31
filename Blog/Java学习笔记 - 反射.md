## 反射
反射可以让你在Java应用运行时检查类、接口、属性、方法，实例化对象、调用方法、设置属性。通过Java反射特性你可以获取到：    
* 类名
* 类的修饰符
* 包信息
* 父类
* 实现的接口
* 构造函数
* 方法
* 属性
* 注解
Java反射还是Spring的核心概念。 

### Java Class类

Class类是所有Java内定义的其他类的超类，可以把任意的类赋给Class类的实例对象上
```java
Class myObjectClass = MyObject.class
```
如果在编译时不知道类名，还可以在运行时动态加载类
```java
Class.forName(com.camwang.MyObject)
```

### 反射的例子

先定义一个User类，内有name和id属性，并有getter、setter、无参/全参构造函数

#### 获取类
如果编译前知道类名则直接获取类即可
```java
Class userClass = User.class;
```
如果运行时获取则使用Class.forName()，参数里填写类的完整名称
```java
Class userClass = Class.forName("com.camwang.javar.entity.User");
```
使用Class类内的反射获取内容
```java
String className = userClass.getName(); // 获取类的完整名称
String classSimpleName = userClass.getSimpleName(); // 获取类的名称
// 获取类的修饰符
int modifiers = userClass.getModifiers();   // 获取修饰符，调用Modifier.isXxx()方法解析修饰符代码

boolean isAbstract = Modifier.isAbstract(modifiers);
boolean isFinal = Modifier.isFinal(modifiers);
boolean isInterface = Modifier.isInterface(modifiers);
boolean isNative = Modifier.isNative(modifiers);
boolean isPrivate = Modifier.isPrivate(modifiers);
boolean isPublic = Modifier.isPublic(modifiers);
boolean isStatic = Modifier.isStatic(modifiers);
boolean isStrict = Modifier.isStrict(modifiers);
boolean isSynchronized = Modifier.isSynchronized(modifiers);
boolean isTransient = Modifier.isTransient(modifiers);
boolean isVolatitle = Modifier.isVolatile(modifiers);

// 获取包信息
Package userPackage = userClass.getPackage();
System.out.println(userPackage.getName());
System.out.println(userPackage.getSpecificationVersion());

// 获取父类
Class userSuperClass = userClass.getSuperclass();

// 获取接口
Class[] interfaces = userClass.getInterfaces(); // 只有该类的显示实现接口才会被返回，父类实现的不会

// 获取构造函数
// 这里的String.class是限定参数，若方法没有匹配的参数则抛出NoSuchMethodException
Constructor[] constructors = userClass.getConstructors();
Constructor constructor = User.class.getConstructor(new Class[]{String.class, Long.class}); // 这里临时创建了一个Class数组，初始化String.class,Long.class

// 获取公有方法
Method[] method = userClass.getMethods();
// 获取公有属性
Field[] method = userClass.getFields();
// 获取注解
Annotation[] annotations = userClass.getAnnotations();
```

#### 获取属性
获取本类以及父类的所有**公有**属性：  
如果这个类是一个数组，或者是一个基本类型的，则返回一个长度为0的数组。
```java
Field[] fields = User.class.getFields();
```
获取指定名称的本类内公有属性：
若没有该属性则抛出NoSuchFildException
```java
Field field = User.class.getField("[Field Name]");
```
获取field信息的方法：
```java
String fieldName = field.getName();
Object fieldType = field.getType();
```
获取并设置属性的值：
```java
Field field = User.class.getField("id");

// 这里objectInstance为该类的一个实例对象，获取；类实例对象上面的值
Object value = field.get(objectInstance);   // 使用Field.get方法获取类的对象对象属性的值
field.set(objectInstance, value);   // 使用set方法设定对象属性的值
```
获取**私有**属性
```java
User user = new User("+username", "-password");   // 新建一个带有私有属性的类的对象并将私有属性赋值为"Private Value"
Field privateField = PrivateObject.class.getDeclaredField("password");

privateField.setAccessible(true);   // 仅能在反射中开放访问，若使用正常代码访问field编译器会报错

String password = (String)privateField.get("user");
System.out.println(password);
```


#### 获取方法
获取类的**公有**方法
```java
// 获取类的所有方法
Method[] methods = User.class.getMethods();
// 获取指定方法
Method method = userClass.getMethod("changePassword", new Class[]{String.class});   //参数1为方法名，参数2为方法参数，这里创建了一个临时Class类型的数组并初始化赋值为String.class，如果无参数则传入null

// 获取方法参数类型
Class[] parameterTypes = method.getParameterTypes();
// 获取方法返回值类型
Class returnType = method.getReturnType();
```
调用获取的方法
```java
Object returnValue = method.invoke(objectInstance, parameter1, ...);    // 参数1为调用类的实例对象，后面接着方法所需的参数，如果类是静态的则传入null
```
因为Java反射不能单独获取getter和setter，所以需要手动解析所有方法来获取getter和setter
```java
public static void printGettersSetters(Class aClass){
  Method[] methods = aClass.getMethods();

  for(Method method : methods){
    if(isGetter(method)) System.out.println("getter: " + method);
    if(isSetter(method)) System.out.println("setter: " + method);
  }
}

public static boolean isGetter(Method method){
  if(!method.getName().startsWith("get")) return false;
  if(method.getParameterTypes().length != 0) return false;  
  if(void.class.equals(method.getReturnType()) return false;
  return true;
}

public static boolean isSetter(Method method){
  if(!method.getName().startsWith("set")) return false;
  if(method.getParameterTypes().length != 1) return false;
  return true;
}
```
获取**私有**方法
```java
User user = new User("username", "password"); // 这里用户名是公有的，密码是私有的
Method privateMethod = User.class.getDeclaredMethod("getPassword", null); // 获取User类的名为getPassword且参数为null的方法描述。

privateMethod.setAccessible(true);

String returnValue = (String)privateMethod.invoke(user, null);  // 使用invoke调用user对象的对应方法并传入null参数
```


#### 获取注解
获取类上的注解：
```java
// 获取所有的注解
Annotation[] annotations = Array.class.getAnnotations();
// 获取类上的一个特定注解
Annotation annotation = UserController.class.getAnnotation(Controller.class);
```
获取方法上的注解：
```java
// 获取方法上的所有注解
Method method = ... // 获取一个方法
Annotataion[] annotations = method.getDeclaredAnnotations();
// 获取方法上的一个特定注解
Annotation annotation = method.getAnnotation(Annotation.class);
```
获取方法参数的注解：
```java
Method method = ... // 获取一个方法
// 这里获取的是一个二维数组，获取的是一组参数对应的多个注解，数组第一个为参数索引，第二个为对应参数的所有注解索引
Annotation[][] parameterAnnotations = method.getParameterAnnotations();
Class[] parameterTypes = method.getParameterTypes();    // 利用反射获取参数类型

int i=0;
for(Annotation[] annotations : parameterAnnotations){
  Class parameterType = parameterTypes[i++];

  for(Annotation annotation : annotations){
    if(annotation instanceof MyAnnotation){
        MyAnnotation myAnnotation = (MyAnnotation)annotation;
        System.out.println("param: " + parameterType.getName());
        System.out.println("name : " + myAnnotation.name());
        System.out.println("value: " + myAnnotation.value());
    }
  }
}
```
获取属性注解：
```java
// 获取属性所有注解
Field field = ... // 获取一个属性
Annotation[] annotations = field.getDeclaredAnnotations();
// 同样可以获取指定注解
Annotation annotation = field.getAnnotation(Annotation.class)
```

#### 数列
使用Java反射操作数列是通过*java.lang.reflect.Array*类。  
可以使用反射创建一个数列
```java
int[] intArray = (int[])Array.newInstance(int.class, 3)
```
可以使用反射Array.get()与Array.set()访问一个数列
```java
int[] intArray = (int[])Array.newInstance(int.class, 3);

Array.set(intArray, 0, 123);
Array.set(intArray, 1, 234);
Array.set(intArray, 2, 345);

int result = Array.get(intArray, 2);
```
获取反射类
```java
Class stringArrayClass = String[].class;  // 未使用反射特性
Class intArray = Class.forName("[I"); // 使用JVM类加载I为int，[代表数组

Class string ArrayClass = Class.forName("[Ljava.lang.String;"); // "[L"与";"代表生成一个给定类的数组
```
不能使用Class.forName()获取基本类型的类，会抛出ClassNotFoundException，可以使用下面的代码来替代
```java
public Class getClass(String className){
  if("int" .equals(className)) return int.class;
  if("long".equals(className)) return long.class;
  ...
  return Class.forName(className);
}
```
获取一个类之后，可以使用反射来获取该类的数组的类类型
```java
Class theClass = getClass("className");
Class someArrayClass = Array.newInstance(theClass, 0).getClass();
```
获取到一个对象数组之后，可以使用Class.getComponentType()来获取数组内的对象类型。
```java
String[] stringArray = new String[3];
Class stringArrayClass = stringArray.getClass();
Class stringArrayCompnentType = stringArrayClass.getComponentType();
System.out.println(stringArrayComponentType);
```
#### 代理
使用java.lang.reflect.Proxy就可以实现动态代理功能。动态代理可以被用来代理数据库连接、事务管理、单元测试、面向切面编程相关的操作。  
##### 创建动态代理
使用Proxy.newProxyInstance()方法来创建动态代理，这个方法有三个参数
1. ClassLoader是加载动态代理的类
2. 一个需要被实现的接口数组
3. 一个转发所有代理接收到的调用方法请求的InvocationHandler
```java
InvocationHandler handler = new MyInvocationHandler();
// 这段代码会产生一个对MyInterface的动态代理，所有访问代理的请求都会被转发到InvocationHandler的实现 - handler中。
MyInterface proxy = (MyInterface) Proxy.newProxyInstance(MyInterface.class.getClassLoader(), new Class[] { MyInterface.class }, handler);
```
##### InvocationHandler
通过向Proxy.newProxyInstance()传入一个InvocationHandler，所有对于被代理的类的调用将会被转发到这个InvocationHandler上。
```java
// InvocationHandler.java
public interface InvocationHandler {
  Object invoke(Object proxy, Method method, Object[] args) throws Throwable;
}
// Implementation of InvocationHandler.java
public class MyInvocationHandler implements InvocationHandler {
  public Object invoke(Objcet proxy, Method method, Objcet[] args) throws Throwable {
    // Do something "dynamic"
  }
}
```
* proxy参数是实现接口的动态代理对象，一般用不到
* Method代表着动态代理实现类的