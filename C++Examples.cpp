#include <iostream>
#include <cstdio>
using namespace std;
int main()
{
    int a = 3;
    printf("I have %d dollars.\n", a); //%d调用了,后的变量a，\n为换行符
    printf("I want to buy:\n a book.");
    int b, c;
    scanf("%d%d", &b, &c); //从输入的东西中提取两个值并赋予b和c
    printf("%d", a + b);
    char d;
    scanf("%c", &d);  //%c表示读入一个字符且不会跳过空格
    return 0;
}