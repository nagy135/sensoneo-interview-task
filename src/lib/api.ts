export type ApiErrorResponse = {
  success: false;
  error: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function getStringField(obj: unknown, key: string): string | undefined {
  if (!isRecord(obj)) return undefined;
  const v = obj[key];
  return typeof v === "string" && v ? v : undefined;
}

function getApiBaseUrl() {
  const fromEnv = (
    import.meta as unknown as { env?: Record<string, string | undefined> }
  ).env?.VITE_API_URL;
  return fromEnv ?? "http://localhost:3001";
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  async function extractErrorMessage() {
    try {
      const data: unknown = await res.clone().json();
      const err = getStringField(data, "error");
      if (err) return err;
      const msg = getStringField(data, "message");
      if (msg) return msg;
    } catch {
      // ignore JSON parse errors
    }

    try {
      const text = await res.clone().text();
      if (text) return text;
    } catch {
      // ignore body read errors
    }
    return `Request failed (${res.status})`;
  }

  if (!res.ok) {
    const message = await extractErrorMessage();
    throw new ApiError(message, res.status);
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    throw new ApiError(`Invalid JSON response (${res.status})`, res.status);
  }

  if (!isRecord(json) || json.success !== true) {
    const message =
      getStringField(json, "error") ??
      getStringField(json, "message") ??
      `Request failed (${res.status})`;
    throw new ApiError(String(message), res.status);
  }

  return json as T;
}

export function apiGet<T>(path: string, init?: RequestInit) {
  return apiRequest<T>(path, { ...init, method: "GET" });
}

export function apiPost<T>(
  path: string,
  body: unknown,
  init?: Omit<RequestInit, "body" | "method">,
) {
  return apiRequest<T>(path, {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: JSON.stringify(body),
  });
}
