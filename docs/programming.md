Programming techniques
======================

# Tools

- Note: for devtools to be connected with node we must use the option "inspect": node --inspect.

## regexp

/"(.*?)"/.exec('"hola" y adios"')

## Grep

grep -rnw "path.join" ./ --color=always --exclude=node_modules

# Js tips

Iterating for objects

Use for ... in

Iterating for arrays

Use for ... of

# system admin

 sudo docker ps

 sudo rsync -avu --exclude 'node_modules/*' --delete "/home/alberto/dev/html/yos/" "/media/alberto/D4B5-4F86/backup/yos"

 sudo docker-compose up -d

git commit -a -m "v 4.1.0"
git push orign master

 tar -czvf dbmbkup.tar.gz dbmanager

ssh root@youronlineshop.net

# consola

let {unpacking}= await import('./' + SHARED_MODULES_PATH + 'utils.mjs');