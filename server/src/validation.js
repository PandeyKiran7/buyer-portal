const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(body) {
  const errors = [];
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!email) errors.push({ field: "email", message: "Email is required." });
  else if (!EMAIL_RE.test(email))
    errors.push({ field: "email", message: "Email format is invalid." });

  if (!password) errors.push({ field: "password", message: "Password is required." });
  else if (password.length < 8)
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters.",
    });

  if (!name) errors.push({ field: "name", message: "Name is required." });
  else if (name.length > 120)
    errors.push({ field: "name", message: "Name is too long." });

  return { ok: errors.length === 0, errors, value: { email, password, name } };
}

export function validateLogin(body) {
  const errors = [];
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email) errors.push({ field: "email", message: "Email is required." });
  if (!password) errors.push({ field: "password", message: "Password is required." });

  return { ok: errors.length === 0, errors, value: { email, password } };
}

export function parsePropertyId(raw) {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) return null;
  return n;
}
