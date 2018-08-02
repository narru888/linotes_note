---
toc: true
toc_label: "Linux 的使用 - 文件系统"
toc_icon: "laptop"
title: "Linux 的使用 - 文件系统"
comments: true
tags: linux 文件系统 格式化 xfs ext findddddd
categories: "tools"
classes: wide
excerpt: "文件系统对象的空间占用，文件的属性，文件的内容，文件的操作，文件的比较"
header:
  overlay_image: /assets/images/header/linux.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---




## 文件系统



### 文件系统的挂载

SMB ：Server Message Block。SMB 是文件共享协议，由 IBM 创建。

CIFS ：Common Internet File System。CIFS 是 SMB 协议的一个特殊的实现，由微软创建。

确认系统安装了 CIFS 工具：

```bash
$ cat /proc/filesystems | grep cifs
nodev   cifs
```

#### windows 共享文件夹挂载

交互式输入密码：

```bash
$ sudo mount -t cifs -o username=neo //192.168.1.124/share /mnt/win
Password for neo@//192.168.1.124/share:  ******
```

直接键入密码：

```bash
$ sudo mount -t cifs -o username=neo,password=matrix //192.168.1.124/share /mnt/win
```

编辑 `/etc/fstab`：

```bash
$ sudo vi /etc/fstab
//192.168.1.124/share /mnt/win cifs username=neo,password=matrix,rw 0 0
```

这样直接把用户名和密码直接写在多人可见的配置文件中终归不够安全。

最安全的办法：

把用户名和密码保存在单独的文件中，然后在 `fstab` 中指定其位置。

```bash
$ sudo vi /root/.smbcred
$ sudo cat /root/.smbcred
username=neo
password=matrix

$ sudo chmod 400 /root/.smbcred

$ cat /etc/fstab|grep /mnt
//192.168.1.124/share /mnt/win cifs credentials=/root/.smbcred,rw 0 0
```

>如果挂载失败，有可能是 `mount.cifs` 没有安装，可以 `yum install -y cifs-utils` 重新安装试一下。












## 存储空间占用



### `df -H`

查看文件系统磁盘空间占用情况。`-H` 参数以易于阅读的方式显示，按 1G=1000M 计。

```
~]$ df -H
Filesystem             Size  Used Avail Use% Mounted on
/dev/mapper/zion-root   11G  5.2G  5.6G  48% /
devtmpfs               496M     0  496M   0% /dev
tmpfs                  512M     0  512M   0% /dev/shm
tmpfs                  512M  1.1M  511M   1% /run
tmpfs                  512M     0  512M   0% /sys/fs/cgroup
/dev/sda2              1.1G  221M  843M  21% /boot
/dev/mapper/zion-home  5.4G   40M  5.4G   1% /home
tmpfs                  103M   13k  103M   1% /run/user/42
tmpfs                  103M     0  103M   0% /run/user/1004
```

`du -sh /tmp/test`  查看 **目录所占磁盘空间**

`mount | column -t`  查看 **已挂载的分区状态**

`swapon -s`  查看 **所有交换分区**

`dmesg | grep IDE`  查看 **启动时 IDE 设备监测状况**




























## 文件内容





### 换行符

换行符 CR 和 LF 均来自于打字机时代。

* CR 表示把打字机的打字部件移动到最左侧，以便准备从 **最左侧** 开始打字
* LF 表示 **向上** 卷纸，以便准备开始打新的一行

最早的软件开发完全模拟打字机的这两个操作，到后来有些人觉得有点麻烦，干脆只留了一个。但由于没有统一的标准，所以结果是有的平台上仍沿用两个控制符来换行，即 CR + LF，有的平台只用一个，即 LF。

简写 | 原文 | 十进制 ASCII 码 | 转义序列
--- | --- | --- | ---
LF  | Line-Feed | 10 | `\n`
CR  | Carriage-Return | 13 | `\r`


#### UNIX 换行符

UNIX 为 LF，即 `\n`。


#### DOS 换行符

Windows 或 DOS 换行为 CR + LF，即 `\r\n`。






























## 文件属性



### 文件名



#### 提取路径中的文件名

```bash
$ basename /etc/sysconfig/network
network
```



#### 提取目录名

```bash
$ dirname /etc/sysconfig/network
/etc/sysconfig
```





























## 文件的比较







### `diff`

diff 用于以行为单位，对比两个文件之间 **内容的差异**。

通常用于比较 **同一文件**（或软件）的新旧 **版本差异**。

如果用 diff 对 **目录** 进行比较，则会比较该目录中具有 **相同文件名的文件**，而不会对其子目录文件进行任何比较操作。


#### 语法

`diff [-bBi] from-file to-file`

`from-file`  原始文件，可用 - 代替

`to-file`  对比文件，可用 - 代替

`-b`  忽略空格数量的差异

`-B`  忽略空白行的差异

`-i`  忽略大小写

`-u`  以合并的方式显示差异


#### 对比文件的差异

准备两个练习文件

```bash
$ cp /etc/passwd passwd.old
$ cat /etc/passwd | sed -e '4d' -e '6c no six line' > passwd.new
```

```
$ diff passwd.old passwd.new

4d3        # 左边第四行被删除了，基准是右边的第三行
< adm:x:3:4:adm:/var/adm:/sbin/nologin   # 左边文件被删除的那一行
6c5 # 左边文件的第六行被替换成右边文件的第五行
< sync:x:5:0:sync:/sbin:/bin/sync  # 左边第六行内容
---
> no six line  # 右边第五行内容
```


#### 对比目录的差异

```bash
$ diff /etc/rc0.d/ /etc/rc5.d/
Only in /etc/rc0.d/: K90network
Only in /etc/rc5.d/: S10network
```














### `cmp`

`cmp` **逐个字节** 地对比两文件，也可以对比二进制文件。

`cmp [-l] file1 file2`

`-l`  将所有的不同点都列出来

默认仅输出第一处差异。

* 范例

```
cmp passwd.old passwd.new
passwd.old passwd.new differ: char 106, line 4
```













### `patch`

patch 命令需要 **与 diff 配合使用**，可以把由 diff 生成的文件差异做成 **补丁** 文件。



#### 语法

```
patch [−blNR] [−c|−e|−n|−u] [−d dir] [−D define] [−i patchfile] [−o outfile] [−p num] [−r rejectfile] [file]
```

##### 给旧文件打补丁

`patch -pN < patch_file` 更新

`patch -R -pN < patch_file` 还原

选项与参数：

`-p`  剥掉几层目录

...`-p0`  不剥目录，/aa/bb/cc/dd/fl.c

...`-p1`  剥掉一层，aa/bb/cc/dd/fl.c

...`-p4`  剥掉4层，dd/fl.c

`-R`  把新文件还原成原来版本

##### 更新旧版文件

`patch -p0 < passwd.patch`

##### 恢复旧文件的内容

`patch -R -p0 < passwd.patch`




#### 用 `diff` 生成差异文件

```bash
diff -u passwd.old passwd.new > passwd.patch
```

查看一下差异文件的内容：

```bash
$ cat passwd.patch

--- passwd.old 2015-07-14 22:37:43.322535054 +0800 # 新旧文件的信息
+++ passwd.new 2015-07-14 22:38:03.010535054 +0800
@@ -1,9 +1,8 @@
# 新旧文件要修改数据的界定范围，旧文件在 1-9 行，新文件在 1-8 行
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
-adm:x:3:4:adm:/var/adm:/sbin/nologin # 左侧文件删除
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
-sync:x:5:0:sync:/sbin:/bin/sync # 左侧文件删除
+no six line # 右侧新文件加入
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
```

一般来说，用 diff 生成的差异文件通常使用扩展名 `.patch` 。以行为单位，看到 `-` 就删除，看到 `+` 就添加。
{: .notice}



































## 文件的转换






### 字符编码转换

`iconv -f big5 -t utf8 vi.big5 -o vi.utf8`	繁体转 UTF8

`iconv -f big5 -t gb2312 vi.big5 -o vi.gb`	繁体转简体

`iconv --list`	查看支持的所有语系





### 换行符的转换

`dos2unix` 工具用于转换 DOS 换行符。软件包含 `dos2unix` 和 `unix2dos` 两个工具。

`-k`  保留原 mtime

`-n`  另存为新文件


#### UNIX 转 DOS

```bash
$ unix2dos -k textfile
```

转换后直接覆盖原文件。


#### DOS 转 UNIX

```bash
$ dos2unix -k -n textfile textfile.linux
```

转换后另存为新文件。





























## 文件的操作



### SPLIT

把大文件切割成为若干小文件。

`split [-bl] file PREFIX`

`-b`  按容量切割，可加单位，b, k, m

`-l`  按行数切割

`PREFIX`  切块文件名

#### 范例

* 切割成 300k 的文件

`cd /tmp; split -b 300k /etc/services services`

* 合成一个文件，文件名为 servicesback

`cat services\* >> servicesback`

* 把 ls -al / 输出的信息，每十行存成一个文件

`ls -al / | split -l 10 - lsroot`
