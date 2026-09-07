export class MoraConfigError extends Error {
  constructor() {
    super("Supabase is not configured.");
    this.name = "MoraConfigError";
  }
}

export function userFacingError(error: unknown): string {
  if (error instanceof MoraConfigError) {
    return "Mora is not connected to the database yet. Add your Supabase keys and try again.";
  }
  if (error instanceof Error && error.name === "PhotoError") {
    return error.message;
  }
  if (error instanceof Error && error.message === "sms_consent_required") {
    return "Confirm that this person agreed to receive texts before adding them.";
  }
  if (error instanceof Error && error.message === "sms_consent_required_bulk") {
    return "Confirm these people agreed to receive texts before adding them.";
  }
  if (error instanceof Error && error.message === "duplicate_phone") {
    return "That phone number is already on your list.";
  }
  return "Something went wrong. Please try again.";
}
