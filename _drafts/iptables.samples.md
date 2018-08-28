etho 接外网──ppp0
eth1 接内网──192.168.0.0/24


#!/bin/sh
#
modprobe ipt_MASQUERADE
modprobe ip_conntrack_ftp
modprobe ip_nat_ftp
iptables -F
iptables -t nat -F
iptables -X
iptables -t nat -X
###########################INPUT键###################################
iptables -P INPUT DROP
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -p tcp -m multiport --dports 110,80,25 -j ACCEPT
iptables -A INPUT -p tcp -s 192.168.0.0/24 --dport 139 -j ACCEPT
#允许内网samba,smtp,pop3,连接
iptables -A INPUT -i eth1 -p udp -m multiport --dports 53 -j ACCEPT
#允许dns连接
iptables -A INPUT -p tcp --dport 1723 -j ACCEPT
iptables -A INPUT -p gre -j ACCEPT
#允许外网vpn连接
iptables -A INPUT -s 192.186.0.0/24 -p tcp -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -i ppp0 -p tcp --syn -m connlimit --connlimit-above 15 -j DROP
#为了防止DOS太多连接进来,那么可以允许最多15个初始连接,超过的丢弃
iptables -A INPUT -s 192.186.0.0/24 -p tcp --syn -m connlimit --connlimit-above 15 -j DROP
#为了防止DOS太多连接进来,那么可以允许最多15个初始连接,超过的丢弃
iptables -A INPUT -p icmp -m limit --limit 3/s -j LOG --log-level INFO --log-prefix "ICMP packet IN: "
iptables -A INPUT -p icmp -j DROP
#禁止icmp通信-ping 不通
iptables -t nat -A POSTROUTING -o ppp0 -s 192.168.0.0/24 -j MASQUERADE
#内网转发
iptables -N syn-flood
iptables -A INPUT -p tcp --syn -j syn-flood
iptables -I syn-flood -p tcp -m limit --limit 3/s --limit-burst 6 -j RETURN
iptables -A syn-flood -j REJECT
#防止SYN攻击 轻量
#######################FORWARD链###########################
iptables -P FORWARD DROP
iptables -A FORWARD -p tcp -s 192.168.0.0/24 -m multiport --dports 80,110,21,25,1723 -j ACCEPT
iptables -A FORWARD -p udp -s 192.168.0.0/24 --dport 53 -j ACCEPT
iptables -A FORWARD -p gre -s 192.168.0.0/24 -j ACCEPT
iptables -A FORWARD -p icmp -s 192.168.0.0/24 -j ACCEPT
#允许 vpn客户走vpn网络连接外网
iptables -A FORWARD -m state --state ESTABLISHED,RELATED -j ACCEPT
iptables -I FORWARD -p udp --dport 53 -m string --string "tencent" -m time --timestart 8:15 --timestop 12:30 --days Mon,Tue,Wed,Thu,Fri,Sat  -j DROP
#星期一到星期六的8:00-12:30禁止qq通信
iptables -I FORWARD -p udp --dport 53 -m string --string "TENCENT" -m time --timestart 8:15 --timestop 12:30 --days Mon,Tue,Wed,Thu,Fri,Sat  -j DROP
#星期一到星期六的8:00-12:30禁止qq通信
iptables -I FORWARD -p udp --dport 53 -m string --string "tencent" -m time --timestart 13:30 --timestop 20:30 --days Mon,Tue,Wed,Thu,Fri,Sat  -j DROP
iptables -I FORWARD -p udp --dport 53 -m string --string "TENCENT" -m time --timestart 13:30 --timestop 20:30 --days Mon,Tue,Wed,Thu,Fri,Sat  -j DROP
#星期一到星期六的13:30-20:30禁止QQ通信
iptables -I FORWARD -s 192.168.0.0/24 -m string --string "qq.com" -m time --timestart 8:15 --timestop 12:30 --days Mon,Tue,Wed,Thu,Fri,Sat  -j DROP
#星期一到星期六的8:00-12:30禁止qq网页
iptables -I FORWARD -s 192.168.0.0/24 -m string --string "qq.com" -m time --timestart 13:00 --timestop 20:30 --days Mon,Tue,Wed,Thu,Fri,Sat  -j DROP
#星期一到星期六的13:30-20:30禁止QQ网页
iptables -I FORWARD -s 192.168.0.0/24 -m string --string "ay2000.net" -j DROP
iptables -I FORWARD -d 192.168.0.0/24 -m string --string "宽频影院" -j DROP
iptables -I FORWARD -s 192.168.0.0/24 -m string --string "色情" -j DROP
iptables -I FORWARD -p tcp --sport 80 -m string --string "广告" -j DROP
#禁止ay2000.net，宽频影院，色情，广告网页连接 ！但中文 不是很理想
iptables -A FORWARD -m ipp2p --edk --kazaa --bit -j DROP
iptables -A FORWARD -p tcp -m ipp2p --ares -j DROP
iptables -A FORWARD -p udp -m ipp2p --kazaa -j DROP
#禁止BT连接
iptables -A FORWARD -p tcp --syn --dport 80 -m connlimit --connlimit-above 15 --connlimit-mask 24 -j DROP
#只允许每组ip同时15个80端口转发
#######################################################################
sysctl -w net.ipv4.ip_forward=1 &>/dev/null
#打开转发
#######################################################################
sysctl -w net.ipv4.tcp_syncookies=1 &>/dev/null
#打开 syncookie （轻量级预防 DOS 攻击）
sysctl -w net.ipv4.netfilter.ip_conntrack_tcp_timeout_established=3800 &>/dev/null
#设置默认 TCP 连接痴呆时长为 3800 秒（此选项可以大大降低连接数）
sysctl -w net.ipv4.ip_conntrack_max=300000 &>/dev/null
#设置支持最大连接树为 30W（这个根据你的内存和 iptables 版本来，每个 connection 需要 300 多个字节）
#######################################################################
iptables -I INPUT -s 192.168.0.50 -j ACCEPT
iptables -I FORWARD -s 192.168.0.50 -j ACCEPT
#192.168.0.50是我的机子，全部放行！
############################完









### 限制匹配的用途：




1、限制特定包传入速度

参数 -m limit --limit

范例 iptables -A INPUT -m limit --limit 3/hour

说明 用来比对某段时间内封包的平均流量，上面的例子是用来比对：每小时平均流量是否超过一次 3 个封包。 除了每小时平均

次外，也可以每秒钟、每分钟或每天平均一次，默认值为每小时平均一次，参数如后： /second、 /minute、/day。 除了进行封

数量的比对外，设定这个参数也会在条件达成时，暂停封包的比对动作，以避免因骇客使用洪水攻击法，导致服务被阻断。

2、限制特定包瞬间传入的峰值

参数 --limit-burst

范例 iptables -A INPUT -m limit --limit-burst 5

说明 用来比对瞬间大量封包的数量，上面的例子是用来比对一次同时涌入的封包是否超过 5 个（这是默认值），超过此上限的封

将被直接丢弃。使用效果同上。

3、使用--limit限制ping的一个例子

限制同时响应的 ping (echo-request) 的连接数

限制每分只接受一个 icmp echo-request 封包（注意：当已接受1个icmp echo-request 封包后，

iptables将重新统计接受之后的一秒内接受的icmp echo-request 封包的个数，此刻为0个，所以它会继续接受icmp echo-request包，

出现的结果是你在1分钟时间内将看到很多

Reply from 192.168.0.111: bytes=32 time<1ms TTL=64

Reply from 192.168.0.111: bytes=32 time<1ms TTL=64

Reply from 192.168.0.111: bytes=32 time<1ms TTL=64

Reply from 192.168.0.111: bytes=32 time<1ms TTL=64

Reply from 192.168.0.111: bytes=32 time<1ms TTL=64

Reply from 192.168.0.111: bytes=32 time<1ms TTL=64

Reply from 192.168.0.111: bytes=32 time<1ms TTL=64

Reply from 192.168.0.111: bytes=32 time<1ms TTL=64

响应结果，若你同时开好几个ping窗口，你会发现任一时刻只有一个会有响应//--limit 1/m 所限制）

#iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/m --limit-burst 1 -j ACCEPT

#iptables -A INPUT -p icmp --icmp-type echo-request -j DROP

--limit 1/s 表示每秒一次; 1/m 则为每分钟一次

--limit-burst 表示允许触发 limit 限制的最大次数 (预设 5)

4、用户自定义使用链

上面例子的另一种实现方法：

#iptables -N pinglimit

#iptables -A pinglimit -m limit --limit 1/m --limit-burst 1 -j ACCEPT

#iptables -A pinglimit -j DROP

#iptables -A INPUT -p icmp --icmp-type echo-request -j pinglimit

5、防范 SYN-Flood 碎片攻击

#iptables -N syn-flood

#iptables -A syn-flood -m limit --limit 100/s --limit-burst 150 -j RETURN

#iptables -A syn-flood -j DROP

#iptables -I INPUT -j syn-flood
