---
toc: true
toc_label: "14. BASH"
toc_icon: "code"
title: "BASH"
tag: [shell，bash，]
categories: "basic"
published: false
---


🌄  本页更新中 ... ...  






## 14.1 BASH 简介



### 14.1.1 BASH

#### Linux 系统结构

{% include figure image_path="/assets/images/layers.unix.jpg" alt="Unix 系统分层" %}

{% include figure image_path="/assets/images/layers.unix.2.jpg" alt="软件分层" %}

内核负责直接操作硬件，必须严加保护。

用户通过最外层的应用程序与内核沟通，称为壳程序，即 SHELL，它是能够操作内核的 **接口**。

shell 既是一个命令解释器，同时也是一种编程语言。

* 做为命令解释器，shell 在命令行中提供丰富的 GNU 工具

* 做为编程语言，允许把这些工具合并在一起使用

* 可以创建包含多个命令的文件，并使文件本身成为一个命令，即脚本。

####  系统可用 Shell

系统当前可用 Shell 保存在 `/etc/shells`。

* `/bin/sh`：早期使用的 Shell

* `/bin/bash`： Linux 默认 Shell

bash，Bourne Again SHell 是 Bourne Shell 的增强版，基于 GNU 架构开发。

* `/bin/tcsh` 整合 C Shell ，提供更多的功能

* `/bin/cs` 早期使用，已被代替

用户登陆时，系统会为其分配一个 shell。由 `/etc/passwd` 决定应该分配哪个。

#### BASH

Bash (Bourne-again Shell) 是一个来自 GNU Project的命令行解释器/编程语言。它的名字是向它的前身——很早以前的 Bourne shell 致敬。Bash 可以运行在大部分类 UNIX 操作系统中，包括 GNU/Linux。


### 14.1.2 Bash 的调用


Bash 调用方式的不同会导致 Bash 运行方式的不同。下面是在不同模式下运行的 Bash 的描述。

#### 登录外壳

Login Shell

如果 Bash 由在 tty 中的`登录`，SSH 守护进程，或者其它类似的方式派生出来，称为登录外壳。可以使用命令行选项 `-l` 或 `--login` 来使用这种模式。

#### 交互式外壳

如果 Bash 在启动的时候既没有使用 `-c` 选项也没有使用非选项参数，那我们就认为它是一个交互式外壳，此时，shell 从键盘接受输入，同时 Bash 的标准输出和标准错误被链接到终端上。

如果以非交互式运行，shell 需要从文件中来读取需执行的命令。

#### 符合 POSIX

通过在 Bash 启动时使用 `--posix` 命令行参数，或在启动后执行 `set -o posix` ，使 Bash 在增强的 POSIX 标准下运行。

#### 传统模式

老版本的 shell `/bin/sh` 被符号链接至 `/bin/bash`。

如果以命令名 `sh` 来调用 Bash，Bash 会尽可能地模仿历史版本的`sh`的启动过程，包括 POSIX 兼容性。

在传统模式下登陆运行的 shell 来源于 `/etc/profile`，然后是 `~/.profile`。


### 14.1.3 外壳和环境变量

Bash 的行为和通过它来运行的程序会被许多环境变量所影响。环境变量被用于储存有用的值，如命令搜索路径，或者使用哪个浏览器。

当一个新的 shell 或者脚本被执行时，这个 shell 会继承其父 shell 的变量，以内部的 shell 变量启动。

这些 Bash 中的 shell 变量可以被导出，成为环境变量：

```bash
VARIABLE=content
export VARIABLE
```

或者：

```bash
export VARIABLE=content
```

环境变量一般放置在 `~/.profile` 或 `/etc/profile`，以便所有兼容 Bourne shell 的 shell 都可以使用。




### 14.1.4 命令行

Bash 的命令行由一个叫做 Readline 的分离库来管理。Readline 提供了很多 Bash 命令行交互的快捷键，如，光标在单词间向前向后移动，删除单词等。管理输入历史也是 Readline 的职责，它还允许创造宏。

shell 允许同步或异步地执行 GNU 命令。

* shell 会等待 **同步** 命令执行完毕，然后才接受其它的输入

* shell **异步** 执行命令时，可以同时读取、执行其它的命令


### 14.1.5 别名

`alias` 是一个命令, 用某个字符串来替代一段复杂的命令及参数。常用来缩短系统命令，或将默认参数加入到常用命令中。

用户个人的别名最好保存在 `~/.bashrc`，而系统级别名保存在 `/etc/bash.bashrc`。

### 14.1.6 函数

Bash 也支持函数。将自定义函数加入 `~/.bashrc` 中，就可以在 bash 中随时使用它了。




### 14.1.7 Bash 常用术语


*  `POSIX`

基于 UNIX 的开放的系统标准。Bash 主要参照 POSIX 1003.1 标准的 Shell 和 工具部分。

*  空白

空格或 tab。


*  内置合住

由 shell 自身部署的命令。

*  控制符

一个起控制功能的连接字符：

`||`，`&amp;&amp;`，`&amp;`，`;`，`;;`，`;&amp;`，`;;&amp;`,`|`，`|&amp;`，`(`，or `)`.

*  退出状态

一个命令为其调用者返回的值，限制在 8 位以内，因此最大为 255.

*  字段

Field，字段。

Shell 脚本中有个变量叫 **IFS**（Internal Field Seprator），字段分隔符。该变量中默认保存的是空格、tab、换行符，shell 用该变量来

A unit of text that is the result of one of the shell expansions.  After
expansion, when executing a command, the resulting fields are used as
the command name and arguments.


*  `filename`

A string of characters used to identify a file.

*  `job`

A set of processes comprising a pipeline, and any processes descended
from it, that are all in the same process group.

*  `job control`

A mechanism by which users can selectively stop (suspend) and restart
(resume) execution of processes.

*  `metacharacter`

A character that, when unquoted, separates words.  A metacharacter is
a `space`, `tab`, `newline`, or one of the following characters:

`|`，`&amp;`，`;`，`(`，`)`，`&lt;`，or`&gt;`.

*  `name`

A `word` consisting solely of letters, numbers, and underscores,
and beginning with a letter or underscore.  `Name`s are used as
shell variable and function names.
Also referred to as an `identifier`.

*  `operator`

A `control operator` or a `redirection operator`.

Operators contain at least one unquoted `metacharacter`.

*  `process group`

A collection of related processes each having the same process
group
ID.

*  `process group ID`

A unique identifier that represents a `process group`
during its lifetime.

*  `reserved word`

A `word` that has a special meaning to the shell.  Most reserved
words introduce shell flow control constructs, such as `for` and
`while`.

*  `return status`

A synonym for `exit status`.

*  `signal`

A mechanism by which a process may be notified by the kernel
of an event occurring in the system.

*  `special builtin`

A shell builtin command that has been classified as special by the
POSIX standard.

*  `token`

A sequence of characters considered a single unit by the shell.
It is either a `word` or an `operator`.

*  `word`

A sequence of characters treated as a unit by the shell.
Words may not include unquoted `metacharacters`.














## 14.2 Bash 常用工具


### 14.2.1 TYPE

`type` 用于 **查询命令的类型**。

`type -tpa name`

不加参数运行，可以查询命令属于外部命令，还是内置命令。

`-t`  以下面形式显示查询结果

.. `file`  外部命令

.. `alias`  命令别名

.. `builtinbash`  内置命令

`-p`  外部命令时才会显示完整文件名；

`-a`  会由 PATH 变量定义的路径中，将所有含 name 的命令都列出来，包括别名




### 14.2.2 VI

vi 有三种工作模式，一般命令模式、编辑模式、命令行命令模式。

{% include figure image_path="/assets/images/vi.modes.png" alt="vi 三种工作模式的关系" %}

#### 一般命令模式

是打开文件时的默认的模式。可以删除字符、删除列、复制、粘贴。

* 移动光标

| 按键 | 功能 |
| :--- | :--- |
| h / ← | 向左移动一个字符 |
| j / ↓ | 向下移动一个字符 |
| k / ↑ | 向上移动一个字符 |
| l / → | 向右移动一个字符 |
| Ctrl + f | 向下翻一页，page Foward |
| Ctrl + b | 向上翻一页，page Backward |
| Ctrl + d | 向下翻半页 |
| Ctrl + u | 向上翻半页 |
| + | 下一个非空行 |
| - | 上一个非空行 |
| 8空格 | 向右移动 8 列 |
| 0 / Home | 行首 |
| $ / End | 行尾 |
| H | 屏幕首行 |
| M | 屏幕中间行 |
| L | 屏幕底行 |
| G | 文件最后一行 |
| 8G | 到第 8 行，可配合 set nu |
| gg | 文件第一行 |
| 8回车 | 向下 8 行 |

*  查找和替换

| 按键 | 功能 |
| :--- | :--- |
| /word | 向下查找关键字 |
| ?word | 向上查找关键字 |
| n | 同向重复查找 |
| N | 反向重复查找 |
| :8,18s/word1/word2/g | 在第8行与第18行之间查找，并替换 |
| :1,$s/word1/word2/g | 从首行到末行查找，并替换 |
| :1,$s/word1/word2/gc | 从首行到末行查找，并替换，替换前确认 |

*  删除、复制、粘贴

| 按键 | 功能 |
| :--- | :--- |
| x | del |
| X | backspace |
| 8x | 删除后面的8个字符 |
| dd | 删除当前行 |
| 8dd | 向下删除8行 |
| d1G | 删除到首行 |
| dG | 删除到末行 |
| d$ | 删除到行尾 |
| d0 | 删除到行首 |
| yy | 复制当前行 |
| 8yy | 向下复制8行 |
| y1G | 复制到首行 |
| yG | 复制到末行 |
| y0 | 复制到行首 |
| y$ | 复制到行尾 |
| p | 粘贴到下面 |
| P | 粘贴到上面 |
| J | 连接本行与下行 |
| c8→ | 连续向右删除8个字符 |
| c8↓ | 连续删除下8行 |
| u | 恢复 （ctrl + z） |
| Ctrl+r / . | 重做 |


#### 编辑模式

按下 `i，I，o，O，a，A，r，R` 中任何一个字母，会进入编辑模式，在窗口的左下方会出现 `INSERT` 或 `REPLACE` 提示。

按 `Esc` 键即可退出编辑模式，返回一般命令模式。

* 光标插入模式

| 按键 | 功能 |
| :--- | :--- |
| i | 插入到当前位置 |
| I | 插入到当前行第一个非空字符 |
| a | 插入到右侧 |
| A | 插入到行尾 |
| o | 在下面插入一行 |
| O | 在上面插入一行 |

* 光标替换模式

| 按键 | 功能 |
| :--- | :--- |
| r | 替换当前字符后马上返回一般命令模式 |
| R | 持续替换状态，直到按下 ESC |

#### 命令行模式

在一般模式中，输入 `: / ?` 中的任何一个，光标会移动到最下面一行。

可以查找、替换、打开、存盘、退出、显示行号。

* 保存、退出

| 按键 | 功能 |
| :--- | :--- |
| :w | 保存 |
| :w! | 强制保存 |
| :q | 退出 |
| :q! | 强制退出，不保存 |
| :wq | 保存，退出 |
| :wq! | 强制保存，退出 |
| ZZ | 文件修改过则保存，退出；否则直接退出 |
| :w \[filename\] | 另存为 |
| :r \[filename\] | 置入其它文件 |
| :8,18 w \[filename\] | 将8到18行的内容另存为 |
| :! ls /home | 暂时离开 vi，到命令行界面运行 ls /home |

* 修改 vi 环境

| 按键 | 功能 |
| :--- | :--- |
| :set nu | 显示行号 |
| :set nonu | 取消行号 |

#### 临时文件

使用 vi 时，会在当前目录中创建一个名为 `.filename.swp` 的临时文件，退出 vi 后会自动删除。

如果因为某些原因 vi 意外退出或出错，可以考虑通过该临时文件来修复原始文件。



### 14.2.3 VIM

vim 是 vi 的增强版。

#### 区块选择

| 按键 | 功能 |
| :--- | :--- |
| v | 选择字符，经过处反白 |
| V | 选择行，经过的行反白 |
| Ctrl+v | 区块选择 |
| y | 复制所选 |
| d | 刪除所选 |
| p | 粘贴 |


区块选择非常适合排列整齐的内容，如 hosts 。

#### 多文件编辑

| 按键 | 功能 |
| :--- | :--- |
| :n | 编辑下一个文件 |
| :N | 编辑上一个文件 |
| :files | 列出当前打开的所有文件 |

多文件编辑允许文件间的复制粘贴。

#### 多窗口功能

| 按键 | 功能 |
| :--- | :--- |
| :sp \[filename\] | 打开新窗口，不接文件显示当前文件，接文件显示新文件 |
| Ctrl + w + ↓ | 切换下一窗口 |
| Ctrl + w + ↑ | 切换上一窗口 |

#### 命令补齐

| 按键 | 功能 |
| :--- | :--- |
| 组合按钮 | 补齐的内容 |
| Ctrl + x -&gt; Ctrl + n | 参考现有文件内容，补齐关键字 |
| Ctrl + x -&gt; Ctrl + f | 以当前目录内的“文件名”作为关键字，予以补齐 |
| Ctrl + x -&gt; Ctrl + o | 根据扩展名，分析语法，补齐关键字 |



#### vim 环境设置


* vim 的配置文件

vim 的设置保存在 `/etc/vimrc`，不建议直接修改，可以修改 `~/.vimrc`。默认不存在，需自行创建。

`vim ~/.vimrc`

文件中的双引号为注释符
```
set hlsearch　　"反白查找关键字
set backspace=2　　"可随时用倒退键删除
set autoindent　　"自动缩进
set ruler　　"显示右下角状态栏
set showmode　　"显示左下角状态栏
set nu　　"显示行号
set bg=dark　　"背景色
syntax on　　"语法检验，颜色显示
```

* vim 环境配置文件

vim 环境配置文件为 `~/.viminfo`。

在 vim 查找过的字符串会被反白，并且会一直反白，甚至在编辑其他文件时，也存在相同的字符串，会自动反白。vim 在退出时会记忆上次编辑的位置，下次打开自动定位。


| 按键 | 功能 |
| :--- | :--- |
| :set nu:set nonu | 显示行号取消行号 |
| :set hlsearch:set nohlsearch | 字符串反白 |
| :set autoindent:set noautoindent | 自动缩进 |
| :set backup | 自动保存备份文件 filename~ |
| :set ruler | 右下角状态栏 |
| :set showmode | 左下角状态栏 |
| :set backspace=0:set backspace=1:set backspace=2 | 2 可以删除任意值0 或 1 仅可删除刚刚输入的字符， 无法删除原有文字 |
| :set all | 显示目前所有的环境参数设置值。 |
| :set | 显示所有修改过的参数 |
| :syntax on:syntax off | 语法纠错 |
| :set bg=dark:set bg=light | 显示对比度 |




### 14.2.4 --help

`command --help` 用于查询命令的选项与参数简介。



### 14.2.5 MAN

软件开发商通常随软件一起会安装其帮助文档，称为 Manual Pages，简称 Man Page。

`man [章节号] command`

`man` 是使用 `less` 命令来显示各个 man page 的。

其查找功能是基于一个专用的缓存。在新安装一个软件之后，该缓存不会自动更新，需要使用 **`mandb`** 来更新。更新之后，新安装的软件就可以用 man 来查找说明文档了。

man page 通常保存在 `/usr/share/man/`。

#### man page 简介

* man page 结构

| 代号 | 内容说明 |
| :--- | :--- |
| NAME | 简短的命令、数据名称说明 |
| SYNOPSIS | 语法简介 |
| DESCRIPTION | 较完整的说明 |
| OPTIONS | 所有可用的选项 |
| COMMANDS | 可在此程序中下达的命令 |
| FILES | 参考或链接到的文件 |
| SEE ALSO | 可以参考的 |
| EXAMPLE | 范例 |


* 章节号

man page 按照类别被分为不同的章节，如果一个命令在多个章节中同时存在，系统会返回找到的第一个章节的内容。

可以手动指定章节号，以便查看特定章节中的文档。

`man 8 partprobe`

| 代号 | 代表内容 |
| --- | --- |
| 1 | 一般命令 |
| 2 | 系统调用 |
| 3 | 函数库函数 |
| 4 | 设备文件及驱动 |
| 5 | 文件格式及约定 |
| 6 | 游戏，屏保 |
| 7 | 其它 |
| 8 | 系统管理命令 |
| 9 | 内核 |



* 快捷键

| 按键 | 功能 |
| --------- | --------- |
| 空格 | 向下翻一页 |
| Page Down | 向下翻一页 |
| Page Up | 向上翻一页 |
| Home | 第一页 |
| End | 最后一页 |
| /string | 向下查找字符串 |
| ?string | 向上查找字符串 |
| n，N | 查找下一个，反向查找下一个 |
| q | 退出 |



#### MAN 语法

* `man -f command`

同 `whatis`，查看 **命令简要介绍** 及所在 **章节号**。

* `man -k command`

如果 **忘记了命令叫什么**，可以把其功能做为关键字搜索。

在 man page 的 **描述和说明页名称** 中查找关键字，效果同 `apropos command`。

如，忘记了那个手动更新分区表的命令，可以把 `partition table` 做为关键字搜索：

`man -k "partition table"`







### 14.2.6 INFO

info page 将帮助信息 **拆** 成单独的页面，页面之间还有“超链接”可跳转到其它页面，每个页面称为 **节点**。 可以通过 **tab** 键在超链接间跳转。 也可以使用 `U`，`P`，`N` 在各个层级和链接中跳转。

待查询的说明文档须以 **info 格式** 写成才能使用超链接等特殊功能。

info 格式的文件默认保存在 `/usr/share/info/`。

`info command`

随时按 **h** 键查看快捷键。


{% include figure image_path="/assets/images/4.3.info.gif" alt="" %}


#### info page 快捷键

| 按键 | 进行工作 |
| :--- | :--- |
| 空格键 | 下翻 |
| Page Down | 下翻 |
| Page Up | 上翻 |
| tab | 跳转下一节点 |
| Enter | 进入节点 |
| b | 跳转第一个节点 |
| e | 跳转最后一个节点 |
| n | 下一 |
| p | 上一节点 |
| u | 上一层 |
| s | 查找 |
| h，? | 帮助菜单 |
| q | 退出 |


* 其他帮助文档

`/usr/share/doc` 目录中有很多说明文档，保存在不同的 **子目录** 中。


























## 14.3 BASH 环境配置





### 14.3.1 BASH 提示信息



#### 本地终端登陆前信息

`/etc/issue`

在 **本地终端** 成功 **登陆前** 的提示信息。

issue 文件中各代码含义

`\d`  本地时间的日期

`\l`  终端机接口序号

`\m`  硬件的等级 （i386/i486/i586/i686…）

`\n`  主机的网络名称

`\O`  域名

`\r`  内核版本

`\t`  本地时间

`\S`  操作系统名称

`\v`  操作系统版本



#### SSH 登陆前信息

在 SSH 成功 **登陆前** 的提示信息。

SSH 服务的配置文件为 `/etc/ssh/sshd_config`，修改其中的参数 `Banner` 为 `/etc/issue.net`，然后重启 SSH 服务。这样 `/etc/issue.net` 就成了 SSH 登陆前信息的配置文件，自定义该文件内容即可。也可指定为其他文件。


#### 登陆成功后信息

`/etc/motd`

所有账号成功 **登陆后** 都会看到这个文件内的信息。









### 14.3.2 bash 环境配置文件

别名、自定义变量在退出 bash 后会失效，要保留这些设置，必须把这些设置写入配置文件。


#### 登陆 shell 与 非登陆 shell

* 登陆 shell

登陆以后才能获取的 shell 为登陆 shell。在 **本地、SSH** 登陆获取的均为登陆 shell。

登陆 shell 读取配置文件的 **流程**：

{% include figure image_path="/assets/images/10.4.login.shell.gif" alt="登陆 shell 读取配置文件流程" %}

* 非登陆 shell

无需登陆即可获取的 bash 叫非登陆 shell。如以 X 的图形化接口启动终端，或在原 bash 环境下再次运行 bash 这个命令。




#### 主要环境配置文件

`/etc/profile`，`/etc/bashrc` 用于系统 **全局环境变量** 设定

`~/.profile`，`~/.bashrc` 用于用户的 **私有环境变量** 设定

`~/.bash_profile`、`~/.bash_login`、`~/.profile` 作用是一样的，系统会依次查找，并使用找到的第一个文件，通常使用 **`~/.profile`**。下文中的读取 `~/.profile` 均代表这一查找过程。
{: .notice--info}

* `/etc/profile`

登陆 shell 使用。通常不修改。

登陆时读取。

内容： `$PATH`，`export VARs`，`umask`，读取 `/etc/profile.d/*.sh`。

* `~/.profile`

交互登录 shell 使用。通常自定义。

登陆时读取。

内容： `$PATH` 等用户私有环境变量，调用 `~/.bashrc`。

* `~/.bashrc`

由交互非登录 shell 读取。

用户登录时、启动新的 Shell 时都会读取。

内容：用户私有命令别名，调用 `/etc/bashrc`。

* `/etc/bashrc`

仅由 `~/.bashrc` 调用。

每次启动新的 shell 时读取。

内容：命令别名，`umask`，`$PS1`，`/etc/profile.d/*.sh`。

* `~/.bash_logout`

退出 bash 时读取。




#### 环境配置文件读取流程


##### 交互 登陆 shell，或非交互 shell 使用 `--login` 参数

* 读取并执行 **`/etc/profile`** 中的命令。

* 读取 **`~/.profile`**

* 交互 登陆 shell **退出** 时，或非交互 登陆 shell 运行 `exit` 内部命令时，读取并执行 **`~/.bash_logout`** 中的命令。

要想让 shell 在启动时不执行任何脚本，可使用 `--noprofile` 参数来调用。
{: .notice--info}

##### 交互 非登陆 shell

* 读取并运行 **`~/.bashrc`** 中的命令。

使用 `--norc` 参数可以 **禁止读取** `bashrc` 文件。

使用 `--rcfile filename` 参数，可以强制 bash 使用 **指定的配置文件**，而不用 `~/.bashrc`。

通常 `~/.bash_profile` 会调用 `~/.bashrc`。


##### 非交互

以非交互方式启动 bash，运行 Shell 脚本时，查找 `BASH_ENV` 环境变量，找到后扩展变量值，把变量值作为配置文件名来读取。

但不会使用 `PATH` 变量来查找文件文件名。

##### 由 SH 调用

由 `sh` 调用的 Shell，bash 会查找 **变量 `ENV`**，扩展其值，用其变量值做为 **唯一的配置文件名** 来读取，不会读取任何其它的配置文件，之后 bash 进入 POSIX 模式。。

##### 由远程 Shell Daemon 调用

通过 SSH 远程连接获取的 bash，会读取并执行 **`~/.bashrc`**。

即使 `--norc` 和 `--rcfile` 参数可用，SSH 调用 bash 时通常也不会使用这两个参数。

##### 有效与真实 UID/GID 不同

如果 bash 被调用时，有效 UID/GID 与真实 UID/GID 不同，并且没有使用 `-p` 美化格式的参数，则 **不会读取任何配置文件**，不会从环境变量继承 Shell 函数，有效 UID 会被 **重置为真实 UID**。

如果使用了 `-p` 参数，就会按正常情况读取配置文件，但有效 UID 不会重置。




#### 重新加载配置文件

利用 `source` 命令可以不必重新登陆，直接调用配置文件使其生效。

`source 配置文件`

`source ~/.bashrc`  重新加载配置文件

`. ~/.bashrc`  可以用 **`.`** 代替 `source`









### 14.3.3 STTY

`stty` 用于修改 **终端命令行的相关设置**，如快捷键。

#### 语法

`stty [选项] [参数]`

`-a` 以容易阅读的方式显示当前的所有配置

`-g` 以 stty 可读方式显示当前的所有配置


#### 范例

* 查看当前所有 stty 设置

`stty -a`  

* 禁止输出大写

`stty iuclc`     开启

`stty -iuclc`    恢复

* 禁止输出小写

`stty olcuc`    开启

`stty -olcuc`   恢复

* 打印出终端的行数和列数

`stty size`

* 改变 Ctrl+D 的方法

`stty eof "shit"`

系统默认用 `Ctrl+D` 来表示文件的结束，通过这种方法，可以自定义。

* 屏蔽显示

`stty -echo`   禁止回显，即打字时屏幕不显示，类似输入密码时的状态

`stty echo`    打开回显，恢复在屏幕上显示键入的字符

* 忽略回车符

`stty igncr`     开启，此时需用 `ctl + enter` 代替回车

`stty -igncr`   恢复


#### 常用设置项目

`^`   符号代表 `Ctrl` 键。

`intr = ^C`  中止当前程序

`quit = ^\`  退出当前运行程序

`quit = ^\`  向后删除

`kill = ^U`  删除命令行上所有文字

`eof = ^D`  结束输入

`start = ^Q`  在某个程序停止后，重新启动其输出

`stop = ^S`  停止屏幕输出

`susp = ^Z`  给正在运行的程序发送一个 terminal stop 的信号














### 14.3.4 SET

`set` 是 shell 的内置命令，用于 **设置 shell**。

* shell 内部属性维护

`set` 通过维护一系列现有 shell 内部变量，来 **设置 shell 解释器的属性**，从而能够 **控制 shell 解释器的一些行为**。

每个参数可以视为一个开关，用一个字母表示。开关的状态用 `+`，`-` 表示，**`-`** 表示 **开**，`+` 表示关。
{: .notice--success}

**`$-`** 变量的值为 set **当前打开的参数**，默认值为 himBH 。

* 保存 shell 本地变量

`set` 能够看到当前 shell 的 **所有本地变量**，包括 shell 函数、所有用户自定义变量、环境变量。

`set` **无法定义新的 shell 变量**。如要定义新的变量，可用 `declare 变量名=值`。



#### 语法

`set [参数]`

`-u`  当执行时使用到未定义过的变量，则显示错误信息。默认不启用。

`-v`  显示shell所读取的输入值。默认不启用。

`-x`  执行指令后，会先显示该指令及所下的参数。。默认不启用。

`-h`  自动记录函数的所在位置。默认启用。

`-H`  可用 `!命令编号` 的方式来执行历史命令。默认启用。

`-C`  使用 > 操作符时，文件如果存在，不会被覆盖。默认不启用。

`-m`  使用。默认启用。

**监视模式**：启动任务控制，该选项支持系统 shell 交互，后台进程以单独的进程组运行，在每次完成任务时，显示包含退出状态的状态文字反馈。
{: .notice--success}

#### 范例

* 查看当前 set 打开的参数

`echo $-`  

```bash
~]# echo $-
himBH
```

表示当前的 shell 其 `h`，`i`，`m`，`B`，`H` 这几个开关是打开的。


* 查看当前进程所有环境变量

不带选项执行 set

输出当前 shell 的所有变量，输出格式：name=value。set 命令的输出可以直接作为 stdin。

* 若使用未定义变量，则显示错误信息

```
set -u
echo $vbirding
-bash: vbirding: unbound variable
```

取消 `set +u`

* 执行前，显示该命令内容

```
set -x
++ printf '\033\]0;%s@%s:%s\007' dmtsai study '~' \# 列出提示符的控制码
echo ${HOME}
+ echo /home/dmtsai
/home/dmtsai
++ printf '\033\]0;%s@%s:%s\007' dmtsai study '~'
```













### 14.3.5 ENV

`env` 用于 **以指定的环境变量来运行命令**，或显示系统中已存在的环境变量。

`env`  是独立的第三方命令，它只能看到 shell 传递给它的变量，以及环境变量。

临时修改某环境变量的值，然后运行命令。

只使用 `-` 作为参数时，相当于 `-i` 的功能。

使用 `env` 命令可以新增或删除变量，也可以为现有变量赋予新值。

如果使用 `env` 命令在新环境中执行指令时，会因为没有定义环境变量 `PATH` 而提示错误信息 "no such file or directory"。此时，用户可以重新定义一个新的 `PATH` 或者使用绝对路径。

在实际使用中，经常用于在 shell 脚本中打开正确的解释器，此时，通常不会修改环境变量。

#### 语法

`env [  -i | - ] [Name=Value ]... [Command [ Argument ... ] ]`

`-i` 或 `-` ： 以空的环境运行命令，即不含 任何环境变量

不带参数时，显示当前的环境变量。



#### 范例

* 查看所有环境变量

`env`

* 反向显示 grep 的查询结果

`env GREP_OPTIONS='-v' grep one test.txt`

会显示 test.txt 文件中不含 `one` 的行

* 清除所有环境变量，用空的环境来运行一个新 shell

`env -i /bin/sh`

* 打开 xcalc 程序，并在另一个显示器显示

`env DISPLAY=foo.bar:1.0 xcalc`

实际上没有必要以这种方式打开程序，因为大多部的 shell 支持在执行命令之前临时指定环境变量。如：

`DISPLAY=foo.bar:1.0 xcalc`

* 用于脚本中

在起始行定义脚本解释器。

如：使用 `#!/usr/bin/env python3`，而不是直接使用 python3 的绝对路径，允许系统在 PATH 变量中查找 python 解释器。


















### 14.3.6 环境变量

环境变量用于给系统指定一些环境的设置参数，如是否要显示彩色等，如 PATH、HOME、MAIL、SHELL 等，环境变量通常以 **大写字母** 来表示。

#### HOME

用户的家目录

#### SHELL

当前 SHELL， Linux 默认使用 `/bin/bash`

#### HISTSIZE

执行命令的历史记录最大条数

#### MAIL

邮箱文件

#### PATH

可执行文件查找的路径

#### LANG

语系

#### RANDOM

随机数变量。

依靠随机数生成器 `/dev/random`。在 BASH 的环境下，这个变量的值介于 0~32767 之间。






### 14.3.7 EXPORT

把自定义变量转换为环境变量。

自定义变量与环境变量之间的差异在于量 **是否会被子进程引用**。

子进程只会 **继承** 父进程的 **环境变量**，不会继承自定义变量。

`export 变量名称`       转换自定义变量为环境变量

`export`      列出所有环境变量



























## 14.4 BASH 操作






### 14.4.1 bash 快捷键

| 组合按键 | 执行结果 |
| :--- | :--- |
| Ctrl + c | 终止当前命令 |
| Ctrl + d | 输入结束，如邮件结束的时候 |
| Ctrl + m | 回车 |
| Ctrl + s | 暂停屏幕输出 |
| Ctrl + q | 恢复屏幕输出 |
| Ctrl + z | 暂停当前命令 |
| Ctrl + u | 删除到行首 |
| Ctrl + k | 删除到行尾 |
| Ctrl + a | 光标到行首 |
| Ctrl + e | 光标到行尾 |







### 14.4.2 路径与命令查找顺序

shell 会根据命令行输入的一系列字符来判断哪些是命令，哪些是参数，哪些是控制符。

shell 在确定具体的命令之后，会按以下顺序来查找该命令：

`相对/绝对路径	>	别名	>	bash 内置命令	>	$PATH`

找到以后就立即运行，不再继续查找。

使用 `type -a command` 来查看命令类型信息。















### 14.4.3 别名

`alias lm=’ls -al | more’`  设置别名

`unalias lm`  取消别名









### 14.4.4 命令历史

【 历史文件 】

默认情况下，系统会把使用过的命令记录在 **磁盘中的 `~/.bash_history`** 。记录的是本次登陆之前的命令。

【 历史列表 】

本次登陆所运行的命令都暂存在 **内存中**，称为历史列表。只有成功退出系统后，历史列表中的命令才会自动保存到 `.bash_history` 中。

#### HISTORY 语法

`history 8`  列出最近 8 个命令

`history -c`	清空 **历史列表**

`history -a`  把列表中的命令 **追加到历史文件**

`history -r`  把历史文件中的命令 **追加到历史列表**

`history -w`  用历史列表 **覆盖历史文件**

`history`	查看历史文件中所有记录


##### 历史命令的读取与保存

用户以 bash 登陆时，系统会由 `~/.bash_history` 读取历史记录。

在用户退出时，系统会将其登陆期间运行的命令保存到 `~/.bash_history`。

`~/.bash_history` 记录的条数为 `$HISTFILESIZE`，超过这个限制的命令会自动删除，只保留最新的。

##### 历史命令的复用

`!!` 运行上一个命令

`!66` 运行第 66 条命令

`!al` 运行最近以 al 开头的命令

##### 安全隐患

很多重要数据在 root 执行的过程中会被记录到历史文件，如果被破解会很危险。

##### 同一帐号同时多窗口登陆

同一帐号同时多窗口登陆，会导致命令历史丢失。因为 **最后一个** 退出的会 **覆盖** 之前所有记录。

因此应该单一 bash 登陆，再用 **工作控制** 来切换不同工作。

##### 记录的时间标签

历史命令默认不记录命令下达的时间。可以通过修改环境变量 `HISTTIMEFORMAT="%d/%m/%y %T "`，记录显示时就会有日期、时间标签了。如果要永久使用该格式，可以在 `~/.bashrc` 中加入 `export HISTTIMEFORMAT="%d/%m/%y %T "` 来修改环境变量。若要立即测试，可 `srouce ~/.bashrc` 重新读取一遍脚本再测试。










### 14.4.5 通配符与特殊符号


#### 常用通配符

| 符号 | 功能 |
| :--- | :--- |
| **\*** | 0 到无穷多个任意字符 |
| **?** | 一个任意字符 |
| **\[** abcd **\]** | 一个括号内的字符，可能是 a， b， c， d 任何一个 |
| **\[** 0-9 **\]** | 0 到 9 之间的任一数字 |
| \[ **^** abc \] | 一个非 a， b， c 的字符 |

#### 特殊符号

| 符号 | 功能 |
| :--- | :--- |
| **#** | 注释 |
| **\\** | 转义 |
| **\|**  | 管道 |
| **;** | 连续命令分隔 |
| **~** | 家目录 |
| **$** | 变量前置符 |
| **&** | 命令置于后台 |
| **!** | 逻辑非 |
| **/** | 路径分隔符 |
| **&gt;， &gt;&gt;** | 数据流重定向：替换，追加 |
| **&lt;， &lt;&lt;** | 数据流重定向：输入定向 |
| **’  ’** | 全引用） |
| **" "** | 部分引用 |
| **\` \`** | 命令替换，同 $（ ） |
| **( )** | 在中间为子 shell 的起始与结束 |
| **{ }** | 在中间为命令区块的组合 |

文件名中不能使用上述字符。

















### 14.4.6 语系

系统支持的语系文件保存在 `/usr/lib/locale/`。

系统 **默认** 的语系保存在 `/etc/locale.conf`。


#### 解决乱码

1. Linux 默认支持的语系： `/etc/locale.conf`

2. 终端接口的语系：`LANG`，`LC_ALL` 变量

3. 文件原始编码

4. 打开终端的软件

只要 **文件原始编码** 和 **终端软件的编码** 一致，就能够正确显示。

Linux 本地的 tty1~tty6 默认不支持中文编码，一定会看到乱码。


#### 语系编码转换

使用 `iconv` 命令在不同编码之间转换，如繁转简。

`iconv -f 原编码 -t 新编码 filename [-o newfile]`

`--list`  查看支持的所有语系

`-f`  原编码

`-t`  新编码

`-o`  另存为

* 繁转 UTF8

`iconv -f big5 -t utf8 vi.big5 -o vi.utf8`

* 繁转简#### 语系编码转换

使用 `iconv` 命令在不同编码之间转换。可以用来繁体转简体。

`iconv -f 原本编码 -t 新编码 filename [-o newfile]`

##### 选项与参数

--list  查看支持的所有语系

-f  原编码

-t  新编码

-o  另存为

`iconv -f big5 -t utf8 vi.big5 -o vi.utf8`

* 繁体中文转简体中文

`iconv -f big5 -t gb2312 vi.big5 -o vi.gb`


`iconv -f big5 -t gb2312 vi.big5 -o vi.gb`



#### LOCALE


`locale -a`      # 查询支持的所有语系


```
locale
LANG=en_US          # 主语言环境
LC_CTYPE="en_US"      # 文字辨识的编码
LC_NUMERIC="en_US"      # 数字系统的显示信息
LC_TIME="en_US"      # 时间系统的显示数据
LC_COLLATE="en_US"      # 字符串的比较与排序等
LC_MONETARY="en_US"      # 货币格式
LC_MESSAGES="en_US"      # 提示信息，如功能表、错误信息等
LC_ALL=             # 整体语系的环境
```

`LANG` 和 `LC_ALL` 是语系编码中最主要的两个变量，通常仅设置这两个变量，其它的就会自动更新。
{: .notice--success}

#### 临时更改语系

`LANG=en_US.utf8`     临时更改语系变量值

`export LC_ALL=en_US.utf8`      转换为环境变量














### 14.4.7 换行符

* DOS 换行符为 **CRLF**

* Linux 换行符为 **LF**

* CR = `^M`

Carriage-Return，ASCII 13，`\r`，

* LF = `$`

Linux 无法识别 DOS 换行符，可用 `dos2unix` 转换。

* CR = `^M`

#### DOS2UNIX

`dos2unix` 用于转换 DOS 换行符。

软件包含 `dos2unix` 和 `unix2dos` 两个工具。

`dos2unix -kn file newfile`

`unix2dos -kn file newfile`

`-k`  保留原 mtime

`-n`  另存为新文件








### 14.4.8 命令序列

命令序列，就是一次执行多条命令，可以依次执行，也可以做简单的条件判断再执行。

#### 依次执行

`cmd ; cmd`

`sync; sync; shutdown -h now`


#### 条件执行

若前一个命令执行的结果为正确，`$? = 0` ，否则为非 0。

{% include figure image_path="/assets/images/10.5.logical.commands.gif" alt="依条件执行命令" %}

##### `&&` `||`

如果 `$? = 0`，执行 `&&` 后面的命令

如果 `$? ≠ 0`，执行 `||` 后面的命令

| 命令 | 说明 |
| :--- | :--- |
| cmd1 && cmd2 | $? = 0 则执行 cmd2，$? ≠ 0 则不执行 cmd2 |
| cmd1 \|\| cmd2 | $? ≠ 0 则执行 cmd2，$? = 0 则不执行 cmd2 |

##### 范例

* 若目录存在则创建文件

`ls /tmp/abc && touch /tmp/abc/hehe`

* 若目录不存在则新建

`ls /tmp/abc || mkdir /tmp/abc`

* 若目录不存在则新建，然后在新目录创建文件，存在则直接创建文件

`ls /tmp/abc || mkdir /tmp/abc && touch /tmp/abc/hehe`


* 若目录存在显示 ‘exist’ ，不存在显示 ‘not exist’

`ls /tmp/vbirding && echo “exist” || echo “not exist”`










































## 14.5 BASH 变量

在 Bash中，每一个变量的值都是 **字符串**。无论你给变量赋值时有没有使用引号，值都会以字符串的形式存储。

bash 环境中的数值运算，计算结果默认仅保留 **整数**。

### 14.5.1 常用变量


#### PS1

命令提示符，可用参数：

`\d`  日期，Mon Feb 2

`\H`  域名

`\h`  主机名

`\t`  24 小时的 HH:MM:SS

`\T`  12 小时的 HH:MM:SS

`\A`  24 小时的 HH:MM

`\@`  am/pm

`\u`  当前用户名

`\v`  bash 版本号

`\w`  绝对路径。家目录用~

`\W`  最近一层目录名

`\#`  运行的第几个命令

`$`  提示符，root 为#，其他为$

以上参数仅供 PS1 使用，与 bash 的变量设置没关系。

* 范例

`~]$ PS1='[\u@\h \w \A #\#]$ '`


#### $$

PID，Process ID，当前 Shell 的进程号



#### $？

上一个命令的 **返回值**

每条命令都会返回一个运行后的代码。如果成功执行，返回0，如果发生错误，返回非0。

#### OSTYPE

操作系统类型，linux-gnu

#### HOSTTYPE

主机类型，x86_64

#### MACHTYPE

系统硬件，x86_64-redhat-linux-gnu












### 14.5.2 变量的有效范围

环境变量 = **全域** 变量

自定义变量 = **区域** 变量


#### 环境变量可以被子进程引用的原因

* 启动一个 shell 时，操作系统会为其分配一个 **内存区块**，其中的变量允许子进程引用

* 在父程序使用 export 会把自定义变量的值写到此内存区块中

* 启动子进程时，子进程可以把父程序的环境变量所在的内存区块导入自己的内存区块。





### 14.5.3 变量的声明

#### READ

读取来自键盘输入的变量值。

`read [-pt] variable`

`-p`  提示信息

`-t`  倒计时秒数

`read -p "Please keyin your name: " -t 30 named`

#### DECLARE

declare 声明变量，并设置变量的属性

`declare [-aixr] variable`

`-a`  数组

`-i`  整型

`-x`  转换为环境变量；

`-r`  将变量设置为只读

如果使用 + 来代替 - ，则会取消相应的属性。

##### 范例

* 声明数字变量

`declare -i sum=100+300+50`


* 声明环境变量

`declare -x sum`

* 声明只读变量

`declare -r sum`

* 取消环境变量

`declare +x sum`  

该变量恢复为自定义变量



#### 数组变量

`var[index]=content`

bash 使用的是 **一维数组**。

```bash
var[1]="small min"
var[2]="big min"
var[3]="nice min"
echo "${var[1]}，${var[2]}，${var[3]}"
small min，big min，nice min
```
