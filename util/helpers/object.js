const lenspath = (object, path) => {
  let keys = path.split('.');
  let result = object;
  for (const key of keys) {
    if (result && result[key]) {
      result = result[key];
    } else {
      result = null;
      break;
    }
  }

  return result;
}

export { lenspath }
