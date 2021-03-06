/* eslint import/prefer-default-export: 0 */ // This file does not have a default export

/**
 * Pair of network name and 'class' (dev, test, staging, main)
 * Taken from https://ethereum.stackexchange.com/questions/17051/how-to-select-a-network-id-or-is-there-a-list-of-network-ids
 */
export const ETHEREUM_NETWORKS_NAMES: { [id: number]: string[] } = {
  0: ['Olympic', 'main'],
  1: ['Mainnet', 'main'],
  2: ['Morden', 'staging'],
  3: ['Ropsten', 'staging'],
  4: ['Rinkeby', 'staging'],
  1984: ['Winston', 'test'],
}

/**
 * Returns a page title to be used within HTML <title> tags.
 * @param title
 * @returns {string}
 */
export const pageTitle = (title: string) => {
  let pageTitle = ''
  if (title) pageTitle += `${title} | `
  return (pageTitle += "Unlock: The Web's new business model")
}

const accountRegex = '0x[a-fA-F0-9]{40}'

// private helpers for the LOCK_PATH_NAME_REGEXP
const prefix = '[a-z0-9]+'
const urlEncodedUrl = '[^#?]+'
const lockAddress = accountRegex

/**
 * This regexp matches several important parameters passed in the url for the demo and paywall pages.
 *
 * '/demo/0x42dbdc4CdBda8dc99c82D66d97B264386E41c0E9/'
 *   will extract 'demo' and the lock address as match 1 and 2
 * '/demo/0x42dbdc4CdBda8dc99c82D66d97B264386E41c0E9/http%3A%2F%2Fexample.com'
 *   will extract the same variables, and also the url-encoded redirect URL 'http://example.com' as match 4
 * '/paywall/0x42dbdc4CdBda8dc99c82D66d97B264386E41c0E9/#0xabcddc4CdBda8dc99c82D66d97B264386E41c0E9'
 *   will extract the 'paywall' and lock address as match 1 and 2 and the account address as match 6
 *
 * You should not use this directly, instead use the utils/routes.js lockRoute function
 */
export const LOCK_PATH_NAME_REGEXP = new RegExp(
  `(?:/(${prefix}))?/(${lockAddress})(?:/(${urlEncodedUrl})/?)?`
)

export const PAGE_DESCRIPTION =
  'Unlock is a protocol which enables creators to monetize their content with a few lines of code in a fully decentralized way.'

export const PAGE_DEFAULT_IMAGE =
  'https://unlock-protocol.com/static/images/pages/png/simple.png'

export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export const MAX_DEVICE_WIDTHS = {
  PHONE: 736,
  TABLET: 1000,
  DESKTOP: false,
}
