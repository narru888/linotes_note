---
toc: true
toc_label: "Nginx 的内容缓存"
toc_icon: "copy"
title: "Nginx 的内容缓存"
tags: nginx 缓存
categories: "server"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/nginx.jpeg
  overlay_filter: rgba(0, 0, 0, 0.8)
---


本节内容：如何启用并配置缓存，用于缓存从代理服务器接收的响应。



## 启用响应缓存

若想启用缓存，需在 `http` 中使用 `proxy_cache_path` 指令。其第一个强制参数为用于缓存内容的本地文件系统路径，第二个强制参数为 `keys_zone`，定义 **共享内存区**（shared memory zone）的名称和大小，该共享内存用于保存缓存项目的元数据：

```conf
http {
    ...
    proxy_cache_path /data/nginx/cache keys_zone=one:10m;
}
```

然后，想为哪些 context 来缓存服务器的响应，就在其中使用 `proxy_cache` 指令，用来指定内存区的名称，即 `proxy_cache_path` 指令中的 `keys_zone` 参数中的名称，此处为 `one`：

```conf
http {
    ...
    proxy_cache_path /data/nginx/cache keys_zone=one:10m;
    server {
        proxy_cache one;
        location / {
            proxy_pass http://localhost:8000;
        }
    }
}
```

注意，由 `keys_zone` 参数指定的大小，不会限制被缓存下来的响应数据的总量。被缓存的响应和其元数据的副本一同保存在文件系统中特定的文件中，若想限制被缓存的响应数据的总量，可以在 `proxy_cache_path` 指令中使用 `max_size` 参数。










## nginx 缓存所涉及的进程

有两种特殊的 nginx 进程与缓存相关：


#### 缓存管理器

cache manager，缓存管理器会阶段性地激活，来检查缓存的状态。如果缓存大小超过了 `max_size` 参数的限制，缓存管理器会清除最早的数据。在两次缓存管理器激活期间，缓存的数据可以临时超过限制。


#### 缓存加载器

cache loader，缓存加载器只在 nginx 启动之后运行一次。它会把之前缓存数据的元信息加载到共享内存区。nginx 启动之后，如果一次性加载全部缓存，会消耗有效的资源，降低 nginx 的性能。为了避免这种情况，可以在 `proxy_cache_path` 指令中使用以下指令，来迭代加载缓存：

* `loader_threshold` ： 迭代的时长，以毫秒计，默认为 200 ms。
* `loader_files` ：每次迭代期间可加载的最大文件数，默认为 100 个。
* `loader_sleeps`  ：迭代之间的延迟，以毫秒计，默认为 50 ms。

```conf
proxy_cache_path /data/nginx/cache keys_zone=one:10m loader_threshold=300 loader_files=200;
```

上例中，每次迭代持续 300 毫秒，或直到加载满 200 个项目为止。





























## 从缓存中清除内容

nginx 可以从缓存中清除过期的缓存文件，这对于防止同时提供网页内容的新版和旧版非常有必要。nginx 在收到一个特殊的 “清除” 请求时，会进行缓存的清理，该请求可能包含一个自定义的 HTTP 标头，也可能是 HTTP `PURGE` 方法。






#### 如何配置以清除缓存

现在，设定一个配置，把使用 HTTP `PURGE` 方法的请求标识出来，并删除匹配的网址。

1\. 在 `http {}` 中，创建一个新变量，如 `$purge_method` ，该变量依赖于 `$request_method` 变量：

```conf
http {
    ...
    map $request_method $purge_method {
        PURGE 1;
        default 0;
    }
}
```

2\. 在配置了缓存的 `location {}` 块中，使用 `proxy_cache_purge` 指令来指定一个清除缓存请求的条件。本例中是上一步中配置的 `$purge_method`。

```conf
server {
    listen      80;
    server_name www.example.com;

    location / {
        proxy_pass  https://localhost:8002;
        proxy_cache mycache;

        proxy_cache_purge $purge_method;
    }
}
```





#### 发送清除命令

配置了 `proxy_cache_purge` 以后，需要发送一个特殊的请求来清除缓存。可以使用多个工具，包括 `curl` 命令：

```bash
$ curl -X PURGE -D – "https://www.example.com/*"
HTTP/1.1 204 No Content
Server: nginx/1.15.0
Date: Sat, 19 May 2018 16:33:04 GMT
Connection: keep-alive
```

本例中，那些匹配该网址的资源会被清除，然而，这些缓存条目没有被完全清除：它们仍会呆在磁盘中，直到它们被删除。删除的原因可能是长时间不活跃（由 `proxy_cache_path` 指令中的 `inactive` 参数决定），可能是被缓存清理器清理掉了（由 `proxy_cache_path` 中的 `purger` 参数决定），也有可能是因为客户端尝试访问它们。





#### 限制对清除命令的访问

强烈建议要限制 “那些有权发送清除缓存请求的 IP 地址” 的数量：

```conf
geo $purge_allowed {
   default         0;  # 拒绝其它主机
   10.0.0.1        1;  # 允许从 localhost 发送
   192.168.0.0/24  1;  # 允许从 10.0.0.0/24 发送
}

map $request_method $purge_method {
   PURGE   $purge_allowed;
   default 0;
}
```

本例中，nginx 会检查请求中是否含有 `PURGE` 方法，如果有，则分析客户端 IP  地址。如果地址在白名单里，则把 `$purge_method` 设置为 `$purge_allowed`，如果是 1 则允许清除缓存，如果是 0 则拒绝。




#### 从缓存中彻底清除文件

若想移除匹配的缓存文件，需要要激活一个特殊的 `cache purger` 进程，该进程会在所有缓存条目中迭代，然后把匹配的条目永久删除。

需要在 `http {}` 中，给 `proxy_cache_path` 指令一个 `purger` 参数：

```conf
proxy_cache_path /data/nginx/cache levels=1:2 keys_zone=mycache:10m purger=on;
```




#### 清除缓存配置范例

```conf
http {
    ...
    proxy_cache_path /data/nginx/cache levels=1:2 keys_zone=mycache:10m purger=on;

    map $request_method $purge_method {
        PURGE 1;
        default 0;
    }

    server {
        listen      80;
        server_name www.example.com;

        location / {
            proxy_pass        https://localhost:8002;
            proxy_cache       mycache;
            proxy_cache_purge $purge_method;
        }
    }

    geo $purge_allowed {
       default         0;
       10.0.0.1        1;
       192.168.0.0/24  1;
    }

    map $request_method $purge_method {
       PURGE   $purge_allowed;
       default 0;
    }
}
```















## 局部缓存

Byte-Range Caching，有人翻译为字节范围缓存，个人觉得不准确，局部缓存更贴切一些。

初始填充缓存的操作有时候会花费很长时间，尤其对于大文件来说。比如，要想完成一个视频文件初始化某一部分的请求，开始下载该文件时，随后的请求都要等待整个文件下载完成，再放进缓存。

nginx 使得 **缓存局部请求** 成为可能，它的缓存切片模块可以把文件分割成切片，然后用切片逐渐地填充进缓存。每个局部请求都会选择特定的切片，如果请求的这部分还没有被缓存，就马上放进去。所有其他对该部分的请求都从缓存读取数据。




#### 如何启用局部缓存

1\. 确保 nginx 编译时包含了缓存切片模块 Cache Slice。

2\. 用 `slice` 指令来指定切片大小。

```conf
location / {
    slice  1m;
}
```

选择的大小要能使切片可以快速地下载。如果过小，会过多地使用内存，处理请求时会有大量的文件描述符被打开；如果过大，会造成延迟。

3\. 把 `$slice_range` 变量添加到 `proxy_cache_key` 指令中。

```conf
proxy_cache_key $uri$is_args$args$slice_range;
```

4\. 为缓存代码 206 设定缓存时间。

```conf
proxy_cache_valid 200 206 1h;
```

5\. 在 `Ranger` 标头字段中指定 `$slice_range` 变量，以允许向代理服务器传递局部请求。

```conf
proxy_set_header  Range $slice_range;
```

##### 完整配置：

```conf
location / {
    slice             1m;
    proxy_cache       cache;
    proxy_cache_key   $uri$is_args$args$slice_range;
    proxy_set_header  Range $slice_range;
    proxy_cache_valid 200 206 1h;
    proxy_pass        http://localhost:8000;
}
```

注意，如果启用了缓存切片，初始化的文件就不允许修改。
















## 合并的配置文件范例

```conf
http {
    ...
    proxy_cache_path /data/nginx/cache keys_zone=one:10m loader_threshold=300
                     loader_files=200 max_size=200m;

    server {
        listen 8080;
        proxy_cache mycache;

        location / {
            proxy_pass http://backend1;
        }

        location /some/path {
            proxy_pass http://backend2;
            proxy_cache_valid any 1m;
            proxy_cache_min_uses 3;
            proxy_cache_bypass $cookie_nocache $arg_nocache$arg_comment;
        }
    }
}
```

本例中，两个 location 使用了相同的缓存，却是以不同的方式。

因为来自 backend1 的响应很少会变化，所以没有使用缓存控制的指令。第一个请求产生后，响应就被缓存，无限期保持有效。

对比之下，那些针对 backend2 请求的响应会频繁地变化，因此，它们的有效期只持续 1 分钟，同样的请求必须超过 3 次，才会被缓存。
