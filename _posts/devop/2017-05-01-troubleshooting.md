---
toc: true
toc_label: "运维速查01"
toc_icon: "copy"
title: "运维速查01"
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


#### 作反向代理时，如何在日志中保存访客真实 IP 地址

```conf
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header Host $http_host;
```

修改完配置，重新加载配置：

```bash
$ sudo nginx -s reload
```




























## MySQL



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

##### 启动时间及平均负载

这部分内容为一行，内容与 `uptime` 返回的结果相同：

* 当前时间
* 本次启动后所运行的时间
* 当前登陆用户数量
* 最近 1 分钟、5 分钟、15 分钟内系统平均负载







### 进程管理



#### 查看当前进程列表

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









### 用户管理

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
