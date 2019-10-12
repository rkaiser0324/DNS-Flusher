# DNS Flusher Plus Plus

This is a Chrome extension which allows you to easily flush the DNS cache. It was forked from int64ago's [DNS Flusher Plus](https://github.com/int64ago/DNS-Flusher), with the following enhancements:

1. Fixed a critical bug in the tab-reloading logic.
1. Additionally delete the current tab's AWSELB cookie, if it exists.
1. If the `X-Instance` header is set, overlay it on the page along with the IP address, with inspiration from tinybigideas' [WebsiteIP](https://github.com/tinybigideas/WebsiteIP).

## Chrome Configuration

To use this plugin you need to launch Chrome with the `--enable-net-benchmarking` flag.  Close all Chrome instances and follow the directions below.

### Ubuntu 16.04

Modify `/usr/share/applications/google-chrome.desktop` and add `--enable-net-benchmarking` after `Exec=/usr/bin/google-chrome-stable`

E.g., 
```bash
sudo sed -i -- 's/\/usr\/bin\/google-chrome-stable/\/usr\/bin\/google-chrome-stable --enable-net-benchmarking/g' /usr/share/applications/google-chrome.desktop
```

### Windows

1. Right-click on your "Chrome" icon.  If it's pinned to the taskbar, close it and do `Shift` + right-click.
1. Choose Properties
1. At the end of the target line add `--enable-net-benchmarking`

### macOS

```bash
cd "/Applications/Google Chrome.app/Contents/MacOS/" && mv "Google Chrome" Google.real \
  && printf '#!/bin/bash\ncd "/Applications/Google Chrome.app/Contents/MacOS"\n"/Applications/Google Chrome.app/Contents/MacOS/Google.real" --enable-net-benchmarking "$@"\n' > Google\ Chrome \
  && chmod u+x "Google Chrome"
```

## Usage

Install the extension by using [developer mode](https://developer.chrome.com/extensions/getstarted); it can be [debugged](https://developer.chrome.com/extensions/tut_debugging#locate_logs) via the normal process.

You can then flush the DNS cache by doing either of the following:

 - Click the icon in the toolbar
 - Use the keyboard shortcut (if not otherwise occupied): `Command+Shift+F` for Mac or `Ctrl+Shift+F` for others

On the Options panel you can optionally set an automatic refresh rate.

## Maintainer

This extension is maintained by [Rolf Kaiser](https://www.github.com/rkaiser0324).
