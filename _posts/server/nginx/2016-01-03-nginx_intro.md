---
toc: true
toc_label: "Nginx 入门"
toc_icon: "copy"
title: "Nginx 入门"
tags: nginx
categories: "server"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/nginx.jpeg
  overlay_filter: rgba(0, 0, 0, 0.8)
---




nginx 有一个主进程和几个工人进程。主进程的主要目标是读取和鉴定配置，以及维护工人进程。由工人进程来处理请求。

nginx 采用基于事件的模型和依赖于操作系统的机制在工人进程之间有效地分布请求。工人进程的数量由配置文件定义，可以是固定的，也可以根据可用 CPU 核心的数量来自动调整。

nginx 及其模块的工作方式决定于配置文件。在 CentOS 7 中，该配置文件默认为 `/etc/nginx/nginx.conf`。









### 启动，停止，重载配置文件

若要启动 nginx ，可以运行可执行文件，nginx 启动后，它可以通过用 `-s` 参数调用可执行文件来控制。

`nginx -s signal`



#### 控制 nginx 的信号

* `stop` ：快速关闭
* `quit` ：优雅关闭
* `reload` ：重新加载配置文件
* `reopen` ：重新打开日志文件

如，想要停止 nginx 进程，并需等待工人进程完成各自对请求的处理：

```bash
nginx -s quit
```

执行该命令的用户应该与启动 nginx 是同一用户。

配置文件中所作的修改必须在重新加载配置文件后，或 nginx 重启之后才能生效。重新加载配置文件：

```bash
nginx -s reload
```

主进程收到重新加载配置文件的信号以后，它会先对新配置文件进行语法检查，然后再尝试应用配置。

* 如果一切顺利，主进程会开启新的工人进程，并给老的工人进程发送消息，要求它们关闭。
* 如果不顺利，主进程会将修改回滚，继续使用原配置。
* 老工人进程收到关闭的命令之后，会停止接收新的连接，并继续处理当前的请求，直到所有请求都处理完成。然后老工人进程退出。

也可以使用 `kill` 工具来协助发送信号，这种情况下会直接把信号发给指定 PID 的进程。nginx 主进程的 ID 默认被写入 `/run/nginx.pid` 文件。在获取主进程的 PID 之后就可以用 kill 向其发信号了：

```bash
ps -ax | grep nginx
  3129 ?        Ss     0:00 nginx: master process /usr/sbin/nginx

kill -s QUIT 3129
```












### 配置文件的结构

nginx 由模块组成，这些模块由配置文件中的各个指令来控制。这些指令被分成简单指令和块指令。

简单指令由名称和参数组成，用空格分隔，以分号 `;` 结尾。

块指令有相同的结构，但它是由一组由大括号包围的指令结束。块指令可以嵌套，此时它又称为 context。

>这里的这个 context 真难找到一个适合、准确的中文语汇与之对应，估且不翻译了。最接近的也许是 “段落”、“区块”，是一种容器。

配置文件中，不属于任何 context 的指令被认为是 `main`。注意，配置文件中这个 context 没有标识出来，总之就是整个配置文件最高的一层，因此所有区块之外的内容就认为是 main。注释以 `#` 开头。

```
main
├── event
├── http
│   └── server
│       └── location
│       └── location
└── mail
    └── server
```

在配置文件中大致是这样：

```conf
http {
	server {
	}
}
```









### 提供静态内容

网页服务器的重要任务之一就是提供内容文件，如图片或静态页面。

配置文件中通常会包含几个 `server` 区块，它们具有不同的侦听端口和服务端名称。当 nginx 决定用哪个 server 来处理请求时，它会把请求标头中的 URI 与 server 区块中的 location 指令进行比对。

```conf
location / {
	root /data/www;
}
```

这个 location 区块指定了 `/` 前缀，它会与请求中的 URI 进行对比。对于匹配的请求，其 URI 会被加到由 root 指令设定的路径后面，即 `/data/www/`，这就形成了被请求的文件在本地文件系统中的路径。如果同时有多个匹配的 location，nginx 会选择最长的前缀。

```conf
server {
    location / {
        root /data/www;
    }

    location /images/ {
        root /data;
    }
}
```

这是一个可以正常工作的配置，侦听于 80 端口（默认端口，配置文件中没有），可用 `http://localhost` 访问本地主机。

对于请求网址中以 `/images/` 开头的，服务端会从 `/data/images` 目录提供文件。如对 `http://localhost/images/example.png` 的请求，会得到 `/data/images/example.png` 文件。

对其它不以 `/images/` 开头的网址，服务端会从 `/data/www` 目录提供文件。如对 `http://localhost/some/example.html` 的请求，会得到 `/data/www/some/example.html` 文件。

要想应用新的配置，可以重启或给主进程发 reload 信号：

```bash
nginx -s reload
```











### 配置简单的代理服务器

nginx 最常见的用途之一是做为代理服务器。意味着服务端收到请求以后，会把它们传递给代理服务器，把从中得到的响应发给客户端。




####　范例

配置基本的代理服务器。对于图片的请求，从本地目录提供图片文件；对于所有其它请求，都发给代理服务器。每个服务器都用一个 nginx 实例来定义。

首先，在配置文件中再增加一个 server 块：

```conf
server {
    listen 8080;
    root /data/up1;

    location / {
    }
}
```

这是一个简单的服务端，侦听 8080 端口，把所有请求都指派给本地文件系统的 `/data/up1` 目录。

创建该目录后，在其中创建 `index.html` 文件。

`root` 指令是位于 server 中的，而不像前一个例子中是在 location 中。当 location 块中没有 root 指令可处理请求时，可以这样使用。
{: .notice}

把上面的配置稍加改动，成为代理服务器的配置：

```conf
server {
    location / {
        proxy_pass http://localhost:8080;
    }

	location ~ \.(gif|jpg|png)$ {
	    root /data/images;
	}
}
```

第二个 location 块用正则表达式来匹配所有以 `.gif`、`.jpg`、`.png` 结尾的网址，此处匹配的请求会映射到 `/data/images` 目录。

在 location 中如果要用正则表达式来指定，需要用 `~` 开头。

在  nginx 确定用哪一个 location 块来匹配请求时，它首先检查含有前缀的 location 指令，记住最长的前缀，然后再检查正则表达式。如果匹配了正则表达式，nginx 就选择这个 location，否则就选择之前记住的那个。







### 配置 FastCGI 代理

nginx 还可用于把请求路由给 FastCGI 服务器，该服务器所运行的程序是由多种架构构建和编程语言的，如 PHP。

这种与 FastCGI 配合工作的最基本的 nginx 配置，需使用 `fastcgi_pass` 及 `fastcgi_param` 指令。

```conf
server {
    location / {
        fastcgi_pass  localhost:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param QUERY_STRING    $query_string;
    }

    location ~ \.(gif|jpg|png)$ {
        root /data/images;
    }
}
```

FastCGI 服务端访问端口为 9000，`SCRIPT_FILENAME` 参数用于判断脚本名称，`QUERY_STRING` 参数用于传递请求的参数。
