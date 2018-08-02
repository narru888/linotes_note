---
toc: true
toc_label: "10. 身份认证"
toc_icon: "users"
title: "Linux 基础 - 10. 身份认证"
tags: linux pam
categories: "linux"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/linux.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---








## 10.1 非登陆外壳


系统帐号使用 `/sbin/nologin`，无法登陆 shell，但不影响其使用其他的系统资源。

如果想让非登陆用户了解无法登陆的原因，可以创建 `/etc/nologin.txt`，在文件中写明原因，当用户尝试登陆系统时，会看到该文件内容。
















## 10.2 PAM

PAM 的全称为 “可插拔认证模块（Pluggable Authentication Modules）”。设计的初衷是将不同的底层认证机制集中到一个高层次的API中，从而省去开发人员自己去设计和实现各种繁杂的认证机制的麻烦。如果没有 PAM ，认证功能只能写在各个应用程序中，一旦要修改某个认证方法，开发人员可能不得不重写程序，然后重新编译程序并安装；有了 PAM ，认证的工作都交给 PAM ，程序主体便可以不再关注认证问题了：“ PAM 允许你进来，那你就进来吧。”

而 PAM 提供了 **统一的 API**，使应用程序的访问控制变得简单方便。

* 对于支持 PAM 的程序，不需要重写或重编译，就可以直接使用 PAM 来认证。
* PAM 自身的更新不会影响到使用它的程序。
* PAM 用来进行认证的数据称为模块，每个 PAM 模块的功能不尽相同。每个模块被调用时都会返回成功或失败的结果。



### 10.2.1 SU 的例子

su 是一个很常用的 Linux 命令，可以让我们从一个用户切换到另一个用户。我们都知道，当用户使用 root 帐号登录时，su 到别的用户是不需要密码的，而从其他用户 su 到 root 则需要输入密码。在用 su 命令切换用户的过程中，su 做了两件事：**认证**（是否是 root、不是 root 的话是否有目标用户的密码）和 **启动相应的 Shell**。

让我们来关注一下 su 的认证功能。按照正常的逻辑， su 的开发人员很可能会自己写出认证的功能：先判断是不是 root，是则判定认证通过；不是则要求用户输入目标帐号的密码，匹配成功则认证通过，否则不通过。这套逻辑并不复杂，开发人员开发出来便是了。

过了几天，用户提出了这样的一个需求：运维团队都属于 wheel 组，能不能让 wheel 组的用户也能不输入密码而使用 su 切换？看起来也不是什么特别困难的需求，开发人员本可以满足就是了。但是如果再过几天，运维小张考虑到安全想要 su 有短信认证码功能，而用户小王为了方便测试想要一个完全不用密码的 su。认证需求的差异化越来越明显，开发人员的工作也变得越来越困难。

这时，PAM 出现了。PAM 对开发人员说：“认证的事情交给我，你只要告诉我你想做用户认证就好，余下的事情由我来解决，能不能通过由我来说了算。”它又对运维人员说：“你们来我这里编写你们想要的针对 su 的认证策略吧，我将充分保证功能的灵活。”

这下好办了。su 的开发人员可以专注地为用户启动 Shell 服务，而不需要关心用户认证的细节了；用户或复杂、或简单的认证需求也都得到了满足。真是皆大欢喜。













### 10.2.2 PAM 工作原理

从软件开发者的角度来看，PAM **独立** 担负起认证的任务 -- 确认用户的身份。

PAM 的灵活之处在于，超级用户有权决定使用哪个认证机制，可以为 Linux 中的所有识别 PAM 的程序设定一种认证机制。可以是简单的、复杂的，或一次性的。

PAM 工作原理：

```
+----------------+
| application: X |
+----------------+       /  +----------+     +================+
| authentication-[---->--\--] Linux-   |--<--| PAM config file|
|       +        [----<--/--]   PAM    |     |================|
|[conversation()][--+    \  |          |     | X auth .. a.so |
+----------------+  |    /  +-n--n-----+     | X auth .. b.so |
|                |  |       __|  |           |           _____/
|  service user  |  A      |     |           |____,-----'
|                |  |      V     A
+----------------+  +------|-----|---------+ -----+------+
					   +---u-----u----+    |      |      |
					   |   auth....   |--[ a ]--[ b ]--[ c ]
					   +--------------+
					   |   acct....   |--[ b ]--[ d ]
					   +--------------+
					   |   password   |--[ b ]--[ c ]
					   +--------------+
					   |   session    |--[ e ]--[ c ]
					   +--------------+
```

应用程序 X 与 PAM 函数库进行通讯，PAM 函数库查询该程序 X 的 PAM 配置文件的内容，并依据配置文件来加载所需的模块。这些模块均为四种管理组中的成员，并在配置文件中按顺序堆叠。当这些模块被 PAM 调用时，就会帮助程序完成各自的认证任务。用户需要的、或用户要求的文本信息，可以通过应用程序提供的对话函数来交换。

#### 范例：`passwd` 命令调用 PAM 的流程：

1. 用户执行 `/usr/bin/passwd` 程序，输入密码；
2. passwd 程序调用 PAM 模块请求认证；
3. PAM 模块查找并读取配置文件 `/etc/pam.d/passwd`；
4. 依据配置文件的设置，引用合适的 PAM 模块逐步认证；
5. 将认证结果返回 passwd；
6. passwd 根据返回的结果决定下一个动作。











### 10.2.3 PAM 配置文件

PAM 的 **配置文件** 可以是 `/etc/pam.conf` 这一个文件，也可以是 `/etc/pam.d/` 文件夹内的多个文件。如果 `/etc/pam.d/` 这个文件夹存在，Linux-PAM 将自动忽略 `/etc/pam.conf`。

**`/etc/pam.conf`** 类型的格式如下：

`服务名称  工作类别  控制模式  模块路径  模块参数`

**`/etc/pam.d/`** 类型的配置文件通常以每一个使用 PAM 的程序的名称来命名，必须小写。比如 `/etc/pam.d/su`，`/etc/pam.d/login` 等等。还有些配置文件比较通用，经常被别的配置文件引用，也放在这个文件夹下，比如 `/etc/pam.d/system-auth`。这些文件的格式都保持一致：

`工作类别  控制模式  模块路径  模块参数`

是由于 `pam.d` 目录的形式会给每个应用提供一个单独配置文件，这就使得 “服务名称” 这个字段没有存在的必要了。所以会比 `pam.conf` 文件少一列。
{: .notice}  

**[ 流程栈 ]**

STACK，流程栈，泛指整个配置文件的所有内容，它是认证时执行 **步骤和规则** 的堆叠。

配置文件中的每一行代表一条规则，不同的规则按照 **指定顺序** 逐行排列，调用时也按该顺序执行所有规则。

规则太长时，可转义换行符 `\` 在行末来连接下一行，规则注释用 `#` 开头。








#### 服务名称 \| SERVICE

表示使用 PAM 的服务，用 **程序文件的名称** 来表示。

`/etc/padm.d/` 目录中的所有文件其语法是相同的，其第一项 **`service`** 均以 **文件名** 的形式存在，在内容中均被省略，而且文件名必须 **全部小写**。

`/etc/padm.d/` 目录中有一个特殊的文件 `other`，是系统预留的配置文件，用于给程序提供默认的规则。





#### 工作类别 \| TYPE

也叫 type tage，类别标签。

这一行规则所 **要完成的任务**。PAM 的具体工作主要有以下四种类别：

##### 授权管理 \| ACCOUNT

[ 你被授权？ ]

确定系统策略 **是否允许用户使用该服务**，不负责身份认证。

比如，account 这个 type 可以检查用户能不能在一天的某个时间段登录系统、这个用户有没有过期、以及当前的登录用户数是否已经饱和等等。

通常情况下，在登录系统时，如果你连 account 这个条件都没满足的话，即便有密码也还是进不去系统的。

##### 认证管理 \| AUTH

[ 你是你？ ]

用来认证 **你的确是你**。

一般来说，**询问你密码** 的就是这个 type。

假如你的认证方式有很多，比如一次性密码、指纹、虹膜等等，都应该添加在 auth 下。

auth 做的另外一件事情是 **权限授予**，比如 **赋给用户某个组的组员身份** 等等。

##### 密码管理 \| PASSWORD

[ 密码够强？ ]

主要负责 **和密码有关的工作**。

修改密码的时候有时会提示 “密码不够长”、“密码是个常用单词” 之类的，就是在这里设置的。

在这里还设置了保存密码时使用了哪种 **加密方式**（比如现在常用的 SHA-512）。

请注意，这里的密码不局限于 `/etc/shadow` 中的密码，有关认证 token 的管理都应该在此设置：如果你使用指纹登录 Linux，在设置新指纹时，如果希望首先认证这是人的指纹而不是狗的指纹，也应该放在这里。

##### 会话管理 \| SESSION

[ 会话管家！]

一个 “**忙前忙后**” 的 type，把某个服务提供给用户之前做准备工作，退出服务时做各种善后工作。

如用户登录之前要将用户家目录准备好，在用户退出之后保存日志等等。

有时，在类型字段前面会加上 **`-`**，其作用为：
如果找不到这个模块，导致无法被加载时，这一事件 **不会被记录在日志** 中。这个功能适用于那些认证时 **非必需的**、安装时可能没被安装进系统的模块。
{: .notice--info}  






#### 控制模式 \| CONTROL

用于 **定义** 各个认证模块在给出各种结果时 **PAM 的行为**，或者 **调用** 在 **别的配置文件中定义的认证流程栈**。

该字段有两种描述形式：一种是比较常见的使用一个 `关键字` 来表示的 **简单控制方式**，另一种则是用 `[ 返回代码=行为]` 来表示的 **复杂控制方式**。




##### 简单控制方式


###### REQUIRED

**一票否决**

如果本条目没有被满足，则最终本次认证一定失败，但认证过程不因此打断。**整个栈运行完毕** 之后才会返回（已经注定了的）“认证失败” 信号。

###### REQUISITE

**一票否决**

如果本条目没有被满足，那本次认证一定失败，而且整个栈立即中止并返回错误信号。

认证失败时产生的信息无法记录。该标签可用于保护用户，防止其在不安全的介质上输入密码，进而防止密码被窃取或泄漏。

###### SUFFICIENT

**一票通过**

如果本条目的条件被满足，且本条目之前没有任何 required 条目失败，则 **立即返回 “认证成功” 信号**；

如果对本条目的验证失败，不对结果造成影响。

###### OPTIONAL

**执行规则，结果忽略**

虽然本条目的规则会被执行，但只要流程栈中还存在其它条目，本条目返回的 **结果** 就会 **被忽略**，继续往下执行其他规则。

该条目仅在整个栈中 **只有这一个条目** 时才有 **决定性作用**，否则无论该条验证成功与否都和最终结果无关。

实际应用中，往往用来进行一些与认证无关的操作

###### INCLUDE

将 **其他配置文件中的流程栈包含在当前的位置**，就好像将其他配置文件中的内容复制粘贴到这里一样。

###### SUBSTACK

**运行其他配置文件中的流程，并将整个运行结果作为该行的结果进行输出。**

该模式和 `include` 的不同点在于 **认证结果的作用域**：

* 如果某个流程栈 **`include`** 了一个带 `requisite` 的栈，这个 `requisite` **失败** 将直接导致认证失败，同时 **退出栈**；
* 而某个流程栈 **`substack`** 了同样的栈时，`requisite` 的失败只会导致这个 **子栈返回失败信号**，母栈并不会在此退出。




##### 复杂控制方式

根据更具体的返回代码，来决定如何操作。

[value1=action1 value2=action2 ...]

即如果认证结果是返回代码1，则遵循处理方式1，返回代码2，处理方式2 ......

###### value

[ 返回代码 ]

valueN 的值是各个认证模块执行之后的 **返回代码**：

success, open_err, symbol_err, service_err, system_err, buf_err, perm_denied, auth_err, cred_insufficient, authinfo_unavail, user_unknown, maxtries, new_authtok_reqd, acct_expired, session_err, cred_unavail, cred_expired, cred_err, no_module_data, conv_err, authtok_err, authtok_recover_err, authtok_lock_busy, authtok_disable_aging, try_again, ignore, abort, authtok_expired, module_unknown, bad_item, conv_again, incomplete, default

其中，`default` 代表其他所有没有明确说明的返回值。

返回值结果清单可以在 `/usr/include/security/_pam_types.h` 中找到，也可以查询 `pam(3)` 获取详细描述。

###### action

[ 处理方式 ]

流程栈中很可能有多个验证规则，每条验证的返回值可能不尽相同，那么到底哪一个验证规则能作为最终的结果呢？这就需要 actionN 的值来决定了。actionN 的值有以下几种：

* **`ignore`**：在一个栈中有多个认证条目的情况下，如果标记 `ignore` 的返回值被命中，那么这条返回值 **不会** 对最终的认证结果 **产生影响**。
* **`bad`**：标记 `bad` 的返回值被命中时，最终的认证结果 **注定会失败**。此外，如果这条 `bad` 的返回值是整个栈的第一个失败项，那么整个栈的返回值一定是这个返回值，后面的认证无论结果怎样都改变不了现状了。
* **`die`**：标记 `die` 的返回值被命中时，**马上退出栈并宣告失败**。整个返回值为这个 `die` 的返回值。
* **`ok`**：在一个栈的运行过程中
	- 如果 `ok` 前面没有返回值，或者前面的返回值为 `PAM_SUCCESS`，那么这个标记了 `ok` 的返回值将 **覆盖前面的返回值**。
	- 如果前面执行过的验证中有最终将导致失败的返回值，那 `ok` 标记的值将 **不会起作用**。
* **`done`**：在前面没有 `bad` 值被命中的情况下，`done` 值被命中之后 PAM 将马上 **返回程序，并退出整个栈**。
* **`N`**（一个自然数）：功效和 `ok` 类似，并且会 **跳过接下来的 N 个验证步骤**。如果 `N = 0` 则和 `ok` 完全相同。
* **`reset`**：**清空之前生效的返回值**，并且从下面的验证起 **重新开始**。


##### 用复杂方式表示关键字模式

简单控制方式完全可以用复杂控制方式来等效地表示：

1.  `required`：    
    `[success=ok new_authtok_reqd=ok ignore=ignore default=bad]`
2.  `requisite`：    
    `[success=ok new_authtok_reqd=ok ignore=ignore default=die]`
3.  `sufficient`：    
    `[success=done new_authtok_reqd=done default=ignore]`
4.  `optional`：    
    `[success=ok new_authtok_reqd=ok default=ignore]`






#### 模块路径

模块所在路径。

模块一般保存在 `/lib/security` 或 `/lib64/security` 中。Linux-PAM 配置文件中的模块位置可以是相对于上述文件夹的 **相对路径**，也可以是文件的 **绝对路径**。


#### 模块参数

模块参数用空格与模块路径相隔。该参数将只和特定模块相关，因此某个模块的文档中一定包含其参数的信息。

如果需要在单个参数中使用空格，可以将整个参数用方括号 `[ ]` 包裹起来。














### 10.2.4 PAM 常用模块

PAM 的各个模块一般存放在 `/lib/security/` 或 `/lib64/security/` 中，以动态库文件的形式存在（可参阅 `dlopen(3)`），文件名格式一般为 `pam_*.so`。

每个模块可以实现不同的功能，可以为 PAM 的四种工作类别提供单一或全部的接口，如 `pam_unix` 提供认证、授权、密码、会话的全部接口。



* `pam_access`

用于 **访问控制**。可以针对用户名、主机、域名、IP 地址、网络号、终端名等来控制访问。默认使用 `/etc/security/access.conf` 做为控制规则，除非指定其它文件。

* `pam_cracklib.so`

如果密码过期，则提示用户输入新密码，然后检查新密码是否容易被字典识破。如果强度不满足要求，用户可以设置几次新密码。

* `pam_deny.so`

用于 **拒绝访问**，永远返回失败。

* `pam_echo.so`

**输出** 消息。

* `pam_exec.so`

**执行外部命令**。

* `pam_ftp.so`

**匿名访问**。

* `pam_localuser.so`

使用 `pam_localuser.so` 以及 `pam_wheel.so` 或 `pam_listfile.so` 可以有效地 **控制网络用户和本地用户的访问**。

用于部署全站范围的登陆策略，通常会 include 进来一个网络用户的子集，以及一些本地用户。要求将用户列于 `/etc/passwd` 中。

* `pam_securetty.so`

**限制超级用户** 只能从 `/etc/securetty` 文件中规定的 **安全的终端机** 登陆。

* `pam_nologin.so`

**拒绝普通用户登陆**。

若 `/etc/nologin` 存在，普通用户在登陆系统时，终端机上会显示该文件内容，并拒绝其登陆。对 root 及已经登陆系统的普通用户没有影响。

* `pam_selinux.so`

**设置默认安全上下文**

由于 SELinux 会影响用户执行程序的权限，因此利用 PAM 模块将其 **暂时关闭**，认证通过后再启动。

* `pam_console.so`

当用户需要使用实体 console 接口登陆主机时，该模块可以帮助处理一些文件权限的问题，让用户可以顺利登陆系统。

* `pam_loginuid.so`

把用户的登陆 UID 记录到通过认证的进程的属性中，使程序能正确通过审核。

* `pam_env.so`

用来设置环境变量，默认配置文件为 `/etc/security/pam_env.conf`。

* `pam_unix.so`

很复杂且重要的模块，同时提供全部四种接口。

认证阶段：**传统密码验证**。提醒用户输入密码，再与 `/etc/passwd` 和 `/etc/shadow` 的内容进行比较。

授权阶段：进行所有必要的 **帐户验证** 操作。如检查密码是否过期，是否在有效期及时修改了密码等。

密码阶段：是否使用程序来修改用户的密码。

会话阶段：在进程的起始和末尾，把用户名和服务类型保存到日志 `/var/log/secure` 中。

* `pam_pwquality.so`

用于 **检验密码的强度、密码是否在字典中、连续输错几次密码就断掉连线** 等。

此模块完全兼容其前身 `pam_cracklib.so`，`/etc/security/pwquality.conf` 可以额外指定默认值。

* `pam_limits.so`

控制用户登陆后可使用的 **系统资源**，`/etc/security/limits.conf` 为配置文件。

* `pam_succeed_if.so`

测试帐户的属性，根据其认证的结果来决定返回成功或失败。可以根据测试结果来决定是否加载其它模块。


**为什么 root 无法用 telnet 登陆系统，却能够使用 ssh 登陆？**
一般来说， telnet 会引用 login 的 PAM 模块，而 login 的认证阶段会有 `/etc/securetty` 的限制。由于远程连接属于 pts/N 的动态终端接口设备名称，并没有写入到 `/etc/securetty`，因此 PAM 就无从判断 root 的身份，无法以 telnet 登陆。至于 ssh 使用的是 `/etc/pam.d/sshd` 模块，由于该模块的认证阶段并没有加入 `pam_securetty`，因此无需用 `/etc/securetty` 认证。
{: .notice--success}












### 10.2.5 举例说明认证机制流程

使用 `/etc/pam.d/login` 来说明，其内容如下：

```bash
# 认证阶段
auth [user_unknown=ignore success=ok ignore=ignore default=bad] pam_securetty.so
auth       substack     system-auth
auth       include      postlogin

# 授权阶段
account    required     pam_nologin.so
account    include      system-auth

# 密码阶段
password   include      system-auth

# 会话阶段
session    required     pam_selinux.so close
session    required     pam_loginuid.so
session    optional     pam_console.so
session    required     pam_selinux.so open
session    required     pam_namespace.so
session    optional     pam_keyinit.so force revoke
session    include      system-auth
session    include      postlogin
-session   optional     pam_ck_connector.so
```

#### 认证阶段：

`pam_securetty.so` 判断 **用户使用的终端** 是否满足 `/etc/securetty` 的设置，以确认用户是 **以 root 身份登陆** 的。

引用子栈 `system-auth` 中的认证部分：

```
auth        required      pam_env.so
auth        sufficient    pam_fprintd.so
auth        sufficient    pam_unix.so nullok try_first_pass
auth        requisite     pam_succeed_if.so uid >= 1000 quiet_success
auth        required      pam_deny.so
```

`pam_env.so` 设置环境变量

`pam_fprintd.so`  指纹认证

`pam_unix.so` 确认是 root

`pam_succeed_if.so` 是否满足 uid >= 1000，不满足则返回失败。

这条平时没多大用处，但一旦需要在此之后加上一些 **网络认证的规则** 时就有用了，因为系统用户不允许通过网络进行认证，用这一条就可以阻止系统用户通过网络进行认证。
{: .notice}  

`pam_deny.so`  如以上都不满足，则直接拒绝

`postlogin` 空


#### 授权阶段：

`pam_nologin.so` 判断 `/etc/nologin` 是否存在，若存在则不许普通用户登陆；

include `system-auth` 中的授权部分：

```bash
account     required      pam_unix.so
account     sufficient    pam_localuser.so
account     sufficient    pam_succeed_if.so uid < 1000 quiet
account     required      pam_permit.so
```

`pam_unix.so` 验证密码

`pam_localuser.so` 是否属于合法访问名单中的用户

`pam_succeed_if.so` 是否满足 uid < 1000，系统用户，满足才放行

`pam_permit.so` 如以上均通过，则允许该帐号登陆。

#### 密码阶段：

include `system-auth` 中的密码部分：

```bash
password    requisite     pam_pwquality.so try_first_pass local_users_only retry=3 authtok_type=
password    sufficient    pam_unix.so sha512 shadow nullok try_first_pass use_authtok
password    required      pam_deny.so
```

`pam_pwquality.so`  限制密码输错 3 次

`pam_unix.so` 通过 sha512, shadow 等功能进行密码检验，如通过则返回程序

`pam_deny.so` 如不通过，则拒绝登陆。

#### 会话阶段：

`pam_selinux.so` 暂时关闭 SELinux

`pam_loginuid.so`  记录进程的 UID

`pam_console.so`  处理从接口登陆时的文件权限

`pam_selinux.so open`  恢复 SELinux 安全上下文

`pam_namespace.so`  为会话设定私用的命名空间

`pam_keyinit.so`  当用户登录的时为其建立密钥环

include `system-auth` 中的会话部分：

```bash
session     optional      pam_keyinit.so revoke
session     required      pam_limits.so
-session     optional      pam_systemd.so
session     [success=1 default=ignore] pam_succeed_if.so service in crond quiet use_uid
session     required      pam_unix.so
```

`pam_keyinit.so`  用户退出时，撤消会话的密钥环

`pam_limits.so`  设置用户本次会话的系统资源配额，超级用户也同样受限

`pam_systemd.so`  在 systemd 登陆管理器中注册本次用户会话，以便接受 systemd 的控制

`pam_succeed_if.so`  如果调用模块的程序是 cond，则不保存日志，并使用程序 UID，不用被验证的 UID

`pam_unix.so`  保存日志

include `postlogin` 中的会话部分：

```bash
session     [success=1 default=ignore] pam_succeed_if.so service !~ gdm* service !~ su* quiet
session     [default=1]   pam_lastlog.so nowtmp showfailed
session     optional      pam_lastlog.so silent noupdate showfailed
```

`pam_succeed_if.so`  如果调用程序不是 gdm*、su* 就不保存日志。

如失败，则 `pam_lastlog.so` 不更新 wtmp 条目，显示登陆失败的次数，及上一次登陆失败的日期

如成功，则 `pam_lastlog.so` 不更新任何文件，显示登陆失败的次数，及上一次登陆失败的日期

`pam_ck_connector.so`  可选，在系统范围内注册一个登陆会话









### 10.2.6 限制用户系统资源

如果系统中不使用 systemd，可以用 `/etc/security/limits.conf` 来限制那些通过 PAM 登陆的用户的可用系统资源，对系统服务不会产生影响。但如果系统中使用 systemd，则该文件会被忽略。

`/etc/security/limits.d` 目录中的配置文件会覆盖 `limits.conf` 的设置。

每行描述一条规则，来限制用户：

`<domain>        <type>  <item>  <value>`

#### DOMAIN

[ 限制对象 ]

* 用户名
* 组名，前面加 `@`区分
* 通配符 `*`，用于默认条目
* 通配符 `%`，如果单独用，等同与 `*`，限制最大登陆人数；如果在组前面加 `%`，则仅限该组成员的最大登陆人数
* `<min_uid>:<max_uid>` 设定有效 UID 范围。如果 `<min_uid>` 被省略，则设定最大 UID，如果 `<max_uid>` 被省略，则设定最小 UID
* `@<min_gid>:<max_gid>`  设定有效 GID 范围，用法同上。设定具体 GID 时包含附加组，而设定 GID 范围时仅针对主组

#### TYPE

[ 限制类型 ]

* `hard`  刚性限制。由超级用户设定，由内核强制实施，用户无法提升限额。

* `soft`  柔性限制。用户可以在现存的刚性限制区间内，灵活调整限额。对于通常系统应用来说，用该字段设定的值可以被当作默认值。

* **`-`**

同时使用刚性、柔性限制。

#### ITEM

[ 限制项目 ]

* `core`  内核文件大小
* `data`  最大数据容量
* `fsize`  最大文件容量
* `memlock`  最大锁定内存地址空间
* `nofile`  打开文件描述符的最大数量
* `maxlogins`  该用户同时最大登陆数量，对超级用户无效  

#### 范例

##### 范例一

用户只能创建 100MB 以内的文件，大于时 90MB 警告。

```bash
~]# vim /etc/security/limits.conf
user1    soft        fsize         90000
user1    hard        fsize        100000
```

此处 fszie 单位为 KB。

##### 范例二

限制组，同时最多一个组员登陆

```bash
~]# vim /etc/security/limits.conf
@pro1   hard   maxlogins   1
```


当发生任何无法登陆，或产生无法预期的错误时，PAM 模块都会把日志记录到 `/var/log/secure` 当中。
{: .notice--info}








## 10.3 外部身份认证系统


windows 的 Active Directory 是一种外部身份认证系统。为了在不同主机能够用同一个帐号登陆，Linux 也会使用到 **LDAP**, **NIS** 等服务器提供的身份认证服务。

Linux 主机要使用外部身份认证系统时，可能就得要额外的设置一些数据。

`authconfig-tui` 是一个拟图形化界面的程序，用于设置系统认证源。

该程序为用户提供了一个简便的方式，通过修改 `/etc/sysconfig/network` 来设置 NIS，通过修改 `/etc/passwd` 和 `/etc/shadow` 来管理本地用户。也可进行基本的 LDAP，Kerberos 5, Winbind 客户端设置。












## 参考文档

🍨 本节学习过程中，[李堡垒](http://v.colinlee.fish/) 的文章非常有帮助，很多文字选自他的博文，在此感谢！
{: .notice--success}
