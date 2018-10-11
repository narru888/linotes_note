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







## 用户管理





### 新建用户


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
ALTER | Enable use of ALTER TABLE. | 全局，库，表
ALTER ROUTINE | Enable stored routines to be altered or dropped. | 全局，库，例程
CREATE | Enable database and table creation. | 全局，库，表
CREATE ROUTINE | Enable stored routine creation. | 全局，库
CREATE TABLESPACE | Enable tablespaces and log file groups to be created, altered, or dropped. | 全局
CREATE TEMPORARY TABLES | Enable use of CREATE TEMPORARY TABLE. | 全局，库
CREATE USER | Enable use of CREATE USER, DROP USER, RENAME USER, and REVOKE ALL PRIVILEGES. | 全局
CREATE VIEW | Enable views to be created or altered. | 全局，库，表
DELETE | Enable use of DELETE. | 全局，库，表
DROP | Enable databases, tables, and views to be dropped. | 全局，库，表
EVENT | Enable use of events for the Event Scheduler. | 全局，库
EXECUTE | Enable the user to execute stored routines. | 全局，库，例程
FILE | Enable the user to cause the server to read or write files. | 全局
GRANT OPTION | Enable privileges to be granted to or removed from other accounts. | 全局，库，表，例程，代理
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

权限 | 说明
--- | ---
AUDIT_ADMIN | Enable audit log configuration. | 全局
BINLOG_ADMIN | Enable binary log control. | 全局
CONNECTION_ADMIN | Enable connection limit/restriction control. | 全局
ENCRYPTION_KEY_ADMIN | Enable InnoDB key rotation. | 全局
FIREWALL_ADMIN | Enable firewall rule administration, any user. | 全局
FIREWALL_USER | Enable firewall rule administration, self. | 全局
GROUP_REPLICATION_ADMIN | Enable Group Replication control. | 全局
REPLICATION_SLAVE_ADMIN | Enable regular replication control. | 全局
ROLE_ADMIN | Enable use of WITH ADMIN OPTION. | 全局
SET_USER_ID | Enable setting non-self DEFINER values. | 全局
SYSTEM_VARIABLES_ADMIN | Enable modifying or persisting global system variables. | 全局
VERSION_TOKEN_ADMIN | Enable use of Version Tokens UDFs. | 全局
