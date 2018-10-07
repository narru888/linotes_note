---
toc: true
toc_label: "LAMP 架构工作原理"
toc_icon: "copy"
title: "LAMP 架构工作原理"
tags: lamp 原理
categories: "framework"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/nginx.jpeg
  overlay_filter: rgba(0, 0, 0, 0.8)
---







## LAMP 架构简介

LAMP 是指一组通常一起使用来运行动态网站或者服务器的自由软件。

名称首字母缩写：

* **L** ：Linux，操作系统
* **A** ：Apache，网页服务器
* **M** ：MariaDB 或 MySQL，数据库管理系统（或者数据库服务器）
* **P** ：PHP、Perl 或 Python，脚本语言

虽然这些开放源代码程序本身并不是专门设计成同另几个程序一起工作的，但由于它们的廉价和普遍，这个组合变得流行。一起使用的时候，它们表现的像一个具有活力的 “解决方案包”。

安装的简便性使人误以为这些软件会自行顺利地运行，但是实际情况并非如此。最终，应用程序的负载会超出后端服务器自带设置的处理能力，应用程序的性能会降低。LAMP 安装需要不断监控、调优和评估。



![image-center](/assets/images/LAMP.png){: .align-center}

























## PHP






### PHP 简介


PHP，最初代表 Personal Home Page，后来代表 PHP: Hypertext Preprocessor。

PHP 代码可以嵌入 HTML 代码，还可以与各种网页模板系统、网页内容管理系统、网页框架等一起工作。PHP 代码通常由 PHP 解释器来处理，解释器可以是网页服务器的一个 **模块**，也可以是一个 CGI **可执行文件**。网页服务器再把解释的结果与网页合并在一起，解释的结果有可能是各类型的数据，包括图片。PHP 代码也可以用命令行来执行，也可以用来开发用户端的 GUI 应用程序。

标准的 PHP 解释器，由 Zend Engine 开发，根据 PHP 许可发布的自由软件。PHP 被广泛传播，可以在大多数网页服务器中部署。



#### 语法

嵌入 HTML 时：

```html
<!DOCTYPE html>
<html>
 <head>
 <title>PHP Test</title>
 </head>
 <body>
 <?php echo '<p>Hello World</p>'; ?>
 </body>
</html>
```

不嵌入时：

```php
 <?='Hello world';
```

不嵌入 HTML 时，即文件中包含纯 PHP 代码时，可以省略结尾的括号。

PHP 解释器只解释其分隔符之中的代码。分隔符之外的不会处理，不过非 PHP 的文本仍受 php 代码中描述的控制结构的制约。通常的分隔符为 `<?php` 和 `?>`，还有一种简写的方法 `<?`。不建议使用简写，因为在本地 PHP 配置中有可能被禁用对这种简写的支持。这些分隔符的目的在于将 PHP 代码与非 PHP 分隔开，如 JS 代码或 HTML 代码。

`<?php ?>` 这种形式的分隔符如果使用在 XHTML 和其它 XML 文档中，会生成 XML 处理指令，这意味着在服务器端文件中生成的 PHP 代码和其他标记的混合本身就是格式良好的 XML。

变量名前缀为美元符号 `$`，无需预先声明变量类型。PHP 5 引入了类型提示，允许函数将其参数强制为特定类、数组、接口或回调函数的对象。但是, 在 PHP 7.0 之前，类型提示不能与标量类型（如整数或字符串）一起使用。

与函数名及类名不同，变量名是大小写敏感的。

使用双引号 (" ") 和定界符字符串都可以将变量值插到字符串中。

PHP 把换行当空格看待，语句之间用分号分隔。

PHP 有三种注释符号：`/* */` 用于成块的或内联注释，`/ /` 或 `#` 用于单行注释。

`echo` 语句是 PHP 常用的输出语句，可以输出文本，如输出到浏览器。

在关键字和语法上，PHP 与 C 风格的语法类似。`if`、`for`、`while` 等函数返回与 C、C++、C#、Java、Perl 的语法类似。








#### PHP 大致工作原理

PHP 软件是与网页服务器一起工作的，网页服务器负责发送网页。

当用户在浏览器地址栏中输入一个 URL 时，实际上是在向该 URL 中的服务器发送一个消息，要求它发个 HTML 文件过来。网页服务器的响应就是发送请求的文件，浏览器读取 HTML 文件，显示网页。

用户在网页中点击链接时，其实也是在向网页服务器请求文件，点击网页中按钮来提交表单时，网页服务器也会来处理一个文件。

如果服务器中安装了 PHP，处理过程也大致相同。可以配置网页服务器，使其可以处理特定的文件，这些文件中可以包含 PHP 语句。后缀可以是 `.php` 或 `.phtml` 等，实际上可以是任何后缀，由管理员决定。网页服务器收到针对 PHP 文件的请求时，文件中的 HTML 语句会按原样发送，而 PHP 语句则要由 PHP 解释器来处理，然后把结果与 HTML 一起发送给用户。

在对 PHP 语句处理之后，只有产生的输出才会由网页服务器发送给浏览器，那些不产生输出的语句就不会发送，因此用户通常是看不到原始的 PHP 代码的。

* 用户发送 HTTP 请求，到达网页服务器
* 网页服务器解析 URL，获取需要的资源路径，通过内核空间读取文件系统资源。
	- 如果是静态资源，则构建响应报文，发给用户
	- 如果是动态资源，则把资源地址发给 PHP 解释器，解释 PHP 程序文件，解释完毕，把内容返回网页服务器，由其构建响应报文，发给用户
	- 如果涉及到数据库操作，则利用 php-mysql 驱动，获取数据库数据，返回 PHP 解释器










### PHP 的运行模式




#### SAPI

Server Application Programming Interface

SAPI 是对服务端 API 的统称，它是 PHP 与其它应用交互的接口，PHP 脚本可以有多种执行方式，通过网页服务器，或者直接在命令行下，也可以嵌入在其他程序中。SAPI 提供了一个和外部通信的接口。

PHP 包含多个 SAPI 模块，以实现与网页服务器的多种通信方式。

常见的 PHP SAPI 有：CGI，Fast-CGI，CLI，ISAPI，模块化动态链接库

![image-center](/assets/images/apache_sapi_php.png){: .align-center}

以下就几种常用的 SAPI 来探讨 PHP 的运行模式。




#### 模块运行模式

该模式中，SAPI 为嵌入 apache 的一个模块，通常名为 **`mod_php`**，根据 PHP 版本，名称略有区别。

编译 apache 时，把 PHP 做为 apache 的一个 **模块** 来运行，这种运行方式通常还算比较有效率，但所有的脚本都会以同样的用户来运行，这对于 **共享** 的环境来说有一些 **安全隐患**。


##### `mod_php` 模块的加载方式

该模式下，会使用 apache 的 `mod_php` 模块来执行网页服务器中的 PHP 脚本。

`mod_php` 模块的作用，是接收并处理 apache 传递过来的 PHP 文件请求，然后将处理后的结果返回给 apache。

###### 与 apache 同时启动

apache 启动前，如果我们在其配置文件中配置好了 PHP 模块（如 mod_php5），PHP 模块通过注册 apache2 的 `ap_hook_post_config` 钩子，在 apache 启动的时候启动此模块以接受 PHP 文件的请求。

以 `mod_php5` 为例，可以在 apache 配置文件 httpd.conf 中添加一行：

```conf
LoadModule php5_module modules/mod_php5.so
```

>`LoadModule` 命令的第一个参数为模块的名称，可以在模块实现的源码中找到。第二个参数为该模块的路径。

###### 动态加载

另外，还可以在运行时动态加载 `mod_php` 模块，但需要提前把模块编译为动态链接库。需要加载时，可以向服务器发送信号 `HUP` 或 `AP_SIG_GRACEFUL`，apache 收到信号就会重新加载模块，无需重启服务器。


##### 工作原理

apache 会为每个 HTTP 请求派生一个专门的子进程。在每个子进程中，`mod_php` 模块会嵌入专门的 PHP 解释器，哪怕进程只用来处理静态的资源也是如此。例如 JavaScript、图片或样式表，也会嵌入 PHP 解析器。以这种方式运行时，apache 的子进程可以直接处理并执行 PHP 脚本，而无需再与外部进程的通讯。对于重度 PHP 的网站，如 WordPress、Drupal、Joomla 等这样多数请求都包含 PHP 代码的网站来说尤其有用，因为所有的请求都能由 apache 来直接处理。

在 apache 启动的时候会读取 `php.ini` 配置文件，并加载扩展模块，在 apache 运行期间是不会再去读取和加载扩展模块的。apache 出于稳定性和安全性考虑，通常使用默认的 prefork 模式运行 php 程序。在 prefork 模式下，一个单独的控制进程负责产生子进程，这些子进程用于监听请求并作出应答。

apache 总是试图保有一些备用或空闲的子进程，用于迎接即将到来的请求，如此一来，客户端无需在得到服务前等候子进程的产生。

但是，一旦连接数多了，apache 必须要生成更多的进程来响应请求，CPU 对于进程的切换就很频繁，很耗时间和资源，导致 apache 性能下降；同时，apache 在同步阻塞 I/O 模型下，select 遍历多个连接句柄才能知道句柄是否有事件通知，因此效率非常低。

###### 优点

* PHP 代码由 apache 来执行
* 无需外部进程
* 对重度 PHP 网站有很好的性能
* PHP 的配置可以用 `.htaccess` 指令来自定义

###### 缺点

* 每个 apache 进程会占用更多的内存资源
* 即使为静态内容也会加载 PHP 解释器
* 由 PHP 脚本生成的文件通常所有者为网页服务器，因此无法直接编辑




#### CGI 模式

该模式中，SAPI 为 CGI，即 Common Gateway Interface，通用网关接口。

CGI 是比较老的模式，近年很少有人使用。

**`php-cgi`** 是 PHP 对网页服务器提供的 CGI 接口的程序，同时它也是 PHP 的解释器。

CGI 是一个 **接口**，它会告知网页服务器如何与 PHP 应用程序交换数据。它为网页服务器与应用程序之间规定了一个标准的通讯 **协议**。它描述了请求的信息是如何通过环境变量传递的，请求的报文是如何通过标准输入传递的，以及响应是如何通过标准输出传递的。即，CGI 规定了要在网页服务器与应用程序服务器之间传递哪些数据，以什么样的格式传递。

网页服务器传给 PHP 解释器的数据通常有：URL、查询字符串、POST 数据、HTTP 标头等。

网页服务器收到 `/index.php` 请求时，会启动对应的 CGI 程序，这里就是 PHP 解释器。之后，PHP 解释器会分析配置文件，初始化执行环境，然后处理请求，再以规定的格式返回处理的结果，退出进程，网页服务器把结果返回浏览器。

问题在于，标准的 CGI 对于每个请求都会执行一遍这些步骤，所以用 CGI 方式的服务器，收到多少连接请求就会派生多少 CGI 子进程，子进程反复加载是 CGI 性能低下的主要原因。当用户请求数量非常多时，会大量占用系统的资源，导致性能低下。




#### FastCGI 模式

FastCGI 是 CGI 的升级版本，FastCGI 像是一个常驻型的 CGI，它可以一直执行着，激活后，不会每次都花时间去 Fork（CGI 最为人诟病的 fork-and-execute 模式）。

FastCGI 是一个可伸缩地、高速地在网页服务器和动态脚本语言间通信的接口。多数流行的网页服务器都支持 FastCGI，包括 apache、nginx 和 lighttpd 等，同时，FastCGI 也被许多脚本语言所支持，其中就有 PHP。

FastCGI 是从 CGI 发展改进而来的。传统 CGI 接口方式的主要缺点是性能很差，因为每次网页服务器遇到动态程序时，都需要重新启动脚本解释器来执行解析，然后结果被返回给网页服务器。这在处理高并发访问时，几乎是不可用的。另外，传统的 CGI 接口方式安全性也很差，现在已经很少被使用了。

FastCGI 接口方式采用 C/S 结构，可以将网页服务器和脚本解析服务器分开，同时在脚本解析服务器上启动一个或者多个脚本解析守护进程。当网页服务器每次遇到动态程序时，可以将其直接交付给 FastCGI 进程来执行，然后将得到的结果返回给浏览器。这种方式可以让网页服务器专一地处理静态请求，或者将动态脚本服务器的结果返回给客户端，这在很大程度上提高了整个应用系统的性能。


##### 原理

* 网页服务器启动时，加载 FastCGI 进程管理器
* FastCGI 进程管理器自身初始化，启动多个 CGI 解释器进程（可见多个 `php-cgi`）并等待来自网页服务器的连接
* 当客户端请求到达网页服务器时，FastCGI 进程管理器选择并连接到一个 CGI 解释器。网页服务器将 CGI 环境变量和标准输入发送到 FastCGI 子进程 `php-cgi`
* FastCGI 子进程完成处理后，将标准输出和错误信息从同一连接返回网页服务器。当 FastCGI 子进程关闭连接时，请求便处理完成。
* FastCGI 子进程接着等待并处理来自 FastCGI 进程管理器的下一个连接。 在 CGI 模式中，`php-cgi` 在此时便退出了。

在 CGI 模式中，针对每个请求，PHP 都要重新解析配置、重新加载全部动态链接库扩展，并重新初始化全部数据结构。而使用 FastCGI，所有这些都只在进程启动时发生一次。还有一个额外的好处：持续数据库连接（Persistent database connection）可以工作。

工作在 FastCGI 模式下的 PHP 会自行启动服务进程，监听于某个 **套接字** 上，随时接受来自客户端的请求。它是一个主进程，为了能同时响应多个用户的请求，它会启用多个 **工人进程** 。一旦有请求进来，它马上使用空闲的工人进程响应，将结果返回给前端的调用者。

在 PHP 5.3 版本之前，只能工作于模块和 CGI 方式，在 PHP 5.3 之后，FastCGI 直接被收进 PHP 模块中，该模块就是 `php-fpm`。

FastCGI 是通过套接字跟前端的调用者通信的，因此，前端的网页服务器和后端的 PHP 服务器完全可以工作在不同的主机上，实现了所谓的 **分层** 机制。


##### `php-cgi`

`php-cgi` 是 PHP 自带的 Fast-CGI 管理器。

`php-cgi` 的不足：

变更配置后，需重启 `php-cgi` 才能让新的配置生效，无法平滑重启。

如果直接杀死 `php-cgi` 进程，PHP 就无法运行了。(PHP-FPM 和 Spawn-FCGI 就没有这个问题，守护进程会平滑重新生成新的子进程。）


##### `php-fpm`

`php-fpm` 是一个 PHP FastCGI 的管理器，他是能够 **调度 `php-cgi` 进程** 的程序。

修改 PHP 配置之后，`php-cgi` 进程的确没办法平滑重启，但 `php-fpm` 对此的应对方法是：现有进程仍按原配置执行到结束，新的进程用新的配置。用这种方式进行平滑过渡。

`php-fpm` 就是针对于 PHP 的 FastCGI 的一种实现，他负责管理一个 **进程池**，处理来自网页服务器的请求。目前，`php-fpm` 是内置于 PHP 中的。


##### 优点

从稳定性上看：

FastCGI 是以独立的进程池来运行 CGI，单独一个进程死掉，系统可以很轻易的丢弃，然后重新分配新的进程来运行逻辑；

从安全性上看：

FastCGI 支持分布式运算。FastCGI 和宿主的服务器完全独立，FastCGI 的沦陷不会影响宿主服务器。

从性能上看：

FastCGI 把动态逻辑的处理从服务器中分离出来，大负荷的 I/O 处理还是留给宿主服务器，这样，宿主服务器可以一心一意作 I/O，对于一个普通的动态网页来说，逻辑处理可能只有一小部分，大量的是图片等静态文件。


##### 缺点

目前的 FastCGI 和网页服务器沟通还不够智能，一个 FastCGI 进程如果执行时间过长，会被当成是死进程杀掉重启。这样，在处理长时间任务的时候很麻烦，也使得 FastCGI 无法允许联机调试。因为是多进程，所以比 CGI 多线程消耗更多的服务器内存，PHP-CGI 解释器每进程消耗 7 ~ 25 MB 内存，将这个数字乘以 50 或 100 就是不小的内存了。




#### CLI 模式

PHP-CLI 是 PHP Command Line Interface 的简称，是 PHP 在命令行运行的接口，区别于在网页服务器上运行的 PHP 环境（PHP-CGI，ISAPI 等）。也就是说，PHP 不单可以写前台网页，它还可以用来写后台的程序。 PHP 的 CLI Shell 脚本适用于所有的 PHP 优势，使创建要么支持脚本或系统甚至与 GUI 应用程序的服务端，在 Windows 和 Linux 下都是支持 PHP-CLI 模式的。


##### 优点

使用多进程，子进程结束以后，内核会负责回收资源；

使用多进程，子进程异常退出不会导致整个进程退出，父进程还有机会重建流程；

一个常驻主进程，只负责任务分发，逻辑更清楚。

...

我们在 Linux 下经常使用 `php –m` 查看 PHP 安装了那些扩展，这就是 PHP 命令行运行模式。





#### ISAPI 模式

Internet Server Application Program Interface，是微软提供的一套面向 Internet 服务的 API 接口，一个 ISAPI 的动态链接库，可以在被用户请求激活后长驻内存，等待用户的另一个请求，还可以在一个动态链接库里设置多个用户请求处理函数，此外，ISAPI 的动态链接库应用程序和网页服务器处于同一个进程中，效率要显著高于 CGI。（由于微软的排他性，只能运行于 windows 环境）

PHP 作为 apache 模块时，apache 服务器在系统启动后，预先生成多个进程副本驻留在内存中，一旦有请求出现，就立即使用这些空余的子进程进行处理，这样就不存在生成子进程造成的延迟了。这些服务器副本在处理完一次 HTTP 请求之后并不立即退出，而是停留在计算机中等待下次请求。对于客户浏览器的请求反应更快，性能较高。





#### 进化过程

![image-center](/assets/images/sapi.update.png){: .align-center}

普遍来说，如果要搭建一个高性能的 PHP 网页服务器，目前最佳的方式是 Apache/Nginx + FastCGI + PHP-FPM(+PHP-CGI)，不再使用模块加载或者 CGI 方式。
















### PHP 与数据库的通信

apache 不会跟数据库打交道，它是个静态网页服务器，跟数据库打交道的是应用程序，应用程序的 **源驱动** 能够通过 API 与数据库服务器建立会话，然后把 mysql 语句发送给数据库，数据库将结果返回给应用程序。

🚩🚩🚩🚩🚩 to be continued ...








### PHP 的安装




#### 安装仓库

PHP 7.x 安装包在许多仓库中都有，其中 [Remi 仓库](https://rpms.remirepo.net/) 中的版本通常比较新。该仓库依赖于 EPEL 仓库，所以要先装 EPEL。

```bash
sudo yum install epel-release
sudo yum install http://rpms.remirepo.net/enterprise/remi-release-7.rpm
```




#### 在 CentOS 7 上安装 PHP 7.2

PHP 7.2 是较新的稳定版本，现在的大部分 PHP 框架和应用都支持，包括 WordPress、Drupal、Joomla、Laravel 等。

```bash
$ sudo yum --enablerepo="remi-php72" install -y \
  php php-common php-opcache php-mcrypt php-cli php-gd php-curl php-mysqlnd
```

检查是否安装成功：

```bash
$ php -v

PHP 7.2.9 (cli) (built: Aug 15 2018 09:19:33) ( NTS )
Copyright (c) 1997-2018 The PHP Group
Zend Engine v3.2.0, Copyright (c) 1998-2018 Zend Technologies
    with Zend OPcache v7.2.9, Copyright (c) 1999-2018, by Zend Technologies
```

修改安全配置：

```bash
$ sudo vi /etc/php.ini

cgi.fix_pathinfo=0
```





#### 配置 PHP 与 Apache 工作

直接重启 Apache 就可以了：

```bash
$ sudo systemctl restart httpd
```




#### 配置 PHP 与 Nginx 工作

因为 Nginx 并没有内置对 PHP 文件的处理能力，因此需要单独安装一个应用来处理 PHP 文件，如 PHP FPM。


##### 安装 PHP FPM

```bash
$ sudo yum --enablerepo="remi-php72" install -y php-fpm
```


##### 修改配置

默认情况下，PHP FPM 会以用户 `apache` 的身份运行于 9000 端口，我们需要将 **用户** 修改为 `nginx` ，并将其 **侦听对象** 由 TCP 套接字修改为 Unix 套接字：

```bash
$ sudo vi /etc/php-fpm.d/www.conf

...
user = nginx
group = nginx
listen = /run/php-fpm/www.sock
```


##### 启动 PHP FPM

修改之后，可以激活并启动 PHP FPM 守护进程了：

```bash
$ sudo systemctl enable php-fpm
$ sudo systemctl start php-fpm
```


##### 修改 Nginx 配置

修改 Nginx 的虚拟服务器配置，以便 Nginx 可以处理 PHP。

```conf
server {
...
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/run/php-fpm/www.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

重启 Nginx 服务，使新配置生效。

```bash
$ sudo systemctl restart nginx
```
























## MySQL

MariaDB 做为以替代 MySQL 为目标的产品，越来越被认可，并已广泛被接受。关于 [MariaDB VS MySQL](https://mariadb.com/kb/en/library/mariadb-vs-mysql-compatibility/) 的比较也已经很清楚明朗。



### MariaDB 的安装




#### CentOS 中安装 MariaDB

```bash
$ sudo yum install mariadb-server
```


##### 管理守护进程：

```bash
$ sudo systemctl status mariadb
$ sudo systemctl enable mariadb
$ sudo systemctl start mariadb
```


##### 安全处理：

```bash
$ sudo mysql_secure_installation
```

包括 root 密码、移除匿名用户、禁止 root 远程登陆、移除测试数据库、重载用户权限表。
