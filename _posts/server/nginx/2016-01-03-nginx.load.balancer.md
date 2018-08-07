---
toc: true
toc_label: "Nginx 的负载均衡"
toc_icon: "copy"
title: "Nginx 的负载均衡"
tags: nginx 负载均衡
categories: "server"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/nginx.jpeg
  overlay_filter: rgba(0, 0, 0, 0.8)
---




负载均衡是指在多个后端服务器中有效地分配网络流量。

## HTTP 负载均衡器

跨多个应用程序实例的负载平衡是一种常用的技术，用于优化资源利用率、最大化吞吐量、减少迟延以及确保容错配置。







### 把 HTTP 流量代理给一组服务器

要想把 HTTP 流量负载平衡给一组服务器的话，首先需要用 `upstream` 指令来定义一个组，置于 `http` 内。该组中的服务器用 `server` 指令来配置。即嵌套关系为 `http { upstream { server }}`

```conf
http {
    upstream backend {
        server backend1.example.com;
        server backend2.example.com;
        server 192.0.0.1 backup;
		# 这三个是服务器组的成员，而非虚拟服务器
    }


    server {
	# 这是虚拟服务器
        location / {
            proxy_pass http://backend;
        }
    }
}
```

`upstream` 定义一组服务器，命名为 backend。由三个服务器配置组成。

要想把请求传递给服务器组，必须用 `proxy_pass` 指令来指定组名。如果是其它协议，可以用 `fastcgi_pass`，`memcached_pass`，`scgi_pass`，`uwsgi_pass` 等指令。

这个虚拟服务器把所有请求都交给 backend 这个后端的服务器组。

因为没有显式指定负载均衡的办法，nginx 使用默认值，Round Robin。








### 选择一种负载平衡方法

开源的 nginx 支持四种负载均衡的方法，nginx plus 还支持另外一种。




#### 循环

Round Robin

所有的请求由组中的成员服务器轮流处理，同时还可以考虑各服务器的权重。这种方法是默认使用的方法，无需显式指定。




#### 最小连接数

请求会发送给活动连接数最少的服务器，可以考虑服务器的权重。

```conf
upstream backend {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
}
```




#### IP 哈希

由客户端 IP 地址来决定用哪个服务器来处理请求。此时，会使用 IPv4 的头三个八位字节，或 IPv6 的全部地址来计算哈希值。该方法可以保证，来自相同地址的请求会使用同一个服务器来处理。

```conf
upstream backend {
    ip_hash;
    server backend1.example.com;
    server backend2.example.com;
}
```

如果要从轮询中临时移除其中的一个服务器，可以在其后面标记 `down` 参数，以保留保留当前客户端 IP 地址的哈希值。本来该这个服务器处理的请求会自动发给下一个。




#### 一般哈希

用哪个服务器来处理请求，是由用户定义的密钥决定的，可以是一个字符串、变量或其组合。例如，密钥可以是一对源 IP 地址与端口的组合，或如下例子中的请求的网址：

```conf
upstream backend {
    hash $request_uri consistent;
    server backend1.example.com;
    server backend2.example.com;
}
```

其中 `consistent` 参数会启用 ketama consistent-hash 负载均衡。所有请求被平均地分配给所有后端服务器，基于这个用户定义的哈希密钥。如果后端服务器增加或减少了一个，只需要重新映射几个密钥即可。如果负载均衡的是缓存服务器，这可以最小化缓存的丢失。










### 服务器权重

nginx 为组中的服务器分配请求时，默认是以其权重为基准的。`server` 指令中的 `weight` 参数就用于设置服务器的权重，默认值为 1。

```conf
upstream backend {
    server backend1.example.com weight=5;
    server backend2.example.com;
    server 192.0.0.1 backup;
}
```











### 被动健康检查

当 nginx 认为某个服务器不再可用时，它会临时停止向其发送请求，直到觉得它已再次激活。以下这两个参数使用在 `server` 指令中，用来配置认定服务器不可用的条件：

>如果某个请求没能成功地传递给某个服务器，nginx 认定这是一次失败的尝试。

`max_fails` ：设定连续失败的次数，超过这个次数就认定服务器不可用

`fail_timeout` ：在设定的时间内，必须发生 `max_fails` 所设定的数量的连续失败，才认为服务器不可用。而且，nginx 会认为该服务器在接下来的同样时长的时间里不可用。

默认值为 1 次、10 秒钟。即，如果某个服务器对某个请求既不接受，也没有响应，nginx 会立即为该服务器在接下来的 10 秒钟内不可用。

```conf
upstream backend {
    server backend1.example.com;
    server backend2.example.com max_fails=3 fail_timeout=30s;
    server backend3.example.com max_fails=2;
}
```

backend2 服务器如果在 30 秒内有连续三次通讯失败，则在接下来的 30 秒内认为该服务器不可用。















### 与多个工人进程共享数据

如果 `upstream` 块中不包含 `zone` 指令，每个工人进程会保留服务器组配置的一个副本，维护其自己的相关计数器。计数器包括当前到组中各服务器的连接数，以及向服务器传递请求失败的次数。这种情况下，服务器组的配置不能动态配置。

如果 `upstream` 块中含有 `zone` 指令，后端服务器组的配置就会保存在内存的某处，在所有工人进程之间共享。这种情况下可以进行动态配置，因为工人进程访问同一个组配置，使用相同的计数器。

`zone` 指令对于动态配置是必须的，同时，后端组的其它功能也会利益与该指令的使用。

例如，如果组的配置没有共享，每个工人进程会维护自己的计数器，来为失败的尝试计数。这种情况下，每个请求都只得到一个工人进程，如果这个进程没能把请求传递给服务器，其它的工人进程都无从知道。当某些工人进程认为某个服务器不可用时，其它的工人进程可能仍然会向它发送请求。某个服务器若想最终被认定不再可用，在 `fail_timeout` 期间失败的次数必须等于 `max_fails` 乘以工人进程的数量。另一方面，`zone` 指令保证了预期的行为。

类似的情况，如果没有 `zone` 指令，“最少连接数” 的负载均衡方法也不会正常工作，至少在负载低的情况下是这样的。该方法会把请求传递给当前连接数最少的那个服务器。如果组的配置没有共享，每个工人进程会使用其自己的连接数计数器，可能会不小心与其它工人进程同时向同一个服务器发送请求。然而，可以通过提升请求数量来避免。在高负载情况下，所有的请求是在所有工人进程之间平均分配的，“最少连接数” 的方法才会正常工作。




#### 设定 ZONE 的大小

永远无法确定什么是最佳的 memory-zone 大小，因为使用情况总是在变化。所需要的内存的数量决定于启用了哪些功能，以及后端服务器是如何识别的。

例如，在启用了 `stick_route` 会话保持方法以及一个健康检查的情况下，一个 256 KB 的区域可以容纳服务器的数量如下：

* 128 个服务器。每个都用 `IP 地址:端口号` 定义
* 88 个服务器。每个都用 `主机名:端口号` 定义，主机名只解析为单一 IP 地址
* 12 个服务器。每个都用 `主机名:端口号` 定义，主机名可解析为多个 IP 地址






































## TCP / UDP 负载均衡器

负载均衡是指在多个后端服务器中有效地分配网络流量。






### 反向代理的配置

首先需要配置反向代理，以便 nginx 可以把来自客户端的 TCP 连接或 UDP 数据包转发给后端的组或代理服务器。

1\. 创建顶层的 `stream` 块

```conf
stream {
    # ...
}
```

2\. 在 `stream` 中，为每个虚拟服务器定义一个或多个 `server` 块

3\. 在每个 `server` 中加入 `listen` 指令，来定义服务器要侦听的 IP 地址及/或端口。对于 UDP 流量，还要加入 `udp` 参数。TCP 是 `stream` 中默认的协议，无需显式指定。

```conf
stream {
    server {
        listen 12345;
        # ...
    }
    server {
        listen 53 udp;
        # ...
    }
    # ...
}
```

4\. 在每个 `server` 中加入 `proxy_pass` 指令，来定义代理服务器或组，虚拟服务器用来向其转发流量。

```conf
stream {
    server {
        listen     12345;
        #TCP traffic will be forwarded to the "stream_backend" upstream group
        proxy_pass stream_backend;
    }
    server {
        listen     12346;
        #TCP traffic will be forwarded to the specified server
        proxy_pass backend.example.com:12346;
    }
    server {
        listen     53 udp;
        #UDP traffic will be forwarded to the "dns_servers" upstream group
        proxy_pass dns_servers;
    }
    # ...
}
```


5\. 如果代理服务器有多个网络接口，连接到后端服务器时，可以考虑配置  nginx 使用特定的源 IP 地址。如果 nginx 后面的某个代理服务器，被配置为只接受来自特定 IP 网络或 IP 地址范围的连接，该方法可以配合使用。

在 `server` 中加入 `proxy_bind` 指令，用来绑定特定接口的 IP 地址：

```conf
stream {
    # ...
    server {
        listen     127.0.0.1:12345;
        proxy_pass backend.example.com:12345;
        proxy_bind 127.0.0.1:12345;
    }
}
```

6\. 另外，也可以考虑调整两个内存中缓冲区的大小，nginx 可以把来自客户端和后端连接的数据放在缓冲区中。

如果数据量比较小，可以减小缓冲区，以节省内存资源。如果数据量比较大，可以增大缓冲区，以减少对套接字读写的操作。

一旦收到某个连接上的数据，nginx 会读取并通过其它连接将其转发。

缓冲区大小是由 `proxy_buffer_size` 指令控制的。

```conf
stream {
    # ...
    server {
        listen            127.0.0.1:12345;
        proxy_pass        backend.example.com:12345;
        proxy_buffer_size 16k;
    }
}
```










### TCP / UDP 负载均衡的配置

1\. 创建一组服务器，或一个后端组，以分担总流量。在顶层 `stream {}` 中，定义一个或多个 `upstream {}` 配置块，命名后端组。如命名为 stream_backend，用于 TCP 服务器；命名为 dns_servers，用于 UDP 服务器。

```conf
stream {
    upstream stream_backend {
        # ...
    }
    upstream dns_servers {
        # ...
    }
    # ...
}
```

要确保后端组的名称会被 `proxy_pass` 指令引用。

2\. 在后端组中添加后端服务器。在 `upstream {}` 块中，为每个后端服务器添加一个 `server` 指令，在其中指定其 IP 地址或主机名及端口号。注意，不需要为每个服务器定义协议，因为需要为整个后端组来定义，用 `listen` 指令。

```conf
stream {
    upstream stream_backend {
        server backend1.example.com:12345;
        server backend2.example.com:12345;
        server backend3.example.com:12346;
        # ...
    }
    upstream dns_servers {
        server 192.168.136.130:53;
        server 192.168.136.131:53;
        # ...
    }
    # ...
}
```

3\. 配置后端组使用的负载均衡方法。可以在以下方法中选择：

* 轮流 ：nginx 默认使用轮流的机制来进行负载均衡，按后端组中的顺序，把流量轮流重定向到每个服务器。因为是默认的方法，就无需显式指定。
* 最小连接数 ：nginx 选择当前连接数最小的服务器。
* 哈希值 ：nginx 基于一个用户定义的密钥来选择服务器。

4\. 还可以为每个后端服务器单独设定各自的参数，包括连接最大数、服务器权重等：

```conf
upstream stream_backend {
    hash   $remote_addr consistent;
    server backend1.example.com:12345 weight=5;
    server backend2.example.com:12345;
    server backend3.example.com:12346 max_conns=3;
}
upstream dns_servers {
    least_conn;
    server 192.168.136.130:53;
    server 192.168.136.131:53;
    # ...
}
```

另一个办法是把流量代理到一个单独的服务器，而不是后端组。如果用主机名来标识服务器，并配置该主机名可以解析到多个 IP 地址，nginx 会把流量在所有 IP 地址间轮流负载均衡。这种情况下，必须在 `prox_pass` 指令中指定服务器的端口号，而且在 IP 地址或主机名之前不能指定协议。

```conf
stream {
    # ...
    server {
        listen     12345;
        proxy_pass backend.example.com:12345;
    }
}
```











### 被动健康检查

如果连接到某个到后端服务器的尝试超时了，或出错了错误，nginx 可以把服务器标记为不可用，并在一段时间内停止向其发送请求。

与 HTTP 负载均衡中的被动健康检查相同。












### TCP / UDP 负载均衡范例

```conf
stream {
    upstream stream_backend {
        least_conn;
        server backend1.example.com:12345 weight=5;
        server backend2.example.com:12345 max_fails=2 fail_timeout=30s;
        server backend3.example.com:12345 max_conns=3;
    }

    upstream dns_servers {
        least_conn;
        server 192.168.136.130:53;
        server 192.168.136.131:53;
        server 192.168.136.132:53;
    }

    server {
        listen        12345;
        proxy_pass    stream_backend;
        proxy_timeout 3s;
        proxy_connect_timeout 1s;
    }

    server {
        listen     53 udp;
        proxy_pass dns_servers;
    }

    server {
        listen     12346;
        proxy_pass backend4.example.com:12346;
    }
}
```

本例中，所有的 TCP 和 UDP 代理相关的功能都在 `stream` 块中配置。

共有两个命名的 `upstream` 块，每个包含三个服务器，提供相同的内容。每个服务器的 `server` 指令中，服务器名后面跟着端口号。所有连接是按照 “最小连接数” 方法来分配给各服务器的。

下面的三个 `server` 块则定义了三个虚拟服务器：

* 第一个服务器侦听端口 12345，会把所有 TCP 连接代理给后端服务器组 stream_backend。注意，`stream` 块中定义的 `proxy_pass` 不允许包含协议。

	两个可选的超时参数：`proxy_connect_timeout` 指令用于指定与服务组中的服务器建立连接所需要的时间，`proxy_timeout` 指令用于指定超时的时间，在把一个请求向组中的服务器代理之后，超过该时间就认为超时。

* 第二个服务器侦听端口 53，把所有 UDP 数据包都代理给名为 dns_servers 的后端组。如果没有指定 `udp` 参数，套接字会用来侦听 TCP 连接。
* 第三个虚拟服务器侦听端口 12346，把 TCP 连接代理给 backend4.example.com，该域名可解析为多个 IP 地址，通过它们来进行负载均衡。


































## 配置 nginx 来接受代理协议

代理协议使得 gninx 可以接收到客户端的连接信息，这些信息是经由代理服务器和负载均衡器传递过来的。

借助代理协议，nginx 可以从 HTTP, SSL, HTTP/2, SPDY, WebSocket, TCP 获得源 IP 地址。知道了客户端的源 IP 地址，有利于为网站设置特定的语言、维护 IP 地址的黑名单、日志及统计信息。

通过代理协议传递来的信息包括客户端的 IP 地址、代理服务器的 IP 地址，以及它们的端口。

nginx 有几种办法来从信息中获取源 IP 地址：

* 用 `$proxy_protocol` 和 `$proxy_protocol_addr_port` 变量来获取源 IP 地址及端口。用 `$remote_addr` 和 `$remote_port` 变量来获取负载均衡器的 IP 地址及端口。
* `Real-IP` 模块会重写 `$remote_addr` 和 `$remote_port` 变量的值，用源客户端 IP 地址和端口来替换负载均衡器的 IP 地址及端口。`$realip_remote_addr` 和 `$realip_remote_port`  变量会保存负载均衡器的 IP 地址和端口，`$proxy_protocol_addr` 及 `$proxy_protocol_port` 变量会保存源客户端的 IP 地址和端口。









### 配置 gninx 接受代理协议

若想配置 nginx 使其接受代理协议标头，需在 `http` 或 `stream` 块中添加 `server` 块，然后在 `server` 块中为 `listen` 指令添加 `proxy_protocol` 参数：

```conf
http {
    #...
    server {
        listen 80   proxy_protocol;
        listen 443  ssl proxy_protocol;
        #...
    }
}

stream {
    #...
    server {
        listen 12345 proxy_protocol;
        #...
    }
}
```

现在就可以使用 `$proxy_protocol_addr` 和 `$proxy_protocol_port` 变量来保存客户端的 IP 地址和端口了，还可以额外配置 HTTP 和 Stream 中的 Real-IP 模块，用客户端的 IP 地址和端口来替换 `$remote_addr` 和 `$remote_port` 变量所保存的负载均衡器的 IP 地址和端口。












### 把负载均衡器的 IP 地址改为客户端的 IP 地址

可以把负载均衡器或 TCP 代理的地址，换成从代理协议接收到的客户端的 IP 地址。可以用 HTTP 和 Stream 中的 Real-IP 模块来实现。有了这些模块，可以用  `$remote_addr` 和 `remote_port` 变量来保存客户端的 IP 地址及端口，而 `$realip_remote_addr` 和 `$realip_remote_port` 变量会保存负载均衡器的 IP 地址和端口。

若想把 IP 地址从负载均衡器的换成客户端的：

1. 确保已配置 nginx 接受代理协议标头。
2. 确保安装了 HTTP 和 Stream Real-IP 模块：

```bash
nginx -V 2>&1 | grep -- 'http_realip_module'
nginx -V 2>&1 | grep -- 'stream_realip_module'
```

如果没安装，可以用这些模块来重新编译 nginx。

在 `http` 或 `stream` 中，使用 `set_real_ip_from` 指令来指定 TCP 代理或负载均衡器的 IP 地址或 CIDR 地址范围：

```conf
server {
    #...
    set_real_ip_from 192.168.1.0/24;
    #...
}
```

在 `http` 块中，把负载均衡器的 IP 地址改成从代理协议标头中收到的客户端 IP 地址，把 `proxy_protocol` 参数指定给 `real_ip_header` 指令：

```conf
http {
    server {
        #...
        real_ip_header proxy_protocol;
     }
}
```










### 记录源 IP 地址

如果知道了客户端的源 IP 地址，就可以配置正确的日志了：

对于 HTTP，配置  nginx ，用 `$proxy_protocol_addr` 变量和 `proxy_set_header` 指令，把客户端 IP 地址传递给后端服务器：

```conf
http {
    proxy_set_header X-Real-IP       $proxy_protocol_addr;
    proxy_set_header X-Forwarded-For $proxy_protocol_addr;
}
```

把变量 `$proxy_protocol_addr` 添加到 `log_format` 指令中:

在 `http` 块中：

```conf
http {
   #...
   log_format combined '$proxy_protocol_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_referer" "$http_user_agent"';
}
```

在 `stream` 块中：

```conf
stream {
    #...
    log_format basic '$proxy_protocol_addr - $remote_user [$time_local] '
                     '$protocol $status $bytes_sent $bytes_received '
                     '$session_time';
}
```















### 代理协议用于后端 TCP 连接

对于一个 TCP 数据流，可以为 nginx 与后端服务器之间的连接启用代理协议。若想启用代理协议，在 `stream > server` 块中使用 `proxy_protocol` 指令：

```conf
stream {
    server {
        listen 12345;
        proxy_pass example.com:12345;
        proxy_protocol on;
    }
}
```













### 范例

```conf
http {
    log_format combined '$proxy_protocol_addr - $remote_user [$time_local] '
                        '"$request" $status $body_bytes_sent '
                        '"$http_referer" "$http_user_agent"';
    #...

    server {
        server_name localhost;

        listen 80   proxy_protocol;
        listen 443  ssl proxy_protocol;  
					# 在 443 端口接受 HTTPS 流量
					# 接受代理协议从负载均衡器传来的客户端 IP 地址

        ssl_certificate      /etc/nginx/ssl/public.example.com.pem;
        ssl_certificate_key  /etc/nginx/ssl/public.example.com.key;

        location /app/ {
            proxy_pass       http://backend1;
            proxy_set_header Host            $host;
            proxy_set_header X-Real-IP       $proxy_protocol_addr;
            proxy_set_header X-Forwarded-For $proxy_protocol_addr;
        }
    }
}

stream {
    log_format basic '$proxy_protocol_addr - $remote_user [$time_local] '
                     '$protocol $status $bytes_sent $bytes_received '
                     '$session_time';
    #...
    server {
        listen              12345 ssl proxy_protocol;
							# 在 12345 端口接受 TCP 流量
							# 接受代理协议从负载均衡器传来的客户端 IP 地址

        ssl_certificate     /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/cert.key;

        proxy_pass          backend.example.com:12345;
        proxy_protocol      on;
		# TCP 服务器会把自己的代理协议数据发送给后端的服务器
    }
}
```

该范例假设在 nginx 前面有一个负载均衡器，用于处理所有的传入 HTTPS 流量，如 Amazon ELB。nginx 在 443 端口接受 HTTPS 流量，在 12345 端口接受 TCP 流量，接受代理协议从负载均衡器传来的客户端 IP 地址。

通过使用 `ssl_certificate` 和 `ssl_certificate_key` 指令，nginx 结束 HTTPS 的流量，把加密的数据代理给后端服务器：

* 对于 HTTP：`proxy_pass http://backend1;`
* 对于 TCP：`proxy_pass backend.example.com:12345`

用 `proxy_set_header` 指令来包含客户端 IP  地址与端口。

`log_format` 指令中的 `proxy_protocol_addr` 变量也会把客户端的 IP 地址保存到日志中，无论 HTTP 还是 TCP 的流量 。
