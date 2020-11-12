// /**
//  * @jest-environment node
//  */

import off, { URL as OFF_URL } from "./off";

describe("off", () => {
  let code;
  beforeEach(() => {
    
  });
  it("works to confirm", async () => {
    code = "123";
    fetch.mockResponseOnce(
      JSON.stringify({
        message: "Confirm you want send command off by visiting this link now",
        link: `${OFF_URL}?code=${code}`,
        code,
      })
    );
    const confirmFn = await off();
    fetch.mockResponseOnce(
      JSON.stringify({
        message: "Sent command off to grill"
      })
    );
    const result2 = await confirmFn(true);
    expect(result2.message.includes("Sent command")).toEqual(true);
  });
  it("works to NOT confirm", async () => {
    code = "123";
    fetch.mockResponseOnce(
      JSON.stringify({
        message: "Confirm you want send command off by visiting this link now",
        link: `${OFF_URL}?code=${code}`,
        code,
      })
    );
    const confirmFn = await off();
    const result2 = await confirmFn(false);
    expect(result2.message.includes("disregarded")).toEqual(true);
  });
});
