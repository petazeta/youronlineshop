
import config from './cfg/mainserver.mjs';
import SiteTheme, {decodeCssImageUrlPath} from './../shared/server/themes.mjs';

const myTheme = new SiteTheme(config.layoutsPath);

export function startThemes(themeId) {
  return myTheme.readTree(themeId);
}

export function getTemplatesContent(themeId, subthemeId) {
  return myTheme.getContent(themeId, subthemeId);
}

export function getTemplate(tpId, themeId, subthemeId) {
  return myTheme.getTpContent(tpId, themeId, subthemeId);
}

export function getCssContent(styleId, themeId, subThemeId) {
  return myTheme.getCssContent(styleId, themeId, subThemeId)
}

export function getCssImagePathFromUrlPath(imageUrlPath) {
  const imageData=decodeCssImageUrlPath(imageUrlPath);
  return myTheme.getCssImagePath(imageData.get('imageId'), imageData.get('themeId'), imageData.get('subThemeId'));
}
