/**
 * Shortcut to add plugin safely.
 * Disable this plugin = comment <script> tag in index.html
 * NOTE: If game.config.enableDebug = false -> game.debug can't be used
 *
 * @param plugin
 * @param parameter
 * @returns Added plugin
 */
export function addOptionalPlugin (plugin, parameter) {
    if (plugin) {
        return game.add.plugin( plugin, parameter );
    }
    return null;
}
//-----------------------------------------------------------------------------------------------------------
/**
 * @param plugin : plugin class
 * @returns Found plugin
 */
export function getPlugin (plugin) {
    if (!plugin) {
        return null;
    }
    var ps = game.plugins.plugins;
    var pp = plugin.prototype;
    for (var i = ps.length - 1; i >= 0; --i) {
        if (pp.isPrototypeOf( ps[i] )) {
            return ps[i];
        }
    }
    return null;
}
//-----------------------------------------------------------------------------------------------------------
/**
 * @param min: minimum number
 * @param max: maximim number
 * @returns Random number in the range of [min, max]
 */
export function randomRange (min, max) {
    if (min >= max) return min;
    return Math.random() * (max - min) + min;
}
//-----------------------------------------------------------------------------------------------------------
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//-----------------------------------------------------------------------------------------------------------
/**
 * Returns a number whose value is limited to the given range.
 *
 * Example: limit the output of this computation to between 0 and 255
 * (x * 255).clamp(0, 255)
 *
 * @param {Number} min The lower boundary of the output range
 * @param {Number} max The upper boundary of the output range
 * @returns A number in the range [min, max]
 * @type Number
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
//-----------------------------------------------------------------------------------------------------------
/**
 * Check the assumption and throw an error if it's incorrect.
 * NOTE: We can't ignore export function call in JS.
 * So you need to strip assert calls manually for release build (by commenting for example)
 * @param   condition
 * @param   message
 */
export function assert (condition, message) {
    if (!condition) {
        message = message || 'Assertion failed';
        if (typeof Error !== "undefined") {
            throw new Error(message);
        }
        throw message; // Fallback
    }
}
/**
 * Check the assumption that 2 values are equal and throw an error if it's incorrect.
 * NOTE: We can't ignore export function call in JS.
 * So you need to strip assert calls manually for release build (by commenting for example)
 * @param   actual
 * @param   expect
 * @param   message
 */
//-----------------------------------------------------------------------------------------------------------
export function assertEqual (actual, expect, message) {
    message = message || ('Assertion failed: ' + actual + ' should = ' + expect);
    assert( actual == expect, message );
}
//-----------------------------------------------------------------------------------------------------------
/**
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
export function shuffle (a) {
    var k, x, i;
    for (i = a.length - 1; i > 0; i--) {
        k    = Math.floor(Math.random() * (i + 1));
        x    = a[i];
        a[i] = a[k];
        a[k] = x;
    }
    return a;
}
//-----------------------------------------------------------------------------------------------------------
export function removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}
//-----------------------------------------------------------------------------------------------------------
export function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}