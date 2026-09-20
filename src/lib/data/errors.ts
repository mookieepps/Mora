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
  if (error instanceof Error && error.message === "duplicate_phone") {
    return "That phone number is already on your list.";
  }
  if (error instanceof Error && error.message === "opt_in_not_found") {
    return "This opt-in link is not valid.";
  }
  if (error instanceof Error && error.message === "opt_in_phone_mismatch") {
    return "Enter the phone number this invitation was sent for.";
  }
  if (error instanceof Error && error.message === "opt_in_not_checked") {
    return "Check the box if you want to receive text messages.";
  }
  return "Something went wrong. Please try again.";
}
