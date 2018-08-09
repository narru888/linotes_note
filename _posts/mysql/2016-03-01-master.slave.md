---
toc: true
toc_label: "MySQL 的帐户管理"
toc_icon: "copy"
title: "MySQL 的帐户管理"
tags: mysql 帐户
categories: "database"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/mysql.jpg
  overlay_filter: rgba(0, 0, 0, 0.8)
---







## 用户名与密码

本节内容主要引自 [ MySQL 8.0 Reference Manual ](https://dev.mysql.com/doc/refman/8.0/en/)

MySQL 把帐户保存在 `mysql` 系统数据库的 **`user` 表** 中。每个帐户由 **用户名** 和 **客户端主机** 两部分组成。

每个帐户可以拥有密码，MySQL 还支持验证的插件，因此完全可以使用某个外部的验证方法进行帐户的验证。

MySQL 的用户名和密码与操作系统中使用的有一些不同：


#### 用户名与操作系统无关

MySQL 的用户名与操作系统中的用户名没有任何关系。

许多 MySQL 的客户端默认会尝试使用当前的 Linux 用户名做为 MySQL 用户名，但这只是为了方便而已。这个默认值可以通过使用 `-u` 选项来覆盖，因此任何可以尝试用任何用户名来连接服务端，因此应该为所有 MySQL 帐户设置密码，以保证数据的安全。



#### 用户名长度限制

MySQL 用户名最多为 32 个字符，操作系统用户名的长度限制通常与此有所区别，如 Unix 默认为 8 个字符，一般的 Linux 为 32 个字符。

在服务端和客户端中，对于 MySQL 用户名长度的限制是硬编码的，如果想通过修改 `mysql` 数据库来规避是不可能实现的。

不要尝试以任何手动方式去修改 `mysql` 数据库中表格的结构，服务端会忽略所有的改动。



#### 内部密码与外部密码

MySQL 本机的用户验证是通过 `mysql_native_password` 插件实现的，服务端使用这种本机验证方法时，用的是 `user` 表中保存的密码。如果使用第三方的验证插件，就不一定用这个密码了，可以使用保存于外部的密码。




#### 密码的加密

保存在 `user` 表格中的密码是使用插件指定的机制加密过的。




#### 字符集

如果用户名和密码只包含 ASCII 码，连接服务端时，可以不考虑字符集的设置。

如果用户名和密码中有非 ASCII 字符，客户端则需要使用 `MYSQL_SET_CHARSET_NAME` 选项，以及适当的字符集做参数，来调用 C API 函数 `mysql_options()`，这将会使用指定的字符集来进行验证。否则验证会失败。

标准的 MySQL 客户端程序都支持 `--default-character-set` 选项，该选项会调用 `mysql_option()` 函数。






























## 新增帐户

使用帐户管理语句可以新建帐户，同时会建立他们的权限，如 `CREATE USER` 和 `GRANT` 语句，这些语句会促使授权表发生适当的改动。

另一个创建帐户的方法是使用可视化工具 MySQL Workbench，或者第三方程序，如 `phpMyAdmin`。





#### 以 root 连接到服务端

以 root 身份连接到服务端，因为他有 `CREATE USER` 的权限。

```bash
$ mysql -u root mysql -p
```




#### 创建帐户


##### `CREATE USER` 语句

使用 `CREATE USER` 语句来 **创建帐户**，同时可以用明文 **指定密码**。

```sql
CREATE USER 'user'@'host' IDENTIFIED BY 'password';
```


##### `GRANT` 语句

使用 `GRANT` 语句为帐户 **授予权限**。

```sql
GRANT privileges ON priv_level TO user_or_role [WITH GRANT OPTION];
```

`GRANT` 接权限列表，用逗号分隔

`ON` 表明该语句用于授予权限

`priv_level` 权限授权的级别：

级别是指权限所能作用的范围，如全局、数据库、表、例程等。如：

* `*.*` 所有数据库中的所有对象
* `db.*` 数据库 `db` 的所有对象
* `db.tbl` 数据库 `db` 的 `tbl` 表格

`WITH` 子句用于允许该用户为他人授予权限，`WITH GRANT OPTION` 允许用户把自己极有的权限授予他人。




#### 查看以确认


##### `SHOW GRANTS` 查看为帐户分配的权限

```sql
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+-----------------------------------------------------+
| Grants for admin@localhost                          |
+-----------------------------------------------------+
| GRANT RELOAD, PROCESS ON *.* TO 'admin'@'localhost' |
+-----------------------------------------------------+
```


##### `SHOW CREATE USER` 查看帐户非权限属性：

```sql
mysql> SHOW CREATE USER 'admin'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for admin@localhost: CREATE USER 'admin'@'localhost'
IDENTIFIED WITH 'mysql_native_password'
AS '*67ACDEBDAB923990001F0FFB017EB8ED41861105'
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
```



#### 范例

```sql
mysql> CREATE USER 'finley'@'localhost' IDENTIFIED BY 'password';
mysql> GRANT ALL PRIVILEGES ON *.* TO 'finley'@'localhost'
    ->     WITH GRANT OPTION;
mysql> CREATE USER 'finley'@'%' IDENTIFIED BY 'password';
mysql> GRANT ALL PRIVILEGES ON *.* TO 'finley'@'%'
    ->     WITH GRANT OPTION;
mysql> CREATE USER 'admin'@'localhost' IDENTIFIED BY 'password';
mysql> GRANT RELOAD,PROCESS ON *.* TO 'admin'@'localhost';
mysql> CREATE USER 'dummy'@'localhost';
```

* `'finley'@'localhost'` 和 `'finley'@'%'` 都被赋予了管理员权限，`ALL PRIVILEGES ON *.*`。
* `'finley'@'localhost'` 只能从服务端本地主机连接
* `'finley'@'%'` 可以从任何主机连接
* 如果原来有 `localhost` 的匿名帐户，则创建 `'finley'@'localhost'` 就很有必要，否则 `finley` 会被作为匿名用户来对待。
* 'admin'@'localhost' 只能从服务端主机连接，他被赋予了 `RELOAD` 和 `PROCESS` 管理权限，有了这些权限，`admin` 就可以执行 `mysqladmin reload`、`mysqladmin refresh`、`mysqladmin flush-xxx`、`mysqladmin processlist` 这些命令。但不包含访问数据库的权限。
* 'dummy'@'localhost' 没有密码，这样不安全，不推荐。只能从本地连接，没有权限。


```sql
mysql> CREATE USER 'custom'@'localhost' IDENTIFIED BY 'password';
mysql> GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
    ->     ON bankaccount.*
    ->     TO 'custom'@'localhost';
mysql> CREATE USER 'custom'@'host47.example.com' IDENTIFIED BY 'password';
mysql> GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
    ->     ON expenses.*
    ->     TO 'custom'@'host47.example.com';
mysql> CREATE USER 'custom'@'%.example.com' IDENTIFIED BY 'password';
mysql> GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
    ->     ON customer.*
    ->     TO 'custom'@'%.example.com';
```

`GRANT` 语句中 `ON` 子句指定了具体的权限级别，如 `ON bankaccount.*` 代表权限作用于数据库 `bankaccount` 的所有表。

`'custom'@'host47.example.com'` 只能从主机 `host47.example.com` 连接。






















## 删除帐户

使用 `DROP USER` 语句删除帐户：

```sql
DROP USER 'jeffrey'@'localhost';
```























## 使用角色

MySQL 使用角色来代表一组命名的权限。

可以给一个用户帐户分配各种角色，这些角色会给帐户授予每个角色所关联的不同的权限。通过更换角色，每个帐户可以轻易地更换一组不同的权限。

除非有特殊说明，否则本节所有语句都需要使用 root 身份运行。

本节内容使用同一个范例场景：

* 有一个应用使用名为 `app_db` 的数据库
* 与该程序相关的帐户可以有程序员，负责创建、维护应用，还可以有程序的用户，会与程序交互
* 程序员需要对数据库有完全的访问权限，一些用户需要读，另一些用户需要读写








### MySQL 角色管理的能力

* 用 `CREATE ROLE` 创建角色，用 `DROP ROLE` 删除角色
* 用 `GRANT` 为帐户和角色分配权限，用 `REVOKE` 为帐户和角色撤消权限
* `SHOW GRANTS` 查看为帐户分配的权限和角色
* `SET DEFAULT ROLE` 为帐户设置默认激活的角色
* `SET ROLE` 在当前会话中改变激活的角色
* `CURRENT_ROLE()` 函数查看当前会话中激活的角色
* 系统变量 `mandatory_roles` 用于定义强制角色，`activate_all_roles_on_login` 让用户在登陆服务端时自动激活被分配的角色。







### 创建角色并为其分配权限

为多个帐户单独分配权限的做法效率很低，把每一组权限命名，成为一个角色，这样一来，为用户帐户分配角色就变得高效、灵活。




#### 创建角色

用 `CREATE ROLE` 创建角色：

```sql
CREATE ROLE 'app_developer', 'app_read', 'app_write';
```

角色名很像帐户名，也是由用户和主机两部分组成的，即 `'user'@'host'`。如果主机部分省略，系统默认为 `'%'`。

与帐户名不同的是，**用户名不能为空**。




#### 为角色分配权限

使用 `GRANT` 语句为角色分配权限：

```sql
GRANT ALL ON app_db.* TO 'app_developer';
GRANT SELECT ON app_db.* TO 'app_read';
GRANT INSERT, UPDATE, DELETE ON app_db.* TO 'app_write';
```




#### 为帐户分配角色


新建帐户：

```sql
CREATE USER 'dev1'@'localhost' IDENTIFIED BY 'dev1pass';
CREATE USER 'read_user1'@'localhost' IDENTIFIED BY 'read_user1pass';
CREATE USER 'read_user2'@'localhost' IDENTIFIED BY 'read_user2pass';
CREATE USER 'rw_user1'@'localhost' IDENTIFIED BY 'rw_user1pass';
```

分配角色：

```sql
GRANT 'app_developer' TO 'dev1'@'localhost';
GRANT 'app_read' TO 'read_user1'@'localhost', 'read_user2'@'localhost';
GRANT 'app_read', 'app_write' TO 'rw_user1'@'localhost';
```

可以把一个角色分配给一个或多个用户，也可以为一个用户分配多个角色。

用 `GRANT` 语句为用户分配角色时，没有 `ON` 子句，只用于权限的分配。








### 定义强制角色

通过把角色赋给 `mandatory_roles` 系统变量，可以将某些角色设定为强制角色，服务端会认为每个用户都有这些角色，因此无需显式分配给任何帐户。

设置 `mandatory_roles` 需要 `ROLE_ADMIN` 权限。以及 `SYSTEM_VARIABLES_ADMIN` 或 `SUPER` 权限，用于设置全局系统变量的权限。




#### 在配置文件中指定

可以在服务端配置文件 `my.cnf` 中指定该变量：

```bash
[mysqld]
mandatory_roles='role1,role2@localhost,r3@%.example.com'
```



#### 在运行时指定

```sql
SET PERSIST mandatory_roles = 'role1,role2@localhost,r3@%.example.com';
```

`SET PERSIST` 语句用于给运行中的 MySQL 实例指定强制角色，服务端重启也依然有效。

如果希望仅仅修改运行时的变量值，而不希望保存，可以用关键字 `SET GLOBAL`。




#### 强制角色的激活时机

强制角色与显式授予角色一样，直到角色激活才会生效。用户登陆时，如果启用了系统变量 `activate_all_roles_on_login`，系统会激活所有授权的角色；否则，只激活默认角色。

在运行时，`SET ROLE` 会立即激活角色。




#### 强制角色的撤消

强制角色无法使用 `REVOKE`、`DROP ROLE`、`DROP USER` 来撤消。





#### 强制角色中不存在的角色

如果 `mandatory_roles` 中的某个角色不存在于 `mysql.user` 系统表中，该角色不会分配给用户。

当服务端为用户激活角色时，遇到不存在的角色会忽略掉，并在错误日志中记录一条警告消息。

如果在这之后，该角色被创建了，可以用 `FLUSH PRIVILEGES` 来冲洗一下，服务端就认可它了。
















### 查看角色的权限

用 `SHOW GRANTS` 可以查看帐户的权限，但并未将权限扩展成为角色所代表的具体的权限。要想同时也显示角色权限，需要加一个 `USING` 子句，用来指定授予的角色。

```sql
mysql> SHOW GRANTS FOR 'rw_user1'@'localhost' USING 'app_read', 'app_write';
+------------------------------------------------------------------------------+
| Grants for rw_user1@localhost                                                |
+------------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `rw_user1`@`localhost`                                 |
| GRANT SELECT, INSERT, UPDATE, DELETE ON `app_db`.* TO `rw_user1`@`localhost` |
| GRANT `app_read`@`%`,`app_write`@`%` TO `rw_user1`@`localhost`               |
+------------------------------------------------------------------------------+
```


















### 激活角色

为用户分配的角色可以在用户的会话当中激活或暂停。如果会话中某个角色处于激活状态，其权限也同时有效，否则就无效。

使用 `CURRENT_ROLE()` 函数来 **查看当前** 会话中激活的角色：

```sql
mysql> SELECT CURRENT_ROLE();
+----------------+
| CURRENT_ROLE() |
+----------------+
| NONE           |
+----------------+
```






#### 为用户设置默认角色

若想指定用户每次连接到服务端时要激活哪些角色，可使用 `SET DEFAULT ROLE` 来指定。

语法：

```sql
SET DEFAULT ROLE {NONE | ALL | role [, role ] ...} TO user [, user ] ...
```

范例：

```sql
SET DEFAULT ROLE ALL TO
  'dev1'@'localhost',
  'read_user1'@'localhost',
  'read_user2'@'localhost',
  'rw_user1'@'localhost';
```

此处的 `ALL` 是指之前用 `GRANT` 语句为用户分配的角色，如给 `rw_user1` 分配的是 `'app_read'` 和 `'app_write'` 两个角色。因此，把 `ALL` 设为其默认角色以后，该用户成功连接服务端后，其 `CURRENT_ROLE()` 的初始值就是这两个角色：

```sql
mysql> SELECT CURRENT_ROLE();
+--------------------------------+
| CURRENT_ROLE()                 |
+--------------------------------+
| `app_read`@`%`,`app_write`@`%` |
+--------------------------------+
```


如果希望用户连接到服务端时能自动激活角色，需要启用  `activate_all_roles_on_login` 系统变量，默认是关闭的。

在会话中，用户可以用 `SET ROLE` 来修改激活的角色：

```sql
mysql> SET ROLE NONE; SELECT CURRENT_ROLE();
+----------------+
| CURRENT_ROLE() |
+----------------+
| NONE           |
+----------------+
```

`SET ROLE NONE` 暂停所有角色。

```sql
mysql> SET ROLE ALL EXCEPT 'app_write'; SELECT CURRENT_ROLE();
+----------------+
| CURRENT_ROLE() |
+----------------+
| `app_read`@`%` |
+----------------+
```

把 `app_write` 角色排除掉，只激活 `app_read` 角色。

```sql
mysql> SET ROLE DEFAULT; SELECT CURRENT_ROLE();
+--------------------------------+
| CURRENT_ROLE()                 |
+--------------------------------+
| `app_read`@`%`,`app_write`@`%` |
+--------------------------------+
```

恢复默认角色。










### 撤消角色、撤消权限

`REVOKE` 语法：

```sql
REVOKE role FROM user;
```

在系统变量 `mandatory_roles` 中指定的角色无法撤消。

`REVOKE` 也可用于修改角色的权限，改动不仅作用于角色自身，还会影响授予角色的帐户。

假设现在想临时地把所有该程序的用户都变成只读，可以用 `REVOKE` 把角色 `app_write` 的部分权限撤消：

```sql
REVOKE INSERT, UPDATE, DELETE ON app_db.* FROM 'app_write';
```

用 `SHOW GRANTS` 查看该角色剩余的权限：

```sql
mysql> SHOW GRANTS FOR 'app_write';
+---------------------------------------+
| Grants for app_write@%                |
+---------------------------------------+
| GRANT USAGE ON *.* TO `app_write`@`%` |
+---------------------------------------+
```

因为对角色权限的修改会直接影响到使用该角色的用户，因此 `rw_user1` 用户现在已经没有了对表格进行修改的权限，即 `INSERT`、`UPDATE`、`DELETE` 这几个权限已经消失：

```sql
mysql> SHOW GRANTS FOR 'rw_user1'@'localhost'
       USING 'app_read', 'app_write';
+----------------------------------------------------------------+
| Grants for rw_user1@localhost                                  |
+----------------------------------------------------------------+
| GRANT USAGE ON *.* TO `rw_user1`@`localhost`                   |
| GRANT SELECT ON `app_db`.* TO `rw_user1`@`localhost`           |
| GRANT `app_read`@`%`,`app_write`@`%` TO `rw_user1`@`localhost` |
+----------------------------------------------------------------+
```

此时，用户 `rw_user1` 已从原来的读写用户变成了只读用户。同时受到影响的还有 `app_write` 角色。

要想恢复，只需把之前撤消的权限用 `GRANT` 再给加上：

```sql
GRANT INSERT, UPDATE, DELETE ON app_db.* TO 'app_write';
```














### 删除角色

要想从系统中删除角色，使用 `DROP ROLE` 语句：

```sql
DROP ROLE 'app_read', 'app_write';
```

角色被删除以后，它也会从被分配的用户撤消。

系统变量 `mandatory_roles` 中的角色不能删除。










### 用户与角色的互换

帐户和角色可以互换使用。可以把用户帐户作为角色，把它分配给其它用户或角色。效果与为用户分配角色一样，会把该用户的权限分配给别人。

也就是说，可以把用户分配给另一个用户，角色分配给用户，用户分配给角色，角色分配给角色，真 TM 乱。

```sql
CREATE USER 'u1';
CREATE ROLE 'r1';
GRANT SELECT ON db1.* TO 'u1';
GRANT SELECT ON db2.* TO 'r1';
CREATE USER 'u2';
CREATE ROLE 'r2';
GRANT 'u1', 'r1' TO 'u2';
GRANT 'u1', 'r1' TO 'r2';
```

上述这么一折腾，用户 `u2` 和角色 `r2` 都从 `u1` 和 `r1` 那时获得了相应的权限。

```sql
mysql> SHOW GRANTS FOR 'u2' USING 'u1', 'r1';
+-------------------------------------+
| Grants for u2@%                     |
+-------------------------------------+
| GRANT USAGE ON *.* TO `u2`@`%`      |
| GRANT SELECT ON `db1`.* TO `u2`@`%` |
| GRANT SELECT ON `db2`.* TO `u2`@`%` |
| GRANT `u1`@`%`,`r1`@`%` TO `u2`@`%` |
+-------------------------------------+
mysql> SHOW GRANTS FOR 'r2' USING 'u1', 'r1';
+-------------------------------------+
| Grants for r2@%                     |
+-------------------------------------+
| GRANT USAGE ON *.* TO `r2`@`%`      |
| GRANT SELECT ON `db1`.* TO `r2`@`%` |
| GRANT SELECT ON `db2`.* TO `r2`@`%` |
| GRANT `u1`@`%`,`r1`@`%` TO `r2`@`%` |
+-------------------------------------+
```

角色与用户的互换是有实际应用价值的：如某个项目一开始没有使用角色，而是为每个用户直接分配权限。如果某个程序员离职，解决办法：

* 不使用角色：修改帐户密码，交给新程序员使用
* 使用角色：锁定原帐户，把该帐户分配给其它帐户




















## 系统保留的帐户

MySQL 的安装过程包含对数据目录的初始化，期间会自动创建一些系统保留的用户帐户：

* `'root'@'localhost'` ：用于系统管理。该帐户拥有所有权限，可以进行任何操作。严格来讲，该帐户的用户名不是保留的，因此有些安装过程会把 root 重命名为其它，以规避风险。
* `'mysql.sys'@'localhost'` ：用作 `sys` 表中对象的 `DEFINER`，使用 `mysql.sys` 帐户可以避免由 DBA 重命名或删除 root 帐户所带来的问题。该帐户是锁定的，无法用于客户端连接。
* `'mysql.session'@'localhost'` ：各种插件用该帐户来访问服务端，该帐户是锁定的，无法用于客户端连接。
* `'mysql.infoschema'@'localhost'` ：用作 `INFORMATION_SCHEMA` 视图的 `DEFINER`。使用 `mysql.infoschema` 帐户可以避免由 DBA 重命名或删除 root 帐户所带来的问题。该帐户是锁定的，无法用于客户端连接。






















## 限定帐户资源

可以通过把系统变量 `max_user_connections` 设为非 0 的值来限制客户端对服务端资源的使用。该变量会限制所有帐户产生的并发连接数，但对于客户端连接之后能做什么没有限制。

对于单个帐户对服务端资源的使用，MySQL 会进行以下限制：

* `MAX_QUERIES_PER_HOUR` ：每小时内每帐户可 **查询** 的次数
* `MAX_UPDATES_PER_HOUR` ：每小时内每帐户可 **更新** 的次数
* `MAX_CONNECTIONS_PER_HOUR` ：每小时内每帐户可 **连接** 到服务端的 **次数**
* `MAX_USER_CONNECTIONS` ：每帐户 **连接** 到服务端的 **并发数**

如果 `MAX_USER_CONNECTIONS` 为 0，则由全局变量 `max_user_connections` 决定，如果它也为 0，则表示不做限制。

客户端使用的每条语句都会算到查询限制中，只有对数据库或表进行修改的语句才算到更新限制中。

此处的帐户对应于 `mysql.user` 表中的一行。因此，对每个连接的评估，是基于 `user` 表中匹配的行。

假如某一行的值为 `'usera'` 及 `'%.example.com'`，服务端就会针对所有来自该域名的主机、使用该用户名的连接，单独进行资源的限定。





#### 创建帐户时指定资源限定

`CREATE USER ... WITH ...`

```sql
mysql> CREATE USER 'francis'@'localhost' IDENTIFIED BY 'frank'
    ->     WITH MAX_QUERIES_PER_HOUR 20
    ->          MAX_UPDATES_PER_HOUR 10
    ->          MAX_CONNECTIONS_PER_HOUR 5
    ->          MAX_USER_CONNECTIONS 2;
```



#### 为现有帐户指定资源限定

`ALTER USER ... WITH ...`

```sql
mysql> ALTER USER 'francis'@'localhost' WITH MAX_QUERIES_PER_HOUR 100;
```




#### 限定参数的保存

服务端把帐户的资源限定的参数保存在 `user` 表中，字段分别为 `max_questions`、`max_updates`、`max_connections`、`max_user_connections`。

对于每一字段来说，只有在它不为 0 时才会开始计数。




#### 资源使用的计算

服务端运行期间，它会为每个帐户计算其资源的使用，如果该帐户的每小时连接数达到了限制值，服务端会拒绝该帐户的新的连接，直到一小时结束。

对资源使用的计数是基于帐户的，而不是基于客户端。

如果一个帐户每小时查询限制为 50 次，该帐户若同时连接了多个客户端，则这些客户端的查询次数统统要计算到这 50 次中。




#### 重置计数器

资源使用的计数器随时可以被重置，即清零，可以全局统一重置，也可以针对个别帐户：

服务端每次重启时，所有计数器均为重置。

##### 为所有帐户重置计数器

* 使用 `FLUSH USER_RESOURCES` 语句
* 重新加载授权表也可以达到清零的目的：`FLUSH PRIVILEGES` 或 `mysqladmin reload`


##### 为特定帐户重置计数器

要想为某一帐户重置计数器，可以通过重新设置变量来实现，变量值仍用原来的即可。






对于 `MAX_USER_CONNECTIONS` 限制，有可能会发生这样一种边缘案例：

如果该帐户当前已经达到最大连接数，其中的某一个连接中断，如果紧接着就有一个连接发起，会导致错误 `ER_TOO_MANY_USER_CONNECTIONS` 或 `ER_USER_LIMIT_REACHED`，因为服务端还没有完全处理完上一个连接的中断，只有在处理完上一个中断之后，服务端才会允许下一个连接。
























## 设置帐户密码

MySQL 用户的密码保存在系统数据库 `mysql` 的 `user` 表中。

因此：

* 具有 `CREATE USER` 权限的用户才有权设定密码、修改密码。
* 或者，如果对 `mysql` 数据库有操作权限，也可以设定密码、修改密码。`INSERT` 权限用于创建新帐户，`UPDATE` 权限用于修改现有帐户。
* 如果启用了系统变量 `read_only`，在使用 `CREATE USER` 或 `ALTER USER` 语句时，额外还需要 `CONNECTION_ADMIN` 或 `SUPER` 权限。

MySQL 使用插件进行用户身份的验证，在使用设定密码的语句时，验证插件会对明文密码进行任何需要的哈希操作，以便在将密码保存进 `mysql.user` 表之前，将其加密。




#### 新建帐户时指定密码

语法：

```sql
CREATE USER ... IDENTIFIED BY 'password';
```



#### 为现有帐户修改密码

语法：

```sql
ALTER USER ... IDENTIFIED BY 'password';
```



#### 为自己修改密码

语法：

```sql
ALTER USER USER() IDENTIFIED BY 'password';
```




#### 从命令行修改密码

语法：

```bash
$ mysqladmin -u user_name -h host_name password "password";
```

用 `mysqladmin` 在命令行修改密码不够安全，因为密码是做为命令的参数以明文的形式输入的。会被 `ps` 等命令显示出来。




























## 密码管理

MySQL 的密码管理包括：

* 密码过期：密码需要定期修改
* 密码重用限制：用过的密码一定时间内不能再次使用
* 密码强度：密码要足够复杂

关于密码重用的限制，MySQL 除了要使用 `mysql.user` 表外，从 MySQL 8.0.3 版本开始，还要使用 `mysql.password_history` 这个系统表，如果从较低版本更新过来，必须要对这个修改做出适当的调整，否则，服务端会报错：

```sql
[ERROR] Column count of mysql.user is wrong. Expected
49, found 47. The table is probably corrupted
[Warning] ACL table mysql.password_history missing.
Some operations may fail.
```

要解决该问题，需要运行 `mysql_upgrade` 之后再重启服务端，在这之后才可以成功地修改密码。
















### 密码过期策略

MySQL 允许管理员手动设置帐户过期，并制定一个密码自动过期的策略。可以制定全局过期策略，也可只针对某个帐户。这些策略适用于使用内建验证插件的帐户，对于使用外部验证插件的帐户，密码过期策略同样也需要由外部系统来处理。

由策略决定的密码过期是基于密码的使用时间自动判断的，对于给定的帐户, 是从其最近一次修改密码的时间开始进行计算的。`mysql.user` 表会体现出每个帐户最近修改密码的时间，如果密码时间超过规定的时间，在客户端连接时，服务端会自动以密码过期来对待。





#### 服务端对密码过期的验证

客户端成功连接到服务端以后，服务端会判断该帐户密码是否过期：

* 服务端首先检查帐户是否被手动设置为过期
* 如果没有，再检查密码使用累积时间是否超过策略的规定，如果超过，认为其密码过期

如果密码过期，无论手动还是自动的，服务端要么会断开客户端的连接，要么会限制其操作。被限制操作的客户端会收到要求修改密码的提示消息，直到其修改密码。

客户端重置密码后，服务端会为当前会话恢复其正常的访问，该帐户随后的连接也可成功。

如果是由管理员为用户重置的密码，当前现有的受限会话将保持受限，使用该帐户连接的客户端必须断开后重新连接。

虽然可以做到把密码重置为上一个密码，但做为一个好的密码策略，仍然建议选择一个不同的密码。DBA 可以通过建立适当的密码重用策略，来强制拒绝密码的重用。
{: .notice}  





#### 手动设置用户密码过期

使用 `ALTER USER` 语句来手动将帐户设置为密码过期：

```sql
ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
```

该操作会在 `mysql.user` 表中的对应行中，将密码标记为过期。




#### 设置全局密码有效期

要想制定全局的密码自动过期策略，需使用系统变量 `default_password_lifetime`，其默认值为 0，即禁用密码自动过期。如果变量值为正整数 N，则代表密码有效期为 N 天。


##### 配置文件

通过修改配置文件 `my.cnf` 来设置全局的密码有效期。

设置有效期为 180 天：

```bash
[mysqld]
default_password_lifetime=180
```

设置密码永不过期：

```bash
[mysqld]
default_password_lifetime=0
```


##### 运行时修改全局密码过期策略

```sql
SET PERSIST default_password_lifetime = 180;
SET PERSIST default_password_lifetime = 0;
```

该语句设置的变量值，在服务端重启后依然会保存下来。




#### 为特定帐户设定密码有效期


##### 新建用户时指定

```sql
CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
```


##### 修改现有用户

```sql
ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
```














### 密码重用策略

MySQL 允许对密码重用进行限制，该限制可以基于修改密码的次数、经历的时间、或二者兼有。既可以建立全局的限制策略，也可只针对特定帐户。

这些限制只对那些使用内建验证插件的帐户生效，对于使用外部验证插件的帐户来说，重用限制也需要外部系统来实现。

帐户的密码历史包含了他过去使用过的密码，MySQL 可以对旧密码的重新使用做出限制：

* 如果限制是基于修改密码次数，则必须使用过几次不同的新密码以后，才能重用旧密码。
* 如果限制是基于逝去的时间，设置某密码后，必须经过 N 天才能重用

空密码不会算在密码历史中，可以随时重用。
{: .notice}  




#### 配置全局密码重用策略

要想制定密码重用的策略，可使用系统变量 `password_history` 和 `password_reuse_interval`，这些变量可以在配置文件 `my.cnf` 中定义。


##### 在配置文件中定义

禁用最近使用的 6 个密码，密码超过 365 天才能重用：

```bash
[mysqld]
password_history=6
password_reuse_interval=365
```


##### 在运行时定义

```sql
SET PERSIST password_history = 6;
SET PERSIST password_reuse_interval = 365;
```





#### 为特定帐户设置密码重用策略

要想为特定帐户设置密码重用策略，可以使用 `CREATE USER ... PASSWORD HISTORY` 或 `ALTER USER ... PASSWORD HISTORY`。


##### 新建帐户时指定

```sql
CREATE USER 'jeffrey'@'localhost' PASSWORD HISTORY 5;
CREATE USER 'jeffrey'@'localhost'
  PASSWORD HISTORY 5
  PASSWORD REUSE INTERVAL 365 DAY;
```



##### 为现有帐户指定

```sql
ALTER USER 'jeffrey'@'localhost' PASSWORD HISTORY 5;
ALTER USER 'jeffrey'@'localhost'
  PASSWORD HISTORY 5
  PASSWORD REUSE INTERVAL 365 DAY;
```



































## 服务端对密码过期的处理

MySQL 提供的密码过期功能，可以让管理员强制用户重置密码，也可以基于策略自动管理密码的过期。

对于使用已过期的帐户的连接，服务端要么会断开客户端，要么会将其限制于沙盒模式，期间服务端只允许该客户端进行与重置密码相关的操作。





#### 断开客户端

服务端断开客户端时，会返回 `ER_MUST_CHANGE_PASSWORD_LOGIN` 的错误消息：

```bash
shell> mysql -u myuser -p
Password: ******
ERROR 1862 (HY000): Your password has expired. To log in you must
change it using a client that supports expired passwords.
```





#### 将客户端限制于沙盒

如果服务端把客户端限制在沙盒模式，允许客户端进行以下操作：

* 客户端可使用 `ALTER USER` 或 `SET PASSWORD` 语句来重置密码。重置之后，服务端会为该会话恢复正常的访问，该帐户之后的连接也恢复正常。
* 客户端可使用 `SET` 语句




#### 非交互式客户端

对于非交互式 mysql 客户端的调用，如批处理模式，密码过期时，服务端通常会断开客户端的连接。要想保持连接，以便有机会重置密码，应使用 `--connect-expired-password` 选项。




#### 服务端处理密码过期客户端的流程

对于密码过期的客户端，服务端会断开其连接，还是将其置于沙盒中，这取决于客户端和服务端设置的组合。


##### 客户端的配置

在客户端，一个给定的客户端会表明它是否能为密码过期而接受沙盒模式。对于使用 C 运行库的客户端来说，有两个方法来决定：

* 在连接之前，把 `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS` 标签传递给 `mysql_options()`：

```bash
arg = 1;
result = mysql_options(mysql,
                       MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS,
                       &arg);
```

如果以交互方式调用，或启用了 `--connect-expired-password` 选项，mysql 客户端就会启用 `MYSQL_OPT_CAN_HANDLE_EXPIRED_PASSWORDS`。

* 连接时，把 `CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS` 标签传递给 `mysql_real_connect()`：

```bash
mysql = mysql_real_connect(mysql,
                           host, user, password, db,
                           port, unix_socket,
                           CLIENT_CAN_HANDLE_EXPIRED_PASSWORDS);
```

其它的 MySQL 连接器有其自己的方法来表示是否可接受沙盒模式。


##### 服务端配置

在服务端，如果客户端表示它可以处理密码过期，服务端就将其置于沙盒模式。

如果客户端没有表示它能够处理密码过期，服务端的行为取决于系统变量 `disconnect_on_expired_password` 的值：

* 如果启用了 `disconnect_on_expired_password` 变量（默认值），服务端会断开客户端，返回 `ER_MUST_CHANGE_PASSWORD_LOGIN` 错误消息
* 如果禁用了 `disconnect_on_expired_password` 变量，服务端将客户端置于沙盒模式。

































## 用插件验证身份

客户端连接到服务端时，服务端使用用户名和客户端主机来匹配 `mysql.user` 系统表，然后根据匹配行来决定用哪个验证插件对客户端进行验证：

* 如果服务端找不到插件，返回错误消息，拒绝连接
* 如果找到插件，服务端会调用该插件来验证用户，插件返回状态码，以表明用户是否验证通过

使用插件进行验证启用了以下功能：

* 验证方法可以有所选择：对单独帐户可以选择不同的验证方法
* 外部验证：可以把密码保存在外部，而不是 `mysql.user` 系统表中
* 代理用户：一个用户代替另一个用户连接到服务端，享有另一用户的权限

启动服务端时如果使用 `--skip-grant-tables` 选项，就不会使用验证插件了，此时服务端对客户端不会进行验证，允许任何客户端连接进来。这样做非常不安全，因此，当服务端用 `--skip-grant-tables` 选项启动时，它会自动启用 `--skip-networking`，自动禁止远程连接。
{: .notice}  









### 可用的验证插件

MySQL 8.0 提供以下验证插件：




#### 本机插件

`mysql_native_password` 可进行本机验证。验证是基于对密码的哈希处理。

#### SHA 插件

使用 SHA-256 密码哈希，比本机验证使用更强的加密方法。

#### 客户端明文插件

客户端插件，把密码以明文方式发送给服务端，通常与需要访问明文密码的服务端插件配合使用。

#### PAM 插件

该插件使用 PAM 对用户进行外部验证。支持代理用户。

#### LDAP 插件

LDAP，Lightweight Directory Access Protocol

通过访问目录服务，使用 LDAP 对用户进行验证。

#### 非登陆插件

使用该插件的帐户，会被禁止从客户端连接。该插件的使用场景包括：

* 有些帐户是不允许直接登陆的，必须通过代理帐户才能登陆
* 有些帐户必须有高级权，来执行存储程序和视图，这些权限不能暴露给普通用户

#### 套接字连接插件

对那些从本地主机，通过套接字文件连接进来的帐户进行验证。

#### 测试插件

验证帐户密码，并将验证结果写入服务端错误日志。该插件主要用于测试和开发。













### 验证插件的使用方法

通常来说，插件式的验证会使用服务端和客户端的一对相应的插件。主要用法：

如有必要，应该安装含有插件的运行库。在服务端主机上，安装含有服务端插件的运行库，这样服务端才能用来对连接进行验证。类似地，在每个客户端主机上，也要安装包含客户端插件的运行库。内建的插件无需安装。

对于创建的每个 MySQL 帐户，可以为其指定适当的服务端验证插件。如果帐户要使用默认的验证插件，就无需在帐户创建的语句中指定。系统变量 `default_authentication_plugin` 用于配置默认的验证插件。

客户端连接时，服务端插件会告诉客户端程序使用哪个客户端的插件来验证。

如果某个帐户使用的验证方法均是服务端和客户端程序默认的，则服务端无需与客户端通信来确定要用哪个插件，客户端与服务端的协商可以免去。

对于像 `mysql` 和 `mysqladmin` 这样的客户端来说，在命令行中可以指定 `--default-auth=plugin_name` 选项，来告诉服务端它要使用的插件。但是，如果与该帐户关联的验证插件是另一个，服务端就会覆盖该选项。

如果客户端程序没有找到客户端插件运行库文件，可以用 `--plugin-dir=dir_name` 选项来指定插件运行库目录的位置。











### 验证插件对客户端和服务端的兼容性

插件式的验证允许 MySQL 帐户灵活选择验证方法，但在某些情况下，如果验证插件在客户端和服务端之间无法兼容，客户端就无法建立连接。

通常的兼容规则是，客户端和服务端都要支持该帐户指定的验证方法，因为验证方法是由插件来实现的，双方必须同时支持该插件。

很多情况会造成验证插件的不兼容，要么只有一方识别该插件，要么是一方无权限访问插件。总之，如果双方的 MySQL 是同一发行版，同一版本，通常就不会有兼容的问题。






























## 代理用户

对给定连接进行身份验证的插件，可能要求将连接 (外部) 用户视为不同的用户，以便进行权限检查。于是可以把外部用户做为第二用户的代理，享受第二用户的权限：

* 外部用户是一个 **代理用户**，可以冒充别的用户
* 第二用户是一个 **被代理的用户**，其身份和权限可以由代理用户承担








### 实现用户代理的条件

要想针对特定的验证插件进行用户代理，需要满足以下条件：

* 必须支持代理，要么由插件自身支持，可么由 MySQL 服务端代表插件提供支持。对于后者，需要显式启用。
* 代理的用户帐户必须设置为由特定插件验证，`CREATE USER` 或 `ALTER USER` 语句中可指定。
* 被代理的用户帐户创建后，必须授予需要代理用户承担的权限，用 `CREATE USER` 和 `GRANT` 语句。
* 代理用户帐户对于被代理的帐户必须有 `RPOXY` 权限，用 `GRANT` 语句。
* 要想让连接到代理帐户的客户端能被作为代理用户对待，验证插件必须返回一个与客户端用户不同的用户名，即被代理的用户名。对于服务端，被代理的用户决定于有 `PROXY` 权限的用户。

代理机制只允许把客户端用户名映射到被代理的用户名，不支持代理主机名。当匹配代理帐户的客户端连接时，服务端尝试用该用户名查找匹配的被代理帐户。




#### 范例

当客户端以用户 `employee_ext` 的身份从本地主机连接到服务端时，MySQL 使用名为 `my_auth_plugin` 的插件来验证。

基于 `'my_auth_string'` 的内容，还有可能会查询一些外部的验证系统，之后，该插件会返回一个用户名 `employee` 给服务端。返回的 `employee` 是为了作为本地用户检查其权限。

因此，`employee_ext` 是代理用户， `employee` 是被代理用户。

服务端会检查 `employee_ext` 用户对 `employee` 用户是否有 `PROXY` 权限，如果有，才能证明它有权代理。

`employee_ext` 会享有 `employee` 的权限，客户端会话中，服务端会检查执行的语句，看是否属于 `employee` 权限范围。

于是，`employee_ext` 可以访问数据库 `employess` 中的表格了。

当代理发生时，`USER()` 和 `CURRENT_USER()` 函数可用于查看代理用户及被代理用户。


##### 创建代理帐户

```sql
CREATE USER 'employee_ext'@'localhost'
  IDENTIFIED WITH my_auth_plugin AS 'my_auth_string';
```

`IDENTIFIED WITH` 子句后面跟的 `AS 'my_auth_string'` 子句，指定一个字符串，当该用户连接时，服务端会将该字符串传递给插件。根据每个插件的要求来确定是否需要使用 `AS` 子句，如果需要，字符串的格式取决于插件要如何使用它，具体格式查询插件文档。
{: .notice}  


##### 创建被代理帐户，授予权限

```sql
CREATE USER 'employee'@'localhost'
  IDENTIFIED BY 'employee_pass';
GRANT ALL ON employees.*
  TO 'employee'@'localhost';
```


##### 为代理用户授予代理权限

```sql
GRANT PROXY
  ON 'employee'@'localhost'
  TO 'employee_ext'@'localhost';
```











### 为代理授权

MySQL 安装时初始化的 root 帐户对空帐户 `''@''` 有代理权，即它对任何用户、任何主机的帐户都有代理权。因此，root 也有能力授权其他的代理用户。





#### 代理授权

一个外部用户要想代理用户，需要有 `PROXY` 权限，用 `GRANT` 语句授权：

```sql
GRANT PROXY ON 'proxied_user' TO 'proxy_user';
GRANT PROXY ON 'a' TO 'b', 'c', 'd';
GRANT PROXY ON 'a' TO 'd' WITH GRANT OPTION;
GRANT PROXY ON 'a' TO ''@'';
```

该语句会在授权表 `mysql.proxies_priv` 中创建一条记录。

连接时，proxy_user 必须是一个验证通过的、有效的外部用户，proxied_user 则代表一个本地验证通过的、有效用户，否则连接会失败。




#### 撤消授权

撤消代理使用 `REVOKE` 语句：

```sql
REVOKE PROXY ON 'proxied_user' FROM 'proxy_user';
REVOKE PROXY ON 'a' FROM 'b', 'c', 'd';
```









### 默认的代理用户

如果希望某些或全部用户使用特定的验证插件来连接，可以先创建一个 **空帐户** `''@''`，将其与插件关联，之后让插件返回真正的验证用户名。

如，假设名为 `ldap_auth` 的插件用于 LDAP 验证，它会把连接用户映射为程序员或经理的帐户：

```sql
-- 创建默认代理帐户
CREATE USER ''@'' IDENTIFIED WITH ldap_auth AS 'O=Oracle, OU=MySQL';

-- 创建被代理帐户
CREATE USER 'developer'@'localhost' IDENTIFIED BY 'developer_pass';
CREATE USER 'manager'@'localhost' IDENTIFIED BY 'manager_pass';

-- 为默认代理帐户授予 PROXY 权限
GRANT PROXY ON 'manager'@'localhost' TO ''@'';
GRANT PROXY ON 'developer'@'localhost' TO ''@'';
```

如果有一个客户端要连接：

```bash
shell> mysql --user=myuser --password ...
Enter password: myuser_pass
```

服务端找不到 `myuser` 这个用户，但是可以用空帐户 `''@''` 来匹配，于是服务端将其验证为该帐户。服务端调用 `ldap_auth` 插件，将 `myuser` 和 `myuser_pass` 传递给它。

如果插件在 LDAP 目录中查找后，发现密码不正确，验证失败，拒绝连接。

如果密码正确，且插件发现 `myuser` 是个程序员，它会给服务端返回用户名 `developer`，而不是 `myuser` 。当服务端注意到，返回的用户名与客户端用户名不同时，它就明白，应该把 `myuser` 按代理用户对待。服务端在确认空帐户可以匹配为 `deleloper` 之后，接受连接。在该会话中，`myuser` 会拥有 `developer` 的权限。

如果插件在 LDAP 目录中查找后，发现 `myuser` 是个经理，它会给服务端返回用户名 `manager`，该会话中，`myuser` 就会拥有 `manager` 的权限。

为了简化使用，外部验证不能分多个等级，







### 默认的代理用户与匿名帐户户的冲突

若要创建一个默认代理用户，首先要查看现有的可以匹配任何用户的宽匹配帐户，它们会在匹配默认代理用户之前优先被匹配。

上例中的默认代理用户帐户为空帐户，其主机部分为空，可以匹配任何主机。在创建默认代理用户时，要仔细检查是否有匿名帐户存在，即 `''@'%'` ，该帐户会先于空帐户进行匹配。

遇到这种冲突的情况，有几个解决办法：



#### 删除匿名帐户

删除匿名帐户就没有了冲突。



#### 使用更具体的默认代理用户

如果使用更具体的默认代理用户，如 `''@'localhost'`，就可以先于匿名用户进行匹配，冲突就不复存在了。

使用该方法后，将无法从本地主机以匿名用户身份连接。



#### 创建多个代理用户

创建多个代理用户，一个用于本地连接，一个用于远程连接。该办法在本地用户需要不同权限时尤其适用。


##### 创建代理用户：

```sql
-- 用于本地连接的代理用户
CREATE USER ''@'localhost'
  IDENTIFIED WITH some_plugin AS 'some_auth_string';
-- 用于远程连接的代理用户
CREATE USER ''@'%'
  IDENTIFIED WITH some_plugin AS 'some_auth_string';
```


##### 创建被代理用户：

```sql
-- 为本地连接创建被代理用户
CREATE USER 'developer'@'localhost'
  IDENTIFIED BY 'some_password';
-- 为远程连接创建被代理用户
CREATE USER 'developer'@'%'
  IDENTIFIED BY 'some_password';
```


##### 授予代理权限

```sql
GRANT PROXY ON 'developer'@'localhost' TO ''@'localhost';
GRANT PROXY ON 'developer'@'%' TO ''@'%';
```

















### 服务端对代理用户映射的支持

有些验证插件会自己进行代理用户的映射，如 PAM 等，其它插件默认不支持代理用户。有些插件如果被授予代理权限，可以请求服务端自己进行代理用户的映射，如 `mysql_native_password`、`sha256_password`。如果启用了系统变量 `check_proxy_users`，服务端会为任何提出请求的验证插件进行代理用户的映射：

默认情况下，`check_proxy_users` 是禁用的，因此服务端不会进行映射，不管这个请求是由什么插件提出的。

如果启用了 `check_proxy_users`，也应该同时启用各插件专用的系统变量，以便使用服务端对映射的支持：

* 对于 `mysql_native_password`  插件，需启用 `mysql_native_password_proxy_users` 变量
* 对于 `sha256_password` 插件，需启用 `sha256_password_proxy_users` 变量

服务端进行代理用户的映射时有如下限制：

* 服务端不会为匿名用户代理，也不会代理为匿名用户
* 如果一个帐户被授权可以代理多个帐户，服务端的映射是不确定的。因此，不建议代理多个帐户。










### 代理用户的系统变量

有两个系统变量可以帮助追踪代理的登陆过程：


#### `proxy_user`

如果当前没有发生代理，该变量的值为 `NULL`，否则变量值为代理用户的帐户。


#### `external_user`

有时验证插件会使用一个外部用户来验证，例如使用 windows 本机验证时，使用 windows API 的验证插件不需要知道登陆的 ID。但是，它会使用一个 windows 的用户来验证。插件可以使用只读会话变量 `external_user`，把外部用户的 ID 返回给服务端。如果插件没有为该变量赋值，其值为 `NULL`。













## 锁定帐户

MySQL 支持锁定帐户和解锁帐户。通过在 `CREATE USER` 和 `ALTER USER` 中使用子句 `ACCOUNT LOCK` 或 `ACCOUNT UNLCOK` 。

帐户的锁定状态记录于 `mysql.user` 表中的 `account_locked` 字段，用 `SHOW CREATE USER` 可以查看该帐户是否锁定。

如果客户端尝试连接到一个锁定帐户，连接会失败。服务端会将状态变量 `Locked_connects` 加 1，并返回错误消息。

锁定一个帐户并不影响该帐户被代理，也不影响其执行存储程序和视图的能力。
