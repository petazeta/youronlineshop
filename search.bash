#!/bin/bash

if [ $1 ] ; then search_str=$1
fi
if [ $2 ] ; then folder_path=$2
else folder_path="./"
fi
grep -rnw ${search_str} ${folder_path} --color=always --exclude-dir=node_modules --exclude-dir=utils --exclude-dir=backup --exclude-dir=catalog-images --exclude-dir=logs

echo "Search: $search_str in $folder_path"
