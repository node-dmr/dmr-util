/*
 * @Author: qiansc
 * @Date: 2018-10-17 10:42:16
 * @Last Modified by: qiansc
 * @Last Modified time: 2018-10-17 17:31:42
 */
export function isExpLike(expLike: string): (boolean | RegExpMatchArray) {
  const matches = expLike.match(/^`.*`$/);
  if (matches) {
    return matches;
  }
  return false;
}

export function resolve(expLike: string): StringExpression {
  const matches = isExpLike(expLike);
  if (!matches) {
    return (scope: {[index: string]: any}) => expLike;
  } else {
    return (scope: {[index: string]: any}) => {
      const keys: string[] = [];
      const values: any[] = [];
      Object.keys(scope).forEach((key) => {
        keys.push(key);
        values.push(scope[key]);
      });
      let func: (...value: any []) => string;
      func = eval.call (null, `(${keys.join(",")}) => ${expLike}`);
      return func(...values);
    };
  }
}

export function resolveBoolean(expLike: string): BooleanExpression {
  return (scope: {[index: string]: any}) => {
    const rs = resolve(expLike)(scope);
    if (rs === "true") {
      return true;
    }
    return false;
  };
}

export function resolveNumber(expLike: string): NumberExpression {
  return (scope: {[index: string]: any}) => {
    const rs = resolve(expLike)(scope);
    return parseFloat(rs);
  };
}

export type StringExpression = (scope: {[index: string]: any}) => string;
export type BooleanExpression = (scope: {[index: string]: any}) => boolean;
export type NumberExpression = (scope: {[index: string]: any}) => number;
