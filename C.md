# C语言笔记

## 数据类型

### 基本类型

#### 整数类型

| 类型           | 储存大小 | 值范围                                               |
| -------------- | -------- | ---------------------------------------------------- |
| char           | 1字节    | -128 到 127 或 0 到 255                              |
| unsigned char  | 1字节    | 0 到 255                                             |
| signed char    | 1字节    | -128 到 127                                          |
| int            | 2或4字节 | -32,768 到 32,767 或 -2,147,483,648 到 2,147,483,647 |
| unsigned int   | 2或4字节 | 0 到 65,535 或 0 到 4,294,967,295                    |
| short          | 2字节    | -32,768 到 32,767                                    |
| unsigned short | 2 字节   | 0 到 65,535                                          |
| long           | 4 字节   | -2,147,483,648 到 2,147,483,647                      |
| unsigned long  | 4 字节   | 0 到 4,294,967,295                                   |

```c
#include <stdio.h>
#include <limits.h>
int main()
{
    printf("int类型的大小为：%lu\n", sizeof(int));
    return 0;
}
```

#### 浮点类型

| float       | 4 字节  | 1.2E-38 到 3.4E+38     | 6 位小数  |
| ----------- | ------- | ---------------------- | --------- |
| double      | 8 字节  | 2.3E-308 到 1.7E+308   | 15 位小数 |
| long double | 16 字节 | 3.4E-4932 到 1.1E+4932 | 19 位小数 |

#### void类型

| 序号 | 类型与描述                                                   |
| :--- | :----------------------------------------------------------- |
| 1    | **函数返回为空** C 中有各种函数都不返回值，或者您可以说它们返回空。不返回值的函数的返回类型为空。例如 **void exit (int status);** |
| 2    | **函数参数为空** C 中有各种函数不接受任何参数。不带参数的函数可以接受一个 void。例如 **int rand(void);** |
| 3    | **指针指向 void** 类型为 void * 的指针代表对象的地址，而不是类型。例如，内存分配函数 **void \*malloc( size_t size );** 返回指向 void 的指针，可以转换为任何数据类型。 |

## 变量

### 变量种类

基本数据类型、美剧、指针、数组、结构、共用体等

### 变量的定义

变量的定义就是告诉编译器在何处创建变量的储存以及如何创建变量的储存。变量的定义指定一个数据类型并包含想要定义为该类型的多个变量的列表。也可以设定初值，当不带初始化时变量会被饮食的初始化为NULL。

```c
int i, j, k;
char c, ch;
float f, salary;
byte z = 22;
int a = 3, b = 4;
```

### 变量的声明

变量声明像编译器保证变量以指定类型和名称存在，这样编译器虽然不知道完整细节也可以继续编译。变量声明只有在编译时有意义，在程序链接时需要实际的变量声明。变量声明有两种情况。

1. 需要建立储存空间的变量声明与定义。
2. 不需要建立储存空间的仅为变量声明而暂未定义。

```c
int i;			// 既声明又定义，建立了储存空间
extern int i;	// 仅为声明，未定义，未建立储存空间，用于在函数内部声明定义在函数外部的变量
```

### 实例

```c
#include <stdio.h>
 
// 函数外定义变量 x 和 y
int x;
int y;
int addtwonum()
{
    // 函数内声明变量 x 和 y 为外部变量
    extern int x;
    extern int y;
    // 给外部变量（全局变量）x 和 y 赋值
    x = 1;
    y = 2;
    return x+y;
}
 
int main()
{
    int result;
    // 调用函数 addtwonum
    result = addtwonum();
    
    printf("result 为: %d",result);
    return 0;
}
```

## 常量

### 定义常量

#### #define预处理器

```c
#include <stdio.h>
 
#define LENGTH 10   
#define WIDTH  5
#define NEWLINE '\n'
 
int main()
{
 
   int area;  
  
   area = LENGTH * WIDTH;
   printf("value of area : %d", area);
   printf("%c", NEWLINE);
 
   return 0;
}
```

#### const关键字

```c
#include <stdio.h>
 
int main()
{
   const int  LENGTH = 10;
   const int  WIDTH  = 5;
   const char NEWLINE = '\n';
   int area;  
   
   area = LENGTH * WIDTH;
   printf("value of area : %d", area);
   printf("%c", NEWLINE);
 
   return 0;
}
```





## 库函数

### printf()

#### 描述

```c
printf("<格式化字符串>", <参量表>);
```

#### 声明

```c
int printf(const char *format, ...)
```

#### 参数

* 格式化字符串内包含了要被写入到标准输出的文本，它可以包含嵌入的format标签用于被后面跟着的参数指定的值替换掉。format标签格式为` %[format][flags][width][.precision][length]specifier `

| format格式字符 | 意义                                       |
| :------------- | :----------------------------------------- |
| d              | 以十进制形式输出带符号整数(正数不输出符号) |
| o              | 以八进制形式输出无符号整数(不输出前缀0)    |
| x,X            | 以十六进制形式输出无符号整数(不输出前缀Ox) |
| u              | 以十进制形式输出无符号整数                 |
| f              | 以小数形式输出单、双精度实数               |
| e,E            | 以指数形式输出单、双精度实数               |
| g,G            | 以%f或%e中较短的输出宽度输出单、双精度实数 |
| c              | 输出单个字符                               |
| s              | 输出字符串                                 |
| p              | 输出指针地址                               |
| lu             | 32位无符号整数                             |
| llu            | 64位无符号整数                             |

| flags（标识） | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| -             | 在给定的字段宽度内左对齐，默认是右对齐（参见 width 子说明符）。 |
| +             | 强制在结果之前显示加号或减号（+ 或 -），即正数前面会显示 + 号。默认情况下，只有负数前面会显示一个 - 号。 |
| 空格          | 如果没有写入任何符号，则在该值前面插入一个空格。             |
| #             | 与 o、x 或 X 说明符一起使用时，非零值前面会分别显示 0、0x 或 0X。 与 e、E 和 f 一起使用时，会强制输出包含一个小数点，即使后边没有数字时也会显示小数点。默认情况下，如果后边没有数字时候，不会显示显示小数点。 与 g 或 G 一起使用时，结果与使用 e 或 E 时相同，但是尾部的零不会被移除。 |
| 0             | 在指定填充 padding 的数字左边放置零（0），而不是空格（参见 width 子说明符）。 |

| width（宽度） | 描述                                                         |
| :------------ | :----------------------------------------------------------- |
| (number)      | 要输出的字符的最小数目。如果输出的值短于该数，结果会用空格填充。如果输出的值长于该数，结果不会被截断。 |
| *             | 宽度在 format 字符串中未指定，但是会作为附加整数值参数放置于要被格式化的参数之前。 |

| .precision（精度） | 描述                                                         |
| :----------------- | :----------------------------------------------------------- |
| .number            | 对于整数说明符（d、i、o、u、x、X）：precision 指定了要写入的数字的最小位数。如果写入的值短于该数，结果会用前导零来填充。如果写入的值长于该数，结果不会被截断。精度为 0 意味着不写入任何字符。 对于 e、E 和 f 说明符：要在小数点后输出的小数位数。 对于 g 和 G 说明符：要输出的最大有效位数。 对于 s: 要输出的最大字符数。默认情况下，所有字符都会被输出，直到遇到末尾的空字符。 对于 c 类型：没有任何影响。 当未指定任何精度时，默认为 1。如果指定时不带有一个显式值，则假定为 0。 |
| .*                 | 精度在 format 字符串中未指定，但是会作为附加整数值参数放置于要被格式化的参数之前。 |

| length（长度） | 描述                                                         |
| :------------- | :----------------------------------------------------------- |
| h              | 参数被解释为短整型或无符号短整型（仅适用于整数说明符：i、d、o、u、x 和 X）。 |
| l              | 参数被解释为长整型或无符号长整型，适用于整数说明符（i、d、o、u、x 和 X）及说明符 c（表示一个宽字符）和 s（表示宽字符字符串）。 |
| L              | 参数被解释为长双精度型（仅适用于浮点数说明符：e、E、f、g 和 G）。 |

#### 返回值

如果成功返回写入的字符总数否则返回一个负数

### scanf()

#### 描述

```c
scanf("<格式化输入字符串>", <参量指针表>)
```

#### 声明

```c
int scanf(const char *format, ...)
```

#### 参数

格式化字符串内包含了要从标准输入流中输入的格式，它可以包含嵌入的format标签用于被后面跟着的参数指定的值替换掉。format标签格式为` %[*][width][modifiers]type `

| 参数      | 描述                                                         |
| :-------- | :----------------------------------------------------------- |
| *         | 这是一个可选的星号，表示数据是从流 stream 中读取的，但是可以被忽视，即它不存储在对应的参数中。 |
| width     | 这指定了在当前读取操作中读取的最大字符数。                   |
| modifiers | 为对应的附加参数所指向的数据指定一个不同于整型（针对 d、i 和 n）、无符号整型（针对 o、u 和 x）或浮点型（针对 e、f 和 g）的大小： h ：短整型（针对 d、i 和 n），或无符号短整型（针对 o、u 和 x） l ：长整型（针对 d、i 和 n），或无符号长整型（针对 o、u 和 x），或双精度型（针对 e、f 和 g） L ：长双精度型（针对 e、f 和 g） |
| type      | 一个字符，指定了要被读取的数据类型以及数据读取方式。具体参见下一个表格。 |

| 类型                   | 合格的输入                                                   | 参数的类型     |
| :--------------------- | :----------------------------------------------------------- | :------------- |
| %a、%A                 | 读入一个浮点值(仅 C99 有效)。                                | float *        |
| %c                     | 单个字符：读取下一个字符。如果指定了一个不为 1 的宽度 width，函数会读取 width 个字符，并通过参数传递，把它们存储在数组中连续位置。在末尾不会追加空字符。 | char *         |
| %d                     | 十进制整数：数字前面的 + 或 - 号是可选的。                   | int *          |
| %e、%E、%f、%F、%g、%G | 浮点数：包含了一个小数点、一个可选的前置符号 + 或 -、一个可选的后置字符 e 或 E，以及一个十进制数字。两个有效的实例 -732.103 和 7.12e4 | float *        |
| %i                     | 读入十进制，八进制，十六进制整数 。                          | int *          |
| %o                     | 八进制整数。                                                 | int *          |
| %s                     | 字符串。这将读取连续字符，直到遇到一个空格字符（空格字符可以是空白、换行和制表符）。 | char *         |
| %u                     | 无符号的十进制整数。                                         | unsigned int * |
| %x、%X                 | 十六进制整数。                                               | int *          |
| %p                     | 读入一个指针 。                                              |                |
| %[]                    | 扫描字符集合 。                                              |                |
| %%                     | 读 % 符号。                                                  |                |

#### 返回值

如果成功返回成功匹配和赋值的个数，如果达到文件末尾或者发生读错误则返回EOF。

### fopen()

#### 声明

```c
FILE *fopen(const char *filename, const char *mode)
```

#### 参数

* filename 一个文件名的字符串
* mode 指文件访问格式

| 模式 | 描述                                                         |
| :--- | :----------------------------------------------------------- |
| "r"  | 打开一个用于读取的文件。该文件必须存在。                     |
| "w"  | 创建一个用于写入的空文件。如果文件名称与已存在的文件相同，则会删除已有文件的内容，文件被视为一个新的空文件。 |
| "a"  | 追加到一个文件。写操作向文件末尾追加数据。如果文件不存在，则创建文件。 |
| "r+" | 打开一个用于更新的文件，可读取也可写入。该文件必须存在。     |
| "w+" | 创建一个用于读写的空文件。                                   |
| "a+" | 打开一个用于读取和追加的文件。                               |

#### 返回值

fopen()返回一个FILE指针，其他情况返回NULL，且设置全局面两errno来标识错误。

#### 实例

```c
#include <stdio.h>
#include <stdlib.h>

int main()
{
   FILE * fp;

   fp = fopen ("file.txt", "w+");
   fprintf(fp, "%s %s %s %d", "We", "are", "in", 2014);
   
   fclose(fp);
   
   return(0);
}
```

```c
#include <stdio.h>

int main ()
{
   FILE *fp;
   int c;
  
   fp = fopen("file.txt","r");
   while(1)
   {
      c = fgetc(fp);
      if( feof(fp) )
      { 
          break ;
      }
      printf("%c", c);
   }
   fclose(fp);
   return(0);
}
```

