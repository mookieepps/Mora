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
  return "Something went wrong. Please try again.";
}
