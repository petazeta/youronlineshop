Bulk start setup
================

Aplicación (extensión) que se utilizaría como entrada y de esta manera podría manejar las instancias.

Partiendo de la unos datos de "start" en la base de datos realizaría copias de yos_instances y las ejecutaría. De esta manera ejecutaría un multitienda de forma automática.

setup json file o quiza bd:
{appName, [ports]}
El nombre de aplicación en package.json (las tomaria de un directorio, por ejemplo apps_source)

Crearia copia de la instancia en el directorio server_instances en una carpeta llamada: nombre_aplicacion_puerto y la importaría y ejecutaría



-- old --
Instance manager

Esto mejor hacerlo con dbmanager

muestra una lista de las instancias:
identificador, name, main path, server instance

 y permitiría:
 eliminar: server.close(), abrir una existente http.createServer(path).listen(port), crear copia : copy instance files

 Utilizaria datos de package.json para cada instancia

 archivos:
 ./server/instances.mjs'