## Docker简介

Docker是一个使用Go语言开发的操作系统层级的虚拟化技术，与传统VM虚拟机不同的是，Docker并没有虚拟出来一套独立硬件在其上运行一套完整的操作系统，而是使用Linux内核的cgroup，namespace，以及AUFS类的Union FS等技术对在其上运行的进程与系统进程进行隔离的容器。

Docker的优势在于没有像VM那样运行完整的操作系统，Docker容器运行开销极小，容器内程序运行速度接近在本地主机直接运行的速度，由于容器直接运行与主机内核，启动速度在几秒之内。Docker镜像内集成了应用运行所依赖的环境，让开发者的程序能以在各种平台上保证运行环境的一致性，从而节省重复的环境配置时间。

## Docker基本概念

### Image 镜像

Docker镜像是一个被打包好的最小文件系统，它包含容器运行时所需要的程序、库、资源、配置和参数。镜像内不包含任何动态数据，在构件为容器之后原镜像文件也不会被修改。

### Container 容器

镜像和容器可以简单理解为类和对象，容器是镜像构建出的运行的实体，它可以被任意创建、启动、停止、删除、暂停，不影响原镜像文件。容器被删除，其所有运行期间产生的数据也会被删除。所以Docker容器内程序不应该向容器内写入例如数据库字段的任何数据从而保持其无状态。所有数据存储都应该使用数据卷或者直接绑定主机的目录，数据卷与主机目录的数据一样，在容器被销毁后会被保留。

### Registry  镜像中心

Docker镜像中心是一个镜像的储存、分发的服务，最常见的镜像中心就是Docker官方的Docker hub。当你打包好一个镜像想要分享出去，最方便的方法就是推到Registry上。一个镜像中心中有若干个Repository仓库，每个仓库有多个Tag标签，每个标签对应着一个镜像。标签通常用于标记镜像的版本，通常使用`<仓库名>:<标签>`指定某个镜像，例如`mariadb:10.4-bionic`代表着MariaDB的10.4-bionic版本的镜像。有时仓库名是两端的，前半段通常意味着镜像的用户名或项目名，后半段为镜像名称，例如`nginx/nginx-ingress`。

直接从Docker hub上下载镜像在国内是一件十分困难的事情，因此推荐使用国内各大云服务商提供的镜像服务（Registry Mirror），阿里云就提供了容器镜像服务。在阿里云控制台的产品与服务选单内的弹性计算子目录内有容器镜像服务，在容器镜像服务页面下的镜像加速器内有配置阿里云容器镜像加速服务的方法。同时国内云服务商也提供了私有镜像中心服务。

## Docker部署

Docker分为CE（Community Edition）与EE（Enterprise Edition）两个版本，普通开发者使用CE版本即可。部署步骤使用Ubuntu系统举例，其它系统可以参考[官方文档]( https://docs.docker.com/install/linux/docker-ce/centos/ )，但记得把软件源切换为国内的。

### 准备工作

Docker CE支持以下版本的Ubuntu系统

- 19.04 Disco
- 18.10 Cosmic
- 18.04 Bionic
- 16.04 Xenial

#### 卸载旧版本

```bash
sudo apt-get remove docker docker-engine docker.io
```

### 安装

Docker的apt源使用HTTPS加密，所以我们要先添加HTTPS依赖的软件包与CA证书。

```bash
sudo apt-get update
sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
```

添加软件源的GPG密钥

```bash
// 官方源
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
// 中国科学技术大学源
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -
```

添加Docker软件源，其中`$(lsb_release -cs)`代表着Ubuntu版本代号，例如`disco`。

```bash
// 官方源
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
// 中国科学技术大学源
sudo add-apt-repository "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu $(lsb_release -cs) stable"
```

安装Docker CE

```bash
sudo apt-get update
sudo apt-ge install docker-ce
```

启动Docker CE

```bash
sudo systemctl enable docker
sudo systemctl start docker
```

由于`docker`命令使用Unix socket与Docker引擎通讯，只有`root`用户与`docker`用户组的用户才能访问。建立`docker`用户组并添加当前的用户。

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
```

简单获取并运行一个镜像

```bash
docker pull hello-world
docker run hello-world
```

OK，如果你收到`Hello from docker`那就表示成功了。

## 使用Docker镜像

### 获取与运行

```bash
docker pull [选项] [Docker Registry 地址[:端口号]/] Repository[:Tag]
```

一个例子：

```
docker pull ubuntu:18.04
docker run -it --rm ubuntu:18.04 bash
exit
```

这里解释一下run指令的几个参数

- `-it`：这是两个参数`-i`为交互式操作，`-t`是终端，如果我们想启用镜像内的命令行，则使用这个参数。
- `--rm`：代表当我们退出这个容器的时候销毁该容器，`docker rm <容器名>`也可以做到这一点。
- `bash`：放在镜像名后的是命令

### 查看镜像信息

列出所有镜像

```bash
docker image ls
```



