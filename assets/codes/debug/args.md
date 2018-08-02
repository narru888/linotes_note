---
toc: true
toc_label: "参数调用"
toc_icon: "code"
title: "参数调用"
tag: [shell，bash，]
categories: "codes"
classes: wide
excerpt: "调试：脚本调用时使用的参数"
header:
  overlay_image: /assets/images/header/backup.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---




#### 测试脚本被调用的参数数量是否正确


```
E_WRONG_ARGS=65
script_parameters="-a -h -m -z"
#                  -a = all, -h = help, 等等.

if [ $# -ne $Number_of_expected_args ]
then
	echo "Usage: `basename $0` $script_parameters"
	# `basename $0` 是这个脚本的文件名.
	exit $E_WRONG_ARGS
fi
```
