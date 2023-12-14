//cfg momey format: currency
import {config} from './cfg.mjs'
import {getCurrentLanguage} from './languages/languages.mjs'

export function intToMoney(moneyValue) {
  const locale = config.get("currency-code-locale") ? config.get("locale-Currency") : getCurrentLanguage()
  moneyValue = moneyValue / 100
  return new Intl.NumberFormat(locale, {style: 'currency', currency: config.get("currency-code")}).format(moneyValue)
}

export function moneyToInt(stringNumber) {
  const locale=config.get("currency-code-locale") ? config.get("locale-currency") : getCurrentLanguage()
  return Math.round(parseLocaleNumber(stringNumber, locale) * 100)
}

function parseLocaleNumber(stringNumber='0', locale) {
  // regex note:  // Two bars become one: '\\' => \. \p{Number} match any number also in chinese etc...
  const decimalSeparator = Intl.NumberFormat(locale).format(1.1).replace(/\p{Number}/gu, '') || ','
  const thousandSeparator = Intl.NumberFormat(locale).format(11111).replace(/\p{Number}/gu, '') || '.'

  return parseFloat(stringNumber
    .replace(new RegExp('[^\\d' + '\\' + decimalSeparator + ']', 'g'), '')
    .replace(new RegExp('\\' + decimalSeparator), '.')
  );
}