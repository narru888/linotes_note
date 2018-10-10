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
GRANT ALL PRIVILEGES ON *.* TO hawk@localhost IDENTIFIED BY ’something’ WITH GRANT OPTION;
```


#### 为用户修改密码

```sql

``
