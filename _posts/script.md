---
toc: true
toc_label: "16. SHELL 脚本"
toc_icon: "code"
title: "SHELL 脚本"
tag: [shell, script, bash, ]
tags: linux
categories: "linux"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/linux.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---






## 12.1 什么是 Shell scripts

### 12.1.1 为什么学习 shell scripts

* 自动化管理

* 追踪与管理系统

* 简单入侵侦测

系统有异常时，会记录在系统日志，通过分析系统日志，提高主机的自我保护能力。

* 简单的数据处理

* 跨平台支持

Unix Like、Windows 均可用。

shell script 仅适用系统管理，不适用大量运算。

### 12.1.2 脚本编写方法

#### 脚本编写主要原则

1. 命令的执行是从上而下、从左而右的分析与执行

2. 命令、选项与参数间的多个空格会被忽略

3. 空行也将被忽略，并且 \[tab\] 视为空格

4. 只要读取到回车符（CR） ，就会尝试开始执行该行命令；

5. 如果一行内容太多，可以用 “ \\[Enter\] ” 延伸至下一行；

6. \# 后面的数据视为注释

#### 如何执行脚本

* 直接命令下达： `shell.sh` 文件必须要具备`可读`与`可执行`的权限，然后：

  * 绝对路径：`/home/dmtsai/shell.sh` 来运行命令

  * 相对路径：`./shell.sh` 来运行命令

  * 将 shell.sh 放在 PATH 指定的目录内，`shell.sh`

* 用 bash 程序来执行：`bash shell.sh` 或 `sh shell.sh`

sh 是 bash 的软链接

#### 脚本主要结构

##### 宣告 shell 名称

`#!/bin/bash `

Linux 会根据宣告的 shell 名称来选择正确的 shell 来执行脚本。

##### 程序内容说明

说明该脚本的：

1. 内容与功能；

2. 版本信息；

3. 作者与联络方式；

4. 创建日期；

5. 历史纪录

这将有助于未来程序的修改与排错。

##### 宣告环境变量

PATH 与 LANG 等。

##### 主要程序

主要的程序写好

##### 定义返回值

用 exit 命令来**中断**程序，并**返回**一个数值给系统。

`exit 0`

📕 利用这个 exit N 功能，可以自定义错误信息，让程序变得更加智能。

### 12.1.3 脚本编写规范

##### 详细注释

* 脚本的功能

* 脚本的版本信息

* 脚本的作者与联系方式

* 脚本的版权宣告方式

* 脚本历史

* 脚本内较特殊的命令，使用“绝对路径”的方式来下达；

* 脚本预先宣告与设置运行时需要的环境变量。


















## 12.1 什么是 Shell scripts

### 12.1.1 为什么学习 shell scripts

* 自动化管理

* 追踪与管理系统

* 简单入侵侦测

系统有异常时，会记录在系统日志，通过分析系统日志，提高主机的自我保护能力。

* 简单的数据处理

* 跨平台支持

Unix Like、Windows 均可用。

shell script 仅适用系统管理，不适用大量运算。

### 12.1.2 脚本编写方法

#### 脚本编写主要原则

1. 命令的执行是从上而下、从左而右的分析与执行

2. 命令、选项与参数间的多个空格会被忽略

3. 空行也将被忽略，并且 \[tab\] 视为空格

4. 只要读取到回车符（CR） ，就会尝试开始执行该行命令；

5. 如果一行内容太多，可以用 “ \\[Enter\] ” 延伸至下一行；

6. \# 后面的数据视为注释

#### 如何执行脚本

* 直接命令下达： `shell.sh` 文件必须要具备`可读`与`可执行`的权限，然后：

  * 绝对路径：`/home/dmtsai/shell.sh` 来运行命令

  * 相对路径：`./shell.sh` 来运行命令

  * 将 shell.sh 放在 PATH 指定的目录内，`shell.sh`

* 用 bash 程序来执行：`bash shell.sh` 或 `sh shell.sh`

sh 是 bash 的软链接

#### 脚本主要结构

##### 宣告 shell 名称

`#!/bin/bash `

Linux 会根据宣告的 shell 名称来选择正确的 shell 来执行脚本。

##### 程序内容说明

说明该脚本的：

1. 内容与功能；

2. 版本信息；

3. 作者与联络方式；

4. 创建日期；

5. 历史纪录

这将有助于未来程序的修改与排错。

##### 宣告环境变量

PATH 与 LANG 等。

##### 主要程序

主要的程序写好

##### 定义返回值

用 exit 命令来**中断**程序，并**返回**一个数值给系统。

`exit 0`

📕 利用这个 exit N 功能，可以自定义错误信息，让程序变得更加智能。

### 12.1.3 脚本编写规范

##### 详细注释

* 脚本的功能

* 脚本的版本信息

* 脚本的作者与联系方式

* 脚本的版权宣告方式

* 脚本历史

* 脚本内较特殊的命令，使用“绝对路径”的方式来下达；

* 脚本预先宣告与设置运行时需要的环境变量。



















## 12.2 简单的 shell script 练习

### 12.2.1 简单范例

#### 交互式脚本：变量值由用户输入

用 read 命令，让用户输入first name 与 last name，最后在屏幕上显示：“Your full name is: ”的内容：

```bash
read -p "Please input your first name: " firstname # 提示用户输入  
read -p "Please input your last name: " lastname # 提示用户输入  
echo -e "\nYour full name is: ${firstname} ${lastname}" # 结果由屏幕输出
```

#### 根据日期命名文件

创建三个空的文件，文件名前缀由用户输入，后缀为前天、昨天、今天的日期，即 filename\_20150714, filename\_20150715, filename\_20150716


```
# 请用户输入文件名称，赋值给变量 fileuser

echo -e "I will use 'touch' command to create 3 files."
read -p "Please input your filename: " fileuser

# 判断变量是否为空
# 若不存在或空则赋值 filename
filename=${fileuser:-"filename"}

# 用 date 命令为文件命名
# 前两天的日期
date1=$(date --date='2 days ago' +%Y%m%d）
# 前一天的日期
date2=$(date --date='1 days ago' +%Y%m%d）
# 今天的日期
date3=$(date +%Y%m%d）
# 配置文件名
file1=${filename}${date1}
file2=${filename}${date2}
file3=${filename}${date3}

# 创建文件
touch "${file1}"
touch "${file2}"
touch "${file3}"
```



#### 数值运算：简单的加减乘除

bash shell 默认仅支持到整数的运算。

```bash
echo -e "You SHOULD input 2 numbers, I will multiplying them! \n"
read -p "first number: " firstnu
read -p "second number: " secnu
total=$((${firstnu}*${secnu}))
echo -e "\nThe result of ${firstnu} x ${secnu} is ${total}"
```

声明变量类型可以用 `declare -i total=${firstnu}*${secnu}`

📕 但更建议用：`var=$((运算内容))`

括号最里面允许空格，支持加、减、乘、除、余运算。

* 计算小数，可以借助 bc：

```
echo "123.123*55.9" | bc
6882.575
```

#### 数值运算：通过 bc 计算 pi

计算 𝝅 小数点后 N 位，常用于测试时给 CPU 加压。

```bash
echo -e "This program will calculate pi value. \n"
echo -e "You should input a float number to calculate pi value.\n"
read -p "The scale number (10~10000） ? " checking
num=${checking:-"10"}    # 开始判断有否有输入数值
echo -e "Starting calcuate pi value. Be patient."
time echo "scale=${num}; 4*a(1)" | bc -lq
```

### 12.2.2 不同的执行方式 （source, sh script, ./script）

#### 直接执行

绝对路径、相对路径、${PATH} 内、bash、sh

脚本会用一个新的 bash 环境来执行脚本内的命令，即在**子程序的 bash** 内执行的。当子程序完成后，其各项变量或动作将会结束而不会返回到父程序中。

#### 用 source 执行脚本：在父程序中执行

`source pi.sh`

用 source 来执行命令时，脚本是在父程序中运行的，即原 bash 内，因此变量和动作均继续有效。

![](https://lh6.googleusercontent.com/rKtV05f7VyuFI80m6TLd-itrquKDX3dL41SttpBgUd1Fd2OyCw5mlfVtG9x3ZAs74nKjtlQNofCpFMNGLGUAqKIDSrtMVJ17vfd-mwxkSPIwrGmfi5eLbKI2iSZSLxvooxLdn0K3)















## 12.3 逻辑表达式

bash 的条件表达式中有三个几乎等效的符号和命令：**test**，**`[]`** 和 **`[[ ]]`** 。通常习惯用 `if []; then` 。而 `[[ ]]` 的出现是为了兼容 >< 之类的运算符。不考虑对低版本 bash 和对 sh 的兼容的情况下，用 `[[ ]]` 兼容性强，处理比较快，在做条件运算时候，可以使用该运算符。

### 逻辑运算符

* 判断 shell 选项状态

| 参数 | 含义 |
| --:-- | :-- |
| [ **-o** OPTIONNAME ] | shell 的 "OPTIONNAME" **选项已启用** |

* 判断文件类型

| 参数 | 含义 |
| --:-- | :-- |
| [ **-b** FILE ] | 文件存在，为**块设备** |
| [ **-c** FILE ] | 文件存在，为**字符设备** |
| [ **-d** FILE ] | 文件存在，为**目录** |
| [ **-f** FILE ] | 文件存在，为**普通文件** |
| [ **-h** FILE ] | 文件存在，为**软链接** |
| [ **-p** FILE ] | 文件存在，为 **FIFO** 文件 |
| [ **-L** FILE ] | 文件存在，为**软链接** |
| [ **-S** FILE ] | 文件存在，为 **socket** 文件 |

* 判断文件属性

| 参数 | 含义 |
| --:-- | :-- |
| [ **-a** FILE ] | 文件存在 |
| [ **-e** FILE ] | 文件**存在** |
| [ **-s** FILE ] | 文件存在，**非空** |
| [ **-t** FD ] | FD 为打开，指向终端 |
| [ **-N** FILE ] | 文件存在，上次读取后**已修改** |
| [ **-r** FILE ] | 文件存在，**可读** |
| [ **-w** FILE ] | 文件存在，**可写** |
| [ **-x** FILE ] | 文件存在，**可执行** |
| [ **-u** FILE ] | 文件存在，有 **SUID** |
| [ **-g** FILE ] | 文件存在，有 **SGID** |
| [ **-k** FILE ] | 文件存在，有 **Sbit** |
| [ **-O** FILE ] | 文件存在，**UID** 有效 |
| [ **-G** FILE ] | 文件存在，**GID** 有效 |

* 比较文件

| 参数 | 含义 |
| --:-- | :-- |
| [ FILE1 **-nt** FILE2 ] | FILE1 比 FILE2 **新**，或 FILE1 存在而 FILE2 不存在 |
| [ FILE1 **-ot** FILE2 ] | FILE1 比 FILE2 **旧**，或 FILE2 存在而 FILE1 不存在 |
| [ FILE1 **-ef** FILE2 ] | FILE1 和 FILE2 指向**同一设备**、**同一 inode** |

新旧是根据修改时间。

* 比较两个整数

| 参数 | 含义 |
| --:-- | :-- |
| ARG1 **-eq** ARG2 | 整数1 **等于**整数2 |
| ARG1 **-ne** ARG2 | 整数1 **不等于**整数2 |
| ARG1 **-lt** ARG2 | 整数1 **小于**整数2 |
| ARG1 **-le** ARG2 | 整数1 **小于等于**整数2 |
| ARG1 **-gt** ARG2 | 整数1 **大于**整数2 |
| ARG1 **-ge** ARG2 | 整数1 **大于等于**整数2 |

* 比较字符串

| 参数 | 含义 |
| --:-- | :-- |
| [ **-z** STRING ] | 字符串**长度为 0** |
| [ **-n** STRING ] or [ STRING ] | 字符串**长度不为 0** |
| [ STRING1 **==** STRING2 ] | 字符串**相同**，可以用 "=" 代替 "==" 以遵从 POSIX |
| [ STRING1 **!=** STRING2 ] | 字符串**不同** |
| [ STRING1 **<** STRING2 ] | 当前语系中，字符串1**排在前面** |
| [ STRING1 **>** STRING2 ] | 当前语系中，字符串1**排在后面** |

* 多重条件判断

| 参数 | 含义 |
| --:-- | :-- |
| [ EXPR1 -a EXPR2 ] | 与 |
| [ EXPR1 -o EXPR2 ] | 或 |
| [ ! EXPR ] | 否 |
| [ ( EXPR ) ] | 返回表达式的值，用于**覆盖**运算符的正常**优先级** |


### 12.3.1 test

test 如果测试成功，不输出任何信息，返回值为 0 。可以后继与 && 及 || 配合实现不同条件执行不同命令。

#### 范例

让用户输入一个文件名，由系统判断：

该文件是否存在，若不存在则提示“Filename does not exist”，并中断程序；

1. 若文件存在，则判断其文件类型是文件还是目录，然后显示 “Filename is regular file” 或 “Filename is directory”

2. 判断用户的身份对该文件或目录所拥有的权限，并输出权限数据。

```bash
# 1. 让用户输入文件名，并且判断用户是否真的有输入字串？

echo -e "Please input a filename, I will check the filename's type and permission. \n\n"
read -p "Input a filename : " filename
test -z ${filename} && echo "You MUST input a filename."&& exit 0

\# 2\. 判断文件是否存在？若不存在则显示讯息并结束脚本

test ! -e ${filename} && echo "The filename '${filename}' DO NOT exist"&& exit 0

\# 3\. 开始判断文件类型与属性

test -f ${filename} && filetype="regulare file"
test -d ${filename} && filetype="directory"
test -r ${filename} && perm="readable"
test -w ${filename} && perm="${perm} writable"
test -x ${filename} && perm="${perm} executable"

\# 4\. 开始输出信息！

echo "The filename: ${filename} is a ${filetype}"
echo "And the permissions for you are : ${perm}"
```

### 12.3.2 判断符号 \[ \]

中括号作为判断符号可以**单独使用**，如果判断条件为真，则返回值为 0 。

`[ -z "${HOME}" ] ; echo $?`

📕 中括号的内侧、比较符的外侧都必须有**空格**分隔

```
[ "$HOME" == "$MAIL" ]  
 ^       ^  ^       ^
```

#### 判断符号使用规则

* 每个元素都用**空格**分开

* 变量都用**双引号**引用

* 常数用**单引号**或**双引号**引用

#### 范例

1. 程序运行后请用户选择 Y 或 N ，

2. 如果用户输入 Y 或 y 时，显示“ OK, continue ”

3. 如果用户输入 n 或 N 时，显示“ Oh, interrupt ！”

4. 如果是 Y/y/N/n 以外的其他字符，就显示“ I don’t know what your choice is ”

```bash
read -p "Please input (Y/N): " yn
[ "${yn}" == "Y" -o "${yn}" == "y" ] && echo "OK, continue" && exit 0
[ "${yn}" == "N" -o "${yn}" == "n" ] && echo "Oh, interrupt!" && exit 0
# -o 表示 or
echo "I don't know what your choice is"&& exit 0
```













### 12.3.3 位置参数

shell 提供了一个称为位置参数的**变量集合**，这个集合包含了命令行中所有**独立的单词**。这些变量按照从0到9给予命名。

即使不带命令行参数，位置参数 $0 总会包含命令行中出现的第一个单词，即程序的**完整路径**。





#### 特殊位置参数


| 参数 | 描述 |
| --:-- | :--- |
| $*	| 扩展成一个**从1开始**的位置参数列表。当它被用双引号引起来的时候，展开成一个由双引号引起来的字符串，包含了**所有**的位置参数，每个位置参数由 shell 变量 IFS 的第一个字符（默认为一个**空格**）分隔开。 |
| $@ | 扩展成一个从1开始的位置参数列表。当它被用双引号引起来的时候，它把每一个位置参数展开成一个由**双引号**引起来的、用**空格**分开的字符串。 |
| $# | 参数的总数 |

📕 当输入的参数内带有**双引号**\("\) 时，建议还是得要使用 "**$@**" 来带入脚本中， 否则双引号会被取消。如：

`command "para1" "par para para2" `

用 $@ 会识别为 2 个参数，而用 $* 会识别为 4 个参数。

**范例**

```bash
echo "The script name is ${0}"
echo "Total parameter number is $\#"
[ "$#" -lt 2 ] && echo "The number of parameter is less than 2. Stop here." && exit 0
echo "The whole parameter is '$@'"
echo "The 1st parameter ${1}"
echo "The 2nd parameter ${2}"
```

执行结果：

```
sh how_paras.sh theone haha quot

The script name is how\_paras.sh    # 文件名
Total parameter number is 3    # 三个参数
Your whole parameter is 'theone haha quot'   # 参数的内容全部
The 1st parameter theone    # 第一个参数
The 2nd parameter haha    # 第二个参数
```




#### shift

位置参数可以用 shift 命令左移。

Bash 只定义了 9 个位置参数变量，从 $1 到 $9，借助 shift 命令就可以访问多于 9 个的参数。

如 shift 3 表示原来的 $4 现在变成 $1，原来的 $5 现在变成 $2 等等，原来的 $1、$2、$3 丢弃，**$0 不移动**。

不带参数的 shift 命令相当于 **shift 1**。

**范例**

```bash
echo "Total parameter number is $#"
echo "Your whole parameter is '$@'"
shift   # 进行第一次“一个变量的 shift ”
echo "Total parameter number is $#"
echo "Your whole parameter is '$@'"
shift 3   # 进行第二次“三个变量的 shift ”
echo "Total parameter number is $#"
echo "Your whole parameter is '$@'"
```

执行结果：

```
sh shift_paras.sh one two three four five six   # 给六个参数
Total parameter number is 6  # 最原始的参数变量情况
Your whole parameter is 'one two three four five six'
Total parameter number is 5   # 第一次偏移1个，one 消失
Your whole parameter is 'two three four five six'
Total parameter number is 2   # 第二次偏移3个，two three four 消失
Your whole parameter is 'five six'
```























## 12.4 条件表达式

### 12.4.1 if … then

#### 单层、简单条件表达式

```bash
if [ 条件表达式 ]; then
	命令
fi
```

##### 多个条件

* 把多个条件写入一个中括号

* 单个条件写入**中括号**，用 && （与)或 || （或)分隔

`[ “${yn}” == “Y” -o “${yn}” == “y” ]`

可写成：

`[ “${yn}” == “Y” ] || [ “${yn}” == “y” ]`

**范例**

```bash
read -p "Please input (Y/N): " yn
if [ "${yn}" == "Y" ] || [ "${yn}" == "y" ]; then
	echo "OK, continue"
	exit 0
fi

if [ "${yn}" == "N" ] || [ "${yn}" == "n" ]; then
	echo "Oh, interrupt!"
	exit 0
fi

echo "I don't know what your choice is"&& exit 0
```

#### 多重、复杂条件表达式

##### 一个条件的判断

```bash
if [ 条件表达式 ]; then
	命令
else
	命令
fi
```

##### 多个条件的判断

```bash
if [ 条件表达式一 ]; then
	命令
elif [ 条件表达式二 ]; then
	命令
else
	命令
fi
```

**范例**

* 判断用户输入的字符

```bash
read -p "Please input (Y/N): " yn
if [ "${yn}" == "Y" ] || [ "${yn}" == "y" ]; then
	echo "OK, continue"
elif [ "${yn}" == "N" ] || [ "${yn}" == "n" ]; then
	echo "Oh, interrupt!"
else
	echo "I don't know what your choice is"
fi
exit 0
```

* 判断用户输入的参数

```bash
if [ "${1}" == "hello" ]; then
	echo "Hello, how are you ?"
elif [ "${1}" == "" ]; then
	echo "You MUST input parameters, ex&gt; {${0} someword}"
else
	echo "The only parameter is 'hello', ex&gt; {${0} hello}"
fi
exit 0
```

* 判断字符串

利用 `netstat -tuln` 可以查看当前主机启动的服务：

```
netstat -tuln

Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address Foreign Address State
tcp 0 0 0.0.0.0:22 0.0.0.0:* LISTEN
tcp 0 0 127.0.0.1:25 0.0.0.0:* LISTEN
tcp6 0 0 :::22 :::* LISTEN
tcp6 0 0 ::1:25 :::* LISTEN
udp 0 0 0.0.0.0:123 0.0.0.0:*
udp 0 0 0.0.0.0:5353 0.0.0.0:*
udp 0 0 0.0.0.0:44326 0.0.0.0:*
udp 0 0 127.0.0.1:323 0.0.0.0:*
udp6 0 0 :::123 :::*
udp6 0 0 ::1:323 :::*
# 封包格式 本地IP:端口 远端IP:端口 是否监听
```

检查当前主机是否打开了 21，22，25，80 这几个端口。


```bash
# 简要说明

echo "Now, I will detect your Linux server's services!"

echo -e "The www, ftp, ssh, and mail(smtp) will be detect! \n"

# 进行测试，保存测试结果到文件

testfile=/dev/shm/netstat_checking.txt
netstat -tuln &gt; ${testfile}  # 先转存数据到内存中
testing=$(grep ":80 " ${testfile}) # 检查 80

if [ "${testing}" != "" ]; then
	echo "WWW is running in your system."
fi

testing=$(grep ":22 " ${testfile}) # 检查 22

if [ "${testing}" != "" ]; then
	echo "SSH is running in your system."
fi

testing=$(grep ":21 " ${testfile}) # 检查 21

if [ "${testing}" != "" ]; then
	echo "FTP is running in your system."
fi

testing=$(rep ":25 " ${testfile}) # 检查 25

if [ "${testing}" != "" ]; then
	echo "Mail is running in your system."
fi

exit 0
```

* 计算剩余天数

```bash
# 简要说明，请用户键入目的日期

echo "This program will try to calculate :"
echo "How many days before your demobilization date..."
read -p "Please input your demobilization date (YYYYMMDD ex>20150716): " date2

# 检查输入的内容是否有效

date_d=$(echo ${date2} |grep '[0-9]{8}') # 检查是否八位数字

if [ "${date_d}" == "" ]; then
	echo "You input the wrong date format...."
	exit 1
fi

# 计算剩余天数

declare -i date_dem=$(date --date="${date2}" +%s)  # 目标日期秒数
declare -i date_now=$(date+%s) # 现在日期秒数
declare -i date_total_s=$((${date_dem}-${date_now}))  # 剩余秒数
declare -i date_d=$((${date_total_s}/60/60/24))  # 转为天数

if [ "${date_total_s}" -lt "0" ]; then # 判断是否已过期
	echo "You had been demobilization before: " $((-1*${date_d})) " ago"
else
	declare -i date_h=$(($((${date_total_s}-${date_d}*60*60*24))/60/60))
	echo "You will demobilize after ${date_d} days and ${date_h} hours."
fi

exit 0
```

### 12.4.2 case … esac

有多个既定的变量值：

```bash
case $变量 in
 "变量值1")
	程序段
	;;
 "变量值2")
	程序段
	;;
 *)  # 所有其他变量值
	其他程序执行段
	exit 1
	;;
esac
```

**范例**

```bash
case ${1} in
 "hello")
	echo "Hello, how are you ?"
	;;
 "")
	echo "You MUST input parameters, ex&gt; {${0} someword}"
	;;
 *) # 相当于通配符，0~无穷多个任意字符之意！
	echo "Usage ${0} {hello}"
	;;
esac
```

#### case 变量的获取方式

##### 直接下达

直接在执行命令时使用**参数**

`script.sh variable`

`/etc/init.d` 目录中大多数程序是这样设计的。

##### 用户交互

通过 `read` 命令请用户输入变量值。

```bash
echo "This program will print your selection !"
# read -p "Input your choice: " choice # 启用则请用户输入变量值
# case ${choice} in # 启用则请用户输入变量值

case ${1} in
 "one")
	echo "Your choice is ONE"
	;;
 "two")
	echo "Your choice is TWO"
	;;
 "three")
	echo "Your choice is THREE"
	;;
 *)
	echo "Usage ${0} {one|two|three}"
	;;
esac
```

### 12.4.3 function

##### 函数

函数可以在 shell script 中**简化程序代码**。

```bash
function fname() {
	程序段
}
```

📕 因为脚本执行时是由上而下，因此函数一定要置于程序代码的**最前面**。

##### 内置变量

```bash
function printit(){
echo "Your choice is ${1}" # 这个 $1 必须要参考下面指令的下达
}

echo "This program will print your selection !"

case ${1} in
 "one")
	printit 1
	;;
 "two")
	printit 2
	;;
 "three")
	printit 3
	;;
 *)
	echo "Usage ${0} {one|two|three}"
	;;
esac
```

##### 区分脚本位置变量与函数位置变量

脚本的位置变量

$0 是脚本文件名，$1 是脚本运行的参数

函数的位置变量

$0 是函数名，$1 是函数调用的参数

























## 12.5 循环

循环可以不断执行某个程序段落，直到用户设置的条件达成为止。

### 12.5.1 不定循环

#### while

当条件**成立**时，就进行**循环**，直到条件不成立才停止。

```bash
while [ 条件表达式 ]
do
	程序
done
```


#### until

当条件**不成立**时，就进行**循环**，直到条件成立才停止。
```bash
until [ 条件表达式 ]
do
	程序
done
```

* 请用户输入 yes 或者是 YES 才结束程序的执行，否则就一直请用户输入字符串。

```bash
while [ "${yn}" != "yes" -a "${yn}" != "YES" ]
do
	read -p "Please input yes/YES to stop this program: " yn
done

echo "OK! you input the correct answer."
```

* 如果使用 until：

```bash
until [ "${yn}" == "yes" -o "${yn}" == "YES" ]
do
	read -p "Please input yes/YES to stop this program: " yn
done

echo "OK! you input the correct answer."
```

* 计算 1+2+3+…+100：

```bash
s=0 # 这是加总的数值变量
i=0 # 这是累计的数值，亦即是 1, 2, 3....

while [ "${i}" != "100" ]
do
	i=$(($i+1)) # 每次 i 都会增加 1
	s=$(($s+$i)) # 每次都会加总一次！
done

echo "The result of '1+2+3+...+100' is ==&gt; $s"
```

### 12.5.2 for…do…done （固定循环）

for 用于已知次数的循环

##### 变量赋值方式

* 直接赋值：txt1 txt2 txt3空格分隔不加引号的字符串

* seq：$(seq 1 100)seq 接起始与结束字符

* 连续字符：{1..9}，{a..z}两个点连接起始与结束字符

```bash
for var in con1 con2 con3 ...
do
	程序段
done
```

* 有三种动物，分别是 dog, cat, elephant 三种，每一行输出：“There are dogs…”

```bash
for animal in dog cat elephant
do
	echo "There are ${animal}s.... "
done
```

* 用 id 分别查看 /etc/passwd 中的每个用户

```bash
users=$(cut -d ':' -f1 /etc/passwd)

for username in ${users}
do
	id ${username}
done
```

* ping 100 台主机，IP 地址为 192.168.1.1~192.168.1.100

```bash
network="192.168.1"

for sitenu in $(seq 1 100)
do
	ping -c 1 -w 1 ${network}.${sitenu} &&gt; /dev/null && result=0 || result=1
	if [ "${result}" == 0 ]; then
		echo "Server ${network}.${sitenu} is UP."
	else
		echo "Server ${network}.${sitenu} is DOWN."
	fi
done
```

* 用户输入目录名，系统列出目录内的文件名列表及权限

```bash
# 目录是否存在

read -p "Please input a directory: " dir

if [ "${dir}" == "" -o ! -d "${dir}" ]; then
	echo "The ${dir} is NOT exist in your system."
	exit 1
fi

# 开始测试文件

filelist=$(ls ${dir}) # 列出所有在该目录下的文件名称
for filename in ${filelist}
do
	perm=""
	test -r "${dir}/${filename}"&& perm="${perm} readable"
	test -w "${dir}/${filename}"&& perm="${perm} writable"
	test -x "${dir}/${filename}"&& perm="${perm} executable"
	echo "The file ${dir}/${filename}'s permission is ${perm} "
done
```

### 12.5.3 for…do…done 的数值处理

for 循环另外一种写法，用于按指定次数循环：

```bash
for (( i=1; i&lt;=100; i=i+1 ))
do
	t=$(( ${t}+${i} ))
done
```

初始值：i=1

限制值：i&lt;=100

执行步阶：i=i+1 或 i++

* 从 1 累加

```bash
read -p "Please input a number, I will count for 1+2+...+your_input: " nu
s=0

for (( i=1; i&lt;=${nu}; i=i+1 ))
do
	s=$((${s}+${i}))
done

echo "The result of '1+2+3+...+${nu}' is ==&gt; ${s}"
```

### 12.5.4 随机数与数组的配合

* 随机决定中午吃什么：
```bash
eat[1]="卖当当漢堡包"
eat[2]="肯爷爷炸鸡"
eat[3]="彩虹日式便当"
eat[4]="越油越好吃大雅"
eat[5]="想不出吃啥学餐"
eat[6]="太师父便当"
eat[7]="池上便当"
eat[8]="怀念火车便当"
eat[9]="一起吃方便面"
eatnum=9 #可用的餐厅总数
check=$(( ${RANDOM} * ${eatnum} / 32767 + 1 ))
echo "your may eat ${eat[${check}]}"
```

* 每次列出 3 个店家，不能重复

```bash
eat[1]="卖当当漢堡包"
eat[2]="肯爷爷炸鸡"
eat[3]="彩虹日式便当"
eat[4]="越油越好吃大雅"
eat[5]="想不出吃啥学餐"
eat[6]="太师父便当"
eat[7]="池上便当"
eat[8]="怀念火车便当"
eat[9]="一起吃方便面"
eatnum=9
eated=0

while [ "${eated}" -lt 3 ]; do
	check=$(( ${RANDOM} * ${eatnum} / 32767 + 1 ))
	mycheck=0

	if [ "${eated}" -ge 1 ]; then
		for i in $(seq 1 ${eated} ) # 检查本次随机号是否与前几次重复
		do
			if [ ${eatedcon[$i]} == $check ]; then
				mycheck=1         # 重复了
			fi
		done
	fi

	if [ ${mycheck} == 0 ]; then
		echo "your may eat ${eat[${check}]}"
		eated=$(( ${eated} + 1 ))
		eatedcon[${eated}]=${check}#保存本次随机数
	fi
done
```

**变量含义**

eated：餐馆计数

check：随机数（1-9）

mycheck：是否与之前重复

eatedcon：每次的随机数

















## 12.6 shell script 的追踪与 debug

`sh [-nvx] scripts.sh`

##### 选项与参数

`-n`  不执行，仅检查语法

`-v`  执行前，先把脚本内容输出到屏幕

`-x`  显示执行过程

* 测试 dir_perm.sh 有无语法的问题？

`sh -n dir_perm.sh`

若语法没有问题，则不会显示任何信息

* 将 show_animal.sh 的执行过程全部列出来～

`sh -x show_animal.sh`

```
+ PATH=/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:/root/bin
+ export PATH
+ for animal in dog cat elephant
+ echo 'There are dogs.... '
There are dogs....
+ for animal in dog cat elephant
+ echo 'There are cats.... '
There are cats....
+ for animal in dog cat elephant
+ echo 'There are elephants.... '
There are elephants....
```
