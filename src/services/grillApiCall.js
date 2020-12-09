/**
 * Request command of grill, returns function that when called with `true`
 * will complete the command. With `false`, will disregard.
 *
 * @param {string} url
 * @return {async function}
 */
export default async function gmgApiCall(url) {
  if (!url) {
    return Promise.resolve({ message: "Invalid command url" });
  }
  const request = await fetch(url).then((r) => r.json());
  const { link } = request;
  return async function (confirm) {
    if (confirm === true) {
      return await fetch(link).then((r) => r.json());
    }
    return Promise.resolve({ message: "Command disregarded", request });
  };
}
