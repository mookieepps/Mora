export function authFacingError(error: unknown): string {
  const message =
    typeof error === "object" && error && "message" in error
      ? String((error as { message: unknown }).message).toLowerCase()
      : "";

  if (message.includes("already registered") || message.includes("already been registered")) {
    return "An account with that email already exists. Try signing in.";
  }
  if (message.includes("invalid login") || message.includes("invalid credentials")) {
    return "That email or password is not right.";
  }
  if (message.includes("email not confirmed") || message.includes("not confirmed")) {
    return "Check your email to confirm your account, then sign in.";
  }
  if (message.includes("password should be") || message.includes("password is known")) {
    return "Choose a stronger password with at least 8 characters.";
  }
  if (message.includes("invalid email") || message.includes("unable to validate email")) {
    return "Enter a valid email address.";
  }
  if (message.includes("signup is disabled")) {
    return "New accounts are turned off right now.";
  }
  return "Something went wrong. Please try again.";
}
