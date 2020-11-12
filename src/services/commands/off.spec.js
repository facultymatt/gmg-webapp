// /**
//  * @jest-environment node
//  */

import off, { URL as OFF_URL } from "./off";

describe("off", () => {
  let code;
  beforeEach(() => {
    code = "123";
    fetch.mockResponseOnce(
      JSON.stringify({
        message: "Confirm you want send command off by visiting this link now",
        link: `${OFF_URL}?code=${code}`,
        code,
      })
    );
  });
  it("works", async () => {
    const result = await off();
    expect(result.message.includes("Confirm")).toEqual(true);
    expect(result.link.includes(OFF_URL)).toEqual(true);
    expect(result.code).toEqual(code);
  });
});
