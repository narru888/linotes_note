---
toc: true
toc_label: "速查手册-文件操作"
toc_icon: "book"
title: "文件操作"
tag: [速查, 索引, 文件系统, 操作系统]
category: "handbook"
published: false
---







### 2.2 文件

* 目录也是一种文件

* 目录文件的结构非常简单，就是一系列目录项（文件名 - inode 编号）的列表。

* 目录文件的读权限和写权限，都是针对目录文件本身



#### 2.2.1 新建


##### MKDIR

`mkdir -m 700 /usr/meng/test`	新建目录，指定权限

`mkdir -p-m 750 /bin/os_1`	新建目录，指定权限，递归

##### TOUCH

`touch /root/test`	新建空文件

`touch /ssss/{what,the,fuck}`  同时新建多个文件

##### SPLIT

把大文件切割成多个小文件。

`split [-bl] file PREFIX`

`-b`  按容量切割，可加单位，b, k, m

`-l`  按行数切割

`PREFIX`  切块文件名前缀，默认为 `x`

* 切割成 300k 的文件

`cd /tmp; split -b 300k /etc/services serv`	碎片文件前缀为 serv

* 合成一个文件

`cat services\* >> servicesback`

* 每十行存成一个文件

`ls -al / | split -l 10 - lsroot` 碎片文件前缀为 lsroot







#### 2.2.2 复制

* 磁带机是 **一次性** 读取/写入的设备，无法使用 cp，应该用 tar

* 通过 STDIN，STDOUT 的数据流重定向，以及管道命令，把文件 **边打包边解包** 到目录，类似于复制。


##### DD

dd 命令用于复制文件并对原文件的内容进行转换和格式化处理。

dd 命令功能很强大，对于一些比较底层的问题，使用 dd 命令往往可以得到出人意料的效果。

经常用来备份裸设备。但是不推荐，若需备份 oracle 裸设备，可以使用 rman 备份，或使用第三方软件，使用 dd 备份的话，管理起来不太方便。

建议在有需要的时候使用 dd 对物理磁盘操作，如果是文件系统的话还是使用 `tar`，`backup`，`cpio` 等其他命令更加方便。

使用 dd 对磁盘操作时，最好使用块设备文件。

* 语法

`dd (选项)`

`bs`=<字节数>	将ibs（输入）与欧巴桑（输出）设成指定的字节数

`cbs`=<字节数>	转换时，每次只转换指定的字节数

`conv`=<关键字>	指定文件转换的方式

`count`=<区块数>	仅读取指定的区块数

`ibs`=<字节数>	每次读取的字节数

`obs`=<字节数>	每次输出的字节数

`if`=<文件>		输入文件。如果不指定 if，默认会从 STDIN 中读取输入

`of`=<文件>		输出到文件

`seek`=<区块数>	一开始输出时，跳过指定的区块数

`skip`=<区块数>	一开始读取时，跳过指定的区块数

`--help`		帮助

`--version`	显示版本信息


块大小可以使用的计量单位：

| 单元大小        | 代码   |                              
| ----------- | ---------- |
| 字节（1B）      | c |
| 字节（2B）      | w |
| 块（512B）     | b  |    
| 千字节（1024B）  | k  |
| 兆字节（1024KB） | M  |
| 吉字节（1024MB） | G  |


* 范例

`dd if=/dev/zero of=/srv/loopdev bs=1M count=512`	创建 512 M 空文件



##### TAR | TAR

`tar -cvf - /etc | tar -xvf - -C /tmp`	把 /etc 目录一边打包一边在 /tmp 解开


##### CP

`cp -l sour dest`	创建 **硬链接** 文件

`cp -s sour dest`	创建 **软链接** 文件

`cp -d symblink symblink_1`	**仅复制链接文件**，而非复制原文件

`cp -r sour dest`	复制文件，**递归** 复制目录。目标的 **属性和权限** 会变成当前用户的。

`cp -p sour dest`	**连同文件的属性**（权限、用户、时间）一起复制过去，而非使用默认属性

`cp -a sour dest`	相当于 `cp -drp`

`cp -i sour dest`	覆盖已存在文件前需 **确认**

`cp -u sour dest`	复制时覆盖旧文件，用于 **备份**



##### LN

`ln source target`	创建硬链接

`ln -s source target`	创建软链接


##### RSYNC

`rsync -a /source/ /tmp/newcd`		复制目录



#### 2.2.3 移动


##### MV

`mv -i sour dest`	强制移动

`mv -i sour dest`	覆盖已存在文件前需 **确认**

`mv -u sour dest`	目标 **更旧** 才 **覆盖**，否则忽略



#### 2.2.4 删除

* 如果文件名含有特殊字符，可以通过 inode 删除

##### RM

`rm -f file`	强制删除

`rm -i file`	删除前请确认

`rm -r file`	递归删除

`\rm -r /tmp/etc`	忽略别名

`rm -- -aaa-`	文件名中有特殊符号


##### RMDIR

`rmdir -p /bin/test`	删除空目录，递归






#### 2.2.5 查找


##### WHICH

`which -a command`	从 PATH 所有目录中查找指定 **命令**


##### WHEREIS

从特定目录查找 **命令**

`whereis -l`	查看 whereis 会查询的目录

`whereis command`	从一些特定的目录中查找文件

`whereis -m command`	只查找 man page

`whereis -s command`	只查找源代码

`whereis -b command`	只查找二进制文件

`whereis -u command`	查找非 msb 的其他特殊文件


##### LOCATE   

从数据库查找文件

`locate -S`	显示 locate 数据库文件名和数据数量

`locate -l 5 passwd`	查找 5 个名称中包含 passwd 的文件


##### UPDATEDB   

`updatedb`	更新 locate 数据库


##### FIND  

用正则表达式查找文件

`find /tmp -mtime 4`	4 天前的 **那一天** 修改的文件

`find /tmp -mtime -4`	4 **天内** 修改的文件

`find /tmp -mtime +4`	5 **天外** 修改的文件

`find /tmp newer file`	查找比 file **更新** 的文件

`find / -uid 1002`	按 **UID** 查找文件

`find / -gid 1002`	按 **GID** 查找文件

`find / -user neo`	按 **拥有者** 查找文件

`find / -group matrix`	按 **组名** 查找文件

`find / -nouser`	查找 **拥有者** 不存在的文件

`find / -nogroup`	查找 **群组不存在** 的文件

`find / -name filename`	按 **文件名** 查找

`find / -name "*pass*"`	按 **文件名** 关键字查找，`*` 可以是空或任何字符

`find / -size +2k`	按 **文件大小** 查找，大于 2k

`find / -type f`	按 **文件类型** 查找，f- 普通，b, c-设备，d-目录，l-链接，s-socket，p-FIFO

`find / -perm 0755`	按 **文件权限** 查找

`find / -perm -0755`	按 **文件权限** 查找，权限位至少满足 0755，即大于等于0755

`find / -perm /0600`	按 **文件权限** 查找，至少有一位与 0755 的位相同，如 0755、1420

`find / -perm /7000 -exec ls -l {} \;`	找到后 **执行另一命令**

`find / -imum 8943`	通过 inode 号码查找文件








#### 2.2.6 文件属性


##### UMASK

设置默认权限掩码

`umask [ -S ] [ Mask ]`

`-S`	用符号表示当前权限掩码

如果不带参数运行，`umask` 命令直接显示当前掩码

`umask a=rx,ug+w`	以符号方式设置

`umask 002`	以数字方式设置

`umask -S`	以符号方式显示当前设置

`umask g-w`		组去掉修改权限

`umask -- -w`	所有人去掉修改权限


##### CHMOD

`chmod` 用于修改文件的权限位。

`chmod [参数] 文件名`

`chmod -R 777 /path/`	 **递归** 修改目录中所有文件

`chmod u=rwx,go=rx file`	同时修改 U/G/O 权限

`chmod a+w file`	单独修改 rwx 权限

`chmod 4755 file`	修改 SUID、SGID、SBIT


##### CHOWN

修改文件拥有者、属组

`chown [参数] 用户 文件`

`-R`	递归处理，将指定目录下的所有文件及子目录一并处理

`-v`	显示指令执行过程

`--reference=`	把指定文件或目录的所属群组全部改为和参考文件或目录的所属群组相同

* 范例

`chown -R newuser file`	修改所有者

`chown -R newuser:newgroup file`  	同时修改所有者及属组

`chown -R :newgroup file`	修改文件的属组为另一个现有组


##### CHGRP

修改文件属组

`chgrp [参数] 组 文件`

`-R`	递归处理，将指定目录下的所有文件及子目录一并处理

`-v`	显示指令执行过程

`--reference=`	把指定文件或目录的所属群组全部改为和参考文件或目录的所属群组相同

* 范例

`chgrp -R anothergroup file`	修改文件的属组为另一个现有组


##### CHATTR  

`chattr` 命令用于修改文件属性，但只能在 EXT 中完整生效，XFS 系统中仅支持部份参数。

`chattr [ -RVf ] [ -v version ] [ -p project ] [ mode ] files...`

`A`	锁定 atime，可减少 I/O。（目前建议使用文件系统挂载参数处理这个项目）

`a`	只能追加内容，不能删除文件，不能修改，仅 root 能设置

`d`	不被 dump 备份

`i`	禁止“删除、改名、设置链接、修改”，仅 root 能设置

`S`	对文件的修改会**同步**写入磁盘。

* 范例

`chattr +i`	锁定文件，禁止改名、修改、删除、链接

`chattr +a`	文件只允许追加内容，不能删除、修改

`chattr +d`	不会被 dump 备份

`chattr +A`	锁定 atime，减少 IO

`chattr +S`	有变化时 **同步** 写入磁盘


##### TOUCH

更新文件的访问和修改时间

`touch program.c`	更新文件的访问和修改时间

`touch  -c program.c`	避免创建新文件

`touch  -m *.o`	仅更新修改时间

`touch  -c  -t 02171425 program.c`	设置访问和修改时间为当前年份的 2 月 17 日的 14:25

`touch  -r file1 program.c`	使用另一文件的时间戳记而不用当前时间

`touch -d "2 days ago" bashrc`	将日期调整为两天前

`touch  -t 198503030303.55 program.c`	使用指定时间而不是当前时间处理文件，1985 年 3 月 3 日上午 3:03:55









#### 2.2.7 查看


##### LS

查看 **文件列表**

`ls -l`	**长格式**，默认字母正序，a 在上

`ls --time=atime`	依 **atime** 正序排列，新的在下

`ls --time=ctime`	依 **ctime** 正序排列，新的在下

`ls -t`	依 ctime 正序排列，新的在上

`ls -ltr`	依 ctime **倒序** 排列，新的在下

`ls -lr`	依字母 **倒序** 排列，a 在下

`ls -l /lib/modules/$(uname -r)/kernel/fs`	当前支持的 **文件系统**

`ls -i path`	显示 inode



##### LSATTR  

查看文件 **隐藏属性**

`lsattr -a`	查看当前目录中所有文件，包括隐藏文件的隐藏属性

`lsattr -d`	仅查看目录本身的隐藏属性

`lsattr -R`	查看连同子目录的隐藏属性



##### PWD

查看 **当前路径**

`pwd -P`	链接显示真实路径


##### FILE  

查看 **文件类型**

`file filename`	查看文件类型



##### CAT

查看 **文件内容**

`cat -v file`	显示不可打印字符

`cat -E file`	显示行尾符 $

`cat -T file`	显示 tab 键，用 ^I表示

`cat -A file`	相当于 -vET

`cat -b file`	非空行显示行号

`cat -n file`	所有行显示行号



##### TAC

反序显示 **文件内容**

同 CAT 一样用法，反序显示



##### NL

带行号显示 **文件内容**

`-b` 指定行号显示方式

`-ba`	所有行显示行号

`-bt`	非空行显示行号（默认值）

`-n` 指定行号对齐方式

`-n ln`	左对齐

`-n rn`	右对齐

`-n rz`	右对齐，并用0填充空位

`-w` 指定行号占用的字符数



##### MORE

`more file` 逐页显示 **文件内容**

`空格`	向下翻一页

`回车`	向下翻一行

`/字符串`	向下查找关键字

`:f`	查看文件名及当前行数

`q`	退出

`b`	往回翻页，对管道无效



##### LESS

`less file`	逐页显示 **文件内容**，可上下翻页，反复查找

`空格`	向下翻一页

`pagedown`	向下翻一页

`pageup`	向上翻一页

`/字符串`	向下查找

`?字符串`	向上查找

`n`	重复查找

`N`	反向重复查找

`g`	到第一行

`G`	到最后一行

`q`	退出



##### HEAD

显示文件 **头几行**

`head -n 6 file`	显示前6行

`head -n -6 file`	去掉后 6 行，显示剩余  



##### TAIL

显示文件 **末几行**

`tail -n 6 file`	显示后 6 行

`tail -n +10 file`	去掉前 10 行，显示剩余

`tail -f log`	持续监测，一旦更新，马上显示


##### READLINK

`readlink /root/symlk`	查看 **软链接** 文件内容，即指向的 **文件路径**


##### OD

以 **指定格式** 显示文件

`od -t c file`	以 ASCII 方式来查看文件内容

`od -t oCc file`	以 8 进制查看储存值与 ASCII 的对照表  







#### 2.2.8 压缩

| 参数 | 压缩软件 | 后缀 |
| :--- | :--- | :--- |
|   |   | .tar |
| -z | gzip | .tar.gz |
| -j | bzip2 | .tar.bz2 |
| -J | xz | .tar.xz |

##### 查看压缩文件列表

`tar -jtv -f orig.tar.bz2`	查看压缩包内文件列表

`tar -jtv -f /root/new.tar.bz2 | grep -v '/$'`	只查看压缩包内文件，排除目录

##### 压缩

`tar -jcv -f destfile.tar.bz2 origfiles`	用 bzip2 压缩

`tar -jcv -f /root/system.tar.bz2 --exclude=/root/etc* --exclude=/root/system.tar.bz2 /etc /root`	压缩时排除特定文件

`tar -jcv -f /root/new.tar.bz2 --newer-mtime="2017/06/17" /etc/*`	只压缩新文件

`tar -zpcv -f /root/etc.tar.gz /etc`	保留文件的权限

##### 解压缩

`tar -jxv -f /root/etc.tar.bz2`　解压到当前目录

`tar -jxv -f /root/etc.tar.bz2 -C /tmp`　　解压到指定目录

`tar -jxv -f /root/etc.tar.bz2 etc/shadow`　解压部分文件


##### 复制

`tar -cv -f /dev/st0 /home /root /etc`	备份到磁带机

`tar -cvf - /etc | tar -xvf - -C /tmp`  把目录边打包边在另一处解开



#### 2.2.9 备份


##### DD

`dd if=/etc/passwd of=/tmp/passwd.back`	复制文件

`dd if=/dev/sr0 of=/tmp/system.iso`	抓取光盘镜像

`dd if=/tmp/system.iso of=/dev/sda`	把可引导镜像刻录到 U 盘，实现 **U盘引导**

`dd if=/dev/vda2 of=/tmp/vda2.img`	备份整个文件系统

`dd if=/dev/vda2 of=/dev/sda1`	对拷整个分区


##### XFSDUMP

xfsdump 仅支持备份文件系统，不支持备份目录，备份前用 `df -h` 先确认。

`xfsdump -I`	查看当前备份信息

`xfsdump -l 0 -L boot_all -M boot_all -f /srv/boot.dump /boot`	零级备份，即完整备份

`xfsdump -l 1 -L boot_2 -M boot_2 -f /srv/boot.dump1 /boot`	一级备份


##### XFSRESTORE

* 恢复备份时，应按照备份的顺序逐级进行。

`xfsrestore -l`	查看当前备份信息

`xfsrestore -f /srv/boot.dump -i /tmp/boot3`	互动模式，允许查看备份文件，有选择地恢复

`xfsrestore -f /srv/boot.dump -L boot_all /boot`	恢复完整备份，直接覆盖

`xfsrestore -f /srv/boot.dump -L boot_all /tmp/boot`	恢复到指定目录

`xfsrestore -f /srv/boot.dump -L boot_all -s grub2 /tmp/boot2`	恢复部分文件


##### CPIO

* 借助 find，ls，cat，echo 等工具，使用管道来实现备份。

`find . | cpio -oc >/dev/rmt0`	备份当前目录中所有文件到磁带机

`cpio -idvc < /dev/st0` 从磁带机还原数据

`cpio -icdI arfile.cpio`	还原指定归档文件

`cpio -icd < arfile.cpio` 	还原指定归档文件

`cpio -ivct arfile.cpio`	查看归档文件中的文件列表

`find boot | cpio -ocvB > /tmp/boot.cpio`	（切换到根目录，) 备份 `/boot` 目录





#### 2.2.10 刻录光盘


##### 创建光盘镜像

* 查看光盘镜像文件

`isoinfo -d -i /home/CentOS-7-x86_64-Minimal-1503-01.iso`

* 把所有要刻录的目录和文件放到一个目录下，然后刻录这个目录

`mkisofs -r -V 'MYDVD' -o /tmp/mydvd.img /tmp/mydvd`


##### 刻录镜像

`wodim --devices dev=/dev/sr0`	查询刻录机的总线地址

`wodim -v dev=/dev/sr0 blank=fast`	擦除 DVD-RW

`wodim -v dev=/dev/sr0 -format`	格式化 DVD-RW

`wodim -v dev=/dev/sr0 file.iso`	刻录光盘
