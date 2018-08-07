---
toc: true
toc_label: "Linux 的使用 - 重定向"
toc_icon: "laptop"
title: "Linux 的使用 - 重定向"
tags: linux 重定向
categories: "tools"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/linux.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---




所谓 I/O 重定向简单来说就是一个过程，这个过程捕捉一个文件，或者命令，程序，脚本，甚至脚本中的代码块（code block）的输出，然后把捕捉到的输出，作为输入发送给另外一个文件，命令，程序，或者脚本。






## 输入、输出、流

Linux shell 是以字符序列或字符流的方式接收输入，发送输出。每个单独的字符之间是相互独立的。

无论字符流来自或去往文件、键盘、窗口、其它 I/O 设备，都可以用文件 I/O 技术来访问流。

Linux shell 使用三种标准的 I/O 流，用 **文件描述符** 表示。

### 文件描述符

File Descriptor

在 Linux 系统中，系统为每一个打开的文件指定一个文件描述符，以便系统对文件进行跟踪，文件描述符是一个数字，不同数字代表不同的含义。

默认情况下，系统占用了 3 个：

* STDIN：标准输入流，为命令提供输入，描述符为 **0**，通常指键盘的输入

* STDOUT：标准输出流，显示来自命令的输出，描述符为 **1**，通常指显示器的输出

* STDERR：标准错误流，显示来自命令的错误信息，描述符为 **2**，通常也是定向到显示器

`3-9` 是保留的标识符，可以把这些标识符指定成标准输入，输出或者错误作为临时连接。通常这样可以解决很多复杂的重定向请求。

### 自定义文件描述符

可以使用 `exec` 命令创建自定义的文件描述符。

* 为读取文件创建描述符

```bash
~]$ echo this is a test line > input.​txt
~]$ exec 3<input.​txt
~]$ cat <&3
this is a test line
```

* 为写入文件创建描述符

```bash
~]$ exec 4>output.txt
~]$ echo newline >&4
~]$ cat output.txt
newline
```




















## 重定向标准 I/O

有时需要把文件内容做为输入，或把错误信息输出到文件。



### 重定向输出

有两种重定向输出的方法：

* **`n>`** 从描述符 n 重定向到文件

必须对文件有写权限，如果文件不存在，会自动创建；如果存在，文件内容会被覆盖，没有提醒。

* **`n>>`** 从描述符 n 重定向到文件

必须对文件有写权限，如果文件不存在，会自动创建；如果存在，文件内容会被追加到末尾。

#### 简写

如果描述符 n 被省略，默认代表标准输出。

`>`	= `1>`

`>>` = `1>>`

#### 合并重定向

有时需要把标准 **输出** 和标准 **错误** 重定向到 **同一个文件** 中，常用于自动化处理，或后台工作。

* 方法 1：**`&>`** 和 **`&>>`**

这种方法直接把输出和错误同时重定向。

* 方法 2： `>output.txt 2>&1`

先指定标准输出的重定向，再把标准错误重定向到标准输出的位置。于是二者被合并到一起。

顺序很重要，假设当前标准输出的位置为显示器，则 `2>&1 >output.txt` 的结果是错误被输出到显示器，而标准输出被保存到文件。
{: .notice--danger}


#### 忽略输出

有时需要忽略标准输出或标准错误，可以将其重定向到 **`/dev/null`**。


#### 范例

* 把标准错误定向到文件

`2>`，`2>>`  

* 将标准输出和标准错误重定向到同一位置

`&>`，`&>>`

`command >output.txt 2>&1`

* 把标准输出，标准错误分别重定向

`command >stdout.txt 2>stderr.txt`

`command >>stdout.txt 2>>stderr.txt`

`command 2>&1 >output.txt`

`ll aaa sss 2>/dev/null`






### 重定向输入

用 `<` 可以把标准输入重定向到某个文件。

#### Here-Document

Here Document 是输入重定向的一种形式，`<< 关键字`，该关键字将成为本次输入的 **结束标志**。于是在这一对标志之间的文本成为本次输入的内容。

经常用在脚本中，这是在脚本中指定多行输入内容的唯一的方法。

```
#!/bin/bash
cat <<EOF>log.​txt
LOG FILE HEADER
This is a test log file
Function: System statistics
EOF
```

如果使用 `<<- 关键字`，则每一行输入 **开头的 tab 会被删掉**。


#### 范例


* 重定向输入到文件

`tr ' ' '\t'<text1`

* 使用 here-document

`sort -k2 <<END`

* 复制指定文件内容到新文件

`cat > catfile < ~/.bashrc`

* 使用交互式环境新建文件

`cat > catfile`

* 使用 here-document 方式新建文件

`cat > catfile <<"eof"`
