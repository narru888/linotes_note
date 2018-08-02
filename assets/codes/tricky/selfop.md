---
toc: true
toc_label: "对脚本文件自身的操作"
toc_icon: "code"
title: "对脚本文件自身的操作"
tag: [shell，bash，]
categories: "codes"
classes: wide
excerpt: "对脚本文件自身的操作，如删除自身"
header:
  overlay_image: /assets/images/header/backup.jpg
  overlay_filter: rgba(0, 0, 0, 0.6)
---



#### 删除脚本自己

通过把首行的解释器换成 `/bin/rm` 来删除自己，后面的行都不会被解释。

```
#!/bin/rm
# 自删除脚本.

# 当你运行这个脚本时, 基本上什么都不会发生. . . 当然这个文件消失不见了.

WHATEVER=65

echo "This line will never print (betcha!)."

exit $WHATEVER  # 不要紧, 脚本是不会在这退出的.
```
