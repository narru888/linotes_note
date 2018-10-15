---
toc: true
toc_label: "MySQL 常用命令"
toc_icon: "copy"
title: "MySQL 常用命令"
tags: mysql 命令
categories: "mysql"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/mysql.jpg
  overlay_filter: rgba(0, 0, 0, 0.8)
---





## 全局


### 登陆 MySQL

```bash
mysql -h host -u user -p
```

登陆时指定数据库名称：

```bash
mysql -h host -u user -p db_name
```



























## 管理操作





### 用户管理


#### 创建用户

```sql
CREATE USER 'hawk'@'%' IDENTIFIED BY 'password';
CREATE USER 'hawk'@'localhost' IDENTIFIED BY 'password'
CREATE USER 'hawk'@'192.168.1.101' DEFAULT ROLE administrator, developer;
CREATE USER 'hawk'@'localhost' WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
CREATE USER 'hawk'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
```


#### 删除用户

```sql
DROP USER 'hawk'@'localhost';
```


#### 为用户分配权限

```sql
GRANT ALL ON db.* TO 'hawk'@'localhost';
GRANT ALL ON *.* TO 'hawk'@'localhost' IDENTIFIED BY ’something’ WITH GRANT OPTION;
GRANT SELECT,INSERT ON test.* TO 'hawk'@'%';
```


#### 撤消用户权限

```sql
REVOKE INSERT ON *.* FROM 'hawk'@'localhost';
REVOKE 'role1', 'role2' FROM 'hawk'@'localhost', 'user2'@'localhost';
REVOKE SELECT ON world.* FROM 'role3';
```


#### 为用户修改密码

```sql
SET PASSWORD FOR 'neo'@'%' = PASSWORD('password');
ALTER USER 'hawk'@'localhost' IDENTIFIED BY 'newpassword'
```




























## 数据定义





### 库操作



#### 创建库

```sql
CREATE DATABASE db_name;
CREATE DATABASE IF NOT EXISTS southwind;
```



#### 查看库的创建参数

```sql
SHOW CREATE DATABASE db_name
```



#### 查看库列表

```sql
SHOW DATABASES;
```



#### 配置默认库

切换到某个库，从而随后的命令都默认是针对该库进行操作的。

```sql
USE db_name;
```



#### 查看默认库

查看当前默认操作哪个库。

```sql
SELECT DATABASE();
```



#### 删除库

```sql
DROP DATABASE db_name
DROP DATABASE IF EXISTS southwind;
```

```bash
$ sudo mysqladmin -u root -p drop db_name
```






### 表操作



#### 查看当前库中的所有表

```sql
SHOW TABLES;
```



#### 查看表的结构

```sql
DESCRIBE tbl_name;
```



#### 创建表


##### 语法：

```sql
CREATE TABLE [IF NOT EXISTS] table_name(
    column_list
) ENGINE=storage_engine;
```

其中 column_list 的语法：

```sql
column_name data_type(length) [NOT NULL] [DEFAULT value] [AUTO_INCREMENT]
```


##### 范例：

###### 新建空表

```sql
CREATE TABLE IF NOT EXISTS tasks (
    task_id INT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    start_date DATE,
    due_date DATE,
    status TINYINT NOT NULL,
    priority TINYINT NOT NULL,
    description TEXT,
    PRIMARY KEY (task_id)
)  ENGINE=INNODB;
```

```sql
CREATE TABLE IF NOT EXISTS products (
     productID    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
     productCode  CHAR(3)       NOT NULL DEFAULT '',
     name         VARCHAR(30)   NOT NULL DEFAULT '',
     quantity     INT UNSIGNED  NOT NULL DEFAULT 0,
     price        DECIMAL(7,2)  NOT NULL DEFAULT 99999.99,
     PRIMARY KEY  (productID)
   );
```


###### 从现有表创建

```sql
CREATE TABLE NewTable AS
SELECT name, age
FROM OldTable
WHERE age > 25;
```

原表中的数据会携带过来，相当于另存为新表。



#### 查看表的创建参数

```sql
SHOW CREATE TABLE tbl_name \G
```



#### 修改表参数


##### 增加字段

```sql
ALTER TABLE t2 ADD COLUMN
```


##### 删除字段

```sql
ALTER TABLE t2 DROP COLUMN c, DROP COLUMN d;
```


##### 修改字段

```sql
ALTER TABLE tbl_name
CHANGE COLUMN old_name new_name INT(11) NOT NULL AUTO_INCREMENT;
```


#### 删除表

```sql
DROP TABLE IF EXISTS tbl_name;
```



























## 数据操作






### 插入行

插入一行

```sql
INSERT INTO products VALUES (1001, 'PEN', 'Pen Red', 5000, 1.23);
```

插入多行

```sql
INSERT INTO products VALUES
	(NULL, 'PEN', 'Pen Blue',  8000, 1.25),
	(NULL, 'PEN', 'Pen Black', 2000, 1.25);
```

插入多行，仅为特定字段赋值。

```sql
INSERT INTO products (productCode, name, quantity, price) VALUES
	('PEC', 'Pencil 2B', 10000, 0.48),
	('PEC', 'Pencil 2H', 8000, 0.49);
```











### 删除行

```sql
DELETE FROM products WHERE productID = 1006;
```













### 查询行

```sql
SELECT name, price FROM products;
SELECT * FROM products;
```




#### 非表操作


##### 计算

```sql
SELECT 1+1;
+-----+
| 1+1 |
+-----+
|   2 |
+-----+
1 row in set (0.00 sec)
```


##### 现在时刻

```sql
SELECT NOW();
+---------------------+
| NOW()               |
+---------------------+
| 2012-10-24 22:13:29 |
+---------------------+
1 row in set (0.00 sec)
```


##### 同时执行多条语句

```sql
SELECT 1+1, NOW();
+-----+---------------------+
| 1+1 | NOW()               |
+-----+---------------------+
|   2 | 2012-10-24 22:16:34 |
+-----+---------------------+
1 row in set (0.00 sec)
```




#### 比较操作

```sql
SELECT name, price FROM products WHERE price < 1.0;
SELECT name, quantity FROM products WHERE quantity <= 2000;
SELECT name, price FROM products WHERE productCode = 'PEN';
```




#### 字符串匹配

用 `LIKE`、`NOT LIKE` 进行匹配。

* `abc%` 匹配以 `abc` 开头的字符串
* `___` 匹配三个字符组成的字符串
* `a_b%` 匹配：以 `a` 开头，接着是一个任意字符，然后是一个 `b`，接着是任意位的字符

```sql
SELECT name, price FROM products WHERE name LIKE 'PENCIL%';
SELECT name, price FROM products WHERE name LIKE 'P__%';
```




#### 算术运算符

可以使用算术运算符进行数学计算。

运算符 | 说明
--- | ---
+  |  加
- | 减
* | 乘
/ | 除
DIV  |  整除
%  |  取余




#### 逻辑运算符

可以用布尔值来组合多个条件。

```sql
SELECT * FROM products WHERE quantity >= 5000 AND name LIKE 'Pen %';
SELECT * FROM products WHERE quqntity >= 5000 AND price < 1.24 AND name LIKE 'Pen %';
SELECT * FROM products WHERE NOT (quantity >= 5000 AND name LIKE 'Pen %');
```




#### `IN`、`NOT IN`

为过滤的字段提供几个可能的备选值。

```sql
SELECT * FROM products WHERE name IN ('Pen Red', 'Pen Black');
```




#### `BETWEEN`、`NOT BETWEEN`

指定过滤字段值的范围。

```sql
SELECT * FROM products
WHERE (price BETWEEN 1.0 and 2.0)  AND (quantity BETWEEN 1000 AND 2000);
```




#### `IS NULL`、`IS NOT NULL`

`NULL` 是个特殊的值，代表该字段没有值、值丢失或值未知。用 `IS NULL` 与 `IS NOT NULL` 可以检查该字段是否包含 `NULL`。


```sql
SELECT * FROM products WHERE productCode IS NULL;
```




#### `ORDER BY`

查询结果如何排序，默认为正序。

```sql
SELECT * FROM products WHERE name LIKE 'Pen %' ORDER BY price DESC;
SELECT * FROM products WHERE name LIKE 'Pen %' ORDER BY price DESC, quantity;
```

第二条是先按 price 倒序排列，其次按 quantity 正序排列（默认值）。

```sql
SELECT * FROM products ORDER BY RAND();
```

将查询结果，即各个行随机排序。





#### `LIMIT`

限定查询结果所显示的行数。

```sql
SELECT * FROM products ORDER BY price LIMIT 2;
```

仅显示头两行。

```sql
SELECT * FROM products ORDER BY price LIMIT 2, 1;
```

跳过前 2 行，显示之后的第 1 行，即第 3 行。

因此，如果想要查看结果中的第 10 ~ 15 行：

```sql
SELECT * FROM products ORDER BY price LIMIT 9, 6;
```




#### `AS` 别名

可以用 `AS` 来为字段名、表名定义别名，这些别名可以用来在显示结果中做为表头，也可以在命令中直接引用。

```sql
SELECT productID AS ID, productCode AS Code,
	name AS Description, price AS `Unit Price`		-- 定义的别名用于返回结果做为表头
FROM products
ORDER BY ID;									-- 定义的别名在同一语句中可以直接引用
```

因为 Unit Price 中间包含空格，所以需用 **反引号** 括起来。
{: .notice--success}




#### `CONCAT()` 函数

用该函数可以把多个字段连接在一起，在查询结果中作为一个字段显示。

```sql
SELECT CONCAT(productCode, ' - ', name) AS `Product Description`, price FROM products;
+---------------------+-------+
| Product Description | price |
+---------------------+-------+
| PEN - Pen Red       |  1.23 |
| PEN - Pen Blue      |  1.25 |
| PEN - Pen Black     |  1.25 |
| PEC - Pencil 2B     |  0.48 |
| PEC - Pencil 2H     |  0.49 |
+---------------------+-------+
```









### 生成汇总报表

要想生成汇总报表，经常会需要把相关的行 **合并** 在一起。




#### `DISTINCT`

每个字段可能包含重复的值，可以用 `DISTINCT` 来去掉重复，也可以将其用于多个字段。

```sql
SELECT DISTINCT price AS `Distinct Price` FROM products;
SELECT DISTINCT price, name FROM products;
```




#### `GROUP BY`

用 `GROUP BY` 可以把多条特定字段值相同的记录拆分开来。单独使用没什么意义，通常需要与各种统计函数配合使用。

如：

```sql
SELECT * FROM products ORDER BY productCode, productID;
+-----------+-------------+-----------+----------+-------+
| productID | productCode | name      | quantity | price |
+-----------+-------------+-----------+----------+-------+
|      1004 | PEC         | Pencil 2B |    10000 |  0.48 |
|      1005 | PEC         | Pencil 2H |     8000 |  0.49 |
|      1001 | PEN         | Pen Red   |     5000 |  1.23 |
|      1002 | PEN         | Pen Blue  |     8000 |  1.25 |
|      1003 | PEN         | Pen Black |     2000 |  1.25 |
+-----------+-------------+-----------+----------+-------+
```

```sql
SELECT * FROM products GROUP BY productCode;
+-----------+-------------+-----------+----------+-------+
| productID | productCode | name      | quantity | price |
+-----------+-------------+-----------+----------+-------+
|      1004 | PEC         | Pencil 2B |    10000 |  0.48 |
|      1001 | PEN         | Pen Red   |     5000 |  1.23 |
+-----------+-------------+-----------+----------+-------+
```

每个组中只显示第一条记录。




#### `GROUP BY` + 统计函数

常用的统计函数如：`COUNT`、`MAX`、`MIN`、`AVG`、`SUM`、`STD`、`GROUP_CONCAT`

可以对每个组应用统计函数，以组为单位来生成汇总报表。


##### `COUNT`

`COUNT(*)` 会返回查询所匹配行的总数，`COUNT(columnName)` 仅统计指定字段非空值的数量。

```sql
SELECT COUNT(*) AS `Count` FROM products;
+-------+
| Count |
+-------+
|     5 |
+-------+
```

```sql
SELECT productCode, COUNT(*) AS `Total` FROM products GROUP BY productCode;
+-------------+----------+
| productCode | COUNT(*) |
+-------------+----------+
| PEC         |        2 |
| PEN         |        3 |
+-------------+----------+
```

```sql
SELECT productCode, COUNT(*) AS count
FROM products
GROUP BY productCode
ORDER BY count DESC;
+-------------+-------+
| productCode | count |
+-------------+-------+
| PEN         |     3 |
| PEC         |     2 |
+-------------+-------+
```


##### `MAX`、`MIN`、`AVG`、`STD`、`SUM`

```sql
SELECT MAX(price), MIN(price), AVG(price), STD(price), SUM(quantity)
FROM products;
+------------+------------+------------+------------+---------------+
| MAX(price) | MIN(price) | AVG(price) | STD(price) | SUM(quantity) |
+------------+------------+------------+------------+---------------+
|       1.25 |       0.48 |   0.940000 |   0.371591 |         33000 |
+------------+------------+------------+------------+---------------+
```

```sql
SELECT productDoce, MAX(price) AS `Highest Price`, MIN(price) AS `Lowest Price`
FROM products
GROUP BY producCode;
+-------------+---------------+--------------+
| productCode | Highest Price | Lowest Price |
+-------------+---------------+--------------+
| PEC         |          0.49 |         0.48 |
| PEN         |          1.25 |         1.23 |
+-------------+---------------+--------------+
```

```sql
SELECT productCode, MAX(price), MIN(price),
	CAST(AVG(price) AS DECIMAL(7,2)) AS `Average`,
	CAST(STD(price) AS DECIMAL(7,2)) AS `Std Dev`,
	SUM(quantity)
FROM products
GROUP BY productCode;
+-------------+------------+------------+---------+---------+---------------+
| productCode | MAX(price) | MIN(price) | Average | Std Dev | SUM(quantity) |
+-------------+------------+------------+---------+---------+---------------+
| PEC         |       0.49 |       0.48 |    0.49 |    0.01 |         18000 |
| PEN         |       1.25 |       1.23 |    1.24 |    0.01 |         15000 |
+-------------+------------+------------+---------+---------+---------------+
```

`CAST` 的作用是转换数据类型。



#### `HAVING`

该子句与 `WHERE` 类似，但 `HAVING` 可以和 `GROUP BY` 统计函数配合使用，而 `WHERE` 只能进行字段操作。

```sql
SELECT
	productCode AS `Product Code`,
	COUNT(*) AS `Count`,
	CAST(AVG(price) AS DECIMAL(7,2)) AS `Average`
FROM products
GROUP BY productCode
HAVING Count >=3;
+--------------+-------+---------+
| Product Code | Count | Average |
+--------------+-------+---------+
| PEN          |     3 |    1.24 |
+--------------+-------+---------+
```




#### `WITH ROLLUP`

`WITH ROLLUP` 是对 `GROUP BY` 所返回的所有记录进行一个汇总。

```sql
SELECT
	productCode,
	MAX(price),
	MIN(price),
	CAST(AVG(price) AS DECIMAL(7,2)) AS `Average`,
	SUM(quantity)
FROM products
GROUP BY productCode
WITH ROOLLUP;
+-------------+------------+------------+---------+---------------+
| productCode | MAX(price) | MIN(price) | Average | SUM(quantity) |
+-------------+------------+------------+---------+---------------+
| PEC         |       0.49 |       0.48 |    0.49 |         18000 |
| PEN         |       1.25 |       1.23 |    1.24 |         15000 |
| NULL        |       1.25 |       0.48 |    0.94 |         33000 |
+-------------+------------+------------+---------+---------------+
```












### 修改数据

使用 `UPDATE` 语句来修改数据。





#### 语法

```sql
UPDATE tableName SET columnName = {value|NULL|DEFAULT}, ... WHERE criteria
```





#### 修改所有数据

```sql
UPDATE products SET price = price * 1.1;
```




#### 修改部分记录

```sql
UPDATE products SET quantity = quantity - 100 WHERE name = 'Pen Red';
```




#### 修改多个值

```sql
UPDATE products SET quantity = quantity + 50, price = 1.23 WHERE name = 'Pen Red';
```












### 删除记录

使用 `DELETE FROM` 语句可以从表中删除记录。




#### 删除部分记录

```sql
DELETE FROM products WHERE name LIKE 'Pencil%';
```




#### 删除全部记录

```sql
DELETE FROM products;
```

表中全部记录将被删除，**无法恢复**。
{: .notice--warning}











### 导入/导出数据




#### `LOAD DATA LOCAL INFILE ... INTO TABLE ...`

可以把原始数据保存到文本文件，然后使用 `LOAD DATA` 语句加载到表中。

例如保存为 `.csv` 文件，并用逗号分隔。

```
\N,PEC,Pencil 3B,500,0.52
\N,PEC,Pencil 4B,200,0.62
\N,PEC,Pencil 5B,100,0.73
\N,PEC,Pencil 6B,500,0.47
```

导入：

```sql
LOAD DATA LOCAL FILE '~/Documents/products_in.csv' INTO TABLE products
	COLUMNS TERMINATED BY ',';
```

注意：

* 默认的行分隔符为 `\n`，如果是在 windows 中编辑的，则需使用 `\r\n`。
* 默认的字段分隔符为 tab，如果使用其它的符号，如逗号，则需要用 `COLUMNS TERMINATED BY ','` 来说明。
* 如果是空值，需用 `\N` 来表示。




#### `mysqlimport`

`mysqlimport` 是一个工具，可用来从文本文件中导入数据。文本文件需以 `.tsv` 为后缀，文件名必须与表名相同。

```bash
$ mysqlimport -u root -p --local southwind ~/Documents/products.tsv
```




#### `SELECT ... INTO OUTFILE ...`

用该语句可以将指定数据导出为文件。

```sql
SELECT * FROM products INTO OUTFILE '~/Documents/products_out.csv'
	COLUMNS TERMINATED BY ','
	LINES TERMINATED BY ',';
```











### 使用 SQL 脚本

除了使用单条语句，还可以把 SQL 语句保存在一个文本文件中，称为 SQL 脚本，来运行该脚本。通常保存为 `.sql` 文件。

例如脚本内容为：

```sql
DELETE FROM products;
INSERT INTO products VALUES (2001, 'PEC', 'Pencil 3B', 500, 0.52),
							(NULL, 'PEC', 'Pencil 4B', 200, 0.62),
							(NULL, 'PEC', 'Pencil 5B', 100, 0.73),
							(NULL, 'PEC', 'Pencil 6B', 500, 0.47);
SELECT * FROM products;
```

在 MySQL	中，使用 `source` 命令运行脚本 ：

```sql
source ~/Documents/load_products.sql
```

或者在命令行中将脚本重定向，用 mysql 客户端程序的批处理模式来执行：

```bash
$ mysql -u root -p southwind < ~/Documents/load_products.sql
```



















































## 附表





### 用户权限列表


#### 访问级别

即 Privilege Level。

* `*`
* `*.*`
* `db_name.*`
* `db_name.tbl_name`
* `tbl_name`
* `db_name.routine_name`


#### 可授予、可撤消的静态权限

权限 | 授权的操作 | 访问级别
--- | --- | ---
ALL [PRIVILEGES] | 所有权限，但不包括 GRANT OPTION 与 PROXY | 特定级别
ALTER | `ALTER TABLE` | 全局，库，表
ALTER ROUTINE | 修改、删除存储例程 | 全局，库，例程
CREATE | 创建库和表 | 全局，库，表
CREATE ROUTINE | 创建存储例程 | 全局，库
CREATE TABLESPACE | 创建、修改、删除表空间及日志文件组 | 全局
CREATE TEMPORARY TABLES | `CREATE TEMPORARY TABLE` | 全局，库
CREATE USER | `CREATE USER`，`DROP USER`，`RENAME USER`，`REVOKE ALL PRIVILEGES` | 全局
CREATE VIEW | 创建、修改视图 | 全局，库，表
DELETE | `DELETE` | 全局，库，表
DROP | 删除库、表、视图 | 全局，库，表
EVENT | 使用事件，用于事件调度 | 全局，库
EXECUTE | 执行存储例程 | 全局，库，例程
FILE | 用户可以让服务端读写文件 | 全局
GRANT OPTION | 为他人授予、撤消权限 | 全局，库，表，例程，代理
INDEX | 创建、删除索引 | 全局，库，表
INSERT | `INSERT` | 全局，库，表，字段
LOCK TABLES | `LOCK TABLES`，需有 `SELECT` 权限 | 全局，库
PROCESS | `SHOW PROCESSLIST` | 全局
PROXY | 用户代理 | 用户之间
REFERENCES | 创建外键 | 全局，库，表，字段
RELOAD | `FLUSH` 操作 | 全局
REPLICATION CLIENT | 用户可以查询哪些是主、从服务器 | 全局
REPLICATION SLAVE | 从服务器读取主服务器的 binlog | 全局
SELECT | `SELECT` | 全局，库，表，字段
SHOW DATABASES | `SHOW DATABASES` | 全局
SHOW VIEW | `SHOW CREATE VIEW` | 全局，库，表
SHUTDOWN | `mysqladmin shutdown` | 全局
SUPER | 其它管理操作，如 `CHANGE MASTER TO`，`KILL`，`PURGE BINARY LOGS`，`SET GLOBAL`，`mysqladmin` | 全局
TRIGGER | 触发器操作 | 全局，库，表
UPDATE | UPDATE | 全局，库，表，字段
USAGE | 无权限 |


#### 可授予、可撤消的动态权限

权限 | 说明 | 访问级别
--- | --- | ---
AUDIT_ADMIN | 配置审计日志 | 全局
BINLOG_ADMIN | 控制二进制日志 | 全局
CONNECTION_ADMIN | 控制连接限制 | 全局
ENCRYPTION_KEY_ADMIN | InnoDB 密钥轮换 | 全局
FIREWALL_ADMIN | 管理所有用户的防火墙规则 | 全局
FIREWALL_USER | 管理自己的防火墙规则 | 全局
GROUP_REPLICATION_ADMIN | 控制组复制 | 全局
REPLICATION_SLAVE_ADMIN | 控制普通复制 | 全局
ROLE_ADMIN | `WITH ADMIN OPTION` | 全局
SET_USER_ID | 为其他用户设置 `DEFINER` 值 | 全局
SYSTEM_VARIABLES_ADMIN | 修改或保持全局系统变量 | 全局
VERSION_TOKEN_ADMIN | Enable use of Version Tokens UDFs. | 全局
