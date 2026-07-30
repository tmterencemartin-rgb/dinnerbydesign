export interface EmailDeliveryResult {
  ok?: boolean;
  simulated?: boolean;
  delivered?: boolean;
}

export function isConfirmedEmailDelivery(
  result: EmailDeliveryResult | null | undefined
): boolean {
  return result?.ok === true
    && result.simulated !== true
    && result.delivered !== false;
}

export function getSimulatedEmailResult() {
  return {
    ok: false,
    delivered: false,
    simulated: true,
    error: {
      code: "EMAIL_NOT_DELIVERED",
      message: "The email provider did not confirm delivery."
    }
  } as const;
}
