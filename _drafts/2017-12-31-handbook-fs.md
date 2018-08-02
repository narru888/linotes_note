---
toc: true
toc_label: "速查手册 - 文件系统"
toc_icon: "book"
title: "速查-文件系统"
tag: [速查, 索引, 文件系统, ]
category: "handbook"
published: false
---




## 磁盘、分区

* Linux 使用 **异步** 处理的方式来 **避免频繁** 的磁盘读写导致的低效


`lsblk -p`	查看块设备的 完整文件名、Major、Minor、大小、类型、挂载点

`lsblk -f`	查看块设备的 文件名、文件系统 、UUID、卷标、挂载点

`blkid /dev/sda6`	查看块设备的 完整文件名、卷标、UUID、文件系统、分区表类型

`parted /dev/sda print`	查看磁盘的 分区表类型、磁盘厂家、磁盘容量、物理扇区及逻辑扇区大小、各分区大小、分区文件系统、分区起始点、分区结束点

`cat /proc/partitions`	查看当前分区表信息，Major、Minor、大小、文件名

`partprobe -s`	手动更新分区表

`parted /dev/sda print`	查看设备 分区表类型、扇区大小、各分区起始块、大小、文件系统

`parted mkpart xfs 开始块 结束块`	新增 XFS 分区  

`parted rm /dev/sda6`	删除分区

`parted /dev/sda mklabel gpt`	把 MBR 分区转换为 GPT 分区，磁盘内的分区全部删除







## 文件系统参数

文件系统类型、卷标、UUID、inode、Superblock、可用空间


* XFS_ADMIN

`xfs_admin` 用于修改 XFS 的参数，需要先卸载分区。

`xfs_admin [-lu] [-L label] [-U uuid] 设备文件名`

`-l`		查看设备卷标

`-L`		设置设备卷标

`-u`		查看设备 UUID

`-U`		设置设备 UUID


* TUNE2FS

修改 EXT 的参数。

`tune2fs -l -L Label -U uuid 设备文件名`

`-l`		读取 superblock 中的数据

`-L`		修改卷标

`-U`		修改 UUID


`tune2fs -L matrix_ext4 /dev/vda5`


### 文件系统类型

`ls -l /lib/modules$(uname -r)/kernel/fs`	查看支持的文件系统

`cat /proc/filesystems`	查看当前已加载的文件系统


### 卷标

`tune2fs -L newlable /dev/vda5`	修改 EXT 设备卷标

`xfs_admin -l /dev/vda4`	查看 XFS 设备卷标

`xfs_admin -L mtfk /dev/vda4`	修改 XFS 设备卷标


### UUID

`uuidgen`	生成 UUID

`tune2fs -U newUUID /dev/sda5`	修改 EXT 设备 UUID

`xfs_admin -u /dev/vda4`	查看 XFS 设备 UUID

`xfs_admin -U e0fa7252-b374-4a06-987a-3cb14f415488 /dev/vda4`　修改 XFS 设备 UUID


### Block

* 如果单个文件小于 Block Size 的过多，则会造成比较严重的磁盘空间浪费。


### Inode

* 除了文件名及实际数据内容之外，文件的所有信息都保存在 **inode** 中：

`文件大小、文件拥有者 UID、文件 GID、RWX 权限、时间戳、链接数、数据块位置、隐藏属性`

* 每个 inode 节点的大小通常为 **128 Bytes** 或 **256 Bytes**

* Linux 系统内部不使用文件名，而 **使用 inode 编号来识别文件**

* 如果文件太大， 一个 inode 不足以记录全部的 block 。会利用 **一层间接** 到 **三层间接** 来记录。

* 目录文件的 **inode** 记录目录的 **权限、属性**、系统分配的 **block 编号**。

* 目录文件的 **block** 记录 目录中的 **文件名** 与该文件名占用的 **inode 编号**。

* EXT 新建文件的过程：

  1. 确定用户对目录有 w x 权限

  2. 用 inode 位图找到可用 inode，写入新文件的权限和属性

  3. 根据 Block 位图找到可用的 block，写入文件数据，更新 inode 的 block 指针

  4. 同步更新 inode Bitmap、Block Bitmap、Superblock


{% include figure image_path="part07/7.1.read.file.png" alt="" %}

`stat example.txt`	查看文件的 inode 内容


### Superblock

`tune2fs -l /dev/sda5`	查看 EXT 的 Superblock 内容

`dumpe2fs -h /dev/sda1`		查看 EXT 的 Superblock 内容

`dumpe2fs /dev/sda1`		查看 EXT 的 Superblock 及 BG 内容

`dumpe2fs -b /dev/sda1`		查看 EXT 的坏道信息

`xfs_info /dev/sda2`	查看 XFS 系统的 Superblock 内容


### 空间占用

* DF

查看 **文件系统** 磁盘空间用量。

` df [OPTION]... [FILE]...`

`-a` 所有的文件系统，包括系统特有的 /proc 等文件系统；

`-k` 以 KBytes 为单位

`-m` 以 MBytes 为单位

`-h` 人性化的单位显示

`-H`	用 M=1000K 替换 M=1024K

`-T`	显示分区文件系统类型

`-i` 不用磁盘容量，而用 inode 的数量

📕 df 命令是通过读取 Superblock 内的信息来完成的。

* DF 范例

`df` 命令是通过读取 Superblock 内的信息来完成的

`df -T /boot`	查看挂载点的 文件系统、可用空间、已用空间

`df -i /dev/sda1`	查看文件系统的 inode 总数、inode 已用量、inode 可用量、已用百分比

`df -aT`	查看包括 `/proc` 在内的当前所有文件系统，类型、空间、已用、可用、百分比、挂载点



* DU

查看 **目录或文件** 所占空间

`du [OPTION]... [FILE]...`

`-a` 不只目录，也包括所有的文件

`-h` 人性化显示

`-s` 只显示总计

`-S` 不显示子目录

由于 du 默认会显示所有文件以及子目录的大小，加上 `-S` 可以 **避免重复计算**。

`-k` 以 KBytes 为单位

`-m` 以 MBytes 为单位

* DU 范例

`du -a /root/test/`	 查看指定目录及其所有子目录、文件所占的空间，长列表

`du -s /etc`	查看指定目录所占的空间

`du /etc`		查看指定目录的所有子目录所占的空间











## 格式化


### MKFS.xfs

`mkfs.xfs [-b bsize] [-d parms] [-i parms] [-l parms] [-L label] [-f] [-r parms] 设备名称`

单位：扇区 `s`，块（默认） `b`，字节 `k`，`m`，`g`，`t`，`p`，`e`

`-b`		块大小，512 ~ 64k，Linux 最大限制 4k

`-f`		忽略设备现有文件系统，强制格式化

`-L`		卷标

`-d`		数据区参数：

.. `agcount`		AG数量，与 CPU 有关

.. `agsize`		AG 大小，agcount/agsize 只选一个设置即可

.. `file`		格式化的设备是文件而不是设备

.. `size`		数据区大小

.. `su`		RAID 中 stripe 值

.. `sw`		RAID 中用于保存数据的磁盘数量（扣除备份盘与备用盘）

.. `sunit`		与 su 相当，单位是扇区

.. `swidth`	su\*sw，单位是扇区

`-i`		inode 设置：

.. `size`		inode 大小，256 Bytes ~ 2k，一般 256

.. `internal`	日志设备是否为内置，1 内置（默认），0 外置

.. `logdev`	指定外置日志设备

.. `size`		日志设备大小，至少 512 blocks，最好大于 2M

`-r`		realtime section 设置：

.. `extsize`	extent 大小，一般不须设置。有 RAID 时，最好设置与 swidth 的数值相同， 4K ~ 1G

* 范例

`mkfs.xfs /dev/sda4`	格式化为 XFS，用默认值（xfs， Linux filesystem）

`mkfs.xfs -f -d agcount=2 /dev/sda4`	格式化为 XFS，指定 AG 数量

`mkfs.xfs -f /srv/loopdev`	格式化大文件

`mkswap /dev/vda6`	格式化 SWAP


### MKFS.ext4

`mkfs.ext4 -b size -L label 设备名称`

`-b`		block 大小，1K, 2K, 4K

`-L`		设备卷标

### MKFS.其他

mkfs.btrfs mkfs.cramfs mkfs.ext2 mkfs.ext3 mkfs.ext4

mkfs.fat mkfs.minix mkfs.msdos mkfs.vfat mkfs.xfs

`mkfs -t vfat /dev/vda5`


### MKE2FS

make EXT2 File System，可以用来格式化 EXT 家族文件系统。

`mke2fs`	格式化为 EXT2，EXT3，EXT4






## 挂载文件系统

挂载时，即使不指定文件系统类型，Linux 也会根据 `/etc/filesystems` 来自动检测。


### FSTAB

`[设备] [挂载点] [文件系统类型] [文件系统参数] [dump] [fsck]`

**设备**：设备文件名、UUID、卷标均可

**文件系统类型**：xfs, ext3, ext4, vfat, nfs, iso9660, cifs, reiserfs, smbfs

**文件系统参数**：包括特定文件系统专有参数 以及 通用的参数

通用参数：

| 参数 | 内容意义 |
| :--- | :--- |
| async/sync | 默认为异步，性能较好 |
| auto/noauto | 是否会被 `mount -a` 自动挂载。默认为 auto。 |
| dev, nodev | 允许此文件系统上创建设备文件 |
| rw/ro | 把分区以读写或只读方式挂载 |
| exec/noexec | 文件系统内是否允许可执行程序运行。 |
| user/nouser | 是否允许用户使用 mount 命令来挂载 |
| suid/nosuid | 是否允许 SUID |
| defaults | async, auto, dev, rw, exec, nouser, suid |

**dump**：备份命令对其是否起作用，设置为 0 表示不用。

**fsck**：是否使用 fsck 在启动时校验该文件系统的完整性（clean），0 为不用。

* 范例

`/srv/loopdev /data/file xfs defaults,loop 0 0`	挂载伪设备

`UUID="6b17e4ab-9bf9-43d6-88a0-73ab47855f9d"  swap swap defaults 0 0` 挂载交换分区

`UUID=84f7aabf-238f-4561-808d-8414f522c62b /boot  xfs  defaults  0 0`	挂载启动分区



### MOUNT

`mount -t 文件系统 UUID='' 挂载点`

`mount -t 文件系统 LABEL='' 挂载点`

`mount -t 文件系统 设备文件名 挂载点`

`-a`		依据 `/etc/fstab` 挂载所有设备

`-l`		显示卷标

`-t`		指定挂载的文件系统类型

`-n`		挂载的信息不会写入 /etc/mtab，常用于只读文件系统

`-o`		额外参数，用逗号分隔：

.. `async`, `sync`		内存机制为同步还是异步，默认为异步

.. `atime`, `noatime`		是否更新文件的访问时间

.. `ro`, `rw`		挂载文件系统成为只读或可写

.. `auto`, `noauto`		允许被 mount -a 自动挂载

.. `dev`, `nodev`		允许此文件系统上创建设备文件

.. `suid`, `nosuid`		是否支持 suid/sgid

.. `exec`, `noexec`		是否允许可执行文件的存在

.. `user`, `nouser`		是否允许普通用户运行 mount

.. `defaults`		使用默认值（rw, suid, dev, exec, auto, nouser, async）

.. `remount`		重新挂载

.. `loop`			Loop 设备，一种伪设备，使文件可以作为块设备被访问

* 范例

`mount -a`	挂载 `/etc/fstab` 中尚未挂载的文件系统

`mount UUID="e0a6af55-26e7-4cb7-a515-826a8bd29e90" /data/xfs`	以 UUDI 挂载

`mount /dev/sr0 /data/cdrom`	挂载光驱

`mount -o codepage=950,iocharset=utf8 UUID=""35BC-6D6B"" /data/usb`	挂载 VFAT 格式的 U 盘

`mount -o remount,rw,auto /`	重新挂载根目录，常用于单人维护模式

`mount --bind /where /data/elsewhere`	挂载目录

`mount LABEL=matrix_xfs /data/xfs/`　按卷标加载设备

`mount -o loop /tmp/CentOS-DVD.iso /data/dvd`	挂载光盘镜像

`mount -o loop UUID="7dd97bd2-4446-48fd-9d23-a8b03ffdd5ee" /mnt`	挂载大文件



### UMOUNT

`umount -fn 设备文件名或挂载点`

`-f`		强制卸载，可用于NFS无法读取的情况

`-l`		立刻卸载文件系统，比 -f 还强

`-n`		卸载后不更新 `/etc/mtab`

* 范例

`umount -f /dev/sda`	Force Unmount，强制卸载，用于 NFS 无法读取的情况

`umount -l /dev/sda1`	Lazy Unmount，从文件系统架构中立即卸载，一旦空闲，立即清除所有对该文件系统的引用

`umount -n /dev/sda`	卸载后不更新 `/etc/mtab` 文件



### SWAPON

挂载交换分区或交换文件

`swapon [-d] [-f] [-p priority] [-v] specialfile... `

`swapon /dev/vda6`　挂载交换分区

`swapon -s`	查看当前所有交换设备











## 检验文件系统



### XFS_REPAIR

`xfs_repair` 用于修复损坏的 xfs 文件系统。修复前必须卸载文件系统，否则可能导致数据不一致或损坏。

`xfs_repair [options] 设备名称`

设备名称可以为分区或磁盘。

`-f`		修复普通文件，而非设备

`-n`		仅检查

`-d`		单人维护模式，针对根目录进行检查与修复，很危险！

根目录无法被卸载，出问题要进入 **单人维护或修复模式**，然后通过 `-d` 选项来处理。加入 `-d`，系统会 **强制校验** 该设备，校验完毕后会 **自动重启**。

* 范例

`xfs_repair -f /root/somefile`	修复保存于普通文件中的文件系统镜像

`xfs_repair -n`		只检查，不修复

`xfs_repair -d`		以危险方式进行修复，修复以只读方式挂载的 XFS，通常进入单用户维护模式，针对根目录进行检查与修复，随后会重启

`xfs_repair -L /dev/sda1`	清除文件系统中所有日志，分区对拷之后会用到




### FSCK

fsck 实际上是一套前端软件，后端为各类文件系统的修复程序。包括：

`fsck.ext2`，`fsck.ext3`，`fsck.ext4`，`fsck.msdos`，`fsck.nfs`，`fsck.vfat`，`fsck.xfs` 等。

* `fsck.ext4` 专门检验 EXT4

`fsck.ext4 -pf -b superblock 设备名称`

设备名称可以是设备文件、挂载点、UUDI、卷标。

`-p`		修复时，对提问自动回复 y

`-f`		强制检查

`-D`		对文件系统的目录进行最优配置。

`-b`		指定 superblock 的位置

通过 -b 这个参数即可在主 superblock 损坏时，尝试用备份的 superblock 修复。1K block 其 superblock 备份在 **8193**，2K block 在 **16384**，4K block 在 **32768**。可以先用 `mke2fs -n /dev/sda5` 命令来**检查备份 superblcok** 的位置。
{: .notice--info}

* 范例

`fsck.ext4` 实际程序为 `e2fsck`，用于修复 EXT 家族文件系统，需先卸载挂载点。

`fsck.ext4 -y /dev/sda`		修复时，对提问自动回复 y

`fsck.ext4 -p /dev/sda`		用 `e2fsck` 自动修复。一般用于系统启动脚本中，不能与 `-n`、`-y` 同时使用。

`fsck.ext4 -f /dev/sda`		强制检查，无论系统是否 clean

`fsck.ext4 -D /dev/sda4`	用 `e2fsck`	来优化所有目录，重新索引，整理压缩。

`fsck.ext4 -b 163840 /dev/sda4`	使用指定的 superblock 来修复系统








## 设备文件


### 创建特殊设备文件

mknod 命令用于创建特殊设备文件。

* 语法

`mknod 设备文件名 [bcp] [Major] [Minor]`

`设备种类`

.. `b`		块设备文件

.. `c`		字符设备文件

.. `p`		FIFO 文件

`Major`		主要设备代码；

`Minor`		次要设备代码；

* 常见的磁盘文件对应的设备代码：

| 磁盘文件名 | Major | Minor |
| :--- | :--- | :--- |
| /dev/sda | 8 | 0-15 |
| /dev/sdb | 8 | 16-31 |
| /dev/loop0 | 7 | 0 |
| /dev/loop1 | 7 | 1 |


* 范例

`mknod /dev/vda10 b 252 10`	创建块设备

`mknod /tmp/testpipe p`	创建 FIFO 设备



### 设备文件名

```
`/dev/sd[a-p]`	 SCSI/SATA/USB 硬盘，U 盘

`/dev/hd[a-d]`	IDE 硬盘

`/dev/sda[1-128]`	分区

`/dev/vd[a-p]`	虚拟机

`/dev/md[0-128]`	软 RAID

`/dev/VGNAME/LVNAME`	LVM

`/dev/fd[0-1]`	软驱

`/dev/usb/lp[0-15]`	USB 打印机

`/dev/lp[0-2]`	针式打印机

`/dev/psaux`	PS2 鼠标

`/dev/usb/mouse[0-15]`	USB 鼠标

`/dev/mouse`	当前鼠标

`/dev/cdrom`	CD、DVD 光驱

`/dev/ht0`	IDE 磁带机

`/dev/st0` SCSI 磁带机
```

### 设备文件代码

| 磁盘 | Major | Minor |
| :--- | :--- | :--- |
| /dev/sda | 8 | 0-15 |
| /dev/sdb | 8 | 16-31 |
| /dev/loop0 | 7 | 0 |
| /dev/loop1 | 7 | 1 |
















## EXT 文件系统


* EXT2 的头 1024 Bytes 称为 **Boot Block**，预留给 VBR，即分区的引导扇区，不受 EXT2 文件系统的管理。

* 每个 BG 包含：**Superblock、Group Descriptor Table**、Block Bitmap、inode Bitmap、inode Table、Data Blocks

* EXT2 文件系统支持的 block 大小： **1K，2K，4K**

* EXT2 文件系统限制

| Block 大小 | 1 KB | 2 KB | 4 KB |
| :--- | :--- | :--- | :--- |
| 最大单一文件限制 | 16 GB | 256 GB | 2 TB |
| 最大文件系统总容量 | 2 TB | 8 TB | 16 TB |






## XFS 文件系统

* 数据区、日志区、实时运行区

* XFS 是一个高性能的 **64 位** 日志式文件系统，擅长 **并行的 I/O 操作**，归功于其设计优秀的 **AG 机制**，因此特别 **擅长处理大文件**。

* 同一文件系统 **跨越不同存储设备** 时，在 I/O 线程、文件系统带宽、文件大小、文件系统大小方面具有 **极强的伸缩性**。

* XFS 通过 **元数据日志** 及 **Write Barrie** 来保证 **数据一致性**。

* 通过保存在 B+ 树中的变长 **Extent** 来分配存储空间。

* 延迟分配能帮助文件系统防止碎片化，支持 **在线整理碎片**，`xfs_fsr` 命令来实现。

* 文件系统被分成多个 **AG**，它们是文件系统中的等长线性存储区。

* 一个 AG 好比一个 **子文件系统**，每个 AG 各自管理自己的 inode 和可用空间，目的是为了 **提升并行性能**。

### 修改文件系统大小

XFS 只支持扩展空间。

`xfs_growfs /mnt`	扩展文件系统














## 其它文件系统


* `/proc` 挂载点大小为 0 ，它是挂载在 “内存中” 的，不占磁盘空间

* `/dev/shm/` 内存虚拟出来的磁盘空间，通常是总实体内存的一半，存取速度非常快
















## 文件系统的备份


### XFSDUMP

`xfsdump [-L S_label] [-M M_label] [-l #] [-f 目标文件] 原文件`

`-L`  本次备份会话标签（dump Session Label）

`-M`  储存介质标签（Media Label）

`-l`  备份等级，0~9，默认为 0，即完整备份

`-f`  目标文件

`-I`  查看当前备份状态

xfsdump 默认仅支持 **文件系统** 的备份，并不支持指定目录的备份。
{: .notice--warning}


#### 范例

* 先确认备份对象是独立的文件系统

`df -h /boot`

* 完整备份 `/boot` 分区

`xfsdump -l 0 -L boot_all -M boot_all -f /srv/boot.dump /boot`

* 查看当前 xfsdump 备份信息

`xfsdump -I`

* 进行 level 1 累积备份

`xfsdump -l 1 -L boot_2 -M boot_2 -f /srv/boot.dump1 /boot`

* 查看 xfsdump 记录是否更新

`xfsdump -I`







### XFSRESTORE


#### 语法

xfsrestore [-f 备份文件] -i 目标目录

`-I`  查看备份数据

`-f`  备份文件

`-L`  进程标签

`-s`  恢复部分文件或目录

`-r`  磁带内有多个文件时，实现累积恢复

`-i`  进入互动模式


#### 范例


* 查看备份数据

`xfsrestore -I`

返回的信息与 `xfsdump -I` 相同，都来自 `/var/lib/xfsdump/inventory/`。

* 恢复完整备份，直接覆盖

`xfsrestore -f /srv/boot.dump -L boot_all /boot`

* 恢复到指定目录

`xfsrestore -f /srv/boot.dump -L boot_all /tmp/boot`

* 恢复部分文件

`xfsrestore -f /srv/boot.dump -L boot_all -s grub2 /tmp/boot2`

* 恢复累积备份

恢复备份时，应按照备份的顺序逐级进行。

* 互动模式

通过互动模式，允许先查看备份文件，再有选择地恢复。

`xfsrestore -f /srv/boot.dump -i /tmp/boot3`








### DD

`dd if="input_file" of="output_file" bs="block_size" count="number"`

`if`  输入文件

`of`  输出文件

`bs`  块大小，默认 512 Bytes

`count` 块数量

#### 范例

* 备份文件

`dd if=/etc/passwd of=/tmp/passwd.back`

* 抓取光盘镜像

`dd if=/dev/sr0 of=/tmp/system.iso`

* 镜像刻录到U盘

把可引导镜像刻录到U盘，实现 **U盘引导**。

`dd if=/tmp/system.iso of=/dev/sda`

* 备份整个文件系统

dd 是 **逐个扇区** 读/写的，即使没用到的扇区也会被写入备份文件中，因此备份文件会 **和分区一样大**。

`dd if=/dev/vda2 of=/tmp/vda2.img`

* 对拷整个分区

把一个分区完整地复制到另一个分区。目标分区必须大于源分区。

目标分区无需格式化，因为 dd 可以把扇区的数据逐个复制过来，连同 superblock, boot sector, meta data 等。

`dd if=/dev/vda2 of=/dev/sda1`

因为 dd 会把 UUID 也完全复制，必须先清除新分区 XFS 文件系统内的日志，为其重新分配 UUID，才能顺利挂载：
{: .notice--danger}

```bash
~]# xfs_repair -L /dev/sda1　　# 清除所有 log
~]# uuidgen　　				# 生成新的 UUID
896c38d1-bcb5-475f-83f1-172ab38c9a0c
~]# xfs_admin -U 896c38d1-bcb5-475f-83f1-172ab38c9a0c /dev/sda1 　# 分配新 UUID
```





### CPIO

#### 语法

* 备份

`cpio -ovcB > /path/archive.cpio`

`-o ` 备份到文件或设备

`-B`  将块大小设置为 5120 Bytes

* 还原

`cpio -ivcdu < [file|device]`

`-i`  从文件或设备还原

`-d`  还原时自动创建目录

`-u`  覆盖旧文件

* 查看

`cpio -ivct < [file|device]`

`-t`  查看备份文件内容

* 通用参数

`-v`  显示操作过程

`-c`  以 ASCII 字符格式读写头文件信息。


#### 范例

* 备份目录

`find boot | cpio -ocvB > /tmp/boot.cpio`

* 备份到磁带机

`find / | cpio -ocvB > /dev/st0`

* 从磁带机还原

`cpio -idvc < /dev/st0`






### WODIM

`wodim` 我地妈，没啊，为光盘刻录工具。

#### 语法

`wodim [options] track1...trackn`  

`--devices`  扫瞄磁盘总线，找出可用的刻录机

`-v ` 显示过程

`dev=`	设定刻录机的 SCSI 目标，通常用 Major/Minor 的数字方式来描述，也可以用文件名 `/dev/sr0`  。

`blank=[fast&|all]`  擦除可重复写入的 CD/DVD-RW，fast较快，all较完整

`-format ` 对光盘进行格式化，仅针对 DVD+RW

[ 可选参数 ]

`-data`  以数据格式写入，而非 CD 音轨

`speed=X`  指定刻录速度

`-eject`  刻录完毕自动退出光盘

`fs=Ym`  指定缓冲内存大小，镜像文件先暂存至缓冲内存。默认为 4m，一般建议可增加到 8m，视刻录机而定。

`driveropts=burnfree`  针对 DVD 打开 Buffer Underrun Free 模式的写入功能

`-sa`  支持 DVD-RW 的格式


#### 范例

* 查询刻录机的总线地址

`wodim --devices dev=/dev/sr0`

* 擦除可重复写入的 DVD-RW

`wodim -v dev=/dev/sr0 blank=fast`

* 格式化 DVD+RW

`wodim -v dev=/dev/sr0 -format`

* 刻录

`wodim -v dev=/dev/sr0 [可用选项功能] file.iso`


































## 实例











### 创建并挂载分区

创建一个 512M 的分区，用于放置与windows共享的数据，文件系统用 vfat。

* 确定新分区的起始点

如果要从现有剩余空间划分新的分区，则起始点即当前最后分区的结束点。

`parted /dev/vda print`

找到最后一个分区的结束点，36.0G

* 创建分区

`parted /dev/vda mkpart primary fat32 36.0GB 36.5GB`

* 查看新建的分区

`parted /dev/vda print`

* 更新分区表并查看

`partprobe`

`lsblk /dev/vda7`

* 格式化

`mkfs -t vfat /dev/vda7`

`blkid /dev/vda7`

* 加入自启动

`vi /etc/fstab`

`UUID="6032-BF38" /data/win vfat defaults 0 0`

* 加载

`mkdir /data/win`

`mount -a`

`df /data/win`
























### 软件 RAID

用 `mdadm` 创建 RAID。

#### 需求

* 用 4 个分区组建 RAID 5

* 每分区 1GB

* 把 1 个分区设置为备用盘

* chunk 设置为 256K

* 备用盘 1GB

* 将此 RAID 5 设备挂载到 `/srv/raid` 目录

#### 创建分区

创建5 个 1GB 的分区。


#### 创建 RAID

```
~]# mdadm --create /dev/md0 --auto=yes --level=5 --chunk=256K \
>  --raid-devices=4 --spare-devices=1 /dev/vda{5,6,7,8,9}
mdadm: Defaulting to version 1.2 metadata
mdadm: array /dev/md0 started.
```

用 `{ }` 简化重复项目


#### 查看 RAID

查看是否创建成功

##### 用 mdadm 查看

```
~]# mdadm --detail /dev/md0
/dev/md0:                                           # RAID 设备文件名
        Version : 1.2
  Creation Time : Mon Jul 27 15:17:20 2015          # 创建时间
     Raid Level : raid5                             # RAID5
     Array Size : 3142656 （3.00 GiB 3.22 GB）        # 整组 RAID 可用容量
  Used Dev Size : 1047552 （1023.17 MiB 1072.69 MB）  # 每块磁盘容量
   Raid Devices : 4                                 # 组成 RAID 的磁盘数量
  Total Devices : 5                                 # 含备用盘的总磁盘数
    Persistence : Superblock is persistent
    Update Time : Mon Jul 27 15:17:31 2015
          State : clean                             # 磁盘阵列的使用状态
 Active Devices : 4                                 # 启动的设备数量
Working Devices : 5                                 # 目前用于此阵列的设备数
 Failed Devices : 0                                 # 损坏的设备数
  Spare Devices : 1                                 # 预备磁盘的数量
         Layout : left-symmetric
     Chunk Size : 256K                              # chunk 容量
           Name : study.centos.matrix:0  （local to host study.centos.matrix）
           UUID : 2256da5f:4870775e:cf2fe320:4dfabbc6
         Events : 18
    Number   Major   Minor   RaidDevice State
       0     252        5        0      active sync   /dev/vda5
       1     252        6        1      active sync   /dev/vda6
       2     252        7        2      active sync   /dev/vda7
       5     252        8        3      active sync   /dev/vda8
       4     252        9        -      spare   /dev/vda9
```

最后五行就是这五个设备目前的情况，四个 active sync 一个 spare


##### 用 `/proc/mdstat` 查看

```
~]# cat /proc/mdstat
Personalities : [raid6] [raid5] [raid4]
md0 : active raid5 vda8[5] vda9[4](S) vda7[2] vda6[1] vda5[0]                 <==第一行
      3142656 blocks super 1.2 level 5, 256k chunk, algorithm 2 [4/4] [UUUU] <==第二行

unused devices: <none>
```

* 第一行：md0 为 Raid 5 ，使用了 vda8, vda7, vda6, vda5 这四个磁盘。每个设备后面的中括号 `[ ]` 内的数字为此磁盘在 RAID 中的顺序。vda9 后面的 `[S]` 表示 vda9 是热备盘。

* 第二行：Raid 共有 3142656 个块（块大小 1K），所以总容量约为3GB，RAID 5，写入磁盘的 chunk 大小为 256K，使用 algorithm 2 磁盘阵列算法。`[m/n]` 表示组成 RAID 共 m 个设备，其中 n 个设备正常运行。`[UUUU]` 表示所有设备的启动情况，`U` 表示正常运行，`_` 表示异常。

#### 挂载 RAID

* stripe （chunk） 容量为 256K，所以 su=256k （stripe unit）

* 由 4 块磁盘组成的 RAID 5，因此容量少一块，所以 sw=3 （stripe width）

* 由上面两项计算出数据宽度为： 256K \* 3 = 768k



```
~]# mkfs.xfs -f -d su=256k,sw=3 -r extsize=768k /dev/md0
~]# mkdir /srv/raid
~]# mount /dev/md0 /srv/raid
~]# df -Th /srv/raid
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/md0       xfs   3.0G   33M  3.0G   2% /srv/raid
```

#### 模拟磁盘出错


先复制一些数据到 `/srv/raid`，假设该 RAID 已经在用。

```
~]# cp -a /etc /var/log /srv/raid
~]# df -Th /srv/raid ; du -sm /srv/raid/*
Filesystem     Type  Size  Used Avail Use% Mounted on
/dev/md0       xfs   3.0G  144M  2.9G   5% /srv/raid
28      /srv/raid/etc  
51      /srv/raid/log
```

假设设备 `/dev/vda7` 出错，模拟方法：

```
~]# mdadm --manage /dev/md0 --fail /dev/vda7
mdadm: set /dev/vda7 faulty in /dev/md0
/dev/md0:
.....
    Update Time : Mon Jul 27 15:32:50 2015
          State : clean, degraded, recovering
 Active Devices : 3
Working Devices : 4
 Failed Devices : 1      # 出错磁盘
  Spare Devices : 1
.....
    Number   Major   Minor   RaidDevice State
       0     252        5        0      active sync   /dev/vda5
       1     252        6        1      active sync   /dev/vda6
       4     252        9        2      spare rebuilding   /dev/vda9
       5     252        8        3      active sync   /dev/vda8
       2     252        7        -      faulty   /dev/vda7
```

动作要快才能看到，`/dev/vda9` 启动了，而 `/dev/vda7` 挂掉了。

如果运作太慢，会发现系统已经重建好 RAID：

```
~]# mdadm --detail /dev/md0
....
    Number   Major   Minor   RaidDevice State
       0     252        5        0      active sync   /dev/vda5
       1     252        6        1      active sync   /dev/vda6
       4     252        9        2      active sync   /dev/vda9
       5     252        8        3      active sync   /dev/vda8
       2     252        7        -      faulty   /dev/vda7
```

#### 替换磁盘

拔掉坏盘

`mdadm --manage /dev/md0 --remove /dev/vda7`

安装新盘

`mdadm --manage /dev/md0 --add /dev/vda7`




#### 关闭软 RAID

```
~]# umount /srv/raid  # 卸载挂载点
~]# vim /etc/fstab
UUID=494cb3e1-5659-4efc-873d-d0758baec523  /srv/raid xfs defaults 0 0
# 用 dd 彻底清除 RAID 原分区表，防止重启时系统复用
~]# dd if=/dev/zero of=/dev/md0 bs=1M count=50
~]# mdadm --stop /dev/md0  # 关闭 RAID
mdadm: stopped /dev/md0  
# 用 dd 彻底清除各磁盘的 superblock，防止重启时系统复用
~]# dd if=/dev/zero of=/dev/vda5 bs=1M count=10
~]# dd if=/dev/zero of=/dev/vda6 bs=1M count=10
~]# dd if=/dev/zero of=/dev/vda7 bs=1M count=10
~]# dd if=/dev/zero of=/dev/vda8 bs=1M count=10
~]# dd if=/dev/zero of=/dev/vda9 bs=1M count=10
~]# cat /proc/mdstat
Personalities : [raid6] [raid5] [raid4]
unused devices:
<none>  # 确认没有 RAID 了

~]# vim /etc/mdadm.conf
#ARRAY /dev/md0 UUID=2256da5f:4870775e:cf2fe320:4dfabbc6
# 删除 RAID 参数
```














### LVM


#### 需求

* 使用 4 个分区 ，每分区容量为 1GB，分区 hex code 为 8e00；

* VG 名称为 matrixvg；PE 大小为 16MB；

* 创建一个名为 matrixlv 的 LV，容量 2G

* LV 格式化为 xfs，挂载 /srv/lvm

#### 准备分区

```
~]# gdisk -l /dev/vda
Number  Start （sector）    End （sector）  Size       Code  Name
   1            2048            6143   2.0 MiB     EF02
   2            6144         2103295   1024.0 MiB  0700
   3         2103296        65026047   30.0 GiB    8E00
   4        65026048        67123199   1024.0 MiB  8300  Linux filesystem
   5        67123200        69220351   1024.0 MiB  8E00  Linux LVM
   6        69220352        71317503   1024.0 MiB  8E00  Linux LVM
   7        71317504        73414655   1024.0 MiB  8E00  Linux LVM
   8        73414656        75511807   1024.0 MiB  8E00  Linux LVM
   9        75511808        77608959   1024.0 MiB  8E00  Linux LVM
```

#### 创建 PV

* `pvcreate`  把实体分区创建为 PV
* `pvscan`  扫描系统现有 PV
* `pvdisplay`  单独查看特定 PV 详细信息
* `pvremove`  清除 PV 属性，使该分区不再有 PV 属性。

PV 的名称就是分区的设备文件名


查看当前系统是否存在 PV，将 `/dev/vda{5-8}` 创建成 PV

```
~]# pvscan
  PV /dev/vda3   VG centos   lvm2 [30.00 GiB / 14.00 GiB free]
  Total: 1 [30.00 GiB] / in use: 1 [30.00 GiB] / in no VG: 0 [0   ]
# 当前只有一个 PV

~]# pvcreate /dev/vda{5,6,7,8}
  Physical volume "/dev/vda5" successfully created
  Physical volume "/dev/vda6" successfully created
  Physical volume "/dev/vda7" successfully created
  Physical volume "/dev/vda8" successfully created
# PV 创建完毕

~]# pvscan
  PV /dev/vda3   VG centos   lvm2 [30.00 GiB / 14.00 GiB free]
 PV /dev/vda8               lvm2 [1.00 GiB]
  PV /dev/vda5               lvm2 [1.00 GiB]
  PV /dev/vda7               lvm2 [1.00 GiB]
  PV /dev/vda6               lvm2 [1.00 GiB]
  Total: 5 [34.00 GiB] / in use: 1 [30.00 GiB] / in no VG: 4 [4.00 GiB]

# 查看每个 PV 的详细信息：

~]# pvdisplay /dev/vda5
  "/dev/vda5" is a new physical volume of "1.00 GiB"
  --- NEW Physical volume ---
  PV Name               /dev/vda5  
  VG Name                          
  PV Size               1.00 GiB   
  Allocatable           NO         
  PE Size               0          
  Total PE              0          
  Free PE               0          
  Allocated PE          0          
  PV UUID               Cb717z-lShq-6WXf-ewEj-qg0W-MieW-oAZTR6
```

#### 创建 VG


```
# 将 /dev/vda5-7 组建成一个 VG，PE 为 16MB

~]# vgcreate -s 16M matrixvg /dev/vda{5,6,7}
  Volume group "matrixvg" successfully created
~]# vgscan
  Reading all physical volumes.  This may take a while...
  Found volume group "matrixvg" using metadata type lvm2  # 新 VG
  Found volume group "centos" using metadata type lvm2   # 系统

~]# pvscan
 PV /dev/vda5   VG matrixvg   lvm2 [1008.00 MiB / 1008.00 MiB free]
  PV /dev/vda6   VG matrixvg   lvm2 [1008.00 MiB / 1008.00 MiB free]
  PV /dev/vda7   VG matrixvg   lvm2 [1008.00 MiB / 1008.00 MiB free]
  PV /dev/vda3   VG centos    lvm2 [30.00 GiB / 14.00 GiB free]
  PV /dev/vda8                lvm2 [1.00 GiB]
  Total: 5 [33.95 GiB] / in use: 4 [32.95 GiB] / in no VG: 1 [1.00 GiB]

~]# vgdisplay matrixvg
  --- Volume group ---
  VG Name               matrixvg
  System ID
  Format                lvm2
  Metadata Areas        3
  Metadata Sequence No  1
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                0
  Open LV               0
  Max PV                0
  Cur PV                3
  Act PV                3
  VG Size               2.95 GiB        
  PE Size               16.00 MiB       
  Total PE              189             
  Alloc PE / Size       0 / 0
  Free  PE / Size       189 / 2.95 GiB
  VG UUID               Rx7zdR-y2cY-HuIZ-Yd2s-odU8-AkTW-okk4Ea
```

#### 扩容 VG

```
# 将剩下的 PV （/dev/vda8） 给 matrixvg

~]# vgextend matrixvg /dev/vda8
  Volume group "matrixvg" successfully extended
~]# vgdisplay matrixvg
....（前面省略）....
  VG Size               3.94 GiB
  PE Size               16.00 MiB
 Total PE              252
  Alloc PE / Size       0 / 0
  Free  PE / Size       252 / 3.94 GiB
```

#### 创建 LV


```
# 将 matrixvg 分 2GB 给 matrixlv

~]# lvcreate -L 2G -n matrixlv matrixvg
  Logical volume "matrixlv" created

# lvcreate -l 128 -n matrixlv matrixvg   也可以指定 PE 的数量来分区

~]# lvscan
  ACTIVE            '/dev/matrixvg/matrixlv' [2.00 GiB] inherit  
  ACTIVE            '/dev/centos/root' [10.00 GiB] inherit
  ACTIVE            '/dev/centos/home' [5.00 GiB] inherit
  ACTIVE            '/dev/centos/swap' [1.00 GiB] inherit

~]# lvdisplay /dev/matrixvg/matrixlv
  --- Logical volume ---
  LV Path                /dev/matrixvg/matrixlv   # 这个是 LV 的全名喔！
  LV Name                matrixlv
  VG Name                matrixvg
  LV UUID                QJJrTC-66sm-878Y-o2DC-nN37-2nFR-0BwMmn
  LV Write Access        read/write
  LV Creation host, time study.centos.matrix, 2015-07-28 02:22:49 +0800
  LV Status              available
  # open                 0
  LV Size                2.00 GiB
  Current LE             128
  Segments               3
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     8192
  Block device           253:3
```

#### 创建文件系统

```
# 格式化、挂载

~]# mkfs.xfs /dev/matrixvg/matrixlv  # LV 要用全名
~]# mkdir /srv/lvm
~]# mount /dev/matrixvg/matrixlv /srv/lvm
~]# df -Th /srv/lvm
Filesystem                  Type  Size  Used Avail Use% Mounted on
/dev/mapper/matrixvg-matrixlv xfs   2.0G   33M  2.0G   2% /srv/lvm
~]# cp -a /etc /var/log /srv/lvm
~]# df -Th /srv/lvm
Filesystem                  Type  Size  Used Avail Use% Mounted on
/dev/mapper/matrixvg-matrixlv xfs   2.0G  152M  1.9G   8% /srv/lvm  
```






### 扩容 LV

1. 需要有可用的 VG 容量，如果 VG 容量不足，可以添加硬盘，创建 PV，然后将其加入 VG。
2. 用 lvresize 扩容 LV
3. 更新文件系统。XFS 和 EXT 都支持扩容，而只有 EXT 支持缩小。

通过 `xfs_growfs` 调整文件系统的 block group 来调整文件系统的容量。

**需求**： /srv/lvm 再增加 500M 的容量

先查看 VG 详细信息，可用空间是否够用

```
~]# vgdisplay matrixvg
  --- Volume group ---
  VG Name               matrixvg
  System ID
  Format                lvm2
  Metadata Areas        4
  Metadata Sequence No  3
  VG Access             read/write
  VG Status             resizable
  MAX LV                0
  Cur LV                1
  Open LV               1
  Max PV                0
  Cur PV                4
  Act PV                4
  VG Size               3.94 GiB
  PE Size               16.00 MiB
  Total PE              252
  Alloc PE / Size       128 / 2.00 GiB
 Free  PE / Size       124 / 1.94 GiB    # 剩余容量超过 500M
  VG UUID               Rx7zdR-y2cY-HuIZ-Yd2s-odU8-AkTW-okk4Ea
```

用 lvresize 扩容 LV

```
~]# lvresize -L +500M /dev/matrixvg/matrixlv
  Rounding size to boundary between physical extents: 512.00 MiB
  Size of logical volume matrixvg/matrixlv changed from 2.00 GiB （128 extents） to 2.50 GiB（160 extents）.
  Logical volume matrixlv successfully resized

~]# lvscan
 ACTIVE            '/dev/matrixvg/matrixlv' [2.50 GiB] inherit
  ACTIVE            '/dev/centos/root' [10.00 GiB] inherit
  ACTIVE            '/dev/centos/home' [5.00 GiB] inherit
  ACTIVE            '/dev/centos/swap' [1.00 GiB] inherit
# 发现 /dev/matrixvg/matrixlv 容量由 2G 增加到 2.5G

~]# df -Th /srv/lvm
Filesystem                  Type  Size  Used Avail Use% Mounted on
/dev/mapper/matrixvg-matrixlv xfs   2.0G  111M  1.9G   6% /srv/lvm
# 文件系统的容量没有更新，仍是 2.0G
```

LVM 可以在线直接处理，不需要卸载

更新文件系统

先看一下原文件系统内的 superblock

```
~]# xfs_info /srv/lvm
meta-data=/dev/mapper/matrixvg-matrixlv isize=256    agcount=4, agsize=131072 blks
#                                                          ^
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=0        finobt=0
data     =                       bsize=4096   blocks=524288, imaxpct=25
#                                                     ^^^^
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0 ftype=0
log      =internal               bsize=4096   blocks=2560, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0

~]# xfs_growfs /srv/lvm  # 更新文件系统

~]# xfs_info /srv/lvm
meta-data=/dev/mapper/matrixvg-matrixlv isize=256    agcount=5, agsize=131072 blks
#                                                          ^
         =                       sectsz=512   attr=2, projid32bit=1
         =                       crc=0        finobt=0
data     =                       bsize=4096   blocks=655360, imaxpct=25
#                                                     ^^^^
         =                       sunit=0      swidth=0 blks
naming   =version 2              bsize=4096   ascii-ci=0 ftype=0
log      =internal               bsize=4096   blocks=2560, version=2
         =                       sectsz=512   sunit=0 blks, lazy-count=1
realtime =none                   extsz=4096   blocks=0, rtextents=0

~]# df -Th /srv/lvm
Filesystem                  Type  Size  Used Avail Use% Mounted on
/dev/mapper/matrixvg-matrixlv xfs   2.5G  111M  2.4G   5% /srv/lvm
~]# ls -l /srv/lvm
drwxr-xr-x. 131 root root 8192 Jul 28 00:12 etc
drwxr-xr-x.  16 root root 4096 Jul 28 00:01 log
```



### LVM 快照


#### 创建传统快照区

`lvcreate -s`


先查看卷组剩余容量

```
~]# vgdisplay matrixvg
....
  Total PE              252
  Alloc PE / Size       226 / 3.53 GiB
  Free  PE / Size       26 / 416.00 MiB
# 剩下 26 个 PE，全部分配给 matrixsnap1

# 创建快照区，快照被取名为 matrixsnap1，给 26 个 PE

~]# lvcreate -s -l 26 -n matrixsnap1 /dev/matrixvg/matrixlv
  Logical volume "matrixsnap1" created
~]# lvdisplay /dev/matrixvg/matrixsnap1
  --- Logical volume ---
  LV Path                /dev/matrixvg/matrixsnap1
  LV Name                matrixsnap1
  VG Name                matrixvg
  LV UUID                I3m3Oc-RIvC-unag-DiiA-iQgI-I3z9-0OaOzR
  LV Write Access        read/write
  LV Creation host, time study.centos.matrix, 2015-07-28 19:21:44 +0800
  LV snapshot status     active destination for matrixlv
  LV Status              available
  # open                 0
  LV Size                2.50 GiB    # 原始碟，就是 matrixlv 的原始容量
  Current LE             160
  COW-table size         416.00 MiB  # 这个快照能够纪录的最大容量！
  COW-table LE           26
  Allocated to snapshot  0.00%       # 目前已经被用掉的容量！
  Snapshot chunk size    4.00 KiB
  Segments               1
  Allocation             inherit
  Read ahead sectors     auto
  - currently set to     8192
  Block device           253:11
```

挂载快照区

```
~]# mkdir /srv/snapshot1
~]# mount -o nouuid /dev/matrixvg/matrixsnap1 /srv/snapshot1
#             ^^^ 让文件系统忽略相同 UUID 所造成的问题
~]# df -Th /srv/lvm /srv/snapshot1
Filesystem                     Type  Size  Used Avail Use% Mounted on
/dev/mapper/matrixvg-matrixlv    xfs   2.5G  111M  2.4G   5% /srv/lvm
/dev/mapper/matrixvg-matrixsnap1 xfs   2.5G  111M  2.4G   5% /srv/snapshot1
# 一模一样
```



### 恢复 LVM 快照


先将原逻辑卷内容作些变化

```
~]# df -Th /srv/lvm /srv/snapshot1
Filesystem                     Type  Size  Used Avail Use% Mounted on
/dev/mapper/matrixvg-matrixlv    xfs   2.5G  111M  2.4G   5% /srv/lvm
/dev/mapper/matrixvg-matrixsnap1 xfs   2.5G  111M  2.4G   5% /srv/snapshot1

~]# cp -a /usr/share/doc /srv/lvm
~]# rm -rf /srv/lvm/log
~]# rm -rf /srv/lvm/etc/sysconfig
~]# df -Th /srv/lvm /srv/snapshot1
Filesystem                     Type  Size  Used Avail Use% Mounted on
/dev/mapper/matrixvg-matrixlv    xfs   2.5G  146M  2.4G   6% /srv/lvm
/dev/mapper/matrixvg-matrixsnap1 xfs   2.5G  111M  2.4G   5% /srv/snapshot1

~]# ll /srv/lvm /srv/snapshot1
/srv/lvm:
total 60
drwxr-xr-x. 887 root root 28672 Jul 20 23:03 doc
drwxr-xr-x. 131 root root  8192 Jul 28 00:12 etc
/srv/snapshot1:
total 16
drwxr-xr-x. 131 root root 8192 Jul 28 00:12 etc
drwxr-xr-x.  16 root root 4096 Jul 28 00:01 log
# 两个目录的内容看起来已经不太一样了，查看一下快照逻辑卷

~]# lvdisplay /dev/matrixvg/matrixsnap1
  --- Logical volume ---
  LV Path                /dev/matrixvg/matrixsnap1
....（中间省略）....
 Allocated to snapshot  21.47%
# 全部的容量已经被用掉了 21.4%

# 利用快照区将原文件系统做个备份，用 xfsdump

~]# xfsdump -l 0 -L lvm1 -M lvm1 -f /home/lvm.dump /srv/snapshot1
# 此时就有一个备份数据了
```

还可以通过对比快照与原数据来查看最近修改的内容。

```
# 卸载并移除快照区

~]# umount /srv/snapshot1
~]# lvremove /dev/matrixvg/matrixsnap1
~]# umount /srv/lvm
~]# mkfs.xfs -f /dev/matrixvg/matrixlv
~]# mount /dev/matrixvg/matrixlv /srv/lvm
~]# xfsrestore -f /home/lvm.dump -L lvm1 /srv/lvm
~]# ll /srv/lvm
drwxr-xr-x. 131 root root 8192 Jul 28 00:12 etc
drwxr-xr-x.  16 root root 4096 Jul 28 00:01 log
# 最初的内容还原成功
```
