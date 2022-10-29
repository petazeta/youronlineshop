He creado una aplicación firewall para eliminar las entradas de bots que buscan wordpress.

He creado un repositorio (git --bare) en el servidor, de esa manera podria pasar los cambios mas facilmente sin pasar por github. El repositorio remoto es: /var/github. El local es dev/nube/digitalocean/github/.git

How to deploy yos

Para yos usamos la aplicación y la utilidad para https. Actualmente se esta usando un contenedor. Se hace así por la facilidad a la hora de recomenzar la aplicación si esta falla y otras ventajas que podría haber: se espera poder crear imagenes compuestas y así crear como instancias diferentes de la app cambiando algunos archivos especificamente para cada instancia.

Convendría hacer una buena guía para el deploy: como hacer la imagen de la app. Como añadir volumen para guardar imagenes. Lo mismo para la utilidad https que tambien guarda datos para las licencias. Lo bueno seria no utilizar composer porque es muy rígido, pienso que mejor sería ir comando a comando.

Actualmente se lleva a cabo en el directorio html/nube

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

FROM my-app:latest

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

# RUN mkdir -p /home/app

# copiar solo lo que cambia
COPY ./app/html /home/app

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