# Spring Framework

## 数据事务抽象的核心接口

**PlatformTransactionManager**
* DataSourceTransactionManager
* HibernateTransactionManager
* JtaTransactionManager

**TransactionDefinition**
* Propagation
* Isolation
* Timeout
* Read-only status