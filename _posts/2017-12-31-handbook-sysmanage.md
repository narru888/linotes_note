---
toc: true
toc_label: "速查手册-系统管理"
toc_icon: "book"
title: "速查手册-系统管理"
tag: [systemd,init,systemctl,service,服务]
category: "handbook"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/service.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
published: false
---

SystemV，Systemd 谁好谁坏？



## SystemV

启动服务

`/etc/init.d/apache2 start` 或 `service apache2 start`

停止服务

`/etc/init.d/apache2 stop` 或 `service apache2 stop`

重新启动服务

`/etc/init.d/apache2 restart 或 `service apache2 restart`

查看服务状态

`/etc/init.d/apache2 status 或 `service apache2 status`

开机启动

`chkconfig daemon on`

开机不启动

`chkconfig daemon off`

查看是否开机启动

`chkconfig --list daemon`

切换到图形界面

`init 5`













## Systemd


### 单元

#### 查看单元

查看当前系统的所有单元：

`systemctl list-units`

列出正在运行的单元：

`systemctl list-units`

列出所有Unit，包括没有找到配置文件的或者启动失败的：

`systemctl list-units --all`

列出所有没有运行的单元：

`systemctl list-units --all --state=inactive`

列出所有加载失败的单元：

`systemctl list-units --failed`

列出所有正在运行的、类型为 service 的单元：

`systemctl list-units --type=service`

#### 查看单元状态

显示系统状态：

`systemctl status`

显示单个单元的状态：

`sysystemctl status bluetooth.service`

显示远程主机的某个单元的状态：

`systemctl -H root@rhel7.example.com status httpd.service`

除了`status`命令，`systemctl`还提供了三个查询状态的简单方法，主要供 **脚本内部的判断语句使用**：

显示某个单元是否正在运行：

`systemctl is-active application.service`

显示某个单元是否处于启动失败状态：

`systemctl is-failed application.service`

显示某个单元服务是否建立了启动链接：

`systemctl is-enabled application.service`

#### 单元管理

对于用户来说，最常用的是下面这些命令，用于启动和停止单元（主要是 service 类）。

立即启动一个服务：

`sudo systemctl start apache.service`

立即停止一个服务：

`sudo systemctl stop apache.service`

重启一个服务：

`sudo systemctl restart apache.service`

杀死一个服务的所有子进程：

`sudo systemctl kill apache.service`

重新加载一个服务的配置文件：

`sudo systemctl reload apache.service`

重载所有修改过的配置文件：

`sudo systemctl daemon-reload`

显示某个单元的所有底层参数：

`systemctl show httpd.service`

显示某个单元的指定属性的值：

`systemctl show -p CPUShares httpd.service`

设置某个单元的指定属性：

`sudo systemctl set-property httpd.service CPUShares=500`

#### 单元信赖

列出单元所有信赖：

`systemctl list-dependencies nginx.service`

列出单元所有信赖，结果中展开 Target：

`systemctl list-dependencies --all nginx.service`

#### 单元文件

启用服务，激活开机启动：

`systemctl enable clamd@scan.service`

禁用服务，撤消开机启动：

`systemctl disable clamd@scan.service`

列出所有配置文件：

`systemctl list-unit-files`

查看单元文件的内容：

`systemctl cat atd.service`















## INITRD


### 自定义 initrd

如果需要加入指定的驱动模块，可以用 `dracut` 或 `mkinitrd` 来命令来重新编译 initrd。

dracut 通过复制软件和文件，并将其在 dracut 框架内组合，来生成 INITRAMFS 镜像。dracut 会根据其配置文件在指定目录寻找可用模块来编译，也可以在执行时通过参数来指定模块。

与其它 INITRAMFS 不同，dracut 的架构尝试使用尽可能少的硬编码。INITRAMFS 最主要的使命就是挂载根文件系统，从而迁移到真正的根文件系统。所有这些都依赖于设备的可用性。因此，dracut 依靠 udev 来创建指向设备文件的软链接，当根设备可用时，便将其挂载，然后切换到根设备。这样做有助于减少对 INITRAMFS 依赖的时间，进而提高启动速度。


#### `dracut` 语法

`dracut [-fv] [--add-drivers 列表] initramfs文件名 内核版本`

`-f`   强制编译，覆盖现有 initramfs 文件

`-v`   显示 dracut 的运行过程

`--add-drivers 列表`  加载额外的模块，不带 `.ko` 后缀，该参数可以多次使用

`initramfs文件名`     要创建的 INITRAMFS 镜像文件名，通常为 `initramfs-版本-功能.img`

`内核版本`          手动指定 Linux 内核版本，如不指定默认为当前运行的内核版本

`--modules`  加载 dracut 提供的引导所需模块，位于 `/usr/lib/dracut/modules.d/` 目录内

`--gzip|--bzip2|--xz`    用什么软件压缩，默认用 gzip

`--filesystems`  加入额外的文件系统


#### 范例一

用 dracut 的默认值创建一个 INITRAMFS 镜像文件

```
~]# dracut -v initramfs-test.img $(uname -r)
Executing: /sbin/dracut -v initramfs-test.img 3.10.0-229.el7.x86_64
*** Including module: bash ***                     # dracut 自带模块
*** Including module: nss-softokn ***
*** Including modules done ***
.....
*** Installing kernel module dependencies and firmware ***   # 内核模块
*** Installing kernel module dependencies and firmware done ***
.....
*** Generating early-microcode cpio image ***      # 创建微指令集
*** Constructing GenuineIntel.bin ****
*** Store current command line parameters ***
*** Creating image file ***                        # 开始创建 INITRAMFS 镜像
*** Creating image file done ***
```

#### 范例二

额外加入 e1000e 网卡驱动与 ext4/nfs 文件系统驱动

```
~]# dracut -v --add-drivers "e1000e" --filesystems "ext4 nfs" \
>  initramfs-new.img $(uname -r)

~]#lsinitrd initramfs-new.img  | grep -E '(e1000|ext4|nfs)'
 usr/lib/modules/3.10.0-229.el7.x86_64/kernel/drivers/net/ethernet/intel/e1000e
 usr/lib/modules/3.10.0-229.el7.x86_64/kernel/drivers/net/ethernet/intel/e1000e/e1000e.ko
 usr/lib/modules/3.10.0-229.el7.x86_64/kernel/fs/ext4
 usr/lib/modules/3.10.0-229.el7.x86_64/kernel/fs/ext4/ext4.ko
 usr/lib/modules/3.10.0-229.el7.x86_64/kernel/fs/nfs
 usr/lib/modules/3.10.0-229.el7.x86_64/kernel/fs/nfs/nfs.ko
# 可以看到，模块成功加入
```

























## 日志管理


































## 案例

### 自定义日志滚动

日志每月滚动一次，日志大于 10MB 时，立即滚动，保留 5 个日志，备份文件需压缩。

* 为日志设置隐藏属性

```
~]# chattr +a /var/log/admin.log	# 防止误删除
```

* 在 `/etc/logrotate.d` 目录中创建新的配置文件

```
~]# vim /etc/logrotate.d/admin
/var/log/admin.log {
        monthly
        size=10M
        rotate 5
        compress
        sharedscripts
        prerotate
                /usr/bin/chattr -a /var/log/admin.log
        endscript
        sharedscripts
        postrotate
                /bin/kill -HUP `cat /var/run/syslogd.pid 2> /dev/null` 2> /dev/null || true
                /usr/bin/chattr +a /var/log/admin.log
        endscript
}
```

* 测试滚动

```
~]# logrotate -v /etc/logrotate.conf
    ......
    rotating pattern: /var/log/admin.log  10485760 Bytes （5 rotations）
    empty log files are rotated, old logs are removed
    considering log /var/log/admin.log
      log does not need rotating
    not running prerotate script, since no logs will be rotated
    not running postrotate script, since no logs were rotated
    ......
    # 因为还不足一个月，文件也没有大于 10M，所以不需进行滚动！
```

* 测试强制滚动

```
~]# logrotate -vf /etc/logrotate.d/admin
...
~]# lsattr /var/log/admin.log*
    -----a---------- /var/log/admin.log
    ---------------- /var/log/admin.log.1.gz  
# 确认脚本正常执行过
```







































































































































.
