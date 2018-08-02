---
toc: true
toc_label: "12. 文件操作"
toc_icon: "copy"
title: "Linux 基础 - 12. 文件操作"
tags: linux 文件操作
categories: "linux"
classes: wide
excerpt: ""
published: false
header:
  overlay_image: /assets/images/header/linux.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---



## 12.1 压缩

* 压缩的好处

硬盘容纳更多的数据

提升网站带宽的可用率





### 12.1.1 压缩文件的原理

* 充分利用没有用到的空间

* 统计记录重复的 01




### 12.1.2 常用压缩工具

Linux 上常见的压缩工具是 `gzip`，`bzip2`，`xz`。

* `gzip` 压缩比最小，最快

* `xz` 压缩比最大，最慢

#### 压缩文件的扩展名

给压缩文件使用扩展名是为了 **辨别原始压缩软件**，以便决定用哪个软件解压。

`.Z`    compress 已过时

`.zip`    兼容 windows

`.gz`    gzip

`.bz2`    bzip2

`.xz`    xz

`.tar`    tar 包，未压缩

`.tar.gz`    tar 包，gzip 压缩

`.tar.bz2`    tar 包，bzip2 压缩

`.tar.xz`    tar 包，xz 压缩

zip、gzip、bzip2、xz 只能针对 **一个文件** 来压缩与解压。


#### tar 文件

tar 只会打包，**无压缩** 功能。

因此 **`tar` 需要与压缩工具配合使用**。

包文件：Tarfile，只 **打包未压缩** 得到的文件。

压缩包：Tarball，**打包且压缩** 得到的文件。






### 12.1.3 GZIP

`gzip` 是应用最广的压缩工具，为替换 compress 而生。

`gzip` 可以解开 compress, zip 与 gzip 格式的压缩文件。

#### 语法

`gzip [-cdtv#] 文件名`


`-c`    压缩或解压缩到 stdout，保持原文件不动。如果输入文件是多个，则输出多个压缩文件。

`-d`    解压缩

`-t`    校验压缩文件一致性

`-v`    显示压缩比等反馈信息

`-N`    指定压缩等级，-1 最快，-9 最慢，默认为 -6

#### 范例

* 压缩

gzip -v services

**删除原文件**，生成 `.gz` 文件。

* 查看压缩包中的文件

`zcat services.gz`

* 用 zmore 直接查看

`zmore services.gz`

* 用 zless 直接查看

`zless services.gz`

* 解压缩

`gzip -d services.gz`

解压，删除压缩包

* 指定压缩比，保留原文件

`gzip -9 -c services > services.gz`

因 -c 用于把结果输出为 stdout，后面用重定向再把 stdout 做为输入生成 gz 文件。

* 在压缩包中查找关键字，显示行号

zgrep -n 'http' services.gz






### 12.1.4 BZIP2

`bzip2` 替换 `gzip` 提供更佳的压缩比。

`bzip2 [-cdkzv#] 文件名`

`-c`    压缩或解压缩到 stdout，保留原文件

`-z`    压缩 （默认值，可以不加）

`-d`    解压缩

`-k`    保留原文件

`-v`    显示压缩比等反馈信息；

`-N`    指定压缩等级

#### 范例

* 压缩

`bzip2 -v services`

* 查看文件内容

`bzcat services.bz2`

* 解压，删除压缩文件

`bzip2 -d services.bz2`

* 最大压缩，保留原文件

`bzip2 -9 -c services > services.bz2`

同理，因 -c 把压缩结果输出到 stdout，必须用重定向来生成压缩文件。






### 12.1.5 XZ

`xz` 是较新的工具，压缩比较高。

`xz [dtlkc#] 文件名`

`-d`    解压缩

`-t`    测试压缩文件的完整性

`-l `   查看压缩文件的相关信息

`-k`    保留原文件

`-c`    压缩结果输出到 stdout

`-#`    # 为数字，指定压缩等级

`-v`    显示压缩过程中的详细信息

#### 范例

* 压缩

`xz -v services`

* 压缩并保留原文件

`xz -k services`

* 解压缩

`xz -d services.xz`

* 查看压缩文件信息

`xz -l services.xz`

* 直接查看压缩文件内容

`xzcat services.xz`























### 12.1.6 TAR

tar 可以结合压缩工具一起使用，做到压缩、打包。

#### 语法

 * 打包并压缩

`tar [-z|-j|-J] [cv] [-f 压缩包] 原文件...`

* 查看压缩包中的文件列表

`tar [-z|-j|-J] [tv] [-f 压缩包]`

*  解压缩

`tar [-z|-j|-J] [xv] [-f 压缩包] [-C 目录]`

#### 选项与参数

`-c`    打包

`-t`    察看包内文件列表

`-x`    解包

`-z`    用 gzip

`-j`    用 bzip2

`-J`    用 xz

`-v`    详细显示处理过程

`-f`    文件名

`-C`    指定解压目录

`-p`    保留原文件权限

`-P`    保留绝对路径

`--exclude=FILE`    排除指定文件

tar 不会给压缩文件自动命名，用户必须指定压缩包文件名。

| 参数 | 使用软件 | 后缀 |
| :--- | :--- | :--- |
|   |   | .tar |
| -z | gzip | .tar.gz |
| -j | bzip2 | .tar.bz2 |
| -J | xz | .tar.xz |

#### 范例


##### 备份 `/etc/` 目录

* 压缩打包

`time tar -zpcv -f /root/etc.tar.gz /etc`

* 解压缩

`tar -jxv -f /root/etc.tar.bz2`　　解压到当前目录

`tar -jxv -f /root/etc.tar.bz2 -C /tmp`　　解压到指定目录

* 解压部分文件

`tar -jxv -f /root/etc.tar.bz2 etc/shadow`　　

* 打包目录，排除部分文件

打包 `/etc`，`/root`，排除 `/root/etc*`，目标压缩包 `/root/system.tar.bz2` ，所以也要 **排除自己**：

`tar -jcv -f /root/system.tar.bz2 --exclude=/root/etc*

--exclude=/root/system.tar.bz2 /etc /root`

* 只备份新文件

`tar -jcv -f /root/new.tar.bz2 --newer-mtime="2015/06/17" /etc/*`

* 查看压缩包内文件

因为压缩包内的目录结尾均有斜杠，因此排除以斜杠结尾的文件

`tar -jtv -f /root/new.tar.bz2 | grep -v '/$'`





#### 打包到设备

`tar` 可以把文件打包到某些特别的设备，如 **磁带机**。

磁带机是 **一次性** 读取/写入的设备，无法使用 `cp` 等命令来复制

`tar -cv -f /dev/st0 /home /root /etc`


#### 复制

通过标准输入输出的数据流重定向，以及管道命令，把文件 **边打包边解包** 到目录，类似于复制。

* 把 /etc 目录一边打包一边在 `/tmp` 解开

`tar -cvf - /etc | tar -xvf - -C /tmp`

输出文件与输入文件均用 **`-`** 代替，分别代表 stdout 与 stdin 。可把 `-` 看作内存中的一个设备（**缓冲区**）。


#### 系统备份

* 备份目录：

`/etc/`    配置文件

`/home/`    用户家目录

`/var/spool/mail/`    邮件目录

`/var/spool/cron/`    计划任务配置文件

`/root`    root 家目录

* 排除：`/home/loop*` ，`/root` 中的压缩包

* 目标位置： `/backups`

* 权限：`/backups` 目录只有 root 有权访问。

* 压缩包：`backup-system-20150701.tar.bz2`

##### 目录与权限

`mkdir /backups`

`chmod 700 /backups`

##### 创建备份

`tar -jcv -f /backups/backup-system-20150701.tar.bz2`

`--exclude=/root/*.bz2 --exclude=/root/*.gz --exclude=/home/loop*`

`/etc /home /var/spool/mail /var/spool/cron /root`

#### 解压后的 SELinux 问题

当需要用备份的数据来覆盖系统时，复原后的系统需重新建立 SELinux 安全上下文。

* 通过各种可行的修复方式登陆系统，修改 `/etc/selinux/config` 文件，把 SELinux 改成 permissive 模式，重新启动，系统就正常了。

* 在第一次修复系统后，不要立即重新启动，先用 `restorecon -Rv /etc` 自动修复一下 SELinux 的类型即可。

* 通过各种可行的方式登陆系统，创建 `/.autorelabel` 文件，重新启动后系统会自动修复 SELinux 的类型，并且又会再次重新启动，之后就正常了。
