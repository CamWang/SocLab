# Spring Data Jpa

## JPA基础

### 配置

#### Jpa初始化流程

1. 加载配置文件创建工厂（实体类管理工厂）对象
2. 通过实体管理类工厂获取实体管理器
3. 获取事物对象，开启事务
4. 完成增删改查操作
5. 提交事务或失败回滚事务
6. 释放资源

```java
public class JpaTest {
  // 1. 加载配置文件创建工厂（实体类管理工厂）对象
  // EntityManagerFactory创建耗时，线程安全，可以创建一个公共的factory
  EntityManagerFactory factory = Persistence.createEntitymanagerFactory("myJpa"); // 在xml中persistence-unit配置字段的名称
  // 2. 通过实体管理类工厂获取实体管理器
  // EntiryManager ： 实体类管理器
  //              .beginTransaction ： 创建事务对象
  //              .persist ： 保存
  //              .merge/remove/find/getRefrence ： 更新、删除、根据id查询
  EntityManager em = factory.createEntityManager();
  // 3. 获取事物对象，开启事务
  // EntityTransaction ： 事务，begin开启，comiit提交，rollback回滚
  EntityTransaction tx = em.getTransaction(); // 获取事务对象
  tx.begin();
  // 4. 完成增删改查操作，保存一个User
  User user = new User();
  em.persist(user); // 保存
  /**
  根据ID查询实例：
    entityManager.find(className, primaryKey) 根据id查询数据
      find方法会立即发送sql语句查询
    entityManager.getReference(className, primaryKey) 与上面
      调用getReference，什么时侯调用结果时再执行sql，懒加载
      比如，User user = eM.getReference，sout(user)时再查询
  */
  /**
  删除用户：
    根据id查询客户，然后remove
    User user = entityManager.find(className, primaryKey);
    entityManager.remove(user)
  */
  /**
  更新用户：
    根据id查询客户，然后更新
    User user = entityManager.find(className, primaryKey);
    user.setPassword(...);
    entityManager.update(user);
  */
  // 5. 提交事务或失败回滚事务
  tx.commit();
  // 6. 释放资源
  em.close();
  factory.close();

  // 为了解决实体类管理工厂初始化较为消耗资源
  private static EntityManagerFactory factory;
  static {
    factory = Persistence.createEntitymanagerFactory("myJpa");
  }
  public static EntityManager getEntityManager() {
    factory.createEntityManager();
  }
}
```
使用jpql
```java
public class JpalTest {
  public void testFindAll() {
    // 1.获取entityManager对象
    Entitymanager em;
    // 2.开启事务
    EntityTransaction tx = em.getTransaction();
    tx.begin()
    // 3.增删改查
    // 查询总数：select count(userId) from User
    // 分页查询：from User 
    // 条件查询：from User where userName like ?
    String jpql = "from User order by userId desc";
    Query query = em.createQuery(jpql);
    // 查询总数：query.getSigleResult(); 返回object 这里返回数字
    // 分页查询：query.setFirstResult(0);不包含0 query.setMaxResult(10);
    // 条件查询：query.setParameter(1, "cam%"); 位置、值
    List list = query.getResultList();
    // 4.提交事务
    tx.commit();
    // 5.释放资源
    em.close;
  }
}
```

#### 配置方法

```yml
spring:
  jpa:
    show-sql: true
    database: mysql
    open-in-view: false
    hibernate:
      ddl-auto: update
      # auto : 自动创建数据库表
      # create : 运行时创建数据库表若已有则先删除
      # update : 程序运行时创建表如果有表不建表
```

```java
  /**
    @Entity : 声名实体类
    @Table : 设置实体类对应表为user
    */
@Entity
@Table(name = "user")  // 
class User {
  /**
    @Id : 声明主键
    @GeneratedValue(strategy = GenerationType.***) : 生成方式
      GenerationType.IDENTITY : 自增（用数据库带的自增长方式）
      GenerationType.SEQUENCE : 序列（数据库自带的序列）
      GenerationType.TABLE : JPA提供的机制，通过一张数据表为u胡主键自增
      GenerationType.AUTO : 程序自动选择
    @Column(name = "", columnDefinition = "") : 数据库中字段名称与生成时增加的约束
    */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id", columnDefinition = "varchar(48) default ''")
  private Long userId;

}
```

### Spring Data JPA

Spring Data JPA是对实现Jpa规范的的ORM框架的更进一步的封装
```java
/**
  JpaRepository<实体类，主键类型> 封装了基本CRUD操作
  JpaSpecificationExecutor<实体类> 封装了复杂操作例如分页
*/
// 配置Spring提供的单元测试环境
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootApplication
public class UserTest {
  @Autowired
  private final UserDao userDao;

  @Test
  public void testFindOne() {
    User user = userDao.findOne(3l);
  }

  @Test
  public void testSave() {
    User user = new User();
    /**
      save: 保存或更新，若有主键则更新，没有则保存，应该先查出来再更新
    */
    userDao.save();
  }
}
```
UserDao是一个动态代理对象，将接口动态的生成实现类。Spring Data JPA使用JdkDynamicAopProxy代理的invoke方法创建了一个动态代理对象。将UserDao接口使用SimpleJpaRepository类实现，最后findOne方法依然是调用EntityManager中方法find来查找元素，即调用了JPA规范接口使用hibernate对数据库进行接触。

#### Spring Data Jpa 实现的方法

```java
userDao.findOne();  // 调用entityManager.find()方法，立即加载
userDao.getOne(); // 调用entityManager.getReference()方法，懒加载
```

#### JPQL语句 与 SQL查询

```java
/*
  在Spring Data Jpa上使用jpql语句需要在接口方法上配置语句（@Query）
*/
@Query(value = "from User where userName = ?2 and userId = ?1")
public User findUserByUsername(Long id, String name) {}

@Query(value = "update User set userName = ?")
@Modifying
// @Transactional 添加事务支持
// @Rollback 设置是否自动回滚
public void updateUser(String name) {}

@Query(value = "SELECT * FROM user", nativeQuery = true)
public List<Object []> sqlFindUser() {}
```

#### 实体配置 - 一对多

```java
// Team User一个队伍对应多个用户
class Team {
  private String teamName;

  // 配置一对多关系与targetEntity关联的类，mappedBy被哪一方维护
  @OneToMany(targetEntity = User.class)
  // 配置外键，referencedColumnName参照主表的主键生成从表外键
  @JoinColumn(referencedColumnName = "team_id")
  private List<User> users = new ArrayList<>();
}

class User {
  private String userName;

  @ManyToOne(targetEntity = Team.class)
  @JoinColumn(referencedColumnName = "team_id")
  private Team team;
}

class Test {
  public void test () {
    Team team = new Team();
    User user = new User();

    team.getUsers().add(user);
    // 或，两个可以单独存在也可以两个都有
    user.setTeam(team);

    teamDao.save(team);
    userDao.save(user);
  }
}
```
放弃多的那一方的维护权
```java
class Team {
  private String teamName;
  // mappedBy在对方实体中本实体的属性名
  @OneToMany(mappedBy = "team")
  private List<User> users = new ArrayList<>();
}
```

#### 级联 - 一对多

级联添加，级联删除，级联更新，需要注意操作主题，在操作主题上添加级联属性
```java
// 级联添加
class Test {
  public void test () {
    Team team = new Team();
    User user = new User();

    team.getUsers().add(user);
    user.setTeam(team);

    teamDao.save(team);
  }
}

class Team {
  private String teamName;
  // CascadeType.ALL所有，MERGE更新，PERSIST保存，REMOVE删除
  @OneToMany(mappedBy = "team", cascade = CascadeType.REMOVE)
  private List<User> users = new ArrayList<>();
}

```

#### 实体配置 - 多对多

```java
/*
  1.声明表关系
  2.配置中间表（包含两个外键）
    name 中间表的名字
    joinColumns 本对象在中间表的外键
    inverseJoinColumns 对方在中间表中的外键
*/
class User {
  private String userName;

  @ManyToMany(targetEntity = Contest.class)
  @JoinTable(name = "user_contest",
    joinColumns = {@JoinColumn(referencedColumnName = "user_id")},
    inverseJoinColumns = {@JoinColumn(referencedColumnNanme = "contest_id")})
  private Set<Contest> contests = new HashSet<>();
}

class Contest {
  private String contestName;

  @ManyToMany(targetEntity = User.class)
  @JoinTable(name = "user_contest",
    joinColumns = {@JoinColumn(referencedColumnName = "contest_id")},
    inverseJoinColumns = {@JoinColumn(referencedColumnNanme = "user_id")})
  private Set<User> users = new HashSet<>();
}

class Test {
  public void test () {
    User user = new User();
    Contest contest = new Contest();

    // 双方维护不可以保存两次主键异常，会被写入数据库两次
    user.getContests().add(contest);
    // contest.getUsers().add(user);

    userDao.save(user);
    contestDao.save(contest);
  }
}
```
非主动一方放弃维护权
```java
@ManyToMany(mappedBy = "contests") // 是对方内配置该类集合的名称
  private Set<User> users = new HashSet<>();
```

#### 级联 - 多对多

```java
class Test {
  public void test () {
    User user = new User();
    Contest contest = new Contest();
    user.getContests().add(contest);
    contest.getUsers().add(user);
    userDao.save(user); // 仅保存用户
  }
}

class User {
  private String userName;

  @ManyToMany(targetEntity = Contest.class, cascade = CascadeType.ALL)
  @JoinTable(name = "user_contest",
    joinColumns = {@JoinColumn(referencedColumnName = "user_id")},
    inverseJoinColumns = {@JoinColumn(referencedColumnNanme = "contest_id")})
  private Set<Contest> contests = new HashSet<>();
}

```

## 多表查询

### 对象的导航查询

查询一个对象的同时通过此对象查询他的关联对象，案例使用用户和队伍
```java
// Team User一个队伍对应多个用户
class Team {
  private String teamName;
  // 可在onetomany上配置fetch = EAGER LAZY获取类型
  @OneToMany(mappedBy = "team")
  private List<User> users = new ArrayList<>();
}

class User {
  private String userName;

  @ManyToOne(targetEntity = Team.class)
  @JoinColumn(referencedColumnName = "team_id")
  private Team team;
}

// 运行这个方法可能会报no session错误，即不在一个事务中执行，需要添加Transactional注解
@Transactional
class Test {
  // 查询对象时查询出关联对象
  void test() {
    Team team = teamDao.getOne(1l);
    Team team = teamDao.findOne(1l);
    // 对象导航查询，查询此队伍下的所有用户，默认使用懒加载模式，一查多懒加载
    // 多查一立即加载
    Set<User> users = team.getUsers();
  }

  void test2() {
    User user = userDao.findOne();
    // 多对一默认立即加载
    Team team = user.getTeam();
  }
}

```

## 投影 - 限制属性数量

Spring Data的query方法经常被用来返回一个或多个被repository管理的某实体类的集合，但是有时候我们只想要创建一个投影来获取实体类内指定的部分属性。通过Spring Data，可以建立多个独立的返回类型，来筛选出我们需要的实体类的部分属性。 

#### 示例实体类与repository

```java
class Person {

  @Id UUID id;
  String firstname, lastname;
  Address address;

  static class Address {
    String zipCode, city, street;
  }
}

interface PersonRepository extends Repository<Person, UUID> {

  Collection<Person> findByLastname(String lastname);
}
```

下面介绍如何使用repository获取Person的姓名（包括firstname与lastname）属性

### 基于接口的投影

限制结果内实体类属性最简单的方式就是用接口了。

```java
interface NamesOnly {

  String getFirstname();
  String getLastname();
}
```

这里最关键的一点就是一定要将需要的属性定义的与实体类内定义的完全一样，然后就可以把repository内的query方法改为下面的形式。

```java
interface PersonRepository extends Repository<Person, UUID> {
  Collection<NamesOnly> findByLastname(String lastname);
}
```

Query执行引擎会在运行期间自动创建一个用于寄存每个返回的实体类的代理实例。  
投影可以被递归使用，如果你也想包含Person类内Address子类的信息，你可以定义一个包含getAddress()方法的子接口。

```java
interface PersonSummary {

  String getFirstname();
  String getLastname();
  AddressSummary getAddress();

  interface AddressSummary {
    String getCity();
  }
}
```

### 闭合投影

如果一个投影内所有getter方法全部与实体类内属性一一对应，则就被成为一个闭合投影，如下所示。

```java
interface NamesOnly {

  String getFirstname();
  String getLastname();
}
```

Spring Data会优化闭合投影的query执行，因为所有需要的属性都会回到投影的代理。

### 开放投影

投影接口内的getter方法可以利用@Value注释添加计算操作，如下所示。

```java
interface NamesOnly {

  @Value("#{target.firstname + ' ' + target.lastname}")
  String getFullName();
  …
}
```

实体类的属性可以在投影中用target变量访问，一个用了@Value注释的投影接口就是一个开放投影，Spring Data就不能控制query的执行了，因为SpEL表达式有可能使用实体类的任何属性。  
@Value内使用的表达式不能太复杂，除非你想在String变量中编程，对于很简单的表达式，其中一种的方式就是把它放到一个default方法中，如下所示。

```java
interface NamesOnly {

  String getFirstname();
  String getLastname();

  default String getFullName() {
    return getFirstname.concat(" ").concat(getLastname());
  }
}
```

不过另外一种更简单的方式就是把他放到Spring bean中然后再SpEL表达式中调用，如下所示。

```java
@Component
class MyBean {

  String getFullName(Person person) {
    …
  }
}

interface NamesOnly {

  @Value("#{@myBean.getFullName(target)}")
  String getFullName();
  …
}
```

## 表间关联

https://www.jianshu.com/p/54108abb070f