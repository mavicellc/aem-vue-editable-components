/**
 * Returns a MutationObserver instance where a verify condition can be provided. When the condition is satisfied the callback function is called
 *
 * @param verify function which verify the processed object
 * @param callback function to be called when the verification succeed
 */
export declare function getVerifyObserver(verify: any, callback: any): MutationObserver;
/**
 * Observers if the provided map of data attributes is available on one of the target element of the list of mutations
 *
 * @param attributes map of attributes and value to be found on the target element
 * @param selector selector for querying a specific element
 * @param callback function to be called when the verification succeed
 */
export declare function getDataAttributesObserver(attributes: any, selector: any, callback: any): MutationObserver;
//# sourceMappingURL=Utils.d.ts.map