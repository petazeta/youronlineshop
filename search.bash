#!/bin/bash

if [ $1 ] ; then search_str=$1
else read -p "Enter search string: " search_str
fi
grep -rnw ${search_str} ./ --color=always --exclude-dir=node_modules --exclude-dir=utils --exclude-dir=backup --exclude-dir=catalog-images --exclude-dir=logs

echo "Search: $search_str"
