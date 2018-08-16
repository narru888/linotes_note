var store = [{
        "title": "Linux 基础 - 1. 计算机基础",
        "excerpt":"1.1 计算机的概念 “接受用户 输入 命令与数据，经由中央处理器的数学与逻辑单元 运算 处理后， 以 产生 或储存成有用的 信息”。 1.1.1 整体架构 五大单元： 输入 单元 CPU 控制 单元：协调周边元件及各单元间的工作 CPU 算数逻辑 单元：程序运算与逻辑判断 内存：在CPU与其它单元之间 传递 数据 输出 单元 基本上数据都是 流经内存 再转出去的 数据会流进/流出内存是因为 CPU 所发布的 控制指令 CPU 实际要处理的数据则 完全来自于内存 1.1.2 CPU 的架构 CPU 内部含有一些 微指令，指令集的设计是根据不同的 CPU架构 进行的。 精简指令集 RISC / Reduced Instruction...","categories": ["linux"],
        "tags": ["linux"],
        "url": "https://linotes.netlify.com/linux/computer/",
        "teaser":null},{
        "title": "Linux 基础 - 2. Linux 简介",
        "excerpt":"2.1 Linux 简介 2.1.1 操作系统 Linux 就是一套操作系统。 不同的硬件支持不同的函数，所以同一套操作系统无法在不同硬件平台上运行。如果想让 x86 上面跑的操作系统也能够在 Power CPU 上运行，需要“软件移植”。 Windows操作系统只能在 x86 的个人计算机上面运行。Linux 具有 可移植性。 Linux 提供了一个完整的操作系统当中最底层的硬件控制与资源管理的完整架构， 该架构沿袭 Unix 的传统，稳定而强大。” 2.1.2 Unix Unix 的前身是由贝尔实验室（Bell lab.）的 Ken Thompson 利用组合语言写成的， 后来在 1971-1973 年间由 Dennis Ritchie 以 C 语言进行改写，才称为 Unix。 1977 年由 Bill Joy 发布 BSD （Berkeley Software 套件），这些称为 Unix-like...","categories": ["linux"],
        "tags": ["linux"],
        "url": "https://linotes.netlify.com/linux/intro/",
        "teaser":null},{
        "title": "Linux 基础 - 3. 存储",
        "excerpt":"3.1 磁盘 磁盘是一个物理概念。磁盘的种类和分区的类型，直接影响 I/O 性能。 3.1.1 磁盘的物理结构 盘片，机械手臂，磁头，主轴马达 3.1.2 盘片的物理组成 磁道：当磁盘旋转时，磁头若保持在一个位置上，则每个磁头都会在磁盘表面划出一个圆形轨迹，这些圆形轨迹就叫做磁道 扇区：磁盘上的每个磁道被等分为若干个弧段，这些弧段便是硬盘的扇区。它是最小的物理存储单位 柱面：不同盘片、同一磁道组成的圆柱 3.1.3 设备文件名 系统按照检测到的磁盘顺序来决定设备文件名，与插槽号无关。 USB 磁盘：/dev/sdc 实体磁盘 /dev/sd[a-p] 分区 /dev/sda[1-128] 虚拟机 /dev/vd[a-p] 软RAID /dev/md[0-128] LVM /dev/VGNAME/LVNAME 3.1.4 引导区 Boot Sector，引导区，是数据存储设备的一个区域，其中包含机器代码，会被固件加载到内存中。 引导区的目的：引导计算机来加载存储设备中的程序或操作系统。 主要分两类：MBR、VBR MBR Master Boot Record 主引导记录，是 已分区 储存设备的 第一个扇区。 它在硬盘上的三维地址为（柱面，磁头，扇区）＝（0，0，1）。 MBR 是由分区程序（如 gdisk）生成 的，不依赖任何操作系统。 在深入讨论主引导扇区内部结构的时候，MBR 也特指其开头的 446...","categories": ["linux"],
        "tags": ["分区","分区表","linux","fdisk","gdisk","raid"],
        "url": "https://linotes.netlify.com/linux/storage/",
        "teaser":null},{
        "title": "Linux 基础 - 4. 文件系统基础",
        "excerpt":"文件系统用于控制数据如何被保存和读取。不同的文件系统，其存取的机制不同。 文件系统是指整体目录结构（目录树），用于组织计算机系统中的文件。 即保存的数据（文件、目录等）是如何被组织和管理的。包括如何分配磁盘空间，如何管理元数据。 Linux 中，一切皆文件。 Linux 支持的文件系统： 传统文件系统：EXT2 / minix / MS-DOS / FAT （用 vfat 模块） / iso9660 （光盘） 日志式文件系统： EXT3 / EXT4 / ReiserFS / Windows’ NTFS / IBM’s JFS / SGI’s XFS / ZFS 网络文件系统： NFS / SMBFS 4.1 重要概念 4.1.1 BLOCK 块。 操作系统读取硬盘时，不会一个个扇区地读取，效率太低，而是 一次性连续读取多个扇区，即一次性读取一个块。这种由多个扇区组成的块，是 文件存取的最小单位。 每个块通常为...","categories": ["linux"],
        "tags": ["linux","文件系统","格式化","挂载","mount","校验"],
        "url": "https://linotes.netlify.com/linux/filesystem/",
        "teaser":null},{
        "title": "Linux 基础 - 5. EXT 与 XFS 文件系统",
        "excerpt":"5.1 EXT2 文件系统 The 2nd Extended File System. 5.1.1 EXT2 的数据结构 EXT2 文件系统格式化时，Inode 与块的数量就 确定 了，每个块都有自己的编号，以便区分和定位。需要时可以用 resize2fs 等命令修改文件系统大小 。 块 EXT2 所支持的块大小为 1K，2K 及 4K 。 Block 大小 1 KB 2 KB 4 KB 最大单一文件限制 16 GB 256 GB 2 TB 最大文件系统总容量 2 TB 8 TB 16 TB 📕虽然 EXT2...","categories": ["linux"],
        "tags": ["ext2","ext3","ext4","linux","ext","xfs"],
        "url": "https://linotes.netlify.com/linux/extxfs/",
        "teaser":null},{
        "title": "Linux 基础 - 6. 用户管理",
        "excerpt":"6.1 基本概念 6.1.1 用户 UID 系统为每一个用户分配一个独一无二的号码，UID。 Linux 不认识用户名称，只能通过 UID 来识别用户。 UID 划分 根据用户身份不同，把 UID 大致划分了几个范围： 管理员UID = 0，若要给普通用户赋予 root 权限，将其 UID 改为 0 即可。 系统用户UID = 1 ~ 999。 1 ~ 200 为系统默认创建的系统用户。 201 ~ 999 为用户创建的系统用户。 普通用户UID = 1000 ~ 60000 很多用户是系统正常运行所必须要的，简称 系统用户，它们用于启动网络服务或后台服务，需要的权限较小，因此通常它们无法登陆。 GID 每个用户可以属于若干个组，创建用户时系统会默认创建同名的组，该用户默认属于该组。 系统同样也只能通过 GID 来识别组。 家目录...","categories": ["linux"],
        "tags": ["linux","用户","组"],
        "url": "https://linotes.netlify.com/linux/user/",
        "teaser":null},{
        "title": "Linux 基础 - 7. 访问控制",
        "excerpt":"7.1 Linux 文件 7.1.1 Linux 文件类型 文件类型是文件元数据之一，在 Inode 中 占 4 位。 普通文件、块设备、字符设备、管道、硬链接、套接字、目录文件，用不同符号表示： 文件类型 符 说明 创建 普通文件 - 文本文件、二进制文件、图片、压缩包 touch,vi,重定向符号 块文件 b 硬件文件，多在/dev fdisk 或建虚拟分区 字符设备文件 c 提供输入输出的串流，键盘、鼠标   管道文件 p FIFO: First In, First Out mkfifo 链接文件 l * -&gt; **** ln -s 套接字文件 s     目录文件...","categories": ["linux"],
        "tags": ["权限","linux","acl","切换用户","su","sudo"],
        "url": "https://linotes.netlify.com/linux/accontrol/",
        "teaser":null},{
        "title": "Linux 基础 - 8. Linux 启动流程",
        "excerpt":"8.1 基础概念 8.1.1 BIOS Basic Input/Output System。 BIOS 是一种固件接口，它在控制系统启动的第一步的同时，还对各种外设提供最低层的接口。 在装有 BIOS 的 x86 系统上，BIOS 程序代码是刷写在只读存储器 ROM 中的，因此始终可用。系统启动时，CPU 会从系统内存最末端查找 BIOS 程序代码，并执行。 8.1.2 UEFI UEFI，Unified Extensible Firmware Interface 对于基于 UEFI 的 x86 系统，和 BIOS 一样，UEFI 也是用于控制启动过程的，并在系统固件与操作系统之间提供一个接口。 与 BIOS 不同的是，它有自己的独立于 CPU 的架构，以及其自己的设备驱动程序。UEFI 可以 加载分区，读取特定文件系统。 8.1.3 BIOS vs UEFI BIOS 与 UEFI 区别 比较项目...","categories": ["linux"],
        "tags": ["linux","启动"],
        "url": "https://linotes.netlify.com/linux/bootstrap/",
        "teaser":null},{
        "title": "Linux 基础 - 9. 内核简介",
        "excerpt":"9.1 内核 9.1.1 系统调用 System Call 系统调用，指运行在用户空间的进程 向内核发出的请求，请求使用内核提供的 服务。 系统调用是操作系统中的 最小功能单位，运行在 内核空间。 系统调用提供用户进程与操作系统之间的 接口，使上层应用能够 访问到内核的资源。 大多数系统交互式操作需求在内核态执行，如设备 I/O 操作、创建进程、进程间通信。 要完成一个应用程序的功能，通常要通过多个系统调用来实现。 常见的系统调用 文件子系统调用：open()，close()，read()，write()，chmod()，chown() 进程控制调用：fork()，exec()，exit()，wait()，brk()，signal()函数库 系统调用和普通库函数调用非常相似，只是系统调用由操作系统内核提供，运行于内核态，而 普通的库函数调用 由函数库或用户自己提供，运行于用户态。 公用函数库 实现了对系统调用的 封装，将简单的业务逻辑接口呈现给用户，方便用户调用。 典型实现 Linux 的系统调用通过 int 80h 实现，用系统调用号来区分入口函数。 操作系统实现系统调用的过程 应用程序调用库函数（API）； API 将系统调用号存入 EAX，然后通过中断调用使系统进入内核态； 内核中的中断处理函数根据系统调用号，调用对应的内核函数（系统调用）； 系统调用完成相应功能，将返回值存入 EAX，返回到中断处理函数； 中断处理函数返回到 API 中； API 将 EAX 返回给应用程序。应用程序调用系统调用的过程 把系统调用的编号存入...","categories": ["linux"],
        "tags": ["系统调用","中断","特权级","用户态","内核态","虚拟内存","用户空间","内核空间","linux"],
        "url": "https://linotes.netlify.com/linux/kernel/",
        "teaser":null},{
        "title": "Linux 基础 - 10. 进程",
        "excerpt":"对于操作系统而言，进程是核心之核心，整个现代操作系统的根本，就是以进程为单位在执行任务。 10.1 进程的概念 进程，是具有一定独立功能的程序关于某个数据集合上的一次运行活动，是系统进行资源分配和调度的一个独立单位，是操作系统结构的基础。它的执行需要系统分配资源、创建实体之后，才能进行。 进程是程序的一个执行实例 进程是正在执行的程序 进程是能分配处理器并由处理器执行的实体对于操作系统而言，进程是核心之核心，整个现代操作系统的根本，就是以进程为单位在执行任务。系统的管理架构也是基于进程层面的。 进程是独立的任务，每个任务都有自己的权利和责任。 每个单独的进程都运行在 自己的虚拟地址空间 中，除了通过安全的、内核管理的机制外，不能够与另一个进程交互。如果一个进程崩溃，它不会导致系统中的另一个进程崩溃。每个进程只能 执行自己的代码 和 访问自己的数据及栈区。 10.1.1 进程使用的资源 在进程的生命周期中，它将使用许多系统资源： 使用系统中的 CPU 来运行其指令，使用 物理内存 来保存进程及其数据 在 文件系统 中打开并使用文件 直接或间接地使用 物理设备Linux 必须跟踪进程本身和它拥有的系统资源，以便能够公平地管理所有进程。 每一个任务（进程）被创建时，系统会为它分配存储空间等必要资源，然后在内核管理区为该进程创建管理节点，以便后来控制和调度该任务的执行。 进程真正进入执行阶段，还需要获得 CPU 的使用权，这一切都是操作系统掌管着，也就是所谓的调度，在各种条件满足（资源与 CPU 使用权均获得）的情况下，启动进程的执行过程。 除 CPU 而外，一个很重要的资源就是存储器了，系统会为每个进程分配独有的存储空间，当然包括它特别需要的其它资源，比如写入时外部设备是可使用状态等等。 10.1.2 进程的类型 有些进程是与终端关联的，而有些不是。 用户进程 User Process 系统中的大部分进程都是用户进程，这类进程是由普通用户初始化的，运行于用户空间。除非进程运行时被授予特殊权限，普通用户进程对 “处理器或系统中不属于启动进程的用户的文件” 没有特殊访问权限。 守护进程 Daemon Process 守护进程被设计于...","categories": ["linux"],
        "tags": ["process","linux"],
        "url": "https://linotes.netlify.com/linux/process/",
        "teaser":null},{
        "title": "Linux 基础 - 11. 线程",
        "excerpt":"11.1 线程 11.1.1 线程的概念 Thread 随着技术发展，在执行一些细小任务时，本身无需分配单独资源时（多个任务共享同一组资源即可，比如所有子进程共享父进程的资源），进程的实现机制依然会繁琐的将资源分割，这样造成浪费，而且还消耗时间。于是就有了专门的多任务技术被创造出来 —— 线程。 进程是一个程序运行的时候被 CPU 抽象出来的，一个程序运行后被抽象为一个进程。但是线程是从一个进程里面分割出来的，由于 CPU 处理进程的时候是采用 时间片轮转 的方式，所以要把一个大个进程给分割成多个线程。 实体：线程是进程的一个实体，是 CPU 调度和分派的基本单位，它是比进程更小的、能独立运行的基本单位，是 真正的执行实体。 与进程关系：为了让进程完成一定的工作，进程必须至少包含一个线程。一条线程指的是进程中一个 单一顺序的控制流，线程是属于进程的，线程运行在进程空间内。当进程退出时，该进程所产生的线程都会被强制退出并清除。 资源：线程在不需要独立资源的情况下就可以运行。如此一来会极大节省资源开销，以及处理时间。线程自己基本上不拥有系统资源，只拥有一点在运行中必不可少的资源（如程序计数器，一组寄存器和栈），但是它可与同属一个进程的其他的线程共享进程所拥有的全部资源。对于一些 “要求同时进行，并且又要共享某些变量的并发操作”，只能用线程，不能用进程。线程有 自己的堆栈和局部变量，但线程之间没有单独的地址空间，一个线程死掉就等于整个进程死掉。 线程的操作：创建、终止、同步（join、block）、调度、数据管理、进程交互。线程若要 主动终止，需要调用 pthread_exit() 函数 ，主线程需要调用 pthread_join() 来回收，前提是该线程没有被 detached。 父子线程：父线程不会对其创建的子线程进行维护，子线程也不知道自己的爹是谁。一个线程可以创建和撤销另一个线程。 多线程：同一进程中的多条线程将 共享 该进程的 相同地址空间，可以与同进程中的其他线程 共享数据，但拥有 自己的栈空间，拥有 独立的执行序列。一个进程中可以 并发多个线程，每条线程并行执行不同的任务。大多数软件应用中，线程的数量都不止一个。多个线程可以互不干扰地并发执行，并共享进程的全局变量和堆的数据。 引入线程带来的主要好处 在进程内 创建、终止线程 比创建、终止进程要 快 同一进程内的 线程间切换 比进程间的切换要 快,尤其是用户线程间的切换。从堆栈的角度理解线程...","categories": ["linux"],
        "tags": ["process","thread","线程","进程","linux"],
        "url": "https://linotes.netlify.com/linux/thread/",
        "teaser":null},{
        "title": "Linux 基础 - 12. 信号",
        "excerpt":"12.1 信号的概念 全称为 软中断信号，也被称为软中断，简称信号。 信号是发送给进程的软中断，操作系统用信号来通知正在运行的程序，发生了意外情况。如引用了不可用的内存地址，或异步事件（如电话断线）。 信号本质上是在软件层次上 对硬件中断机制的一种模拟。 一个 进程收到一个信号 与 处理器收到一个中断请求 可以说是 一样 的。 信号用于警告意外事件的发生，这些事件会 生成 或 触发 信号： GNU 的 C 函数库定义了各种信号类型，每种类型都适用于特定类型的事件。某些类型的事件使程序不能像往常一样继续进行，相应的信号通常会终止程序。其他类型的报告无害事件的信号在默认情况下被忽略。 如果用户要参与到会触发信号的事件中，可以事先定义 信号处理函数，当收到 特定信号 时，操作系统会运行它。有时称信号处理函数 捕获（catch） 了信号，当函数运行时，该信号通常处于 阻塞（blocked） 状态。 一个进程可以给另一个进程发信号，父进程可以借此抛弃子进程，或者两个相关进程借此通信并同步。 12.2 信号的种类 12.2.1 可靠信号与不可靠信号 早期Unix系统中的信号机制比较简单和原始，信号值小于 SIGRTMIN 的信号都是 不可靠信号。这就是 “不可靠信号” 的来源。它的主要问题是 信号可能丢失。 信号值位于 SIGRTMIN 和 SIGRTMAX 之间的信号都是可靠信号，可靠信号克服了信号可能丢失的问题。Linux 在支持新版本的信号安装函数 sigation()...","categories": ["linux"],
        "tags": ["信号","linux"],
        "url": "https://linotes.netlify.com/linux/signal/",
        "teaser":null},{
        "title": "Linux 基础 - 13. SELinux",
        "excerpt":"13.1 安全访问控制机制 在安全访问中，访问的发起者称为 主体，被访问的资源称为 客体。 😈 为了减少输入时中英文切换的次数，偷懒一下，下文中，用 SL 表示 SELinux，用 L 用户 表示 Linux 用户，用 SL 用户 表示 SELinux 用户。 13.1.1 DAC DAC，Discretionary Access Control，自主访问控制，Linux 传统的访问控制属于这样的机制。 DAC 控制的主体为用户。 自主：访问控制由文件或进程的 所有者决定 只使用 UID、GID 来控制传统文件权限中，帐号分为系统管理员与普通用户，对文件件资源的访问权限决定于 rwx 的设置。根据对象所属的分组来限制对对象的访问。 DAC 最大的缺点是它 无法分离用户和进程，进程能够继承用户的访问控制，授权用户的所有进程会自动获得授权，包括侵入该用户名下的恶意程序。 root 为默认的超级用户，属于它的进程一旦被攻破会极度危险。 13.1.2 MAC MAC，Mandatory Access Control，强制访问控制，操作系统会限制进程对客体的访问或操作，SELinux 属于这样的控制机制。 主体和客体都有一组安全属性，操作系统会检查这些标签，以决定请求的操作是否允许进行。 MAC 控制的主体为进程，不再是用户。 MAC...","categories": ["linux"],
        "tags": ["selinux","linux"],
        "url": "https://linotes.netlify.com/linux/selinux/",
        "teaser":null},{
        "title": "Linux 基础 - 14. Systemd",
        "excerpt":"14.1 守护进程与服务 14.1.1 服务 服务，Service，是一种 进程，它通过进程间通信机制来 响应其它程序的请求，这些请求 通常来自于网络。服务通常是由服务软件提供的。 服务包括守护进程及其他服务。非守护进程的服务通常由 xinetd 控制，xinetd 负责监听请求，必要时会启动相关的服务来处理，请求被处理完成以后，服务会再次被关闭。 【 xinetd 】 extended internet deamon。负责管理基于互联网的活动。相对于较早的 inetd，其安全性更好。xinetd 监听 其管理的所有服务的 端口，当发生连接请求时，xinetd 决定是否允许客户端访问。如果允许，则启动对应的服务。 14.1.2 守护进程 守护进程，Daemon，是一种 服务进程，它们运行于后台，管理系统或为其它进程提供特定的功能。它 不会与用户发生任何交互。 早期的守护进程由 SysVinit 部署，而现代的守护进程遵循一个简单而更强大的方案，由 systemd 部署，称之为新型守护进程。 守护进程进程名字均以字母 ‘d’ 结尾，如 syslogd、sshd 等。 典型的守护进程：MySQL，Apache。典型的非守护进程：rsync，vsftpd。 📕 服务的概念大于守护进程。 14.1.3 sysvinit 在 systemd 之前，一直以来都是 SysVinit 掌管启动进程。当系统使用 SysVint 时，init...","categories": ["linux"],
        "tags": ["守护进程","linux"],
        "url": "https://linotes.netlify.com/linux/systemd/",
        "teaser":null},{
        "title": "Linux 基础 - 15. 日志",
        "excerpt":"15.1 SYSLOG syslog 是计算机系统中 消息日志的标准，通过该标准，允许把生成日志的软件、保存日志的系统、报告及分析日志的软件分离开来。每条消息都打上标签，以表明生成日志的软件类别及严重级别。 syslog 可用于系统管理及安全审计，也可用于生成、分析、调试信息。多种硬件平台都使用该标准，如打印机、路由器等。于是，在一个中央信息库中，完全可以把来自不同系统的日志数据合并到一起。 syslog 存在于多种操作系统中，并且成为类 Unix 系统中日志系统的标准配置，同时也普遍存在于网络设备中，如路由器。 系统日志消息的发起者提供的信息包括 设施代码 和 严重性级别。在将条目传递给 syslog 接收器之前，syslog 软件将信息添加到信息头中，包括发起者进程 ID，时间戳以及设备的主机名或 IP 地址。 syslog 是 UNIX 的标准日志解决方案。syslog 这个术语可以表示 syslog 这个协议，也可以表示一个 C API，不过更普遍的还是表示二者的实施。 15.1.1 Logger 日志消息可以被定向到各种目标，如控制台、文件、远程 syslog 服务器、中继器等。 大多数 syslog 实施方案都提供一个命令行工具，称为 logger，也会提供一个链接库，用于把消息发送给日志，一些实施方案会包含报告程序，可以用于过虑消息，以及消息的显示。 15.1.2 网络协议 在网络上操作时，syslog 实施方案可以 client-server 方式部署，服务器在预定的端口上侦听来自客户端的协议请求。用于网络日志的应用最广泛的传输层协议为 UDP，其服务器侦听的端口为 514。 15.2 RSYSLOG rsyslog...","categories": ["linux"],
        "tags": ["日志","syslog","linux"],
        "url": "https://linotes.netlify.com/linux/log/",
        "teaser":null},{
        "title": "Linux 基础 - 16. 程序的构建",
        "excerpt":"16.1 程序的构建 通常的开发环境都是流行的集成开发环境（IDE），一般都将编译和链接的过程一步完成，通常将这种 编译 和 链接 合并到一起的过程称为 构建（Build）。即使使用命令行来编译一个源代码文件，简单的一句 gcc hello.c 命令就包含了非常复杂的过程。 构建程序的过程可以大致分解为预处理、编译、汇编和链接。但本节将其之前和之后的相关工作也加入进来，力图全面地讨论一个程序构建的全过程。在此要特别感谢阮一峰老师的文章以及《程序员的自我修养》这本书。 源代码也称源程序，是指一系列人类可读的计算机语言指令。C 语言的源代码文件后缀为 .c。 16.1.1 配置 Configure 编译器在开始工作之前，需要知道当前的系统环境，比如标准库在哪里、软件的安装位置在哪里、需要安装哪些组件等等。这是因为不同计算机的系统环境不一样，通过指定编译参数，编译器就可以灵活适应环境，编译出各种环境都能运行的机器码。这个确定编译参数的步骤，就叫做 “配置”（configure）。 这些配置信息保存在一个配置文件之中，约定俗成是一个叫做 configure 的脚本文件。通常它是由 autoconf 工具生成的。编译器通过运行这个脚本，获知编译参数。 configure 脚本已经尽量考虑到不同系统的差异，并且对各种编译参数给出了默认值。如果用户的系统环境比较特别，或者有一些特定的需求，就需要手动向 configure 脚本提供编译参数。 $ ./configure --prefix=/www --with-mysql上面代码是 php 源码的一种编译配置，用户指定安装后的文件保存在 www 目录，并且编译时加入 mysql 模块的支持。 16.1.2 确定标准库和头文件的位置 源码肯定会用到标准库函数（standard library）和头文件（header）。它们可以存放在系统的任意目录中，编译器实际上没办法自动检测它们的位置，只有通过配置文件才能知道。 编译的第二步，就是从配置文件中了解标准库和头文件的位置。一般来说，配置文件会给出一个清单，列出几个具体的目录。等到编译时，编译器就按顺序到这几个目录中，寻找目标。 16.1.3 确定信赖关系 对于大型项目来说，源码文件之间往往存在依赖关系，编译器需要确定编译的先后顺序。假定 A 文件依赖于 B...","categories": ["linux"],
        "tags": ["构建","编译","linux"],
        "url": "https://linotes.netlify.com/linux/build/",
        "teaser":null},{
        "title": "Linux 基础 - 17. 程序的加载",
        "excerpt":"17.5 程序的加载 可执行文件只有加载到内存以后才能被 CPU 执行。早期的程序加载十分简陋，加载的基本过程就是把程序从外部存储器中读取到内存中的某个位置。随着硬件 MMU 的诞生，多进程、多用户、虚拟存储的操作系统出现以后，可执行文件的加载过程变得非常复杂。 17.5.1 进程的虚拟地址空间 每个程序被运行起来以后，它将拥有自己独立的虚拟地址空间（Virtual Address Space），这个虚拟地址空间的大小由计算机的硬件平台决定，具体地说是由 CPU 的位数决定的。 硬件决定了地址空间的最大理论上限，即硬件的寻址空间大小，比如 32 位的硬件平台决定了虚拟地址空间的地址为 4GB。 程序在运行的时候处于操作系统的监管下，操作系统为了达到监控程序运行等一系列目的，进程的虚拟空间都在操作系统的掌握之中。进程只能使用那些操作系统分配给进程的地址，如果访问未经允许的空间，那么操作系统就会捕获到这些访问，将进程的这种访问当作非法操作，强制结束进程。 对于 32 位平台，只能使用 4GB 的虚拟空间，其中操作系统本身用去了一部分，对于 Linux 来说，进程在执行的时候，可用的虚拟空间不超过 3GB。只有使用 64 位平台才能让进程使用更多的虚拟空间。 17.5.2 加载的方式 程序执行时所需要的指令和数据必须在内存中才能够正常运行，最简单的办法就是将程序运行所需要的指令和数据全都装入内存中，这样程序就可以顺利运行，这就是最简单的静态装入的办法。 为了让更多更大的程序得以运行而不停地增加内存是不实际的，最好在不添加内存的情况下让更多的程序运行起来，尽可能有效地利用内存。 根据程序运行时的 局部性原理，可以将程序最 常用 的部分 驻留 在内存中，而将一些 不太常用 的数据存放在 磁盘 里面，这就是 动态加载 的基本原理。 覆盖装入（Overlay）和页映射（Paging）是两种很典型的动态加载方法，它们所采用的思想都差不多，原则上都是利用了程序的局部性原理。动态装入的思想是程序用到哪个模块，就将哪个模块装入内存，如果不用就暂时不装入，存放在磁盘中。 覆盖加载 覆盖装入的方法把挖掘内存潜力的任务交给了程序员，程序员在编写程序的时候必须手工将程序分割成若干块，然后编写一个小的辅助代码来管理这些模块何时应该驻留内存而何时应该被替换掉。 覆盖装入在没有发明虚拟存储之前使用比较广泛，现在已经几乎被 淘汰...","categories": ["linux"],
        "tags": ["加载","库","linux"],
        "url": "https://linotes.netlify.com/linux/apploading/",
        "teaser":null},{
        "title": "Linux 基础 - 18. 软件包的管理",
        "excerpt":"18.1 RPM 18.1.1 软件包的安装方式 普通安装方式 Linux 开发商先在固定的硬件平台与操作系统平台上，把需要安装或升级的软件编译好，然后将相关文件打包成为一个特殊格式的文件，其中还包含了检测系统和所需软件的脚本，并记录该软件提供的所有文件信息。最终发布。 用户下载文件后，使用特定的命令安装，该软件先 按检测安装环境 是否满足，满足则安装。 安装完成后会 把该软件的信息写入软件管理机制 中，以备将来升级、卸载。 当前在 Linux 业内最常见的安装方式为： dpkg：Debian Package，Debian 开发，安装包为 .deb 格式。dpkg 是比较底层的工具。 RPM：Red Hat Package Manager，由 Red Hat 开发，后被很多发行版采用，包括 Fedora，CentOS，SuSE 等。安装包为 .rpm 格式。dpkg 和 rpm 都无法解决安装环境对其它软件的 依赖 的问题，即如果系统中没有安装特定的软件，该软件就无法正常运行。 在线安装方式 因此，为了解决这个问题，各家开发了 在线安装机制，在安装某一软件时，如果该软件所依赖的其它软件在系统中不存在，则会先在线自动安装它们，待所有这些软件安装完毕之后，再安装目标软件。 在 dpkg 基础上开发了 APT（Advanced Packaging Tool） ，在 RPM 基础上开发了...","categories": ["linux"],
        "tags": ["rpm","yum","linux"],
        "url": "https://linotes.netlify.com/linux/rpm/",
        "teaser":null},{
        "title": "Linux 基础 - 19. 编译内核",
        "excerpt":"19.1 内核简介 Linux 主要由 liunx 内核和一些支持模块组成。 19.1.1 内核 Kernel 内核是整个操作系统的最底层，它负责了整个 硬件的驱动，以及提供各种系统所需的 核心功能。包括防火墙机制、是否支援 LVM 或 Quota 等文件系统。如果你的内核不认识某个最新的硬件，那么该硬件也就无法被驱动，当然也就无法使用该硬件。 其实内核就是系统上面的 一个文件 而已，其中包含了驱动主机各项硬件的 检测程序与驱动模块。 在开机流程中，系统读取 BIOS 并加载 MBR 内的引导程序后，就能够把该内核文件加载到内存中了。然后内核开始检测硬件，挂载根目录，获取内核模块来驱动所有的硬件，之后调用 systemd 依序启动所有系统服务。 内核文件位于 /boot/ 目录，文件名为 vmlinuz-*，一台主机上可以有多个内核文件，但开机时仅能选择一个来加载。多个内核文件可以实现多重启动。 19.1.2 内核源码 原厂内核 各主要发行版在发布产品时，都附带内核的源代码。 主要的源代码网站： CentOS 的 SRPM： http://vault.centos.org Linux 内核官网： http://www.kernel.org 从 CentOS 7 开始的版本，在版本号后面会接上发布日期，如 7.1.1503 表示 CentOS...","categories": ["linux"],
        "tags": ["kernel","linux","编译","内核"],
        "url": "https://linotes.netlify.com/linux/cmpkernel/",
        "teaser":null},{
        "title": "Linux 基础  - 20. 备份",
        "excerpt":"20.1 备份简介 对文件系统的备份主要可分为对文件系统整体的 完整备份，和对部分目录、文件的 选择备份。 20.1.1 为什么要备份 硬件故障 计算机是一个相当不可靠的机器 会造成系统损坏的硬件主要是 硬盘 。解决方案为使用可备份的 RAID1、RAID5、RAID6 等磁盘阵列，但 RAID 控制芯片也有损坏的可能。 软件故障 系统的软件伤害，使用者误操作造成数据丢失 信息安全事件：遭受黑客攻击，钓鱼软件攻击，木马攻击等20.1.2 备份要考虑的因素 备份对象 对系统或使用者来说最重要的数据，如 /etc/ 及 /home/ 等 备份介质 光盘、硬盘、同一硬盘的不同分区、网络备份 备份方式 完整备份，增量备份，差异备份 备份的频率 备份工具 20.1.3 备份对象 系统数据 必须备份 /etc/ /home/ /root/ /var/spool/mail/ /var/spoll/cron/ /var/spool/at/ /var/lib/ 服务软件数据库：如 /var/www/ 、 /srv/www/ 等 用户的家目录建议备份 /boot/...","categories": ["linux"],
        "tags": ["备份","linux"],
        "url": "https://linotes.netlify.com/linux/backup/",
        "teaser":null},{
        "title": "Linux 的使用 - 软件包",
        "excerpt":"模块 lsmod  查看已加载的内核模块 ","categories": ["tools"],
        "tags": ["linux","软件包","yum","rpm","编译"],
        "url": "https://linotes.netlify.com/tools/appackage/",
        "teaser":null},{
        "title": "Linux 的使用 - 备份",
        "excerpt":"完整备份 对整个 文件系统 做一次完整的备份。 完整备份常用的工具有 dd，cpio，xfsdump，xfsrestore 等，这些工具都能够备份 设备文件 与 特殊文件。 增量备份 只有做过完全备份以后才能做增量备份。 增量备份，是在进行完第一次完整备份后，经过一段时间的运行，比较当前系统与备份文件之间的差异，仅备份有差异的文件。 xfsdump xfsdump 可以备份 XFS 文件系统中的文件及其属性。文件可备份到 存储介质、普通文件、标准输出。可进行 全部备份、增量备份、选择备份。 每次对 xfsdump 的调用都是 转储 一个文件系统，该调用称为 转储会话，dump session。转储会话会将文件系统分割成一个或多个转储流，dump streams，每目标一个。分割的顺序是依照文件系统的 inode 编号完成的，确定分割边界时，会均衡每个转储流的大小。不同转储流的分割点有可能是在某个非常大的文件中的中间，当然是在 extent 的边界。一个转储流可以跨越多个介质，一个介质可以包含多个转储流。介质对象会把转储流记录为一个或多个介质文件，介质文件 是一个独立的部分转储，旨在最大限度地减少介质丢失对整个转储流的影响，但会增加完成转储所需的时间。默认全部写到一个介质文件中，除非使用 -d 参数指定介质文件大小。其它的技术，如生成转储镜像的第二个副本，比 “分割成多个介质文件的方法” 能提供更好的保护。然而，Linux 中当前的实现 仅支持单一目标，运行单一线程。因此，所谓多转储流只是描述未来的 可能性。 备份完成后，系统会把备份的文件系统、时间、Session ID 等信息保存在 /var/lib/xfsdump/inventory 中，以便下次备份时作为 参考依据。查看备份信息时，也需要读取该文件。 xfsdump 的限制 只能备份 已挂载...","categories": ["tools"],
        "tags": ["备份","linux"],
        "url": "https://linotes.netlify.com/tools/backup/",
        "teaser":null},{
        "title": "Linux 的使用 - 任务计划",
        "excerpt":"守护进程 cron cron 是一个用于执行任务计划的 守护进程。 在 systemV 系统中，cron 是做为启动脚本启动的，通常保存在 /etc/rc.d/init.d/ 或 /etc/init.d/ 目录中。 在 systemD 系统中，cron 是一个守护进程，其服务单元为 ` /lib/systemd/system/crond.service，由 systemctl start crond.service` 命令启动。 cron 自动检查的配置文件 cron 作为守护进程会每分钟自动检查特定文件和目录，以便执行其中配置的任务计划。 /etc/crontab：cron 主配置文件 /etc/cron.d/：目录中的所有 cron 配置文件，这些是按功能区分的独立配置文件，如 0hourly。 /var/spool/cron/：crontab 的配置文件。在该目录中搜索与 Linux 用户同名的配置文件，将其加载到内存。 /etc/anacrontab：anacron 的配置文件。主配置文件 cron 的主配置文件为 /etc/crontab 周期格式为 分 时 日 月 周 用户 命令，周...","categories": ["tools"],
        "tags": ["任务计划","cron","crontab"],
        "url": "https://linotes.netlify.com/tools/cron/",
        "teaser":null},{
        "title": "Linux 的使用 - 数据流处理",
        "excerpt":"grep 、sed、awk 被称为 linux 中的 “三剑客”。 grep 适合单纯的 查找 或 匹配 文本 sed 适合 编辑 匹配到的文本 awk 适合 格式化 文本，对文本进行较复杂格式处理GREP 语法 检索文件内容，列出模板所在的行。模板可以是字符串或正则表达式，支持 BRE 和 ERE。 grep [-A] [-B] [--color=auto] '模板' filename -A 列出该行及其后 n 行 -B 列出该行及其前 n 行 --color=auto 标记颜色 -n 显示行号 范例 正向匹配 $ last | grep 'root'反向匹配...","categories": ["tools"],
        "tags": ["linux","数据流","重定向","排序","过滤","管道","grep","sed","awk"],
        "url": "https://linotes.netlify.com/tools/datastream/",
        "teaser":null},{
        "title": "Linux 的使用 - 文件系统",
        "excerpt":"文件系统 文件系统的挂载 SMB ：Server Message Block。SMB 是文件共享协议，由 IBM 创建。 CIFS ：Common Internet File System。CIFS 是 SMB 协议的一个特殊的实现，由微软创建。 确认系统安装了 CIFS 工具： $ cat /proc/filesystems | grep cifsnodev cifswindows 共享文件夹挂载 交互式输入密码： $ sudo mount -t cifs -o username=neo //192.168.1.124/share /mnt/winPassword for neo@//192.168.1.124/share: ******直接键入密码： $ sudo mount -t cifs -o username=neo,password=matrix //192.168.1.124/share /mnt/win编辑...","categories": ["tools"],
        "tags": ["linux","文件系统","格式化","xfs","ext"],
        "url": "https://linotes.netlify.com/tools/filesystem/",
        "teaser":null},{
        "title": "Linux 的使用 - 日志管理",
        "excerpt":"常用日志 /var/log/boot.log 启动的时候系统内核会检测并启动硬件，然后启动内核的功能。这些流程都会记录在 /var/log/boot.log 里。该文件只保留 本次启动的信息，不记录上一次启动的信息。 /var/log/cron crontab 计划任务 日志。 /var/log/dmesg CentOS 在启动时默认不显示 内核的硬件检测信息，都保存在该日志。 /var/log/lastlog 记录所有帐号最近一次登陆系统的信息 /var/log/maillog 或 /var/log/mail/\\* 邮件的往来信息，主要是 postfix （SMTP 协议提供者）与 dovecot（POP3 协议提供者）所产生的信息。 /var/log/messages 用于保存有价值的、非调试的、非关键的消息，即系统的普通活动日志。 /var/log/secure 用于追踪认证系统，所有与安全相关的消息，sudo login，SSH login 等其它登陆错误 /var/log/wtmp 成功登陆系统的帐号 /var/log/faillog 登陆失败的帐号 /var/log/httpd/ apache 服务日志 /var/log/samba/ samba 服务日志 日志的滚动 LOGROTATE 日志滚动的设计是为了简化日志管理的工作，控制无休止生成的大量日志。 日志滚动可以实现自动 滚动、压缩、删除、发邮件。滚动的频率要么是按 日、周、月，要么是日志 达到一定大小 时处理。...","categories": ["tools"],
        "tags": ["linux","日志","logrotate"],
        "url": "https://linotes.netlify.com/tools/log/",
        "teaser":null},{
        "title": "Linux 的使用 - 网络",
        "excerpt":"查看网络设备信息 本文中，范例均在说明文字的 下方。 网卡 lspci 可以查看网卡的品牌和型号： # lspci | grep -i 'eth'02:00.0 Ethernet controller: Realtek Semiconductor Co., Ltd. RTL8111/8168B PCI Express Gigabit Ethernet controller (rev 06)ethtool 该工具用于查询或控制网络驱动以及硬件的设置。 不加参数运行为查看某个网卡接口的详细信息。 $ ethtool ens33Settings for ens33: Supported ports: [ TP ] Supported link modes: 10baseT/Half 10baseT/Full 100baseT/Half 100baseT/Full 1000baseT/Full # 支持千兆双工 Supported pause...","categories": ["tools"],
        "tags": ["linux","网络","IP地址"],
        "url": "https://linotes.netlify.com/tools/network/",
        "teaser":null},{
        "title": "Linux 的使用 - 管道",
        "excerpt":"管道命令 管道命令只能处理 STDOUT 而不能处理 STDERR 每个管道命令必须能够接受 STDIN 参数转换： XARGS xargs 可以给不支持管道的命令提供参数，参数来自其读取的 STDIN，一般以空格或换行符为分隔符。 xargs [-0epn] command xargs 把 STDIN 转换为参数，放到 command 后面。 -0 还原特殊字符 -e EOF -p 每条命令都请示用户 -n 一次用几个参数 如果 xargs 后面没有任何命令，默认是用 echo 来输出。 范例 提取 /etc/passwd 的用户名（第一栏），取三行，用 id 命令显示每个帐号信息cut -d ':' -f 1 /etc/passwd | head -n 3 |...","categories": ["tools"],
        "tags": ["linux","管道"],
        "url": "https://linotes.netlify.com/tools/pipeline/",
        "teaser":null},{
        "title": "Linux 的使用 - 进程",
        "excerpt":"查看 查看当前所有进程 $ ps -efUID PID PPID C STIME TTY TIME CMDroot 1 0 0 06:59 ? 00:00:02 /usr/lib/systemd/systemd --switched-root --system --root 2 0 0 06:59 ? 00:00:00 [kthreadd]root 3 2 0 06:59 ? 00:00:00 [ksoftirqd/0]实时查看进程状态及 CPU 占用 $ toptop - 09:24:05 up 2:24, 2 users, load average: 0.00, 0.01,...","categories": ["tools"],
        "tags": ["linux","进程"],
        "url": "https://linotes.netlify.com/tools/process/",
        "teaser":null},{
        "title": "Linux 的使用 - 正则表达式",
        "excerpt":"正则表达式简介 使用单个字符串来描述、匹配一系列符合某个句法规则的字符串。 常见的正则表达式记法都源于 Perl，正则表达式从 Perl 衍生出一个显赫的流派，叫做 PCRE（Perl Compatible Regular Expression）， \\d 、 \\w 、 \\s 之类的记法，就是这个流派的特征。但是在 PCRE 之外，正则表达式还有其它流派，比如 POSIX。 POSIX，Portable Operating System Interface for uniX，它由一系列规范构成，定义了 UNIX 操作系统应当支持的功能，所以 “POSIX规范的正则表达式 其实只是 “关于正则表达式的 POSIX 规范，它定义了 BRE 和 ERE 两大流派。在兼容 POSIX 的 UNIX 系统上，grep 和 egrep 之类的工具都遵循 POSIX 规范，一些数据库系统中的正则表达式也符合 POSIX 规范。 Basic Regular Expression，BRE，基本正则表达式...","categories": ["tools"],
        "tags": ["正则表达式"],
        "url": "https://linotes.netlify.com/tools/re/",
        "teaser":null},{
        "title": "Linux 的使用 - 重定向",
        "excerpt":"所谓 I/O 重定向简单来说就是一个过程，这个过程捕捉一个文件，或者命令，程序，脚本，甚至脚本中的代码块（code block）的输出，然后把捕捉到的输出，作为输入发送给另外一个文件，命令，程序，或者脚本。 输入、输出、流 Linux shell 是以字符序列或字符流的方式接收输入，发送输出。每个单独的字符之间是相互独立的。 无论字符流来自或去往文件、键盘、窗口、其它 I/O 设备，都可以用文件 I/O 技术来访问流。 Linux shell 使用三种标准的 I/O 流，用 文件描述符 表示。 文件描述符 File Descriptor 在 Linux 系统中，系统为每一个打开的文件指定一个文件描述符，以便系统对文件进行跟踪，文件描述符是一个数字，不同数字代表不同的含义。 默认情况下，系统占用了 3 个： STDIN：标准输入流，为命令提供输入，描述符为 0，通常指键盘的输入 STDOUT：标准输出流，显示来自命令的输出，描述符为 1，通常指显示器的输出 STDERR：标准错误流，显示来自命令的错误信息，描述符为 2，通常也是定向到显示器 3-9 是保留的标识符，可以把这些标识符指定成标准输入，输出或者错误作为临时连接。通常这样可以解决很多复杂的重定向请求。 自定义文件描述符 可以使用 exec 命令创建自定义的文件描述符。 为读取文件创建描述符~]$ echo this is a test line &gt; input.​txt~]$...","categories": ["tools"],
        "tags": ["linux","重定向"],
        "url": "https://linotes.netlify.com/tools/redirection/",
        "teaser":null},{
        "title": "Linux 的使用 - 系统资源配置",
        "excerpt":"资源配额常用工具 ulimit ulimit 工具可以 对用户可以使用的系统资源进行限制，如 打开的文件数量、CPU 时间、内存总量 等。 语法 ulimit -SHacdfltu [配额] -H 硬指标，不能超过此值 -S 软指标，可以超过此值，超过会有警告信息 通常软指标比硬指标小，达到先警告再限制的效果 -a 后面不接任何选项与参数，可列出所有的限制额度 -c 限制每个内核文件的大小 程序出错时，系统将该程序在内存中的信息写成内核文件，便于除错。 -f 当前 shell 可以创建文件的容量限制 单位为 KBytes，一般为 2GB -d 程序可使用的最大断裂内存（segment）容量； -l 可用于锁定的内存量 -t 可使用的最大 CPU 时间 （秒） -u 单一用户可以使用的最大进程数量。 范例 查看当前普通用户身份的所有配额ulimit -a 配额为 0 表示没限制 限制用户仅能创建 10 MBytes 以下的文件ulimit...","categories": ["tools"],
        "tags": ["linux","限额","配额","限制"],
        "url": "https://linotes.netlify.com/tools/resource/",
        "teaser":null},{
        "title": "Linux 的使用 - 安全设置",
        "excerpt":"SSH 生成公钥与私钥 使用 ssh-keygen 命令生成，默认会保存在 .ssh/ 目录中，生成两个文件，即私钥 id_rsa，公钥 id_rsa.pub。 $ ssh-keygen -t rsaGenerating public/private rsa key pair.Enter file in which to save the key (/root/.ssh/id_rsa):Created directory '/root/.ssh'.Enter passphrase (empty for no passphrase):Enter same passphrase again:Your identification has been saved in /root/.ssh/id_rsa.Your public key has been saved in /root/.ssh/id_rsa.pub.The key fingerprint...","categories": ["tools"],
        "tags": ["linux","security","安全"],
        "url": "https://linotes.netlify.com/tools/security/",
        "teaser":null},{
        "title": "Linux 的使用 - Shell",
        "excerpt":"SHELL 的环境配置 因为 CentOS 的默认 shell 为 bash，本文中会把 shell 与 bash 混用。 Bash 默认快捷键 组合按键 执行结果 Ctrl + C 终止当前命令 Ctrl + D 输入结束，如邮件结束的时候 Ctrl + M 回车 Ctrl + S 暂停屏幕输出 Ctrl + Q 恢复屏幕输出 Ctrl + U 删除整行命令 Ctrl + Z 暂停当前命令 启动 Bash 时常用的选项 在启动 /bin/bash 时，可以通过指定不同的选项，来实现不同的环境。...","categories": ["tools"],
        "tags": ["shell","bash"],
        "url": "https://linotes.netlify.com/tools/shell/",
        "teaser":null},{
        "title": "Linux 的使用 - 存储",
        "excerpt":"存储设备 设备文件名 系统按照检测到的磁盘顺序来决定设备文件名，与插槽号无关。 USB 磁盘：/dev/sdc 实体磁盘 /dev/sd[a-p] 分区 /dev/sda[1-128] 虚拟机 /dev/vd[a-p] 软 RAID /dev/md[0-128] LVM /dev/VGNAME/LVNAME 查看设备信息 查看 SCSI 设备信息 ~]$ lsscsi [0:0:0:0] disk VMware, VMware Virtual S 1.0 /dev/sda[2:0:0:0] cd/dvd NECVMWar VMware IDE CDR10 1.00 /dev/sr0smartctl Self-Monitoring，Analysis and Reporting Technology System，SMART 用于监测 ATA 和 SCSI 接口的磁盘，被监测的磁盘必须支持 SMART 协议。 smartd...","categories": ["tools"],
        "tags": ["分区","分区表","linux","fdisk","gdisk","raid"],
        "url": "https://linotes.netlify.com/tools/storage/",
        "teaser":null},{
        "title": "Linux 的使用 - 系统维护",
        "excerpt":"查看硬件信息 常用工具 dmidecode SMBIOS，System Management BIOS，是主板或系统制造者以标准格式显示产品管理信息所需遵循的统一规范。DMI，Desktop Management Interface 是帮助收集电脑系统信息的管理系统，DMI 信息的收集必须在严格遵照 SMBIOS 规范的前提下进行。SMBIOS 和 DMI 是由行业指导机构 Desktop Management Task Force （DMTF）起草的开放性的技术标准；不过 DMTF 宣布 DMI 的生命期在 2005 年结束了。 dmidecode 是系统内置的程序，可以解析计算机的 DMI 表 的内容，输出为易读的格式。该表包含了对 系统各硬件 的描述，以及其它有用的信息，如序列号、BIOS 版本号等。有了这张表，就无需打开机箱查看真正的硬件了。虽然带来的便利，但也带来了信息不可靠的风险。 DMI 表不仅描述当前系统由当些硬件组成，还会报告它有哪些升级的空间，如最快支持哪些 CPU，支持多少最大内存等。 运行 dmidecode 命令时，它会去寻找 DMI 表。首先会尝试从 sysfs 读取，如果访问失败，再尝试直接从内存读取。当它成功找到有效的 DMI 表时，它就会将其内容以一定的格式显示出来。 语法 dmidecode -t 类别...","categories": ["tools"],
        "tags": ["linux","硬件","分区","负载","时间","关机","cpu","内存","使用率","语系"],
        "url": "https://linotes.netlify.com/tools/system/",
        "teaser":null},{
        "title": "Linux 的使用 - 用户管理",
        "excerpt":"Linux 用户 所有用户 查看所有用户 cut -d: -f1 /etc/passwd当前用户 查看当前用户信息 $ iduid=1000(neo) gid=1000(neo) groups=1000(neo),10(wheel) context=unconfined_u:unconfined_r:unconfined_t:s0-s0:c0.c1023查看当前用户所有计划任务 $ crontab -lno crontab for neo在线用户 w w 用于查看当前 谁在线，他们 在做什么。 ~]# w 01:49:18 up 25 days, 3:34, 3 users, load average: 0.00, 0.01, 0.05USER TTY FROM LOGIN@ IDLE JCPU PCPU WHATdmtsai tty2 07Jul15 12days 0.03s...","categories": ["tools"],
        "tags": ["linux","用户","组"],
        "url": "https://linotes.netlify.com/tools/user/",
        "teaser":null},{
        "title": "Linux 的使用 - VIM",
        "excerpt":"快捷键 查找 停止高亮关键字 :noh 在状态行里输入该指令，可以暂停高亮显示本次查找的关键字。下次查找其它关键字时，会自动再次开启。 . ","categories": ["tools"],
        "tags": ["linux","vi","vim"],
        "url": "https://linotes.netlify.com/tools/vi/",
        "teaser":null},{
        "title": "Apache 地址绑定",
        "excerpt":"Apache 绑定地址与端口 配置 Apache HTTP Server 侦听特定的地址和端口。 相关模块 ：core，mpm_common 相关指令 ：&lt;VirtualHost&gt;，Listen httpd 启动时，它会绑定到本地主机上的一些端口和地址，然后等待传入请求。它默认会侦听本地的所有地址。然而，实际上只需要侦听某些端口、某些地址。绑定通常会与虚拟主机功能合并在一起，共同决定 httpd 如何面对不同的 IP 地址、主机名、端口。 Listen 指令 Listen 指令会告诉服务端只接受特定 端口 或 地址-端口 组合传入的请求。 如果 Listen 只指定了一个端口号，服务端则在所有网络接口上侦听这个端口。 如果指定了一个地址、一个端口号，服务端只在该接口上侦听该端口。 如果指定多个地址和端口，服务端会在这些地址上侦听指定的端口。 范例 Listen 80Listen 8000服务端会接受所有接口上来自 80 和 8000 两个端口的连接。 Listen 192.0.2.1:80Listen 192.0.2.5:8000服务端会接受一个接口上的 80 端口的连接，以及另一个接口上的 8000 端口的连接。 IPv6 地址必须用方括号括起来： Listen [2001:db8::a00:20ff:fea7:ccea]:80如果 Listen...","categories": ["server"],
        "tags": ["apache"],
        "url": "https://linotes.netlify.com/server/apache.binding/",
        "teaser":null},{
        "title": "Apache 缓存",
        "excerpt":"Apache 缓存指南 简介 Apache HTTP Server 拥有一系列缓存功能，旨在以各种方式改进服务器的性能。 三状态 RFC2616 HTTP 缓存 mod_cache 及其提供模块 mod_cache_disk 可实现智能的、HTTP 感知的缓存功能。内容本身保存在缓存中，mod_cache 的目标是尊重所有控制可缓存性内容的 HTTP 标头和选项。mod_cache 的目标是兼顾简单和复杂的缓存配置，用它来处理代理内容、动态本地内容，或加速本地文件的访问。 双状态键/值共享对象缓存 共享对象缓存 API 及其提供模块可以实现整个服务端的、基于键/值的共享对象缓存。这些模块旨在缓存低阶数据，如 SSL 会话及身份验证凭据。后台允许将数据存储在共享内存中的服务器范围内，或在高速缓存 (如 memcache 或 distcache) 中的大数据中心中。 专用文件缓存 mod_file_cache 可实现在服务端启动时将文件预加载到内存中，并且可以加速访问，在经常访问的文件上保存文件句柄，因为没必要为每个请求都去访问磁盘。 三状态 RFC2616 HTTP 缓存 相关模块 ：mod_cache，mod_cache_disk 相关指令 ：CacheEnable，CacheDisable，UseCanonicalName，CacheNegotiatedDocs HTTP 协议支持在线缓存机制，而且是内置的，mod_cache 模块可用于使用该机制。 在简单的双状态键/值缓存中，当内容过期时会彻底消失掉。而 HTTP 缓存与之不同，它有一种保留过期内容的机制，先是询问源服务端该过期内容是否发生了改变，如果没变则让其重新生效。 HTTP 缓存中的条目的状态...","categories": ["server"],
        "tags": ["apache","cache","缓存"],
        "url": "https://linotes.netlify.com/server/apache.caching/",
        "teaser":null},{
        "title": "Apache 常用配置指令",
        "excerpt":"全局指令 连接限制 MaxRequestWorkers 用途：限制并发连接数 语法：MaxRequestWorkers number 语境：主服务器该指令用于限制并发的连接请求，所有超过该限制的请求都会加入队列，直到接近 ListenBacklog 所限制的队列上限。一旦有子进程空闲下来，立即会处理该连接。 对于非线程服务器来说，比如 prefork 服务器，该指令会演变成可用于处理请求的子进程的最大数量，默认为 256 个，要想提升，同时还需要提升 ServerLimit 的数量，即可配置的进程数量上限。 For threaded and hybrid servers (e.g. event or worker) MaxRequestWorkers restricts the total number of threads that will be available to serve clients. For hybrid MPMs the default value is 16 (ServerLimit) multiplied by...","categories": ["server"],
        "tags": ["apache","配置","指令"],
        "url": "https://linotes.netlify.com/server/apache.common.conf/",
        "teaser":null},{
        "title": "Apache 的配置",
        "excerpt":"Apache，是非常流行的网页服务器软件。通常和脚本语言比如 PHP，数据库 MySQL 一起工作，合称为 LAMP。本文主要参考 apache 官方文档。 用默认配置可以启动一个简单的服务，有用户访问时会提供目录 /srv/http 下的内容。 启动 httpd.service systemd 服务，Apache 就会启动，从浏览器中访问 http://localhost/ 会显示一个简单的索引页面。 Apache 本身的架构是 一个核心 ＋ 外围的模块，它的配置也遵循这个结构。 主配置文件 Apache 配置文件位于 /etc/httpd/conf 目录，主配置文件是 /etc/httpd/conf/httpd.conf, 此文件可以通过 Include 指令来引用其它配置文件，可以用通配符引用多个配置文件。这些配置文件中可以使用任何指令。对于主配置文件的修改，只有启动或重启 httpd 之后才会生效。 服务器还会读取一个包含 mine 文档类型的文件，文件名由 TypesConfig 指令指定，默认为 mime.type。 配置文件语法 httpd 配置文件每行包含一条指令，如果太长可以在行尾使用 \\ 来续接下一行。 指令的参数与指令之间用空白字符分隔，如果参数包含空格，必须用括号引用。 指令前的空格会被忽略，所以如果需要，可以用缩进让配置更有条理。 无论是由 Define 语句定义的变量，还是 shell...","categories": ["server"],
        "tags": ["apache","lamp"],
        "url": "https://linotes.netlify.com/server/apache.config/",
        "teaser":null},{
        "title": "Apache 过滤器",
        "excerpt":"Apache 过滤器 Apache Filters Apache 2 中的过滤器 相关模块 相关指令 [mod_filter][mod_deflate][mod_ext_filter][mod_include][mod_charset_lite][mod_reflector][mod_buffer][mod_data][mod_ratelimit][mod_reqtimeout][mod_request][mod_sed][mod_substitute][mod_xml2enc][mod_proxy_html] [FilterChain][FilterDeclare][FilterProtocol][FilterProvider][AddInputFilter][AddOutputFilter][RemoveInputFilter][RemoveOutputFilter][ReflectorHeader][ExtFilterDefine][ExtFilterOptions][SetInputFilter][SetOutputFilter] Apache 2.0 之后的版本有了过滤链（Filter Chain）这个概念，有了它以后，应用程序能够以一种高灵活、可配置的方式来处理传入和传出的数据，完全不用考虑数据是从哪里来的。 根据需要，可以对传入的数据进行预处理，对传出的数据进行后处理。这基本上独立于传统的请求处理阶段。 在标准的 Aapche 版本中有一些过滤器，如： mod_include ：服务端 include mod_ssl ：SSL 加密 mod_deflate ：实时压缩、解压 mod_charset_lite ：转换字符集 mod_ext_filter ：运行外部程序，做为过滤器 Apache 内部也使用一些过滤器，用于处理像 chunking 和 byte-range 这样的函数。 大量的程序是通过第三方过滤器模块来部署的，它们可以从 modules.apache.org 获取。如： HTML 和 XML 处理及重写 XSLT 转换及 XIncludes XML 命令空间的支持 处理...","categories": ["server"],
        "tags": ["apache","过滤器"],
        "url": "https://linotes.netlify.com/server/apache.filter/",
        "teaser":null},{
        "title": "Apache HTTP Server 简介",
        "excerpt":"Apache HTTP Server 是一个免费的开源 WEB 服务端软件。最早基于 NCSA HTTPd server，Apache 在 WWW 的最初成长过程中扮演了十分重要的角色，很快就接替 NCSA HTTPd 成为占统治地位的 HTTP server，一直到 1996 年它都是最流行的软件。 Apache 入门 Apache 支持大量的功能，许多都以预编译模块的形式部署，扩展了内核的功能。支持的范围从服务端编程语言的支持直到验证方案的实现。一些通常的语言接口支持 Perl、Python、Tcl、PHP。流行的验证模块包括 mod_access、mod_auth、mod_digest、mod_auth_digest 等。其它功能如 SSL 和 TLS、代理模块、URL 重写模块、自定义日志文件等。 客户端、服务端、URL 网址用 URL 来表示，Uniform Resource Locator。由协议、服务器名称、URL 路径组成，有时在最后还会跟有查询字符串，用来给服务器传递更多的参数。 网络客户端会使用特定的协议连接到服务器，用 URL 发出一个使用资源的 请求。 URL 路径可以是服务器上的文件、处理器、程序文件等。 服务器会发送一个 回复，由状态码和回复内容组成，其中回复内容为可选的。状态码用来表示客户端的请求是否成功，如果失败，则代表具体是什么错误。 期间的细节以及错误都会写进日志文件。 主机名与 DNS 为了连接到服务器，客户端首先会把服务器的主机名解析成 IP...","categories": ["server"],
        "tags": ["apache"],
        "url": "https://linotes.netlify.com/server/apache.intro/",
        "teaser":null},{
        "title": "Apache 日志",
        "excerpt":"Apache 日志 日志文件相关的模块主要有 mod_log_config、mod_log_forensic、mod_logio、mod_cgi。 Apache 提供了多种不同的机制来记录日志，从初始的请求，经过 URL 映射的过程，到连接最终的解析，包括期间所有可能发生的错误。 此外，第三方的模块也可以提供日志功能，或者向现有日志插入条目。 各种应用程序如 CGI 程序、PHP 脚本或其它处理程序可以向服务器错误日志发送消息。 安全警示 如果用户有权写入日志文件所在目录，他几乎一定会获取到 root 权限。 绝对不要随便给用户授予对日志所在目录的写入权限。 另外，日志文件会包含直接由客户端提供的信息，没有经过转义。因此，怀有恶意的客户端有可能把控制字符插入日志文件中，因此在处理原始日志时一定要特别小心。 错误日志 相关模块 ：core 相关指令 ：ErrorLog、ErrorLogFormat、LogLevel 服务器的错误日志，其文件名和位置由 ErrorLog 指令指定，它是最重要的日志文件。httpd 会把诊断信息记录在其中，还会把处理请求的过程中遇到的错误记录下来。在服务端启动出错错误时，或服务端运行出问题时，首先就应该查看错误日志，因为它不仅包含了错误的细节，还会提示如何修复这些错误。 错误日志通常会写入一个文件中，Linux 中通常为 error_log，根据需要，服务端还可以把错误发送给 syslog 或用管道发送给某个程序。 错误日志的格式由 ErrorLogFormat 指令指定，可以自定义要记录哪些内容。典型的日志消息格式： [Fri Sep 09 10:42:29.902022 2011] [core:error] [pid 35708:tid 4328636416] [client 72.15.99.187] File does not...","categories": ["server"],
        "tags": ["apache","log"],
        "url": "https://linotes.netlify.com/server/apache.logging/",
        "teaser":null},{
        "title": "Apache mod_proxy 模块使用说明",
        "excerpt":"简介 mod_proxy 用于为 apache 实现代理/网关功能，它支持一定数量的流行协议，以及几个不同的负载均衡算法。可以通过添加第三方模块来支持更多的协议和负载均衡算法。 必须要加载一组模块才能提供必要的功能。这些模块可以在构建时静态加入，也可以用 LoadModule 指令动态加载。以下模块必须加载： mod_proxy ：提供基本的代理功能 mod_proxy_balancer ：用于负载均衡 至少一个代理方案，或协议、模块： 协议 模块 AJP13 (Apache JServe Protocol version 1.3) mod_proxy_ajp CONNECT (for SSL) mod_proxy_connect FastCGI mod_proxy_fcgi ftp mod_proxy_ftp HTTP/0.9, HTTP/1.0, HTTP/1.1 mod_proxy_http SCGI mod_proxy_scgi WS, WSS (Web-sockets) mod_proxy_wstunnel 另外，更多的模块可以带来更多的扩展功能： mod_cache ：缓存 mod_ssl ：使用 SSL/TLS 与远程服务器通信，使用 SSLProxy* 指令正向代理与反向代理 正向代理：forward...","categories": ["server"],
        "tags": ["apache","代理"],
        "url": "https://linotes.netlify.com/server/apache.mod_proxy/",
        "teaser":null},{
        "title": "Apache 反向代理指南",
        "excerpt":"Apache 反向代理指南 除了做为基本的网页服务器，提供静态和动态内容给终端用户以外，Apache 也可以扮演反向代理服务器，也称网关服务器。 在这种情况下，httpd 自己不会生成数据，也不会提供数据，其内容都是从一个或多个后端服务器获得的。这些后端服务器通常不会直接连到外界网络。当 httpd 从客户端收到一个请求时，该请求被代理到其中一台后端服务器，然后由它处理该请求，生成内容，并把内容返回给 httpd，由 httpd 负责为客户端生成真正的 HTTP 应答。 这种方案的部署有很多考量，但通常是考虑到安全、高可用、负载平衡、集中验证、集中授权。在该方案中，有一点非常重要，即将后端设施的布局、设计和架构与外界隔离，保护起来。对于客户端来说，所有的内容来源只是反向代理服务器。 反向代理 相关模块 相关指令 mod_proxy ProxyPass mod_proxy_balancer BalancerMember mod_proxy_hcheck   简易反向代理 代理所有地址 ProxyPass 指令用于设定传入请求到后端服务器的映射。最简单的范例是把所有请求代理到后端： ProxyPass \"/\" \"http://www.example.com/\"所有请求用 \"/\" 表示。 替换标头信息 另外，为了确保后端生成的标头信息中的 Location: 会被替换，而指向反向代理，而不是指向后端服务器本身，则必须使用 ProxyPassReverse 指令： ProxyPass \"/\" \"http://www.example.com/\"ProxyPassReverse \"/\" \"http://www.example.com/\"ProxyPassReverse 指令会让 Apache 调整 HTTP 重定向应答中 Location、Content-Location、URI 标头中的...","categories": ["server"],
        "tags": ["apache","反向代理"],
        "url": "https://linotes.netlify.com/server/apache.reverse.proxy/",
        "teaser":null},{
        "title": "Apache 虚拟主机",
        "excerpt":"虚拟主机可以是基于 IP 的，即每个网站有独立的 IP 地址；也可以基于域名的，即每个 IP 地址有多个域名在运行。终端用户对于同一物理服务器上运行多个网站的事实是不知情的。 apache 是最早支持多个基于 IP 的虚拟主机的服务器之一。版本 1.1 之后开始同时支持基于 IP 和基于域名的虚拟主机。 基于域名的虚拟主机有时也叫基于主机的，或非 IP 的虚拟主机。 几乎所有配置指令都能在 &lt;VirtualHost&gt; 中使用，除了控制进程创建的以及其它一些指令。具体可以查看指令速查表。 基于域名的虚拟主机 每 IP 地址有多个网站。 基于域名与基于 IP 的区别 基于 IP 的虚拟主机使用连接的 IP 地址来确定正确的虚拟主机。因此需要为每个虚拟主机分配单独的 IP 地址。 基于域名的虚拟主机，服务器依赖于客户端在 HTTP 标头中提交的域名。多个不同的虚拟主机可以使用同一个 IP 地址。 基于域名的虚拟主机通常更简单，因为只需要配置 DNS 服务器把各个域名映射到正确的 IP 地址，然后再配置 apache，令其可以识别不同的虚拟主机就可以了。基于域名的虚拟主机减少了对 IP 地址的需求，因此如果设备不是显式需要基于 IP 的虚拟主机，就可以使用基于域名的。...","categories": ["server"],
        "tags": ["apache","虚拟主机"],
        "url": "https://linotes.netlify.com/server/apache.vhost/",
        "teaser":null},{
        "title": "Nginx 基本功能",
        "excerpt":"控制 nginx 运行时进程 主进程与工人进程 nginx 有一个主进程与一个或多个工人进程。如果启用了缓存，在启动服务时还会运行缓存启动器进程和缓存管理器进程。 主进程的主要任务是读取和验证配置文件，维护工人进程。 工人进程的任务则是处理请求。nginx 靠的是依赖于操作系统的机制，把请求高效地分配给工人进程。工人进程的数量由配置文件定义，可以是固定的，也可以根据可用 CPU 核心的数量来自动调整。 nginx 的控制 用信号控制进程 nginx 可以由信号来控制，主进程的 ID 默认被写入 /run/nginx.pid 文件。 主进程支持以下信号： GERM,INT ：快速关闭 QUIT ：优雅关闭 HUP ：修改配置，修改了时区，用新配置开启新工人进程，优雅关闭旧工人进程 USR1 ：重新打开日志文件 USR2 ：升级可执行文件 WINCH ：优雅关闭工人进程 工人进程支持的信号： 单独的工人进程也可以由信号来控制，虽然并不需要这么做。 TERM,INT ：快速关闭 QUIT ：优雅关闭 USR1 ：重新打开日志文件 WINCH ：异常终止，用于调试，需启用 debug_points 重载配置 要想重载配置，可以停止或重启 nginx ，或向主进程发送信号。可以用 nginx -s...","categories": ["server"],
        "tags": ["nginx"],
        "url": "https://linotes.netlify.com/server/nginx.basic/",
        "teaser":null},{
        "title": "Nginx 常用配置",
        "excerpt":"反向代理 获取用户真实 IP 地址 为了实现反向代理，nginx 增加了 ngx_http_proxy_module 模块。配置文件中的 proxy_set_header 指令即属于该模块，用于 重写 从 nginx 转出的请求头。 配置方法 proxy_set_header Host $host;proxy_set_header X-Forward-For $remote_addr;Host 字段 HTTP 请求头中的 Host 字段表示所请求的 目的主机名。 如果后端 web 服务器使用了类似防盗链功能，或者根据 HTTP header 中的 Host 字段来进行路由或过滤功能的话，nginx 必须重写请求头中的 Host 字段，否则会导致请求失败。 为什么不用 $http_host 而用 $host： 变量 $http_host 与 $host 同样都能表示请求头中的 Host 字段，为什么不用前者？ 如果 Host...","categories": ["server"],
        "tags": ["nginx","配置"],
        "url": "https://linotes.netlify.com/server/nginx.common.conf/",
        "teaser":null},{
        "title": "Nginx 的内容缓存",
        "excerpt":"本节内容：如何启用并配置缓存，用于缓存从代理服务器接收的响应。 启用响应缓存 若想启用缓存，需在 http 中使用 proxy_cache_path 指令。其第一个强制参数为用于缓存内容的本地文件系统路径，第二个强制参数为 keys_zone，定义 共享内存区（shared memory zone）的名称和大小，该共享内存用于保存缓存项目的元数据： http { ... proxy_cache_path /data/nginx/cache keys_zone=one:10m;}然后，想为哪些 context 来缓存服务器的响应，就在其中使用 proxy_cache 指令，用来指定内存区的名称，即 proxy_cache_path 指令中的 keys_zone 参数中的名称，此处为 one： http { ... proxy_cache_path /data/nginx/cache keys_zone=one:10m; server { proxy_cache one; location / { proxy_pass http://localhost:8000; } }}注意，由 keys_zone 参数指定的大小，不会限制被缓存下来的响应数据的总量。被缓存的响应和其元数据的副本一同保存在文件系统中特定的文件中，若想限制被缓存的响应数据的总量，可以在 proxy_cache_path 指令中使用 max_size 参数。 nginx...","categories": ["server"],
        "tags": ["nginx","缓存"],
        "url": "https://linotes.netlify.com/server/nginx.content.caching/",
        "teaser":null},{
        "title": "Nginx 主要用途",
        "excerpt":"提供静态内容 根目录与索引文件 根目录 使用 root 指令来设定根目录，web 服务会从中查找需要服务的文件。为了获取某个请求的文件路径，nginx 会把请求 URI 追加到 root 设定的路径后面。这个指令可以放在 http {}、server {} 或 location {} 中的任何层级。 server { root /www/data; location / { } location /images/ { } location ~ \\.(mp3|mp4) { root /www/media; }}本例中，root 指令为一个虚拟服务器指定根目录，应用于所有的 location 块。 对于以 /images/ 开头的 URI，nginx 会在文件系统的 /www/data/images/ 目录中查找对应的文件。 而对于以 .mp3...","categories": ["server"],
        "tags": ["nginx","用途","反向代理"],
        "url": "https://linotes.netlify.com/server/nginx.function/",
        "teaser":null},{
        "title": "Nginx 入门",
        "excerpt":"nginx 有一个主进程和几个工人进程。主进程的主要目标是读取和鉴定配置，以及维护工人进程。由工人进程来处理请求。 nginx 采用基于事件的模型和依赖于操作系统的机制在工人进程之间有效地分布请求。工人进程的数量由配置文件定义，可以是固定的，也可以根据可用 CPU 核心的数量来自动调整。 nginx 及其模块的工作方式决定于配置文件。在 CentOS 7 中，该配置文件默认为 /etc/nginx/nginx.conf。 启动，停止，重载配置文件 若要启动 nginx ，可以运行可执行文件，nginx 启动后，它可以通过用 -s 参数调用可执行文件来控制。 nginx -s signal 控制 nginx 的信号 stop ：快速关闭 quit ：优雅关闭 reload ：重新加载配置文件 reopen ：重新打开日志文件如，想要停止 nginx 进程，并需等待工人进程完成各自对请求的处理： nginx -s quit执行该命令的用户应该与启动 nginx 是同一用户。 配置文件中所作的修改必须在重新加载配置文件后，或 nginx 重启之后才能生效。重新加载配置文件： nginx -s reload主进程收到重新加载配置文件的信号以后，它会先对新配置文件进行语法检查，然后再尝试应用配置。 如果一切顺利，主进程会开启新的工人进程，并给老的工人进程发送消息，要求它们关闭。 如果不顺利，主进程会将修改回滚，继续使用原配置。 老工人进程收到关闭的命令之后，会停止接收新的连接，并继续处理当前的请求，直到所有请求都处理完成。然后老工人进程退出。也可以使用 kill...","categories": ["server"],
        "tags": ["nginx"],
        "url": "https://linotes.netlify.com/server/nginx.intro/",
        "teaser":null},{
        "title": "Nginx 的负载均衡",
        "excerpt":"负载均衡是指在多个后端服务器中有效地分配网络流量。 HTTP 负载均衡器 跨多个应用程序实例的负载平衡是一种常用的技术，用于优化资源利用率、最大化吞吐量、减少迟延以及确保容错配置。 把 HTTP 流量代理给一组服务器 要想把 HTTP 流量负载平衡给一组服务器的话，首先需要用 upstream 指令来定义一个组，置于 http 内。该组中的服务器用 server 指令来配置。即嵌套关系为 http { upstream { server }} http { upstream backend { server backend1.example.com; server backend2.example.com; server 192.0.0.1 backup; # 这三个是服务器组的成员，而非虚拟服务器 } server { # 这是虚拟服务器 location / { proxy_pass http://backend; } }}upstream 定义一组服务器，命名为 backend。由三个服务器配置组成。...","categories": ["server"],
        "tags": ["nginx","负载均衡"],
        "url": "https://linotes.netlify.com/server/nginx.load.balancer/",
        "teaser":null},{
        "title": "Nginx 安全控制",
        "excerpt":"nginx 用作 HTTPS 服务器 配置 HTTPS 服务器 要想配置一台 HTTPS 服务器，在 nginx.conf 文件中的 server 块中，需要添加 listen 指令，为其使用 ssl 参数，然后指定服务器证书和私钥文件的位置： server { listen 443 ssl; server_name www.example.com; ssl_certificate www.example.com.crt; ssl_certificate_key www.example.com.key; ssl_protocols TLSv1 TLSv1.1 TLSv1.2; ssl_ciphers HIGH:!aNULL:!MD5; #...}服务器的证书是一个公共的实体，它被发送给每一个连接到 nginx 服务器的客户端。 私钥是一个安全实体，应该保存在文件中，对其访问需加以限制。nginx 的主进程必须有权读取该文件。 另外，私钥也可以和证书保存在同一个文件中： ssl_certificate www.example.com.cert;ssl_certificate_key www.example.com.cert;这种情况下，就必须限制对该文件的访问。虽然二者在同一个文件中，但只有证书会发送给客户端。 ssl_protocols 和 ssl_ciphers 指令可用来要求客户端，在建立连接时，只能使用 SSL/TLS 的强版本及秘钥算法。...","categories": ["server"],
        "tags": ["nginx","安全"],
        "url": "https://linotes.netlify.com/server/nginx.security/",
        "teaser":null},{
        "title": "vsftpd 的配置",
        "excerpt":"FTP 服务简介 FTP 服务仅使用 TCP 协议，不支持 UDP。比较特别的是，FTP 服务同时要使用 2 个端口，通常把 21 做为 命令端口，也叫控制端口，用来传输控制命令；把 20 做为 数据端口，用来传输数据。 当数据通过数据流传输时，控制流处于空闲状态。而当控制流空闲很长时间后，客户端的防火墙会将其会话置为超时，这样当大量数据通过防火墙时，会产生一些问题。此时，虽然文件可以成功的传输，但因为控制会话，会被防火墙断开；传输会产生一些错误。 FTP 虽然可以被终端用户直接使用，但是它是设计成由 FTP 客户端程序来控制的。 运行 FTP 服务的许多站点都开放匿名服务，在这种设置下，用户不需要帐号就可以登录服务器，默认情况下，匿名用户的用户名是：anonymous。这个帐号不需要密码，虽然通常要求输入用户的邮件地址作为认证密码，但这只是一些细节或者此邮件地址根本不被确定，而是依赖于 FTP 服务器的配置情况。 连接模式 FTP 有两种使用模式：主动（Port）和被动（Passive）。 二者的区别：主动模式中数据连接是由服务器发起的，而被动模式中则是由客户端发起的。 FTP 服务器一般都支持主动和被动模式，连接采用何种模式是由 FTP 客户端程序决定的。 主动模式 主动模式连接过程 客户端发起命令连接：客户端打开一个大于 1024 的 随机 的端口 C，连接到服务器端口 21。 客户端打开数据端口：客户端打开端口 C+1，同时向服务器发送命令 PORT C+1，告知自己的数据端口号。 服务器发起数据连接 ：服务器打开端口 20，连接到客户端端口...","categories": ["server"],
        "tags": ["ftp","vsftpd"],
        "url": "https://linotes.netlify.com/server/vsftpd/",
        "teaser":null},{
        "title": "LAMP 架构工作原理",
        "excerpt":"LAMP 架构简介 LAMP 是指一组通常一起使用来运行动态网站或者服务器的自由软件。 名称首字母缩写： L ：Linux，操作系统 A ：Apache，网页服务器 M ：MariaDB 或 MySQL，数据库管理系统（或者数据库服务器） P ：PHP、Perl 或 Python，脚本语言虽然这些开放源代码程序本身并不是专门设计成同另几个程序一起工作的，但由于它们的廉价和普遍，这个组合变得流行。一起使用的时候，它们表现的像一个具有活力的 “解决方案包”。 安装的简便性使人误以为这些软件会自行顺利地运行，但是实际情况并非如此。最终，应用程序的负载会超出后端服务器自带设置的处理能力，应用程序的性能会降低。LAMP 安装需要不断监控、调优和评估。 PHP PHP 简介 PHP，最初代表 Personal Home Page，后来代表 PHP: Hypertext Preprocessor。 PHP 代码可以嵌入 HTML 代码，还可以与各种网页模板系统、网页内容管理系统、网页框架等一起工作。PHP 代码通常由 PHP 解释器来处理，解释器可以是网页服务器的一个 模块，也可以是一个 CGI 可执行文件。网页服务器再把解释的结果与网页合并在一起，解释的结果有可能是各类型的数据，包括图片。PHP 代码也可以用命令行来执行，也可以用来开发用户端的 GUI 应用程序。 标准的 PHP 解释器，由 Zend Engine 开发，根据 PHP...","categories": ["framework"],
        "tags": ["lamp","原理"],
        "url": "https://linotes.netlify.com/framework/lamp_intro/",
        "teaser":null},{
        "title": "MySQL 的帐户管理",
        "excerpt":"用户名与密码 本节内容主要引自 MySQL 8.0 Reference Manual MySQL 把帐户保存在 mysql 系统数据库的 user 表 中。每个帐户由 用户名 和 客户端主机 两部分组成。 每个帐户可以拥有密码，MySQL 还支持验证的插件，因此完全可以使用某个外部的验证方法进行帐户的验证。 MySQL 的用户名和密码与操作系统中使用的有一些不同： 用户名与操作系统无关 MySQL 的用户名与操作系统中的用户名没有任何关系。 许多 MySQL 的客户端默认会尝试使用当前的 Linux 用户名做为 MySQL 用户名，但这只是为了方便而已。这个默认值可以通过使用 -u 选项来覆盖，因此任何可以尝试用任何用户名来连接服务端，因此应该为所有 MySQL 帐户设置密码，以保证数据的安全。 用户名长度限制 MySQL 用户名最多为 32 个字符，操作系统用户名的长度限制通常与此有所区别，如 Unix 默认为 8 个字符，一般的 Linux 为 32 个字符。 在服务端和客户端中，对于 MySQL...","categories": ["database"],
        "tags": ["mysql","帐户"],
        "url": "https://linotes.netlify.com/database/account.managemt/",
        "teaser":null},{
        "title": "MySQL 的备份与恢复",
        "excerpt":"备份与恢复的类型 本节内容主要引自 MySQL 8.0 Reference Manual 物理备份与逻辑备份 物理备份 备份目录或文件的原始副本，数据库的内容就保存在这些文件中。适用于大型的、重要的数据库，发生问题时需要快速恢复。 物理备份的特点 备份由数据库目录及文件的副本组成。通常是 MySQL 数据目录的完整副本。 物理备份的速度比逻辑备份更快，因为备份过程只需复制，不用转换。 输出比逻辑备份更简洁 备份和恢复的粒度从整个数据目录到独立的文件。 除了备份数据库以外，还可以备份相关文件，如日志及配置文件。 无法备份 MEMORY 表中的数据，因为其内容没有保存在磁盘中。 便携性不好，其他主机需要有相同或类似的硬件。 备份时最好离线，否则服务端需要进行适当的锁定，以便在备份过程中不会修改数据库的内容。常用物理备份工具 物理备份的常用工具包括 mysqlbackup，这是 MySQL 企业版的备份工具，用于 InnoDB 或任何其他表。 当然还有其它的文件系统级别的命令：如 cp、scp、tar、rsync，用于 MyISAM 表。 ndb_restore 用于恢复 NDB 表。 逻辑备份 以逻辑数据库结构和内容的方式来表示备份的信息。适用于少量数据，有时需要编辑数据或表格结构，或在其它平台上重建数据。 逻辑备份的特点 通过查询 MySQL 服务端来获取数据库的结构和内容。 备份速度比物理备份要慢，因为需要访问数据库并转换为逻辑格式。如果输出需要写到客户端一侧，服务端还要将其发送给备份程序。 输出更占空间，尤其是以文本格式保存时。 备份和恢复的粒度有：所有数据库、数据库中所有表、某个表，与存储引擎无关。 无法备份日志、配置文件及其它相关文件 备份以逻辑格式保存，高便携性 备份时允许服务端运行，无需离线常用逻辑备份工具 常用的逻辑备份工具包括 mysqldump...","categories": ["database"],
        "tags": ["mysql","备份"],
        "url": "https://linotes.netlify.com/database/backup/",
        "teaser":null},{
        "title": "MySQL 入门",
        "excerpt":"MySQL 简介 本节内容主要引自 MySQL 8.0 Reference Manual MySQL 是一款开源的关系数据库管理系统（RDBMS），最早由瑞典公司 MySQL AB 拥有，现在归 Oracle 所有。对于专有使用，有几个付费版本可用，并提供额外的功能。 MySQL 是开源网页应用软件栈 LAMP 的中心组件。MySQL 常被用于许多大型网站。 MySQL 是用 C 和 C++ 语言编写的，可工作于许多系统平台。 当前仍在支持的版本为 5.5、5.6、5.7，最新版本为 8.0。 MySQL 特点 MySQL 提供两个版本：开源社区服务器版和企业专用服务器版。 企业版含有一系列专用的扩展，以服务器插件的形式安装。 为多种编程语言提供了 API，包括 C、Java、PHP、Python、Ruby 等 支持多线程，充分利用 CPU 资源，支持多用户 优化的 SQL 查询算法，有效地提高查询速度 既能够作为一个单独的应用程序在客户端服务器网络环境中运行，也能够作为一个程序库而嵌入到其他的软件中 提供 TCP/IP、ODBC 和 JDBC 等多种数据库连接途径 提供用于管理、检查、优化数据库操作的管理工具...","categories": ["database"],
        "tags": ["mysql"],
        "url": "https://linotes.netlify.com/database/intro/",
        "teaser":null},{
        "title": "MySQL 的安全",
        "excerpt":"一般安全问题 本节内容主要引自 MySQL 8.0 Reference Manual MySQL 安全准则 在讨论安全问题时，有必要从全局的角度去考虑对服务器主机整体的保护，而非仅仅针对 MySQL 服务端。各种可能的攻击包括：窃取、修改、回放、拒绝服务攻击。 MySQL 使用基于 ACL 的安全防护，针对所有的连接、查询及其它可能的操作。也支持 MySQL 客户端与服务端使用 SSL 加密连接。 永远不要授权任何人访问 mysql 数据库中的 user 表，除 MySQL 的 root 帐户。 要了解 MySQL 访问权限系统的工作原理。使用 GRANT 和 REVOKE 语句来控制访问，不要给予不必要的权限，不要为所有主机授权，而应有针对性地对某些主机授权。 如果使用 mysql -u root 能够无需密码就成功连接到服务端，则任何人都可以成为超级用户。因此要为 root 设置密码。 使用 SHOW GRANTS 语句可以检查哪些帐户有哪些访问权限，可以用 REVOKE 语句移除不必要的权限。 不要在数据库中保存明文密码，而应该使用 SHA2()...","categories": ["database"],
        "tags": ["mysql","安全"],
        "url": "https://linotes.netlify.com/database/security/",
        "teaser":null},{
        "title": "MySQL 服务端的管理",
        "excerpt":"MySQL Server 本节内容主要引自 MySQL 8.0 Reference Manual MySQL 服务端 服务端的配置 MySQL 的服务端程序为 mysqld，它包含许多命令 选项 及系统 变量，这些都可以在启动服务端时进行设置。 查看所有选项和系统变量 $ mysqld --verbose --help该命令会列出所有的选项和可配置的系统变量。 查看服务端运行中会使用的系统变量 mysql&gt; SHOW VARIABLES;查看服务端运行中的状态信息 mysql&gt; SHOW STATUS;在 shell 中查看系统变量和状态信息 $ mysqladmin -u root -p variables$ mysqladmin -u root -p extended-status服务端选项 启动 mysqld 服务时，可以通过 命令行、配置文件、变量 这三种方法来 定义 其运行的各种 选项。 在多数情况下，我们希望服务端每次都用同样的选项来工作，因此修改配置文件更满足这个要求。...","categories": ["database"],
        "tags": ["mysql","server"],
        "url": "https://linotes.netlify.com/database/server.managemt/",
        "teaser":null},{
        "title": "rsync 的用法",
        "excerpt":"Remote Sync，1996 年 由 Andrew Tridgell 和 Paul Mackerras 编写。几乎所有发行版都内置了该工具。 rsync 简介 rsync 是可以实现增量备份的工具。配合任务计划，rsync 能实现定时或间隔同步，配合 inotify 或 sersync，可以实现 触发式的实时同步。 可用于 本地 复制及远程复制，不支持两个远程主机间的同步。 提供了大量的参数来控制其行为的每个要素，可以对要复制的文件进行非常灵活的设定。 其 delta-transfer 机制 比较著名，该机制通过 仅传输两端文件的差异部分，而减少了网络传输的数据量。 广泛应用于备份及镜像，同时还是一个功能强大的复制工具。 默认 使用一种 快速检查 机制来确定需传输的文件。rsync 特点 支持复制链接、设备、所有者、组、权限 支持排除特定文件，用法与 GNU tar 相似 支持 CVS 模式的排除 支持使用任何透明的远程 shell ，包括 ssh 或 rsh 无需超级用户身份就可使用 通过管道传输文件，减小延迟...","categories": ["app"],
        "tags": ["rsync","备份","同步"],
        "url": "https://linotes.netlify.com/app/rsync/",
        "teaser":null},{
        "title": "Python 编程导论",
        "excerpt":"本笔记的教材为 MIT Open Course ：Introduction to Computer Science and Programming，by Prof. Eric Grimson, John Guttag. 像计算机科学家一样思考。 用语言来 描述 我们想让计算机做什么，描述整个的过程。 第一课 ~ 第三课 高级语言 / 低级语言 低级语言：汇编语言，通过简单的操作，把数据从内存的某个位置移动到另一个位置。类似这样的操作。 高级语言：功能更复杂。 通用语言 / 专用语言 解释型语言 / 编译型语言 解释型语言： 源码被检查之后，交给解释器，然后给出输出。基本上是在运行时直接进行操作。 解释型语言比较容易调试，因为还能看到源代码。 编译型语言： 有一个中间步骤，源码需要先送给一个检查器或编译器，或两者合一，产生出来的是对象代码，object code。 这个步骤会进行两个重要的操作：一是帮助检查代码错误，二是在实际运行之前，经常会转换为更高效的指令序列。 编译型语言执行起来更快。 Python 是通用的，高级语言，解释型语言。— Python 语法 语法 语法是指在该语言中，什么才是 合法 的表达。 “cat...","categories": ["programming"],
        "tags": ["python","编程"],
        "url": "https://linotes.netlify.com/programming/progr.intro/",
        "teaser":null},{
        "title": "Bash 入门 01",
        "excerpt":"Bash Guide for Beginners is a good book. 《 Bash Guide for Beginners 》 1. Bash 与 Bash 脚本 空白字符：空格或制表符 1.1 常用的 shell 程序 UNIX 的 shell 程序可以解释用户的命令，无论是用户直接输入的，还是从 shell 脚本读取的。 Shell 脚本是 解释 型的，而不是编译型的。Shell 从脚本的每一行读取命令，并在系统中搜索这些命令。 脚本中可以使用可执行文件。 除了向内核传送命令之外，shell 的主要任务是提供一个用户环境，该环境可用 shell 配置文件来单独配置。 shell 类型 sh 即 Bourne Shell。它是最早的 shell，现在仍在使用。 它是基本的 shell，特性不多。虽不是标准的 shell，但为了...","categories": ["programming"],
        "tags": ["bash","环境"],
        "url": "https://linotes.netlify.com/programming/bash01/",
        "teaser":null},{
        "title": "Bash 入门 02",
        "excerpt":"4. 正则表达式 Regular Expressions 4.1 正则表达式 4.1.1 正则表达式简介 正则表达式就是用模板来表示一组字符。 与算术表达式类似，正则表达式也是通过 “用各种操作符连接较小的表达式” 而构建起来的。 基本的组件是用来匹配 单个字符 的表达式。包括所有字母及标点在内的大部分字符都可用来匹配自己。有特殊含义的 元字符 可以用 反斜线 来转义。 4.1.2 正则表达式元字符 一个正则表达式后面可以跟一个或多个 元字符。 元字符：一个字符，并不仅仅表示它自身，而是有特殊的含义。 正则表达式操作符： 操作符 效果 . 匹配任何单个字符 ? 最多匹配一次 + 最少匹配一次 * 任意次匹配（零或更多次） {N} 前面字符串匹配 N 次 {N,} 前面字符串匹配 N 或更多次 {N,M} 前面字符串匹配 N ~ M 次 -...","categories": ["programming"],
        "tags": ["shell","bash","sed","awk"],
        "url": "https://linotes.netlify.com/programming/bash02/",
        "teaser":null},{
        "title": "Bash 入门 03",
        "excerpt":"9. 重复性任务 9.1 for 循环 9.1.1 工作方式 for NAME [in LIST ]; do COMMANDS; done 按照 LIST 列表，逐次执行 COMMANDS，直到 LIST 结束。 如果 [in LIST ] 不存在，则会用 in $@ 替换，并用每个位置参数来执行一次 COMMANDS。 执行的最后一条命令的退出状态作为该循环的返回状态。如果因为 LIST 没扩展出任何条目，而导致没有执行任何命令，返回状态为 0。 NAME 可以是变量名，经常习惯地使用 i 做变量名。 LIST 可以是任何字段的列表，列表也可以由命令生成。 COMMANDS 可以是任何命令、脚本、程序、语句。 9.1.2 范例 for i in {1..100..2}do let \"sum+=i\"...","categories": ["programming"],
        "tags": ["bash","for","while","until","变量"],
        "url": "https://linotes.netlify.com/programming/bash03/",
        "teaser":null},{
        "title": "文件描述符简介",
        "excerpt":"文件描述符 文件 I/O 处理文件 I/O 的基本系统调用： open ：请求生成到某文件的连接 close ：请求关闭到某文件的连接 read ：请求通过特定连接来读取文件的部分字节 write ：请求通过特定连接来写入部分字节到文件文件描述符 File Descriptor 由 open 系统调用返回的值称为文件描述符，本质上是内核维护的打开文件数组的一个索引。 int fd = open(\"/dev/sr0\")上面提到的数组即文件描述符表，文件描述符是该表的 索引。针对每一个 open 系统调用，即进程打开一个文件时，内核就会创建一个文件描述符，并将其与底层的文件对象关联起来，该文件可以是设备文件，也可以是其它文件。 文件描述符是内核为了高效管理被打开的文件所创建的索引，是一个非负整数（通常是小整数），用于 指代 被打开的文件，所有执行 I/O 操作 的系统调用都要通过文件描述符。 每个 Unix 进程（除了可能的守护进程）均应有三个标准的 POSIX 文件描述符，对应于三个标准流： 文件描述符 用途 POSIX 名称 标准 I/O 流 0 标准输入 STDIN_FILENO stdin 1 标准输出...","categories": ["kernel"],
        "tags": ["文件描述符","管道"],
        "url": "https://linotes.netlify.com/kernel/filedescriptor/",
        "teaser":null}]
