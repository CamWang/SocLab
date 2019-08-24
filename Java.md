# Java

## 实例

### 使用JDBC进行数据库读写

```java
Class.forName("jdbc.mysql.Driver");
String sql = "INSERT INTO user(username, password) values(?, ?)";
Connection conn = DriverManager.getConnection(USERNAME, PASSWORD, CONN_URL);
PreparedStatement pst = conn.prepareStatement(sql);
pst.setString(1, user.getUsername());
pst.setString(2, user.getPassword());
pst.executeUpdate();
conn.close();
```