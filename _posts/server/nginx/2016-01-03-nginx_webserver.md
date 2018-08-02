---
toc: true
toc_label: "Nginx Web Server"
toc_icon: "copy"
title: "Nginx Web Server"
tags: nginx
categories: "server"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/nginx.jpeg
  overlay_filter: rgba(0, 0, 0, 0.8)
---


## 提供静态内容







### 根目录与索引文件





#### 根目录

使用 `root` 指令来设定根目录，web 服务会从中查找需要服务的文件。为了获取某个请求的文件路径，nginx 会把请求 URI 追加到 `root` 设定的路径后面。这个指令可以放在 `http {}`、`server {}` 或 `location {}` 中的任何层级。

```conf
server {
    root /www/data;

    location / {
    }

    location /images/ {
    }

    location ~ \.(mp3|mp4) {
        root /www/media;
    }
}
```

本例中，`root` 指令为一个虚拟服务器指定根目录，应用于所有的 location 块。

对于以 `/images/` 开头的 URI，nginx 会在文件系统的 `/www/data/images/` 目录中查找对应的文件。

而对于以 `.mp3` 或 `.mp4` 结尾的 URI 来说，nginx 会从 `/www/media/` 目录中查找。





#### 索引文件

如果请求以斜线结尾，nginx 认为请求的是一个目录，它会在该目录中查找索引文件。`index` 指令用于设定索引文件的文件名，默认值为 `index.html`。

在 `index` 指令中可以设定多个文件名，nginx 会按设定的顺序来查找：

```conf
location / {
    index index.$geo.html index.htm index.html;
}
```

此处使用的  `$geo` 变量是个自定义变量，由 `geo` 指令所设定，该变量值取决于客户端的 IP 地址。

为了返回索引文件，nginx 会检查其是否存在，然后进行内部重定向。把索引文件名追加到 URI 后面，形成新的 URI，就重定向到这个新 URI。内部的这个重定向会引发一个新的 location 的查找，有可能结果会落到另一个 location 上：

```conf
location / {
    root /data;
    index index.html index.php;
}

location ~ \.php {
    fastcgi_pass localhost:8000;
    #...
}
```

本例中，如果请求中的 URI 是 `/path/`，而且 `/data/path/index.html` 不存在，但 `/data/path/index.php` 存在，则内部重定向 `/path/index.php` 会映射给第二个 location，于是，请求就被代理了。


##### 文件不存在的处理

继续上面的范例，如果请求的 URI 为 `/images/some/path/`，nginx 会把 `/www/data/images/some/path/index.html` 交出去，如果存在的话。如果不存在，默认会返回 HTTP 404 代码，代表无法找到文件。

可以配置 nginx，让其在找不到文件的情况下，不返回 404，而是返回一个自动生成的文件列表。通过在 `autoindex` 指令中使用 `on` 参数来实现：

```conf
location /images/ {
    autoindex on;
}
```
















### 尝试多个选项

`try_files` 指令可用于检查特定的文件或目录是否存在。

该指令可以指定多个文件名，检查也是依给定的次序进行的，使用最先找到的文件来处理请求。

如果存在，nginx 会进行一个内部重定向，如果不存在，则会重定向到一个默认的文件或返回特定的状态码。



#### 重定向到默认文件

例如，若要检查匹配请求 URI 的文件是否存在，可以使用 `try_files` 指令和 `$uri` 变量：

```conf
server {
    root /www/data;

    location /images/ {
        try_files $uri /images/default.gif;
    }
}
```

文件是以 URI 的形式指定的，而 URI 由当前的 location 或虚拟服务器中的 `root` 或 `alias` 指令指定的。本例中，如果与源 URI 对应的文件不存在（`$uri` 的作用），nginx 会进行一个内部的重定向，即定向到 `try_files` 的 **最后一个参数**，因此，返回的是 `/www/data/images/default.gif`



#### 返回状态码

最后一个参数也可以是一个状态码，可以直接用等号加状态码来表示，也可以是某个 location 的名称：

```conf
location / {
    try_files $uri $uri/ $uri.html =404;
}
```

上例中，如果 `try_files` 的所有参数都无法解析为一个现存的文件或目录，则返回 404 错误。



#### 重定向到其他 location

```conf
location / {
    try_files $uri $uri/ @backend;
}

location @backend {
    proxy_pass http://backend.example.com;
}
```

上例中，如果源 URI 和在其后面追加斜线都无法解析到现有文件或目录，请求会被重定向到名为 `@backend` 的 location 中，它会把请求传递给一个代理服务器。













### 优化服务性能

无论提供什么内容，加载的速度都是关键因素。对配置文件进行一点优化会显著提升其工作效率，性能也得到提升。




#### 启用 `sendfile`

nginx 默认自己处理文件传输，发送前，它会把文件复制到缓冲区中。启用 `sendfile` 指令会停用把数据复制到缓冲区这一步，可以实现从一个文件描述符直接向另一个描述符复制数据。

另外，为了防止一个快速连接完全占据工人进程，可以使用 `sendfile_max_chunk` 指令，以限制每个 `sendfile()` 调用可以传输的数据量。

```conf
location /mp3 {
    sendfile           on;
    sendfile_max_chunk 1m;
    #... 此处限制为 1 MB
}
```




#### 启用 `tcp_nopush`

与 `sendfile on;` 一起，使用 `tcp_nopush` 指令，可以让 nginx 在 `sendfile()` 获取的数据块后面，使用同一个数据包，来发送 HTTP 响应标头。

```conf
location /mp3 {
    sendfile   on;
    tcp_nopush on;
    #...
}
```




#### 启用 `tcp_nodelay`

使用 `tcp_nodelay` 指令可以覆盖 Nagle 算法，该算法最初是为了解决在较慢的网络中的小数据包的问题。该算法会把一定数量的小数据包合并为一个大数据包，然后用 200 ms 的延迟发送该数据包。而现今，在提供大型静态文件时，可以忽略数据包的大小，立即发送数据。延迟也会影响在线的程序，如 ssh、在线游戏、在线交易等。`tcp_nodelay` 指令默认被设置为 `on`，表示禁用 Nagle 算法。

>Nagle 算法 ：用于自动连接许多的小缓冲器消息；这一过程称为 nagling，通过减少必须发送包的个数来增加网络软件系统的效率。

只为保活（keepalive）连接使用该指令：

```conf
location /mp3  {
    tcp_nodelay       on;
    keepalive_timeout 65;
    #...
}
```




#### 优化积压队列

nginx 能以多快的速度处理传入连接，这是很重要的一个因素。通常的规则是，建立好一个连接以后，会把该连接置于某个侦听套接字的侦听列队中。在普通的负载下，要么队列会比较小，要么可能根本就没有队列。但在高负载的情况下，队列会增长的特别快，会导致性能参差不齐、连接断开以及延迟增加。

要想查看当前侦听的队列，可运行以下命令：

```bash
netstat -tnlpa
```

网站在经历较大的流量时，要想获得最佳性能，往往需要提升队列中可接受的最大连接数，在操作系统中和 nginx 中都需要进行配置。


##### 修改操作系统对应参数

把内核参数 `net.core.somaxconn` 的值从默认的 128 调整到足够高的值，来应对流量井喷。

```bash
sudo sysctl -w net.core.somaxconn=4096
```

然后用文本编辑器在 `/etc/sysctl.conf` 中添加一行：

```bash
net.core.somaxconn = 4096
```


##### 修改 nginx 的配置

如果把内核参数 `somaxconn` 调整到 512 以上，需要在 `listen` 指令中修改 `backlog` 参数与其对应：

```conf
server {
    listen 80 backlog=4096;
    # ...
}
```



























## nginx 反向代理

通常使用代理在几台服务器之间分配负载，或是无缝显示来自不同网站的内容，再或是把请求通过 HTTP 以外的协议，传递给应用程序服务器。








### 把请求传递给代理服务器

在 nginx 代理一个请求时，它会把请求发送给一个专门的代理服务器，取得响应，然后将其转给客户端。可以把请求发给一个 HTTP 服务器，可以是另一个 nginx 或其他服务器；也可以用特定协议发给非 HTTP 服务器，运行的可以是 PHP 或 Python 编写的程序。支持的其他协议包括 FastCGI、uwsgi、SCGI、memcached。




####　传给 HTTP 代理服务器

要想把请求传递给 HTTP 代理服务器，需要在 `location` 中配置 `proxy_pass` 指令：

```conf
location /some/path/ {
    proxy_pass http://www.example.com/link/;
}
```

注意，此处设定的代理服务器的地址后面跟了一段 URI，即 `/link/`。像这种情况，如果在网址后面跟了一个 URI，它会用来 **替换** 掉请求中的 URI。因此，如果请求中的 URI 为 `/some/path/page.html`，它会被代理为 `http://www.example.com/link/page.html`。如果设定地址时后面没有跟 URI，或无法确定要替换哪部分 URI，则会使用完整的请求 URI。

也可以指定 IP 地址和端口：

```conf
location ~ \.php {
    proxy_pass http://127.0.0.1:8000;
}
```




#### 传给非 HTTP 代理服务器

要想把请求传给非 HTTP 代理服务器，要使用正确的 `**_pass` 指令：

`fastcgi_pass` ：把请求传给 FastCGI 服务器

`uwsgi_pass` ：把请求传给 uwsgi 服务器

`scgi_pass` ：把请求传给 SCGI 服务器

`memcached_pass` ：把请求传给 memcached 服务器

注意，在这类情况下，用来指定地址的规则不太一样。

...

`proxy_pass` 指令也可指向一组命名的服务器，此时会根据指定的方法，把请求在组中的服务器之间分配。











### 传递请求标头

nginx 默认会 **重新定义** 被代理的请求中的两个标头字段，即 `Host` 和 `Connection`，并删除空的标头字段。

`Host` 被设置为 `$proxy_host` 变量，`Connection` 被设置为 `close`。

对标头的修改要使用 `proxy_set_header` 指令来完成，该指令可以用在 `location` 或更高的层级。也可以在特定的 `server` 或 `http` 块中使用。

```conf
location /some/path/ {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_pass http://localhost:8000;
}
```

这里，`Host` 字段被设置为 `$host` 变量。

如果希望某些字段不要传递给代理服务器，可以将其赋个空值：

```conf
location /some/path/ {
    proxy_set_header Accept-Encoding "";
    proxy_pass http://localhost:8000;
}
```













### 缓冲区的配置

nginx 默认会把来自代理服务器的响应放到缓冲区。响应先是保存在内部的缓冲区中，直到响应全部接收完毕才发给客户端。缓冲区的使用有助于优化对慢客户端的性能。因为，如果把响应同步地从 nginx 发给客户端，会浪费代理服务器的时间。而使用了缓冲区以后，nginx 允许代理服务器快速地处理响应，由 nginx 来保存这个响应，客户端下载需要多长时间，它就可以保管多久。




#### 启用缓冲区

负责启用、禁用缓冲区的指令是 `proxy_buffering`，默认设置为 `on`，启用缓冲区。

`proxy_buffers` 指令可控制为一个请求所分配的缓冲区的大小和数量。代理服务器返回的响应，其第一部分被保存在一个单独的缓冲区，大小由 `proxy_buffer_size` 设定。这一部分通常包含一个相对较小的响应标头，可以做的比响应的其余部分的标头更小。

```conf
location /some/path/ {
    proxy_buffers 16 4k;
    proxy_buffer_size 2k;
    proxy_pass http://localhost:8000;
}
```

本例中，缓冲区的默认数量被提升，用于响应的第一部分的缓冲区也比默认的要小。

如果缓冲区被禁用，nginx 从代理服务器接收到的响应会同步地发送给客户端，这样的举动是那些快速的互动客户端所需要的。




#### 禁用缓冲区

要想在特定的位置禁用缓冲区，可以在对应的 `location` 中加入 `proxy_buffering off;`：

```conf
location /some/path/ {
    proxy_buffering off;
    proxy_pass http://localhost:8000;
}
```

本例中，nginx 只会使用由 `proxy_buffer_size` 配置的缓冲区来保存响应的当前部分。

...

反向代理通常用于负载均衡。















### 选择出站的 IP 地址

如果代理服务器有多个网络接口，有时需要选择一个源 IP 地址，用来连接到代理服务器或后端服务器。在代理服务器配置为只接受来自特定 IP 网络或地址范围的连接时，这一点就更加有用。

用特定网络接口的 IP  地址来配置 `proxy_bind` 指令：

```conf
location /app1/ {
    proxy_bind 127.0.0.1;
    proxy_pass http://example.com/app1/;
}

location /app2/ {
    proxy_bind 127.0.0.2;
    proxy_pass http://example.com/app2/;
}
```

IP 地址也可以用变量来表示，如 `$server_addr` 变量会把接受请求的网络接口的 IP 地址传给 nginx。































## 压缩与解压缩

对响应进行压缩通常会明显地减小要传输的数据的大小，然而，因为压缩是发生在运行时，它也会增加一些处理的开销，对性能会有影响。nginx 会在给客户端发送响应之前进行压缩，会对已经压缩的请求（有可能是代理服务器压缩的）不会二次压缩。









### 启用压缩

要想启用压缩，需要使用 `gzip` 指令，并配置 `on` 参数。

```conf
gzip on;
```



#### 对其他 MIME 类型启用压缩

nginx 默认只会压缩 MIME 类型的 text/html。要想压缩其它 MIME 类型的响应，要用 `gzip_types` 来指定：

```conf
gzip_types text/plain application/xml;
```



#### 响应的最小长度

要想设定需要压缩的响应的最小长度，使用 `gzip_min_length` 指令，其默认值为 20 字节，这里调整为 1000：

```conf
gzip_min_length 1000;
```



#### 压缩被代理的请求

nginx 默认不会压缩来自代理服务器的请求，一个请求是否来自代理服务器，是根据请求中的 `Via` 标头字段判断的。要想配置对这些请求的压缩，需要使用 `gzip_proxied` 指令。该指令有多个参数，用来指定 nginx 要为哪些类型的被代理的请求进行压缩。

例如：

```conf
gzip_proxied no-cache no-store private expired auth;
```

只有那些 **不会被缓存到代理服务器的请求**，它们得到的响应才应该被压缩。基于这个宗旨，`gzip_proxied` 指令所指定的参数会让 nginx 检查响应中的 `Cache-Control` 标头字段，如果字段的值为 `no-cache`、`no-store`、`private`，就会压缩响应。

另外，必须加上 `expired` 参数，为的是检查 `Expires` 标头字段的值。还可以加上 `auth` 参数，用于检查是否含有 `Authorization` 标头字段。被授权的响应是专门为终端用户准备的，通常不会被缓存。

与其它指令一样，用于配置压缩的这些指令同样可以用于 `http`、`server`、`location` 中。

常见的 gzip 压缩配置如下：

```conf
server {
    gzip on;
    gzip_types      text/plain application/xml;
    gzip_proxied    no-cache no-store private expired auth;
    gzip_min_length 1000;
    ...
}
```









### 启用解压缩

有些客户端不支持 `gzip` 编码的响应，而同时，人们希望保存压缩的数据，或实时把响应压缩再将其保存到缓存中。要想同时也满足不支持压缩的客户端，在发送给客户端时，nginx 可以实时解压缩。

要想启用实时解压缩，需要使用 `gunzip` 指令：

```conf
location /storage/ {
    gunzip on;
    ...
}
```

`gunzip` 指令可以与 `gzip` 在同一个 context 中使用：

```conf
server {
    gzip on;
    gzip_min_length 1000;
    gunzip on;
    ...
}
```

注意，该指令是在一个单独的模块中定义的，有可能不会默认安装。


















### 发送压缩文件

要想把压缩后的文件发给客户端，而不是发原文件，需要在适当的 context 中使用 `gzip_static` 指令，配置 `on` 参数。

```conf
location / {
    gzip_static on;
}
```

本例中，针对指向 `/path/to/file` 的请求，nginx 会尝试并发送文件  `/path/to/file.gz`，如果文件不存在，或客户端不支持 gzip，nginx 会发送未经压缩的原文件。

注意，`gzip_static` 指令不会启用实时压缩，它仅仅是使用一个事先被压缩好的文件。要想在运行时压缩内容，必须使用 `gzip` 指令。

该指令是在一个单独的模块中定义的，有可能不会默认安装。


































## 把 nginx 作为应用程序网关

nginx 是一个高性能、可扩展、安全的、可靠的 WEB 服务器和反向代理。nginx 使用所有的重要的 WEB 加速技术来管理 HTTP 连接和流量。多年来，nginx 的多种能力，如 负载均衡、SSL 代理、连接与请求策略、静态内容、内容缓存等功能，可以快速、高效地帮助用户建立可靠、快速的网站。

nginx 还可以充当安全的应用程序网关，它提供一定数量的专用内建接口，把流量从用户传递给应用程序。就这一点而言，nginx 不仅可以把 HTTP、HTTPS 的流量代理给一个启用 HTTP 的应用程序容器，它还可以与大多数流行的轻量应用程序服务器和 WEB 架构直接对话。这种对话是借助优化的应用程序实现的，即像 FastCGI、Memcached、scgi、uwsgi 这样的模块所带来的网关接口。

大多数常用的应用程序容器都嵌入了对外 HTTP 接口，并附带一些路由功能，但把 nginx 作为应用程序网关的一个重要原因，是它提供了一体化的解决方案：HTTP 连接管理，负载均衡、内容缓存、流量安全。应用程序的后端安全地呆在 nginx 的后方，以实现更好的扩展性和性能。在 nginx 后面群集应用程序实例，也很容易构建高可用的应用程序。







### 关于 uWSGI 和 Django

关于专用的接口：因为 HTTP 非常有用，它从来没有为现代、轻量的应用程序的部署优化过。近几年来，逐步形成了一些标准化的接口，用于配合各种应用程序架构和容器。其中一个接口是 Web Server Gateway Interface，WSGI，网页服务网关接口，处于 WEB 服务器和基于 Python 的应用程序之间的接口。

使用 uwsgi 协议的应用程序服务器中，最常见的是 uWSGI 应用程序服务器容器，即 WSGI 协议自己的实现品。

除此之外，uWSGI 应用程序服务器还支持 HTTP、FastCGI、SCGI，uwsgi 协议是与应用程序对话最快的，建议使用。











### 配置 nginx，与 uWSGI 和 Django 配合使用

本节示例如何配置 nginx，与 uWSGI 服务器和 Python 开发环境一起工作。

nginx 0.8.40 以后的版本原生支持：通过 uwsgi 协议，把流量从用户传递给 Python 应用程序。nginx 默认支持 uswgi。

Django 也许是最常用的 Python web 框架，此处用它做范例。

仅用于说明目的，这是用 Django 调用 uWSGI 服务器的一种方法：

```bash
# /usr/local/sbin/uwsgi \
     --chdir=/var/django/projects/myapp \
     --module=myapp.wsgi:application \
     --env DJANGO_SETTINGS_MODULE=myapp.settings \
     --master --pidfile=/usr/local/var/run/uwsgi/project-master.pid \
     --socket=127.0.0.1:29000 \
     --processes=5 \
     --uid=505 --gid=505 \
     --harakiri=20 \
     --max-requests=5000 \
     --vacuum \
     --daemonize=/usr/local/var/log/uwsgi/myapp.log
```

针对上面这些选项的使用，可以如下配置 nginx：

```conf
http {
    # ...
    upstream django {
        server 127.0.0.1:29000;
    }

    server {
        listen 80;
        server_name myapp.example.com;
        root /var/www/myapp/html;

        location / {
            index index.html;
        }

        location /static/  {
            alias /var/django/projects/myapp/static/;
        }

        location /main {
            include /etc/nginx/uwsgi_params;
            uwsgi_pass django;
            uwsgi_param Host $host;
            uwsgi_param X-Real-IP $remote_addr;
            uwsgi_param X-Forwarded-For $proxy_add_x_forwarded_for;
            uwsgi_param X-Forwarded-Proto $http_x_forwarded_proto;
        }
    }
}
```

配置中定义了一个名为 `django` 的后端，组中服务器的端口号为 29000，与 uWSGI 服务器 `socket` 参数绑定的相同。

提供静态内容是简单的工作，只需从 `/var/django/projetcts/myapp/static` 直接读取。访问应用程序服务器的流量如果是指向 `/main`的，则会被代理，从 HTTP 转换成 uwsgi 协议，流量被传递给运行于 uWSGI 应用程序服务器的 Django 程序。














### 小结

在构建、部署现代 WEB 应用程序的众多方法中，轻量级、异构的应用程序环境变得越来越流行。更加新的、标准化的应用程序接口协议，如 uwsgi 和 FastCGI 使得用户与程序之间的通信变得更快。

在应用程序容器之前使用 nginx，已经成为一种通用的做法，这样能让程序从沉重的 HTTP 流量管理中摆脱出来，更有利于保护应用程序免遭用户流量意外峰值的冲击，避免恶意行为、拒绝服务攻击等。

把真实世界、外部 HTTP 流量与真实的应用程序分开，让开发者可以把精力集中在程序的逻辑上，把 WEB 加速和一些基础的 HTTP 流量安全任务交给 nginx。
