import { getGlobalThis } from './get-global-this';
import { apiZonePatched } from './zone-checks';
/**
 * getZoneUnPatchedApi
 *
 * @description
 *
 * This function returns the zone un-patched API for the a specific Browser API.
 * If no element is passed the window is used instead
 *
 * @param name {string} - The name of the API to check.
 * @param elem {any} - The elem to get un-patched API from.
 * @return {Function} - The zone un-patched API in question.
 *
 */
export function getZoneUnPatchedApi(name, elem) {
    elem = elem || getGlobalThis();
    return apiZonePatched(name) ? elem['__zone_symbol__' + name] : elem[name];
}
/**
 *
 * @description
 *
 * This function takes an elem and event and re-applies the listeners from the passed event to the
 * passed element with the zone un-patched version of it.
 *
 * @param elem {HTMLElement} - The elem to re-apply the listeners to.
 * @param event {string} - The name of the event from which to re-apply the listeners.
 *
 * @returns void
 */
export function unpatchEventListener(elem, event) {
    var eventListeners = elem.eventListeners(event);
    // Return if no event listeners are present
    if (!eventListeners) {
        return;
    }
    var addEventListener = getZoneUnPatchedApi('addEventListener', elem).bind(elem);
    eventListeners.forEach(function (listener) {
        // Remove and reapply listeners with patched API
        elem.removeEventListener(event, listener);
        // Reapply listeners with un-patched API
        addEventListener(event, listener);
    });
}
//# sourceMappingURL=make-zone-less.js.map