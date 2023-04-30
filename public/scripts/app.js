// Client facing scripts here
// Returns search value for given search parameter
const getParam = (param) => {
  const params = new URL(window.location).searchParams;
  return params.get(param);
}