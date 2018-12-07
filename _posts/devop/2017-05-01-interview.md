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

修改 /etc/security/limits.conf：

```conf
* soft nofile 10240
* hard nofile 10240
```

通过修改该配置文件中的最大文件描述符数量实现，重启后生效
如何查看http的并发请求数与其TCP连接状态
ss -s
netstat -n | awk '/^tcp/{a[$NF]++} END{for(i in a){print i,a[i]}}'
Linux如何挂载windows下的共享目录
mount.cifs //192.168.1.6/movie /mnt/win -o user=neo,password=matrix
mount -t cifs -o username=neo,password=matrix //192.168.1.6/movie /mnt/win
