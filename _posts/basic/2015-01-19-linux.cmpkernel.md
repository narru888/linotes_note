---
toc: true
toc_label: "19. 编译内核"
toc_icon: "code-branch"
title: "Linux 基础 - 19. 编译内核"
tags: kernel linux 编译 内核
categories: "linux"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/linux.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---






## 19.1 内核简介

Linux 主要由 liunx 内核和一些支持模块组成。






### 19.1.1 内核

Kernel

内核是整个操作系统的最底层，它负责了整个 **硬件的驱动**，以及提供各种系统所需的 **核心功能**。包括防火墙机制、是否支援 LVM 或 Quota 等文件系统。如果你的内核不认识某个最新的硬件，那么该硬件也就无法被驱动，当然也就无法使用该硬件。

其实内核就是系统上面的 **一个文件** 而已，其中包含了驱动主机各项硬件的 **检测程序与驱动模块**。

在开机流程中，系统读取 BIOS 并加载 MBR 内的引导程序后，就能够把该内核文件加载到内存中了。然后内核开始检测硬件，挂载根目录，获取内核模块来驱动所有的硬件，之后调用 systemd 依序启动所有系统服务。

内核文件位于 `/boot/` 目录，文件名为 `vmlinuz-*`，一台主机上可以有多个内核文件，但开机时仅能选择一个来加载。多个内核文件可以实现多重启动。








### 19.1.2 内核源码



#### 原厂内核

各主要发行版在发布产品时，都附带内核的源代码。

主要的源代码网站：

CentOS 的 SRPM： http://vault.centos.org

Linux 内核官网： http://www.kernel.org

从 CentOS 7 开始的版本，在版本号后面会接上发布日期，如 `7.1.1503` 表示 CentOS 7.1 是在 2015 年 03 月发布的。

原厂发布的源代码中，含有出厂的默认设置，便于了解内核及模块在出厂时的各项目的参数，可以更好地配合系统的默认参数来加以修改，编译的难度较低。




#### 内核补丁

每一次发布新内核时，同时也会发布该版本与前一版本的 **差异补丁文件**。




#### 内核源码目录结构

`arch`  硬件平台相关代码，每种平台一个目录，如 `x86`，`arm64` 等

`block`  部分块设备驱动程序

`crypto`  常用加密和散列算法（如 AES、SHA 等），还有一些压缩和 CRC 校验算法

`Documentation`  内核各部分的通用解释和注释

`drivers`  设备驱动程序

`firmware`  旧硬件的固件

`fs`  内核支持的文件系统，如 xfs，nfs 等

`include`  头文件。其中，和系统相关的头文件被放置在linux子目录下。

`init`  内核初始化代码

`ipc`  进程间通信的代码

`kernel`  内核的最核心部分，包括进程调度、定时器等，和平台相关的一部分代码放在 archmm 目录下

`lib`  公用的函数库

`mm`  内存管理代码

`net`  网络相关代码，实现了各种常见的网络协议。

`security`  包括 selinux 在内的安全性设置

`sound`  常用音频设备的驱动程序等

`virt`  与虚拟化有关的信息，KVM （Kernel base Virtual Machine）等

`Makefile`  配合 `make` 命令进行一系列编译期间操作的配置文件

`README`  编译说明文档，通常只是简要的说明，更多的文档在 `Documentation` 目录


























## 19.2 自定义内核

内核是通过源代码构建而成的，如果获得了内核的源代码，可以根据需要进行修改，**重新构建**，生成自定义的内核 RPM 包。





### 19.2.1 为什么要重新构建内核

##### 创建自已的系统调用

希望把自己的程序放进内核，平时使用自已的系统调用。

##### 需要新功能

有些新版本的内核会提供一些新的功能，如果恰好是你需要的，就可以通过更新内核来获得。

另外，新的内核对新的硬件支持的也更完美，能充分发挥新硬件的性能。

##### 需要精简内核

如果对于系统 **稳定性** 要求很高，可以通过重新构建内核来删除不需要的部分。组件越少，相对来说稳定性就越有保证。

##### 提升安全性

新版本的内核经常会修补之前的安全漏洞，提升了安全性。

虽说如此，就像 CentOS Wiki 中说的，99.9% 的用户不再需要重新构建自己的内核了，大多数情况下，可能只需要构建一个 **内核模块** 就能满足特定的需求。






### 19.2.2 构建内核流程

本文以 **CentOS 7** 为例构建内核。CentOS 6 在构建过程中有部分内容[稍有不同](https://wiki.centos.org/HowTos/Custom_Kernel)。



#### 构建准备工作

##### 构建所需工具

开始构建之前，准备好 **开发工具** 以及一个 **配置文件**。配置文件用来设定内核中哪些东西需要构建，哪些不需要。

对于 CentOS，可以根据当前主机的情况，选择运行以下命令来准备开发工具：

```
yum groupinstall "Development Tools"
yum install ncurses-devel
yum install hmaccalc zlib-devel binutils-devel elfutils-libelf-devel
```

或者借助 `yum-builddep` 命令：

```
sudo yum-builddep -y kernel
sudo yum install -y pesign
```

`pesign` 是为二进制文件签名的工具。

##### 确定系统硬件

可以用以下命令统计当前主机所有硬件设备。

`lscpu`，`lspci`，`lsusb`，`lsblk`，`hal-device`

##### 确定要保留的内核功能

内核功能选择的原则：

* 确认要使用的功能，直接构建进内核
* 可能会用到的功能，尽量构建成模块
* 不了解的可以保留默认值，或构建成模块

##### 取得内核 SRPM

可以从发行版软件库或 kernel.org 来下载，建议下载 SRPM，相比 Tarball 更便于构建 RPM。

记住，从发行版下载的内核与从 kernel.org 下载的完全不同，即使是版本号相同。因为发行版厂商都会对原版内核进行修改和调整。

出于对系统的保护，[CentOS 建议以普通用户的身份来构建，而不使用超级用户。](http://www.owlriver.com/tips/non-root/)
{: .notice--info}


可以用以下命令来下载内核 SRPM：

```
yumdownloader --source kernel
```

##### 解包 SRPM

使用普通用户运行 `rpm -i kernel-3.10.0-862.el7.src.rpm` 命令来解开软件包，**SPEC 文件** 默认被放到 `~/rpmbuild/SPECS` 目录，其它的文件（内核源代码压缩包、补丁等）都被放到 `~/rpmbuild/SOURCES` 目录。

下一步，把内核 **源代码** 解压到 `~/rpmbuild/BUILD/kernel-*/linux-*/` 目录：

```
cd ~/rpmbuild/SPECS
rpmbuild -bp --target=$(uname -m) kernel.spec
```



#### 配置内核

##### 清理缓存

如果是首次构建，本步可以省略。如果已构建过内核，建议再次构建前要清理一下缓存。

###### `make clean`

用于删除前一次构建残留的中间文件。

`make clean` 会删除所有的目标文件和内核目标文件，即 `*.o`，`*.ko`，以及一些其它文件。

```
cd ~/rpmbuild/BUILD/kernel-*/linux-*/
make clean
```

###### `make mrproper`

`make mrproper` 命令会删除所有 `make clean` 要删除的文件，再加上用户的配置文件（.config）、依赖关系文件，以及其它 make config 生成的文件。

```
cd ~/rpmbuild/BUILD/kernel-*/linux-*/
make mrproper
```

##### 创建 `.config`

本步为构建内核最重要的环节，用于选择、确定需要构建的内核功能，通常由一个名为 `.config` 的配置文件决定。

在构建内核时，`make` 命令需要配合 `.config` 来工作，该配置文件的内容为 **内核功能列表**。

`.config` 文件的内容决定了要构建内核的哪些驱动和功能，因此要花一点时间来按照准备工作中计划好的功能清单，逐项地落实到配置文件中。同时也指明了哪些需要以外部模块化的方式构建，不要构建到内核中。

###### 复制 `.config`

该配置文件无需手动创建，可以从当前版本的配置文件 **复制一份**：

```
cd ~/rpmbuild/BUILD/kernel-*/linux-*/
cp /boot/config-`uname -r`* .config
```

或者从下载的内核源代码中复制：

```
cd ~/rpmbuild/BUILD/kernel-*/linux-*/
cp configs/kernel-3.10.0-x86_64.config .config
```

###### 自定义内核配置

上面得到的 `.config` 可借助 `make menuconfig` 做进一步的自定义。

在此之前建议先备份一下 `.config`：

```
cp .config config.bak
```

`make menuconfig` 运行的程序是一个基于 ncurse 库编写的图形界面工具，允许用户逐项进行选择要构建的内核功能等项目：

```
make menuconfig
```

![image-center](/assets/images/menuconfig.png){: .align-center}

`menuconfig` 是 `makefile` 中的一个目标。

程序启动时，如果当前目录存在 `.config` 文件，会将该文件的配置读取到程序中对应的选项。如果不存在，则会以默认配置启动。

用户使用方向键、回车键在各级菜单中导航，空格键切换选择与否，`M` 键将条目模块化。

退出时可以自定义要保存的配置文件名，如果之前不存在 `.config` 文件，会自动保存为该文件。

进行到这里，我们已经获得了自定义的 `.config` 文件。

###### 更新 `.config`

我们需要把修改好的 `.config` 放回 `~/rpmbuild/BUILD/kernel-*/linux-*/configs/` 目录，但之前，还要在其第一行加入当前系统的硬件平台信息，即 `$(uname -i)` 的值，64 位 PC 上通常为 `x86_64`，前面要加上注释井号：

在 `.config` 最前面加上一行：

```
# x86_64
```

然后，把 `.config` 文件拷回 `configs/` 目录：

```
cp .config configs/kernel-3.10.0-`uname -m`.config
```

最后一步，把 `configs/` 目录中所有文件拷到 `~/rpmbuild/SOURCES/` 目录中：

```
cp configs/* ~/rpmbuild/SOURCES/
```



#### [内核 ABI](https://en.wikipedia.org/wiki/Linux_kernel_interfaces#Linux_ABI)

##### Linux ABI 简介

Application Binary Interface

ABI 定义了两个软件模块在特定硬件平台上的二进制接口。它定义了应用内部如何交互，应用如何与内核交互，以及如何和库交互。

Linux ABI 是指 `内核-用户空间` 的 ABI。该 ABI 是指编译好的二进制程序，任何这样的 ABI 都被绑定到指令集中。对于每种不同的硬件平台都要定义各自的指令集的 ABI。

>API，是编程的接口，编写应用程序时候调用的函数之类的东西。对于内核来说，它的 “应用程序” 有两种：一种是在它之上的，用户空间的真正的应用程序，内核给它们提供的是系统调用这种接口，比如 `read(2)`，`write(2)`；另一种就是内核模块了，它们和内核处于同一层，内核给它们提供的是导出的内核函数，比如 `kmalloc()`，`printk()`。这些接口都是你可以在编写程序的时候直接看到的，可以直接拿来用的。

>而 ABI 是另一种形式的接口，二进制接口。除非你直接使用汇编语言，这种接口一般是不能直接拿来用的。比如，内核系统调用用哪些寄存器或者干脆用堆栈来传递参数，返回值又是通过哪个寄存器传递回去，内核里面定义的某个结构体的某个字段偏移是多少等等，这些都是二进制层面上的接口。这些接口是直接给 **编译好的** 二进制用的。换句话说，如果 ABI 保持稳定的话，你在之前版本上编译好的二进制应用程序、内核模块，完全可以无须重新编译直接在新版本上运行。另一种比较特殊的 ABI 是像 `/proc`，`/sys` 目录下面导出的文件，它们虽然不是直接的二进制形式，但也会影响编译出来的二进制，如果它里面使用到它们的话，因此这些 “接口” 也是一种 ABI。

##### 禁用 kABI 检查

CentOS 内核有一个特点，它的 ABI 在整个产品周期内始终保留，拥有一个持续稳定的 ABI 有很大的好处，外部的内核模块可以独立于内核版本来构建，因此无需为每个新版本的内核重新构建。

为了维护 ABI 的一致性，原始的内核 ABI 被记录下来，并保存在一个文件中。构建每个新内核时，该文件都用于进行内核 ABI 的检查。如果新内核配置或修改的方式与已发布的 ABI 不一致，则构建将失败，并显示一条消息，指出发生了 kABI 破坏。此时可以选择重新配置新内核以适应现有的 ABI，或者在构建过程中禁用对 KABI 的检查。

禁用对 kABI 的检查：

```
rpmbuild --without kabichk
```


#### 修改内核 SPEC 文件

```
cd ~/rpmbuild/SPECS/
cp kernel.spec kernel.spec.distro
vi kernel.spec
```

##### 修改 `buildid`

通常定义 `buildid` 的语句会被注释，需将其取消注释：

```
%define buildid .my_identifier
```

注意，`%` 与 `define` 之前不能有空格。
{: .notice--info}

##### 应用补丁

如果没有补丁要应用，则忽略此步。如果有，需要在两处引用：

第一处：

找到 `# empty final patch to facilitate testing of kernel patches` 段落，在这一行下面增加一行，用数字 40000 声明，以便补丁不会与内核补丁冲突：

```
Patch40000: my-custom-kernel.patch
```

第二处：

找到 `ApplyOptionalPatch linux-kernel-test.patch` 段落，在该行之前增加一行：

```
ApplyOptionalPatch my-custom-kernel.patch
```



#### 构建新内核

开始构建：

```
cd ~/rpmbuild/SPECS/
rpmbuild -bb --target=`uname -m` kernel.spec 2> build-err.log | tee build-out.log
```

构建命令中，如有需要，可以选择一些有用的选项，使用 `--with` 或 `--without` 标签：

```
--with baseonly
--without up
--without debug
--without debuginfo
--without fips
--without kabichk
```

例如，只构建最基本的内核：

```
--with baseonly --without debug --without debuginfo
```



#### 安装新内核

构建完成后，自定义的新内核 RPM 文件保存在 `~/rpmbuild/RPMS/` 中的硬件平台的子目录中。

切换到超级用户后，可以使用 `yum` 来安装：

```
yum localinstall kernel-*.rpm
```

也可以用 `rpm` 命令：

```
rpm -ivh kernel-*.rpm
```

如果用 `rpm` 命令安装，需注意提前必须安装 `kernel` 和 `kernel-devel`，不是更新，而是用 `rpm -ivh` 安装。

如果构建了一个比当前安装的内核版本低的内核，安装时需要使用 `--oldpackage` 标签。































## 19.3 内核模块





### 19.3.1 内核模块简介

Loadable Kernel Module，LKM，内核模块是一种 **目标文件**，其中包含了能在内核空间运行的代码。

内核模块是单独的代码，运行在 base kernel，通常用来支持新的硬件、文件系统、系统调用，需要时可以动态地加载或卸载，可以最小化内核的内存占用。

Linux 内核之所以提供模块机制，是因为它本身是一个单内核（monolithic kernel）。单内核的最大优点是效率高，因为所有的内容都集成在一起，但其缺点是可扩展性和可维护性相对较差，模块机制就是为了弥补这一缺陷。借助内核模块，可以轻松地扩展基础内核的功能，而无需重新构建内核。

内核模块的扩展名为 `.ko`，通常位于 `/lib/modules/$(uname -r)/kernel/` 目录。

内核模块是要运行在内核态的代码，所以编写内核模块需要包含的头文件都是内核中的头文件，使用的函数都是内核的函数。


#### 内部模块

In-tree build

内部模块是与内核其它部分一起构建的。

>内核的源代码其结构也是树形的，习惯性地称为 source tree，因此随内核一同发布的内核模块可以称为内部模块，即 `in-tree` module。



#### 外部模块

Out-of-tree build

外部模块是在 **独立的软件包** 中构建的，并且是针对某个 **特定的内核版本** 构建的。



#### 动态内核模块

Dynamic Kernel Module Support，DKMS，动态内核模块支持

DKMS 是一个 **程序框架**，可以编译内核代码树之外的模块。升级内核时，通过 DKMS 管理的内核模块可以被 **自动重新构建** 以适应新的内核版本。
{: .notice--info}

无需等待软件包维护者发布最新版本的内核模块，内核更新时会自动生成和安装新的软件包。

动态内核模块支持框架基本上是内核源代码树的副本，存在于内核源代码之外，保存着特定模块的源代码以及二进制文件。可通过调用 DKMS 来构建、安装、卸载模块。DKMS 要求模块的源代码必须保存在系统中。DKMS 的二进制文件负责构建、安装模块。

DKMS 可以用在两个方向：

* **内核版本升级** 时，自动编译所有的模块。
* **旧系统装新模块**，无需手动编译或预编译软件包。使得新显卡可以用在旧系统上。

DKMS 由一个用户层的 DKM 服务器来管理，并非由内核来管理。当核心需要某模块时，由 DKM 服务器负责把相应的 DKM 加载；当内核的内存资源紧缺时，由 DKM 服务器负责卸载没有被使用的 DKM。














### 19.3.2 内核模块的构建


#### 构建相关软件包

构建内核模块时，根据不同的硬件平台和不同的功能需求，可能需要安装不同的内核软件包：

`kernel`  ：包含支持多处理器系统的内核，对于 x86 系统，只能使用前 4GB 内存

`kernel-devel`  ：包含内核头文件及 makefile，便于构建针对 `kernel` 包的模块

`kernel-PAE`  ：仅适用于 i686 系统，除支持 kernel 包的选项之外，还支持

超过 4GB 内存（x86 最高到 64GB）；

支持 PAE，Physical Address Extension，物理地址扩展，或在支持 PAE 的 x86 处理器上使用三级页面；

内核可使用 4GB 虚拟地址空间，在 x86 系统中，每用户进程可使用接近 4GB 地址空间。

`kernel-PAE-devel`  ：包含内核头文件及 makefile，用于构建针对 `kernel-PAE` 包的模块

`kernel-xen`  ：包含运行虚拟机所需要的内核

`kernel-xen-devel`  ：包含内核头文件及 makefile，用于构建针对 `kernel-xen` 包的模块




#### KBUILD

`kbuild` 是早期专门用于构建外部模块的工具，它需要提前编译好的完整的内核。实际上 `kbuild` 不是一个程序，它是由一系列内置于内核的脚本组成的，其构建的过程也是靠 make 来完成的。

构建模块：

```
make -C <path to kernel src> M=$PWD
```

安装模块：

```
make -C <path to kernel src> M=$PWD modules_install
```



#### DKMS

`dkms` 命令用于动态内核模块的管理。它会把模块编译、安装到内核代码树中，卸载模块时，可以恢复之前版本的模块。

默认情况下，会把模块安装到当前的内核代码树，可以通过选项来指定特定的代码树来安装。

要想使用 DKMS 来管理模块，首先要把模块的代码放到 `/usr/src/` 目录中，同时还需要一个配套的 `.conf` 配置文件。

DKMS 还支持基于条件的构建、打补丁等。

##### 语法

```
dkms <command> <module>/<version>
```

`dkms autoinstall`  重新构建模块

`dkms uninstall`  将模块从内核删除

`dkms remove`  将 <moudle>/<moudule-version> 从 DKMS 目录树删除

`dkms status`  查看 DKMS 的当前状态、版本，包括源码树内的模块

`dkms mkrpm`  在 `/var/lib/dkms/<module>/<module-version>/rpm/` 目录中生成一个 RPM 文件























### 19.3.3 模块管理工具


#### 查看模块信息

模块名通常使用 `_` 或 `-` 连接，但是这些符号在 modprobe 命令和 `/etc/modprobe.d/` 配置文件中都是可以相互替换的。

##### 查看内核中已加载的模块：

```
$ lsmod
```

##### 查询内核模块的信息：

```
$ modinfo module_name
```

##### 查看所有模块的配置信息：

```
$ modprobe -c | less
```

`modprobe` 用于向内核中增加、删除模块。它很智能，会基于模块依赖关系进行加载、卸载的操作。

##### 查看某个模块的配置信息：

```
$ modprobe -c | grep module_name
```

##### 查看已加载模块所用的选项：

```
$ systool -v -m module_name
```

##### 查看模块的依赖关系：

```
$ modprobe --show-depends module_name
```


#### 自动加载模块

目前，所有必要模块的加载均由 udev 自动完成。所以，如果不需要使用任何额外的模块，就没有必要在任何配置文件中添加启动时加载的模块。但是，有些情况下可能需要在系统启动时加载某个额外的模块，或者将某个模块列入黑名单以便使系统正常运行。

systemd 读取 `/etc/modules-load.d/` 中的配置文件，加载额外的内核模块。配置文件名称通常为 `/etc/modules-load.d/<program>.conf`。格式很简单，一行一个要读取的模块名，而空行以及第一个非空格字符为 `#` 或 `;` 的行会被忽略，如：

```
# Load virtio-net.ko at boot
virtio-net
```


#### 手动加载卸载模块

控制内核模块载入/移除的命令是 kmod 软件包提供的, 要手动加载模块的话，执行:

```
# modprobe _module_name_
```

按文件名加载模块:

```
# insmod filename [args]
```

如果升级了内核但是没有重启，路径 `/usr/lib/modules/$(uname -r)/` 已经不存在。`modprobe` 会返回错误 1，没有额外的错误信息。如果出现 `modprobe` 加载失败，请检查模块路径以确认是否是这个问题导致。
{: .notice--info}

如果要移除一个模块：

```
# modprobe -r _module_name_
```

或者:

```
# rmmod _module_name_
```



#### 配置模块参数

##### 手动加载时设置

传递参数的基本方式是使用 modprobe 选项，格式是 `key=value`：

```
# modprobe module_name parameter_name=parameter_value
```

##### 使用 `/etc/modprobe.d/`中的文件

要通过配置文件传递参数，在 `/etc/modprobe.d/` 中放入任意名称 `.conf` 文件，加入:

```
options modname parametername=parametercontents
```

例如：

```
# On thinkpads, this lets the thinkfan daemon control fan speed
options thinkpad_acpi fan_control=1
```

##### 使用内核命令行

如果模块直接编译进内核，也可以通过启动管理器 GRUB 的内核行加入参数：

```
modname.parametername=parametercontents
```

例如:

```
thinkpad_acpi.fan_control=1
```


#### 别名

有些模块具有别名，以方便其它程序自动加载模块：

```
# Lets you use 'mymod' in MODULES, instead of 'really_long_module_name'
alias mymod really_long_module_name
```


**禁用** 这些别名可以阻止自动加载，但是仍然可以手动加载：

```
# Prevent autoload of bluetooth
alias net-pf-31 off

# Prevent autoload of ipv6
alias net-pf-10 off
```



#### 禁用内核模块

对内核模块来说，黑名单是指禁止某个模块加载的机制。当对应的硬件不存在或者加载某个模块会导致问题时很有用。

##### 使用 `/etc/modprobe.d/` 中的文件

在 `/etc/modprobe.d/` 中创建 `.conf` 文件，使用 `blacklist` 关键字屏蔽不需要的模块，例如如果不想加载 `pcspkr` 模块：

```
# Do not load the pcspkr module on boot
blacklist pcspkr
```

`blacklist` 命令将屏蔽一个模块，所以 **不会自动加载**，但是如果其它非屏蔽模块需要这个模块，系统依然会加载它。
{: .notice--info}

要避免这个行为，可以让 modprobe 使用自定义的 `install` 命令，直接返回导入失败：


```
vi /etc/modprobe.d/blacklist.conf
...
install MODULE /bin/false
...
```

这样就可以屏蔽模块及所有依赖它的模块。

##### 使用内核命令行

同样可以通过内核命令行禁用模块：

```
modprobe.blacklist=modname1,modname2,modname3
```

当某个模块导致系统无法启动时，可以使用此方法禁用模块。




#### 模块未加载问题处理

如果出现模块在启动时未加载，而且启动日志中 `journalctl -b` 显示模块被屏蔽，但是 `/etc/modprobe.d/` 中未找到屏蔽设置，请检查 `/usr/lib/modprobe.d/` 目录。

`vermagic` 字符串与内核不一致的模块不会被加载，如果确认模块与当前内核兼容，可以用  `modprobe --force-vermagic` 参数加载，跳过检查。

忽略模块检查，可能因为不兼容导致系统崩溃或不可预知行为，请谨慎使用 `--force-vermagic`。
{: .notice--warning}














### 19.3.4 编译内核模块



#### 编译内部模块

编译内部模块有明显的劣势，因为它依赖于编译时的内核版本，一旦要在新版本的内核中使用，或硬件架构有所变化，就必须重新编译。

假设在为 cifs 内核模块应用了一次更新补丁之后，现在要重新构建该模块。

`~/rpmbuild/BUILD/kernel-2.6.18/linux-2.6.18-i686/fs/cifs/`

##### 应用更新补丁文件

##### 配置内核

切换到内核源代码根目录，如果是首次编译该内核，进行必要的配置，务必确保 cifs 做为模块构建。

```
cd ~/rmpbuild/BUILD/kernel-2.6.18/linux-2.6.18-i686
make oldconfig
make menuconfig
make prepare
```

##### 更新内核源文件

```
make modules_prepare
```

实际上，编译单独的内核模块之前，如果能先把内核完整地编译一遍是最好的，因为构建过程会生成构建模块所需要的配置信息及头文件。当然不编译内核也是可以的，可以使用 `make modules_prepare` 命令来 **确保内核源代码包含构建模块所需要的信息**。这个目标的存在基本上就是为了这个目的。

但 `make modules_prepare` 不会构建 `Module.symvers`，即使设置了 `CONFIG_MODVERSIONS`。因此，要想让模块的版本正常工作，还是需要完整地编译内核的。

##### 编译模块

```
make M=fs/cifs
```

通过把模块的相对路径做为参数，来编译该模块。

模块所在的目录可以放置于任何地方。例如：如果将其放置在 `~/mycifs/` 目录，则上面的命令可以修改为：

```
make M=~/mycifs
```

##### 剥离冗余符号

如果编译该模块不是为了调试，此时需要剥离掉无用的符号：

```
strip --strip-debug fs/cifs/cifs.ko
```

##### 复制到系统模块目录

用超级用户权限把构建好的模块复制到模块目录：

```
sudo cp fs/cifs/cifs.ko /lib/modules/`uname -r`/extra
```

##### 更新模块依赖关系

```
sudo depmod -a
```

##### 更新内核源代码版本号

修改内核源代码根目录中的 `Makefile`，更新其中的 `EXTRAVERSION` 变量的值，额外版本号可以是以下形式的一种：

```
EXTRAVERSION = -419.el5
EXTRAVERSION = -419.el5PAE
EXTRAVERSION = -419.el5xen
EXTRAVERSION = -419.el5.centos.plus
EXTRAVERSION = -419.el5.centos.plusPAE
EXTRAVERSION = -419.el5.centos.plusxen
```

在编译完标准内核的模块之后，更新 `EXTRAVERSION` 变量，然后运行 `make modules_prepare`，最后运行 `make M=fs/cifs` 来构建带新版本号的模块。






#### 构建动态模块

使用 DKMS 来构建内核模块。

使用与上面相同的例子来构建、安装 cifs 模块。整个过程都要用 **root** 来操作。

目前模块源代码在这里： `~/rpmbuild/BUILD/kernel-2.6.18/linux-2.6.18-i686/fs/cifs/`



##### 安装开发工具包

```
yum update kernel*
reboot
......
yum install kernel-devel
```

##### 安装 DKMS 软件包

从 EPEL 软件库安装 dkms 软件包

```
wget -P /etc/yum.repos.d/ http://mirrors.aliyun.com/repo/epel-7.repo 
yum clean all
yum install dkms
```

##### 创建源代码目录

在 `/usr/src/` 目录中创建模块目录，命名格式为 `<module>-<module-version>`：

```
mkdir /usr/src/cifs-1.45fixed/
```

##### 复制源代码

```
cd ~/rpmbuild/BUILD/kernel-2.6.18/linux-2.6.18-i686/fs/cifs
cp -a * /usr/src/cifs-1.45fixed/
```

##### 创建模块配置文件

```
cd /usr/src/cifs-1.45fixed
vi dkms.conf
```

`dkms.conf` 需要包含以下内容：

```
PACKAGE_NAME="cifs"
PACKAGE_VERSION="1.45fixed"
BUILT_MODULE_NAME[0]="cifs"
DEST_MODULE_LOCATION[0]="/kernel/fs/cifs/"
AUTOINSTALL="yes"
```

`DEST_MODULE_LOCATION[0]` 参数仅在 **替换** 了某个 **内部模块** 时才使用。所以其值在安装模块时会被忽略，因为模块始终会被安装到 `/lib/modules/<kernel-version>/extra/` 目录中。用这个参数的目的是，卸载该外部模块时，之前被替换的 **旧的内部模块** 应该被 **恢复** 到该位置。
{: .notice--info}

##### 加入 DKMS 目录树

把 <module>/<module-version> 加入 DKMS 目录树。

```
dkms add -m cifs/1.45fixed
```

DKMS 会创建符号链接 `/var/lib/dkms/cifs/1.45fixed/source/`，指向 `/usr/src/cifs-1.45fixed`。

##### 在 DKMS 的控制下构建模块

```
dkms build -m cifs/1.45fixed
```

##### 在 DKMS 的控制下安装模块

```
dkms install -m cifs/1.45fixed
```
