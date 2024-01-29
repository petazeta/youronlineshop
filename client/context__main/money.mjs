//cfg momey format: currency
import {config} from './cfg.mjs'
import {getCurrentLanguage} from './languages/languages.mjs'

export function intToMoney(moneyValue, currencyCode) {
  if (!currencyCode)
    currencyCode = config.get("currency-code")
  const locale = config.get("currency-locale") || getCurrentLanguage()
  moneyValue = moneyValue / 100
  return new Intl.NumberFormat(locale, {style: 'currency', currency: currencyCode}).format(moneyValue)
}

export function moneyToInt(stringNumber) {
  const locale = config.get("currency-locale") || getCurrentLanguage()
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

export function getCurrencyCode(){
  return config.get("currency-code")
}