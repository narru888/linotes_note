---
toc: true
toc_label: "8. Linux 启动流程"
toc_icon: "code-branch"
title: "Linux 基础 - 8. Linux 启动流程"
tags: linux 启动
categories: "linux"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/linux.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---



## 8.1 基础概念







### 8.1.1 BIOS

Basic Input/Output System。

BIOS 是一种固件接口，它在控制系统启动的第一步的同时，还对各种外设提供最低层的接口。 在装有 BIOS 的 x86 系统上，BIOS 程序代码是刷写在只读存储器 ROM 中的，因此始终可用。系统启动时，CPU 会从系统内存最末端查找 BIOS 程序代码，并执行。











### 8.1.2 UEFI

UEFI，Unified Extensible Firmware Interface

对于基于 UEFI 的 x86 系统，和 BIOS 一样，UEFI 也是用于控制启动过程的，并在系统固件与操作系统之间提供一个接口。

与 BIOS 不同的是，它有自己的独立于 CPU 的架构，以及其自己的设备驱动程序。UEFI 可以 **加载分区，读取特定文件系统**。








### 8.1.3 BIOS vs UEFI


BIOS 与 UEFI 区别

| 比较项目 | 传统BIOS | UEFI |
| :--- | :--- | :--- |
| 使用程序语言 | 组合语言 | C 语言 |
| 硬件资源控制 | 使用中断管理，不可变的内存存取，不可变的I/O存取 | 使用驱动程序与协议 |
| 处理器运行环境 | 16 位 | CPU 保护模式 |
| 扩充方式 | 通过IRQ 链接 | 直接加载驱动程序 |
| 第三方厂商支持 | 较差 | 较佳且可支持多平台 |
| 图形化能力 | 较差 | 较佳 |
| 内置简化操作系统前环境 | 不支持 | 支持 |

UEFI 在概念上非常类似于一个低级的操作系统，具有 **操控所有硬件资源** 的能力。但 **性能不佳**，多用来作为启动操作系统之前的硬件检测、启动管理、软件设置等。

##### 加载操作系统后

一般来说，UEFI 会停止工作，并把系统交给操作系统。但 **特定环境** 下，这些 UEFI 程序可以 **部份继续运行**，以协助某些操作系统管理特定设备。

##### 安全引导

过去，为了防止黑客对 BIOS 的破坏，UEFI 加入了一个 **安全引导** 机制。操作系统须被 UEFI 验证，否则无法启动。要把该功能 **关闭**，才能顺利进入 Linux 。

##### 额外分区

建议保留 **grub** 的 **BIOS boot** 分区，**2M** 空间；

另外，一些第三方厂商的 UEFI **应用程序** 需占用一定空间，因此需要一个单独的 **512MB ~ 1G** 分区，**vfat** 文件系统。

##### 设备文件号码

UEFI 突破了 BIOS 的 1024 柱面限制，因此 **引导程序与内核** 只需放置在磁盘开始的 **前 2TB** 即可，加上上面保留的 2 个分区，`/boot` 目录至少是 **/dev/sda3 之后** 的号码了。（BIOS 时代基本都是 `/dev/sda1`）









### 8.1.4 引导程序

Boot Loader / OS Loader。

引导程序通常安装在 MBR 和 VBR 中，其主要工作是在某个设备上 **找到内核，加载，运行**。

常用的引导程序为 GRUB，GRUB2 和 LILO。**GRUB2** 为较新的一个，比其它两种用的更为广泛。

大多数的引导程序允许以交互方式使用，以便用户可以 **选择启动哪个内核**，同时还可以 **把特定的参数传递给内核**。

鉴于 MBR 区区 512 字节的空间，其中的引导程序只能完成有限的工作，多数系统会将引导程序切分为两步。在 MBR 中的这部分自然称为一级引导程序，二级引导程序则会保存在持续储存设备中，如某个磁盘分区中。



#### 多系统引导

{% include figure image_path="/assets/images/boot.loader.png" alt="多系统引导流程示意" %}

* 不同的操作系统其 **文件系统的格式不同**，需要不同的引导程序来识别
* **每个文件系统都会保留一块引导扇区** VBR，操作系统通常把引导程序安装到其根目录所在文件系统的 VBR 中
* 可引导的内核文件是保存在各分区里的
* 引导程序只认识自己的系统盘内的可引导内核文件，以及其他引导程序而已
* 借助 **菜单** 功能，选择不同的内核或操作系统来引导
* 引导程序可直接指向或者是间接把管理权转交给另一个管理程序
* 通过 **移交控制权**，可以加载其他引导扇区内的引导程序，实现 **链式引导**

##### Windows / Linux 双系统

###### Linux

Linux 引导程序多为 `GRUB`

安装 Linux 系统时，**允许用户选择** 把引导程序安装在 MBR 或各别分区的引导扇区，且引导程序可以手动设置菜单，加入 Windows 启动选项。

如果安装到 MBR，则在 MBR 与 VBR 都会同时存在引导程序。

###### Windows

Windows 使用的引导程序为 `NTLDR`（New Technology Loader），默认无法转出控制权，只接受其它程序的转交。废物！！！

安装 Windows 时，会 **强制** 在 MBR 与 VBR **同时安装引导程序**。用户没有选择的机会，不支持设置启动菜单。流氓！！！

基于以上原因，普遍的做法是先安装 Windows，后安装 Linux，以保留启动菜单。


#### 引导程序如何加载 Linux 内核

引导程序的任务是访问 **操作系统的内核镜像** 文件，以便将其 **加载到内存并执行**，但 BIOS 不了解文件系统的概念。

普遍来说有两种方法加载内核：

##### 引导程序不了解底层的文件系统，直接读取硬盘扇区原始数据

通常间接引用映射文件，映射文件中包含内核镜像所在的物理扇区列表。每次安装新的内核镜像，其在磁盘中的物理位置发生改变时，在 MBR 中的这些映射都需要更新，这样扇区的间接引用才能继续工作。这种机制不仅很难处理，而且总是需要人工的干预，以防止在系统更新中发生错误。总的来说，是比较笨的方法。

`LILO（Linux Loader）` 使用这种方法。

##### 引导程序了解底层文件系统

引导程序能够了解底层文件系统，这样就可以使用真实路径来配置和访问内核镜像。但这样一来就需要在引导程序中包含每种文件系统的驱动程序。这种机制不再需要映射文件，即使内核镜像被移动也无需更新 MBR 。引导程序的配置保存在普通文件中，在任何内核镜像真正启动之前，通过该文件获取启动配置信息。这样一来，由于系统更新导致的错误可能性大大降低。缺点是：这种引导程序增加了内部的复杂性，体积更庞大。`GRUB2` 就是使用有这种方法，引导程序被分割成多个阶段，以便使其能容纳进 MBR 。








### 8.1.5 根文件系统

根文件系统是指根目录所在分区的文件系统。

系统启动后，所有的其它文件系统都会挂载在它上面。根文件系统中包含系统启动所需要的文件，以及修复系统的工具等。除根目录以外，还有一些常见的子目录，包括 `/boot`、`/dev`、`/etc`、`/bin`、`/sbin`，有时也包含 `/tmp`。根文件系统通常很小，因为只包含关键文件及很小的、不常修改的文件系统，这样运行起来比较稳定，不容易崩溃。










### 8.1.6 初始化程序

磁盘上的初始化程序至少负责以下工作：

* 整个 Linux 生命进程中始终做为 1 号进程存在
* 保持存活，以捕捉那些未被捕捉到的信号和中断
* 启动或管理至少一个程序，由其再接力启动、管理其它程序
* 做为 1 号进程，它是系统中所有程序的祖先。有些初始系统会自己管理所有进程，有些会把管理责任下发给别人，但它们始终是超级祖先。
* 知道以什么顺序来关机

尽管有上面列出的共同点，初始程序有各种形式和大小，以至于有些与其他程序几乎没有任何相似之处。以下是 Linux 中可用的初始化系统的部分列表：

1.  Epoch
2.  runit
3.  S6
4.  nosh
5.  Suckless Init (sinit)
6.  busybox-init
7.  OpenRC (not PID 1)
8.  sysvinit
9.  Upstart
10.  systemd

每一种都各具优势，其中 systemd 是并行启动的、事件驱动的初始化系统，同时它还捆绑了与初始化无关的功能，使 DIY 变得更困难。在多数发行版中，没有 systemd 就无法使用 Gnome，而且 `udev` 现在也和 systemd 捆绑到一起了，导致 Devuan 项目开发了 `vdev`，以摆脱 systemd。




















## 8.2 Initial Ram Disk

Initial Ram Disk，简称 initrd，是在挂载真正的根文件系统之前，被挂载的 **临时根文件系统**。

initrd 的任务是 **为加载真正的文件系统做好准备**，它是一个过渡的文件系统，生命周期很短。

`initrd` 和 `INITRAMFS` 是实现该机制的 **两种不同的方法**。为了方便，以下将这两个软件 **统称** 为 initrd。

initrd 是与内核捆绑在一起的，会做为内核启动流程的一部分被加载。加载后，内核才能读取其中的驱动模块，从而最终加载真正的根文件系统。

{% include figure image_path="/assets/images/initramfs.jpg" alt="" %}

initrd 系统模拟出来的精简根目录系统，其中含有 Linux 最常用的目录和文件，及所有与外设连接所需要的驱动模块，支持大量的硬件。正因如此，内核无需挂载任何物理磁盘，就能够完全引导。

`initrd` 函数可以 **把驱动程序编译成可加载的模块**，帮助生成一个 **很小的 Linux 内核**。借助这些可动态加载的模块，内核就可以访问磁盘、文件系统以及其它硬件的驱动程序了。因为根文件系统在磁盘上，`initrd` 函数提供了一种自举的方法来访问磁盘，从而挂载真正的根文件系统。在无盘嵌入式系统中，`initrd` 可以做为最终的根文件系统，也可以通过 NFS 来挂载最终根文件系统。


#### 为什么需要 initrd


##### 模块化的驱动程序

许多 Linux 发行版都会携带一个单一的、**通用的内核镜像**。该镜像是专门用于在各种硬件中启动的，与该通用内核配套的 **设备驱动程序被做成可加载的模块**，与内核一同提供。

之所以把驱动模块化，是因为如果把许多驱动程序静态编译到一个内核中，会导致内核镜像变得特别巨大，在小内存电脑上有可能会无法启动。因此，将其分离出来会 **精简内核**，便于在各种平台上顺利运行。

##### 临时根文件系统

虽然模块化的驱动程序为精简内核带来了便利，同时却又产生了一个 **新问题**：在系统引导期间，如何首先 **检测并识别到根文件系统**，然后才能加载其中的驱动模块。

【 困境 】

* 根文件系统很可能存在于 “软 RAID 驱动器、LVM、NFS、加密的分区” 中，所有这些情况，都需要提前进行 **特殊的准备工作**，才能顺利挂载根文件系统。
* 计算机 **休眠** 时，会把内存中所有内容的 **镜像** 保存到交换分区，或在磁盘中存为一个普通文件，然后再关机。下次 **启动时**，必须想办法 **先让该镜像可以访问**，然后才能将其加载回内存。

对于这些特殊的情况，为了避免使用 “硬编码到内核” 的办法，可以借助 initrd 的临时根文件系统来解决这个问题。引入一个初始的启动阶段（Initial Boot Stage），也称初期用户空间（Early User Space）。

因此，initrd 在内存中生成的根文件系统，根据上下文需要，平时可以被称为 “初始根文件系统”、“临时根文件系统”。
{: .notice--info}  

通过把 **initrd 镜像** 文件加载到内存中，**模拟** 出一个 **根文件系统**，该根文件系统可以被内核直接访问。这个根文件系统事先加入了常用的设备和文件系统的 **驱动程序模块**，也包含了用户空间常用的工具，来完成检测硬件、加载模块、发现设备等工作，之后就可以 **挂载真正的根文件系统** 了。
{: .notice--success}

在内核启动期间，initrd 被复制到内存并挂载，其使命是做为内存中的一个 **临时根文件系统**，在无需挂载任何物理磁盘的情况下，帮助内核完成启动。因为与外设通讯的必要模块可以集成到 initrd，内核就可以做的很小，却仍能支持大量的硬件。

内核启动以后，临时根文件系统 **通过 `pivot_root` 被卸载**，然后挂载真实的根文件系统。





#### 实现

initrd 镜像与内核镜像必须能被引导程序访问到，可以保存在根文件系统中，也可以保存在光盘中、本地磁盘的一个小分区中、FTP 服务器中。

引导程序会把内核与 initrd 镜像加载到内存，然后启动内核，把 initrd 的内存地址传递给内核。在引导程序的工作流程即将结束时，内核根据镜像的头几个块的数据来判断其格式，然后引向 initrd 或 initramfs 的流程：

##### initrd

在 initrd 方案中，镜像可以是一个文件系统的镜像（可以是压缩的），会使一个特殊的块设备 `/dev/ram` 变得可用，它随后就被挂载为初始根文件系统。该文件系统的驱动程序必须静态地编译到内核。

许多发行版早期都使用压缩的 ext2 文件系统镜像，另外一些使用 cramfs，以实现小内存系统的引导。因为 cramfs 镜像可以被就地挂载，而无需额外的空间用来解压缩。

一旦初始根文件系统挂载，内核执行第一个进程 `linuxrc`。进程结束后，内核就认为真正的根文件系统已经挂载了，会执行 `/sbin/init`，开始用户空间的启动流程。

##### initramfs

在 initramfs 方案中，initrd 镜像可以是一个 cpio 文件（可以是压缩的）。内核将该文件解包，变成 tmpfs 的一个特殊实例，即成为初始根文件系统。

该方法的好处是，无需把磁盘驱动和文件系统驱动编译到内核。有些系统使用 `dracut` 工具包来创建 initramfs 镜像。

内核执行初始化进程。



#### 挂载准备

一些发行版（如 Debian）会生成一个自定义的 initrd 镜像，只包含启动特定主机的模块，如 ATA、SCSI 及文件系统 驱动，通常也会在镜像中嵌入根文件系统的位置和类型。

其他的发行版（如 Fedora 及 Ubuntu）会生成一个更普通的镜像，通常只有根文件系统的设备名，其它的信息必须在引导期间去寻找。这种情况下，该软件必须执行复杂的级联任务才能挂载根文件系统：

* 必须加载引导进程所依赖的所有硬件驱动程序。常见的安排是将常用存储设备的内核模块打包到 initrd，然后调用 `hotplug` 代理来引入与计算机检测到的硬件相匹配的模块。
* 在显示启动画面的系统上，必须初始化视频硬件，并且用户空间帮助程序开始将动画与启动过程同步绘制到显示器上。
* 如果根文件系统位于 NFS 上，则必须启动主网络接口，调用 DHCP 客户端，通过它可以获得 DHCP 租约，从租约中提取 NFS 的共享名称及 NFS 服务器地址，然后挂载 NFS 共享。
* 如果根文件系统似乎位于软件 RAID 设备上，则无法知道 RAID 卷跨越了哪些设备；必须调用标准 MD 实用程序来扫描所有可用的块设备，并将所需的块设备联机。
* 如果根文件系统似乎位于逻辑卷上，则必须调用 LVM 实用程序来扫描并激活包含它的卷组。
* 如果根文件系统位于加密块设备上，则软件需要调用助手脚本来提示用户输入密码和/或插入硬件令牌（例如智能卡或 USB 安全加密狗），然后用设备映射器创建一个解密目标。

某些发行版使用诸如 `udev` 这类的事件驱动的热插拔代理程序，当符合一定规则的硬件设备、磁盘分区、存储卷连机时，代理程序会调用助手程序。此举实现了并行发现，并逐步级联成 LVM，RAID 或加密的任意嵌套，以获取根文件系统。

当根文件系统最终变为可见时，那些无法在挂载的根文件系统上运行的维护任务全部结束，根文件系统以只读方式被挂载，所有必须继续运行的进程（例如启动画面助手及其命令 FIFO）被挂载到新安装的根文件系统中。

最终的根文件系统不能仅仅挂载到 `/` 根目录，因为这样做会导致初始根文件系统中的脚本和工具无法访问，无法完成最终的清理任务：

* 在 initrd 中，新根文件系统挂载于一个临时挂载点，然后再使用 `pivot_root(8)` 滚动到位，在这之后，初始的根文件系统被挂载于普通的挂载点上，如 `/initrd`，启动脚本将得以将其卸载，并释放之前 intrd 占用的内存。
* 在 initramfs 中，初始根文件系统无法被滚动，它先是被清空，然后最终的根文件系统直接原位覆盖。

多数的初始根文件系统会把 `/linuxrc` 或 `/init` 做为 shell 脚本执行，因此会包含一个精简的 shell，通常是 `/bin/ash`，同时还会有一些基本的用户空间程序。












































## 8.3 典型的计算机启动流程

现今的 PC 配置，基本上以 UEFI 为主流了，蓝色的经典的 BIOS 配置界面即将成为历史。



### 8.3.1 `BIOS + MBR/GPT`

1. BIOS：找到 **第一个可引导设备**。

2. MBR：在引导设备上，从 MBR 或 LBA0 读取 **引导程序**。

	由于 LBA0 仅提供 **第一阶段** 的引导程序，如果使用如 grub 的引导程序代码，需额外分出一个 **BIOS boot** 分区，用于放置启动过程所需的其他代码。在 CentOS 当中，该分区通常为 **2MB** 。

3. 引导程序：是操作系统安装在 MBR 上面的一个软件，主要目的为 **加载内核文件**。

4. 内核文件：**启动操作系统**






### 8.3.2 `UEFI + GPT`

当装有 UEFI 的 x86 电脑启动时，接口在系统存储设备中搜索含有特定标签（GUID，Globally Unique Identifier）的分区，含有这个标签的分区称为 **EFI 系统分区** (ESP,EFI System Partition）。这个分区含有专为 EFI 架构编译的应用程序，其中包含可引导操作系统的 EFI 引导程序，以及工具软件。

UEFI 系统中的引导程序可以以一个默认配置启动系统，或提醒用户选择操作系统启动。手动或自动选择一个引导程序以后，UEFI 会把它读取到内存，并把控制权转交给引导程序。







### 8.3.3 Linux 系统启动流程

要启动 Linux 并进入可用状态，共需两步：**引导** 和 **启动**。

#### 引导阶段

引导阶段从打开计算机电源开始，到内核完成初始化，并执行了 systemd 结束。

* BIOS
* GRUB
* Linux 内核
* 启动 systemd

#### 启动阶段

启动阶段接手，完成后续任务，直至 Linux 进入可操作状态。

* 读取配置文件
* sysinit.target
* basic.target
* multi-user.target
* graphical.target






















## 8.4 Linux 启动流程

本节讨论的启动过程均基于 x86 系统架构。








### 8.4.1 引导阶段

引导过程的开始可以是：

* 从关机状态 **打下电源按钮**，会开始引导过程
* 本地用户已经登陆，用户可以通过下达 **重启命令**，开始引导过程




#### 硬件

引导过程的第一步与 Linux 没什么关系，对于任何操作系统来说都是一样的，只是引导过程中硬件的部分。

##### 运行 BIOS

接通电源或硬重启之后，控制权交给 ROM 中的一个程序，基于历史原因，该程序称为 BIOS。

##### 自检

BIOS 通常会进行一个基本的设备 **自检**，并 **访问 NVRAM 来获取一些参数**，该 NVRAM 是靠电池供电的 CMOS 内存，因此通常称为 CMOS。

POST 会检查硬件的基本可用性，如果 POST 失败，计算机停止引导。

##### 查找可引导的设备

读取 CMOS 中保存的参数，有一项用来指定引导设备，该设备可以提供引导程序，该设备即称为 **引导设备**。

在可引导设备的 MBR 中 **检查 MBR 签名**，以确定设备是否可以用于引导。如果设备 MBR 的最后两个字节是 0xAA55，表明这个 **设备可以用于启动**；如果不是，表明设备不能用于启动，BIOS 会尝试下一个引导设备。

发起一个 **BIOS 中断**，`INT 13H`，通过这个中断来 **查找可引导的设备的 MBR**

>BIOS 是通过硬件的 `INT 13H` 中断来读取 MBR 的，因为使用 CHS 寻址，所以只要 BIOS 能够检测到的磁盘，无论 SATA 还是 SAS 接口，都能顺利读取其 MBR，从而加载其中的引导程序。

##### 加载引导设备 MBR

把 MBR 整个加载到内存中，其中包含引导程序。

MBR 中的引导程序算是 1 级引导程序。BIOS 不认识分区表或文件系统，它只会初始化硬件、读取 MBR，之后要完全依靠 GRUB 1 级引导程序才能进行后续的启动流程。

##### BIOS 把控制权移交给引导程序

引导程序要读取的设备也是可以通过 **网络** 连接的，在此情况下，引导的细节由 DHCP、TFTP、PXE、Etherbot 等协议决定。
{: .notice--info}







#### 引导程序

>GRUB 之前的引导程序 LILO，即 Linux Loader 只用 1、2 两级引导，它无法识别根文件系统。而 GRUB 多了一个第 1.5 级引导，专门为了识别根文件系统使用的。本节仅讨论使用 GRUB2 的系统。

总的来说，GRUB 的任务是 **加载并执行 Linux 内核及 initrd 镜像**。GRUB 的引导流程需要三级（1 > 1.5 > 2）才能完成。

* 1 级引导：找到并加载 1.5 级引导程序
* 1.5 级引导：加载根文件系统驱动程序，从根文件系统中找到 2 级引导程序并加载
* 2 级引导：找到 Linux 内核，并将其加载到内存，把控制权移交给内核

##### GRUB 1 级引导

* BIOS 把 MBR 整体加载到内存后，开始执行其中的 GRUB 1 级引导程序
* 1 级引导程序根据地址加载 1.5 级引导程序 `core.img`
* 1 级引导程序把控制权移交给 1.5 级引导程序

1 级引导程序通常为 **446** 字节，文件名为 **boot.img**。由于其代码所占的空间很小，它并不智能，**无法理解文件系统的架构**，因此需要继续加载 1.5 级引导程序。

在 GRUB 安装时，会把 1.5 级引导程序所在的地址 **硬编码** 到 boot.img，以方便其加载。

##### GRUB 1.5 级引导

* 加载 `core.img`：`core.img` 的第一扇区 `diskboot.img` 被加载后，由它依次加载并执行 `core.img` 的其余部分。
* 加载根文件系统的 **驱动程序**。因为 `diskboot.img` 中含有各种文件系统驱动，可以识别根文件系统，因此它 **开启了 GRUB 对该分区的访问**。
* 从 `/boot/grub2` 目录中加载 2 级引导程序

##### GRUB 2 级引导

由于 1.5 级引导程序的执行，GRUB 2 级引导程序现在可以 **直接访问** 根文件系统了。

* 加载 **GRUB 内核模块**
* 加载 **GRUB 配置文件** `/boot/grub2/grub.cfg`
* 显示 **GRUB 引导菜单**：2 级引导程序加载完成后，GRUB 会显示出命令行界面的菜单，请用户选择要启动的操作系统或内核
* 2 级引导程序 **加载** 用户选择的 **Linux 内核** 到内存。或者，把控制权 **移交给其他引导程序**。
* 2 级引导程序把一个或多个对应的 **initrd 镜像加载到内存**，并把镜像 **解压** 到一个临时的、基于内存的 **`tmpfs`** 文件系统中
* **内核和 initrd 镜像全部加载到内存** 以后，2 级引导程序 **调用内核镜像**。



内核版本 2.6.13 之前，引导程序需要单独加载 initrd 镜像，内核版本 2.6.13 之后，内核内置了 initramfs 镜像。
{: .notice--info}  











#### 内核

内核镜像加载到内存，并从 2 级引导程序手中接过控制权，开始了内核阶段。简单描述：

* 内核初始化，**配置内存及各种硬件**，包括 CPU、I/O 子系统、存储设备
* 内核在内存中 **寻找 initrd 镜像**，将其 **解压并挂载**，从初始根文件系统中 **加载所需驱动模块**
* **初始化** 文件系统相关的 **虚拟设备**，如 LVM、软 RAID 等
* **卸载 initrd 镜像**，释放占用的内存
* 内核 **创建根设备，以只读模式挂载根分区**，释放无用内存

具体可分为两个阶段：

##### 内核加载

内核镜像头部中的例程（routine）先是 **配置少量的硬件**，把镜像完全 **解压** 到高内存（high memory）中，如果此时它发现内存中有 **initrd 镜像**，内核会先 **记录其位置**。然后通过 `./arch/i386/boot/head` 和 `startup_32 ()` 执行内核的启动。

##### 内核启动

内核的 **启动函数**，也称 **`swapper`** 或 **0 号进程**，会 **启动内存管理**（页表和内存页），检测 CPU 的类型，浮点计算能力等附加功能，然后通过 `start_kernel()` 切换到非特定体系的内核功能。

`start_kernel` 会执行一众初始化功能。设置中断处理程序，进一步配置内存，**启动初始化进程**（第一个用户空间进程），然后通过 `cpu_idle()` 启动闲置任务。

注意，内核启动的同时，也会 **把 initrd 挂载为临时根文件系统**，于是可以从中直接 **加载驱动模块**，然后通过 **调用 `pivot_root()` 卸载临时根文件系统**，用真正的根文件系统来替换，一旦真正根文件系统可用，initrd 占用的内存就被释放。

因此，内核先是初始化设备，以只读方式挂载根文件系统，然后运行 1 号初始化进程。

进行到这里，中断已经可用，调度程序可以全面掌控系统的管理了，预先提供多任务管理。

初始化进程被留下，继续启动用户空间的用户环境。




















### 8.4.2 启动阶段

初始化进程启动之后，进入系统启动阶段。启动阶段会把 Linux 最终置于可作业状态。


#### 初始化程序

这里只考虑 systemd 系统。

内核镜像中的 systemd 负责初始化所需的文件系统、服务及驱动程序。这些过程被分割成离散的步骤，以 **目标单元** 的方式呈现。启动进程是 **高度并行** 的，因此特定目标单元的启动顺序并不是确定的，但仍遵循 **有限的排序架构**。

systemd 启动系统时，它会递归激活 `default.target` 依赖的所有的单元，`default.target` 通常只是 `graphical.target` 或 `multi-user.target` 的别名，决定于默认配置。为了在众多单元并行的同时能维持相对的顺序，需要几个重要的目标来辅助。

下图为这些常用的目标及其在启动逻辑中所处的位置，上面的单元最先启动。

```

local-fs-pre.target
         |
         v
(various mounts and   (various swap   (various cryptsetup
 fsck services...)     devices...)        devices...)       (various low-level   (various low-level
         |                  |                  |             services: udevd,     API VFS mounts:
         v                  v                  v             tmpfiles, random     mqueue, configfs,
  local-fs.target      swap.target     cryptsetup.target    seed, sysctl, ...)      debugfs, ...)
         |                  |                  |                    |                    |
         \__________________|_________________ | ___________________|____________________/
                                              \|/
                                               v
                                        sysinit.target
                                               |
          ____________________________________/|\________________________________________
         /                  |                  |                    |                    \
         |                  |                  |                    |                    |
         v                  v                  |                    v                    v
     (various           (various               |                (various          rescue.service
    timers...)          paths...)              |               sockets...)               |
         |                  |                  |                    |                    v
         v                  v                  |                    v              rescue.target
   timers.target      paths.target             |             sockets.target
         |                  |                  |                    |
         v                  \_________________ | ___________________/
                                              \|/
                                               v
                                         basic.target
                                               |
          ____________________________________/|                                 emergency.service
         /                  |                  |                                         |
         |                  |                  |                                         v
         v                  v                  v                                 emergency.target
     display-        (various system    (various system
 manager.service         services           services)
         |             required for            |
         |            graphical UIs)           v
         |                  |           multi-user.target
         |                  |                  |
         \_________________ | _________________/
                           \|/
                            v
                  graphical.target

```

其中的 `rescue.target`、`graphical.target`、`multi-user.target`、`emergency.target` 通常可以做为启动目标。可以在命令行上使用 `systemd.unit=` 来指定，或将 `default.target` 软链接到它们来实现。

`sysinit.target` 和 `basic.target` 可被看成启动阶段的 **重要关卡**。虽然 systemd 被设计为并行启动系统服务，仍然存在一些服务和功能性目标必须最先启动，这些关卡不能略过，直到其所需的服务和目标均已启动完毕。



##### 读取配置文件

###### systemd 配置文件

`/etc/systemd/system/default.target`  确定本次启动的默认目标

###### 加载用户指定模块

如果想在系统启动时，加载 **特定的驱动程序**，或需要 **调整指定模块的参数**，可以使用这两个配置文件来指定。

* `/etc/modules-load.d/*.conf` ：指定需要直接加载的模块，如 `nf_conntrack_ftp`
* `/etc/modprobe.d/*.conf` ：加载模块时需要带参数，如 `options nf_conntrack_ftp ports=555`

若想测试是否修改成功，可以先重启模块加载服务，再查看是否被系统自动加载：

```
~]# systemctl restart systemd-modules-load.service
~]# lsmod | grep nf_conntrack_ftp
nf_conntrack_ftp       18638  0
nf_conntrack          105702  1 nf_conntrack_ftp
```

###### 设置用户认证机制

`/etc/sysconfig/authconfig`

用于设置用户认证的机制，包括

* 是否使用本机的 `/etc/passwd`，`/etc/shadow`
* `/etc/shadow` 用哪种加密算法记录密码（系统默认使用 SHA512）
* 是否使用外部密码服务器进行帐号验证（NIS，LDAP），默认不使用

不建议手动修改此配置文件文件，应该用 `authconfig-tui` 命令来修改。
{: .notice--info}  

###### 指定 CPU 操作模式

`/etc/sysconfig/cpupower`

`cpupower.service` 服务的配置文件，指定 Linux 内核应如何操作 CPU。

一般来说，启动该服务之后，系统会让 CPU 性能优先的方式来运行，否则默认就是用多少算多少。

###### 防火墙相关服务

`/etc/sysconfig/firewalld`

`/etc/sysconfig/iptables-config`

`/etc/sysconfig/ebtables-config`

###### 设置网卡

`/etc/sysconfig/network-scripts/*`




##### 启动 `sysinit.target`

经过 `sysinit.target` 的初始化之后，系统可以正常存取数据了。

`sysinit.target` 的依赖：

* `local-fs.target`，`swap.target`

	挂载由 `/etc/fstab` 指定的文件系统，包括所有的交换文件和分区。

* `cryptsetup.target`

	针对加密的文件系统启动加密服务。

* 各种底层服务

	* 动态设备管理服务 `udevd`

	* 临时文件系统 `tmpfiles`

	* 随机数生成器种子

	* `sysctl` 服务

* 各种底层虚拟文件系统接口

	* 消息队列 `mqueue`

	* 内核虚拟文件系统 `configfs`

	* 调试内核的虚拟文件系统 `debugfs`

这些服务可以并行启动，它们是系统 **最小化运作所必需的** 所有底层服务和单元，它们都完成之后 `sysinit.target` 才能启动。



##### 启动 `basic.target`

`basic.target` 的依赖：

* 音效驱动 `alsa`

* 防火墙 `firewalld`

* CPU 微指令

* 启动并设置 SELinux 的安全上下文

* 把当前启动过程保存到 `/var/log/dmesg` 中

* 从 `/etc/sysconfig/modules/*.modules` 及 `/etc/rc.modules` 加载特定模块

* timer 服务



##### 运行 SystemV init 脚本

systemd 的原生服务格式为服务单元，systemd 管理系统时只认这类格式。总共有 **9 个目录** 中含有 `.service` 文件，其中包括 `/etc/systemd/system`，`/run/systemd/system`，`/usr/local/lib/systemd/system` 和 `/usr/lib/systemd/system`。

对 SystemV init 脚本的兼容是通过一个 **转换程序** 实现的，名为 `systemd-sysv-generator`。该程序位于 `/usr/lib/systemd/system-generators/` 目录。

这个程序是一个生成器，它的任务是在一个临时文件系统中 **实时迅速生成服务单元文件**，该 `tmpfs` 中有 3 个目录中含有 `.service` 文件，均为该程序专属。如果该程序在另外 6 个目录中没找到同名的原生的服务单元，它就生成这个服务单元，由这个服务单元来运行 `/etc/init.d` 目录中的 SystemV init 脚本。

SystemV init 脚本中的 LSB header 不是必需的，如果没有 LSB header，`systemd-sysv-generator` 可以识别早期 RedHat comment headers （description:, pidfile 等）。此外，如果没有 LSB header，systemd 会去检查 `/etc/rc?.d` 的软链接，从文件名中读取优先级，据此创建服务单元的先后顺序，保持服务间的连续性，这些服务不是并行的。

之所以 `/etc/rc3.d` 完全不重要，是因为很有可能已经通过另一个 `/etc/rc?.d` 目录激活此脚本了。该程序还会把 `/etc/rc2.d`，`/etc/rc3.d/`，`/etc/rc4.d/` 任何目录中的文件，翻译成一个原生的 `multi-user.target` 的 Wanted-By 单元。在 systemd 的世界里，运行级别被完全废弃。

systemd 不支持将 SysV 脚本加入到系统启动的早期阶段，所有包装单元都排在 `basic.target` 之后。

>systemd-sysv-generator 生成器用于在系统启动过程中以及在 systemd 重新加载其配置时， 将 `/etc/init.d/*` 目录中的 SysV init 脚本 包装为 `.service` 单元。 这样就可以让 systemd 兼容传统的 SysV init 脚本。

>SysV init 脚本中的 LSB headers 可以被正确解释，其中定义的启动顺序将被转化为单元之间的依赖关系。 LSB 设施(facility) "$remote_fs", "$network", "$named", "$portmap", "$time" 将会被转化为对特定 `.target` 单元的依赖，从而得到支持。参见 systemd.special(5) 以了解详情。

>SysV 运行级将会被转化为对应的 `.target` 单元（`runlevelX.target`）， 并在其中包含从该运行级所启用的脚本生成的包装单元。





##### 启动 `multi-user.target`

🚩`multi-user.target` 必须先于 `graphical.target` 的依赖服务启动。

各种系统服务和网络服务均挂在 `multi-user.target` 下面，具体位置为 `/etc/systemd/system/multi-user.target.wants/`，该目录中的各个软链接文件即是 `systectl enable` 的结果，`systemctl disable` 时会删除软链接。

###### 兼容 SystemV 的 `rc-local.service`

在 SystemV 时期，当系统完成引导后，如果想让 Linux 额外执行某些程序，可以把该程序命令或脚本的绝对路径写入 `/etc/rc.d/rc.local` 文件。

新的 systemd 机制中，建议直接写一个 systemd 的启动脚本配置文件到 `/etc/systemd/system` 中，然后使用 `systemctl enable` 的方式来启用。

systemd 实际上仍然支持原始的执行脚本的办法，使用 `rc-local.service` 服务。它不需要启动，会通过检查 `/etc/rc.d/rc.local` 文件是否具有 **可执行权限** 来判断是否启动该服务。

因为在 systemd 环境下，`/etc/rc.d/rc.local` 文件默认没有可执行权限，因此  rc-local.service 服务默认不会自动启动。

因此为其增加可执行权限，并重启守护进程：`chmod a+x /etc/rc.d/rc.local; systemctl daemon-reload`

这样一来，用户可以把脚本放在 `/etc/rc.d/rc.local` 文件中， 系统在每次启动后都会自动执行该文件中的命令。

🍎打开该服务以后， `/etc/rc.d/rc.local` 文件就会被拉进 multi-user target 来执行。

>如果查看该服务状态会发现，其状态为 “have no installation config...static” ，这是正常的，因为静态服务其单元文件中通常没有 [Install] 部分，而且通常是其它服务的依赖服务。因此根本就不需要 enabled。


###### `getty.target`

提供终端命令行界面

###### `systemd-logind.service`, `systemd-user-sessions.service`

用户登陆服务




##### 启动 `graphical.target`

如果 `default.target` 链接到 `multi-user.target`，该步骤就不会执行；如果是 `graphical.target`，systemd 就会开始加载用户管理服务与图形界面管理器（Window Display Manager, WDM） 等，启动图形界面的登陆框。

`graphical.target` 的依赖服务：

* `accounts-daemon.service`
* `gdm.service`	该服务负责图形显示及用户登陆
* `network.service`
* `rtkit-daemon.service`
* `systemd-update-utmp-runlevel.service`
* `multi-user.target`



##### 用户看到登陆画面，整个启动阶段完成。

















































## 8.5 内核与内核模块

Linux 内核是一种开源的类 Unix 操作系统宏内核。整个 Linux 操作系统家族基于该内核部署在传统计算机平台和各种嵌入式平台，如路由器、无线接入点、专用小交换机、机顶盒、FTA 接收器、智能电视、数字视频录像机、网络附加存储（NAS）等。工作于平板电脑、智能手机及智能手表的 Android 操作系统同样通过 Linux 内核提供的服务完成自身功能。尽管于桌面电脑的占用率较低，基于 Linux 的操作系统统治了几乎从移动设备到主机的其他全部领域。截至2017年11月，世界前500台最强的超级计算机全部使用 Linux。

从技术上说，Linux 只是一个匹配 POSIX 标准的内核。它提供了一套应用程序接口（API），通过接口用户程序能与内核及硬件交互。仅仅一个内核并不是一套完整的操作系统。有一套基于 Linux 内核的完整操作系统叫作 Linux 操作系统，或是 GNU/Linux（在该系统中包含了很多 GNU 计划的系统组件）。

内核通常是压缩文件，需 **解压缩** 后才能加载到内存。

为了使加载内存最小化，所有的内核都是以自解压方式存在的压缩包，比较节省空间。与内核保存在一起的，还有 **initrd 镜像** 以及 **硬盘的设备映射文件**。




### 8.5.1 内核相关文件

内核模块： `/lib/modules/*`

内核源代码： `/usr/src/kernels/` （默认不安装）

内核顺利载入以后，会自动记录以下信息：

内核版本： `/proc/version`

内核功能： `/proc/sys/kernel/*`

####  `/boot/` 目录中常见的文件

`config-3.10.0-229.el7.x86_64`               此版本内核被编译时选择的功能与模块配置文件

`grub/ `                                     旧版 grub

`grub2/`                                     grub2

`initramfs-0-rescue-309eb890d3d95ec7a.img`    initrd 镜像文件，用于紧急修复

`initramfs-3.10.0-229.el7.x86_64.img`         正常引导使用的 **initrd 镜像**

`initramfs-3.10.0-229.el7.x86_64kdump.img`    内核出问题时使用的 **initrd 镜像**

`System.map-3.10.0-229.el7.x86_64`            内核功能加载到内存地址的 **映射表**

`vmlinuz-0-rescue-309eb890d09543d95ec7a`     紧急修复用的内核文件

`vmlinuz-3.10.0-229.el7.x86_64`              Linux 系统 **内核文件**





### 8.5.2 内核模块

内核中的一些 **驱动程序被分离出来**，以模块的形式单独保存在 `/lib/modules/` 目录中，可以在需要时使用 `modprobe` **动态加载** 到系统中。因此 USB, SATA, SCSI 等 **磁盘的驱动程序通常都是以模块的方式存在**。

因此，要想在 Linux 使用新硬件，要么把新硬件驱动程序加入源代码后，重新 **编译内核**；要么将 **驱动程序编译成为模块**，在 **开机时载入**。


#### 常见内核模块

内核模块扩展名是 **`.ko`**，是 Kernel Object 的意思。

内核模块目录为 `/lib/modules/$(uname -r)/kernel`，其常见子目录：

* `arch`    平台架构
* `crypto`    加密技术
* `drivers`   硬件驱动程序
* `fs`    文件系统
* `lib`    函数库
* `net`    网络协议，防火墙模块等
* `sound`    声音模块


#### 模块间依赖关系

Linux 内核的 **不同模块之间可以提供服务**，称之为 “**符号**”。

痛恨起 “符号” 这个名的人，不可理解，就叫服务不是挺好的么？“符号” 在上下文中特别影响理解，非常容易造成语义上的混淆，毕竟它在中文有太多的意义。
{: .notice}

如果模块 B 使用模块 A 提供的服务，则可以说 B 依赖 A。这种依赖有关系可能会变得特别复杂。

##### `modules.dep` 文件

`/lib/modules/$(uname -r)/modules.dep`

该文件记录了 **模块之间依赖关系** 的列表，表明了每个模块所 **输出** 和 **需要** 的符号分别是什么。

##### `depmod` 命令

通过 **读取** `/lib/modules/<version>` 目录中 **所有模块**，depmod 命令会 **更新 `modules.dep` 文件**，及其哈希版本的二进制文件 **`modules.dep.bin`**。

>如果在命令中指定了模块文件名，则只会检查指定的模块。不过很少人这么做，除非把所有模块都列出来。

depmod 还会生成一个由模块提供的符号的 **别名列表**，文件名为 `modules.symbols` 及其二进制 hash 版本 `modules.symbols.bin`。

最后，如果这些模块要使用特殊的设备文件名，而且这些设备文件在引导时需要出现在 `/dev` 目录，则 depmod 会输出一个名为 `modules.devname` 的文件。

如果在命令中指定内核版本，depmod 则会检查指定的内核目录。

###### 语法

`depmod [-Ane]`

不加任何参数时， depmod 会分析当前内核的模块，并重写 modules.dep。

`-A`	有新模块才更新

`-n`	不写入 modules.dep ，只把结果输出到 stdout

`-e`	显示每个模块的所有未解析的符号。

###### 范例：更新 `modules.dep`

系统添加了一个网卡驱动程序 `a.ko`，更新 `modules.dep`

```
~]# cp a.ko /lib/modules/$(uname -r)/kernel/drivers/net
~]# depmod
```



### 8.5.3 查看内核模块


#### 查看已加载的模块

`lsmod` 命令用于查看 **当前已加载的内核模块** 的状态，它显示的信息取自 `/proc/modules`。

```
$ lsmod
```

返回的结果：

`Module`  模块名称

`size`  模块的大小

`Used by`  此模块是否被其他模块所使用


#### 查看静态模块信息

`modinfo` 命令用于查询指定模块的信息。

查询时，可以指定 **模块名称**，也可以指定 **模块的文件名**。如果指定模块名称，则会搜索 `/lib/modules/$(uname -r)` 目录。

该命令默认会以 `字段:值` 的格式列出模块的每个属性，包括文件名。

##### 语法

`modinfo [-F field] [-adln] [module_name|filename]`

`-a`   仅查看作者

`-d`   仅查看模块说明

`-l `  仅查看授权

`-n`   仅查看模块的详细路径

接模块名：

```
~]# modinfo drm
filename:       /lib/modules/3.10.0-693.11.6.el7.x86_64/kernel/drivers/gpu/drm/drm.ko.xz
license:        GPL and additional rights
description:    DRM shared core routines
author:         Gareth Hughes, Leif Delgass, José Fonseca, Jon Smirl
license:        GPL and additional rights
description:    DRM bridge infrastructure
author:         Ajay Kumar <ajaykumar.rs@samsung.com>
rhelversion:    7.4
srcversion:     4D91436EA4E1CAAAAA64794
depends:        i2c-core
intree:         Y
vermagic:       3.10.0-693.11.6.el7.x86_64 SMP mod_unload modversions
signer:         CentOS Linux kernel signing key
sig_key:        2C:BC:98:70:54:63:43:CA:3A:E1:20:C2:BC:EB:98:44:01:95:59:62
sig_hashalgo:   sha256
parm:           edid_fixup:Minimum number of valid EDID header bytes (0-8, default 6) (int)
parm:           debug:Enable debug output, where each bit enables a debug category.
                Bit 0 (0x01) will enable CORE messages (drm core code)
                Bit 1 (0x02) will enable DRIVER messages (drm controller code)
                Bit 2 (0x04) will enable KMS messages (modesetting code)
                Bit 3 (0x08) will enable PRIME messages (prime code)
                Bit 4 (0x10) will enable ATOMIC messages (atomic code)
                Bit 5 (0x20) will enable VBL messages (vblank code) (int)
parm:           vblankoffdelay:Delay until vblank irq auto-disable [msecs] (0: never disable, <0: disable immediately) (int)
parm:           timestamp_precision_usec:Max. error on timestamps [usecs] (int)
parm:           timestamp_monotonic:Use monotonic timestamps (int)
```

接文件名：

```
~]# modinfo /lib/modules/$(uname -r)/kernel/arch/x86/kernel/iosf_mbi.ko.xz  
filename:       /lib/modules/3.10.0-693.11.6.el7.x86_64/kernel/arch/x86/kernel/iosf_mbi.ko.xz
license:        GPL v2
description:    IOSF Mailbox Interface accessor
author:         David E. Box <david.e.box@linux.intel.com>
rhelversion:    7.4
srcversion:     E6609E796D1747C4E14F1AB
alias:          pci:v00008086d00000F00sv*sd*bc*sc*i*
depends:        
intree:         Y
vermagic:       3.10.0-693.11.6.el7.x86_64 SMP mod_unload modversions
signer:         CentOS Linux kernel signing key
sig_key:        2C:BC:98:70:54:63:43:CA:3A:E1:20:C2:BC:EB:98:44:01:95:59:62
sig_hashalgo:   sha256
```








### 8.5.4 模块的加载与移除

模块的动态的加载与移除，主要通过 `modprobe` 命令来完成。

模块的名称中经常使用下划线 `_` 和短划线 `-`，在 `/etc/modprobe.d/` 目录中的配置文件中使用 `modprobe` 时可以混用，而且在模块命令的使用中它们也可以混用。



#### `modprobe`

`modprobe` 命令用于在内核中 **智能加载或删除模块**。它会在 `/lib/modules/$(uname -r)` 目录中查找模块及其它文件，在 `/etc/modprobe.d` 目录中查找配置文件。

`modprobe` 需要最近更新的 `modules.dep.bin` 文件，它会参照其中的依赖关系，来判断需要加载和删除哪些模块。

当内核请求一个模块时，实际上它也是通过 `modprobe` 来请求的。

通常是间接使用 `modprobe` 命令：如 `udev` 也是依靠 `modprobe` 为检测到的硬件自动加载驱动程序的。
{: .notice--info}

##### 特点

它的功能比诸如 `insmod`、`rmmod` 同类软件要丰富的多：

* 能够更直观地决定加载哪些模块
* 它有能力了解模块间的依赖性，因此当请求加载模块时，`modprobe` 首先添加其他所需模块
* 根据需要解决递归模块依赖关系

##### 配置文件

`/etc/modprobe.d/` 目录中的 `*.conf` 是 `modprobe` 的配置文件。

如果需要内核模块加载时带上某些特定的参数，可以在该目录中创建自定义的配置文件来实现。

配置文件可以用来指定模块参数、创建模块别名，用特殊的需求来覆盖 `modprobe` 加载模块时的常规行为。

##### 语法

`modprobe [-cfr] module_name`

`-c`	显示 `/etc/modprobe.d/` 目录中有效的配置

`-f`	尝试去掉模块版本信息，避免影响加载

`-r`	移除模块

不加参数，直接使用时，它默认加载指定模块到内核。

###### 模块附加参数

可以在加载模块时使用特定的参数来规范模块的行为，加在模块名称后面的任何参数都会传递给内核。

```
# modprobe module_name parameter=value ...
```

用空格把多个 `参数/值` 分开，数组值用逗号分隔：

```
# modprobe foo arrayparm=1,2,3,4
```

##### 范例

```
~]# modprobe vfat		# 加载模块

~]# modprobe -r vfat	# 移除模块
```




#### `insmod`

`insmod` 命令用于 **直接把模块插入内核中**，**不分析依赖关系**。需要指定模块的完整文件路径。

如果处理不好依赖关系，很可能加载会失败。

`insmod [/full/path/module_name] [parameters]`

##### 范例

```
~]# insmod /lib/modules/$（uname -r）/kernel/fs/fat/fat.ko
```





#### `rmmod`

`rmmod` 用于从内核中移除模块。

`rmmod [-fw] module_name`

`-f`  强制移除，不论是否在用

* 范例：

```
~]# rmmod fat
```












































## 8.6 GRUB

GRUB，GNU GRand Unified Boot loader 是一个引导程序，它在系统启动时，给用户提供选择菜单，以决定启动哪个操作系统或内核，或由用户设定不同的参数来引导内核。

🍎 GRUB1 目前已经停止开发和维护。而新版的 GRUB2 是完全重新编写的。当前的发行版大多使用 GRUB2 ，且通常简称其为 GRUB，称从前的 GRUB1 为 GRUB Legacy。

{% include figure image_path="/assets/images/GRUB_components.png" alt="GRUB 要素" %}

>MBR 中只有 **446** 字节的空间留给引导程序，要想让引导程序支持多文件系统、启动菜单，其体积会比较庞大，无法完全容纳于 MBR 中，于是引导程序会被分割成几部分。






### 8.6.1 GRUB 的安装

对于 BIOS 系统，安装 GRUB



#### MBR 格式分区表

在传统 BIOS 平台上使用的分区表称为 MBR 格式，这个格式允许使用最多 4 个主分区及额外的逻辑分区。

对于这种格式的分区表，有两种方式来安装 GRUB：

##### 安装到 DOS 兼容区

无法保证该空间的彻底安全，有些专用的软件可以修改该区域内容。有时会被其它系统占用。

##### 安装到 VBR

GRUB 很容易被 `tail packing` 或 `fsck` 等工具移动到其它位置。而且要想把 GRUB 安装到文件系统中，必须保证 `/boot` 文件系统与 BIOS 要引导的文件系统是在同一个磁盘上，这样，在 BIOS 成功引导之后，GRUB 才能直接访问内核文件。

通常建议安装到 DOS 兼容区，除非有特殊需求。当然要保证第一分区至少从第 63 扇区开始划分，才能给 DOS 兼容区腾出空间。好在当下的磁盘都以性能为先，分区都是在较大的位置（如 1MiB）对齐，即第一分区通常是从第 2,048 扇区开始划分。



#### GPT 格式分区表

一些较新的系统使用 GPT（GUID Partition Table） 格式，属于 EFI（Extensible Firmware Interface） 的一部分，但如果系统软件支持的话，也可以用在 BIOS 平台上，如 GRUB 和 Linux 就可以。

使用这种格式时，允许 **为 GRUB 单独保留一个分区**，称为 **BIOS 引导分区**，这样一来，GRUB 就可以嵌入这个分区，再也不用担心被其它软件覆盖，或是被操作系统移走了。

在 GTP 系统上创建 BIOS 引导分区时，必须确保分区大于 31 KiB。GTP 格式的磁盘通常较大，因此建议引导分区要大于其最小单位，如 1 MiB，以便为将来更新容纳更多内容。同时也要确保该分区使用正确的类型。

##### 用 `fdisk` 分区

使用分区类型号 `4`

##### 用 `parted` 分区

`# parted /dev/disk set partition-number bios_grub on` 使用 `bios_grub` 参数

##### 用 `gdisk` 分区

将分区类型设为 `0xEF02`

##### 其它软件

使用 GUID：`21686148-6449-6e6f-744e656564454649`

安装 GRUB 时，一定要仔细确认所选的分区，GRUB 在安装过程中如果发现了 BIOS 引导分区，它会自动覆盖，因此要确保该分区不含有任何有用数据。



#### 安装方法

通常在类 UNIX 系统中用 `grub2-install` 命令来安装 GRUB。`grub2-install` 实际上只是一个脚本，真实的任务是由其它工具如 `grub2-mkimage` 等完成的。

>因此，也可以直接执行这些命令来安装 GRUB，而不用 `grub2-install`，仅在非常熟悉 GRUB 内部结构时才建议这样做。

`grub2-install` 命令会用 `grub2-mkimage` 生成一个 GRUB 内核镜像，将其安装在系统中。

##### 语法

`grub2-install [--boot-directory=DIR] INSTALL_DEVICE`

`--boot-directory=DIR`  指定 GRUB 的安装目录，缺省时用默认值  `/boot`

`INSTALL_DEVICE`  可以是操作系统的设备文件名，或 GRUB 的设备文件名。










### 8.6.2 GRUB 文件构成

GRUB 的文件被分割为三部分：1 级引导程序，1.5 级引导程序，2 级引导程序


#### 1 级引导程序

文件名 `boot.img`，被装进 MBR。


#### 1.5 级引导程序

文件名为 **core.img**，25,389 字节，通常在 DOS 兼容区。

>通常保存在 MBR 与第一分区之间的空白扇区，这个位置一般称为 DOS 兼容区（ `DOS compatibility region`），或 `boot track`，`MBR gap`，`embedding area`。由于技术原因，这一片空间通常不被占用，第一分区的硬盘起始分区通常为 63 扇区，因此留给 1.5 级引导程序 62 个 512 字节的扇区，即 31,744 字节（**32 KB**）的空间。因此这个空间足够大，1.5 级引导程序可以拥有足够丰富的代码，来容纳一些常用的 **文件系统驱动程序**，如 EXT 家族，FAT，NTFS等。

如果 DOS 兼容区被占用，也可以使用文件系统中其他固定的位置来保存 1.5 级引导程序。

>`core.img` 是由 `grub-mkimage` 程序动态生成的 GRUB 内核镜像，来源为 GRUB 内核镜像及不定数量的模块。它通常包含足够多的模块，以实现对 `/boot/grub2` 的访问，从文件系统加载启动菜单、操作系统内核等。模块化的设计使得 GRUB 内核镜像很小，因为通常要把它安装在仅 32K 大小的空间里。

>`diskboot.img` 是做为 `core.img` 内核镜像的第一个扇区来使用的，它会读取内核镜像的其它部分，进而启动 GRUB 内核。因为文件系统尚不可用，因此它会把 `core.img` 的具体位置使用块列表（block list）的格式进行硬编码，以保证 GRUB 能直读取。


#### 2 级引导程序

包含多个实体文件，保存在 `/boot/grub2/` 目录中

>2 级引导的所有文件均位于 `/boot/grub2` 目录和几个子目录中。2 级引导不用镜像文件，而使用 GRUB 运行时 **内核模块**，这些模块位于 `/boot/grub2/i386-pc` 目录，按需加载。

>在 `core.img` 所在扇区之后，第 63 扇区之前，剩余的可用空间不多，不足以容纳其余的 GRUB 文件；

>同时，1.5 级引导已经使得 GRUB 有能力直接访问各种常用的文件系统。因此，2 级引导程序的文件完全可以保存在 EXT 文件系统中，但不可以保存到逻辑卷。于是，2 级文件均被保存在 `/boot/grub2` 目录中。

>注意，`/boot` 目录必须保存在 GRUB 支持的文件系统中，而非任何文件系统。





#### GRUB 常用文件

##### `/boot/grub2/*`

`device.map`	GRUB 的磁盘映射表

`fonts`	引导过程使用的字体

`grub.cfg`	GRUB 的配置文件

`grubenv`	引导期间使用的环境变量

`i386-pc`	GRUB 内核模块目录

`locale`	语系

`themes`	主题画面

##### `/boot/grub2/i386-pc/*`

`acpi.mod`	电源管理模块

`ata.mod`	磁盘模块

`chain.mod`	控制权移交模块

`command.lst`	命令列表，描述每个模块可以通过什么命令来加载

`efiemu32.o`	EFI 模块

`efiemu64.o`	EFI 模块

`efiemu.mod`	EFI 模块

`ext2.mod`	EXT 家族文件系统模块

`fat.mod`	FAT 文件系统模块

`gcry_sha256.mod`	加密模块

`gcry_sha512.mod`	加密模块

`iso9660.mod`	光盘文件系统模块

`lvm.mod`	LVM 文件系统模块

`mdraid09.mod`	软 RAID 模块

`minix.mod`	MINIX 文件系统模块

`msdospart.mod`	MBR 分区表

`part_gpt.mod`	GPT 分区表

`part_msdos.mod`	MBR 分区表

`scsi.mod`	SCSI 相关模块

`usb_keyboard.mod`	USB 键盘模块

`usb.mod`	USB 模块

`vga.mod`	VGA 显卡模块

`xfs.mod`	XFS 文件系统模块

##### GRUB 的镜像

GRUB 由几类镜像文件组成：决定 GRUB 不同的启动方式的镜像，GRUB 内核镜像，及一系列模块，这些模块被用来与 GRUB 内核镜像合并重新生成 `core.img`。










### 8.6.3 GRUB 工作方式

GRUB 有两种截然不同的启动方式：

#### 直接加载

直接加载操作系统内核。

GRUB 允许用户选择引导当前发行版的 **不同的内核**。如果更新内核失败，或某个重要软件发生不兼容问题，该功能可以让用户引导上一版本的内核。

####  链式加载

链式加载另一个引导程序，然后再加载操作系统内核。

链式加载主要用于非 GRUB 原生支持的操作系统。GRUB 默认支持 **多操作系统** 的引导，默认支持引导 Linux 及其它免费操作系统，也可以通过链式加载来引导 Windows 等 **其他操作系统**。

GRUB1 时期，官方使用三个级别来定义不同的启动阶段：1 级，1.5 级，2 级

但到了 GRUB2 时期，官方声明不再使用这三个阶段的命名。但实际上的流程是一样的，因此为了方便理解，我们仍然沿用这个概念。









### 8.6.4 GRUB 文件系统语法

GRUB 中对设备的描述方法与 Linux 系统中的不一样， GRUB 使用特殊的语法来指定 BIOS 可访问的磁盘，因为 BIOS 的限制，GRUB 无法区分 IDE，ESDI，SCSI 或其它的设备。因此用户自己必须清楚 **BIOS 中的设备对应操作系统中的哪个设备**。




#### 设备的描述

`(device[,partmap-name1part-num1[,partmap-name2part-num2[,...]]])`

最外面用 `( )` 括起来，`[ ]` 中的内容为可选。其中 `partmap-name1part-num1` 是 `partmap-name1` + `part-num1` 的组合。

| 硬盘查找顺序 | 在 GRUB 中的代号 |
| :--- | :--- |
| 第一块（MBR） | （hd0） （hd0,msdos1） （hd0,msdos2） （hd0,msdos3）.... |
| 第二块（GPT） | （hd1） （hd1,gpt1） （hd1,gpt2） （hd1,gpt3）.... |
| 第三块 | （hd2） （hd2,1） （hd2,2） （hd2,3）.... |

##### 设备

`device`：设备名取决于磁盘驱动的类型，

* BIOS 和 EFI 磁盘使用 `fd` 或 **`hd`** 加一位数字，从 **0** 开始
* AHCI，PATA，crypto，USB 使用磁盘名称加一串数字
* 虚拟磁盘（Memdisk）和主机（host）只能有一个，因此只用磁盘名称
* RAID，ofdisk，LVM，LDV，virtio，arcdsik 使用磁盘的 intrinsic 名称，加磁盘名称做前缀

如果名称发生冲突则用一串数字做后缀，逗号前面需要转义符。

##### 分区

`part-num` 为设备的 **分区号**，从 **1** 开始

`partmap-name` **分区名**。可选，建议使用，因为同一个磁盘可以包含多种不同类型的映射。

>`/boot/grub2/device.map` 是驱动器映射文件，其内容为 BIOS 识别的驱动器（hd0）与 Linux 设备文件（/dev/sda）的映射。`grub-probe` 等软件会读取该文件来获取映射。

##### 范例

`(hd0,1)`    第一块磁盘，第一分区

`(hd0,msdos1)`     第一块磁盘，第一分区，MBR 格式

`(hd0,gpt1)`      第一块磁盘，第一分区，GPT 格式

`(hd0)`	第一块磁盘整个磁盘

`(hd0,msdos5)`	第一块磁盘的第一个逻辑分区

假设当前系统仅有一块 SATA 硬盘，其第一个逻辑分区，在 Linux 中的文件名为 `/dev/sda5`，在 GRUB 中的磁盘代号为 `(hd0,msdos5)` 或 `(hd0,5)`





#### 文件的描述

可以用两种方式来指定文件，通过 **绝对文件名** 和 **块列表**。

##### 绝对文件名

绝对文件名：使用 **`/`** 来连接 **设备** 和 **文件**。

`(hd0,1)/boot/grub/grub.cfg` 表示第一块磁盘第一分区中的 `/boot/grub/grub.cfg` 文件。

如果省略了设备名，GRUB 会使用其配置文件中的根设备（`set root=(hd1,1)`），则 `/boot/kernel` 等同于 `(hd1,1)/boot/kernel`。

在 ZFS 文件系统中，设备名的格式为 `volume@[snapshot]`，因此 `/rootvol@snap-129/boot/grub/grub.cfg` 代表 `rootvol` 卷中的，名为 `snap-129` 的快照中的， `/boot/grub/grub.cfg` 文件。卷标后面的 `@` 是必须要有的，快照名可以省略。

##### 块列表

块列表（Block List）用于 **描述没有出现在操作系统中的文件**，如引导程序，

语法：

 `[位移]+长度[，[位移]+长度]...`

`0+100` 表示 GRUB 应该从 0 开始，读 100 个块，即 0 ~ 99 块

`200+1` 表示第 200 块

`300+300` 表示从第 300 块一直读取到第 599 块。

* 如果省略 “位移”，则 GRUB 认为是从 `0` （第 1 块，MBR 或 VBR）开始。

* 如果块列表中没有指定设备文件名，GRUB 自动使用 GRUB 配置文件中的根设备。如根设备为`(hd0,2)` ，则 `+1` 表示 `(hd0,2)+1`，即 GRUB 会读取第一块磁盘的第 2 个分区的 VBR。





#### GRUB 配置文件

`grub.cfg` 是 GRUB 的内核配置文件，**不能手动修改**，只能 **使用 `grub2-mkconfig` 命令来创建**。

##### `grub.cfg` 的组成

* 设置环境变量
* 设置默认菜单
* 引导菜单设置

##### 菜单参数

每一个菜单都通过 `menuentry` 命令来指定参数：

`menuentry title [--class=class …] [--users=users] [--unrestricted] [--hotkey=key] [--id=id] [arg …] { command; … }`

`title`	此项菜单的名字

`--class`	使用该选项可以把菜单分成不同的类别，每种类别的菜单其显示样式可以单独设置

`--users`	仅特定用户才能访问该菜单

`--unrestricted`	所有用户都可以访问该菜单

`--hotkey`  为菜单设置快捷键，可以是字母、回退、TAB、删除键

`--id`  将菜单与某个由 ASCII 码组成的唯一的 ID 关联

`{ command; … }` 该项菜单要执行的所有命令用 `{ }` 括起来

在使用 `menuentry` 命令时，其后面携带的，从 `tilte` 开始的所有的参数，都会被做为 **位置参数** 传递，而 `title` 永远是 $1。

##### `menuentry` 中的命令列表

###### 加载模块

通常是内核文件所在磁盘、分区、文件系统的 **驱动程序**，及 **解压缩软件**，如 `load_video, insmod gzio, insmod part_gpt, insmod xfs` 等。

###### 指定 grub.cfg 所在分区

`set root='hd0,gpt2'`

###### 加载 Linux 内核

本菜单条目要加载的 Linux 内核的文件名以，及执行内核所用的参数。

`linux16 /vmlinuz-... root=/dev/mapper/centos-root ... ` root 指根目录所在的设备，可以用设备文件名、 UUID 或 LABEL 来表示。

该项指定的内核文件名为 **相对路径**，需要与上一项 `set root=` 一起组成 Linux 内核文件真实路径。

GRUB 对 Linux 内核文件绝对路径的判断过程：

如果当前系统没有 `/boot` 分区，只有 `/` 分区：

`/boot/vmlinuz-xxx` --> `(/)/boot/vmlinuz-xxx` --> `(hd0,msdos1)/boot/vmlinuz-xxx`

如果 /boot 是独立分区，则 Linux 内核文件名为：

`/boot/vmlinuz-xxx` --> `(/boot)/vmlinuz-xxx` --> `(hd0,msdos1)/vmlinuz-xxx`

###### 加载 initrd 镜像

`initrd16 /initramfs-3.10...` 为 INITRAMFS 镜像文件，该文件名也需与上面的 `set root=` 组合成绝对路径







#### 修改  GRUB 配置

修改 `/etc/default/grub` 和 `/etc/grub.d/*`，然后使用 `grub2-mkconfig` 命令重建 `grub.cfg`。



##### 配置文件

`/etc/default/grub` 是 GRUB 的主要环境配置文件

###### 倒计时秒数

`GRUB_TIMEOUT=0`	不等待用户选择，直接执行默认菜单

`GRUB_TIMEOUT=30`	等待 30 秒，之后执行默认菜单

`GRUB_TIMEOUT=-1`	不限时等待，用户选择才能继续

###### 菜单显示方式

`GRUB_TIMEOUT_STYLE=menu`	显示菜单 -- 倒计时 -- 启动默认菜单

`GRUB_TIMEOUT_STYLE=countdown`	（显示秒数）倒计时 -- 启动默认菜单

`GRUB_TIMEOUT_STYLE=hidden`	（隐藏秒数）倒计时 -- 启动默认菜单

如果未设置此项目或设置为 `menu`，GRUB 会 **显示菜单**，并倒计时。设置为 `countdown` 或 `hidden` 会 **隐藏菜单**。

设置为 `countdown` 或` hidden` 时，GRUB 会 **隐藏菜单**，倒计时期间按 **ESC** 键可以 **显示菜单**，同时停止倒计时，直到用户做出选择。

###### 选择终端输出设备

可以选择多个设备，用空格分隔。

`GRUB_TERMINAL_OUTPUT="console"` 最常用

其它选择还有 “serial, gfxterm, vga_text”。

###### 默认引导菜单

`GRUB_DEFAULT` 指定默认引导菜单，默认值为 0。

* `GRUB_DEFAULT=菜单序号`： GRUB 生成的菜单中的第几个为默认菜单，从 `0` 开始，1 为第 2 个菜单
* `GRUB_DEFAULT=saved`： 当 `GRUB_SAVEDEFAULT` 为 `true` 时，GRUB 会记住用户上次的选择
* `GRUB_DEFAULT=菜单标题`： 即 menuentry 中的 `--id` 指定的参数

###### 指定内核的运行参数

`GRUB_CMDLINE_LINUX`

如果希望在内核启动时加入额外的参数，用此项设置。

```
GRUB_CMDLINE_LINUX="..... crashkernel=auto rhgb quiet elevator=deadline"
```

###### 是否允许 GRUB 查找其它操作系统

`GRUB_DISABLE_OS_PROBER`

设置为 `true` 时，`grub-mkconfig` 命令会尝试用外部程序 `os-prober` 来寻找安装在同一系统中的其它操作系统，并为其创建菜单。

修改完 `/etc/default/grub` 文件之后，必须使用 `grub2-mkconfig` 来重新生成 `grub.cfg`。



##### `/etc/grub.d/*` 目录中的配置文件

`grub-mkconfig` 命令会分析 `/etc/grub.d/` 目录中的文件，按顺序执行各文件，来 **创建 `grub.cfg`**。

该目录中的常用文件：

###### `00_header`

该脚本 **读取 `/etc/default/grub`** 中的参数 。

###### `10_linux`

在 `/boot` 目录中寻找 linux 内核文件，**为每一个内核文件生成一个菜单**，读取内核所需的文件系统模块与参数。

###### `30_os-prober`

**寻找其他分区中的操作系​​统**，为其生成菜单。

###### `40_custom`

**用户自定义菜单**。





##### 自定义菜单

通常只修改 `40_custom` ，保留另外三个。

###### 引导指定内核

从 `grub.cfg` 把菜单复制到 `40_custom` 中，加以修改。

###### 移交控制权

通过 `chainloader` 命令来实现。先要加载目标分区的文件系统模块和 `chainloader` 模块。

需指定两个参数：**目标分区** 和引导程序所在的 **块列表**

###### 范例

```
menuentry 'Go to Windows 7' --id 'win7' {
        insmod chain      # 加载 chainloader 模块
        insmod ntfs       # 加载 windows 文件系统模块
        set root=（hd0,msdos2）  # 第一块磁盘第二分区
        chainloader +1    # 读取 VBR 中的引导程序
}

menuentry 'Go to MBR' --id 'mbr' {
        insmod chain
        set root=（hd0）	# 第一块磁盘
        chainloader +1		# 读取 MBR 中的引导程序
}
```





##### 指定引导参数

在引导菜单界面，在某个菜单上按 **`e`** 键会进入菜单编辑状态：

此时屏幕分成上下两个部分，上方为编辑区，用方向键移动光标，直接编辑内容。

屏幕下方画面为简要帮助说明，取消编辑用 `[crtl]+c` 或 `[esc]` 键，确认修改用 `[crtl]+x ` ，系统会使用修改后的设置来引导。

###### 范例

通过临时修改菜单参数，让系统进入救援模式。

在菜单上按 `e` 键之后，找到 `linux16` 那一行，在行尾加上 `systemd.unit=rescue.target`，按 `[crtl]+x` 进入系统，即进入救援环境。
















### 8.6.5 多操作系统引导

每个操作系统上都可以安装 GRUB，都可以存在 GRUB 的文件。但MBR 决定了 2 级引导会加载哪个文件系统上的 GRUB。

因为 `core.img` 中指定了根设备，从而决定了 GRUB 文件的绝对路径，因此 1.5 级引导程序会据此来寻找 GRUB 内核及配置文件，从而决定显示哪个分区上的 GRUB 菜单。
{: .notice--info}

每个文件系统中的 GRUB 可以有完全不同的配置，显示完全不同的菜单，不同的默认引导操作系统。

要实现多操作系统的引导，可以通过以下两种方法来实现：



#### 重装 GRUB

😈 重装 GRUB 的目的实际上是更新 `core.img` 中的 GRUB 根设备，使其指向用户需要的分区，让 MBR 知道下一步应该去哪个分区的 VBR 读取 GRUB。

##### 范例

```
~]# fdisk -l /dev/vda
   Device Boot      Start         End      Blocks   Id  System
/dev/vda1            2048    10487807     5242880   83  Linux
/dev/vda2   *    10487808   178259967    83886080    7  HPFS/NTFS/exFAT
/dev/vda3       178259968   241174527    31457280   83  Linux
```

`/dev/vda1`，`/dev/vda3` 是 CentOS 7，`/dev/vda2` 是 Windows 7。

安装顺序：`/dev/vda1`	>	`/dev/vda2`	>	`/dev/vda3`

安装完  `/dev/vda3` 之后，系统会默认引导 `/dev/vda3` 的 CentOS 7。此时 MBR 会去读取 `(/dev/vda3)/boot/grub/grub.cfg`。

要想让系统默认从 `/dev/vda1` 引导，MBR 的引导程序应该读取 `(/dev/vda1)/boot/grub/grub.cfg`。

所以，首先要进入 `/dev/vda1` 文件系统，实现途径可有三种：

* 利用 CentOS 7 自动生成 `/dev/vda1` 的引导菜单
* 在 `/dev/vda3` 中使用 **`chroot`** 来进入 `/dev/vda1`
* 用修复光盘来读取 `/dev/vda1`

用以上任一方法进入 `/dev/vda1` 系统后，修改 `/etc/default/grub` 及 `/etc/grub.d/40_custom` 完成菜单的设置，再用 `grub-mkconfig -o /boot/grub/grub.cfg` 创建新的配置文件，最后 `grub2-install /dev/vda` 安装新生成的 `core.img` ，MBR 便会默认读取 `/dev/vda1` 中的配置文件。



#### 增加菜单

如果操作系统均为 GRUB 支持，则可以直接手动增加引导菜单。

当前 GRUB 只有一个菜单，要想增加两个菜单，分别读取 MBR 和 `/dev/vda4` 的引导程序

```
~]# vim /etc/grub.d/40_custom		# 增加自定义菜单

menuentry 'Goto MBR' {
        insmod chain
        insmod part_gpt
        set root=（hd0）
        chainloader +1
}

menuentry 'Goto /dev/vda4' {
        insmod chain
        insmod part_gpt
        set root=（hd0,gpt4）
        chainloader +1
}

~]# grub2-mkconfig -o /boot/grub/grub.cfg
```























### 8.6.6 以图形方式显示菜单

先修改 `/etc/default/grub` 文件

```
GRUB_TERMINAL=gfxterm       # 设置用图形界面显示菜单
GRUB_GFXMODE=1024x768x24    # 图形界面的分辨率、色深
GRUB_GFXPAYLOAD_LINUX=keep  # 保持上面的参数的设置，不要使用文字模式
```

重新创建配置文件

```
~]# grub-mkconfig -o /boot/grub/grub.cfg
```








### 8.6.7 给菜单加密码

对于通过物理方式连接到控制台的用户，引导程序默认对所有人开放。但有些环境需要对菜单的使用者进行认证，GRUB 可以针对每项菜单单独设置认证。

GRUB 把用户同样分成两类，超级用户和普通用户。

GRUB 中设置的用户名与 Linux 的用户无关，仅限 GRUB 使用。
{: .notice--warning}


#### SUPERUSERS

环境变量 `superusers` 支持 **用户列表**，可以用 `空格、逗号、分号、管道、&` 之一分隔，该参数指定的超级用户有权使用 “GRUB 命令行，编辑菜单参数，执行任何菜单”。

* 如果 `superusers` 指定了用户，则 “命令行的使用，菜单项的编辑” 自动变成 **只对超级用户开放**
* 如果该项设置为 **空**，则 **禁止任何人** 使用 GRUB 命令行和编辑菜单。



#### Users

在 `menuentry` 中，用 `--user` 指定的用户有权 **执行该菜单**。

`--user` 参数同样支持 **用户列表**。

如果菜单中使用了 `--unrestricted` 参数，则该菜单不受限，所有人可执行。

如果菜单中 `--user` 参数为 **空**，则只有超级用户有权执行该菜单。

如果菜单中 `--user` 参数指定了用户，则只有该用户和超级用户有权执行该菜单。


#### 设置密码

可以用 `password` 和 `password_pbkdf2` 命令来定义用户。

* `password`  以明文方式设置，需要 `grub.cfg` 来帮助加密；
* `password_pbkdf2`  使用基于密码的密钥函数来设置密码的哈希值，需要使用 `grub2-mkpasswd-pbkdf2` 来生成密码哈希值。

```
~]# grub2-mkpasswd-pbkdf2
Enter password:    # 输入密码
Reenter password:  # 再次输入
PBKDF2 hash of your password is grub.pbkdf2.sha512.10000.9A2EBF7A1F484...
#                                                           ^^^^^^^^^^^^^ 这之后的都是密码
```

##### 实施方法

###### 设定用户及密码

在 `/etc/grub.d/` 目录，创建一个名为 `01_users` 的文件，在该文件设置密码参数。

```
~]# vim /etc/grub.d/01_users

cat << eof
set superusers="neo"
password_pbkdf2 neo grub.pbkdf2.sha512.10000.9A2EBF7A1F484904FF3681F97AE22D58DFBFE65A...
password_pbkdf2 dmtsai grub.pbkdf2.sha512.10000.B59584C33BC12F3C9DB8B18BE9F557631473AED...
eof

~]# chmod a+x /etc/grub.d/01_users
```

之所以使用 `cat` 命令，是因为 `/etc/grub.d/` 目录中的文件是脚本，需要有可执行权限。因此不能直接把密码写在文件中，而是通过 `cat` 或 `echo` 等方式来输出。


###### `/etc/grub.d/*` 各文件与菜单权限

* `01_users` 文件中设置了 `set superusers="neo"`，则菜单中如果没有 `--unrestricted` 参数，非管理员就无权执行或修改菜单。

* `10_linux` 文件中的默认设置为 Linux 菜单不做限制，所有人都可执行。不建议直接修改该文件。

```
CLASS="--class gnu-linux --class gnu --class os --unrestricted"
```

* `40_custom` 中，可以针对每个 menuentry 来单独设置。





























## 8.7 系统启动常见问题

多数故障可以用救援模式来解决。




### 8.7.1 忘记 root 密码

只要想办法 **进入系统**，**挂载根文件系统** ，就可以重新设置 root 密码了。

在 `systemd` 的管理机制中，默认的救援模式无法直接获取根的访问权限。可以使用内核参数 `rd.break` 来处理。`rd.break` 是在 RAM Disk 中的操作系统状态，无法直接获取真正 Linux 系统操作环境，需要借助 `chroot` ，还需要处理 SELinux 的限制。


#### 使用 `rd.break` 参数

在引导菜单上按 `e` 进入编辑模式，在 `linux16` 项目的行尾加上 `rd.break` 参数。

按 `[crtl]+x` ，系统会进入 RAM Disk 环境，即虚拟根文件系统，真正的系统会被挂载到 `/sysroot` 目录。

```
Generating "/run/initramfs/rdsosreport.txt"
Enter emergency mode. Exit the shell to continue.
Type "journalctl" to view system logs.
You might want to save "/run/initramfs/rdsosreport.txt" to a USB stick or /boot
after mounting them and attach it to a bug report.

switch_root:/#         # 不用密码即可获取 root 权限
switch_root:/# mount   # 检查挂载点，应该有 `/sysroot`
/dev/mapper/centos-root on /sysroot type xfs （ro,relatime,attr,inode64,noquota）
switch_root:/# mount -o remount,rw /sysroot  # 将其挂载为可读写
switch_root:/# chroot /sysroot               # 切换到真正根目录
sh-4.2# echo "your_root_new_pw" | passwd --stdin root     # 修改 root 密码
sh-4.2# touch /.autorelabel                  # 重打 SELinux 标签
sh-4.2# exit
switch_root:/# reboot
```

##### `chroot 目录`

把根目录 “临时” 切换到指定目录

因此，`/sysroot` 临时被作为根目录，因为这是真正的根目录，所以可以用来处理文件系统，进行用户管理。

##### `/.autorelabel`

在 `rd.break` 的 RAM Disk 环境下，没有启用 SELinux ，在修改了 `/etc/shadow` 之后，该文件的 SELinux 安全上下文会被取消。系统启动时如果不恢复 SELinux 上下文，会导致无法登陆（当 SELinux 为强制模式时）。

加上 `/.autorelabel` 以后，系统在启动时，将自动重新为每个文件打标签，之后会自动删除 `/.autorelabel` 文件。

##### 另一个方法

在 `rd.break` 模式下，修改完 root 密码后，将 `/etc/selinux/config` 中的 SELinux 类型改为 `permissive`。

重启后，用 root 身份执行 `restorecon -Rv /etc` 仅修改 `/etc/` 目录中的文件。

把 `/etc/selinux/config` 恢复为 `enforcing`，然后执行 `setenforce 1` 即可。


#### 直接启动 bash

可以让系统在启动时直接启动 bash，编辑菜单中 linux16 项目，在行尾增加 `init=/bin/bash` 参数。启动后系统会直接进入 bash，不需要 root 密码，有 root 权限。

因为把 PID=1 的程序换成了 bash，所以要操作该系统还需 remount 根目录，否则无法更改文件系统。

```
bash-4.2# mount -o remount,rw /
bash-4.2# echo "newpassword" | passwd --stdin root
Changing password for user root.
passwd: all authentication tokens updated successfully.
```

由于是最简单的 bash 环境，所以连 PATH 都只有 `/bin` 而已，无法使用 reboot 命令，同时，由于没有 systemd，所以即使用绝对路径来执行 reboot 也无效，此时只能按 reset 或强制关机，重启。

由于 SELinux 上下文未写入，此时系统仍然无法登陆，重启后，进入 `rd.break` 模式，然后把 SELinux 临时修改为 permissive 模式，等顺利用 root 登陆后，用 restorecon -Rv /etc 测试，看是否 SELinux 可以正常工作，然后重新启用 SELinux。

```
~]# getenforce
Permissive

~]# restorecon -Rv /etc
restorecon reset /etc/shadow context system_u:object_r:unlabeled_t:s0
   ->system_u:object_r:shadow_t:s0
restorecon reset /etc/selinux/config context system_u:object_r:unlabeled_t:s0
   ->system_u:object_r:selinux_config_t:s0

~]# vim /etc/selinux/config
SELINUX=enforcing

~]# setenforce 1
```







### 8.7.2 因文件系统错误而无法启动

如果因为设置错误导致无法启动，最常见的是 `/etc/fstab` 设置错误，尤其在 `Quota / LVM / RAID` 操作时，最容易写错参数，未使用 `mount -a` 来测试挂载，直接重启就会出错。

此时应按提示输入 root 密码来获取 bash，用 `mount -o remount,rw /` **以可读写方式挂载根目录**。

非正常关机也可能导致文件系统不一致，可能会出现相同的问题。如果是扇区错乱，上图第二行， fsck 告知 `/dev/md0` 出错， 此时应用 `fsck.ext3` 检测 `/dev/md0`，如果系统发现错误，并显示 `clear [Y/N]` 时，键入 “ y ”来修复。

如果是 XFS 文件系统，要使用 `xfs_repair` 命令来修复。过程可能会很长，而且如果分区上的文件系统有太多数据损坏，即使 `fsck` 或 `xfs_repair` 完成后，也可能因为伤及系统盘，而导致某些关键系统文件数据的损坏，仍然无法进入系统。

此时应该先把系统中的重要数据复制出来，然后重新安装，并且检查硬盘是否损坏。
