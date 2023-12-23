/**
 * A ParserResult is the result of applying a layer of BlogParser.
 * 
 * @export
 * @class ParserResult
 */
export class ParserResult {
    /**
     * scripts are scripts to be added to the local script tag
     *
     * @type {string[]}
     * @memberof ParserResult
     */
    scripts: string[] = [];
}