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

权限 | 说明
--- | ---
ALL [PRIVILEGES] | 特定访问级别的所有权限，但不包括 GRANT OPTION 与 PROXY
ALTER | Enable use of ALTER TABLE. Levels: Global, database, table.
ALTER ROUTINE | Enable stored routines to be altered or dropped. Levels: Global, database, routine.
CREATE | Enable database and table creation. Levels: Global, database, table.
CREATE ROUTINE | Enable stored routine creation. Levels: Global, database.
CREATE TABLESPACE | Enable tablespaces and log file groups to be created, altered, or dropped. Level: Global.
CREATE TEMPORARY TABLES | Enable use of CREATE TEMPORARY TABLE. Levels: Global, database.
CREATE USER | Enable use of CREATE USER, DROP USER, RENAME USER, and REVOKE ALL PRIVILEGES. Level: Global.
CREATE VIEW | Enable views to be created or altered. Levels: Global, database, table.
DELETE | Enable use of DELETE. Level: Global, database, table.
DROP | Enable databases, tables, and views to be dropped. Levels: Global, database, table.
EVENT | Enable use of events for the Event Scheduler. Levels: Global, database.
EXECUTE | Enable the user to execute stored routines. Levels: Global, database, routine.
FILE | Enable the user to cause the server to read or write files. Level: Global.
GRANT OPTION | Enable privileges to be granted to or removed from other accounts. Levels: Global, database, table, routine, proxy.
INDEX | Enable indexes to be created or dropped. Levels: Global, database, table.
INSERT | Enable use of INSERT. Levels: Global, database, table, column.
LOCK TABLES | Enable use of LOCK TABLES on tables for which you have the SELECT privilege. Levels: Global, database.
PROCESS | Enable the user to see all processes with SHOW PROCESSLIST. Level: Global.
PROXY | Enable user proxying. Level: From user to user.
REFERENCES | Enable foreign key creation. Levels: Global, database, table, column.
RELOAD | Enable use of FLUSH operations. Level: Global.
REPLICATION CLIENT | Enable the user to ask where master or slave servers are. Level: Global.
REPLICATION SLAVE | Enable replication slaves to read binary log events from the master. Level: Global.
SELECT | Enable use of SELECT. Levels: Global, database, table, column.
SHOW DATABASES | Enable SHOW DATABASES to show all databases. Level: Global.
SHOW VIEW | Enable use of SHOW CREATE VIEW. Levels: Global, database, table.
SHUTDOWN | Enable use of mysqladmin shutdown. Level: Global.
SUPER | Enable use of other administrative operations such as CHANGE MASTER TO, KILL, PURGE BINARY LOGS, SET GLOBAL, and mysqladmin debug command. Level: Global.
TRIGGER | Enable trigger operations. Levels: Global, database, table.
UPDATE | Enable use of UPDATE. Levels: Global, database, table, column.
USAGE | Synonym for “no privileges”


#### 可授予、可撤消的动态权限

权限 | 说明
--- | ---
AUDIT_ADMIN | Enable audit log configuration. Level: Global.
BINLOG_ADMIN | Enable binary log control. Level: Global.
CONNECTION_ADMIN | Enable connection limit/restriction control. Level: Global.
ENCRYPTION_KEY_ADMIN | Enable InnoDB key rotation. Level: Global.
FIREWALL_ADMIN | Enable firewall rule administration, any user. Level: Global.
FIREWALL_USER | Enable firewall rule administration, self. Level: Global.
GROUP_REPLICATION_ADMIN | Enable Group Replication control. Level: Global.
REPLICATION_SLAVE_ADMIN | Enable regular replication control. Level: Global.
ROLE_ADMIN | Enable use of WITH ADMIN OPTION. Level: Global.
SET_USER_ID | Enable setting non-self DEFINER values. Level: Global.
SYSTEM_VARIABLES_ADMIN | Enable modifying or persisting global system variables. Level: Global.
VERSION_TOKEN_ADMIN | Enable use of Version Tokens UDFs. Level: Global.
