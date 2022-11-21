/* eslint-disable import/prefer-default-export */
export function convertNullToUndefined(payload: any): any {
  return Object.entries(payload).reduce((accumulator, [key, value]) => {
    accumulator[key] = value ?? undefined;

    return accumulator;
  }, {} as any);
}
