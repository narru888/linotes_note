---
toc: true
toc_label: "常见的网站架构"
toc_icon: "copy"
title: "常见的网站架构"
tags: 架构
categories: "framework"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/frames.jpg
  overlay_filter: rgba(0, 0, 0, 0.8)
---


适用业务：电商、门户、招聘网站

开发语言：PHP、JAVA

WEB 服务：Nginx、Tomcat

数据库：MySQL、MariaDB

操作系统：CentOS 7

界面层 > 业务逻辑层 > 数据访问层






## 初期

* 单台服务器
* WEB 与 DB 独立部署
* 动静分离初期
* 数据库主从，查询缓存
* 七层负载均衡，共享存储






### 单台服务器

`Nginx + PHP-FPM + MySQL`

很少的用户访问量。







### 应用服务器与数据服务器分离

`Nginx + PHP-FPM` <=> `MySQL`

有一定的访问量之后，单台服务器的性能会吃紧。此时若要提高并发能力，可以增加一台服务器，将 HTTP 请求与 SQL 操作负载分离。







### 动静分离 - 初期

`Nginx` <=> `Nginx + PHP-FPM` <=> `MySQL`

`Nginx` <=> `Tomcat` <=> `MySQL`

将静态页面与动态内容分开部署。如把 `Nginx` 做为静态服务器，`Nginx + PHP-FPM` 做为动态服务器。

这种架构带来一个问题：静态、动态服务器中提供的数据需要及时 **同步**。常见的同步方案如 `Inotify + Rsync`。

{% include figure image_path="/assets/images/frm.01.dyn.stat.png" alt="" %}





### DB 主从，查询缓存

建议开发人员将频繁的查询结果先放到内存缓存中，之后相同的请求由内存提供。





#### Redis Caching

用 Redis 缓存数据库查询结果，将热数据放在内存中，提高查询速度，减少对数据库的请求。


#### MySQL 主从

基于 binlog 的异步复制。


#### HA

`MySQL + Keepalived`





















## 中期

* DB 架构扩展
* SOA 面向服务架构
* DNS 轮询，DB 全文检索引擎
* 静态缓存服务器
* 分布式文件系统与CDN



























## 后期

* 弹性伸缩
* 微服务
* NoSQL
* 内存化
* 异地容灾，应急预案
