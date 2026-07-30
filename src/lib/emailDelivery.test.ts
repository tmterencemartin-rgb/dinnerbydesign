import { describe, expect, it } from "vitest";
import {
  getSimulatedEmailResult,
  isConfirmedEmailDelivery,
} from "./emailDelivery";

describe("email delivery confirmation", () => {
  it("accepts a confirmed provider delivery", () => {
    expect(isConfirmedEmailDelivery({ ok: true })).toBe(true);
  });

  it("does not accept a simulated response as delivery", () => {
    expect(isConfirmedEmailDelivery({
      ok: true,
      simulated: true,
    })).toBe(false);
  });

  it("returns a simulated response that cannot be mistaken for delivery", () => {
    const result = getSimulatedEmailResult();

    expect(result).toMatchObject({
      ok: false,
      delivered: false,
      simulated: true,
      error: {
        code: "EMAIL_NOT_DELIVERED",
      },
    });
    expect(isConfirmedEmailDelivery(result)).toBe(false);
  });
});
