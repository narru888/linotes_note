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


### 系统配置


#### 修改 http 的最大并发请求数

查看当前最大并发数的配置：

```bash
$ ulimit -n
```

修改 /etc/security/limits.conf：

```conf
* soft nofile 10240
* hard nofile 10240
neo hard nofile 10240
```

第一列可以指定用户或组，也可使用 `*` 和 `%` 通配符。指定组时，组名前面加 `@`，如 `@admin`。修改后需 **重启** 系统才能生效。

`*` 代表作用于所有用户，第三行的 `neo` 是指定用户名。

`hard` 限定的值只能由管理员配置，对于用户来说，该值是上限，不可逾越。

`soft` 所限定的值用户自己可以用 `ulimit -S -n 1024` 调整，但不可超过 hard 值。

`nofile` ：Number of Open file descriptors，即文件描述符总数的上限。


#### 挂载 windows 的共享目录

```bash
$ sudo mkdir /mnt/win
$ sudo mount.cifs -o user=neo,password=matrix //192.168.1.6/movie /mnt/win
# 或
$ sudo mount -t cifs -o username=neo,password=matrix //192.168.1.6/movie /mnt/win
```








### 系统状态


#### 查看 http 并发请求数以及 TCP 连接状态

```bash
$ ss -s

Total: 593
TCP:   6 (estab 1, closed 1, orphaned 0, timewait 0)

Transport Total     IP        IPv6
RAW      1         0         1        
UDP      8         4         4        
TCP      5         3         2        
INET      14        7         7        
FRAG      0         0         0
#或

$ netstat -n | awk '/^tcp/{a[$NF]++} END{for(i in a){print i,a[i]}}'

```


#### 如何用 tcpdump 嗅探 80 端口的访问，看看谁最高？

```bash
$ sudo tcpdump -i ens33 -tnn dst port 80 -c 1000 \
| awk '/^IP/{print $2}' \
| awk -F. '{print $1 "." $2 "." $3 "." $4}' \
| uniq -c | sort -rn

tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on ens33, link-type EN10MB (Ethernet), capture size 262144 bytes
20 packets captured
21 packets received by filter
0 packets dropped by kernel
      24 192.168.1.19
      2 192.168.1.16
```

`-i` ：指定监听的网卡

`-t` ：不显示每行的时间戳

`-n` ：不转换地址，如把 IP 地址转换为主机名，把端口号转换为服务名

`-nn` ：不转换协议和端口号，不把地址转换为主机名

`-c` ：count，抓包数量







### 文件系统


#### 统计 /var/log 目录中的文件总数

```bash
$ sudo ls -lR /var/log/ | grep "^-" | wc -l
53
```

`-R` ：列出子目录的内容
