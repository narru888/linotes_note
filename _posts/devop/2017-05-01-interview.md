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


#### 备份当前分区的分区表

```bash
$ sudo dd if=/dev/sda of=./mbr.txt bs=1 count=512
```


#### 统计 /var/log 目录中的文件总数

```bash
$ sudo ls -lR /var/log/ | grep "^-" | wc -l
53
```

`-R` ：列出子目录的内容


#### 软链接与硬链接的区别

文件系统中的文件基本上是指向一个 inode 的链接。

![image-center](/assets/images/soft.hard.link.jpg){: .align-center}

##### 硬链接

创建硬链接，就是创建另一个文件，指向同一个 **inode**。是非常底层的概念。

* 只可以链接到文件。
* 硬链接没有原始文件和链接的概念，大家都一样。
* 不管哪个硬链接对文件所做的修改，其它硬链接都会看到。
* 删除、重命名、移动一个硬链接，均不会影响其它硬链接。
* 删除硬链接时，只会该指向该 inode 的链接删除，当所有指向该 inode 的链接均被删除时，inode 才会被删除，即文件真正被删除。

* 硬链接只在 **同一文件系统内** 有效，无法链接到其它文件系统中的文件。

##### 软链接

创建软链接，是指向文件系统中的另一个 **路径**（文件名），即快捷方式。每次访问软链接时，都会解析该文件的路径、文件名。

* 可以链接到文件、目录。
* 要区分原始文件与软链接的概念。
* 如果移动原始文件，软链接会失效。
* 如果用新文件覆盖原始文件，只要保持文件名不变，软链接就有效。
* 如果删除原始文件，软链接即失效，不可用。
* 软链接可以跨越文件系统，如可以链接到 NFS 上的文件，因为它们指向的只是另一个文件的文件名。














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










### 常用服务 / 工具


#### 解释 FTP 的主动模式和被动模式

主动还是被动是从 **服务端的角度** 来说的。主动模式中数据连接是由服务端发起的，而被动模式中则是由客户端发起的。

##### 主动模式

客户端发起控制连接：从端口C连接到服务器端口21，告知服务器自己的数据端口为C+1；
服务器应答：从端口21返回应答消息，控制连接建立；
服务器发起数据连接：从端口20连接到客户端端口C+1；
客户端应答：返回应答消息，数据连接建立。

##### 被动模式

客户端发起控制连接：从端口C连接到服务器端口21，告知服务端自己使用被动模式；
服务端应答：返回应答消息，并告知自己数据端口号S，控制连接建立；
客户端发起数据连接：从C+1端口连接到服务器S端口；
服务端应答：返回应答消息，数据连接建立。"


#### 限制 apache 每秒新建连接数为 1，峰值为 3

每秒新建连接数需要用 iptables 来控制：

```bash
$ sudo iptables -A INPUT -d 192.168.1.10 -p tcp --dport 80 -m limit --limit 1/second -j ACCEPT
```

峰值就是 apache 同时可以处理的最多连接数，需要修改 apache 的配置文件 `/etc/httpd/conf/httpd.conf`：

```conf
MaxRequestWorkers 3
```

超过该限制之后，尝试建立的新连接，会进入等待队列，直到其它子进程被释放。



#### VI 快捷键

##### 复制行

* `yy` 复制当前行
* `8yy` 从本行起，向下复制 8 行

##### 粘贴行

* `p` 粘贴到当前行下面

##### 删除行

* `dd` 删除当前行
* `8dd` 从本行起，向下删除 8  行
* `d↑` 从本行起，向上删除 2 行
* `d5↑` 从本行起，向上删除 5 行

##### 删除全部

* 先按 `gg` 到首行，然后按 `dG` 删除所有行

##### 显示行号

* `:set nu`

##### 定位到行

* `:15` 定位到第 15 行
* `gg` 定位到首行
* `G` 定位到末行











### ETC


#### 在 6-9 内取随机数

```bash
$ echo `expr $[RANDOM%4] + 6`
```
