---
toc: true
toc_label: "MySQL 服务端的管理"
toc_icon: "copy"
title: "MySQL 服务端的管理"
tag: [ mysql, server ]
categories: "database"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/mysql.jpg
  overlay_filter: rgba(0, 0, 0, 0.8)
---







## MySQL Server

本节内容主要引自 [ MySQL 8.0 Reference Manual ](https://dev.mysql.com/doc/refman/8.0/en/)

MySQL 服务端











### 服务端的配置

MySQL 的服务端程序为 mysqld，它包含许多命令 **选项** 及系统 **变量**，这些都可以在启动服务端时进行设置。






#### 查看所有选项和系统变量

```bash
$ mysqld --verbose --help
```

该命令会列出所有的选项和可配置的系统变量。





#### 查看服务端运行中会使用的系统变量

```sql
mysql> SHOW VARIABLES;
```



#### 查看服务端运行中的状态信息

```sql
mysql> SHOW STATUS;
```



#### 在 shell 中查看系统变量和状态信息

```bash
$ mysqladmin -u root -p variables
$ mysqladmin -u root -p extended-status
```




















### 服务端选项

启动 mysqld 服务时，可以通过 **命令行、配置文件、变量** 这三种方法来 **定义** 其运行的各种 **选项**。

在多数情况下，我们希望服务端每次都用同样的选项来工作，因此修改配置文件更满足这个要求。

mysqld 会从 `/var/lib/mysql/auto.cnf` 配置文件中读取 `[mysqld]` 和 `[server]` 区段的设置。

服务端选项、系统变量、状态变量加在一起的数量很庞大，[这里](https://dev.mysql.com/doc/refman/8.0/en/server-option-variable-reference.html)有一个详细的列表可供查询。


有些选项用来控制缓冲区的大小。对于一个给定的缓冲区，服务端有时会需要分配内部数据结构，这些结构通常是从总内存中拿出来，分配到缓冲区的，其需要的存储空间大小依平台而有所不同。因此，如果通过选项指定了缓冲区的大小，最后得到的可用空间可能会有所差异。

有些选项的值是文件名。除非特别指定，如果是相对路径的话，默认的文件路径是数据目录。要想显式指定路径，应使用绝对路径。假设数据目录是 `/var/mysql/data`，如果某个选项指定了一个相对路径的文件名，则会被认为是在 `/var/mysql/data` 目录中。

用户给变量赋值后，MySQL 会在一定范围内自动纠错，将其调整到可用范围内最接近的值。

服务端运行时，可以用 `SET` 命令设置某些系统变量，如果希望提前对这些变量的最大值加以限制，可以在启动服务时以 `mysqld --maximum-var_name=value` 的形式指定。





















### 系统变量

MySQL 服务端维护了许多系统变量，它们体现了服务的具体配置。

每个系统变量都有一个默认值。这些变量可以在命令行指定，也可以在配置文件中指定。

它们中的大多数都可以在运行时用 `SET` 语句来动态修改，这样就可以无需停止或重启服务就可修改服务的运行。

可以在表达式中使用系统变量。

在运行时，要想设置系统变量的全局值通常需要 `SYSTEM_VARIABLES_ADMIN` 和 `SUPER` 的权限。

[这里](https://dev.mysql.com/doc/refman/8.0/en/server-system-variable-reference.html)有详细的服务端系统变量统计表。




#### 查看系统变量及当前的值

要想查看服务端基于其编译默认的所有系统变量：

```bash
$ mysqld --verbose --help
```

要想从所有系统变量中把在配置文件中出现的排除掉：

```bash
$ mysqld --no-defaults --verbose --help
```

查看当前运行中的服务正在使用的变量及值：

```sql
mysql> SHOW VARIABLES;
```





#### 系统变量的作用域

系统变量有两个作用域：**全局** 和 **会话**。

全局变量作用于运行的整个过程，会话变量作用于单个客户端的连接。

某个系统变量可能同时有一个全局的值，和一个会话的值。

* 服务启动时，会把每个全局变量初始化为其默认值。
* 服务端为每个连接来的客户端维护一组会话变量，这些变量是在连接时初始化的，大多使用的是其全局变量当前的值。

```bash
mysqld --innodb_log_file_size=16M --max_allowed_packet=1G
```

相应地，如果要修改配置文件：

```bash
[mysqld]
innodb_log_file_size=16M
max_allowed_packet=1G
```




#### 修改变量

许多系统变量是动态的，可以在运行时使用 `SET` 语句修改。使用 `SET` 修改的配置在重启服务之后仍然有效。因为它不仅修改了运行时变量的值，还会把变量的新值写入配置文件 `/var/lib/mysql/auto.cnf` 中。

`/var/lib/mysql/auto.cnf` 配置文件完全由服务端自行管理，不要手动修改。
{: .notice--info}


##### 赋值的单位

在 **命令行** 中启动服务时为变量赋值，后缀可以用 `K`、`M`、`G`，大小写均可，来表示 1024、1024<sup>2</sup>、1024<sup>3</sup> 等等。

在 **运行时** 为变量赋值时，不支持这些容量单位。


##### 用表达式赋值

在 **运行时** 为变量赋值时，支持用表达式来赋值，如：

```sql
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

而在启动服务时则不支持用表达式赋值。


##### 设置全局变量

使用 `GLOBAL` 或 `@@global.`：

```sql
SET GLOBAL max_connections = 1000;
set @@global.max_connections = 1000;
```

使用 `PERSIST` 或 `@@persist.`：

```sql
SET PERSIST max_connections = 1000;
SET @@persist.max_connections = 1000;
```

使用 `PERSIST_ONLY` 或 `@@persist_only`

```sql
SET PERSIST_ONLY back_log = 1000;
SET @@persist_only.back_log = 1000;
```

`PERSIST_ONLY` 特殊的一点：它只会把赋值更新到配置文件，而不会修改运行时中的全局系统变量，因此更适合配置只读的系统变量，这些变量只能在启动服务的时候设置。
{: .notice}  


##### 设置会话变量

要想标记一个变量为会话变量，在变量名前面可以加上 `SESSION` 或 `@@session.` 关键字，或使用 `@@` 修饰符。

```sql
SET SESSION sql_mode = 'TRADITIONAL';
SET @@session.sql_mode = 'TRADITIONAL';
SET @@sql_mode = 'TRADITIONAL';
```

客户端只可以修改自己会话的变量。

如果变量只用于会话，则不会持续有效，因此没必要出现在配置文件中。

`LOCAL` 和 `@@local` 与 `SESSION` 和 `@@session.` 是等效的。

使用 `SET` 命令时，如果没有使用修饰符，则默认为修改会话变量。

如果用设置会话变量的关键字来设置全局变量，或者反之，均会报错。


##### 同时为多个变量赋值

一条 `SET` 语句中可以为多个变量赋值，用逗号分隔：

```sql
SET @x = 1, SESSION sql_mode = '';
SET GLOBAL sort_buffer_size = 1000000, SESSION sort_buffer_size = 1000000;
SET @@global.sort_buffer_size = 1000000, @@local.sort_buffer_size = 1000000;
SET GLOBAL max_connections = 1000, sort_buffer_size = 1000000;
```

同时为多个变量赋值时，如果这些变量同属于全局变量或会话变量，关键字只需要使用一次即可，放在第一个变量前面，如上面最后一条语句。

如果 `SET` 语句中，某个变量的赋值失败，则整条语句都失败，哪个变量都不会改变，配置文件也不会被更新。

如果修改了会话变量，变量值在 **会话期间** 一直生效，直到会话结束。

如果修改了全局变量，变量值 **始终** 有效，并会用于 **新产生的会话**，直到服务退出。全局变量的修改对于访问该变量的 **所有客户端都可见**。





#### 变量的引用

要想在表达式中引用系统变量，可以使用 `@@` 修饰符，除了 `@@persist.`，它不允许用于表达式。

如，在 `SELECT` 语句中获取变量的值：

```sql
SELECT @@global.sql_mode, @@session.sql_mode, @@sql_mode;
```

对于用 `@@var_name` 格式引用的变量名来说，MySQL 会返回其会话值，如果不存在，则返回全局值。而对于变量名中有句点的则不适用，如 `@@global.` 或 `@@session.` 格式的变量名。




#### 查询变量


##### 查看所有变量

```sql
mysql> SHOW VARIABLES;
```


##### 用变量名检索

用 `LIKE` 子句来 **匹配** 特定的变量：

```sql
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```


##### 用模板检索

在 `LIKE` 子句中使用通配符 `%` 或 `_` 来匹配变量：

```sql
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```





#### 结构化的系统变量

结构化的变量与常规变量在两方面不同：

* **变量值** 是结构化的，由 **多个组件** 构成，每个组件用来描述不同的 **服务参数**
* 每一类结构化变量可以有 **多个实例**，每个实例的名字不同，代表着服务所维护的 **不同的资源**


##### 结构化系统变量的命名

MySQL 支持的这种结构化变量类型，其命名是这样的：

`实例名.组件名`

要想引用某个结构化变量实例中的某个组件，就使用上面这种复合的变量名。以 Key Cache 变量为例：

```
hot_cache.key_buffer_size
hot_cache.key_cache_block_size
cold_cache.key_cache_block_size
```

对于每个结构化系统变量来说，总是有个用 `default` 命名的 **预定义的实例**。如果在引用某个结构化变量时，没有指定实例名称，则会认为使用的是 `default` 实例。因此，`default.key_buffer_size` 与 `key_buffer_size` 指的是同一个系统变量。

结构化变量的实例和组件遵循以下命名规则：

* 对于一个特定的结构化变量的类型，每个实例的名称在 **该类型** 的变量中必须是 **唯一** 的。不同类型的变量可以使用相同的实例名。
* 对于每个结构化变量类型来说，组件名称必须是唯一的。
* 如果结构化变量名在未引用时是非法的，引用时需要用反引号。如 `hot-cahce` 是非法的，而 `` `hot-chache` `` 就是合法的。
* 禁止用 `global`、`session`、`local` 做为实例的名称，以免与对应的非结构化系统变量冲突。



##### 结构化变量的使用场景

只要能用普通变量的地方，就能用结构化的变量组件。如，用命令行选项为结构化变量赋值：

```bash
$ mysqld --hot_cache.key_buffer_size=64K
```

在配置文件中也可以使用：

```bash
[mysqld]
hot_cache.key_buffer_size=64K
```


##### 赋值及检索

要想为结构化变量赋值，以下两种格式都可以：

```sql
mysql> SET GLOBAL hot_cache.key_buffer_size = 10*1024*1024;
mysql> SET @@global.hot_cache.key_buffer_size = 10*1024*1024;
```

返回变量的值：

```sql
mysql> SELECT @@global.hot_cache.key_buffer_size;
```












### 状态变量

服务端的状态变量用于保存服务动作的信息。

[这里](https://dev.mysql.com/doc/refman/8.0/en/server-status-variable-reference.html)是详细的服务端状态变量统计表。

查看所有状态变量及当前的值：

```sql
mysql> SHOW GOLBAL STATUS;
```

许多状态变量可以用 `FLUSH STATUS` 来重置为 0。













### 服务端的 SQL 模式

MySQL 服务端能够以不同的 SQL 模式运转，并且能够为不同的客户端应用不同的模式，取决于 `sql_mode` 这个系统变量。DBA 可以设置全局的 SQL 模式，以匹配网站服务运营的需求，每个程序都可以根据自己的需求来设置其会话的 SQL 模式。

不同的模式会影响对 SQL 语法的支持，以及对数据有效性的检查。这一点使得在不同的环境中使用 MySQL 变的更加容易，同样地，也更容易与其它数据库服务一同使用。




#### 设置 SQL 模式

MySQL 8.0 的默认 SQL 模式包括：`ONLY_FULL_GROUP_BY`、`STRICT_TRANS_TABLES`、`NO_ZERO_IN_DATE`、`NO_ZERO_DATE`、`ERROR_FOR_DIVISION_BY_ZERO`、`NO_ENGINE_SUBSTITUTION`。

若要在服务启动时设置 SQL 模式，可用 `--sql-mode="modes"` 选项，或在配置文件中使用 `sql-mode="modes"`。其中的 `modes` 可以是不同模式的列表，用逗号分隔。若要显式清除 SQL 模式，可在命令行用 `--sql-mode=""` 或在配置文件中用 `sql-mode=""`。

要在运行时更改 SQL 模式，可用 `SET` 语句来设置全局或会话变量 `sql_mode`：

```sql
SET GLOBAL sql_mode = 'modes';
SET SESSION sql_mode = 'modes';
```

查询当前模式：

```sql
SELECT @@GLOBAL.sql_mode;
SELECT @@SESSION.sql_mode;
```

**SQL 模式与用户定义的分区** ： 分了区的表被创建并插入数据以后，如果要修改服务端 SQL 模式，表的行为会发生很大变化，有可能会引起数据的丢失和损坏。因此，强烈建议用户在对表进行分区之后，永远不要修改 SQL 模式。<br><br>在复制分了区的表时，从表和主表必须使用相同的 SQL 模式。
{: .notice--warning}























## MySQL 数据目录

MySQL 服务端管理的信息保存在一个目录中，该目录称为数据目录。CentOS 7 中，该数据目录为 `/var/lib/mysql`。

数据目录中常见的项目主要有：

* 数据目录的 **子目录**。每个子目录都是一个数据库目录，对应一个服务端管理的数据库。
	- `mysql` 子目录中的是 mysql 的系统数据库，其中包含 MySQL 服务端运行所需的信息。
	- `performance_schema` 子目录中的数据库，用于审查服务端在运行时其内部的执行情况。
	- `sys` 子目录中的数据库，会提供一组对象，来帮助解释 performance_schema 中的信息。
	- 其他子目录为用户或应用程序建立的数据库。
* 服务端保存的日志文件
* `InnoDB` 表空间及日志文件
* 默认的，或自动生成的 SSL 及 RSA 证书及密钥文件。
* 服务端进程 ID 文件
* `auto.cnf` 配置文件，保存全局系统变量。

































## mysql 系统数据库

`mysql` 数据库是系统数据库，其中的表保存了服务端运行所需的信息。所有的表按功能大致分成以下几类：







### 数据词典表

Data Dictionary Tables

这些表由数据词典组成，其中包含了数据库对象的元数据。

数据词典是 MySQL 8.0 新出现的。启用数据词典的服务端会带来一些操作上的差异。
{: .notice}

数据词典表是不可见的，无法被 `SELECT` 读取，用 `SHOW TABLES` 也不会出现。但是，`INFORMATION_SCHEMA` 数据库提供了一个视角，可以查看数据词典的元数据：

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA\G
*************************** 1. row ***************************
              CATALOG_NAME: def
               SCHEMA_NAME: mysql
DEFAULT_CHARACTER_SET_NAME: utf8mb4
    DEFAULT_COLLATION_NAME: utf8mb4_0900_ai_ci
                  SQL_PATH: NULL
*************************** 2. row ***************************
              CATALOG_NAME: def
               SCHEMA_NAME: information_schema
DEFAULT_CHARACTER_SET_NAME: utf8
    DEFAULT_COLLATION_NAME: utf8_general_ci
                  SQL_PATH: NULL
...
```

MySQL 8.0 以前版本的一些系统表已经被数据词典表代替：

* 旧版的 `event` 表被现在的 `events` 数据词典表代替
* 旧版的 `proc` 表被现在的 `parameters` 和 `routines` 数据词典表代替





### 授权系统表

Grant System Tables

这些表中包含了用户账号及其权限等信息。

对于 MySQL 8.0 来说，授权表是 `InnoDB` （事务）表，之前的版本则是 `MyISAM`（非事务）表。授权表底层存储引擎的改变，直接导致了账户管理语句的改变，如 `CREATE USER` 和 `GRANT`。以前版本中，账户管理语句中如果指定了多个用户，即使其中的部分用户失败，整个语句依然可以成功执行。但语句现在是事务性的，要么全部用户成功，语句成功执行，只要发生任何错误，整个语句就会回滚。


#### 事务

事务，Transaction，一般是指要做的或所做的事情。在计算机术语中是指访问并可能更新数据库中各种数据项的一个程序执行单元（unit）。在计算机术语中，事务通常就是指数据库事务。

一个数据库事务通常包含对数据库进行读或写的一个 **操作序列**。它的存在包含有以下两个目的：

* 为数据库操作提供了一个从失败中恢复到正常状态的方法，同时提供了数据库即使在异常状态下仍能保持 **一致性** 的方法。
* 当多个应用程序在 **并发访问** 数据库时，可以在这些应用程序之间提供一个 **隔离** 方法，以防止彼此的操作互相干扰。

当一个事务被提交给了 DBMS（数据库管理系统）时，DBMS 需要确保该事务中的 **所有操作都成功完成**，且其结果被 **永久保存** 在数据库中，如果事务中有的操作没有成功完成，则事务中的所有操作都需要被 **回滚**，回到事务执行前的状态（要么全执行，要么全都不执行）；同时，该事务对数据库或者其他事务的执行无影响，所有的事务都好像在独立的运行。

但在现实情况下，失败的风险很高。在一个数据库事务的执行过程中，有可能会遇上事务操作失败、数据库系统/操作系统失败，甚至是存储介质失败等情况。这便需要 DBMS 对一个执行失败的事务执行恢复操作，将其数据库状态恢复到一致状态（数据的一致性得到保证的状态）。为了实现将数据库状态恢复到一致状态的功能，DBMS 通常需要维护 **事务日志** 以追踪事务中所有影响数据库数据的操作。







### 对象信息系统表

Object Information System Tables

这些表所保存的信息是关于存储的程序、组件、用户定义的函数及服务端插件的。




### 日志系统表

Log System Tables

服务端用这些表来保存日志。

* `general_log` 普通的查询日志
* `slow_log` 慢速查询日志

日志表使用 CSV 存储引擎。




### 帮助系统表

Server-Side Help System Tables

这些表包含服务端帮助信息。



### 时区系统表

Time Zone System Tables

这些表包含时区信息。



### 复制系统表

Replication System Tables

服务端使用这些表来支持复制。



### 优化器系统表

这些表用于优化器。



### 其它系统表

无法归纳到以上类别的其它表。


































## MySQL Server 日志

MySQL Server 有多个日志来帮助用户查明当下发生的事件。

日志类型 | 写到日志中的信息
--- | ---
错误日志  |  在 mysqld 启动、运行、暂停期间遇到的问题
一般查询日志  |  已建立的客户端连接和客户端接收的语句
二进制日志  |  改变数据的语句（也用于复制）
中继日志  |  从复制主服务器接收的数据更改
慢查询的日志  |  超过 `long_query_time` 秒执行的查询
DDL 元数据日志  |  DDL 语句执行的元数据操作

系统默认不会启用任何日志。对于已启用的日志，服务端会把日志文件写入数据目录中。通过对日志的 **冲洗**，用户可以强制服务端关闭并重新打开日志文件，或在某些情况下切换到一个新的日志文件。

冲洗日志的方法：

* 使用 `FLUSH LOGS` 语句
* 执行 `mysqladmin flush-logs` 或 `mysqladmin refresh` 语句
* 执行 `mysqldump --flush-logs` 或 `mysqldump --master-data`
* 二进制日志在大小超过 `max_binlog_size` 系统变量时会自动冲洗


















### 自定义查询日志的保存位置

这一块内容，在 [MySQL 8.0 参考手册原文](https://dev.mysql.com/doc/refman/8.0/en/log-destinations.html)中写的尤其的混乱，本人尝试按自己的理解整理如下，如有异议，欢迎讨论。
{: .notice}

本节内容仅限于 **一般查询日志** 和 **慢查询日志**。

如果要启用一般查询日志和慢查询日志，既可以把日志保存为 **日志文件**，也可以保存到 **数据库** 中，也可以同时保存到文件和数据库中。如果保存到数据库，通常会保存到 `mysql` 数据库中的 `general_log` 和 `slow_log` **表** 中。




#### 把日志保存到数据库


##### 把日志保存到数据库的好处

* 日志条目有标准的格式
* 可以用 SQL 语句访问日志内容
* 可以通过任何客户端远程查询日志


##### 查看数据库中的日志

要想查看 **日志表的结构**，可以用 `SHOW CREATE TABLE` 语句：

```sql
SHOW CREATE TABLE mysql.general_log;
SHOW CREATE TABLE mysql.slow_log;
```

可以用特定条件来查询日志。如可以查询与某个客户端相关的日志内容，以便查找该客户端发生的查询问题。


##### 使用数据库保存日志的特点

* 总的说来，使用日志表的目的是为用户提供一个接口，便于观察服务在运行时的执行，而不去干扰运行时的执行。
* 对一个日志表可以进行 `CREATE TABLE`、`ALTER TABLE`、`DROP TABLE` 操作，其中 `ALTER TABLE`、`DROP TABLE` 操作需要在日志表未被使用时，且要被禁用，才能进行。
* 日志表默认使用 CSV 存储引擎，写入的数据需用逗号分隔。如果用户有权限访问该 `.csv` 文件，就可以很方便地将其导入其它电子表格程序中。
* 要想禁用日志以便修改或删除日志表，可以用以下方法：
	```sql
	SET @old_log_state = @@global.general_log;
	SET GLOBAL general_log = 'OFF';
	ALTER TABLE mysql.general_log ENGINE = MyISAM;
	SET GLOBAL general_log = @old_log_state;
	```
* `TRUNCATE TABLE` 用于清空数据表，可用在那些过期的日志条目上
* `RENAME TABLE` 可以原子地重命名日志表，可用于日志的滚动
	```sql
	USE mysql;
	DROP TABLE IF EXISTS general_log2;
	CREATE TABLE general_log2 LIKE general_log;
	RENAME TABLE general_log TO general_log_backup, general_log2 TO general_log;
	```
* 可用 `CHECK TABLE` 检查日志表的错误。
* 对日志表不能使用 `LOCK TABLES`
* 对日志表不能使用 `INSERT`、`DELETE`、`UPDATE`，这些操作只能由服务端内部进行。
* `FLUSH TABLES WITH READ LOCK` 及 `read_only` 系统变量的状态对日志表没有影响，服务端总是可以写入日志表。
* 写入日志表中的条目不会被写入二进制日志，因此不会复制到从服务端。
* 用 `FLUSH TABLES` 冲洗日志表，用 `FLUSH LOGS` 冲洗日志文件。
* 日志表是无法分区的
* 日志表无法用 `mysqldump` 来备份




#### 控制查询日志的主要变量

这两种查询日志主要由以下几个变量来控制：


##### `general_log`

全局变量，**一般查询日志的开关**。变量值为布尔值，为 1 则启用日志，为 0 则禁用日志。

该变量的默认值取决于是否使用了 `--general_log` 选项。


##### `general_log_file`

全局变量，一般查询日志文件的文件名，默认值为 `host_name.log`，可通过 `--general_log_file` 选项来修改其默认值。


##### `slow_query_log`

全局变量，**慢查询日志的开关**。变量值为布尔值，为 1 则启用日志，为 0 则禁用日志。

该变量的默认值取决于是否使用了 `--slow_query_log` 选项。


##### `slow_query_log_file`

全局变量，慢查询日志文件的文件名，默认值为 `host_name-slow.log`，可通过 `--slow_query_log_file` 选项来修改其默认值。


##### `log_output`

全局变量。

官方对该变量的解释是：系统变量 `log_output` 用于控制一般查询日志和慢查询日志所输出的目标。即把它们保存到哪儿。

**有效变量值** ： 如果日志保存为文件，变量值为 `FILE`；如果日志保存到数据库中，变量值为 `TABLE`；如果不保存日志，变量值为 `NONE`。

由此我们看到，该变量实际上同时起到了两个作用：

* **总开关**：变量值为 `NONE` 时，系统绝对不会保存一般查询日志和慢查询日志，即使 `general_log` 或 `slow_guery_log` 为 1 也没用。
* **日志输出形式**：如果变量值不为 `NONE`，说明总开关打开，启用这两个查询日志。
	- `FILE` ： 日志保存为文件
	- `TABLE` ： 日志保存到数据库中的表

无论从逻辑上还是从操作上看，把日志保存到文件和保存到数据库是不相冲突的，因此应该允许同时把日志保存到文件和数据库中。

可通过 `--log-output[=value,...]` 选项来为变量 `log_output` 赋值：

* 赋值时允许使用 `TABLE, FILE` 这样的列表，用逗号分隔
* `log_output` 默认值为 `FILE`。因此，如果没有使用 `--log-output` 选项，则会默认把日志保存为文件。
* 虽然有点儿傻，但如果赋值时列表中含有 `NONE`，则列表中其他值无效，总开关关闭，禁用日志。

###### 变量的配合使用

`log_output` 做为查询日志的总开关，控制是否启用，及输出的形式。

`general_log` 和 `slow_query_log` 做为二级开关需要与总开关配合使用。要想开启某个查询日志，**两层** 开关必须 **同时打开**。

以下范例使用命令行选项为变量赋值：

* 两种查询日志均开启，把日志同时保存到文件及数据库：`--log-output=FILE,TABLE --general_log=1 --slow_query_log=1`
* 两种查询日志均开启，把日志仅保存到数据库： `--log-output=TABLE --general_log --slow_query_log`
* 仅开启慢查询日志，仅保存为文件： `--log-output=FILE --slow_query_log`，或简写为 `--slow_query_log`，因为 `FILE` 是默认值


>选项简写说明：`--general_log=1` 可以简写为 `--general_log`，`--slow_query_log=1` 可简写为 `--slow_query_log`


##### `sql_log_off`

`sql_log_off` 为会话变量，布尔值。

该变量仅用于控制：对于 **当前连接**，是否启用日志。





#### 在启动服务时指定日志形式

`general_log` 和 `slow_query_log` 的布尔值即可以用 1/0 表示，也可以用 ON/OFF 表示。

在启动服务时通过选项以 `--log-output=FILE`，`--general_log=1`，`--slow_query_log=1` 的形式来控制日志的开启。具体使用方法已在上文范例中演示。

当然还可以直接修改配置文件：

```bash
general_log=1
general_log_file=my_logs.txt
```





#### 在运行时设定日志形式

这些变量均可以在运行时设定：

`log_output`、`general_log`、`general_log_file`、`slow_query_log`、`slow_query_log_file`、`sql_log_off`。

```sql
SET GLOBAL log_output = 'TABLE';
SET GLOBAL general_log = 'ON';
```

















### 错误日志

错误日志中包含 mysqld 启动和关闭期间诸如错误、警告、通知这类诊断消息。





#### 错误日志系统变量


##### `log_error` 系统变量

默认的错误日志输出目标。因此 **错误日志保存到哪里** 是由这个变量决定的。

- 如果 `log_error` 变量值为 **文件名**，则日志文件保存为数据目录中的 `文件名.NN.json`，NN 从 00 开始计数。如 `filename.00.json`、`filename.01.json` 等。
- 如果变量值为 `stderr`，则日志输出到终端。

该变量可以通过 `--log-error[=file_name]` 来赋值。如果使用选项时未指定文件名，则默认文件名为数据目录中的 `host_name.err`。


##### `log_error_services` 系统变量

该变量用于控制在错误日志中 **启用哪些组件**，以及以什么 **顺序** 使用这些组件。

变量值为日志组件列表，用分号分隔。列表中的组件是按服务端执行它们的 **顺序** 排列的。这些组件要么是内建组件，要么必须提前用 `INSTALL COMPONENT` 安装到系统中。

服务端会按照 `log_error_services` 变量值中，各组件排列顺序来执行 filter 和 sink 的。

该变量的默认值为 `log_filter_internal; log_sink_internal`。表示日志事件首先通过内建组件 `log_filter_internal`，筛选出来的日志交给内建组件 `log_sink_internal`，把日志事件转换成日志消息格式，再输出到特定位置，如文件或系统日志。

如果 `log_error_services` 的变量值中没有 sink 组件，则不会有日志输出。


##### `log_error_verbosity` 系统变量

该变量决定着 `log_filter_internal` 组件应该筛选哪些日志事件。

* 变量值为 1 时，筛选错误消息
* 变量值为 2 时，筛选错误和警告消息
* 变量值为 3 时，筛选错误、警告、通知消息



##### `dragnet.log_error_filter_rules` 系统变量







#### 错误日志组件

日志的组件分两类：filter 和 sink

* filter ： 用于 **处理** 日志事件。如添加、删除、修改事件字段，或删除整条事件。把最后得到的事件 **传递** 给 `log_error_services` 变量中的下一个组件。
* sink ： sink 把日志事件 **格式化** 成日志消息，并将其 **写入** 相关输出，如日志文件或系统日志。


##### Filter 组件

filter 组件完成针对错误日志事件的 **筛选**，可以理解为日志的 **过滤器**。

* 要是没有启用 filter 组件，就不会进行筛选。
* `log_error_services` 变量中启用的 filter 组件仅对其 **后面的** sink 组件 **有作用**

###### `log_filter_internal` 组件

* 任务 ：基于 `log_error_verbosity` 系统变量进行日志的筛选。
* URN ：该组件为内建组件，使用前无需专门加载
* 允许多用途使用 ：是

如果未启用 `log_filter_internal` 组件，`log_error_verbosity` 变量就不会生效。

###### `log_filter_dragnet` 组件

* 任务 ：基于 `dragnet.log_error_filter_rules` 系统变量设定的规则进行日志的筛选。
* URN ：`file://component_log_filter_dragnet`
* 允许多用途使用 ：否


##### Sink 组件

sink 组件负责日志的 **写入**，可以理解为日志的 **书写器**。如果未启用任何 sink 组件，则不会有任何日志输出。

###### `log_sink_internal` 组件

* 任务 ：使用传统的错误日志消息的输出格式
* URN ：该组件为内建组件，使用前无需专门加载
* 允许多用途使用 ：否
* 输出 ：写入默认的错误日志输出

###### `log_sink_json` 组件

* 任务 ：使用 JSON 格式的错误日志
* URN ：`file://component_log_sink_json`
* 允许多用途使用 ：是
* 输出 ：基于 `log_error` 系统变量的设定


###### `log_sink_syseventlog` 组件

* 任务 ：把错误日志写入系统日志 `syslog`。
* URN ：`file://component_log_sink_syseventlog`
* 允许多用途使用 ：是
* 输出 ：写入系统日志

###### `log_sink_test` 组件

* 任务 ：主要用于内部测试，不用于生产
* URN ：`file://component_log_sink_test`
* 允许多用途使用 ：是
* 输出 ：写入默认的错误日志输出






#### 错误日志组件配置

在 MySQL 8.0 中，错误日志使用 MySQL 组件架构。错误日志子系统由组件和系统变量组成。其中，组件负责日志事件的 **过滤** 和 **写入**，系统变量用于配置特定组件，以实现所需的日志结果。


##### 错误日志的特点

* filter 组件对日志事件进行筛选，影响获取到的信息
* sink 组件负责日志事件的输出。可以启用多个 sink 组件，以实现向多目标输出日志
* 内建的 filter 和 sink 组件组合在一起形成默认的日志格式
* 通过可加载的 sink 组件，可以实现把错误日志写入系统日志
* 通过可加载的 sink 组件，可以实现 JSON 格式的错误日志
* 由系统变量控制启用哪个组件，及使用哪些规则来筛选日志


##### 修改日志组件

要想修改错误日志使用的组件，如果不是内建组件，需要先将其加载，然后修改 `log_error_services` 变量的值。

要想启用某个非内建的日志组件，先用 `INSTALL COMPONENT` 加载它，然后把它加入 `log_error_services` 变量。

要想禁用某个日志组件，先从 `log_error_services` 变量中将其移除，再用 `UNINSTALL COMPONET` 将其卸载。

如，想用 `log_sink_syseventlog` 组件来代替默认的 `log_sink_internal`，先要加载它，再修改 `log_error_services` 变量的值：

```sql
INSTALL COMPONENT 'file://component_log_sink_syseventlog';
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_syseventlog';
```

加载日志组件时所使用的 URN 是复合文件名，前缀为 `file://component_`。

###### 使用多个 sink 组件

可以设置多个 sink 组件，把日志输出到多个目标。

```sql
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_syseventlog';
```

恢复默认：

```sql
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal;'
UNINSTALL COMPONENT 'file://component_log_sink_syseventlog';
```

###### 保存对组件的修改

要想对组件的修改在服务启动时就自动生效：

* 如果组件可加载，则使用 `INSTALL COMPONENT` ，这会将该组件在系统表 `mysql.component` 中将其注册，以后服务端启动时就会自动加载了。
* 在配置文件 `my.cnf` 中设定 `log_error_services` 变量
* 在运行时使用 `SET PERSIST` 将立即生效，而且会保存，重启仍然有效


###### 范例

希望每次服务启动时，在默认配置基础上，额外再使用 `log_sink_json` 组件来保存日志。

如果没有加载，则先加载 JSON 组件：

```sql
INSTALL COMPONENT 'file://component_log_sink_json';
```

然后，在配置文件 `my.cnf` 中修改 `log_error_services` 变量：

```bash
[mysqld]
log_error_services='log_filter_internal; log_sink_internal; log_sink_json'
```

或者，也可以在运行时用 `SET PERSIST` 来修改变量：

```sql
SET PERSIST log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
```

一定要保证变量中各组件的顺序，如：

`log_filter_internal; log_sink_1; log_sink_2`

日志事件先由内建的 filter 筛选，然后交给第一个书写器，再交给第二个书写器。两个书写器都会收到筛选出来的日志事件。

再如：

`log_sink_1; log_filter_internal; log_sink_2`

日志事件先是传给第一个书写器，然后再由内建过滤器筛选，筛选后交给第二个书写器。

第一个书写器收到的是未经筛选的事件，第二个书写器收到的是经过筛选的事件。这样就可以得到一个完整的不分类的日志，和一个错误日志。































## MySQL Server 组件


MySQL Server 包含一个基于组件的架构，用来扩展其服务端功能。

* 组件可以为服务端和其它组件提供服务，组件之间仅通过它们提供的服务来交互
* 使用 `INSTALL COMPONENT` 和 `UNINSTALL COMPONENT` 语句来加载和卸载组件
* 加载服务用来处理组件的加载和卸载，并把已加载的组件放入 `mysql.component` 系统表中，作为注册表

用于控制组件的 SQL 语句对于服务端的运行以及 `mysql.component` 系统表有如下影响：

* `INSTALL COMPONENT` 把组件加载到服务端。组件会立即激活，加载服务还会把加载的组件注册到 `mysql.component` 系统表中。之后服务端重启时，`mysql.component` 中的所有组件都会被加载。
* `UNINSTALL COMPONENT` 会停用组件，并从服务端卸载。加载服务将其从 `mysql.component` 移除，下次重启不会加载。

查看系统当前已安装的组件：

```sql
SELECT * FROM mysql.component;
```
















































## 一台主机运行多个 MySQL 实例

有时需要在一台主机上同时运行多个 MySQL 的实例，如为了测试一个新版的 MySQL，同时不影响现有的版本，或者需要让不同的用户访问不同的 mysqld 服务端。

我们可以做到每个实例使用不同的 MySQL Server 二进制文件，或多个实例使用同一个二进制文件，或二者的任意组合。如，可以同时运行两个版本的 MySQL，以观察它们对待同一个工作流有什么区别。或者运行同一个版本的多个实例，每个实例管理不同的数据库。

不管是否使用不同的服务端二进制文件，每个运行的实例都必须给某些运行参数赋予唯一的值，以避免不同实例间的冲突。参数可以在命令行、配置文件设置，也可以通过设置环境变量实现。

要想查看某个实例使用的变量及值，可用 `SHOW VARIABLES` 语句。

MySQL 实例管理的主要资源是数据目录，每个实例应该使用不同的数据目录，用 `--datadir=` 选项指定。

除了使用不同的数据目录，每个服务端实例对于以下选项也要有不同的值：

`--port=port_num` ： 用于控制 TCP/IP 连接的端口号。或者，如果主机有不同的网址，也可以使用 `--bind-address` 让每个服务端侦听不同的地址。

`--socket={file_name|pipe_name}` ： 用于控制套接字文件路径。

`--pid-file=file_name` ： 服务端把其进程 ID 写到哪个文件中

`--general_log_file=file_name`

`--log-bin[=file_name]`

`--slow_query_log_file=file_name`

`--log-error[=file_name]`

`--tmpdir=dir_name` ： 为每个实例分配不同的物理磁盘，以分摊负载。

如果在不同位置有多个 MySQL 的安装文件，可以用 `--basedir=dir_name` 选项为每个安装文件设置各自的基准目录，这会促使每个安装文件都自动使用不同的数据目录、日志文件和 PID 文件，因为这些参数的默认值都与基准目录有关。于是，剩下需要指定的只有 `--socket` 和 `--port` 两个选项了。
