const array_to_get = ({array}) => {
  /*
   * array sample:
   *
   * let input = [];
   * input.push({var: 'something', val: 'some_vallue'});
   *
   * */
  let result = [];
  array.forEach(line => {
    result.push(`${encodeURIComponent(line.var)}=${encodeURIComponent(line.val)}`);
  });
  return result.join('&');
};

export {array_to_get};
