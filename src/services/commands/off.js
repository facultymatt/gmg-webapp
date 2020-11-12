import { reject } from "lodash";

export const URL = `http://${window.location.hostname}:3000/command/power/off`;

export default async function () {
  const confirmResponse = await fetch(URL).then((r) => r.json());
  const { link } = confirmResponse;
  return async function (confirm) {
    if (confirm === true) {
      return await fetch(link).then((r) => r.json());
    }
    return Promise.resolve({ message: "Command disregarded" });
  };
}
