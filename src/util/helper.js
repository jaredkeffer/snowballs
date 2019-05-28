export function addQueryParamsToPath(path, queryParams) {
  let finalPath = `${path}?`;
  Object.keys(queryParams).forEach(key => {
    finalPath += `${String(key)}=${String(queryParams[key])}`
  });
  return finalPath;
}
