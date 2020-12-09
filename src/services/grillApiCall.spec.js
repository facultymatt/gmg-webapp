// /**
//  * @jest-environment node
//  */

import { ON, OFF } from "./../constants/api-urls";
import grillApiCall from "./grillApiCall";

describe("grillApiCall", () => {
  beforeEach(() => {
    fetch.mockReset();
  })
  describe("OFF", () => {
    let code;
    it("works to confirm", async () => {
      code = "123";
      fetch.mockResponseOnce(
        JSON.stringify({
          message:
            "Confirm you want send command off by visiting this link now",
          link: `${OFF}?code=${code}`,
          code,
        })
      );
      const confirmFn = await grillApiCall(OFF);
      fetch.mockResponseOnce(
        JSON.stringify({
          message: "Sent command off to grill",
        })
      );
      const result2 = await confirmFn(true);
      expect(result2.message.includes("Sent command")).toEqual(true);
    });
    it("works to NOT confirm", async () => {
      code = "123";
      fetch.mockResponseOnce(
        JSON.stringify({
          message:
            "Confirm you want send command off by visiting this link now",
          link: `${OFF}?code=${code}`,
          code,
        })
      );
      const confirmFn = await grillApiCall(OFF);
      const result2 = await confirmFn(false);
      expect(result2.message.includes("disregarded")).toEqual(true);
    });
  });

  describe("ON", () => {
    it("works to confirm", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      await grillApiCall(ON);
      expect(fetch.mock.calls[0][0]).toEqual(ON);
    });
  });

  describe("NO URL", () => {
    it("works to confirm", async () => {
      fetch.mockResponseOnce(JSON.stringify({}));
      const response = await grillApiCall();
      expect(response.message).toEqual('Invalid command url')
    });
  });
});
