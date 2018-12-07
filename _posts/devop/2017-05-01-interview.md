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

#### Linux 启动顺序

* BIOS
* MBR
* GRUB
* Linux 内核
* 启动 systemd
* 读取配置文件
* sysinit.target
* basic.target
* multi-user.target
* graphical.target


#### 修改 http 的最大并发请求数

查看当前最大并发数的配置：

```bash
$ ulimit -n
1024
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
ESTABLISHED 12
```


#### 用 tcpdump 嗅探对本地 80 端口的访问流量，列出访问量最大的 IP 地址

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


#### 查看连接到本机的每个 IP 的连接数量

```bash
netstat -n
Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State      
tcp        0    304 192.168.1.9:22          192.168.1.6:14148       ESTABLISHED
udp      832      0 192.168.1.9:51696       192.168.1.5:53          ESTABLISHED
udp6       0      0 fe80::d558:6d:c1d:51207 fe80::1:53              ESTABLISHED
Active UNIX domain sockets (w/o servers)
Proto RefCnt Flags       Type       State         I-Node   Path
unix  3      [ ]         DGRAM                    15623    /run/systemd/notify
unix  20     [ ]         DGRAM                    15634    /run/systemd/journal/dev-log
unix  8      [ ]         DGRAM                    15642    /run/systemd/journal/socket
```

我们只需要取 **tcp** 开头的行，第 **5** 列的值，如 192.168.1.6:14148，把 **端口号** 去掉，**统计** 总数。

```bash
$ netstat -n \
| awk '/^tcp/{print $5}' \
| awk -F: '{print $1}' \
| sort \
| uniq -c \
| sort -rn
```


#### `ps aux` 返回的结果中，VSZ、RSS 的含义

```bash
$ ps aux
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  1.1  0.5 171476 14476 ?        Ss   19:13   0:02 /usr/lib/systemd/systemd --switched-root --system
root          2  0.0  0.0      0     0 ?        S    19:13   0:00 [kthreadd]
root          3  0.0  0.0      0     0 ?        I<   19:13   0:00 [rcu_gp]
```

`VSZ` ：virtual memory size，进程所占用的 **虚拟内存** 空间

`RSS` ：resident set size，进程占用的 **物理内存** 空间










### 存储 / 文件系统


#### 如何检测并修复硬盘

```bash
$ sudo fsck /dev/hda5
```

`fsck` 用来检查和维护不一致的文件系统。若系统掉电或磁盘发生问题，可利用该命令对文件系统进行检查。


#### 统计 /var/log 目录中的文件总数

```bash
$ sudo ls -lR /var/log/ | grep "^-" | wc -l
53
```

`-R` ：列出子目录的内容


#### 软链接与硬链接的区别

* 硬链接：多个文件同时指向同一个 **inode**。

	删除一个不会影响另一个，直到最后一个文件被删除，文件数据才真正被删除。

* 软链接：多个文件同时指向同一个 **文件名**，即快捷方式。

	删除一个，另一个就没法用了。














### 安全


#### 在 shell 中生成 32 位随机密码

```bash
$ cat /dev/urandom | head -10 | sha512sum | head -c 32
```

用 `/dev/urandom` 的前 10 行内容做为随机的种子，计算其 sha 值，取结果的前 32 个字符。














### 文本解析


#### 统计 apache 的 access.log 中访问量最多的前 5 个 ip 地址

`access.log` 通常格式如下：

```
127.0.0.1 - peter [9/Feb/2017:10:34:12 -0700] "GET /sample-image.png HTTP/2" 200 1479
```

因此，仅处理第 1 字段。

```bash
$ sudo cat /var/log/httpd/test-access.log \
 | awk '{print $1}' \
 | sort \
 | uniq -c \
 | sort -rn \
 | head -5
```


#### 如何查看二进制文件 file 的内容

```bash
$ hexdump -C file
```

`-C` 以十六进制和 ASCII 码显示
