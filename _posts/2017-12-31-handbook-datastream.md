---
toc: true
toc_label: "速查手册-数据流"
toc_icon: "book"
title: "速查手册-数据流"
tag: [数据流, 重定向, 正则表达式]
category: "handbook"
published: false
---










####  数据流重定向

* 基本概念

STDIN：描述符为 0，用 `<`，`<<` 表示

STDOUT：描述符为 1，用 `>`，`>>` 表示

STDERR：描述符为 2，用 `2>`，`2>>` 表示

* 重定向输出

`>`	即 `1>`，把 STDOUT 重定向，覆盖

`>>`	即 `1>>`，把 STDOUT 重定向，追加

`2>`  把 STDERR 覆盖到文件或设备

`2>>` 把 STDERR 追加到文件或设备

`&>`，`&>>`	将 STDOUT 和 STDERR 重定向到同一位置

`command >output.txt 2>&1`	将 STDOUT 和 STDERR 重定向到同一位置

`command >stdout.txt 2>stderr.txt`	把 STDOUT,STDERR 分别重定向，覆盖

`command >>stdout.txt 2>>stderr.txt`	把 STDOUT,STDERR 分别重定向，追加

`command 2>&1 >output.txt`	STDERR 重定向到当前 STDOUT，而 STDOUT 重定向到文件

`ll aaa sss 2>/dev/null`	重定向 STDOUT，丢弃 STDERR

* 重定向输入

`tr ' ' '\t'<text1`	输入重定向，把文件中的空格替换为 tab

`sort -k2 <<END`	使用 here-document 的输入重定向

* 混合使用

`cat > catfile`	使用交互式环境新建文件

`cat > catfile < ~/.bashrc`	复制指定文件内容到新文件

`cat > catfile <<"eof"`	使用 here-document 方式新建文件

`cat<<END>ex-here.sh`	 使用 here-document 的输入重定向来新建文件

`cat <<-EOF`	会删除前导制表符









####  文本操作


##### CUT

* 截取指定字段

`echo ${PATH} | cut -d ':' -f 5`	 取第 5 个值

`echo ${PATH} | cut -d ':' -f 3,5` 	取第 3、第 5个值

`echo ${PATH} | cut -d ':' -f 3-5` 	取第 3 ~ 5 个值

* 截取指定列

`export | cut -c 12-`	截取第 12 列之后的字符

`export | cut -c 12-20`	截取第 12-20 列的字符

`export | cut -c -20 | head -n 6`	截取第 20 列之前的字符

`export | cut -c 1-5,20,30-35 | head -n 6`	截取指定列的字符



##### SORT

排序的字符与 **语系** 的编码有关，因此，排序时建议使用 **LANG=C** 来统一语系。

sort 默认按每行第一个字符，按字母顺序排序。

`-f`  忽略大小写

`-b`  忽略前置空白字符

`-M`  根据月份英文名字排序

`-n`  用纯数字排序

`-r`  反向排序

`-u`  相同的数据仅保留一行

`-t`  分隔符，默认为 tab

`-k`  切割之后，依据第几段排序

`cat /etc/passwd | sort`   按第一段排序

`cat /etc/passwd | sort -t ':' -k 3 -n`   按第三段排序

`last | cut -d ' ' -f 1 | sort -u`    去掉重复项



##### UNIQ

重复的行只显示一次

`last | cut -d ' ' -f 1 | sort | uniq -c`    计算每用户登陆总次数

`-i`  忽略大小写


##### WC

统计行数、单词数、字符数

`-l`  行数

`-w`  单词数

`-m`  字符数

`cat /etc/man_db.conf | wc`	统计行数、单词数、字符数

`last | grep [a-zA-Z] | grep -v 'wtmp' | grep -v 'reboot' | grep -v 'unknown' |wc -l`	取出非空行，去除关键字那三行，计算行数


##### TEE

STDOUT 的同时 **另存** 一份

`last | tee last.list | cut -d " " -f 1`	另存一份

`ls -l /home | tee -a ~/homefile | less`  追加到文件


#### TR

针对 STDIN 中的关键字，进行 **删除、替换、压缩**。将一组字符变成另一组字符，经常用来编写优美的单行命令。

`-d`  删除关键字

`-s`  把连续重复的字符以单独一个字符表示

`last | tr '[a-z]' '[A-Z]'`    小写字母替换成大写字母

`cat ~/passwd | tr -d '\r' > ~/passwd.linux`    删除 ^M



##### COL

文本过滤器，过滤来自 STDIN 或文件的文本。它会尝试删除文本中的反向换行符（reverse line feed），并把空格换成 tab 。

`cat /etc/man_db.conf | col -x | cat -A | more`	显示所有特殊字符，把 tab 换成空格



##### EXPAND

用多个空格替换 tab

`expand [-t] file`

`-t`  替换空格的个数

`grep '^MANPATH' /etc/man_db.conf | head -n 3 | expand -t 6 - | cat -A`



##### UNEXPAND

把空格转换成 tab

用法同 EXPAND。


##### JOIN

把两个文件的内容，相关连的行连接在同一行里，输出 STDOUT。

使用 join 之前，应该先把文件内容排序。

`join [-ti12] file1 file2`

`-t`  分隔符

`-i`  忽略大小写

`-1`  第一个文件的关键字段

`-2`  第二个文件的关键字段

默认分隔符为 **空格**，比较 **第一个字段**，如果相同，就把两个文件的这两行数据连接在一起。

* 把 `/etc/passwd` 与 `/etc/shadow` 同一用户的数据整合至一行

`join -t ':' /etc/passwd /etc/shadow | head -n 3`

因为两文件关键字段均为第一段，故省略不写 -1,-2。

连接时，第二个文件的第一字段被删除，避免重复。

* 整合 `/etc/passwd` 和 `/etc/group`，关键字为 GID

GID 为 `/etc/passwd` 的第 4 段，`/etc/group` 的第 3 段

`join -t ':' -1 4 /etc/passwd -2 3 /etc/group | head -n 3`

连接时，GID 被提到行首，并删除原始位置上的 GID。



##### PASTE

不做比较，直接逐行把多个文件的内容连在一起，中间用 tab 隔开，输出 STDOUT。

`paste [-d] file1 file2 ...`

`-d`  分隔符，默认为 tab

* 拼合 `/etc/passwd` 和 `/etc/shadow`

`paste /etc/passwd /etc/shadow`

* 用 `-`  代表 STDIN

`cat /etc/group | paste /etc/passwd /etc/shadow - | head -n 3`



##### XARGS

参数转换。

xargs 可以给不支持管道的命令提供参数，参数来自其读取的 STDIN，一般以空格或换行符为分隔符。

把 STDIN 转换为参数，放到 command 后面。


{% include figure image_path="/assets/images/10.6.6.xargs.png" alt="" %}

`-0`  还原特殊字符

`-e`  EOF

`-p`  每条命令都请示用户

`-n`  一次用几个参数

如果 xargs 后面没有任何命令，默认用 echo 来输出。

* 提取 `/etc/passwd` 的用户名，取三行，用 id 命令查看每个帐号信息

`cut -d ':' -f 1 /etc/passwd | head -n 3 | xargs -n 1 id`

* 每次执行 id 时，都请用户确认

`cut -d ':' -f 1 /etc/passwd | head -n 3 | xargs -p -n 1 id`

* 所有的 `/etc/passwd` 内的帐号都用 id 查看，查到 "sync" 结束

`cut -d ':' -f 1 /etc/passwd | xargs -e'sync' -n 1 id`

🚩 -e'sync' 中间不能有空格。

* 找出 `/usr/sbin` 下面具有特殊权限的文件名

`find /usr/sbin -perm /7000 | xargs ls -l`

`ls -l $(find /usr/sbin -perm /7000)` 等效



##### GREP

* 语法

`grep [-A] [-B] [--color=auto] '关键字' filename`

`-A`  列出该行及其后 n 行

`-B`  列出该行及其前 n 行

`--color=auto`  标记颜色

`-n`  显示行号

列出关键字所在的行

* 范例

`last | grep 'root'`	含 root 的行

`last | grep -v 'root'`	不含 root 的行

`last | grep 'root' | cut -d ' ' -f 1`	混合使用

`grep --color=auto 'MANPATH' /etc/man_db.conf`

`grep -c shit file`  文件中有几处 shit

`grep -i shit file`  忽略大小写

`grep -n shit file`  结果中显示行号

`grep -a shit bin`  以文本方式对待二进制文件

`dmesg | grep -n -A3 -B2 --color=auto 'qxl'`	查看关键字所在行，及后 3 行、前 2 行






##### SED

sed 是一种流编辑器，它是文本处理中非常强大的工具，能够完美的配合正则表达式使用，功能不同凡响。

处理时，把当前处理的行存储在临时缓冲区中，称为“模式空间”（pattern space），接着用 sed 命令处理缓冲区中的内容，处理完成后，把缓冲区的内容送往屏幕。接着处理下一行，这样不断重复，直到文件末尾。文件内容并没有改变，除非你使用重定向存储输出。

Sed 主要用来自动编辑一个或多个文件；简化对文件的反复操作；编写转换程序等。

* 语法

sed [options] 'command' file(s)
sed [options] -f scriptfile file(s)

[ options ]

`-e script`	在命令行用指定的参数来处理，常用于同时进行多个操作

`-f script`	用指定的脚本文件来处理

`-n`	仅显示由脚本处理过的内容

>默认把未经 sed 处理的行也列出来，加 -n 后 **只列出经过 sed 处理的行**

`-r`  sed 的动作支持的是扩展型正则表达式

`-i`  直接修改文件内容，而不是由屏幕输出。可用于 **批量修改文件内容**

`sed 's/关键字/替换/g'`	用 SED 进行查找替换

[ command ]

`[n1[,n2]]function`

n1, n2：可选，表示选择范围的起止行数

function：

`a`  在当前行下面增加

`c`  修改指定行的内容

`d`  删除指定行

`i`  在当前行上面增加

`p`  输出

`s`  替换，可以直接进行替换，可搭配正则表达式

📕 sed 后面如果要接超过两个以上的动作时，每个动作前面得加 `-e` 。



* 删除

`cat /etc/passwd | sed '4d'`

删除第 4 行

`nl /etc/passwd | sed '2,5d'`

删除第 2~5 行

`nl /etc/passwd | sed '3,$d'`

删除第 3 行到最后一行


* 整行替换

`nl /etc/passwd | sed '2,5c No 2-5 number'`

替换第 2-5 行


* 部分替换

`cat /etc/man_db.conf | grep 'MAN' | sed 's/#.*$//g'`

删除文件中的注释行，即替换为空

`ifconfig eth0 | grep 'inet ' | sed 's/^.*inet //g' | sed 's/ netmask.*$//g'`

>ipconfig 原始信息 | 取出 IP 地址所在行 | 删除 IP 地址前面字符 | 删除后面字符

从 ifconfig 文件中查看 IP 地址


* 新增

`nl /etc/passwd | sed '2a drink tea'`

在第 2 行后面加入一行

`nl /etc/passwd | sed '2i drink tea'`

在第 2 行前面插入一行

```
nl /etc/passwd | sed '2a Drink tea or ......\
> drink beer ?\
> holly shit'
```

在第 2 行后面加入两行

📕 不同的行需用 “转义符+回车” 分隔，最后一行的行尾才加单引号来结束。


* 查看

`nl /etc/passwd | sed -n '5,7p'`

查看第 5-7 行



* 混合

`cat /etc/passwd | sed -e '4d' -e '6c no six line'`

删除第 4 行，替换第 6 行

`cat /etc/passwd | sed -e '4d' -e '6,10c holly shit'`

删除第 4 行，替换第 6~10 行


* 直接修改原文件

`sed -i 's/.$/!/g' test.txt`

替换：把行尾的 `.` 换成 `!`

`sed -i '$a This is a test' test.txt`

新增：在最后一行后面加入一行，`$` 表示最后一行





##### AWK

`awk '条件1{动作1} 条件2{动作2} ...' filename`









##### PRINTF

* 格式替代符

`%s` 字符串

`%d`, `%i` 十进制整数

`%b` 相对应的参数被视为含有要被处理的转义序列字符串

`%c` ASCII字符。显示相对应参数的第一个字符

`%e`, `%E`, `%f` 浮点格式

`%g` %e 或 %f 转换，看哪一个较短，则删除结尾的零

`%G` %E 或 %f 转换，看哪一个较短，则删除结尾的零

`%o` 不带正负号的八进制值

`%u` 不带正负号的十进制值

`%x` 不带正负号的十六进制值，使用 a~f 表示 10~15

`%X` 不带正负号的十六进制值，使用 A~F 表示 10~15

`%%` 字面意义的 %

`%8s`  总长 8 位，字符串

`%8i`  总长 8 位，整数

`%8.2f`  整数 8 位，小数点后2位

* 转义序列

`\a`  警告声

`\b`  回退键

`\f`  换页

`\n`  换行

`\r`  回车

`\t`  水平制表符

`\v`  垂直制表符

`\xNN`  两位数字，查询 ASCII

* 范例

`printf '%s\t %s\t %s\t %s\t %s\t \n' $(cat printf.txt)`

`printf '%10s %5i %5i %5i %8.2f \n' $(cat printf.txt | grep -v Name)`

`printf '\x45\n'`	查询 16 进制的 45 对应的字符（E）










####  正则表达式

以行为单位处理字符串。


##### 特殊符号

`[:alpha:]`  大小写字母

`[:digit:]`  数字

`[:upper:]`  大写字母

`[:lower:]`  小写字母

`[:alnum:]`  大小写字母及数字

`[:blank:]`  空格或 [Tab]

`[:cntrl:]`  控制按键，即 CR, LF, Tab, Del… 等

`[:graph:]`  除空格与 [Tab] 外的其他所有按键

`[:print:]`  任何可被打印出来的字符

`[:punct:]`  标点符号

`[:space:]`  任何会产生空白的字符，包括空格， [Tab], CR 等等

`[:xdigit:]`  16 进制的数字

使用这些特殊符号，可以避免编码非连续带来的麻烦。

##### 操作符

`.`  一个任意字符

`*`  前面字符重复 0 到无穷次

`^`	行首

`$`	行尾

`[]`	单选字符集

`[^]`	反向单选字符集

`{}` 限定字符重复次数



##### 范例

* 查找特定字符串

`grep -n 'the' test`   含 the

`grep -vn 'the' test`   不含 the

`grep -in 'the' test`   忽略大小写


* 查找字符集

`grep -n 't[ae]st' test`	test 或 tast

`grep -n 'oo' test`	含 oo

`grep -n '[^[:lower:]]oo' test`	oo 前面是小写字母

`grep -n '[^g]oo' test`	oo 前面不能有 g

`grep -n '[^a-z]oo' test` oo 前面不能有小写字符

`grep -n '[0-9]' test`	数字

`grep -n '[[:digit:]]' test`	数字

`grep -n '^the' test`	行首为 the

`grep -n '^[a-z]' test`	开头是小写字母

`grep -n '^[[:lower:]]' test`	开头是小写字母

`grep -n '^[^a-zA-Z]' test`	开头非英文字母

`grep -n '^[^[:alpha:]]' test`	开头非英文字母

`grep -n '\.$' test` 行尾为小数点

`grep -n '^$' test`	空行

`grep -v '^$' test | grep -v '^#'`	排除空行以及 # 开头的行

`grep -n 'g..d' test`	两个任意字符

`grep -n 'ooo*' test`	两个或两个以上连续 o

`grep -n 'g.*g' test`	g 中间一个或以上字符

`grep -n '[0-9][0-9]*' test`	任意位数字

`grep -n 'o\{2\}' tes.txt`	连续两个 o

`grep -n 'go{2,5}g' test`	2 个 或 5 个 o

`grep -n 'go{2,}g' test` 2 个以上 o
