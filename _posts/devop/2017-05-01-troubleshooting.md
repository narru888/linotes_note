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




### 系统




#### 修改 http 的最大并发请求数

通过修改该配置文件中的最大文件描述符数量实现，重启后生效。

```bash
$ cat /etc/security/limits.conf
soft nofile 10240
hard nofile 10240
```



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





#### 权威 DNS 与递归 DNS

##### 权威 DNS

权威 DNS 是特定域名记录在域名注册商处所设置的 DNS 服务器，**用于特定域名的管理**（增加、删除、修改等）。权威 DNS 服务器 **只对自己拥有的域名进行解析**，对于不是自己的域名则 **拒绝访问**。

##### 递归 DNS

递归 DNS 也称本地 DNS 或 **缓存 DNS**，用于域名查询。

递归 DNS 会 **迭代权威服务器返回的应答**，直至最终查询到的 IP 地址，将其返回给客户端，并将请求结果缓存到本地。





#### 智能 DNS

用户发起 DNS 解析请求时，先判断该用户来自于哪个运营商，然后将请求 **转发给该运营商指定的 IP 地址** 进行解析，避免跨运营访问网，目的在于 **提升解析速度**。




#### 端口转发

将对本地 80 端口的请求转发到本地 8080 端口，IP 地址为 10.0.0.254。

```bash
$ iptables -A PREROUTING -t nat \
	-p tcp -d 10.0.0.254 --dport 80 \
	-j DNAT --to-destination 10.0.0.254:8080
```













### Apache


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








### FTP


#### FTP 的主动模式和被动模式

主动还是被动是 **从服务端的角度** 来说的。**主动** 模式中数据连接是由 **服务端发起** 的，而 **被动** 模式中则是由 **客户端发起** 的。


##### 主动模式

* 客户端发起控制连接：从端口C连接到服务器端口21，告知服务器自己的数据端口为C+1；
* 服务器应答：从端口21返回应答消息，控制连接建立；
* 服务器发起数据连接：从端口20连接到客户端端口C+1；
* 客户端应答：返回应答消息，数据连接建立。


##### 被动模式

* 客户端发起控制连接：从端口C连接到服务器端口21，告知服务端自己使用被动模式；
* 服务端应答：返回应答消息，并告知自己数据端口号S，控制连接建立；
* 客户端发起数据连接：从C+1端口连接到服务器S端口；
* 服务端应答：返回应答消息，数据连接建立。






### nginx


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

























## 数据库



### MySQL



#### 一主多从，主失效，提升从为主

* **查看** 所有从服务器的复制 **位置**：`SHOW SLAVE STATUS` 返回的结果中查看 `Master_Log_Pos`，选择最新的做为新*主*
* 让所有*从*把 **中继日志执行完毕**
* 新*主* **停止做从**：在新主上执行 `STOP SLAVE`
* 新*主* **启用二进制日志**：修改 `my.cnf`，启用 `log-bin`，重启 mysql
* 把新*主* **从其原主断开**：执行 `CHANGE MASTER TO` 及 `RESET SLAVE`
* 记录新主的 **二进制日志坐标**：用 `SHOW MASTER STATUS`
* 所有从 **指向新主**：所有*从*上运行 `CHANGE MASTER TO` 命令，指向新主，使用上一步记下来的坐标




#### 恢复被误删的数据库

更详细的步骤，见[用二进制日志进行时间点增量恢复](https://linotes.imliloli.com/mysql/backup/#用二进制日志进行时间点增量恢复)。

如果动作足够快，恢复数据的机会就比较大。如果用的是 InnoDB，成功的机率更大，MyISAM 的成功极低。原因是，当 MySQL 执行 `DROP TABLE` 或 `DROP DATABASE` 的时候，InnoDB 实际上没有真正把数据清除掉，含有该数据的页面仍然在磁盘中。

首要操作是 **停止任何可能的写入**，防止被删的表格被 MySQL 或操作系统覆盖。
{: .notice--info}

##### 未启用 `innodb_file_per_table`

被删的表格是保存在共享表空间 `ibdata1` 中。

先杀掉 `safe_mysqld` 进程，然后用 `kill -9` 杀掉 `mysqld` 进程。


##### 启用了 `innodb_file_per_table`

被删除的表格应该保存在对应的 `.ibd` 文件中。删除表格时，MySQL 会同时删除该文件。

* 立即 **卸载** 数据目录所在分区，然后以 **只读** 方式重新挂载。如果数据目录位于根目录，立即为磁盘制作 **镜像**。













There is a tool that allows to work with InnoDB pages at low level,
[TwinDB data recovery toolkit](https://github.com/twindb/undrop-for-innodb). I will use it to illustrate undrop recovery.

You need to take the media with dropped table (either ibdata1 or disk image) and find InnoDB pages on it. stream_parser tool from the toolkit does it.

```
./stream_parser -f /path/to/disk/image
```

It will scan the file, find the InnoDB pages and sort them by type and index_id. index_id is an identifier that InnoDB uses to refer to an index. A table is stored in index PRIMARY. To find what index_id is your dropped table you need to [recover InnoDB dictionary](https://twindb.com/how-to-recover-innodb-dictionary/).

The InnoDB dictionary is stored in ibdat1 file. You need to scan ibdata1 file the same way as above:

```
./stream_parser -f /var/lib/mysql/ibdata1
```

Now you need to get records from the InnoDB dictionary tables SYS_TABLES and SYS_INDEXES(let's say your table is sakila.actor):

```
./c_parser -4Df pages-ibdata1/FIL_PAGE_INDEX/0000000000000001.page -t dictionary/SYS_TABLES.sql | grep sakila/actor
000000000B28  2A000001430D4D  SYS_TABLES  "sakila/actor"  158  4  1 0   0   ""  0
```

158 is table_id, remember it.

```
./c_parser -4Df pages-ibdata1/FIL_PAGE_INDEX/0000000000000003.page -t dictionary/SYS_INDEXES.sql | grep 158
000000000B28    2A000001430BCA  SYS_INDEXES     158     376     "PRIMARY"       1       3       0       4294967295
000000000B28    2A000001430C3C  SYS_INDEXES     158     377     "idx\_actor\_last\_name"        1       0       0       4294967295
```

So, index_id of your dropped table(sakila.actor) is 376.

Now you can fetch records of the dropped table from InnoDB index_id 376.
You need to have the table structure of the dropped table, exactly CREATE TABLE statement which the table was created with. Where you can get it? Either from old backup, or from elsewhere. It's also possible to recover the structure from the InnoDB dictionary, but I won't cover it in this answer. Let's just assume you have it.

```
./c_parser -6f pages-ibdata1/FIL_PAGE_INDEX/0000000000000376.page -t actor.sql > dump.tsv 2> load_cmd.sql
```

c_parser outputs records as tab-separated dump to stdout. The dump can be loaded with LOAD DATA command. c_parser prints it to stderr.
































## 系统监测





### 网络连接


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








### 进程



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
































## 安全


#### 生成 32 位随机密码

用 `/dev/urandom` 做种子，用 `sha512sum` 计算，用 `head -c` 取任意位。

```bash
$ cat /dev/urandom | head -10 | sha512sum | head -c 32
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
