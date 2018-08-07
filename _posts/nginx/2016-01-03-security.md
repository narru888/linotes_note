---
toc: true
toc_label: "Nginx 安全控制"
toc_icon: "copy"
title: "Nginx 安全控制"
tags: nginx 安全
categories: "server"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/nginx.jpeg
  overlay_filter: rgba(0, 0, 0, 0.8)
---


## nginx 用作 HTTPS 服务器





### 配置 HTTPS 服务器

要想配置一台 HTTPS 服务器，在 `nginx.conf` 文件中的 `server` 块中，需要添加 `listen` 指令，为其使用 `ssl` 参数，然后指定服务器证书和私钥文件的位置：

```conf
server {
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.crt;
    ssl_certificate_key www.example.com.key;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    #...
}
```

服务器的证书是一个公共的实体，它被发送给每一个连接到 nginx 服务器的客户端。

私钥是一个安全实体，应该保存在文件中，对其访问需加以限制。nginx 的主进程必须有权读取该文件。

另外，私钥也可以和证书保存在同一个文件中：

```conf
ssl_certificate     www.example.com.cert;
ssl_certificate_key www.example.com.cert;
```

这种情况下，就必须限制对该文件的访问。虽然二者在同一个文件中，但只有证书会发送给客户端。

`ssl_protocols` 和 `ssl_ciphers` 指令可用来要求客户端，在建立连接时，只能使用 SSL/TLS 的强版本及秘钥算法。

在 nginx 1.0.5 之后的版本，使用以下默认值：

```conf
ssl_protocols SSLv3 TLSv1;
ssl_ciphers HIGH:!aNULL:!MD5
```

1.1.13 和 1.0.12 之后的版本，`ssl_protocols` 的默认值更新为：

```conf
ssl_protocols SSLv3 TLSv1 TLSv1.1 TLSv1.2;
```

在旧秘钥算法的设计中有时会发现漏洞，建议在现代 nginx 配置中禁用它们。不幸的是，默认的配置不容易修改，因为要照顾到对低版本的兼容性。

注意：CBC 模式的秘钥算法在大量攻击下会比较脆弱，建议不要使用 SSLv3，除非需要对旧客户端提供支持。












### HTTPS 服务器的优化

SSL 的操作会消耗额外的 CPU 资源，最占用 CPU 的操作是 SSL 握手。有两种方式来减少每个客户端进行该操作的次数：

* 启用保活连接来发送一些请求
* 重用 SSL 会话参数，以避免并行和后续连接的 SSL 握手

会话保存在 SSL 会话缓存中，对所有工人进程共享，用 `ssl_session_cache` 指令设定。1 MB 的缓存大约包含 4000 个会话，默认的缓存超时为 5 分钟，可以用 `ssl_session_timeout` 来修改。

以下是为一个使用 10 MB 共享会话缓存的多核系统进行的优化配置：

```conf
worker_processes auto;

http {
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    server {
        listen              443 ssl;
        server_name         www.example.com;
        keepalive_timeout   70;

        ssl_certificate     www.example.com.crt;
        ssl_certificate_key www.example.com.key;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        #...
    }
}
```











### SSL 证书链

有些浏览器会对知名的证书颁发机构有抱怨，而其它的浏览器就可以正常接受。这种局面的产生是因为颁发机构颁发证书时所使用的中间证书，不是由当前可信的机构颁发的，只有某些浏览器使用了它们。这种情况下，颁发机构提供一捆链式证书，该证书应该与颁发的服务器证书合并在一起。在合并后的文件中，服务器证书应排在那捆证书前面。

```bash
$ cat www.example.com.crt bundle.crt > www.example.com.chained.crt
```

生成的合并文件应该用在 `ssl_certificate` 指令中：

```conf
server {
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.chained.crt;
    ssl_certificate_key www.example.com.key;
    ...
}
```

如果服务器证书和那捆证书合并时排序错误，nginx 会启动失败，找返回以下错误消息：

```
SSL_CTX_use_PrivateKey_file(" ... /www.example.com.key") failed
   (SSL: error:0B080074:x509 certificate routines:
    X509_check_private_key:key values mismatch)
```

之所以会提示这样的内容，是因为 nginx 启动时尝试把那捆证书做为私钥来使用了。

浏览器通常会保存中间证书，这些证书是由可信机构颁发的。因此，热衷于使用中间证书的浏览器应该已经拥有了这些中间证书，不太会抱怨哪个证书不是成捆来的。为了确保服务器会发送完整的证书链，可以使用 openssl 命令行工具：

```bash
$ openssl s_client -connect www.godaddy.com:443
...
Certificate chain
 0 s:/C=US/ST=Arizona/L=Scottsdale/1.3.6.1.4.1.311.60.2.1.3=US
     /1.3.6.1.4.1.311.60.2.1.2=AZ/O=GoDaddy.com, Inc
     /OU=MIS Department/CN=www.GoDaddy.com
     /serialNumber=0796928-7/2.5.4.15=V1.0, Clause 5.(b)
   i:/C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc.
     /OU=http://certificates.godaddy.com/repository
     /CN=Go Daddy Secure Certification Authority
     /serialNumber=07969287
 1 s:/C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc.
     /OU=http://certificates.godaddy.com/repository
     /CN=Go Daddy Secure Certification Authority
     /serialNumber=07969287
   i:/C=US/O=The Go Daddy Group, Inc.
     /OU=Go Daddy Class 2 Certification Authority
 2 s:/C=US/O=The Go Daddy Group, Inc.
     /OU=Go Daddy Class 2 Certification Authority
   i:/L=ValiCert Validation Network/O=ValiCert, Inc.
     /OU=ValiCert Class 2 Policy Validation Authority
     /CN=http://www.valicert.com//emailAddress=info@valicert.com
...
```

本例中，证书链中的 `s` 代表 subject，即证书的主体；`i` 代表 issuer，即颁发机构，它也是其下一个证书的主体。这样一层一层直到最后一层，即 2 号证书，这里可以看到其最原始的颁发机构为 `ValiCert, Inc.`，这是一个知名的机构，其证书保存在浏览器自身。

如果不是添加了整个证书链，只会显示第一层，即 0 号证书。












### HTTP/HTTPS 二合一服务器

可以通过配置一台服务器，让其同时处理 HTTP 和 HTTPS 请求，只需在同一个虚拟服务器中同时设置两个 `listen` 指令，一个使用 `ssl` 参数，另一个不使用：

```conf
server {
    listen              80;
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.crt;
    ssl_certificate_key www.example.com.key;
    #...
}
```

在 0.7.13 及以前的版本中，无法为单个侦听套接字选择启用 SSL。SSL 只能为全体服务器启用，因此无法配置一个 HTTP/HTTPS 二合一的服务器。而在 `listen` 指令中添加 `ssl` 参数解决了这个问题。










### 基于域名的 HTTPS 服务器

一个比较常见的错误是，把两个或多个 HTTPS 服务器配置为侦听同一个 IP 地址：

```conf
server {
    listen          443 ssl;
    server_name     www.example.com;
    ssl_certificate www.example.com.crt;
    #...
}

server {
    listen          443 ssl;
    server_name     www.example.org;
    ssl_certificate www.example.org.crt;
    #...
}
```

如果这样配置，浏览器会收到默认服务器的证书。本例中是 `www.example.com`，不管请求的服务器域名是什么。这是由于 SSL 协议自身行为造成的。先是要建立 SSL 连接，然后浏览器才能发送 HTTP 请求，而 nginx 不知道请求的服务器的域名，所以只能提供自己默认的服务器证书。

解决这个问题最好的办法就是为每个 HTTPS 服务器分配一个 **独立的 IP 地址**：

```conf
server {
    listen          192.168.1.1:443 ssl;
    server_name     www.example.com;
    ssl_certificate www.example.com.crt;
    #...
}

server {
    listen          192.168.1.2:443 ssl;
    server_name     www.example.org;
    ssl_certificate www.example.org.crt;
    #...
}
```




#### 一个 SSL 证书对应多个域名

虽然有一些方法可以在多个 HTTPS 服务器间共享同一个 IP 地址，但它们都有缺陷。

有一个方法是在一个证书的 `SubjectAltName` 证书字段中用使用多个域名，但该字段的长度是有限制的。

另一个方法是在证书中使用通配符，如 `*.example.org`。这种通配符证书一下子可以为所有子域名提供安全认证，但只限一级。即适用于 `www.example.org`，但不匹配 `example.org` 或 `www.sub.example.org`。

这两种方法可以合并，一个证书可以同时包含具体域名和通配符域名，如 `example.org` 与 `*.example.org`。

最好将具有多个域名及其私钥文件的证书文件放在配置文件中的 `http` 这一级，以便它们在所有服务器上继承单个内存副本：

```conf
ssl_certificate     common.crt;
ssl_certificate_key common.key;

server {
    listen          443 ssl;
    server_name     www.example.com;
    #...
}

server {
    listen          443 ssl;
    server_name     www.example.org;
    #...
}
```




#### 服务器

要在一个 IP 地址上同时运行多个 HTTPS 服务器，更普遍的解决办法是使用 TLS 服务器名称指示扩展，即 TLS Server Name Indication，SNI，它让浏览器可以在 SSL 握手期间可以传递请求的服务器域名。有了这个办法，服务器就会清楚该为这个连接使用哪个证书了。然而，SNI 只得到少数浏览器的支持，包括：

* Opera 8.0
* MSIE 7.0
* Firefox 2.0
* Safari 3.2.1
* Chrome

在 SNI 中只能传递域名，但是，如果请求中直接包含的就是 IP 地址，一些浏览器也可以传递服务器的 IP 地址。最好不要过分依赖这个。

要想在 nginx 中使用 SNI，OpenSSL 运行库必须支持，nginx 二进制文件就是用它构建的；以及 nginx 在运行时动态链接的运行库也可支持。

自从版本 0.9.8f 以来，OpenSSL 就开始支持 SNI，只要构建时的配置是 `option --enable-tlsext`。在版本 0.9.8j 以后，该选项默认是开启的。如果 nginx 构建时是支持 SNI 的，`nginx -V` 会返回以下信息：

```bash
$ nginx -V
...
TLS SNI support enabled
...
```

然而，如果启用 SNI 的 nginx 动态链接到 OpenSSL 运行库时，没有使用 SNI 的支持，nginx 会显示警示消息：

```
NGINX was built with SNI support, however, now it is linked
dynamically to an OpenSSL library which has no tlsext support,
therefore SNI is not available
```




































## 通过 HTTP 基本认证来限制访问

可以通过用户名、密码的身份验证来限制对网站全部或局部的访问。用户名和密码取自一个文件，该文件由密码文件生成工具生成并创建，如 `apache2-utils`。

HTTP 基本的身份验证也可以与其它的限制访问的方法结合在一起使用，比如通过 IP 地址或地理位置来限制访问。







### 先决条件

* nginx
* 密码文件生成工具，如 `apche2-utils`








### 创建密码文件

要创建用户名、密码，需要使用密码文件创建工具，如 `apache2-utils`。

1\. 确认已安装 `apache2-utils`

2\. 创建密码文件及第一个用户。运行 `htpasswd -c` 来创建新文件，文件路径做为第一个参数，用户名做为第二个参数：

```bash
$ sudo htpasswd -c /etc/apache2/.htpasswd user1
```

3\. 创建其它用户名、密码，再次运行时无需 `-c` 选项，因为文件已经创建了：

```bash
$ sudo htpasswd /etc/apache2/.htpasswd user2
```












### 配置  nginx 进行 HTTP 基本验证

1\. 选择一个需要保护的 location 块，在其中使用 `auth_basic` 指令为这个受密码保护的区域命名，这个命名会在提示输出用户名和密码的窗口中显示。

```conf
location /status {                                       
    auth_basic “Administrator’s Area”;
    ....
}
```

2\. 用 `auth_basic_user_file` 指令指定生成的密码文件的路径：

```conf
location /status {                                       
    auth_basic           “Administrator’s Area”;
    auth_basic_user_file /etc/apache2/.htpasswd;
}
```

...

或者，如果希望全站都用基本验证，但保留部分区域公开。此时可以在特定 location 块中为 `auth_basic` 指令指定 `off` 参数：

```conf
server {
    ...
    auth_basic           "Administrator’s Area";
    auth_basic_user_file conf/htpasswd;

    location /public/ {
        auth_basic off;
    }
}
```














### 合并基本验证与 IP 地址限制

HTTP 基本身份验证可以有效地与 IP 地址的限制组合在一起来使用，主要用于两种情景：

* 用户在通过验证的同时，其 IP 地址也必须满足要求
* 用户要么通过身份验证，要么其 IP 地址满足要求

1\. 用 `allow` 和 `deny` 指令来限定 IP 地址：

```conf
location /status {
    ...
    deny 192.168.1.2;
    allow 192.168.1.1/24;
    allow 127.0.0.1;
    deny all;
}
```

允许和拒绝的指令在应用时也是按照配置文件中定义的顺序进行的。

2\. 用 `satisfy` 指令来组合 IP 地址限制与 HTTP 身份验证。如果设定为 `all`，代表两个条件需同时满足；如果设定为 `any`，代表至少要满足一个条件：

```conf
location /status {
    ...
    satisfy all;    

    deny  192.168.1.2;
    allow 192.168.1.1/24;
    allow 127.0.0.1;
    deny  all;

    auth_basic           "Administrator’s Area";
    auth_basic_user_file conf/htpasswd;
}
```









### 范例

本例演示如何同时用两种方法保护 status 区域：

```conf
http {
    server {
        listen 192.168.1.23:8080;
        root   /usr/share/nginx/html;

        location /status {
            status;
            satisfy all;

            deny  192.168.1.2;
            allow 192.168.1.1/24;
            allow 127.0.0.1;
            deny  all;

            auth_basic           “Administrator’s area;
            auth_basic_user_file /etc/apache2/.htpasswd;
        }

        location = /status.html {
        }
    }
}
```

当用户访问 status 页面时，会弹出验证窗口：

![image-center](/assets/images/nginx_auth_required.png){: .align-center}

如果用户名和密码不匹配，会返回 401 错误，即 Authorization Required。





































## 基于子请求结果的身份验证

nginx 可以使用外部服务器或服务来验证访问网站的请求。

为了进行验证，nginx 会生成一个子请求发给外部服务器，由子请求在外部服务器上完成身份验证。如果子请求返回 `2xx` 的响应代码，表示允许访问，返回 `401` 或 `403` ，表示拒绝访问。

借助这种验证，可以实现不同的验证机制，比如多因素验证，或实施 LDAP、OAuth 验证。








### 先决条件

* nginx
* 外部身份验证服务器或服务













### 配置 nginx

1\. 确保 nginx 编译时使用了 `http_auth_request_module` 这个选项：

```bash
$ nginx -V 2>&1 | grep -- 'http_auth_request_module'
```

2\. 在需要对请求加以验证的 location 块中，使用 `auth_request` 指令，用来指定验证子请求要被转发到的内部位置：

```conf
location /private/ {
    auth_request /auth;
    #...
}
```

本例中，指向 `/private` 的每个请求，都会在内部产生一个指向内部路径 `/auth` 的子请求。

3\. 在这个内部路径的 location 块中，使用 `proxy_pass` 指令，把验证的子请求 **代理给** 验证服务器或服务：

```conf
location = /auth {
    internal;
    proxy_pass http://auth-server;
    #...
}
```

4\. 因为验证子请求会忽略请求的主体，因此有必要把 `proxy_pass_request_body` 设置为 `off`，把 `Content-Length` 标头设置为空：

```conf
location = /auth {
    internal;
    proxy_pass              http://auth-server;
    proxy_pass_request_body off;
    proxy_set_header        Content-Length "";
    #...
}
```

5\. 用 `proxy_set_header` 指令来传递源请求的完整 URI 以及参数：

```conf
location = /auth {
    internal;
    proxy_pass              http://auth-server;
    proxy_pass_request_body off;
    proxy_set_header        Content-Length "";
    proxy_set_header        X-Original-URI $request_uri;
}
```

6\. 如果需要，可以基于请求的结果为某些变量赋值，用 `auth_request_set` 指令：

```conf
location /private/ {
    auth_request        /auth;
    auth_request_set $auth_status $upstream_status;
}
```







### 范例

```conf
http {
    #...
    server {
    #...
        location /private/ {
            auth_request     /auth;
            auth_request_set $auth_status $upstream_status;
        }

        location = /auth {
            internal;
            proxy_pass              http://auth-server;
            proxy_pass_request_body off;
            proxy_set_header        Content-Length "";
            proxy_set_header        X-Original-URI $request_uri;
        }
    }
}
```































## 限制对被代理的 HTTP 资源的访问

使用 nginx 时，可以限制：

* 针对每个关键值，如 IP 地址，限制连接数
* 针对每个关键值限制请求频率
* 连接的下载速度

因为 IP 地址在 NAT 设备后面可能是共享的，所以在对 IP 地址限制之前要仔细考量一下。










### 限制连接数



#### `limit_conn_zone`

想要限制连接的数量，首先，要用 `limit_conn_zone` 指令来定义键，并设定共享内存区的参数，工人进程会用这个内存区来共享键值的计数器。第一个参数指定的是键的表达式，第二个参数是内存区，指定内存区的名称和大小。

```conf
limit_conn_zone $binary_remote_address zone=addr:10m;
```

这里，连接数的限制是基于 IP 地址的，因为把变量 `$binary_remote_address` 在这里做为键来使用。



#### `limit_conn`

然后，使用 `limit_conn` 指令来进行限制，可以在 `location`、虚拟服务器或 `http` 中使用。共享内存区的名称做为第一个参数，每一个键允许的连接数做为第二个参数。

```conf
location /download/ {
    limit_conn addr 1;
}
```

若要对特定服务器限制连接数，可以使用 `$server_name` 变量：

```conf
http {
    limit_conn_zone $server_name zone=servers:10m;

    server {
        limit_conn servers 1000;
    }
}
```












### 限制请求频率



#### `limit_req_zone`

要想限制请求的频率，需要配置键和共享内存区以保存计数器，通过 `limit_req_zone` 指令来设定：

```conf
limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;
```

设定键的方式与 `limit_conn_zone` 中一样，`rate` 参数的单位为 r/s，即每秒请求数，或 r/m，每分钟请求数。



#### `limit_req`

定义好共享内存区以后，在虚拟服务器或 location 块中使用 `limit_req` 指令：

```conf
location /search/ {
    limit_req zone=one burst=5;
}
```

本例中，nginx 每秒处理不超过 1 个请求。如果超过这个频率，该限制之外的请求会被放进队列里，在保证整体的频率不超过限制值的情况下延迟处理。

参数 `burst` 用于设定队列中可以存放的最大请求数，超过的请求会产生 503 错误。

如果在请求过多时不希望进行延迟处理，可以加入 `nodelay` 参数：

```conf
limit_req zone=one burst=5 nodelay;
```









### 限制带宽



#### 限制每连接带宽

若要限制每个连接的带宽，需使用 `limit_rate` 指令：

```conf
location /download/ {
    limit_rate 50k;
}
```

这样配置以后，客户端通过一个连接下载网站内容时，其速度被限制在 50 KB/s。



#### 限制连接数

然而，客户端可以打开多个连接同时进行下载。因此，如果希望限制下载速度，还需要对连接数加以限制。例如，可以额外再限制每 IP 地址一个连接：

```conf
location /download/ {
    limit_conn addr 1;
    limit_rate 50k;
}
```



#### 在下载一定数据后开始限制

希望在客户端下载了一定数量的数据以后再实施带宽限制，这样也比较合理。使用 `limit_rate_after` 指令：

```conf
limit_rate_after 500k;
limit_rate 20k;
```



#### 范例

```conf
http {
    limit_conn_zone $binary_remote_address zone=addr:10m

    server {
        root /www/data;
        limit_conn addr 5;

        location / {
        }

        location /download/ {
            limit_conn addr 1;
            limit_rate 1m;
            limit_rate 50k;
        }
    }
}
```

本例中，每客户端 IP 地址最多可使用 5 个连接，基本上满足当前大多数浏览器的需求，通常浏览器最多使用不超过 3 个连接。同时，可用于下载的连接限制为 1 个。










































## 限制对被代理的 TCP 资源的访问








### 通过 IP 地址限制访问

nginx 可以基于客户端特定的 IP 地址或地址范围实施访问的限制。在 `stream` 或 `server` 块中使用 `allow` 和 `deny` 指令。

```conf
stream {
    ...
    server {
        listen 12345;
        deny   192.168.1.2;
        allow  192.168.1.1/24;
        allow  2001:0db8::/32;
        deny   all;
    }
}
```

由 `allow` 和 `deny` 构成的这些规则是按照顺序从上到下逐行处理的：如果第一条指令为 `deny all`，则下面所有的 `allow` 都无效。








### 限制 TCP 连接数

可以限制来自同一个 IP  地址的并发 TCP 连接数，这一点有利于防止 DoS 攻击。



#### 定义内存区、键

首先要定义一个内存区，用来保存某服务器的最大并发连接数，以及一个键，用于标识连接。

通过在 `stream` 块中使用 `limit_conn_zone` 指令来实现：

```conf
stream {
    ...
    limit_conn_zone $binary_remote_addr zone=ip_addr:10m;
    ...
}
```

用来标识连接的键为 `$binary_remote_addr`，它用二进制的格式表示客户端的 IP  地址。

共享的内存区其名称为 `ip_addr`，内存区大小为 10 MB。



#### 指定最大连接数

定义了内存区以后，用 `limit_conn` 指令来限制连接，可以在 `stream` 或 `server` 块中指定。

第一个参数用于指定之前定义的内存区的名称。

第二个参数用于指定每 IP 地址允许的最大连接数。

```conf
stream {
    ...
    limit_conn_zone $binary_remote_addr zone=ip_addr:10m;

    server {
        ...
        limit_conn ip_addr 1;
    }
}
```













### 限制带宽



#### 限制单连接带宽

可以为 TCP 连接配置最大的下载和上传速度。使用 `proxy_download_rate` 和 `proxy_upload_rate` 指令。

```conf
server {
    ...
    proxy_download_rate 100k;
    proxy_upload_rate   50k;
}
```

本例中，客户端通过一个连接下载速度限制为 100 KB/s，上传限制为 50 KB/s。



#### 限制连接数

但客户端可以多开向个连接，如果要限制总的带宽，还要限制连接数：

```conf
stream {
    ...
    limit_conn_zone $binary_remote_addr zone=ip_addr:10m;

    server {
        ...
        limit_conn ip_addr 1;
        proxy_download_rate 100k;
        proxy_upload_rate   50k;
    }
}
```

连接数限制为 1。



































## 通过地理位置限制访问

nginx 可以基于地理位置区分不同的用户。可以根据不同的国家为用户提供不同的网站内容，或限制向某些国家或城市发布某些内容。

nginx 使用第三方 MaxMind 数据库来匹配用户及其位置。获取地理位置以后，就可以使用 `map` 或 `split_clients` 模块中基于地理位置的变量了。

基于地理位置的限制对于 HTTP 和 TCP/UDP 协议都有效。





### 先决条件

* nginx，需包含 http、geoip、stream geoip 模块
* MaxMind 提供的 Geolite 免费数据库







### 配置 GeoIP

1\. 确保 nginx 编译时使用了 `--with-http_geoip_module` 和/或 `--with-stream_geoip_module` 配置标签：

```bash
$ nginx -V 2>&1 | grep -- 'http_geoip_module'
$ nginx -V 2>&1 | grep -- 'stream_geoip_module'
```

或者确保这些模块可以动态链接。

2\. 从 MaxMind [下载页面](http://dev.maxmind.com/geoip/legacy/geolite/)下载并解压 Geo 国家与城市数据库：

```bash
$ wget http://geolite.maxmind.com/download/geoip/database/GeoLiteCountry/GeoIP.dat.gz
$ wget http://geolite.maxmind.com/download/geoip/database/GeoLiteCity.dat.gz
$ gunzip GeoIP.dat.gz
$ gunzip GeoLiteCity.dat.gz
```

3\. 针对 HTTP、TCP/UDP，用 `geoip_country` 和 `geoip_city` 指令指定数据库的路径。

```conf
http {
    #...
    geoip_country GeoIP/GeoIP.dat;
    geoip_city    GeoIP/GeoLiteCity.dat;
    #...
 }

stream {
    #...
    geoip_country GeoIP/GeoIP.dat;
    geoip_city    GeoIP/GeoLiteCity.dat;
    #...
}
```

4\. 用 GeoIP 模块的标准变量把数据传递给 `map` 或 `split_clients` 指令：

例如，使用 `geoip_city` 指令的 `$geoip_city_continent_code` 变量，以及 `map` 模块，可以创建另一个变量，用来保存基于位置最近的服务器：

```conf
#...
map $geoip_city_continent_code $nearest_server {
    default default {};
    EU      eu;
    NA      na;
    AS      as;
    AF      af;
#...
```

然后，可以基于变量 `$nearest_server` 传递的值，选择一个后端服务器：

```conf
#...
server {
    listen 12346;
    proxy_pass $nearest_server;
}
 upstream eu {
    server eu1.example.com:12345;
    server eu2.example.com:12345;
}
upstream na {
    server na1.example.com:12345;
    server na2.example.com:12345;
}
#...
```

如果洲际是欧洲，则变量 `$nearest_server` 的值为 `eu`，该连接将通过 `proxy_pass` 指令被传递给后端 `eu`。







### 范例

本例可以应用于 `http` 或 `stream` 中：

```conf
# can be either "http {" or "stream {"
    #...
    geoip_country GeoIP/GeoIP.dat;
    geoip_city    GeoIP/GeoLiteCity.dat;
    map $geoip_city_continent_code $nearest_server {
        default default {};
        EU      eu;
        NA      na;
        AS      as;
        AF      af;
    server {
        listen 12346;
        proxy_pass $nearest_server;
    }
     upstream eu {
        server eu1.example.com:12345;
        server eu2.example.com:12345;
    }
    upstream na {
        server na1.example.com:12345;
        server na2.example.com:12345;
    }
}
```

本例中，会从 `GeoLiteCity.dat` 数据库中检查客户端的 IP 地址，把结果写入变量 `$geoip_city_continent_code`，nginx 会将该变量值与 `map` 指令中的值进行匹配，在自定义变量 `$nearest_server` 中把结果修改成小写的，然后，`proxy_pass` 指令会选择一个对应的后端服务器。



































## 保证去往后端服务器的 HTTP 流量的安全







### 先决条件

* nginx
* 一个后端服务器或一个后端组
* SSL 证书及私钥






### 获取 SSL 服务器证书

可以从可信的证书颁发机构（CA）来购买服务器证书，或者，也可以用 OpenSSL 运行库创建自己的内部 CA，并生成自己的证书。在每个后端服务器中，服务器证书和私钥必须放在一起。









### 获取 SSL 客户端证书

nginx 会使用一个 SSL 客户端证书向后端服务器来标识自己。该客户端证书必须是由可信 CA 颁发的，必须与对应的私钥一起在 nginx 中配置妥当。

还需要配置后端服务器，令其对所有传入的 SSL 连接都索取客户端证书，并信任为 nginx 颁发客户端证书的 CA。这样，当 nginx 连接到后端时，它提供的客户端证书就能被服务器接受了。








### 配置  nginx



#### 修改 URL

首先，把 URL 修改为后端服务器组以支持 SSL 连接。在 nginx 配置文件中，在代理服务器或后端组中为 `proxy_pass` 指令设定 `https` 协议：

```conf
location /upstream {
    proxy_pass https://backend.example.com;
}
```



#### 配置客户端证书和私钥

然后，配置客户端证书和私钥，用于在每个后端服务器中验证 nginx，使用 `proxy_ssl_certificate` 和 `proxy_ssl_certificate_key` 指令：

```conf
location /upstream {
    proxy_pass                https://backend.example.com;
    proxy_ssl_certificate     /etc/nginx/client.pem;
    proxy_ssl_certificate_key /etc/nginx/client.key
}
```

如果后端使用的是自已生成的证书，或自己的 CA 颁发的证书，还需要用 `proxy_ssl_trusted_certificate` 来指定证书的路径，证书文件必须是 PEM 格式的。还可以考虑使用 `proxy_ssl_verify` 和 `proxy_ssl_verify_depth` 指令，让 nginx 可以检查安全证书的有效性：

```conf
location /upstream {
    ...
    proxy_ssl_trusted_certificate /etc/nginx/trusted_ca_cert.crt;
    proxy_ssl_verify       on;
    proxy_ssl_verify_depth 2;
    ...
}
```

每个新的 SSL 连接都需要在客户端与服务端之间进行一次完整的握手，非常占用 CPU。使用 `proxy_ssl_session_reuse` 指令，可以让 nginx 代理预先协商连接参数，使用一种简略的握手过程。即使用代理服务器时，可以重用 SSL 会话以简化客户端与服务端的通信。

如果需要，还可以指定使用哪种 SSL 协议和哪种密钥算法：

```conf
location /upstream {
        ...
        proxy_ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        proxy_ssl_ciphers   HIGH:!aNULL:!MD5;
}
```











### 配置后端服务器

每个后端服务器都应该配置为可接受 HTTPS 连接。针对每个后端服务器，用 `ssl_certificate` 和 `ssl_certificate_key` 指令来指定服务器证书和私钥的路径：

```conf
server {
    listen              443 ssl;
    server_name         backend1.example.com;

    ssl_certificate     /etc/ssl/certs/server.crt;
    ssl_certificate_key /etc/ssl/certs/server.key;
    ...
    location /yourapp {
        proxy_pass http://url_to_app.com;
        ...
    }
}
```

用 `ssl_client_certificate` 指令来指定客户端证书的路径：

```conf
server {
    ...
    ssl_client_certificate /etc/ssl/certs/ca.crt;
    ssl_verify_client      off;
    ...
}
```











### 完整范例

```conf
http {
    ...
    upstream backend.example.com {
        server backend1.example.com:443;
        server backend2.example.com:443;
   }

    server {
        listen      80;
        server_name www.example.com;
        ...

        location /upstream {
            proxy_pass                    https://backend.example.com;
            proxy_ssl_certificate         /etc/nginx/client.pem;
            proxy_ssl_certificate_key     /etc/nginx/client.key
            proxy_ssl_protocols           TLSv1 TLSv1.1 TLSv1.2;
            proxy_ssl_ciphers             HIGH:!aNULL:!MD5;
            proxy_ssl_trusted_certificate /etc/nginx/trusted_ca_cert.crt;

            proxy_ssl_verify        on;
            proxy_ssl_verify_depth  2;
            proxy_ssl_session_reuse on;
        }
    }

    server {
        listen      443 ssl;
        server_name backend1.example.com;

        ssl_certificate        /etc/ssl/certs/server.crt;
        ssl_certificate_key    /etc/ssl/certs/server.key;
        ssl_client_certificate /etc/ssl/certs/ca.crt;
        ssl_verify_client      off;

        location /yourapp {
            proxy_pass http://url_to_app.com;
        ...
        }

    server {
        listen      443 ssl;
        server_name backend2.example.com;

        ssl_certificate        /etc/ssl/certs/server.crt;
        ssl_certificate_key    /etc/ssl/certs/server.key;
        ssl_client_certificate /etc/ssl/certs/ca.crt;
        ssl_verify_client      off;

        location /yourapp {
            proxy_pass http://url_to_app.com;
        ...
        }
    }
}
```

本例中，`proxy_pass` 指令中的 `https` 协议保证了从 nginx 转发到后端服务器的流量是安全的。

当一个安全连接首次从 nginx 传递给后端服务器时，会进行完整的握手。`proxy_ssl_certificate` 指令指定了后端服务器所需的 PEM 格式的证书的路径，`proxy_ssl_certificate_key` 指令则指定了证书私钥的路径，`proxy_ssl_protocols` 和 `proxy_ssl_ciphers` 指令用来控制使用哪种协议和密钥算法。

当 nginx 下一次给后端服务器传递连接时，会话的参数会被重用，这是因为 `proxy_ssl_session_reuse` 指令，如此一来，安全的连接会更快速地建立起来。

由 `proxy_ssl_trusted_certificate` 指令指定的可信的 CA 证书，是用来验证后端服务器中的证书的。`proxy_ssl_verify_depth` 指令指定了需要检查证书链的深度，此处为两个证书，`proxy_ssl_verify` 指令表明会对证书的有效性进行检验。


































## 保证去往后端服务器的 TCP 流量的安全





### 先决条件

* 使用 `--with-stream` 和 `with-stream_ssl_module` 配置参数编译的 nginx
* 一个被代理的 TCP 服务器，或一个 TCP 后端服务器组
* SSL 证书及一个私钥











### 获取 SSL 服务器证书

首先，需要得到服务器证书和一个私钥，并把它们放到后端服务器中，或后端组的每个服务器中。证书可以从可信 CA 获取，或使用 OpenSSL 这样的 SSL 运行库生成。

如果是想用来加密 nginx 和后端服务器的连接，可以使用自己颁发的服务器证书。然而，这些连接对于 “中间人攻击” 就比较脆弱：骗子可以模仿后端服务器，nginx 无从知道它正和一个假冒的服务器通讯。你可以用 OpenSSL 建立自己的内部 CA，这样就可以获得可信 CA 颁发的服务器证书了，然后再配置 nginx 只信任由该 CA 颁发的证书就行了。如此一来，骗子就很难再冒充后端服务器了。











### 获取 SSL 客户端证书

nginx 可以用一个 SSL 客户端证书来标识自己，该证书必须由可信 CA 颁发，必须与对应的私钥一同保存在 nginx 中。

有必要配置后端服务器，令其对所有传入连接都索取客户端证书，并信任给 nginx 颁发客户端证书的特定的 CA。这样，当 nginx 连接到后端服务器时，它会提供自己的客户端证书，后端服务器自然会接受。











### 配置 nginx



#### 为连接到后端服务器的连接启用 SSL/TLS 协议

在 nginx 配置文件中，在 `stream > server` 块中使用 `proxy_ssl` 指令：

```conf
stream {
    server {
        ...
        proxy_pass backend;
        proxy_ssl  on;
    }
}
```



#### 指定客户端证书、私钥

然后，指定 SSL 客户端证书及私钥的路径：

```conf
server {
        ...
        proxy_ssl_certificate     /etc/ssl/certs/backend.crt;
        proxy_ssl_certificate_key /etc/ssl/certs/backend.key;
}
```



#### 指定 SSL 协议和密钥算法

可以考虑设定具体的 SSL 协议和密钥算法：

```conf
server {
        ...
        proxy_ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        proxy_ssl_ciphers   HIGH:!aNULL:!MD5;
}
```



#### 指定可信 CA 证书路径

如果使用的是由 CA 颁发的证书，还需要使用 `proxy_ssl_trusted_certificate` 指令来指定证书的路径，用来 **验证后端服务器** 的安全证书。该证书文件必须是 PEM 格式。

如果需要，还可以加入 `proxy_ssl_verify` 和 `proxy_ssl_verify_depth` 指令，让 nginx 检验安全证书的有效性。

```conf
server {
    ...
    proxy_ssl_trusted_certificate /etc/ssl/certs/trusted_ca_cert.crt;
    proxy_ssl_verify       on;
    proxy_ssl_verify_depth 2;
}
```



#### 重用 SSL 会话

每个新的 SSL 连接都需要在客户端与服务端之间进行一次完整的握手，非常占用 CPU。使用 `proxy_ssl_session_reuse` 指令，可以让 nginx 代理预先协商连接参数，使用一种简略的握手过程。即使用代理服务器时，可以重用 SSL 会话以简化客户端与服务端的通信。

```conf
proxy_ssl_session_reuse on;
```











### 完整范例

```conf
stream {

    upstream backend {
        server backend1.example.com:12345;
        server backend2.example.com:12345;
        server backend3.example.com:12345;
   }

    server {
        listen     12345;
        proxy_pass backend;
        proxy_ssl  on;

        proxy_ssl_certificate         /etc/ssl/certs/backend.crt;
        proxy_ssl_certificate_key     /etc/ssl/certs/backend.key;
        proxy_ssl_protocols           TLSv1 TLSv1.1 TLSv1.2;
        proxy_ssl_ciphers             HIGH:!aNULL:!MD5;
        proxy_ssl_trusted_certificate /etc/ssl/certs/trusted_ca_cert.crt;

        proxy_ssl_verify        on;
        proxy_ssl_verify_depth  2;
        proxy_ssl_session_reuse on;
    }
}
```

本例中，`proxy_ssl`  指令保证了 nginx 向后端服务器转发的 TCP 流量都是安全的，因为它开启了 SSL 协议的使用。

当 nginx 把一个安全的 TCP 连接首次传递给后端服务器时，会进行完整的握手。后端服务器要求 nginx 亮出由 `proxy_ssl_certificate` 指令指定的安全证书。`proxy_ssl_protocols` 和 `proxy_ssl_ciphers` 指令用来控制使用哪种协议和密钥算法。

当 nginx 下一次给后端服务器传递连接时，会话的参数会被重用，这是因为 `proxy_ssl_session_reuse` 指令，如此一来，安全的 TCP 连接会更快速地建立起来。

由 `proxy_ssl_trusted_certificate` 指令指定的可信的 CA 证书，是用来验证后端服务器中的证书的。`proxy_ssl_verify_depth` 指令指定了需要检查证书链的深度，此处为两个证书，`proxy_ssl_verify` 指令表明会对证书的有效性进行检验。
