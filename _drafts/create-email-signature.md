---
title: Create HTML-based Email Signature in OS X's Mail app 
categories: [apps]
tags: [Mac, Mail]
layout: post
lang: en
---

This post includes short tutorial to creating email signature for Mail application in OS X El Capitan.

<!--more-->

First of all, open Preferences of Mail app. Select "Signatures" tab and add new signature (see picture).

{% include posts/_figure.html caption="Creating new signature" image1='/images/posts/create-email-signature/new-signature.png' %}

Then open directory `~/Library/Mail/V3/MailData/Signatures`. There you will see new file with .mailsignature extention. Open it in your favorite text editor. You will see something like this:


	Content-Transfer-Encoding: 7bit
	Content-Type: text/html;
		charset=us-ascii
	Message-Id: <1D5D1282-0AD0-491E-B963-5974928288C4>
	Mime-Version: 1.0 (Mac OS X Mail 9.0 \(3094\))

	<body style="color: rgb(0, 0, 0); letter-spacing: normal; orphans: auto; text-align: start; text-indent: 0px; text-transform: none; white-space: normal; widows: auto; word-spacing: 0px; -webkit-text-stroke-width: 0px; word-wrap: break-word; -webkit-nbsp-mode: space; -webkit-line-break: after-white-space;"><div>Alexandr Cherepanov</div><div>xandr.cherepanov@gmail.com</div><div><br></div></body><br class="Apple-interchange-newline">

Change existing HTML with your own HTML signature. Just don't change first 5 lines in a file.

After all, lock .mailsignature file for changes, so Mail app won't unexpectedly update your signature by itself.
