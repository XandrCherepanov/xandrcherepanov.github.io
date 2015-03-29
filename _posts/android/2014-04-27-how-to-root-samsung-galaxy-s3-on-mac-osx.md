---
title: "How to root Samsung Galaxy S3 on Mac OS X"
modified: 2015-03-22
tags: [Android, Mac OS X]
categories: [ android ]
---


In this post I'll describe all that I knew while rooting my Android device. There are many tutorials in Internet, but some of that use old software, another doesn't answer to errors and doesn't describe what you really do. I like use latest versions of applications, so in this tutorial latest apps are used. Also some errors, which I met, are described. And obviously this tutorial is made for Mac OS X. Let's get started.

<!--more-->

{% include _toc.html %}

First of all let's understand some things.

## What is root?

You know Android is based on Linux, and if you used Linux you know about root user. Basically, root has full access to all functions of operating system. In Linux you have `su` command to switch from normal user to *superuser (root)*. But in Android you don't have such ability, you always work as a normal user with restricted permissions. So let's change this.

## Additional Android modes

Every Android phone has two additional modes: **Download** and **Recovery**. 

**Download mode**, also known as **ODIN mode**, is used to flash ROMs from computer. You can put your Galaxy S3 into **Download mode** by holding down *Volume Down*, *Center Home*, and *Power* buttons together for about 10 seconds. When you see the warning screen, hit *Volume Up* to enter **ODIN Download mode**. To exit from **Download mode** hold *Power* button about 10 seconds.

{% include posts/_figure.html caption="Download mode warning screen and ODIN download mode." image1='/images/posts/how-to-root-samsung-s3-on-mac-osx/download-mode-warning-screen.jpg' image2='/images/posts/how-to-root-samsung-s3-on-mac-osx/odin-mode.jpg' %}

**Recovery mode** is usefull for reseting your Android device to factory state, or cleaning cache, and etc. You can load into **Recovery mode** by holding down *Volume Up*, *Center Home*, and *Power* buttons together for about 10 seconds. You will see such screen.

{% include posts/_figure.html image1='/images/posts/how-to-root-samsung-s3-on-mac-osx/stock-recovery-mode.jpg' caption='Stock Recovery mode' %}

## What is a ROM and a stock ROM?  

ROM is a package that includes Android operating system and additional applications. Stock ROM is a ROM that developed by smartphone manufacturer, and, in Samsung case, includes such additional apps as TouchWiz launcher, S Memo, S Planner, and etc. You can download stock ROM's for Samsung Galaxy S3 from <http://samsung-updates.com/device/?id=GT-I9300>. 

How to define that device has stock ROM installed? When you bought Samsung Galaxy S3 you have a stock ROM. In *Setting -> About device -> Status -> Device Status* you will see *Normal*. Screen of **Recovery mode** will be the same as on screenshot above. In **Download mode** you will see such text:

{% highlight text %}
ODIN MODE
PRODUCT NAME: GT-I9300
CUSTOM BINARY DOWNLOAD: No
CURRENT BINARY: Samsung Official
SYSTEM STATUS: Official
{% endhighlight %}
    

## Rooting device

OK, we have Galaxy S3 (i9300) with stock ROM on it, and we want to root it. First we must change stock recovery to something more powerfull. After that counter of custom ROM's will be increased, and warranty may be broken. **So think twice before flashing your device.**

**This root method doesn't erase your settings and apps.** It only overwrite recovery partition. Samsung has made recovery partition separate from the kernel, making rooting much safer.

If you decided to flash your phone you need to download some applications:

1. [Heimdall][] - application to flash recovery image to your phone. Now the latest version is 1.4.0.
2. [ClockworkMod Recovery][] - recovery image with abilities to install apps, backup whole system, and etc. Download *Recovery image* for you device. The latest version for Samsung Galaxy S3 (GT-I9300) was 6.0.4.6. I use it in this tutorial.
3. [SuperSU][] - analog of command `su` in Linux. It gives root access to other applications. The latest version is 1.94. You must download [CWM / TWRP / MobileODIN installable ZIP][SuperSU zip]

Check that your device has at least 50% of battery power. Better use fully charged devices.
{: .important}

### Step 1

Now install [Heimdall][] on your Mac. It also install custom kext, so reboot your computer after installation is complete.

### Step 2 

Put your Galaxy S3 into **Download mode** as described above and connect it to your Mac OS X computer/laptop using a microUSB cable.

###Step 3 

Now run **Heimdall-frontend** app in your Application folder. You need to get **.pit** file for your phone. On tab *Utilities* click *Save As...*, and select destination for **s3.pit** file. Then click *Download* button.

{% include posts/_figure.html image1='/images/posts/how-to-root-samsung-s3-on-mac-osx/download-pit-file.jpg' caption='Download PIT file' %}

<div class="notice" markdown="1">
  If Samsung Kies is installed on your Mac, and you get such error `ERROR: Claiming interface failed!` type in terminal this commands:

{% highlight bash %}
$ sudo kextunload -b com.devguru.driver.SamsungComposite
$ sudo kextunload -b com.devguru.driver.SamsungACMData
$ sudo kextunload -b com.devguru.driver.SamsungACMControl
{% endhighlight %}

  They will unload Samsung kexts for only this session. When you restart Mac they will be loaded again.
</div>

After downloading **.pit** file shutdown Galaxy S3 by holding *Power* button about 10 seconds. Then again load **Download mode** and connect to computer. Else you will get errors on next step.
{: .important}

### Step 4 

If you downloaded **.pit** file in preceding step, reenter your phone to **Download mode**. On tab *Flash* of **Heimdall-frontend** application choose *Browse* and then choose the file **s3.pit** you saved in previous step. Click on *Add*, change Partition Name to *RECOVERY*.  Then choose *Browse* and select the ClockworkMod Recovery image **recovery-clockwork-6.0.4.6-i9300.img**, that you downloaded earlier. Hit *Start* to begin the process. After flashing your phone will then reboot.

{% include posts/_figure.html image1='/images/posts/how-to-root-samsung-s3-on-mac-osx/flash-recovery.jpg' caption='Flash ClockworkMod Recovery' %}

If you get errors try type terminal commands from previous step, and reboot **Download mode**.
{: .notice}

### Step 5 

Connect your Galaxy S3 as a disk drive and copy [SuperSU zip][] (**UPDATE-SuperSU-v1.94.zip**) to anywhere on your Galaxy S3 (for example, on external sdcard).

### Step 6

Reboot into **Recovery mode** by holding down *Volume Up*, *Center Home*, and *Power* button together for about 10 seconds. You must see ClockworkMod Recovery screen. Choose *install zip*. Next choose *choose zip from /sdcard* or *choose zip from /storage/sdcard1* depending on where you put the file.

{% include posts/_figure.html image1='/images/posts/how-to-root-samsung-s3-on-mac-osx/cwm-recovery-screen.jpg' image2='/images/posts/how-to-root-samsung-s3-on-mac-osx/cwm-install-from-sdcard.jpg' caption='ClockworkMod Recovery install from sdcard' %}

Choose **UPDATE-SuperSU-v1.94.zip**. Then choose **Yes - install UPDATE-SuperSU-v1.94.zip**

{% include posts/_figure.html image1='/images/posts/how-to-root-samsung-s3-on-mac-osx/cwm-select-zip.jpg' image2='/images/posts/how-to-root-samsung-s3-on-mac-osx/cwm-confirm-install.jpg' caption='ClockworkMod Recovery install from sdcard' %}

### Step 7 

Once it’s done flashing the file **UPDATE-SuperSU-v1.94.zip** (the Superuser zip file), simply reboot and enjoy a fully rooted Galaxy S3. You will find SuperSU app once rebooted. You can now run rooted apps!

{% include posts/_figure.html image1='/images/posts/how-to-root-samsung-s3-on-mac-osx/cwm-final-screen.jpg' image2='/images/posts/how-to-root-samsung-s3-on-mac-osx/supersu-grant-access.jpg' %}

[Heimdall]: http://glassechidna.com.au/heimdall/
[ClockworkMod Recovery]: https://www.clockworkmod.com/rommanager
[SuperSU]: http://forum.xda-developers.com/showthread.php?t=1538053
[SuperSU zip]: http://download.chainfire.eu/supersu

**P.S.** After this tutorial you will find your phone is customized. In *Setting -> About device -> Status -> Device Status* you will see *Modified*. In **Download mode** you will see such text:

{% highlight text %}
ODIN MODE
PRODUCT NAME: GT-I9300
CUSTOM BINARY DOWNLOAD: Yes (1 counts)
CURRENT BINARY: Custom
SYSTEM STATUS: Custom
{% endhighlight %}