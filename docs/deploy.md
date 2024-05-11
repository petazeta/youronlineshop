Correr un servidor mongodb y otro con la app node ambos en la misma network

El url de mongodb sera: mongodb://nombre_mongodb_container/ 



OLD

# Servidor de tiendas

Se construye la imagen de yos
```
FROM node:16-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

ADD yos /home/yos

WORKDIR /home/yos

RUN npm install
```
`docker build --tag yos . -f Dockerfile-yos`

Se construyen las instancias teniendo como base yos/main-instance y cambiando cfg/dbcustom.mjs para la base de datos: "mongodb://admin:password@mongodb/yos-test?authSource=admin" y cfg/default.mjs para el tema de los logs y catalog-images: catalogImagesPath: "./catalog-images/test", reportsFilePath: "./logs/logs-test.txt"

Se construye la imagen de yos-instances teniendo en cuenta todas las instancias

```
FROM yos

COPY --from=yos /home/yos/main-instance /home/yos/test-instance
COPY --from=yos /home/yos/main-instance /home/yos/test2-instance

# Replacing config files
COPY ./test-instance /home/yos/test-instance
COPY ./test2-instance /home/yos/test2-instance

WORKDIR /home/yos

CMD ["node", "serverindex.mjs", "instances=./test-instance/index.mjs:8001,./test2-instance/index.mjs:8002"]
```

`docker build --tag yos-instances . -f Dockerfile-yos-instances`

Se crean (si no los hay) los directorios de catalog-images de las instancias creadas: /var/lib/yos/catalog-images/test, /var/lib/yos/catalog-images/test2

Se levanta el contenedor:
`docker run -d \
  --name yos-instances-server \
  -v /var/lib/yos/catalog-images:/home/yos/catalog-images \
  -v /var/lib/yos/logs:/home/yos/logs \
  yos-instances`

# Como instalar una instancia nueva

Nos podemos basar en el contendedor anterior: yos-instances y hacer los mismos pasos.

# Como hacer actualizaciones

Se suben los cambios(no hace falta cambiar nada pero es mas conveniente borrar lo que no es necesario para la aplicación): git (remote => ssh://youronlineshop.net/var/lib/github) y luego en servidor hacer un git clone (/var/lib/github/)
Se reconstruye la imagen yos: ver "Imagen para yos" (opcion --no-cache). Se reconstruyen las imagenes de las instancias. Se actualizan los contenedores: docker-compose up -d --build --no-deps. No-deps para que no se recreen los contenedores dependientes porque no es necesario. 

Parece que docker-compose utiliza el nombre del directorio para crear prefijos que luego utiliza en sus operaciones. Por esto hay que usar docker-compose en la misma carpeta, en mi caso la carpeta se llama docker. Algunas de las operaciones que quedan comprometidas son: nombre de networks, volumes guardados en docker. Los volumes que se ponen entre comillas no se guardan en docker.

# Como añadir una instancia de yos

Se crea la imagen nueva (ver Servicio yos-sample-server / Imagen). Se crean los directorios para los volumenes en var/lib/yos.
Se cambia site-index para que enrute al nuevo servicio.
Se crea de nuevo la imagen de site-index con la opcion --no-cache.
Se añade el servicio a docker-compose y se ejecuta de esta manera:
docker-compose up -d --no-deps --build site-index-service

-------

Antes era asi:

Cuando se quieren pasar los cambios a la web hay que tener en cuenta una serie de cuestiones:
- Hay que cambiar la configuracion de la base de datos
- Hay que cambiar la configuarción de server: basePath
- Hay que cambiar la configuarción de shared: requestUrlBasePath

Estos son los achivos y los valores a cambiar
server/dfg/dbcustom.mjs => url: "mongodb://admin:password@mongodb/yosdb?authSource=admin"
server/dfg/default.mjs => basePath: "./yos/"
shared/dfg/default.mjs => requestUrlBasePath: "sample"

En la carpeta dev/nube/digitalocean/github estan los archivos sslserverindex.mjs y firewall.mjs, no hay olvidarse de incluirlos.

Una vez realizados los cambios se pueden pasar los archivos al servidor a través de git (removete => ssh://youronlineshop.net/var/lib/github) y luego en servidor hacer un git clone (/var/lib/github/) guardandolo en la carpeta \~/docker/app.

A partir de aqui pasamos al punto situiente: Como reconstruir el contenedor de node

# Como reconstruir el contenedor de node

Si falla mi app y se hacen cambios se puede reconstruir la imagen con el comando:
docker-compose up -d --no-deps --build my-app
o simplemente
docker-compose up -d --force-recreate --no-deps my-app

----

# Situación del container

He creado unos servicios docker en el droplet de digitalocean. Estos servicios son:
- mongodb, mongoexpress y la web (la he llamado my-app)
En la app hay unos volúmenes para greenlock (certificados ssl) y para las imagenes en catalog-images. Estos volúmenes están montados en el servidor en var/lib/yos
Al hacer un deploy no hace falta configurar greenlock ni subir el directorio porque ya está configurado en el volumen y tiene los certificados.

# Como resolver errores in situ

Si falla mi app y se hacen cambios dentro del contenedor (sudo docker exec -it yos-sampe-server sh) y se hace restart del contenedor: sudo docker-compose restart yos-sample-service.
Tambien se pueden copiar archivos al contenedor mediante: sudo docker cp file.mjs yos-sample-server:/home/yos/file.mjs

Nota:
=====
Estoy entrando en el como ssh alberto@youronlineshop.net

# Creación de servicios independientes

Existe la posibilidad de crear contenedores diferentes para los servicios:
- Servicio de entrada, enrutado y ssl: index
- servicio yos_sample
- Servicio yosnet_site

Esto hará que se puedan crear nuevos servicios de forma más independiente. También se creara una imagen genérica de yos que pueda albergar en capas superiores cada una de las instalaciones.

## Imagen para yos

```
FROM node:16-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

ADD yos /home/yos

# set default dir
WORKDIR /home/yos

RUN npm install
```
`docker build --tag yos ./`

## Servicio yos-sample-server

### Imagen

Para la imagen vamos a copiar sólo los elementos que cambian que son:
server/cfg/dbcustom.mjs => url: "mongodb://admin:password@mongodb/yossample?authSource=admin"
serverindex.mjs => const serverPort='8002';

Dockerfile
```
FROM yos

COPY ./yos-sample /home/yos

# set default dir
WORKDIR /home/yos

CMD ["node", "serverindex.mjs"]
```
`docker build --tag yos-sample ./`

### Contenedor

Ahora que tenemos la imagen tenemos que crear el contenedor. Ya tenemos funcionando la base de datos y por eso hay que conectarse a esa red. (docker network ls, docker network inspect < >)
```
docker run -d \
  --name yos-sample-server \
  -p 8002:8002 \
  -v /var/lib/yos-sample/images:/home/yos/catalog-images \
  -v /var/lib/yos-sample/logs:/home/yos/logs \
  --network docker_default \
  yos-sample
```

## Servicio yos-landing-server

### Imagen

Dockerfile
```
FROM node:16-alpine

ADD landing /home/landing

# set default dir
WORKDIR /home/landing

RUN npm install

CMD ["node", "serverindex.mjs"]
```
`docker build --tag yos-landing ./`

### Contenedor

```
docker run -d \
  -p 8001:8001 \
  --name yos-landing-server \
  yos-landing
```

## Servicio index

### Imagen

Dockerfile
```
FROM node:16-alpine

ADD site-index /home/site-index

# set default dir
WORKDIR /home/site-index

RUN npm install

CMD ["node", "sslserverindex.mjs"]
```
`docker build --tag site-index ./`

### Contenedor

```
docker run -d \
  -p 80:80 \
  -p 443:443 \
  --name site-index-server \
  site-index
```

De una vez levantando los contenedores
```
version: '3.5' 
services: 
  site-index-service: 
    image: site-index  
    restart: always 
    container_name: site-index-server
    ports: 
      - "80:80"
      - "443:443"
    volumes:
      - "/var/lib/yos/greenlock.d:/home/site-index/greenlock.d"
    networks:
    - mynet
    depends_on:
      - yos-landing-service
      - yos-sample-service
      - yos-test-service            
  yos-landing-service: 
    image: yos-landing  
    restart: always 
    container_name: yos-landing-server 
    networks:
    - mynet
  yos-sample-service: 
    image: yos-sample  
    restart: always 
    container_name: yos-sample-server 
    volumes: 
      - "/var/lib/yos/sample/images:/home/yos/catalog-images" 
      - "/var/lib/yos/sample/logs:/home/yos/logs"
    networks:
    - mynet
    depends_on:
      - mongodb
  yos-test-service: 
    image: yos-test  
    restart: always 
    container_name: yos-test-server 
    volumes: 
      - "/var/lib/yos/test/images:/home/yos/catalog-images" 
      - "/var/lib/yos/test/logs:/home/yos/logs"
    networks:
    - mynet
    depends_on:
      - mongodb
  mongodb:
    image: mongo:latest
    restart: always # allways up
    container_name: mongo-server 
    environment:
    #Probar sin passwords
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongo-data:/data/db
    networks:
    - mynet
networks:
  mynet:
    driver: bridge
    ipam:
      driver: default
    name: mynet
volumes:
  mongo-data:
    driver: local
```

Habria que rehacer la imagen de site-index, parar los contenedores que hay funcionando: mejor con docker-compose down desde el directorio docker y levantar los contenedores. Al levantar los contenedores con docker-compose se crean automaticamente los servicios y las networks. Se especifica mynet para darle un nombre y especificar el tipo, pero no sería necesario indicar nada.

----------

# Different containers for the web services

En lugar de hacer como hasta ahora que estamos creando los servicios de yos y yosnet con el mismo servicio node, vamos a separarlos y luego conectaros a través de un proxy. Estoy hará nuestra aplicación más facil de modificar y además estará más integrable con el desarrollo actual que se realiza de forma independiente. También podría permitir una mejor distribución de los servicios, por ejemplo se podría hacer que el servicio de descarga de archivos fuera independiente y único en todas las aplicaciones.

La realización del proxy ya está. Falta la implementación en docker.


# How to deploy yos

Guia en dev/nube/readme.md

Para yos usamos la aplicación y la utilidad para https. Actualmente se esta usando un contenedor. Se hace así por la facilidad a la hora de recomenzar la aplicación si esta falla y otras ventajas que podría haber: se espera poder crear imagenes compuestas y así crear como instancias diferentes de la app cambiando algunos archivos especificamente para cada instancia.

Crear instalaciones dependientes de una imagen fija parece sencillo (ver dockerfile). Para enrutarlas se podría hacer que cada app se comunicara con un puerto y la rama principal tendria que crear servidores para cada una de estas instancias. Para comunicarse entre puertos hay que hacerlo usando docker networks y httpProxy

Just add a network specification to you docker-compose file to use a custom bridge network.

something like that might work for you

version: '3'
services:
  api-gateway:
    container_name: api-gateway
    build: './api-gateway'
    ports:
    - "8080:8080"
    networks:
    - mynet
  user-service:
    build: ./user-service
    container_name: user-service
    ports:
    - "8093:8093"
    networks:
    - mynet

networks:
  mynet:
    driver: bridge
    ipam:
      driver: default
according to your specified ports and services in your docker-compose the following connections are now possible:

api-gateway container: user-service:8093
user-service container: api-gateway:8080
if i get it right, your api-gateway would now be:

const userServiceProxy = httpProxy(http://user-service:8093);
  this.app.post('/admin/register', async(req, res) => {
      userServiceProxy(req, res);
  });
inside a docker network you can access the ports from other containers directly (no need to specify a port-mapping to your host). probably one of your port-mappings is therefore unnecessary. if you are accessing the user-service only via api-gateway and not directly you may remove the port specification in your docker-compose files (user-service block). your user-service would then be accessible only using the api-gateway. which is probably what you want.

***********
Dockerfile:
***********
```
FROM my-app:latest

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

# RUN mkdir -p /home/app

# copiar solo lo que cambia
COPY ./app /home/app

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

# create greenlock.d for volume creo que no hace falta
# RUN mkdir greenlock.d

# change yos database settings

# change yos from dev config to production config

# change yos configuration from single site to multi site

# change yos path settings: default.js

# esto crearia el directorio node_modules cambiando su contenido por tanto no cal
# RUN npm install
# RUN npm install greenlock-express@v4

# esto si haria falta para que se ejecutara en el contenedor nuevo
CMD ["node", "sslserverindex.js"]
```

## Como modificar archivos de imagenes

Dckerfile

```
FROM my-app

# notice that we are coping html content to app folder, but not the html folder
COPY ./app/html /home/app

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

# no need for /home/app/sslserverindex.js because of WORKDIR
CMD ["node", "sslserverindex.js"]
```

## la barra al final en el url

La barra en el url signific aque las proximas peticiones del cliente tomaran como url base hasta la barra, por tanto es importante que si queremos acceder a una web y no se pone la barra al final, la web redireccione a la url con la barra al final.

# Algunos commandos para reutilizar

sudo docker build --tag yos . -f Dockerfile-yos
sudo docker build --tag yos-sample . -f Dockerfile-yos-sample
sudo docker build --tag yos-test . -f Dockerfile-yos-test
sudo docker build --tag yos-test2 . -f Dockerfile-yos-test2
sudo docker build --tag yos-landing . -f Dockerfile-yos-landing
sudo docker build --tag site-index . -f Dockerfile-site-index
sudo docker-compose up -d --build --no-deps

sudo docker-compose up -d mongo-express

# Administración del sistema

He instalado firewalld, se puede parar con systemctl stop firewalld y se puede quitar del boot con sudo systemctl unable firewalld. Este firewall funciona con las reglas de docker. Si se instala un firewall hay que reiniciar el sistema para que docker haga las operaciones pertinentes en las reglas del firewall.

He instalado iftop e iftraf-ng para visibilizar el trafico porque habia trafico inusual. Luego he habilitado el firewall en digitalocean para evitar problemas. Este firewall adminte solo http y https. Pero el mail usa otros puertos, entonces he habilitado todas las conexiones tcp para smtp-relay.sendinblue.com y la especifica de smtp.
En el trafico inusual se apreciaba lo siguiente:
134.209.228.174:16162 => 120.220.84.13:53001 358Mb   358Mb   236Mb
134.209.228.174:16162 => 111.38.53.159:53001 627Mb   623Mb   327Mb
Mucho trafico a traves de puertos que no no uso.
