---
toc: true
toc_label: "系统运维常见面试题"
toc_icon: "copy"
title: "系统运维常见面试题"
tags: 运维 面试题
categories: "devop"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/matrix2.jpg
  overlay_filter: rgba(0, 0, 0, 0.8)
---


## 系统配置


### 修改 http 的最大并发请求数

查看当前最大并发数的配置：

```bash
$ ulimit -n
```

修改 /etc/security/limits.conf：

```conf
* soft nofile 10240
* hard nofile 10240
```

通过修改该配置文件中的最大文件描述符数量实现，重启后生效


### 挂载 windows 的共享目录

```bash
$ mount.cifs //192.168.1.6/movie /mnt/win -o user=neo,password=matrix
$ mount -t cifs -o username=neo,password=matrix //192.168.1.6/movie /mnt/win
```






## 系统状态

### 查看 http 并发请求数以及 TCP 连接状态

```bash
$ ss -s
$ netstat -n | awk '/^tcp/{a[$NF]++} END{for(i in a){print i,a[i]}}'
```
