---
toc: true
toc_label: "运维速查"
toc_icon: "copy"
title: "运维速查"
tags: 运维 排错
categories: "devop"
classes: wide
excerpt: "运维常见问题"
header:
  overlay_image: /assets/images/header/matrix2.jpg
  overlay_filter: rgba(0, 0, 0, 0.8)
---





## 网络管理







### 系统设置




#### 修改 http 的最大并发请求数

通过修改该配置文件中的最大文件描述符数量实现，重启后生效。

```bash
$ cat /etc/security/limits.conf
soft nofile 10240
hard nofile 10240
```



#### 路由设置

使用 `route` 来查看和管理 IP 路由表。


##### 添加主机路由

```bash
$ route add -host 192.168.197.100 dev etho
```


##### 添加默认网关

```bash
$ route add default gw 192.168.197.1
```


##### 添加网络路由

```bash
$ route add -net 192.168.1.0 netmask 255.255.255.0 dev eth1
$ route add -net 192.168.1.0 netmask 255.255.255.0 gw 192.168.197.1
```










### 网络检测



#### 检查网络中哪些地址在线

192.168.1.0/24 网络中，哪些 IP 地址在线。

能 ping 通则认为在线，ping 的返回值为 0 则认为是通的。

```bash
#!/bin/bash
for ip in `seq 1 255`
do
  ping -c 1 192.168.1.$ip > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo 192.168.1.$ip UP
  else
    echo 192.168.1.$ip DOWN
  fi
done
wait
```














### 基础服务







#### DNS


##### 权威 DNS

权威 DNS 是特定域名记录在域名注册商处所设置的 DNS 服务器，**用于特定域名的管理**（增加、删除、修改等）。权威 DNS 服务器 **只对自己拥有的域名进行解析**，对于不是自己的域名则 **拒绝访问**。


##### 递归 DNS

递归 DNS 也称本地 DNS 或 **缓存 DNS**，用于域名查询。

递归 DNS 会 **迭代权威服务器返回的应答**，直至最终查询到的 IP 地址，将其返回给客户端，并将请求结果缓存到本地。


##### 智能 DNS

用户发起 DNS 解析请求时，先判断该用户来自于哪个运营商，然后将请求 **转发给该运营商指定的 IP 地址** 进行解析，避免跨运营访问网，目的在于 **提升解析速度**。






#### FTP



##### FTP 的主动模式和被动模式

主动还是被动是 **从服务端的角度** 来说的。**主动** 模式中数据连接是由 **服务端发起** 的，而 **被动** 模式中则是由 **客户端发起** 的。


###### 主动模式

* 客户端发起控制连接：从端口C连接到服务器端口21，告知服务器自己的数据端口为C+1；
* 服务器应答：从端口21返回应答消息，控制连接建立；
* 服务器发起数据连接：从端口20连接到客户端端口C+1；
* 客户端应答：返回应答消息，数据连接建立。


###### 被动模式

* 客户端发起控制连接：从端口C连接到服务器端口21，告知服务端自己使用被动模式；
* 服务端应答：返回应答消息，并告知自己数据端口号S，控制连接建立；
* 客户端发起数据连接：从C+1端口连接到服务器S端口；
* 服务端应答：返回应答消息，数据连接建立。















### 网络监控


#### 查看 http 的并发请求数与其 TCP 连接状态

```bash
$ ss -s
$ netstat -n | awk '/^tcp/{a[$NF]++} END{for(i in a){print i,a[i]}}'
```


#### 查看哪个地址对 80 端口的访问次数最多

用 `tcpdump` 嗅探 80 端口的访问，看谁最高。

```bash
$ sudo tcpdump -i venet0 -tnn dst port 80 -c 1000 \
| awk '/^IP/{print $2}' \
| awk -F. '{print $1 "." $2 "." $3 "." $4}' \
| uniq -c \
| sort -rn
```


#### 查看每个 ip 地址的连接数

```bash
$ netstat -n \
| awk '/^tcp/ {print $5}' \
| awk -F: '{print $1}' \
| sort \
| uniq -c \
| sort -rn
```
















### IPTABLES



#### 端口转发

将对本地 80 端口的请求转发到本地 8080 端口，IP 地址为 10.0.0.254。

```bash
$ iptables -A PREROUTING -t nat \
	-p tcp -d 10.0.0.254 --dport 80 \
	-j DNAT --to-destination 10.0.0.254:8080
```


#### 禁止特定 IP 地址访问

```
iptables -A INPUT -s 192.168.1.55 -j REJECT
```



#### 日志报错

##### 症状：

服务器负载正常，但请求大量超时，服务器/应用访问日志看不到相关请求记录。

在 dmesg 或 /var/log/messages 看到大量以下记录：

`kernel: nf_conntrack: table full, dropping packet.`

##### 原因：

服务器访问量大，内核 netfilter 模块 conntrack 相关参数配置不合理，散列表被填满，导致 IP 数据包被丢弃，连接无法建立。

##### 解决：

* 关闭防火墙
* 将散列表扩容
* 修改规则，禁用一些不必要的追踪



#### 查看连接追踪表信息

查看追踪表中所有条目：

```bash
$ sudo cat /proc/net/nf_conntrack
ipv4     2 tcp      6 299 ESTABLISHED src=192.168.1.6 dst=192.168.1.77 sport=11385 dport=22 src=192.168.1.77 dst=192.168.1.6 sport=22 dport=11385 [ASSURED] mark=0 secctx=system_u:object_r:unlabeled_t:s0 zone=0 use=2
ipv4     2 tcp      6 60 SYN_SENT src=192.168.1.77 dst=192.168.1.78 sport=60638 dport=3306 [UNREPLIED] src=192.168.1.78 dst=192.168.1.77 sport=3306 dport=60638 mark=0 secctx=system_u:object_r:unlabeled_t:s0 zone=0 use=2
```

查看条目总量上限：

```bash
$ sysctl net.netfilter.nf_conntrack_max
net.netfilter.nf_conntrack_max = 31248

$ cat /proc/sys/net/netfilter/nf_conntrack_max
31248
```

查看当前已有条目：

```bash
$ sysctl net.netfilter.nf_conntrack_count
net.netfilter.nf_conntrack_count = 3

$ cat /proc/sys/net/netfilter/nf_conntrack_count
3
```

查看追踪表大小：

```bash
$ sysctl net.netfilter.nf_conntrack_buckets
net.netfilter.nf_conntrack_buckets = 8192

$ cat /proc/sys/net/netfilter/nf_conntrack_buckets
8192
```

计算负载系数：

`Load Factor` = `nf_conntrack_count` / `nf_conntrack_buckets`

如果负载系数超过 0.67 就要考虑扩容追踪表了。








### FirewallD



#### 添加端口

```bash
$ sudo firewall-cmd --permanent --add-service=http
```
























## PHP 7.2




### 安装


#### 安装依赖仓库

```bash
sudo yum install epel-release
sudo yum install http://rpms.remirepo.net/enterprise/remi-release-7.rpm
```


#### 安装 PHP

安装 PHP 及常用模块，包括 php-gd 以及 php-fpm。

```bash
$ sudo yum --enablerepo="remi-php72" install -y \
  php php-common php-opcache php-mcrypt php-cli php-gd php-curl php-mysqlnd php-fpm
```


#### 检查版本

检查是否安装成功：

```bash
$ php -v

PHP 7.2.9 (cli) (built: Aug 15 2018 09:19:33) ( NTS )
Copyright (c) 1997-2018 The PHP Group
Zend Engine v3.2.0, Copyright (c) 1998-2018 Zend Technologies
    with Zend OPcache v7.2.9, Copyright (c) 1999-2018, by Zend Technologies
```


#### 修改安全配置：

PHP 在找不到完全匹配的 PHP 文件时，默认会尝试最接近的文件。该特性容易被利用，以向请求中插入恶意代码。

```bash
$ sudo vi /etc/php.ini

cgi.fix_pathinfo=0
```






### 配置 PHP 与 Apache 工作

直接重启 Apache 就可以直接使用了：

```bash
$ sudo systemctl restart httpd
```





### 配置 PHP 与 Nginx 工作

要提前把 Nginx 安装好，以便自动创建 `nginx` 用户，在下面的配置中会用到该用户。
{: .notice--primary}


##### 修改 PHP 配置

```bash
$ sudo vi /etc/php-fpm.d/www.conf

...
user = nginx
group = nginx
listen = /var/run/php-fpm/php-fpm.sock
listen.owner = nginx
listen.group = nginx
```

##### 启动 PHP FPM

修改之后，可以激活并启动 PHP FPM 守护进程了：

```bash
$ sudo systemctl enable php-fpm
$ sudo systemctl start php-fpm
```

##### 修改 Nginx 配置

修改 Nginx 的虚拟服务器配置，以便 Nginx **有能力处理 PHP**。

```bash
$ sudo vi /etc/nginx/conf.d/default.conf
```


```conf
server {
    listen  80;
    server_name  server_domain_name_or_IP;

    root   /usr/share/nginx/html;
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/var/run/php-fpm/php-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

##### 测试 Nginx 配置文件的语法是否正确：

```bash
$ sudo nginx -t

nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

##### 重新加载 Nginx 配置

```bash
$ sudo nginx -s reload
```


##### 测试

在 Nginx 根目录创建一个 PHP 文件，然后访问配置的域名或地址。

```bash
$ sudo vi  /usr/share/nginx/html/index.php

<?php phpinfo(); ?>
```





























## Apache


#### 找出访问量最大的 5 个 IP 地址

从 apache 的日志 `access.log` 中，统计访问量最多的 5 个 IP 地址。

```bash
$ cat /var/log/httpd/test-access.log \
| awk '{print $1}' \
| sort \
| uniq -c \
| sort -rn \
| head -5
```



#### 限制 apache 每秒新建连接数为 1，峰值为 3

每秒新建连接数用防火墙来配置：

```bash
$ sudo iptables -A INPUT -d 172.6.10.1 -p tcp --dport 80 -m limit --limit 1/second -j ACCEPT
```

每秒最大连接数在 apache 配置文件中修改：

```conf
MaxRequestWorkers 3"
```



































## Nginx



### 安装

```bash
$ sudo yum install nginx
```



### 通用操作



#### 重新加载配置：

```bash
$ sudo nginx -s reload
```







### 反向代理


#### 作反向代理时，如何在日志中保存访客真实 IP 地址

```conf
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header Host $http_host;
```





























## MySQL / MariaDB






### 安装


#### MySQL

首先必须用浏览器访问 MySQL 的 [官方仓库](https://dev.mysql.com/downloads/repo/yum/)，在对应的平台下面可以看到诸如 (mysql80-community-release-el7-1.noarch.rpm) 这样的文件名，将其替换到下面的命令中进行下载。

```bash
$ sudo wget https://dev.mysql.com/get/mysql80-community-release-el7-1.noarch.rpm
```

最好进行一下校验：

```bash
$ md5sum mysql80-community-release-el7-1.noarch.rpm
```

将校验码与网页上的对照。

安装 MySQL 官方仓库：

```bash
$ sudo rpm -ivh mysql80-community-release-el7-1.noarch.rpm
```

正式安装 MySQL Server：

```bash
$ sudo yum install mysql-server
```

启动后，会为 root 用户随机产生密码：

```bash
$ sudo grep 'temporary password' /var/log/mysqld.log
```


#### MariaDB


```bash
$ sudo yum install mariadb-server
```

MariaDB 安装成功后，默认 root 密码为空。



#### 安全处理

```bash
$ sudo mysql_secure_installation
```

包括 root 密码、移除匿名用户、禁止 root 远程登陆、移除测试数据库、重载用户权限表。








### 守护进程


```bash
$ sudo systemctl status mysqld
$ sudo systemctl enable mysqld
$ sudo systemctl start mysqld

$ sudo systemctl status mariadb
$ sudo systemctl enable mariadb
$ sudo systemctl start mariadb
```






### 复制



#### 一主多从，主失效，提升从为主

* **查看** 所有从服务器的复制 **位置**：`SHOW SLAVE STATUS` 返回的结果中查看 `Master_Log_Pos`，选择最新的做为新*主*
* 让所有*从*把 **中继日志执行完毕**
* 新*主* **停止做从**：在新主上执行 `STOP SLAVE`
* 新*主* **启用二进制日志**：修改 `my.cnf`，启用 `log-bin`，重启 mysql
* 把新*主* **从其原主断开**：执行 `CHANGE MASTER TO` 及 `RESET SLAVE`
* 记录新主的 **二进制日志坐标**：用 `SHOW MASTER STATUS`
* 所有从 **指向新主**：所有*从*上运行 `CHANGE MASTER TO` 命令，指向新主，使用上一步记下来的坐标








### 备份与恢复


#### 使用二进制日志进行时间点恢复

可以用此方法恢复被误删的数据库。先使用一个 **完全备份** 进行恢复，然后再进行时间点恢复。


##### 恢复完全备份

恢复之前由 mysqldump 做的完全备份的文件 `dump.sql`：

```bash
$ mysql -uroot -p database_name < dump.sql
```


##### 确定当前二进制日志文件

###### 查看所有二进制日志文件

```sql
mysql> SHOW BINARY LOGS;
+------------------+-----------+
| Log_name         | File_size |
+------------------+-----------+
| mysql-bin.000001 |      1058 |
| mysql-bin.000002 |       178 |
| mysql-bin.000003 |       178 |
|+------------------+-----------+
3 rows in set (0.01 sec)   |   |
```

###### 查看当前使用的二进制日志文件

```sql
mysql> SHOW MASTER STATUS;
+------------------+----------+--------------+------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000003 |      155 |              |                  |                   |
+------------------+----------+--------------+------------------+-------------------+
1 row in set (0.01 sec)
```

###### 刷新日志

刷新日志，以便让 MySQL 生成新的二进制日志，停止向包含误操作语句的日志中写入。

在 shell 中操作：

```bash
$ mysqladmin -uroot -p -S /data/mysql.sock flush-logs
```

在 mysql 客户端操作：

```sql
mysql> FLUSH LOGS;
```


##### 把关键二进制日志转换为文本，进行修改

`mysqlbinlog` 可以把二进制日志文件中的事件，由二进制格式 **转换** 为文本格式，以便用来执行或查看。

把二进制日志转换为文本，并 **修改**：

```bash
shell> mysqlbinlog mysql-bin.000003 > tmpfile
shell> vi tmpfile
```

🚩 编辑文本文件，找到误操作的语句，如 `DROP DATABASE`，将其删除。如果有其它想要删除的，可以一并进行。


##### 执行修改过的日志文件

如果在修改过的日志之前，有多个日志文件要依次执行：

```bash
shell> mysqlbinlog mysql-bin.000001 mysql-bin.000002 | mysql -u root -p
```

然后再执行修改过的日志：

```bash
shell> mysql -u root -p < tmpfile
```


##### 按时间或位置执行日志

以上步骤就可以完成恢复任务了。除了以上方法，还可以先在二进制日志中查明误操作发生的时间和位置，然后用指定时间范围或位置范围来执行二进制日志。

基于时间范围来恢复：

```bash
mysqlbinlog --start-datetime="2005-04-20 10:01:00" \
            --stop-datetime="2005-04-20 9:59:59" mysql_bin.000001 \
            | mysql -u root -ppassword database_name
```

基于位置范围来恢复：

```bash
mysqlbinlog --start-position=368315 \
            --stop-position=368312 mysql_bin.000001 \
            | mysql -u root -ppassword database_name
```




### 监控


#### 查看当前进程

在 shell 中查看：

```bash
mysqladmin processlist -uroot -p -h 127.0.0.1
Enter password:
+----+-----------------+-----------------+----+---------+-------+--------------------------------------------------------+------------------+
| Id | User            | Host            | db | Command | Time  | State                                                  | Info             |
+----+-----------------+-----------------+----+---------+-------+--------------------------------------------------------+------------------+
| 4  | system user     |                 |    | Connect | 20045 | Connecting to master                                   |                  |
| 5  | system user     |                 |    | Query   | 7947  | Slave has read all relay log; waiting for more updates |                  |
| 6  | event_scheduler | localhost       |    | Daemon  | 20045 | Waiting on empty queue                                 |                  |
| 17 | root            | localhost:33820 |    | Query   | 0     | starting                                               | show processlist |
+----+-----------------+-----------------+----+---------+-------+--------------------------------------------------------+------------------+
```

使用 `-h` 是为了通过 TCP socket 连接，以便在结果中显示连接的端口号。

在 mysql 客户端查看：

```sql
mysql> SHOW PROCESSLIST;     
+----+-----------------+-----------+------+---------+-------+------------------------+------------------+
| Id | User            | Host      | db   | Command | Time  | State                  | Info             |
+----+-----------------+-----------+------+---------+-------+------------------------+------------------+
|  4 | event_scheduler | localhost | NULL | Daemon  | 20110 | Waiting on empty queue | NULL             |
|  8 | root            | localhost | NULL | Query   |     0 | starting               | SHOW PROCESSLIST |
+----+-----------------+-----------+------+---------+-------+------------------------+------------------+
2 rows in set (0.00 sec)
```





































## 文件系统






### 符号链接与硬链接

* 硬链接是两个文件同时指向同一个 **inode**：删除一个不会影响另一个，直到最后一个文件被删除，文件数据才真正被删除；
* 符号链接是两文件同时指向同一个 **文件名**：即快捷方式。删除一个，另一个就没法用了。









### 磁盘/分区


#### 修复分区错误

检测并修复分区 `/dev/hda5`

```bash
$ sudo fsck /dev/hda5
```

`fsck` 用来检查和维护不一致的文件系统。若系统掉电或磁盘发生问题，可利用该命令对文件系统进行检查



#### 保存当前磁盘分区的分区表

```bash
$ sudo dd if=/dev/sda of=./mbr.txt bs=1 count=512
```









### 挂载


#### Linux 如何挂载 windows 共享目录


```bash
$ sudo mount.cifs //192.168.1.6/movie /mnt/win -o user=neo,password=matrix
$ sudo mount -t cifs -o username=neo,password=matrix //192.168.1.6/movie /mnt/win
```











### 统计


#### 统计目录中文件数量

查看 `/var/log` 目录中文件的数量。

```bash
$ ls -lR /var/log/ | grep "^-" | wc -l
```







### 查看文件


#### 查看二进制文件的内容

```bash
$ hexdump -C somefile
```

`-C` ：比较规范的十六进制和 ASCII 码显示









### 文件操作



#### 对特定大小的文件进行操作

将 `/usr/local/test` 目录下大于 100K 的文件拷贝到 `/tmp` 目录中。










































## 操作系统







### 系统状态



#### `uptime`

* 当前时间
* 本次启动后所运行的时间
* 已登陆用户数量
* 最近 1 分钟、5 分钟、15 分钟内系统平均负载



#### `w`

* 当前时间
* 系统已运行时间
* 已登陆用户：用户名，TTY，远端主机，登陆时间，空闲时间，当前进程
* 登陆用户产生的进程



#### `top`

**动态、实时** 查看当前系统状态。

该命令显示的信息内容很丰富，显示的界面中，每一块都由一个或多个命令来控制。

##### 启动时间 及 平均负载

```
top - 16:10:22 up  8:59,  2 users,  load average: 0.00, 0.01, 0.05
```

这部分内容为一行，内容与 `uptime` 返回的结果相同：

* 当前时间
* 本次启动后所运行的时间
* 当前登陆用户数量
* 最近 1 分钟、5 分钟、15 分钟内系统平均负载

##### 任务 及 CPU 状态

```
Tasks: 173 total,   1 running, 172 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.1 sy,  0.0 ni, 99.9 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
```

这部分内容至少为两行。在多处理器环境，会显示更多的行。

第一行：总任务数，即总线程数。以及分别处理运行、睡眠、暂停、僵尸状态的数量。

第二行：本次刷新前，在刷新间隔时间内 CPU 的平均状态，默认用百分比来表示。

`us` ：user，运行 un-niced 用户进程的时间

`sy` ：system，运行内核进程的时间

`ni` ：nice，运行 niced 用户进程的时间

`id` ：idle，内核空闲处理器所用的时间

`wa` ：IO-wait，等待 I/O 完成所用的时间

`hi` ：Hardware Interrupt，用于硬件中断的时间

`si` ：Software Interrupt，用于软件中断的时间

`st` ：Steal Time，虚拟 CPU 等待实体 CPU 分配时间片的机率，越大，性能越差

##### 内存占用

这部分内容占两行。

```
KiB Mem :   999964 total,    69656 free,   670256 used,   260052 buff/cache
KiB Swap:  1048572 total,  1042664 free,     5908 used.   113800 avail Mem
```

第一行为物理内存：总量，可用量，已用量，缓冲区大小

第二行为虚拟内存：总量，可用量，已用量，物理可用量

第二行的 `avail` 是物理内存中，可用来启动程序的可用内存的估值。它与 `free` 不同，还要算上可回收的页面缓存和内存片。

##### 进程列表

这部分显示的是当前可用进程的列表。

所有可用的字段有很多，默认只显示了一部分，可以按 `F` 键进入交互设定界面。在这里可以设定显示哪些字段，还可以自定义字段的显示顺序。可以选择按哪个字段进行排序。

在查看界面，可以按 `e` 来切换所用的单位。

```
PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND                                
  1 root      20   0  193628   4980   2944 S   0.0  0.5   0:03.00 systemd                                
  2 root      20   0       0      0      0 S   0.0  0.0   0:00.01 kthreadd                               
  3 root      20   0       0      0      0 S   0.0  0.0   0:00.01 ksoftirqd/0   
```











### 进程管理



#### 查看当前进程列表

`ps aux` 和 `ps -ef ` 两者的输出结果差别不大，但显示风格不同。

* aux 是 BSD 风格，-ef 是 System V 风格
* aux 会截断 command 列，而 -ef 不会

```bash
$ ps aux
USER        PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root          1  0.0  0.5 193628  5092 ?        Ss   06:58   0:03 /usr/lib/systemd/systemd --switched-root --
root          2  0.0  0.0      0     0 ?        S    06:58   0:00 [kthreadd]
root          3  0.0  0.0      0     0 ?        S    06:58   0:00 [ksoftirqd/0]
... ...
```

`VSZ`: 进程占用的 **虚拟内存空间**

`RSS`: 进程占用的 **实际物理内存空间**

```bash
$ ps -ef
UID         PID   PPID  C STIME TTY          TIME CMD
root          1      0  0 15:16 ?        00:00:02 /usr/lib/systemd/systemd --switched-root --system --deseria
root          2      0  0 15:16 ?        00:00:00 [kthreadd]
root          3      2  0 15:16 ?        00:00:00 [ksoftirqd/0]
```



#### 查看进程来源

根据 PID 查看进程是由哪个应用程序产生的：

```bash
$ sudo ls -l /proc/2232/exe
lrwxrwxrwx. 1 root root 0 Sep  7 15:18 /proc/2322/exe -> /usr/sbin/mysqld
```















### 用户管理




#### 批量添加用户

批量添加 20 个用户，用户名为 `user01~20`，密码为 `user + 5个随机字符`

```bash
#!/bin/bash
for i in `seq -f"%02g" 1 20`;do
  useradd user$i
  echo "user$i-`head -1 /dev/urandom|sha1sum|cut -c 1-5`" | passwd –stdin user$i >/dev/null 2>&1
done
```














### Linux 启动顺序

* BIOS
* MBR
* bootloader
* Linux 内核
* systemd
* 读取配置文件
* sysinit.target
* basic.target
* multi-user.target
* graphical.target"















### SELinux



#### 检查状态

```bash
$ sestatus
```



#### 禁用 SELinux

```bash
$ sudo setenforce 0
```

该方法仅在当前禁用，重启后恢复。

永远禁用：

```bash
$ sudo vi /etc/selinux/config

SELINUX=disabled
```


####





















## 应用程序






#### VI 常用快捷键

`8yy` ：从本行起向下复制8行

`p` ：粘贴到当前行下面

`dd` ：删除本行

`dG` ：删除全部，提前要 gg 到首行

`d↑` ：从本行起，向上删除 2 行

`d5↑` ：从本行起，向上删除 5 行

`90, shift + G` ： 定位到第 90 行

`/keyword` ：查找关键字，按 N 定位下一处































## 脚本




### 随机数



#### 在 6 ~ 9 范围内取随机数

```bash
$ echo `expr $[RANDOM%4] + 6`
```











### 调试




#### 检查脚本是否能正常运行

>本题的逻辑有些白痴，权当熟悉脚本用了。

如果可以正常运行，返回提示消息；如果运行错误，键入 V 或 v，会用 vim 自动打开脚本，键入 Q 或 q 或任意键可忽略并退出。

```bash
#!/bin/bash
if [ ${#1} == 0 ] ; then
  read -p "please type in the script name : " file
else
  file=$1
fi

# run the script if it's not empty
if [ -f $file ]; then
  sh -n $file > /dev/null 2>&1
  if [ $? -ne 0 ]; then
    read -p "Syntax error detected. Press Q to exit. Press V to open it with vim" answer
    case $answer in
	v | V )
      vim $file
      ;;
    q | Q)
      exit 0
      ;;
    *)
      exit 0
      ;;
    esac
  else
    echo 'no error detected, congratulations!'
  fi
else
  echo "$file not exist"
  exit 1
fi
```










### 密码


#### 生成 32 位随机密码

用 `/dev/urandom` 做种子，用 `sha512sum` 计算，用 `head -c` 取任意位。

```bash
$ cat /dev/urandom | head -10 | sha512sum | head -c 32
```













### 文本流



#### 读取文件 特定行

读取文件第 5-15 行的内容。

```bash
$ cat test
1
2
3
4
5bbb
6xxxxxxxxxx  
7123i4i44
8
9
10
11
12
13ffffff
14fffff
15bbbbbb
16
17nnnnnn
```


##### grep

```bash
$ grep 15bbbbbb -B 10 test
```

提取关键字所在行，以及之 **前** 的 10 行。共计 10+1=11 行。

同理 `-A 10 ` 则表示提取关键字所在行，以及之 **后** 的 10 行。


##### sed

```bash
$ sed -n '5,15p' test
```


##### awk

```bash
$ awk '{if(NR<16 && NR>4) print $1}' test
```
