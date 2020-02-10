export class ODataSingleResult<T> {
  public '@odata.context': string;

  /**
   * The '@odata.context' variable returned by the OData service
   */
  get Context(): string {
    return this['@odata.context'];
  }

  /**
   * The query result in an array
   */
  public value: T = undefined;
}
