#!/bin/bash

usb_device = "/dev/sdc1"

fdisk -l | awk '/dev/{print $1, $8}' |
    while read sd fs; do
        if [ "$fs" = "FAT32" ] ; then
          usb_device = $sd
          echo "$sd -> $fs"
        fi
    done

#checking for name 
#ls -l /dev/disk/by-uuid/*

usb_path="/media/alberto/8A7E-1795/mirror/"
src_path="/home/alberto/dev/yos/"

orig=$src_path
target=$usb_path

if [ "$1" = "local" ] ; then
  orig=$usb_path
  target=$src_path
fi
if [ "$1" = "usb" ] ; then
  orig=$src_path
  target=$usb_path
fi

sudo rsync -avu --exclude 'node_modules/*' --exclude '*.bash' --delete "${orig}" "${target}"

echo "sync: $orig -> $target"
# he visto en un curso que en el if el parentesis es doble [[]]

