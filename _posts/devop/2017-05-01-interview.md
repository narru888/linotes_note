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


#### 用脚本批量添加 20 个用户

要求：用户名为 user01-20，密码为 “用户名 + 5 个随机字符”：

```bash
#!/bin/bash
for i in `seq -f "%02g" 1 20`
do
	useradd user$i
    echo "user$i `head -10 /dev/urandom | sha1sum | head -c 5`" | passwd -stdin user$i > /dev/null 2>&1
done
```

在命令替换中，使用 `seq` 的格式化参数 `"%02g"` 来实现以 0 开头的 2 位数字格式。


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








### 网络管理


#### DNS 的查询顺序

1. 本地 hosts 文件
2. 本地 DNS 缓存
3. 本地 DNS 服务器
4. 发起迭代查询


#### DNS 的组成

* 域名服务器：提供域名解析的软件，默认监听 udp/tcp 53 端口
* 解析器：访问域名服务器的客户端，获取域名服务器的响应以后，它负责解析出结果，将结果返回给调用者



#### 域名服务器的分类

##### 权威域名服务器

负责授权域下的域名解析服务，由上级权威域名服务器使用 NS 记录进行授权。

权威 DNS 是特定的域名记录（如 example.com）在域名注册商处所设置的 DNS 服务器，**用于特定域名的管理**。该服务器只对自己所拥有的域名进行解析，对于其他域名则拒绝访问。

权威 DNS 由 **域名解析服务商** 建设，提供 **域名管理服务**，维护域名解析记录。

权威域名服务器有以下三级：

###### 根域名服务器

负责对 .com、 .cn、.org 等顶级域名向下授权。

###### 顶级域名服务器

* 通用顶级域名服务器：服务于 .org、.com、.info 等授权的域名服务器
* 国家代码服务器：服务于 .uk、.cn、.us 等授权的域名服务器

###### 二级域名服务器

服务于具体的域名，如解析 baidu.com 等。

##### 缓存域名服务器

这类的域名服务器负责接受解析器发过来的 DNS 请求，通过依次查询 根域名服务器 -> 顶级域名服务器 -> 二级域名服务器， 来获取 DNS 解析结果，然后把结果发送给解析器。同时，根据 DNS 条目的 TTL（time to live）值进行缓存。

缓存域名服务器的作用：

* 企业内部局域网自用 DNS 服务
* 运营商为其租户提供 DNS 服务
* 开放的 DNS 解析服务，如 OpenDNS








#### DNS 查询机制

DNS 采用两种查询机制：**递归** 和 **迭代**

![image-center](/assets/images/dns.png){: .align-center}

##### 递归查询

递归查询是默认的解析方式。在这种解析方式中，如果客户端配置的本地域名服务器不能解析的话，则后面的查询全由本地域名服务器代替 DNS 客户端进行查询，直到本地域名服务器从权威域名服务器得到了正确的解析结果，然后由本地域名服务器告诉 DNS 客户端查询的结果。

在这个查询过程中，一直是以本地域名服务器为中心的，DNS 客户端只是发出原始的域名查询请求报文，然后就一直处于等待状态，直到本地域名服务器发来了最终的查询结果。此时的本地域名服务器就相当于中介代理的作用。

###### 递归解析的基本流程

1. 客户端向本机配置的本地域名服务器发出 DNS 查询请求。
2. 本地域名服务器收到请求后，先查询本地的缓存
	- 如果有该域名的记录项，则直接把查询的结果返回给客户端
	- 如果没有该域名的记录，本地域名服务器则以 DNS 客户端的角色，向根域名服务器发送与前面一样的 DNS 查询请求
3. 根域名服务器收到 DNS 请求后，把所查询得到的所请求的DNS域名中顶级域名所对应的顶级域名服务器地址返回给本地域名服务器。
　　（4）本地域名服务器根据根域名服务器所返回的顶级域名服务器地址，向对应的顶级域名服务器发送与前面一样的DNS域名查询请求。

（5）对应的顶级域名服务器在收到DNS查询请求后，也是先查询自己的缓存，如果有所请求的DNS域名的记录项，则相接把对应的记录项返回给本地域名服务器，然后再由本地域名服务器返回给DNS客户端，否则向本地域名服务器返回所请求的DNS域名中的二级域名所对应的二级域名服务器地址。

然后本地域名服务器继续按照前面介绍的方法一次次地向三级、四级域名服务器查询，直到最终的对应域名所在区域的权威域名服务器返回到最终的记录给本地域名服务器。然后再由本地域名服务器返回给DNS客户，同时本地域名服务器会缓存本次查询得到的记录项。



#### DNS 使用的端口号

DNS 协议使用 udp/tcp 的 53 端口提供服务。

为什么同时使用两种协议？

* 客户端向 DNS 服务发起请求时，使用 udp 的 53 端口，因为 **速度快**
* DNS 服务器之间进行区域传输时，使用 TCP 的 53端口，因为 **传输可靠、可控**



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


#### 用脚本 ping 多个 IP 地址

##### 连续 IP 地址

连续 ping 某个网段，如 192.168.1.0/24。

```bash
#!/bin/bash
for ip in `seq 1 255`
do
  ping -c 1 192.168.1.$ip > /dev/null 2>&1
  if [ $? -eq 0]; then
    echo 192.168.1.$ip is ONLINE
  else
    echo 192.168.1.$ip is OFFLINE
  fi
done
wait
```

##### 不连续 IP 地址

给定一系列非连续 IP 地址，保存在文本中，每行一个地址：

```
10.12.13.14
172.15.48.3
192.168.45.54
...
48.114.78.227
```

```bash
#!/bin/bash
cat /path/to/list.txt | while read output
do
  ping -c 1 "$output" > /dev/null
  if [ $? -eq 0 ]; then
    echo "node $output is up"
  else
    echo "node $output is down"
  fi
done
```









### 进程管理


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

* 客户端从端口 C 连接到服务器端口 21，告知服务器自己的数据端口为 C+1；
* 服务器从端口 21 返回应答消息，**控制连接建立**；
* 服务器从端口 20 连接到客户端端口 C+1；
* 客户端返回应答消息，**数据连接建立**。

##### 被动模式

* 客户端从端口 C 连接到服务器端口 21，告知服务端自己使用 **被动模式**；
* 服务端返回应答消息，并告知自己数据端口号 S，**控制连接建立**；
* 客户端从 C+1 端口连接到服务器 S 端口；
* 服务端返回应答消息，**数据连接建立**。


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
