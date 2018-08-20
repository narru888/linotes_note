---
toc: true
toc_label: "MySQL 索引背后的数据结构及算法原理"
toc_icon: "copy"
title: "MySQL 索引背后的数据结构及算法原理"
tags: mysql 索引 数据结构 算法 B-Tree B+Tree
categories: "mysql"
classes: wide
excerpt: ""
header:
  overlay_image: /assets/images/header/mysql.jpg
  overlay_filter: rgba(0, 0, 0, 0.8)
---





本节主要内容转自张洋的博客[《 MySQL 索引背后的数据结构及算法原理 》](http://blog.codinglabs.org/articles/theory-of-mysql-index.html)，在此感谢！

## 数据结构与算法基础



### 索引的本质

索引，Index。

MySQL 官方对索引的定义为：索引是帮助 MySQL 高效获取数据的 **数据结构**。
{: .notice}

我们知道，数据库查询是数据库的最主要功能之一。我们都希望查询数据的速度能尽可能的快，因此数据库系统的设计者会从查询算法的角度进行优化。最基本的查询算法当然是顺序查找（linear search），这种复杂度为O(n)的算法在数据量很大时显然是糟糕的，好在计算机科学的发展提供了很多更优秀的查找算法，例如二分查找（binary search）、二叉树查找（binary tree search）等。如果稍微分析一下会发现，每种查找算法都只能应用于特定的数据结构之上，例如二分查找要求被检索数据有序，而二叉树查找只能应用于二叉查找树上，但是数据本身的组织结构不可能完全满足各种数据结构（例如，理论上不可能同时将两列都按顺序进行组织），所以，在数据之外，数据库系统还维护着满足特定查找算法的数据结构，这些数据结构以某种方式引用（指向）数据，这样就可以在这些数据结构上实现高级查找算法。这种数据结构，就是索引。
