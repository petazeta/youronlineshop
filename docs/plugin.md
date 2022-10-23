Write extensions
================

Crear código extensible podria ser sencillo en mi aplicación. Yo creo que lo más inmediato sería copiar todo el código antiguo en una carpeta de backup y después reemplazar todo el código. También hay que tener en cuenta que el layout se podría simplemente utilizar como un programa y en ese caso bastaría copiar lo nuevo com on subtheme/sublayout.

Una forma más elegante de hacer esto es mediante el uso de path en git:
git format-patch -<n> <SHA-1> --stdout > <name_of_patch_file>.patch 
	git format-patch -10 HEAD --stdout > 0001-last-10-commits.patch

	Apply the patch with the command:

git am < file.patch

Otra estrategia podría ser mediante uno o varios layouts se incluye el codigo del plugin, luego habría que añadir en cada uno de los layouts originales un código que cargara el el layout del plugin entero y realizara las operaciones. De esta forma habría que copiar solo una línea en el layout original y el resto del código quedaría en los layouts del plugin facilitando las actualizaciones.