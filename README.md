## 时时科技 增量包合并工具
### 安装须知
- 电脑上必须有node环境
- 使用node命令进行全局安装： npm install @kjts20/pdip-merge

### 使用方法
#### 切换到源文件工作目录
#### 执行: ssMerge [增量包路径]
比如： ssmerge ./test.zip

### 增量包的格式
```
|- .MANIFEST  清单文件
|- root       项目根目录
   |- src
       |-test.txt      
       |-test2.txt      
```
### 清单文件
```
{
    "DELETE": [
        "test.ext"
    ],
    "ADD":[
        "src/test.txt"
    ],
    "UPDATE":[
        "src/test2.txt"
    ]
}
```
