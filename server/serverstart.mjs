import config from './cfg/mainserver.mjs';
import {initDb} from './dbgateway.mjs';
import {startThemes} from './themesserver.mjs';

export default async function initServer(){
	console.log("initalizing server");
	await initDb(); // Ver si produce errores y mostrar errores
	startThemes(config.defaultThemeId);
}