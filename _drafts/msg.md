---
toc: true
toc_label: "17. 消息传递"
toc_icon: "code-branch"
title: "Linux 消息传递"
tag: [mail, write, wall]
tags: linux
categories: "linux"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/linux.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---







## 17.1 WRITE

给 **特定在线用户** 发送实时消息，如果用户不在线则无法发送。

`write 用户 [终端接口]`

发送前可以用 `w` 先查看用户的终端接口号。

```bash
~]# write user1 pts/2
Hello, there:
Please don't do anything wrong...  
# [crtl]-d

Message from root@study.centos.user on tty4 at 01:57 ...
Hello, there:
Please don't do anything wrong...
EOF
```



### MESG 开关

如果不想接受来自普通用户的消息，可用 `mesg` 设置：

```bash
~]$ mesg n
~]$ mesg
is n
```

`mesg n` 对 root 发送的消息无效。

恢复接收消息用 `mesg y`

















## 17.2 WALL

给 **所有在线用户** 发送实时信息。

```
~]# wall "I will shutdown my linux server..."
```

只有在线的用户才能收到。

















## 17.3 MAIL

每个用户的邮件保存在 `/var/spool/mail/username` 文件中。

### 发送邮件

`mail -s "TITLE" username@localhost`

发送给本机上的用户时，`@localhost` 可省略，只用用户名。




### 其他方式发送

即利用重定向或管道：

* 输入重定向：`mail -s "title" user1 < filename`

* 用管道命令：`ls -al ~ | mail -s "myfile" root`

刚刚上面提到的是关于“寄信”的问题，那么如果是要收信呢？呵呵！同样的使用mail 啊！假设我以user1 的身份登陆主机，然后输入mail 后，会得到什么？



### 查看邮件


`mail` 命令之后输入问号 ? 可以查看帮助。


几个比较常见的命令：

| 指令 | 意义 | 示例 |
| :--- | :--- | :--- |
| h | 查看信件标题 | h 40 |
| d | 删除邮件 | d10，d20-40，须配合 q |
| s | 邮件导出为文件 | s 5 ~/mail.file |
| x | 不作任何动作退出邮箱 | 也可用 exit |
| q | 执行之前的动作 | 尤其是删除 |
