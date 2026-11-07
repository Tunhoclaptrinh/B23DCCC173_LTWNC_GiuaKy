export type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

export function isApiSuccess<T>(
  response: ApiResponse<T>,
): response is Extract<ApiResponse<T>, { ok: true }> {
  return response.ok;
}
