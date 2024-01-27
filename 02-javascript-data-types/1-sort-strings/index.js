/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const compareFunc = param == 'asc' ? stringLocalCompare : stringLocalCompareReverse;

  return [...arr].sort(compareFunc);
}

function stringLocalCompare(a, b) {
  return a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
}

function stringLocalCompareReverse(a, b) {
  return stringLocalCompare(a, b) * -1;
}