---
title: Install Oracle Database 12c on CentOS 7
categories: [oracle]
tags: [Oracle Database, Linux, CentOS, Video]
---

<!--more-->

{% include _toc.html %}

## Part 1. Preparing CentOS 7

## Installing CentOS 7

You can download CentOS 7 from the page <https://www.centos.org/download/>.

I will use Parallels Desktop Virtual Machine (VM) for CentOS installation on Mac computer. You can use any other VM, such as VirtualBox or Vmware.

Open Parallels Desktop app and choose option "Install Windows or another OS from a DVD or image file". Select "Image File". I have already downloaded Everything ISO image of CentOS. You can use any of that available in the site. Just select your downloaded file. Click "Continue". Uncheck "express installation". Set name for virtual machine, also check off both checkboxes to create alias on desktop and customize settings.

In settings you can choose "CentOS Linux" option. On "Options" tab select "Optimization" and set "Faster Mac" option, as VM will be used mostly for background tasks. I don't need sharing Linux apps with my Mac, so disable this feature ("Applications").

On tab "Hardware" in "CPU &lt; Memory" settings you have to set memory just a little more than 2024 MB. I set 2256 MB. In Hard Disk setting I will change the size of virtual hard drive. Click "Edit..." button and set new size. You need at least **40 GB** space.

Now you can start installation. In opened menu select "Install CentOS 7" option. Installation process is very simple. You need to:

1. Select language for the installation process.
2. Configure Time Zone if you need.
3. Add other keyboard layouts if you use multilingual keyboard. You have to select keys combination for switching between keyboard layouts. I use Alt+Shift (in Mac ⌥&nbsp;Option+⇧&nbsp;Shift).
4. You can change installation sources and configure additional repositories, but we'll do that after installation completes.
5. I'll use minimal install settings for software selection and I'll install all required packages after installation.
6. I will disable Kdump, because I don't need it on virtual machine.
7. Select hard drive for installation. I choose option "Automatically configure partitioning". That's enough.
8. You can enable network and set host name, but I will do it later.

Now you can just press Begin Installation button. Then installation process starts and we need to set root password or create new user account. I will set root password. I'll create a user account later. Reboot at the end of installation.

Congratulations! You just have installed CentOS 7 and now you can login as root user with password selected during the installation process.

Now we have to configure our fresh CentOS and prepare for Oracle Database installation.

## Setting up network

I like to connect to my virtual machine over SSH connection. I will not describe how to configure secure connection over SSH because it's just a virtual machine. But in the real world scenario you will need to disable root connection and enable login using keys.

So just after installing CentOS 7, your SSH server is enabled and you can connect from your home system. But you need to know IP address of your virtual machine.

First of all, ensure that your network interface is configured correctly. Log in as root user (you won't see password while typing) and check network configuration:

<div class="terminal">
<pre><code>[root@localhost ~]# <kbd>ip a | grep inet</kbd>
<samp>inet 127.0.0.1/0 scope host lo
inet6 ::1/128 scope host</samp></code></pre>
</div>

So, only the loopback interface is active. We need to configure eth0 network interface to connect to our host machine's network. Open the config file:

<div class="terminal">
<pre><code>[root@localhost ~]# <kbd>cd /etc/sysconfig/network-scripts</kbd>
[root@localhost ~]# <kbd>vi ifcfg-eth0</kbd>

<em>" Change ONBOOT=no to ONBOOT=yes
" or just use this command</em>
[root@localhost ~]# <kbd>sed -i -e "s/ONBOOT=no/ONBOOT=yes/g" /etc/sysconfig/network-scripts/ifcfg-eth0</kbd></code></pre>
</div>

Network interface will start automatically every time you restart the virtual machine. Now start the network interface:

<div class="terminal">
<pre><code>[root@localhost ~]# <kbd>ifup eth0</kbd>
[root@localhost ~]# <kbd>ip a | grep inet</kbd>
<samp>inet 127.0.0.1/0 scope host lo
inet6 ::1/128 scope host
inet 10.211.55.9/24 brd 10.211.55.255 scope global dynamic eth0</samp></code></pre>
</div>

The second inet address is what we need (10.211.55.9). This IP address virtual machine gets from Parallels DHCP server, and it's a local network created by Parallels Desktop. Such local networks can be created using VirtualBox or VMware software.

Now you can connect to the virtual machine over SSH and do the most of operations that way. Open new terminal window and type:

<div class="terminal">
<pre><code>$ <kbd>ssh root@10.211.55.9</kbd>
<samp>The authenticity of host '10.211.55.9 (10.211.55.9)' can't be established.
ECDSA key fingerprint is SHA256:R8ZvZo6GSoQSVAtlfaIEn4icwiXi9Elo86RvwvsZjoA.
Are you sure you want to continue connecting (yes/no)? <kbd>yes</kbd>
Warning: Permanently added '10.211.55.9' (ECDSA) to the list of known hosts.
root@10.211.55.9's password: <kbd>&lt;Enter your password&gt;</kbd></samp>
Last login: Thu Nov 12 18:55:25 2015
[root@centos-7 ~]#</code></pre>
</div>

Change the hostname for the virtual machine:

<div class="terminal">
<pre><code>[root@centos-7 ~]# <kbd>hostnamectl set-hostname ora-c7.local</kbd></code></pre>
</div>

After restarting network interface or rebooting virtual machine, hostname will be changed.

Add additional line into `/etc/hosts` file and test it:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>vi /etc/hosts</kbd>
<div class="file"><ins>10.211.55.9  ora-c7.local</ins></div>
[root@ora-c7 ~]# <kbd>ping -c 1 ora-c7.local</kbd>
<samp>PING ora-c7.local (10.211.55.9) 56(84) bytes of data.
64 bytes from ora-c7.local (10.211.55.9): icmp_seq=1 ttl=64 time=0.040 ms

--- ora-c7.local ping statistics ---
1 packets transmitted, 1 received, 0% packet loss, time 0ms
rtt min/avg/max/mdev = 0.040/0.040/0.040/0.000 ms</samp></code></pre>
</div>

## Configuring repositories

CentOS 7 uses `yum` package manager. It automatically search the best mirror servers all over the world to install and update packages. Sometimes it's not the best idea. So, you have to disable this behavior and use your favorite mirror server.  First, disable yum's plugin `fastestmirror`.

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>vi /etc/yum/pluginconf.d/fastestmirror.conf</kbd>
<div class="file">[main]<del>enabled=0</del><ins>enabled=1</ins>verbose=0</div>
<em>" Change enabled=1 to enabled=0
" or just use this command</em>
[root@ora-c7 ~]# <kbd>sed -i -e "s/enabled=1/enabled=0/g" /etc/yum/pluginconf.d/fastestmirror.conf</kbd></code></pre>
</div>

Second, change repositories:

<div class="terminal">
<pre><code><em>" Backup setting by copying .repo file</em>
[root@ora-c7 ~]# <kbd>cp /etc/yum.repos.d/CentOS-Base.repo{,.bak}</kbd>
[root@ora-c7 ~]# <kbd>vi /etc/yum.repos.d/CentOS-Base.repo</kbd>
<em>" Comment mirrorlist attributes by adding # sign before it (#mirrorlist)
" Uncomment baseurl attributes (delete # sign)
" Change url in baseurl to appropriate for your favorite server

" Or use these commands to automate editing</em>
[root@ora-c7 ~]# <kbd>sed -i -e "s/\(^mirrorlist\)/#mirrorlist/g" /etc/yum.repos.d/CentOS-Base.repo</kbd>
[root@ora-c7 ~]# <kbd>sed -i -e "s/\(^#baseurl\)/baseurl/g" /etc/yum.repos.d/CentOS-Base.repo</kbd>
[root@ora-c7 ~]# <kbd>sed -i -e "s/mirror.centos.org/&lt;your mirror url&gt;/g" /etc/yum.repos.d/CentOS-Base.repo</kbd></code></pre>
</div>

Now, we can update our CentOS installation using `yum update` command:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>yum update</kbd>
<samp>Transaction Summary
=========================
Install   1 Package
Upgrade  72 Packages

Total download size: 106 M
Is this ok [y/d/N]: <kbd>y</kbd>
...
Retrieving key from file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
Importing GPG key 0xF4A80EB5:
 Userid     : "CentOS-7 Key (CentOS 7 Official Signing Key) &lt;security@centos.org&gt;"
 Fingerprint: 6341 ab27 53d7 8a78 a7c2 7bb1 24c6 a8a7 f4a8 0eb5
 Package    : centos-release-7-1.1503.el7.centos.2.8.x86_64 (@anaconda)
 From       : /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
Is this ok [y/N]: <kbd>y</kbd>
  ...
  Verifying  : 2:irqbalance-1.0.7-1.el7.86_64                       	   144/145
  Verifying  : 1:NetworkManager-1.0.0-14.git20150121.b4ea599c.el7.x86_64   145/145

Installed:
  kernel.x86_64 0:3.10.0-229.20.1.el7

Updated:
  ...
  systemd-libs.x86_64 0:208-20.el7_1.6       systemd-sysv.x86_64 0:208-20.el7_1.6
  trousers.x86_64 0:0.3.11.2-4.el7_1         tzdata.noarch 0:2015g-1.el7
  util-linux.x86_64 0:2.23.2-22.el7_1.1      wpa_supplicant.x86_64 1:2.0-17.el7_1

Complete!</samp></code></pre>
</div>

## Installing Parallels Tools

Parallels Desktop provides additional features, such as folder sharing, graphics support. But to use them you need to install Parallels Tools inside the guest OS. In Windows guest OS this process is pretty easy, but in Linux it's more complex. The familiar tools are available in VirtualBox and VMWare products. Next description can also be applied to those products with some changes.

Before the installation, ensure that you have disabled SELinux. It may cause some problems in the next works. Disable SELinux by editing the `/etc/selinux/config` file. Set setting `SELINUX=permissive`.

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>sed -i -e "s/\(^SELINUX=.*\)/SELINUX=permissive/g" /etc/selinux/config</kbd></code></pre>
</div>

In Parallels menu select `Actions -> Install Parallels Tools...`.

<div class="terminal">
<pre><code><em>" Create directory and mount cdrom</em>
[root@ora-c7 ~]# <kbd>mkdir /media/cdrom</kbd>
[root@ora-c7 ~]# <kbd>mount -o exec /dev/cdrom /media/cdrom</kbd>
<samp>mount: /dev/sr0 is write-protected, mounting read-only</samp>
[root@ora-c7 ~]# <kbd>cd /media/cdrom</kbd>
<em>" Run installer</em>
[root@ora-c7 cdrom]# <kbd>./install</kbd></code></pre>
</div>

Click "Next" to start the installation process. If you need to install some components, installer will ask you for that. It will download them and install on your system. After installing Parallels Tools for Linux, restart your virtual machine using command `reboot`.

Now, you have access to shared folders on your host machine. They are available in `/media/psf/` folder.

## Additional configuration (optional)

OK, for more convenient editing files and the following usage of the virtual machine, I will install some additional packages and copy settings that I use frequently. You can start from the next section if you want to leave the virtual machine as clear as possible. The following instructions are not necessary for the main purpose.

First, I will install such packages as `vim`, `git`. Vim is the editor that is very handy when you work in terminal. You can install additional VCS software if you need. I prefer Git for most of the work. Sometimes I use Mercurial, but it's not the case when I need it. Second, I will copy my configuration files from my home machine.

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>yum install vim git</kbd>
[root@ora-c7 ~]# <kbd>cp /media/psf/Home/.vimrc ~</kbd>
[root@ora-c7 ~]# <kbd>cp -r /media/psf/Home/.vim ~</kbd></code></pre>
</div>

I will add alias for vim into bash configuration file. After that, you can type `vi` to start `vim`.

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>vim .bashrc</kbd>
<div class="file"><ins>alias vi='vim'</ins></div>
[root@ora-c7 ~]# <kbd>source .bashrc</kbd></code></pre>
</div>

## Configurations specific for Oracle DB installation

Login as root and disable SELinux if you have not disabled it yet:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>sed -i -e "s/\(^SELINUX=.*\)/SELINUX=permissive/g" /etc/selinux/config</kbd></code></pre>
</div>

Add required groups `oinstall`, `dba`, `oper`:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>groupadd -g 501 oinstall</kbd>
[root@ora-c7 ~]# <kbd>groupadd -g 502 dba</kbd>
[root@ora-c7 ~]# <kbd>groupadd -g 503 oper</kbd></code></pre>
</div>

Add user `oracle` and include it into previously created groups. Then change password for the new user:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>useradd -u 501 -g oinstall -G dba,oper oracle</kbd>
[root@ora-c7 ~]# <kbd>passwd oracle</kbd></code></pre>
</div>

Add kernel parameters to `/etc/sysctl.conf` and apply them. It is necessary for Oracle installer.

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>vi /etc/sysctl.conf</kbd>
<div class="file"><ins>kernel.shmmni = 4096
kernel.shmmax = 4398046511104
kernel.shmall = 1073741824
kernel.sem = 250 32000 100 128
fs.aio-max-nr = 1048576
fs.file-max = 6815744
net.ipv4.ip_local_port_range = 9000 65500
net.core.rmem_default = 262144
net.core.rmem_max = 4194304
net.core.wmem_default = 262144
net.core.wmem_max = 1048586</ins></div>
" Apply kernel parameters
[root@ora-c7 ~]# <kbd>sysctl -p</kbd></code></pre>
</div>

Add following lines to set shell limits for user `oracle` in file `/etc/security/limits.conf`:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>vi /etc/security/limits.conf</kbd>
<div class="file"><ins>oracle   soft   nproc    131072
oracle   hard   nproc    131072
oracle   soft   nofile   131072
oracle   hard   nofile   131072
oracle   soft   core     unlimited
oracle   hard   core     unlimited
oracle   soft   memlock  50000000
oracle   hard   memlock  50000000</ins></div></code></pre>
</div>

Modify `.bashrc` for user `oracle` in his home directory, add at the end of the file `/home/oracle/.bashrc` the following lines. It creates variables which will be used by Oracle database installer.

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>vi /home/oracle/.bashrc</kbd>
<div class="file"><ins># Oracle Settings
export TMP=/tmp
export TMPDIR=$TMP

export ORACLE_HOSTNAME=ora-c7.local
export ORACLE_UNQNAME=orcl
export ORACLE_BASE=/u01/app/oracle
export ORACLE_HOME=$ORACLE_BASE/product/12.1.0/db_1
export ORACLE_SID=orcl

export PATH=/usr/sbin:$PATH
export PATH=$ORACLE_HOME/bin:$PATH

export LD_LIBRARY_PATH=$ORACLE_HOME/lib:/lib:/usr/lib
export CLASSPATH=$ORACLE_HOME/jlib:$ORACLE_HOME/rdbms/jlib</ins></div></code></pre>
</div>

Create directory structure for Oracle DB installation:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>mkdir -p /u01/app/oracle/product/12.1.0</kbd>
[root@ora-c7 ~]# <kbd>chown -R oracle:oinstall /u01/</kbd>
[root@ora-c7 ~]# <kbd>chmod 775 /u01/app</kbd></code></pre>
</div>

Install additional packages. We need graphical user interface, as Oracle Database uses GUI installer. But after installation to run Oracle DB, it is not necessary to start X Server. Because of that we will not autoload GUI. Ensure that all necessary packages are installed.

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>yum groupinstall "Development Tools"</kbd>
[root@ora-c7 ~]# <kbd>yum groupinstall "GNOME Desktop"</kbd>
[root@ora-c7 ~]# <kbd>yum install binutils compat-libcap1 compat-libstdc++-33 compat-libstdc++-33.i686 gcc gcc-c++ glibc glibc.i686 glibc-devel glibc-devel.i686 ksh libgcc libgcc.i686 libstdc++ libstdc++.i686 libstdc++-devel libstdc++-devel.i686 libaio libaio.i686 libaio-devel libaio-devel.i686 libXext libXext.i686 libXtst libXtst.i686 libX11 libX11.i686 libXau libXau.i686 libxcb libxcb.i686 libXi libXi.i686 make sysstat unixODBC unixODBC-devel zlib-devel</kbd></code></pre>
</div>

Now you're ready for installing database software.

## Install Oracle Database

You can download Oracle Database 12c from Oracle's [download page](http://www.oracle.com/technetwork/database/enterprise-edition/downloads/index.html). You need to download two files for *Linux x86-64* architecture: `linuxamd64_12102_database_1of2.zip` and `linuxamd64_12102_database_2of2.zip`. Unzip them into one folder named `database` on your computer. Next you can copy that folder to your virtual machine or you can start installation over network. Because we have installed Parallels Tools and mounted our home folder from host OS, the second option is simpler.

Login as or switch to `oracle` user to install database software (now, we do not use SSH connection). Use `startx` command to start X Window Server and load Gnome Desktop. If you have any problems with starting X Server, try to reinstall Parallels Tools.

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>su - oracle</kbd>
[oracle@ora-c7 ~]~ <kbd>startx</kbd></code></pre>
</div>

Open Terminal application in Gnome and start Oracle Database installation:

<div class="terminal">
<pre><code>[oracle@ora-c7 ~]$ <kbd>cd /media/psf/Home/Downloads/database</kbd>
[oracle@ora-c7 database]$ <kbd>./runInstaller</kbd></code></pre>
</div>

Follow the instractions of the installer:

1. Skip setting for security updates if you don't need them, and click `Next` button.
2. On the `Installation option` screen check `Create and configure a database` option.
3. On the next screen select `Server class` option. It will provide more configuration options later.
4. Select `Single instance database installation` as the type of database installation on the next screen.
5. Then check `Typical install` on the Install Type screen.
6. On the next screen use setting presented in the following figure. Enter administrative password. It must be more than 8 characters, and contain both alphabetics (uppercase and lowercase) and numerics. Then click `Next`.

   {% include posts/_figure.html caption="Oracle Typical Installation settings" img1="oracle_typical.jpg" %}

7. On the next screen select inventory directory. By default it will be `/u01/app/oraInventory`. Also you can select group for that directory (`oinstall` by default).
8. Then installer do prerequisite checks, and if something is wrong, you will see the approriate warnings on the summary screen. Click `Install` button to start installation process.
9. During installation you will be prompted to execute configuration scripts with `root` permissions. Open terminal and type the following commands:

<div class="terminal">
<pre><code>[oracle@ora-c7 ~]$ <kbd>su</kbd>
[root@ora-c7 ~]# <kbd>/u01/app/oraInventory/orainstRoot.sh</kbd>
<samp>Changing permissions of /u01/app/oraInventory.
Adding read,write permissions for group.
Removing read,write,execute permissions for world.

Changing groupname of /u01/app/oraInventory to oinstall.
The execution of the script is complete.</samp>

[root@ora-c7 oracle]# <kbd>/u01/app/oracle/product/12.1.0/db_1/root.sh</kbd>
<samp>Performing root user operation.

The following environment variables are set as:
    ORACLE_OWNER= oracle
    ORACLE_HOME=  /u01/app/oracle/product/12.1.0/db_1

Enter the full pathname of the local bin directory: [/usr/local/bin]: 
   Copying dbhome to /usr/local/bin ...
   Copying oraenv to /usr/local/bin ...
   Copying coraenv to /usr/local/bin ...

Creating /etc/oratab file...
Entries will be added to the /etc/oratab file as needed by
Database Configuration Assistant when a database is created
Finished running generic part of root script.
Now product-specific root actions will be performed.</samp></code></pre>
</div>

Then click `OK` to continue the installation process. If you get an error while Oracle Net Configuration Assistant executes, try to press `Retry` button.

Database Configuration Assistant provide ability to lock/unlock and change passwords for database users. Click `Password Management...` button and change passwords for `SYS` and `SYSTEM` user accounts.

## Post installation steps

After installation completed, edit the `/etc/oratab` file to enable autoloading database:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>vi /etc/oratab</kbd>
<div class="file"><del>orcl:/u01/app/oracle/product/12.1.0/db_1:N</del><ins>orcl:/u01/app/oracle/product/12.1.0/db_1:Y</ins></div>
<em>" Change N to Y
" or just use this command</em>
[root@ora-c7 ~]# <kbd>sed -i "s/db_1:N/db_1:Y/g" /etc/oratab</kbd></code></pre>
</div>

Create Systemd files for Oracle Database services:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>vi /etc/sysconfig/oracledb</kbd>
<div class="file"><ins>ORACLE_BASE=/u01/app/oracle
ORACLE_HOME=/u01/app/oracle/product/12.1.0/db_1
ORACLE_SID=orcl</ins></div>
<em>" Configure listener service </em>
[root@ora-c7 ~]# <kbd>vi /usr/lib/systemd/system/lsnrctl.service</kbd>
<div class="file"><ins>[Unit]
Description=oracle net listener
After=network.target

[Service]
Type=forking
EnvironmentFile=/etc/sysconfig/oracledb
ExecStart=/u01/app/oracle/product/12.1.0/db_1/bin/lsnrctl start
ExecStop=/u01/app/oracle/product/12.1.0/db_1/bin/lsnrctl stop
User=oracle

[Install]
WantedBy=multi-user.target</ins></div>
<em>" Configure database service </em>
[root@ora-c7 ~]# <kbd>vi /usr/lib/systemd/system/oracledb.service</kbd>
<div class="file"><ins>[Unit]
Description=oracle database service
After=network.target lsnrctl.service

[Service]
Type=forking
EnvironmentFile=/etc/sysconfig/oracledb
ExecStart=/u01/app/oracle/product/12.1.0/db_1/bin/dbstart /u01/app/oracle/product/12.1.0/db_1
ExecStop=/u01/app/oracle/product/12.1.0/db_1/bin/dbshut /u01/app/oracle/product/12.1.0/db_1
User=oracle

[Install]
WantedBy=multi-user.target</ins></div></code></pre>
</div>

Enable added services, and your services will start automatically:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>systemctl daemon-reload</kbd>
[root@ora-c7 ~]# <kbd>systemctl enable lsnrctl oracledb</kbd>
<samp>ln -s '/usr/lib/systemd/system/lsnrctl.service' '/etc/systemd/system/multi-user.target.wants/lsnrctl.service'
ln -s '/usr/lib/systemd/system/oracledb.service' '/etc/systemd/system/multi-user.target.wants/oracledb.service'</samp></div></code></pre>
</div>

Enable TCP ports for Oracle Database listener and Enterprise Manager Database Express browser-based tool in the firewall. Default listener uses port `1521`. Enterprise Manager Database Express uses `5500` port.

Create a file `/usr/lib/firewalld/services/oracledb.xml` with the following content:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>vi /usr/lib/firewalld/services/oracledb.xml</kbd>
<div class="file"><ins>&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;service&gt;
  &lt;short&gt;OracleDB&lt;/short&gt;
  &lt;description&gt;Oracle Database Server and Enterprise Manager Database Express browser-based tool&lt;/description&gt;
  &lt;port protocol="tcp" port="1521"/&gt;
  &lt;port protocol="tcp" port="5500"/&gt;
&lt;/service></ins></div></code></pre>
</div>

Then restart firewall service, add created service `oracledb` to services allowed by firewall, again reload firewall settings to enable new service, and check with `firewall-cmd --list-services` command that `oracledb` has been enabled:

<div class="terminal">
<pre><code>[root@ora-c7 ~]# <kbd>firewall-cmd --reload</kbd>
<samp>success</samp>
[root@ora-c7 ~]# <kbd>firewall-cmd --add-service=oracledb --permanent</kbd>
<samp>success</samp>
[root@ora-c7 ~]# <kbd>firewall-cmd --reload</kbd>
<samp>success</samp>
[root@ora-c7 ~]# <kbd>firewall-cmd --list-services</kbd>
<samp>dhcpv6-client oracledb ssh</samp></code></pre>
</div>

