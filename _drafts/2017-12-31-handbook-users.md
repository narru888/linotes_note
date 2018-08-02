---
toc: true
toc_label: "速查手册-用户管理"
toc_icon: "book"
title: "速查手册-用户管理"
tags: 用户管理
category: "handbook"
published: false
---






### 2.5 用户管理


#### 在线用户

`who`	都他妈谁在线


#### ID

查看真实及有效 **UID、GID、组**。

`id [username]`


#### FINGER

查看用户基本信息

##### 语法

`finger [-s] username`

`-s`   仅列出用户的用户、全名、终端机代号与登陆时间等

`-m`   列出与后面接的用户相同者，而不是利用部分比对 （包括全名部分）

不加参数则列出 **当前在线的用户**

##### finger 返回的内容


`Login`	用户

`Name`	注释

`Directory`	家目录

`Shell`	用户 Shell

`logged in`	登陆主机时间

`No mail`	有否邮件

`No Plan`	~user/.plan 文件的内容








#### SHADOW

`authconfig --test | grep hashing`	查看 SHADOW 的加密机制




#### USERADD

使用 useradd 创建用户时，系统会参考：

`/etc/default/useradd` useradd 配置文件

`/etc/login.defs` 用于 UID、GID、密码的全局设置。

`/etc/skel`	家目录模板

##### 语法

`useradd [-u UID] [-g 初始组] [-G 附加组] [-mM] [-c 注释] [-d 家目录] [-s shell] 用户名`

`-u`  为用户指定 UID

`-g`  用户初始组

`-G`  用户的附加组

`-M`  不创建家目录

`-m`  创建家目录

`-c`  注释文字

`-d`  指定家目录，需用绝对路径

`-r`  创建系统用户

`-s`  指定 shell

`-e`  用户失效日期，YYYY-MM-DD

`-f`  密码过期宽限天数。0 为立刻失效，-1 为永不失效

##### 范例

* 查看 USERADD 默认值

`useradd -D`

* 用默认值创建用户

`useradd user1`

* 用自定义信息创建用户

`useradd -u 1500 -g users user2`

* 创建系统用户

`useradd -r user3`

不会为系统用户创建家目录




#### PASSWD

##### 普通用户修改自己的密码

`passwd [--stdin] [用户]  `

##### 管理员修改他人密码

`passwd [-l] [-u] [--stdin] [-S] [-n 天数] [-x 天数] [-w 天数] [-i 日期] 用户`

`-l`	锁定用户，在 /etc/shadow 第二字段前面加 !  

`-u`	解锁用户

`-S`	列出密码的状态信息

`-n`	修改密码间隔天数

`-x`	密码有效天数

`-w`	密码过期提前警告天数

`-i`  密码逾期宽限天数

`--stdin`	把管道传来的数据，作为密码输入，便于脚本使用


##### 范例

* 查看用户密码设置策略

`passwd -S user2`

* 管理员为用户设置密码

`passwd user2`

* 指定参数设置密码

有效期 60 天，逾期 10 天后用户失效。

`passwd -x 60 -i 10 user2`

* 暂时锁定用户，之后恢复

`passwd -l user2`

```
~]# passwd -S user2
user2 LK 2015-07-20 0 60 7 10 (Password locked.)
```

状态 “ LK ” 表示已锁定

```
~]# grep user2 /etc/shadow
user2:!!$6$iWWO6T46$uYStdkB7QjcUpJaCLB.OOp...:16636:0:60:7:10::
```

其实只是在密码前加了 `!!`

* 解锁用户

`passwd -u user2`

* 普通用户修改自己的密码

`passwd `  

*  使用 stdin 创建密码

`echo "abc543CC" | passwd --stdin user2`






#### CHAGE

该命令用于 **设置用户密码过期策略**。

`chage [-ldEImMW] 用户名`

`-l`  列出该用户的详细密码参数

`-d`  修改最近修改密码日期，YYYY-MM-DD，也可用 epoch 天数

`-E`  修改用户失效日期，YYYY-MM-DD

`-I`  修改密码过期宽限天数

`-m`  修改密码修改间隔天数

`-M`  修改密码有效天数

`-W`  修改过期前警告天数


##### 范例

* 查看详细密码参数

`chage -l user2`

* 用户首次登陆必须修改密码

`chage -d 0 agetest`

`-d 0` 即把用户的密码修改时间设为 1970/1/1，因此必须修改密码。







#### USERMOD

修改 **用户属性**。

`usermod [-cdegGlsuLU] username`

`-c`   修改用户说明

`-d`   修改家目录

`-e`   修改用户失效日期

`-f`   修改密码过期宽限天数

`-g`   修改初始组 GID

`-G`   修改附加组

`-a`   增加附加组，与 -G 配合使用

`-l`   修改用户名称

`-s`   修改 Shell

`-u`   修改 UID

`-L`   锁定用户

`-U`   解锁用户


##### 范例

* 修改用户注释

`usermod -c "user's test" user2`

* 修改用户失效日期

`usermod -e "2015-12-31" user2`

#### 手动创建用户家目录

```
~]# cp -a /etc/skel /home/user3
~]# chown -R user3:user3 /home/user3
~]# chmod 700 /home/user3
```






#### CHFN

修改 **finger 信息**

`chfn [-foph] [用户名]`


`-f`   用户全名，修改的是 passwd 文件中的注释文本

`-o`   办公室房间号

`-p`   办公室电话

`-h`   住宅电话

不加参数直接运行，会以交互方式逐个参数修改。



#### CHSH

修改 **用户 shell**

`chsh [-ls]`

`-l`   列出系统当前可用的 shell

`-s`   使用指定的 Shell





#### USERDEL

`userdel [-r] username`

`-r`  同时删除用户家目录







### 2.6 组管理


#### 2.6.1 切换组

`newgrp - matrix`

如果加了减号 `-`，用户的环境就会重新初始化，否则保持之前的环境，包括工作目录等都不会变化。


#### 2.6.2 新建组

`groupadd` 命令

`groupadd [-g gid] [-r] 组名称`

`-g`   使用指定的 GID

`-r`   创建系统组

* 范例

`groupadd group1`

系统分配新的 GID 时，是把当前 1000 以上最大的 GID 加上 1 得来的。


#### 2.6.3 修改组


##### GROUPMOD

`groupmod` 命令用于修改 GID 及组名。

`groupmod [-g gid] [-n group_name] 组名`

`-g`  修改 GID

`-n`  修改组名称

* 范例

groupmod -g 201 -n mygroup group1


##### GPASSWD

`gpasswd` 用于设置组密码，指定管理员，添加组员，移除组员等。

组管理员可以是多人。

**范例**

* root 为组设置密码

`gpasswd groupname`

* root 指定组管理员列表

`gpasswd -A admin1,admin2 groupname`

* root 添加新组员

`gpasswd -M user1,user2 groupname`

* root 删除组的密码

`gpasswd -r groupname`

* root 用密码限制访问该组

`gpasswd -R groupname`

使用 `newgrp` 切换组时需要输入密码。

* 组管理员添加组员

`gpasswd -a user1 groupname`

* 组管理员移除组员

`gpasswd -d user` groupname`




#### 2.6.4 删除组

`groupdel` 命令用于删除组。

`groupdel [groupname]`


要删除的组必须不是任何人的 **初始组**，否则无法删除。
{: .notice--warning}



#### 2.6.5 查看组

##### GROUPS

查看当前用户属于哪个组。

`groups `
