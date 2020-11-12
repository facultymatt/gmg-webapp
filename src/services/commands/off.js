export const URL = `http://${window.location.hostname}:3000/command/power/off`;

export default function () {
  return fetch(URL).then((response) => response.json());
}
