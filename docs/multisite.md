Multi site
===========

# Introduction

Parece que la mejor forma de realizar este elemento no es mediante el propio software si no creando diferentes instancias al software. Esto es así al menos porque los módulos que utiliza el programa contienen datos que no pueden ser compartidos con otras ejecuciones del propio programa en otros hilos distintos y esto podría ocasionar la interferencia entre hilos y datos erroneos.

Se podría ir mirando de orientar los módulos a servicios independientes de cada instalación. Llegará un momento que la aplicación tenga toda su funcionalidad implementada con estos servicios y se podrá independizar las instalaciones de los servicios.

Actualmente la ejecución de las instancias para diferentes configuraciones (usuarios) se hace mediante diferentes contenedores de docker. Cada instancia funciona en un contenedor. El hilo principal se comunica a través de un servicio proxy a cada instancia para enviarles el request y el response.

Hay una imagen que contiene la aplicación general y sobre esta imagen se contruyen las diferentes imagenes para las instancias añadiendole la capa que contiene la configuración correspondiente. Además se utilizan los volumes de docker para establecer diferentes storages para los datos que generan cada una de las instancias.

Otra opción sería usar copias de la aplicación en lugar de tener los contenedores.

Dockerfile
```
FROM node:16-alpine

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password

ADD yos-index /home/yos-index
ADD yos /home/yos-instance

# set default dir
WORKDIR /home/yos-instance

RUN npm install
```
sudo docker build --tag yos . -f Dockerfile-yos

```
FROM yos

COPY --from=yos /home/yos-instance /home/yos-sample
COPY --from=yos /home/yos-instance /home/yos-test

COPY ./yos-sample /home/yos-sample
COPY ./yos-test /home/yos-test

# set default dir
WORKDIR /home/yos-index

CMD ["node", "serverindex.mjs"]
```

yos-index/serverindex.mjs
```
import http from 'http';

const yosSampleService = await import('../yos-sample/serverindex.mjs');
const yosTestService = await import('../yos-test/serverindex.mjs');

// Otra opción quizá
const yosTestServiceProxy = new Proxy(8081, 'localhost');
const yosTest2ServiceProxy = new Proxy(8082, 'localhost');

const routerMap=new Map();

function app(request, response) {
  const pathName=new URL(request.url, 'http://localhost').pathname;
  Array.from(routerMap.values()).some(myFunc=>myFunc(request, response));
}

routerMap.set('redirect', (request, response)=>{
  let pathName=new URL(request.url, 'http://localhost').pathname;
  if (pathName.match(/^\/(sample|test)$/)) {
    response.writeHead(301, {
      Location: `${pathName}/`
    }).end();
    return true;
  }
});

routerMap.set('yos-sample', (request, response)=>{
  let pathName=new URL(request.url, 'http://localhost').pathname;
  if (pathName.match(/^\/(sample|sample)\//)) {
    // removing the basePath of the url pathName
    request.url = request.url.replace(pathName.match(/^\/(sample|sample)\//)[0], '/');
    yosSampleService(request, response);
    return true;
  }
});

routerMap.set('yos-test', (request, response)=>{
  let pathName=new URL(request.url, 'http://localhost').pathname;
  if (pathName.match(/^\/(test|test)\//)) {
    // removing the basePath of the url pathName
    request.url = request.url.replace(pathName.match(/^\/(test|test)\//)[0], '/');
    yosTestService(request, response);
    return true;
  }
});

const serverPort='8001';

http.createServer(app).listen(serverPort, ()=>console.log("app running at port: ",  serverPort));
```

Al crear el contenedor habría que crear volúmenes para cada una de las insatalaciones
- "/var/lib/yos/sample/images:/home/yos-sample/catalog-images" 
- "/var/lib/yos/sample/logs:/home/yos-sample/logs"
- "/var/lib/yos/test/images:/home/yos-test/catalog-images" 
- "/var/lib/yos/test/logs:/home/yos-test/logs"

Tambien se podria compartir un mismo directorio en el volumen cambiando los paths en las configuraciones:
catalogImagesPath: "/home/catalog-images/sample", reportsFilePath: "/home/logs/logs-sample.txt", etc...
- "/var/lib/yos/images:/home/catalog-images"
- "/var/lib/yos/logs:/home/logs"
Y crear el directorio /var/lib/yos/images/sample, /var/lib/yos/images/test

Para ejecutar instancias de yos desde otro directorio, por ejemplo el de yos-index, se podria hacer cambiando los paths en la configuración del server:
layoutsPath: "instancePath/layouts", etc...

He visto tambien otra posibilidad mediante change directory:
`process.chdir(instancePath);
import(instancePath + '/serverindex.mjs') // process.chdir no tiene efecto en import` 
El efecto es sobre los paths (relativos) no utilizados por import. Sin embargo podria dar problemas de concurrencia nuevamente al ser algo común a todas las instancias.

Tambien se puede seguir haciendo con el proxy, ejecutando instancias diferentes para cada copia y uniendolas con un proxy, de esta manera nos olvidamos del tema del directorio actual ya que cada una se instancia desde su directorio.

También se podría hacer que el script en yos-index fuera el que creara copias de yos-instance por cada uno de los sitios y se configurara. Para ello se podrían guardar los datos de las instancias previamente (en el volumen) y al iniciar el script haria las copias correspondientes o usar la base de datos.


