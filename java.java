import java.util.Scanner;//导入Scanner类

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);//生成Scanner对象
        while (sc.hasNextInt()) { 
            int a = sc.nextInt(); //读下一个整型字符串
            int b = sc.nextInt();
            System.out.println(a + b);
        }
        sc.close(); //用完后关闭扫描器是一个好的习惯
    }
}
