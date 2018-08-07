---
toc: true
toc_label: "MySQL 的备份与恢复"
toc_icon: "copy"
title: "MySQL 的备份与恢复"
tags: mysql 备份
categories: "database"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/mysql.jpg
  overlay_filter: rgba(0, 0, 0, 0.8)
---







## 备份与恢复的类型

本节内容主要引自 [ MySQL 8.0 Reference Manual ](https://dev.mysql.com/doc/refman/8.0/en/)



### 物理备份与逻辑备份



#### 物理备份

备份目录或文件的原始副本，数据库的内容就保存在这些文件中。适用于大型的、重要的数据库，发生问题时需要快速恢复。


##### 物理备份的特点

* 备份由数据库目录及文件的副本组成。通常是 MySQL 数据目录的完整副本。
* 物理备份的速度比逻辑备份更快，因为备份过程只需复制，不用转换。
* 输出比逻辑备份更简洁
* 备份和恢复的粒度从整个数据目录到独立的文件。
* 除了备份数据库以外，还可以备份相关文件，如日志及配置文件。
* 无法备份 `MEMORY` 表中的数据，因为其内容没有保存在磁盘中。
* 便携性不好，其他主机需要有相同或类似的硬件。
* 备份时最好离线，否则服务端需要进行适当的锁定，以便在备份过程中不会修改数据库的内容。



##### 常用物理备份工具

物理备份的常用工具包括 `mysqlbackup`，这是 MySQL 企业版的备份工具，用于 `InnoDB` 或任何其他表。

当然还有其它的文件系统级别的命令：如 `cp`、`scp`、`tar`、`rsync`，用于 `MyISAM` 表。

`ndb_restore` 用于恢复 `NDB` 表。




#### 逻辑备份

以逻辑数据库结构和内容的方式来表示备份的信息。适用于少量数据，有时需要编辑数据或表格结构，或在其它平台上重建数据。


##### 逻辑备份的特点

* 通过查询 MySQL 服务端来获取数据库的结构和内容。
* 备份速度比物理备份要慢，因为需要访问数据库并转换为逻辑格式。如果输出需要写到客户端一侧，服务端还要将其发送给备份程序。
* 输出更占空间，尤其是以文本格式保存时。
* 备份和恢复的粒度有：所有数据库、数据库中所有表、某个表，与存储引擎无关。
* 无法备份日志、配置文件及其它相关文件
* 备份以逻辑格式保存，高便携性
* 备份时允许服务端运行，无需离线


##### 常用逻辑备份工具

常用的逻辑备份工具包括 `mysqldump` 程序，`SELECT ... INTO OUTFILE` 语句，它们可用于任何存储引擎，包括 `MEMORY`。

逻辑备份的恢复，对于 SQL 格式的备份可以用 `mysql` 客户端来处理。

如果要处理文本文件，可用 `LOAD DATA INFILE` 语句，或使用 `mysqlimport` 客户端。














### 在线备份与离线备份




#### 热备、温备、冷备

根据数据库在备份期间的运行状态，常见的备份方式有三种：


##### 热备：

数据库运行时进行备份，期间程序可以对数据库进行读、写。

它比直接复制数据文件要复杂一些：

* 备份期间插入和更新的数据必须备份
* 备份期间删除的数据必须排除
* 没有提交的修改必须忽略

###### 热备的特点

在线备份时可以从服务端获取数据库的信息，但无法修改数据。

* 备份对客户端的打扰较弱，备份期间，客户端可以连接到服务端，并可访问某些数据。
* 必须进行适当的锁定，以防止数据的修改，避免影响备份的完整性。企业版的备份工具会自动锁定。


##### 温备：

数据库运行时进行备份，期间要限制某些数据库的操作。

如，备份期间，某些表可能变成只读。


##### 冷备：

数据库停止运行以后进行备份。对于繁忙的应用程序和网站来说，冷备不太现实，更适合温备或热备。

###### 冷备的特点

* 备份期间，客户端无法访问服务端。因此，冷备经常是在复制从属服务器进行的，它的离线不会影响服务端的可用性。
* 备份的流程更简单，因为不会受到客户端的影响。





#### 数据的恢复

热备与冷备的区别，同样体现在数据的恢复操作上。

不过，在线恢复的操作要比在线备份的操作对客户端影响更大，因为进行数据恢复时，需要更强的锁定。

备份时，客户端还可以读取一些数据，而在恢复时，还会修改一些数据，因此恢复某些数据期间，客户端对其是无法读取的。














### 本地备份与远程备份

本地备份是在 MySQL 服务端所在的主机上进行的，而远程备份是发生在其他主机上。备份可以由远程主机发起，甚至可以把输出保存在服务端本地。

* `mysqldump` 可以连接到本地主机或远程服务端。如果是使用 `CREATE` 和 `INSERT` 语句生成的 SQL 格式的输出，备份可以保存在本地，也可以保存到远程主机；如果使用的是 `--tab` 选项生成的纯文本输出，数据文件会保存在服务端主机中。
* `SELECT ... INTO OUTFILE` 语句可以来自本地或远程客户端，但输出文件会保存在服务端主机。
* 物理备份通常是从服务端本地发起，以便让服务端离线，文件可以复制到远程主机。













### 快照备份

有些文件系统会使用快照的功能，它会生成特定时间点的整个文件系统的逻辑副本，无需对整个文件系统进行物理复制。

如，可以使用写时复制（copy-on-write）技术，只有快照之后的改动才需复制。

MySQL 自身没有快照的功能，需要通过第三方工具来实现，如 Veritas、VLM、ZFS 等。











### 完全备份与增量备份

完全备份包含了 MySQL 服务端在某个时间点所管理的所有数据，而增量备份所包含的是在两个时间点之间数据所发生的变化。

MySQL 有多种办法可以进行完全备份，开启服务端二进制日志以后，就可以进行增量备份了，因为服务端需要使用日志来记录数据的变化。











### 完全恢复与时间点恢复

完全恢复会把所有数据从完全备份中恢复出来，同时会把服务端实例恢复成备份时的状态，如果该状态不够新，则完全恢复之后可以恢复自完整备份以来进行的增量备份, 让便服务器达到最新的状态。

增量恢复所恢复的数据是在某个时间跨度内发生的改变，也称为时间点恢复，因为它会使服务端恢复为它在某个时间点的状态。时间点恢复是基于二进制日志的，通常是在完整恢复之后进行。







































## 数据库的备份方法






### 用企业版备份工具进行热备

企业版备份工具可以进行物理备份，备份对象可以是所有实例、特定数据库、表等。它可进行增量备份、压缩备份。

物理备份比 `mysqldump` 这样的逻辑备份更快。复制 InnoDB 表使用的是热备机制，理想情况下，InnoDB 表应代表大部分数据。其它存储引擎的表是使用温备机制。










### 用 `mysqldump` 进行逻辑备份

应用程序 `mysqldump` 可以进行备份，它可以备份各种表。

对于 InnoDB 来说，使用 `mysqldump --single-transaction` 可以进行在线备份，而无需锁定表。

`mysqldump` 可以生成两类输出，取决于是否使用了 `--tab` 选项。

* 不使用 `--tab` 选项 ：mysqldump 会把 SQL 语句写入标准输出。该输出使用使用 `CREATE` 语句来备份数据库、表、存储例程等，用 `INSERT` 语句把数据加载到表中。输出可以保存成一个文件，随后需要时可用 mysql 来重新构建备份的对象。可以通过启用一些选项来定义 SQL 语句，从而选择要备份哪些对象。
* 使用 `--tab` 选项 ：mysqldump 会为每个备份的表格生成 **两个** 输出文件。
	* 一个文件名为 `tbl_name.txt`，是用 tab 分隔的文本文件，表中的每个记录对应文件中的一行
	* 另一个文件名是 `tbl_name.sql`，是由服务端使用 `CREATE TABLE` 语句生成的







#### 以 SQL 格式备份数据

mysqldump 默认会把 SQL 语句的输出写到标准输出中，需要时可以重定向到文件：

```bash
shell> mysqldump [arguments] > file_name
```

备份所有数据库：

```bash
shell> mysqldump --all-databases > dump.sql
```

备份指定数据库：

```bash
shell> mysqldump --databases db1 db2 db3 > dump.sql
shell> mysqldump --databases test > dump.sql
shell> mysqldump test > dump.sql
```

备份指定表：

```bash
shell> mysqldump test t1 t3 t7 > dump.sql
```

`test` 为数据库，t1、t2、t3 为表。

`--databases` 选项后面跟的所有名字都会当作数据库名字来对待。如果不用该选项，mysqldump 会把其后的第一个名字作为数据库名字，其后的作为表的名字。如果只有一个数据库，可以省略 `--databases`。

如果使用了 `--all-databases` 或 `--databases` 选项，mysqldump 为每个数据库创建备份前，会先使用 `CREATE DATABASE` 和 `USE` 语句，以确保在恢复数据时，如果不存在会先创建这些数据库，并将其做为默认数据库，以保证数据恢复的准确。







#### 恢复 SQL 格式备份

恢复由 mysqldump 备份的文件时，将其做为 mysql 客户端的输入。


##### 自动创建数据库

如果备份文件创建时使用了 `--all-databases` 或 `--databases` 选项，它会包含 `CREATE DATABASE` 和 `USE` 语句，因此恢复时无需指定将其加载到哪个数据库：

```bash
shell> mysql < dump.sql
```

另一种方法是进入 mysql 之后，用 `source` 命令来导入：

```sql
mysql> source dump.sql
```


##### 手动创建数据库

如果备份文件是单一数据库的备份，而且备份时没有使用 `CREATE DATABASE` 和 `USE` 语句，恢复时则需要先手动创建数据库：

```bash
shell> mysqladmin create db1
```

然后加载备份文件时，指定数据库：

```bash
shell> mysql db1 < dump.sql
```

另一种方法，进入 mysql 之后，创建数据库，设为默认数据库，导入备份文件：

```sql
mysql> CREATE DATABASE IF NOT EXISTS db1;
mysql> USE db1;
mysql> source dump.sql
```












#### 备份为分隔文本格式

调用 mysqldump 时，如果使用 `--tab=dir_name` 选项，它会把 dir_name 做为输出目录，然后把表格备份到该目录中，每个表格输出 `.sql` 和 `.txt` 两个文件。

```bash
shell> mysqldump --tab=/tmp db1
```

数据库 `db1` 的内容将会备份到 `/tmp` 目录中。

`.txt` 文件包含表数据，是由服务端写入的，因此其所有者为运行服务端的系统帐户。

服务端使用 `SELECT ... INTO OUTFILE` 语句来写入该文件，因此，恢复时必须有 `FILE` 权限才能进行此操作。

`.sql` 文件的所有者是备份时执行 mysqldump 的用户。

建议 `--tab` 选项只用于备份本地服务端，如果要用于备份远程服务端，该选项所指定的目录必须在服务端和客户端主机中同时存在，`.txt` 文件将被服务端保存在服务端主机上，而 `.sql` 文件将被　mysqldump 保存在客户端主机上。

针对 `mysqldump --tab` ，服务端默认会把表中的数据输入 `.txt` 文件中，每条记录写在一行，字段之间用 tab 分隔。字段值外面没有引号，每行由换行符做为结束符。


##### 自定义输出格式

mysqldump 支持以下选项：

`--fields-terminated-by=str` ：指定 **分隔字段** 的字符串，默认为 tab。

`--fileds-enclosed-by=char` ：用什么字符来 **包围字段值**，默认没有字符。

`--fields-optionaly-enclosed-by=char` ：用什么字符来 **包围非数字** 的字段值，默认没有字符。

`--fields-escaped-by=char` ：用什么字符来 **转义特殊字符**，默认没有转义。

`--lines-terminated-by=str` ：用什么字符来 **结束行**，默认为换行符。

使用这些选项来自定义输出的格式时，可能会需要在命令行中 **引用** 或 **转义** 某些字符，或者使用 **十六进制表示法**。

用双引号包围字段值：

在 Linux 中可以这样用：

```
--fields-enclosed-by='"'
```

在所有平台可以这样用：

```
--fields-enclosed-by=0x22
```

可以同时使用多个选项，如用逗号分隔字段值，用 `\r\n` 做为行的结束符：

```bash
shell> mysqldump --tab=/tmp --fields-terminated-by=, --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1
```











#### 恢复分隔文本格式的备份

对于使用 `mysqldump --tab` 生成的备份来说，每个表有两个文件：

`.sql` 文件就代表一个表，其中包含 `CREATE TABLE` 语句，`.txt` 文件包含了表的数据。

要想重新加载表，要把工作路径切换到输出目录，先用 mysql 来处理 `.sql` 文件，**生成一个空表**，再处理 `.txt` 文件，以便把数据 **导入** 表中。

```bash
shell> mysql db1 < t1.sql
shell> mysqlimport db1 t1.txt
```

另一种方法：

```sql
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1;
```

备份时使用了什么格式选项，恢复时也必须使用相同的选项，这样才能保证数据被正确恢复。
{: .notice--success}










#### `mysqldump` TIPS


##### 生成数据库的副本

```bash
shell> mysqldump db1 > dump.sql
shell> mysqladmin create db2
shell> mysql db2 < dump.sql
```

此时不要在 mysqldump 命令行中使用 `--databases` 选项，因为它会使得备份文件中包含 `USE db1`，这将会覆盖对 `db2` 的命名。


##### 把数据库从一台服务器复制到另一台

在服务器 1 上：

```bash
shell> mysqldump --databases db1 > dump.sql
```

把备份文件复制到服务器 2 中，然后在服务器 2 上：

```bash
shell> mysql < dump.sql
```


##### 备份保存的程序

>保存的程序：保存的流程、函数、触发器、事件。

有一些选项是用来控制 mysqldump 如何处理保存的程序的：

`--events` ：备份事件计划，默认禁用

`--routines` ：备份保存的流程和函数，默认禁用

`--triggers` ：备份表的触发器，默认启用，因此在备份表时，同时都会备份其中的触发器。

需要时，可以用 `--skip-events`、`--skip-routines`、`--skip-triggers` 来显式禁用这些选项。


##### 把表结构和内容分开备份

使用 `--no-data` 选项，可以让 mysqldump 不要复制表中的数据，备份文件只包含创建表的语句。

使用 `--no-create-info` 选项，可以让 mysqldump 在输出中不要使用创建表的语句，于是备份文件中只有表的数据。

```bash
shell> mysqldump --no-data test > dump-defs.sql
shell> mysqldump --no-create-info test > dump-data.sql
```

在备份文件中包含保存的例程及事件定义：

```bash
shell> mysqldump --no-data --routines --events test > dump-defs.sql
```


##### 用 mysqldump 来测试升级的兼容性

如果要进行 MySQL 升级，比较明智的做法是把新版本单独安装，与当前版本隔离开。然后从当前服务端把数据库及其对象的定义备份出来，将其加载到新版本中，以确认新版是否能正常工作。

备份当前服务端：

```bash
shell> mysqldump --all-databases --no-data --routines --events > dump-defs.sql
```

在新服务端：

```
shell> mysql < dump-defs.sql
```

备份文件不包含表的数据，因此处理起来非常快。不用等太久就能观察到是否有潜在的兼容性问题，备份文件处理期间，仔细查找是否有警告或错误信息。

在确认各种定义都被正确处理时，再把数据备份下来，加载到新服务端。

当前服务端：

```bash
shell> mysqldump --all-databases --no-create-info > dump-data.sql
```

新服务端：

```bash
shell> mysql < dump-data.sql
```







































## 用二进制日志进行时间点增量恢复

时间点恢复是指对某个时间点之后的数据变化进行恢复。这种恢复通常是在一个完整恢复之后进行的。时间点恢复将服务器的状态恢复到完整备份之后某个更近的时间点。

本小节的范例中，使用 mysql 客户端来处理由 mysqlbinlog 生成的二进制日志。如果你的二进制日志中含有 `\0` 字符，即空字符，不能直接用 mysql 来分析，需要启用 `--binary-mode` 选项。
{: .notice}








### 时间点恢复的原则



#### 确定二进制日志文件名

完整备份之后生成的累积备份保存在二进制日志中，时间点恢复是按照其中的信息来完成的。服务端启动时必须使用 `--log-bin` 选项才能生成二进制日志。

要想从二进制日志中恢复数据，必须了解当前的二进制日志文件的文件名和位置。服务端默认将其保存在数据目录中，但也可能使用 `--log-bin` 选项时指定了其他位置。

查看所有二进制日志列表：

```sql
mysql> SHOW BINARY LOGS;
```

查看当前使用的二进制日志：

```sql
mysql> SHOW MASTER STATUS;
```



#### 日志格式转换

mysqlbinlog 程序会把二进制日志文件中的事件从二进制格式 **转换** 为文本，然后这些事件才能被执行或查看。

通过 mysqlbinlog 的一些选项，可以基于事件的时间或其在日志中的位置，来选择日志中的特定部分。



#### 执行日志中的事件

执行日志中的事件可以重复这些对数据的操作，使得恢复某个时间跨度内的数据修改成为可能。

通过使用 mysql 客户端来处理 mysqlbinlog 的输出，来执行日志中的事件：

```bash
shell> mysqlbinlog binlog_files | mysql -u root -p
```



#### 查看日志

要想确定事件的时间或位置以选择部分日志，需要查看日志的内容，把 mysqlbinlog 的输出发送给支持翻页阅读的程序：

```bash
shell> mysqlbinlog binlog_files | more
```

或者，重定向到文件：

```bash
shell> mysqlbinlog binlog_files > tmpfile
```



#### 把日志保存为文件

在执行日志内容之前，先把日志另存为文件，然后删除一些不需要执行的内容，用该文件做为 mysql 的标准输入来执行日志。

```bash
shell> mysql -u root -p < tmpfile
```














### 处理多个日志文件

如果有多个二进制日志要执行，最安全的方法是使用一个连接一起来处理。

这种分别处理是不安全的：

```bash
shell> mysqlbinlog binlog.000001 | mysql -u root -p # DANGER!!
shell> mysqlbinlog binlog.000002 | mysql -u root -p # DANGER!!
```

这是用不同的连接来处理多个日志。如果第一个日志中包含了 `CREATE TEMPORARY TABLE` 语句，第二个日志中含有使用这个临时表的语句，这种方法就会出问题。因为第一个 mysql 进程结束时，服务端会删除临时表，第二个 mysql 进程是找不到这个临时表的。

为了避免这样的问题发生，一定要使用同一个连接来执行所有的日志：

```bash
shell> mysqlbinlog binlog.000001 binlog.000002 | mysql -u root -p
```

另一个方法是把所有日志写到一个文件中，然后处理这个文件：

```bash
shell> mysqlbinlog binlog.000001 >  /tmp/statements.sql
shell> mysqlbinlog binlog.000002 >> /tmp/statements.sql
shell> mysql -u root -p -e "source /tmp/statements.sql"
```











### 包含 GTID 的日志

如果二进制日志中含有 GTID（Global Transaction Identifier），在用 mysqlbinlog 读取日志时要使用 `--skip-gtids` 选项：

```bash
shell> mysqlbinlog --skip-gtids binlog.000001 >  /tmp/dump.sql
shell> mysqlbinlog --skip-gtids binlog.000002 >> /tmp/dump.sql
shell> mysql -u root -p -e "source /tmp/dump.sql"
```











### 使用事件时间来恢复

在确定了要恢复的日志中哪个时间段的内容后，用 `--start-datetime` 来指定开始时间，用  `--stop-datetime` 指定结束时间。需要使用 `DATETIME` 格式来表示时间，即 `YYYY-MM-DD HH:MM:SS`。

假设在 2005年4月20日 上午 10 点整，执行了一条 SQL 语句，导致一个大表被删除，要想恢复这个表及其中的数据，可以先恢复前一晚上的备份，然后执行以下命令：

```bash
shell> mysqlbinlog --stop-datetime="2005-04-20 9:59:59" \
         /var/log/mysql/bin.123456 | mysql -u root -p
```

该命令会恢复该时间点之前的所有数据。如果直到几个小时之后才发现错误语句的执行，可能还需要恢复在此之后发生的操作：

```bash
shell> mysqlbinlog --start-datetime="2005-04-20 10:01:00" \
         /var/log/mysql/bin.123456 | mysql -u root -p
```

至此，原则上就可以把 10 点之前的数据，以及 10 点以后的数据全部恢复了。













### 使用事件位置来恢复

可以指定日志中两个位置之间的部分来恢复，使用选项 `--start-position` 和 `--stop-position` 来指定起始和结束的位置。工作原理与用时间点恢复差不多。这种方式可以更精确地选择恢复哪部分日志，尤其是错误语句执行的同一时刻发生了许多事务的情况下。要想确定位置编号，先在在大概时间范围内运行 mysqlbinlog，重定向到文件中仔细检查：

```bash
shell> mysqlbinlog --start-datetime="2005-04-20 9:55:00" \
         --stop-datetime="2005-04-20 10:05:00" \
         /var/log/mysql/bin.123456 > /tmp/mysql_restore.sql
```

用文本编辑器打开 `.sql` 文件，查找事故语句，确定其在日志中的位置。位置标签为 `log_pos` ，后面跟一个数字，即位置编号。在恢复之前的备份文件之后，再用位置编号来处理二进制日志文件：

```bash
shell> mysqlbinlog --stop-position=368312 /var/log/mysql/bin.123456 \
         | mysql -u root -p
```

该语句恢复该位置之前的所有事务。


```bash
shell> mysqlbinlog --start-position=368315 /var/log/mysql/bin.123456 \
         | mysql -u root -p
```

该语句恢复该位置之后的所有事务。

因为在记录每条语句之前， mysqlbinlog 的输出中会包含 `SET TIMSTAMP` 语句，因此恢复的数据和相关的日志会反映事务执行的原始时间。




























## MyISAM 表的维护及灾难恢复








### 使用 `myisamchk` 进行崩溃恢复

运行 mysqld 时默认是禁用外部锁的，当 mysqld 正在使用某个表时，无法同时使用 `myisamchk` 来对这个表进行检查，必须先执行 `mysqladmin flush-tables`，然后再检查。如果不能做到这一点，那检查表的时候就必须停止 mysqld 的运行。

如果服务端运行时启用了外部锁，就可以在任何时候使用 `myisamchk` 来对表进行检查了。这种情况下，如果检查期间，服务端尝试更新同一个表，它会等待，直到检查结束才继续其更新。

如果要使用 `myisamchk` 来修复或优化表，则 **必须** 要确保 mysqld 服务端没有使用该表。如果没有停止运行 mysqld，至少也要先运行 `mysqladmin flush-tables`，然后再运行 `myisamchk`。如果服务端和 `myisamchk` 同时访问这个表，有可能会损坏该表。

进行崩溃恢复时，一定要记住：数据库中的每个 MyISAM 表都对应数据库目录中的三个文件，`.frm` 文件用于保存表的定义，`.MYD` 文件为数据文件，`.MYI` 为索引文件。崩溃通常会导致数据文件和索引文件损坏。

myisamchk 会逐行地生成数据文件的副本，修复之后它会删除原数据文件，把新生成的文件重命名为原数据文件。

如果使用 `--quick` 选项，myisamchk 就不会生成临时的数据文件，它会认为数据文件没有损坏，只生成一个新的索引文件。这种做法比较安全，因为 myisamchk 会自动检测数据文件是否损坏，如果损坏，会退出。

还可以使用 `--quick` 选项两次，此时，myisamchk 遇到错误不会退出，而会尝试通过修改数据文件来解决。只有当可用磁盘空间不多时才建议使用两次该选项。但在修复之前，还是应该把表备份一下。














### 如何检测 MyISAM 表的错误

要想检查 MyISAM 表，可用以下命令：



#### `myisamchk tbl_name`

该命令会找到 99.99% 的错误，它找不到的是只涉及数据文件的错误，这种很少见。

如果要检查一个表，通常应该不用选项，直接运行 mysiamchk，或只用 `-s` 选项，安静模式。



#### `myisamchk -m tbl_name`

该命令会找到 99.99% 的错误。它首先会检查所有的索引条目，然后检查所有的行，它会为行中所有的键值计算一个校验码，确认该校验码与索引树中各键的校验码相匹配。



#### `myisamchk -e tbl_name`

`-e` 表示 extended check。该命令会对所有数据进行一个彻底的检查

它会对每个键都进行读测试，以确认它们都指向正确的记录。如果表很大，索引很多，这可能会需要很长时间。

myisamchk 通常在发现第一个错误时会暂停，如果要获得更多的信息，可以加一个  `-v`  选项。



#### `myisamchk -e -i tbl_name`

与上一个命令类似，但 `-i` 选项告诉 myisamchk 打印额外的统计信息。















### 如何修复 MyISAM 表

表损坏的症状，可以是查询被意外取消，以及各类错误，如：

* Can't find file tbl_name.MYI (Errcode: nnn)
* Unexpected end of file
* Record file is crashed
* Got error nnn from table handler

nnn 代表错误编号，通过 `perror nnn` 可以查看更多关于该错误的信息。

```bash
shell> perror 126 127 132 134 135 136 141 144 145
MySQL error code 126 = Index file is crashed
MySQL error code 127 = Record-file is crashed
MySQL error code 132 = Old database file
MySQL error code 134 = Record was already deleted (or record file crashed)
MySQL error code 135 = No more room in record file
MySQL error code 136 = No more room in index file
MySQL error code 141 = Duplicate unique key or constraint on write or update
MySQL error code 144 = Table is crashed and last repair failed
MySQL error code 145 = Table was marked as crashed and should be repaired
```


#### 表空间不够用

其中，编号为 135 和 136 的错误，无法仅通过简单的修复来解决。必须使用 `ALTER TABLE` 来提升最大行数和平均行长度：

```sql
ALTER TABLE tbl_name MAX_ROWS=xxx AVG_ROW_LENGTH=yyy;
```

如果不知道当前的设置，用 `SHOW CREATE TABLE` 查看。



#### 其它错误

对于其它的错误，必须对表进行修复。myisamchk 通常可以检测并修复多数错误。

开始之前，把工作目录切换到数据库目录，并检查表文件的权限。确保其对运行 mysqld 的用户及当前用户是可读的。如果要修改文件，还需要可写。

开始修复表之前，需要先停止运行 mysqld 服务端。如果在远程服务器上运行 `mysqladmin shutdown`，在 mysqladmin 返回之后，mysqld 服务端还会继续运行一段时间，直到所有运行中的语句停止运行，所有发生变化的索引全部冲洗到磁盘中，才会彻底停止。

修复的过程主要有三个阶段：


##### 第一步：检查表

运行 `myisamchk *.MYI`。

如果时间充足，则运行 `myisamchk -e *.MYI`。

用 `-s` 隐藏不必要的信息。

如果 mysqld 已经停止运行，应该使用 `--update-state` 选项，myisamchk 会把表标记为 “已检测”。

如果 myisamchk 发现了某些表的错误，跳转到第二步。

检查如果遇到意外错误，如 `out of memory` 等，或 myisamchk 崩溃了，跳转到第三步。


##### 第二步：简单安全地修复

首先，用 `myisamchk -r -q tbl_name` 尝试一下，`-r -q` 表示快速恢复模式。

该模式会尝试在不修改数据文件的情况下修复索引文件。如果数据文件是完整的，该有的都有，而且删除链接都指向数据文件正确的位置，该模式应该会修复表。否则进入以下流程：

* 为数据文件做个备份
* 运行 `myisamchk -r tbl_name`，会把错误的行和删除的行从数据文件中清除掉，然后重建索引文件
* 如果上步失败，则运行 `myisamchk --safe-recover tbl_name`，安全恢复模式会用一个较老的恢复办法，能处理一些普通恢复模式无法处理的问题，但更费时间

运行 myisamchk 时，如果希望修复操作能更快一些，可以把变量 `sort_buffer_size` 和 `key_buffer_size` 的值设置为可用内存的 25% 左右。
{: .notice}

修复期间如果遇到意外错误，如 `out of memory` 等，或 myisamchk 崩溃了，跳转到第三步。


##### 第三步：难度大的修复

如果索引文件的前 16KB 被破坏，或包含错误信息，或索引文件丢失，才会第这一步。此时，很有必要重新创建一个索引文件：

* 把数据文件移动到安全的位置
* 用表格描述文件来创建新的空的数据文件和索引文件：

```bash
shell> mysql db_name
```

```sql
mysql> SET autocommit=1;
mysql> TRUNCATE TABLE tbl_name;
mysql> quit
```

* 把原数据文件复制到新数据文件中，同时建议保存原数据文件副本，以备不时之需。

如果使用了主从复制，应该先将其暂停，然后再进行上面的操作。因为涉及到文件系统的操作，这些不会保存到 MySQL 日志中。
{: .notice--warning}

返回第二步，`myisamchk -r -q` 此时应该能正常进行了。

也可以使用 `REPAIRE TABLE tbl_name USE_FRM` 语句，会自动进行整个流程。
















### MyISAM 表的优化

若要合并零碎的行，并消除因删除或更新行导致的空间浪费，请在恢复模式下运行 myisamchk：

```bash
shell> myisamchk -r tbl_name
```

使用 `OPTIMIZE TABLE` 语句，也能以同样的方式优化表格，该语句会修复表格，并对键进行分析，还会排序索引树，以便键的查找能更快速。
















### 设置 MyISAM 表维护计划

经常对表格进行检查是非常有必要的，以免出现问题造成措手不及。



#### 方法一

检查 MyISAM 表格的一种方法是使用 `CHECK TABLE` 和 `REPAIR TABLE` 语句。



#### 方法二

另一种方法是使用 myisamchk，如果是用于维护，可使用静默模式，即开启 `-s` 选项，只有发生错误时才会显示信息。



#### 方法三

还可以考虑在启动服务端时启用 `--myisam-recover-options` 选项，以启用对 MyISAM 表的自动检查。假如在更新期间，如果重启系统了，通常需要先检查一下表，然后再开始使用。



#### 方法四

使用 `cron` 来添加计划任务：

```bash
35 0 * * 0 /path/to/myisamchk --fast --silent /path/to/datadir/*/*.MYI
```

如果观察一段时间发现很少出错，可以考虑适当减小检查的频率。

通常来说，MySQL 的表不太需要维护。

如果对 MyISAM 表进行大量的更新，如使用动态大小的行（含有 `VARCHAR`、`BLOB`、`TEXT` 字段的表），或某些表中有许多被删除的行，时不时地需要整理碎片以清理表空间，这种情况下可以使用 `OPTIMIZE TABLE` 来处理这些表。

或者，如果可以把 mysqld 服务端停止一段时间，切换到数据目录，然后使用以下命令：

```bash
shell> myisamchk -r -s --sort-index --myisam_sort_buffer_size=16M */*.MYI
```
