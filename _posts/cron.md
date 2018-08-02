---
toc: true
toc_label: "18. 计划任务"
toc_icon: "code-branch"
title: "计划任务"
tag: [cron, at, crontab, anacron]
tags: linux
categories: "linux"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/linux.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---


按周期执行任务，按指定时间执行任务，非持续运行主机的计划任务。

at 和 cron 轮询时间均为 **一分钟**。



## 18.1 一次性计划任务

在指定时间 **单次** 执行任务，任务执行完毕，该计划即删除。

`at` 用于处理一次性计划任务，需要 atd 服务的支持。

`at` 依赖于 `atd` 服务，务必确保该服务已激活并启用。


### 18.1.1 at 的运行方式

用 `at` 命令创建计划任务，在命令行创建的每一个计划任务均会以文本文件的形式保存在 `/var/spool/at/` 目录中，这些计划任务会被 atd 服务自动调用并执行。

#### at 授权控制

为了控制哪些 **用户** 有权使用该程序，at 使用 `/etc/at.allow` 与 `/etc/at.deny` 这两个文件来定义白名单和黑名单，文件中每行放一个用户名。

白名单的优先级大于黑名单，因此如果同一个用户名同时出现在白名单与黑名单中，他有权使用 `at`。

1. 白名单：只有白名单中的用户才能使用 `at`；
2. 黑名单：黑名单中的用户无权使用 `at`；
3. 如果两个文件中都没找到，则只有 root 可以使用 `at`。

白名单默认不存在，默认使用黑名单，而且黑名单默认是空的，即允许所有人使用 `at`。



### 18.1.2 at 使用方法

`at`，`batch`，`atq`，`atrm` 是一套软件，共同处理一次性计划任务。



#### `at`

`at` 命令用于设置定时任务。

在命令行键入 `at 时间` 之后，会进入交互命令界面，提示符为 `at>`，可以键入一行或多行命令。

`at` 既可以从标准输入来读取命令，也可以在计划时间，通过读取指定脚本来执行命令。

```bash
~]# at 19:30 today
at> echo "what's up, bro?"
at> ^D
```


##### 语法

`at [-V] [-q queue] [-f file] [-mMlv] timespec...`

`at [-V] [-q queue] [-f file] [-mMkv] [-t time]`

`at -c job [job...]`

`at [-rd] job [job...]`

`at -b`

`-m`   强制给用户发邮件

`-l`   相当于 atq，查看该用户的所有计划任务

`-r`/`-d`   相当于 atrm，删除指定计划任务

`-b`   相当于 batch，系统负载低于特定值时才执行计划任务

`-v`   用较明显的时间格式查看 at 计划任务列表

`-c`   查看指定任务号码的任务内容


##### 时间格式

`at` 使用一种非常生活化的方式来表示时间和日期，它甚至懂得一些人们日常会使用的词语。

表示方法   |  含义
------------------ | -------------------------
noon               | 12:00 PM October 18 2014
midnight           | 12:00 AM October 19 2014
teatime            | 4:00 PM October 18 2014  
tomorrow           | 10:00 AM October 19 2014
noon tomorrow      | 12:00 PM October 19 2014
next week          | 10:00 AM October 25 2014
next monday        | 10:00 AM October 24 2014
fri                | 10:00 AM October 21 2014
NOV                | 10:00 AM November 18 2014
9:00 AM            | 9:00 AM October 19 2014  
2:30 PM            | 2:30 PM October 18 2014  
1430               | 2:30 PM October 18 2014  
2:30 PM tomorrow   | 2:30 PM October 19 2014  
2:30 PM next month | 2:30 PM November 18 2014
2:30 PM Fri        | 2:30 PM October 21 2014  
2:30 PM 10/21      | 2:30 PM October 21 2014  
2:30 PM Oct 21     | 2:30 PM October 21 2014  
2:30 PM 10/21/2014 | 2:30 PM October 21 2014  
2:30 PM 21.10.14   | 2:30 PM October 21 2014  
now + 30 minutes   | 10:30 AM October 18 2014
now + 1 hour       | 11:00 AM October 18 2014
now + 2 days       | 10:00 AM October 20 2014
4 PM + 2 days      | 4:00 PM October 20 2014  
now + 3 weeks      | 10:00 AM November 8 2014
now + 4 months     | 10:00 AM February 18 2015
now + 5 years      | 10:00 AM October 18 2019



##### at 的输出

`at` 的所有标准输出和标准错误都会发到执行者的 **邮箱**。

要想在终端看到输出，可以重定向到终端设备，如 `echo "Hello" > /dev/tty1`。

如果 at shell 中的命令没有任何输出，则默认不会发邮件给执行者。

如果想让 at 无论如何都发邮件，告知任务执行情况，可以用 `at -m 时间` 来下达命令。

系统会将 at 任务独立于当前 bash 环境，直接交给系统的 atd 程序接管，因此，下达了 at 的任务之后就可以立刻离线。
{: .notice--success}





#### `atq`

`atq` 查看当前计划任务列表，返回结果的第一列为计划任务号码

普通用户只能查看属于自己的任务列表，超级用户可以查看所有用户的任务列表。



#### `atrm`

`atrm （jobnumber）` 通过指定任务号码，删除指定计划任务



#### `batch`

当 CPU 的任务负载低于特定数值时，才会执行计划任务，目的在于减轻系统负载。

该阈值默认为 0.8，是使用 `atd -l 0.8` 设置的。




#### 范例


##### 五分钟后，把文件寄给 root

```
~]# at now + 5 minutes
at> /bin/mail -s "testing at job" root < /root/.bashrc
at> <EOT>
job 2 at Thu Jul 30 19:35:00 2015
```

##### 查看第 2 个计划任务

`at -c 2`


##### 于 2015/08/04 23:00 关机

```
~]# at 23:00 2015-08-04
at> /bin/sync
at> /sbin/shutdown -h now
at> <EOT>
job 3 at Tue Aug 4 23:00:00 2015
```






































## 18.2 周期性计划任务

按固定周期 **循环** 执行任务。



### 18.2.1 常见的周期任务

##### logrotate

`logrotate` 用于对日志进行自动截断（或轮循）、压缩及删除，防止日志文件耗尽存储空间。

##### logwatch

`logwatch` 用于分析日志文件。

##### updatedb

`updatedb` 用于更新 `locate` 数据库。

##### mandb

`mandb` 用于创建 man page 数据库。

##### 创建 RPM 日志

RPM 数据库的重新创建

##### tmpwatch

`tmpwatch` 用于清除其它软件产生的暂存盘，以释放可用空间。

##### 网络服务维护

Linux 通常会 **分析** apache 等服务器软件的 **日志**，**检查证书** 是否过期等。











### 18.2.2 CRON

`cron` 是一个基于时间的工作日程管理软件，它可用来管理周期性计划任务，通常用于自动化系统维护或管理。

`cron` 的计划任务由 `crond` 这个系统服务来控制。

`cron` 会每分钟自动检查以下文件和目录：

* `/etc/crontab`：系统全局配置文件，默认为空。
* `/etc/cron.d/`：目录中的任何文件
* `/var/spool/cron/`：目录中搜索与系统中用户同名的配置文件，将其加载到内存。

通常根据配置文件的修改时间来判断是否有更新，cron 会把更新的配置文件重新回到到内存。

`/etc/crontab` 早期用于设置每日、每周、每月的计划任务，现在交给 `/etc/anacrontab` 了。
{: .notice--success}



#### 授权控制

与 `at` 相似，cron 对用户授权的控制通过白名单或黑名单实现：

白名单： `/etc/cron.allow`

只有白名单中的用户才有权使用 cron，其它用户不可用；

黑名单：`/etc/cron.deny`

黑名单中的用户无权使用 cron，其它用户可用；

白名单比黑名单优先，实际使用中只用一个，默认使用黑名单。




#### 配置文件

crontab = cron table

`cron` 的 **配置文件** 为 crontab 文件，其中规范了一定周期内需要运行的脚本命令。

* 用户允许维护其单独的 crontab 文件，`/var/spool/cron/user`
* 同时系统会维护一个全局的 crontab 文件 `/etc/crontab`

crond 服务会 **每分钟** 读取一次 `/etc/crontab` 与 `/var/spool/cron/user`。

##### 用户私有配置文件

用户个人创建的 cron 任务，其配置文件会以用户名命名，自动保存到 `/var/spool/cron/` 目录中，如 `/var/spool/conr/neo`。

```bash
~]# cat /var/spool/cron/neo
*/1 * * * * echo "well done man" > /dev/pts/1
```

###### 周期格式

`分 时 日 月 周 命令`，**周** 指每周的星期几。

##### 全局配置文件

`/etc/crontab`

```bash
~]# cat /etc/crontab
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root

# For details see man 4 crontabs

# Example of job definition:
# .---------------- minute (0 - 59)
# |  .------------- hour (0 - 23)
# |  |  .---------- day of month (1 - 31)
# |  |  |  .------- month (1 - 12) OR jan,feb,mar,apr ...
# |  |  |  |  .---- day of week (0 - 6) (Sunday=0 or 7) OR sun,mon,tue,wed,thu,fri,sat
# |  |  |  |  |
# *  *  *  *  * user-name  command to be executed
```

`MAILTO=root`

当 `/etc/crontab` 中的计划任务发生错误时，或任务的执行结果有标准输出、标准错误时，应该给谁发邮件。也可以指定其他邮箱，如 `MAILTO=neo@my.host.name`。

###### 周期格式

`分 时 日 月 周 用户 命令`，**周** 指每周的星期几。

全局配置文件与用户私有配置文件在设置任务时的唯一区别：全局配置文件在命令之前要指定用户名。
{: .notice--success}





#### `crontab` 命令

`crontab` 命令专门用于维护 crontab 配置文件。


##### 语法

`crontab [-u username] [-l|-e|-r] `

`-u`   为指定用户创建或删除计划任务

`-e`   编辑任务

`-l`   查看任务

`-r`   删除全部计划任务

运行 `crontab -e` 之后会进入 vi 的界面，每个计划任务一行，以固定格式编辑。


##### 辅助字符

| 字符 | 代表意义 | 范例 |
| :--- | :--- | :--- |
| \* | 任何时刻都接受 | 05 12 * * * 每天 12:05 执行 |
| , | 分隔时刻 | 0 3,6 * * * 每天 3 点和 6 点都要执行 |
| - | 时间范围 | 20 8-12 * * * 8点到12点期间的每小时的20分都执行 |
| /n | 每隔 n 单位 | */5 * * * * 每五分钟执行一次 |



##### 各字段有效值

| 代表意义 | 分钟 | 小时 | 日期 | 月份 | 周 | 命令 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 数字范围 | 0-59 | 0-23 | 1-31 | 1-12 | 0-7 | 具体任务内容 |

在需要循环的字段上写明具体数字，不使用的字段用星号代替。

**周** 用 0 到 7 表示，0 和 7 均代表 **星期日**。
{: .notice--success}



#### 范例

##### 用 neo 的身份，每天 12:00 给自己发邮件

```
~]$ crontab -e
 0 12 * * * mail -s "at 12:00" neo < /home/neo/.bashrc
```

##### 每年 5 月 1 日 23:59 发邮件给 kiki，邮件内容保存在 /home/neo/lover.txt。

```
59 23 1 5 * mail kiki < /home/neo/lover.txt
```

##### 每五分钟执行一次 /home/neo/test.sh

```
*/5 * * * * /home/neo/test.sh
```

##### 每周五 16:30 发邮件

```
 30 16 * * 5 mail friend@his.server.name < /home/neo/friend.txt
```

##### 查看计划任务

```
~]$ crontab -l
0 12 * * * mail -s "at 12:00" neo < /home/neo/.bashrc
59 23 1 5 * mail kiki < /home/neo/lover.txt
```

##### 清除全部计划任务

```
~]$ crontab -r
~]$ crontab -l
no crontab for neo
```






#### 任务日志

cron 执行的每一项任务都会被记录到 `/var/log/cron` 日志中，常通过查看该日志来判断系统是否被植入木马。



#### `/etc/cron.d/`

该目录中的所有文件都会被 cron 读取。

```
~]# ls -l /etc/cron.d
-rw-r--r--. 1 root root 128 Jul 30  2014 0hourly
-rw-r--r--. 1 root root 108 Mar  6 10:12 raid-check
-rw-------. 1 root root 235 Mar  6 13:45 sysstat
-rw-r--r--. 1 root root 187 Jan 28  2014 unbound-anchor

~]# cat /etc/cron.d/0hourly
# Run the hourly jobs
SHELL=/bin/bash
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root
01 * * * * root run-parts /etc/cron.hourly
```

可见，每小时的计划任务是由 `run-parts` 完成的。

##### `run-parts`

`run-parts` 是一个脚本，绝对路径为 `/usr/bin/run-parts`，它会在约 5 分钟内 **随机** 选一个时间来执行 `/etc/cron.hourly/` 目录中的所有 **可执行文件**。因此，放在 `/etc/cron.hourly/` 的文件必须是 **脚本**。

`/etc/cron.hourly/` 目录中的可以脚本，也可以是脚本的链接。

这些脚本就会 cron 在每小时的 1 分开始后的 5 分钟内，随机找一个时刻执行。

除了 `/etc/cron.hourly/` 目录，`/etc/` 下面还有 `/etc/cron.daily/`, `/etc /cron.weekly/`, `/etc/cron.monthly/`，这三个目录是交给 `anacron` 处理的。
{: .notice--info}





### 18.2.3 注意事项

#### 错开各任务时间

如果每个计划任务都在同一个时刻启动，过于占用系统资源，因此要把各任务的时间错开。

```
~]# vim /etc/crontab
1,6,11,16,21,26,31,36,41,46,51,56 * * * * root  CMD1
2,7,12,17,22,27,32,37,42,47,52,57 * * * * root  CMD2
3,8,13,18,23,28,33,38,43,48,53,58 * * * * root  CMD3
4,9,14,19,24,29,34,39,44,49,54,59 * * * * root  CMD4
```

#### 取消不必要的输出

通过数据流重定向到 /dev/null 取消不必要的输出

#### 系统安全

很多木马都是用例行命令的方式植入的，可以检查 /var/log/cron。

#### 周与日月不可同时指定

只能分别以周或者是日月为单位来循环，不可使用「几月几号且为星期几」的模式任务。

















## 18.3 ANACRON



### 18.3.1 anacron 简介

`anacron` 命令用于阶段性执行命令，执行频率以天计。它不假设主机会持续运行。因此，可以用于 **非持续运转的主机**，执行日、周、月的周期性计划任务。

对于每项计划任务，anacron 会检查其在过去的 n 天里是否执行过，如果发现 n 天以来从未执行过，anacron 会在延迟分钟数以后执行该任务。

任务完成后，把本次执行日期记录在该任务专用的 **时间戳文件** 中，以便随时了解下次执行该任务的时间。

**时间戳文件** 保存在 `/var/spool/anacron/` 目录中，通常为 `cron.daily`、`cron.monthly`、`cron.weekly`。
{: .notice--success}

全部任务执行完毕，anacron 退出。

如果任务有标准输出或标准错误，均会给用户发邮件。

被激活的任务（anacron 决定运行并正在等待其延迟，或正在运行的任务）均会被锁定，使得 anacron 不能运行同一任务的副本。




### 18.3.2 语法

`anacron [-sfn] [job]..`

`anacron -u [job]..`


`-s`   依次执行计划任务，前一个任务完成后，才继续执行下一个

`-f`   强制执行，忽略时间戳

`-n`   立即进行未进行的任务，忽略延迟时间

`-u`   仅更新时间戳，不执行计划任务





### 18.3.3 相关文件

#### `/etc/anacrontab`

anacron 配置文件。默认包含每天、每周、每月的计划任务。

计划任务主要字段为：

`间隔天数，延迟分钟数，任务名称，命令`

#### `/var/spool/anacron/`

`cron.daily`，`cron.monthly`，`cron.weekly` 时间戳文件，文件内容均为一行日期，格式为 20171001。

每次执行完计划任务，anacron 会更新该时间。

#### `/etc/cron.hourly/0anacron`

每小时被 cron 执行一次，对比时间戳文件与当前日期，只要不同就执行 anacron 计划任务。文件名前面加 0 是为了让时间戳最先被更新。
