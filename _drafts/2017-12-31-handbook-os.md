---
toc: true
toc_label: "操作系统"
toc_icon: "book"
title: "速查手册-操作系统"
tag: [操作系统]
category: "handbook"
published: false
---




## 常规信息

`uname -r`	内核版本











## 系统监控



### 运行时间

#### UPTIME

`uptime` 主要用于显示系统已经运行多长时间。

显示内容：

* 当前 **系统时间**
* 系统 **运行时长**
* 当前登陆人数
* 1 分钟内、5 分钟内、10 分钟内的 **系统平均负载**，

##### 系统负载

系统中会有一部分进程处于运行状态或不间断状态，系统平均负载（System Load Averages）用来描述这一类进程的平均数量。

* 处于运行状态的进程要么正要使用 CPU，要么正在等待使用 CPU。
* 处于不间断状态的进程正在等待特定的 I/O 访问，如等待磁盘操作。




### CPU






### 内存

`free`	查看已用、可用内存




### 磁盘

#### 查看磁盘写入速度

```
# dd if=/dev/zero of=/tmp/output.img bs=8k count=256k conv=fdatasync; rm -rf /tmp/output.img
```





### 在线用户

#### `W`

`w` 用于查看当前 **谁在线**，他们 **在做什么**。

```
~]# w
 01:49:18 up 25 days,  3:34,  3 users,  load average: 0.00, 0.01, 0.05
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
dmtsai   tty2                      07Jul15 12days  0.03s  0.03s -bash
dmtsai   pts/0    172.16.200.254   00:18    6.00s  0.31s  0.11s sshd: dmtsai [priv]
```

#### `WHO`

用于查看当前 **谁在线**。

```
~]# who
dmtsai   tty2         2015-07-07 23:07
dmtsai   pts/0        2015-07-22 00:18 （192.168.1.100）
```

#### `LASTLOG`

查看每个帐号的 **最近登陆的时间**。lastlog 会读取 `/var/log/lastlog` 文件并输出。

```
~]# lastlog
Username         Port     From             Latest
root             pts/0                     Wed Jul 22 00:26:08 +0800 2015
bin                                        **Never logged in**
dmtsai           pts/1    192.168.1.100    Wed Jul 22 01:08:07 +0800 2015
vbird1           pts/0                     Wed Jul 22 01:32:17 +0800 2015
pro3                                       **Never logged in**
```



















## 系统操作


### 关机


#### SYNC

数据同步写入磁盘

`sync` 命令把 **内存** 中尚未被更新的数据 **写入硬盘**。


#### SHUTDOWN


`shutdown [-krhc] [时间] [警告信息]`

选项与参数：

`-k`  不关机，只发警告信息

`-r`  关闭系统服务，重启（常用）

`-h`  关闭系统服务，关机 （常用）

`-c`  取消已经在进行的 shutdown 命令

`+5` 指定时间后关机，默认为 1 分钟

shutdown 会以 **安全** 的方式关掉系统，所有已经登陆的用户都会被 **通知** 系统要关机，会 **禁止后来的人** 尝试登陆系统。


##### 范例

`shutdown -h 10 'I will shutdown after 10 mins' `  10分钟后关机并发送警示信息

`shutdown -h now`	立即关机，now 相当于时间为 0

`shutdown -h 20:25`	20:25 关机，若在21:25才下达此命令，则第二天关机

`shutdown -h +10`	十分钟后关机

`shutdown -r now`	立即重启

`shutdown -r +30 'The system will reboot'`	30分钟后重启，同时发送警告信息

`shutdown -k now 'This system will reboot'`	只发警告信息




#### SYSTEMCTL

`systemctl poweoff`	关机

`systemctl reboot`	重启

`systemctl rescue`	进入单人维护模式

`systemctl halt`	进入待机状态





#### REBOOT, HALT, POWEROFF

这几个命令均调用 `systemctl` 命令。

`reboot` 重启

`halt`  系统停止，屏幕保留系统已经停止的信息

`poweroff` 系统关机，关电源，屏幕空白






















## 用户资源配额





### ULIMIT

`ulimit` 工具可以对用户的系统资源进行限制，如 **打开的文件数量、CPU 时间、内存总量** 等。



#### ULIMIT 语法

`ulimit -SHacdfltu [配额]`

`-H`  硬指标，不能超过此值

`-S`  软指标，可以超过此值，超过会有警告信息

通常软指标比硬指标小，达到先警告再限制的效果

`-a`  后面不接任何选项与参数，可列出所有的限制额度

`-c`  限制每个核心文件的大小

程序出错时，系统将该程序在内存中的信息写成核心文件，便于除错。

`-f`  当前 shell 可以创建文件的容量限制

单位为 KBytes，一般为 2GB

`-d`  程序可使用的最大断裂内存（segment）容量；

`-l`  可用于锁定的内存量

`-t`  可使用的最大 CPU 时间 （秒）

`-u`  单一用户可以使用的最大进程数量。


#### 范例

* 查看当前普通用户身份的所有配额

`ulimit -a`

配额为 0 表示没限制

* 限制用户仅能创建 10 MBytes 以下的文件

`ulimit -f 10240`

📕 恢复 ulimit 的设置只需 **重新登陆**。

📕 如果普通用户使用 ulimit 设置了的文件大小配额，他后期只允许 **继续降低** 此配额，无权提升。






### 磁盘配额


#### XFS_QUOTA

##### 语法

`xfs_quota` 用于生成配额的详细报告，设置各种配额参数。

`xfs_quota -x -c "子命令" [挂载点]`

`-x`   专家模式，用于接 `-c 子命令`

`-c`   接 **子命令**

###### 子命令

【 用户子命令 】

`print`  查看当前主机内的文件系统、对应的路径

`df`  与 df 功能相同，可以加上 -b（block）-i（inode）-h（加上单位）

`report`  列出目前的配额项目，可接 -ugr （user/group/project） 及 -bi 等参数

`state`  查看当前具体的配额设置

【 管理员子命令 】

`disable`  暂时禁用配额的限制。其实系统还是在计算配额，只是没有管制。

`enable`  启用配额限制，恢复正常管制。

`off`  针对文件系统完全关闭某类配额的限制。只有卸载、重新挂载才能再次启用配额。

`remove`  清除所有配额设置，必须在 off 状态下进行。


#### 范例

##### 暂时禁用配额

`xfs_quota -x -c "disable -up" /home`

##### 重新恢复配额

`xfs_quota -x -c "enable -up" /home`

##### 关闭文件系统项目配额限制

`xfs_quota -x -c "off -p" /home`

##### 清除某类配额

要先使用 `off` 子命令来关闭该类配额，然后再用 `remove` 清除。

`xfs_quota -x -c "off -u" /home`   关闭用户配额限制

`xfs_quota -x -c "remove -u" /home`   清除用户配额设置

`remove` 会清除所有用户或所有项目的配额，无法针对特定用户或项目单独清除。

##### 查看当前各文件系统支持的挂载参数

`xfs_quota -x -c "print"`

##### 查看 `/home` 的磁盘使用率

`xfs_quota -x -c "df -h" /home`

##### 查看目录中所有用户的配额

`xfs_quota -x -c "report -ubih" /home`

##### 查看当前文件系统具体的配额设置

`xfs_quota -x -c "state"`

##### 针对用户设置块配额

`xfs_quota -x -c "limit -u bsoft=250M bhard=300M myquota1" /home`


##### 针对组设置块配额

`xfs_quota -x -c "limit -g bsoft=950M bhard=1G myquotagrp" /home`

##### 设置宽限时间

`xfs_quota -x -c "timer -ug -b 14days" /home`


##### 生成项目配置文件

`echo "myquotaproject:11" >> /etc/projid`

##### 项目初始化

`xfs_quota -x -c "project -s myquotaproject"`

##### 设置项目配额

`xfs_quota -x -c "limit -p bsoft=450M bhard=500M myquotaproject" /home`















## 计划任务




















## 实例




### 磁盘配额

#### 配额说明

* 帐号：

	五人为一组：myquota1, myquota2, myquota3, myquota4, myquota5。
	密码为 password，用户的初始群组均为 myquotagrp。

* 磁盘配额：

	每人硬性限制 300 MBytes 。软性限制为 250 MBytes。

* 群组配额：

	myquotagrp 群组配额 1 GBytes。

* 共享目录配额：

	共享目录 `/home/myquota`，仅 myquotagrp 组员拥有全部权限，他人无任何权限。目录配额 500 MBytes。

* 宽限时间：

	14 天。

#### 准备工作

用脚本创建五个帐号、共享目录

```bash
#!/bin/bash
groupadd myquotagrp
for username in myquota1 myquota2 myquota3 myquota4 myquota5
do
	useradd -g myquotagrp $username
	echo "password" | passwd --stdin $username
done
mkdir /home/myquota
chgrp myquotagrp /home/myquota
chmod 2770 /home/myquota
```

#### 启用 quota

启用配额需在文件系统挂载时进行。

##### 修改 /etc/fstab

在 XFS 上启用配额需要在 `/etc/fstab` 中，在要启用配额的挂载点，其 **挂载选项** 字段中，加上 **usrquota,grpquota** 的关键字。

```bash
~]# vim /etc/fstab
/dev/mapper/centos-home  /home  xfs  defaults,usrquota,grpquota   0 0
#                                              ^^^^^     ^^^^
```

##### 重新挂载

```bash
~]# umount /home
~]# mount -a
~]# mount | grep home
/dev/mapper/centos-home on /home type xfs （rw,relatime,seclabel,attr2,inode64,usrquota,grpquota）
```

出现了 usrquota, grpquota，说明启用配额成功。

#### 查看当前配额的设置

##### 查看当前各文件系统支持的挂载参数

`xfs_quota -x -c "print"`


##### 查看 /home 的磁盘使用率

`xfs_quota -x -c "df -h" /home`


##### 查看当前 /home 中所有用户的配额

`xfs_quota -x -c "report -ubih" /home`

会按照 block 和 indoe 分别列出所有用户在 `/home` 中的文件使用情况，柔性限制及硬性限制值。

##### 查看当前文件系统具体的配额设置

`xfs_quota -x -c "state"`



#### 设置配额

因为针对组的配额与针对目录的配额无法同时使用，因此分别设置：

##### 针对用户和组设置配额

每用户 250M/300M，群组共 950M/1G，宽限期 14 天。

`xfs_quota -x -c "limit [-ug] b[soft|hard]=N i[soft|hard]=N name"`

`xfs_quota -x -c "timer [-ug] [-bir] Ndays"`

###### 针对用户设置块配额

```bash
~]# xfs_quota -x -c "limit -u bsoft=250M bhard=300M myquota1" /home
~]# xfs_quota -x -c "limit -u bsoft=250M bhard=300M myquota2" /home
~]# xfs_quota -x -c "limit -u bsoft=250M bhard=300M myquota3" /home
~]# xfs_quota -x -c "limit -u bsoft=250M bhard=300M myquota4" /home
~]# xfs_quota -x -c "limit -u bsoft=250M bhard=300M myquota5" /home
~]# xfs_quota -x -c "report -ubih" /home # 查看设置结果
```

###### 针对组设置块配额

```bash
~]# xfs_quota -x -c "limit -g bsoft=950M bhard=1G myquotagrp" /home
~]# xfs_quota -x -c "report -gbih" /home  # 查看设置结果
```

###### 设置宽限时间

`xfs_quota -x -c "timer -ug -b 14days" /home`

设置之后可以用 dd 测试，查看是否生效。

`xfs_quota -x -c "report -ubh" /home`



##### 针对目录设置配额

Quota 认为针对目录设置配额时，一般是为了进行某个具体的项目。

###### 修改 `/etc/fstab`

编辑 `/etc/fstab` 删掉 `grpquota`，换成 **`prjquota`**，卸载 `/home` 重新挂载。


检查是否已经启用项目配额

```bash
~]# xfs_quota -x -c "state"
User quota state on /home （/dev/mapper/centos-home）
  Accounting: ON
  Enforcement: ON
  Inode: #1568 （4 blocks, 4 extents）
Group quota state on /home （/dev/mapper/centos-home）
  Accounting: OFF         # 组配额已关闭
  Enforcement: OFF
  Inode: N/A
Project quota state on /home （/dev/mapper/centos-home）
  Accounting: ON          # 项目配额已打开
  Enforcement: ON
  Inode: N/A
Blocks grace time: [7 days 00:00:30]
Inodes grace time: [7 days 00:00:30]
Realtime Blocks grace time: [7 days 00:00:30]
```

###### 生成项目配置文件

要想设置目录的配额，必须指定一个 **项目名称** 和 **项目 ID**，这些信息保存在 `/etc/projects` 和 `/etc/projid` 文件中。

项目名称格式：`ID:DIR`

`echo "11:/home/myquota" >> /etc/projects`

项目 ID 格式： `NAME:ID`

`echo "myquotaproject:11" >> /etc/projid`

###### 项目初始化

`xfs_quota -x -c "project -s myquotaproject"`

```bash
~]# xfs_quota -x -c "print " /home
Filesystem          Pathname
/home               /dev/mapper/centos-home （uquota, pquota）
/home/myquota       /dev/mapper/centos-home （project 11, myquotaproject）
# 新项目被单独列出来了

~]# xfs_quota -x -c "report -pbih " /home
Project quota on /home （/dev/mapper/centos-home）
                        Blocks                            Inodes
Project ID       Used   Soft   Hard Warn/Grace     Used   Soft   Hard Warn/Grace
---------- --------------------------------- ---------------------------------
myquotaproject      0      0      0  00 [------]      1      0      0  00 [------]
# 确定项目成功初始化
```

###### 设置具体配额

`/home/myquota` 硬性限制 500M，柔性限制 450M。

`xfs_quota -x -c "limit -p bsoft=450M bhard=500M myquotaproject" /home`

```
~]# xfs_quota -x -c "report -pbih " /home
Project quota on /home (/dev/mapper/centos-home)
                            Blocks                            Inodes
Project ID       Used   Soft   Hard Warn/Grace     Used   Soft   Hard Warn/Grace
---------- --------------------------------- ---------------------------------
myquotaproject      0   450M   500M  00 [------]      1      0      0  00 [------]
# root 在该目录下也受同样的限制
```








### 计划任务 - BATCH

手动建立系统负载波动，使计划任务在系统闲置时运行。

#### 提高系统负载

通过计算 pi 来手动提高系统负载

```bash
~]#  echo "scale=100000; 4*a(1)" | bc -lq &
~]#  echo "scale=100000; 4*a(1)" | bc -lq &
~]#  echo "scale=100000; 4*a(1)" | bc -lq &
~]#  echo "scale=100000; 4*a(1)" | bc -lq &
```  

等待数十秒，查看系统负载：

```bash
~]# uptime
 19:56:45 up 2 days, 19:54,  2 users,  load average: 3.93, 2.23, 0.96
```

#### 建立计划任务

计划任务为：更新 locate 数据库。

```bash
~]# batch
at> /usr/bin/updatedb
at> <EOT>
job 4 at Thu Jul 30 19:57:00 2015
```

查看当前时间，同时查看计划任务列表：

```bash
~]# date;atq
Thu Jul 30 19:57:47 CST 2015
4 Thu Jul 30 19:57:00 2015 b root
```

计划时间已过，并没有执行任务。


#### 降低负载

杀掉 pi 计算进程：

```bash
~]# jobs
[1] Running echo "scale=100000; 4*a(1)" | bc -lq &
[2] Running echo "scale=100000; 4*a(1)" | bc -lq &
[3]- Running echo "scale=100000; 4*a(1)" | bc -lq &
[4]+ Running echo "scale=100000; 4*a(1)" | bc -lq &
~]# kill -9 %1 %2 %3 %4
```

等待负载的下降

```bash
~]# uptime; atq
 20:01:33 up 2 days, 19:59,  2 users,  load average: 0.89, 2.29, 1.40
4 Thu Jul 30 19:57:00 2015 b root
~]# uptime; atq
 20:02:52 up 2 days, 20:01,  2 users,  load average: 0.23, 1.75, 1.28
```

当负载降到 0.8 以下时，计划任务被执行。
