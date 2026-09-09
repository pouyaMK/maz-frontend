export const BASE_URL = "https://mazeverest.ir";

const TOKEN_KEY = "maz_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function buildVideoUrl(nameEn: string | null | undefined): string | undefined {
  if (!nameEn) return undefined;
  return `${BASE_URL}/videos/${encodeURIComponent(nameEn)}.mp4`;
}

export class ApiError extends Error {
  status: number;
  detail?: unknown;

  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

// نتیجه‌ی یه درخواست به همراه هدرهای پاسخ، برای مواقعی که خودِ هدر هم
// لازم باشه (مثلاً X-Total-Count برای صفحه‌بندی)
interface ResponseWithHeaders<T> {
  data: T;
  headers: Headers;
}

async function requestWithHeaders<T>(
  path: string,
  options: RequestOptions = {}
): Promise<ResponseWithHeaders<T>> {
  const { auth, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    ...(headers as Record<string, string>),
  };

  if (rest.body && !(rest.body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) {
      finalHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(`${BASE_URL}${normalizedPath}`, {
    ...rest,
    headers: finalHeaders,
  });

  if (auth && res.status === 401) {
    clearToken();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  // بدنه خالی (مثل 204) رو هندل کن
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    throw new ApiError(
      res.status,
      (data && data.detail && String(data.detail)) || `درخواست ناموفق (${res.status})`,
      data?.detail
    );
  }

  return { data: data as T, headers: res.headers };
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { data } = await requestWithHeaders<T>(path, options);
  return data;
}

// ---------- types (طبق اسکیمای دیتابیس/سواگر) ----------

export interface InvitePublic {
  id: number;
  code: string;
  slug: string;
  name: string;
  name_en: string;
  invite_url: string;
  video_url: string;
  attending: boolean | null;
  phone: string | null;
  rsvp_at: string | null;
}

export interface RsvpPayload {
  attending: boolean;
  phone?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    username: string;
    full_name: string;
    role: string;
  };
}

export interface AdminParticipant {
  id: number;
  code: string;
  slug: string;
  invite_url: string;
  row_no: number;
  name: string;
  name_en: string;
  org_unit: string;
  is_vip: boolean;
  phone: string | null;
  attending: boolean | null;
  rsvp_at: string | null;
  checked_in: boolean;
  check_in_at: string | null;
  checked_in_by: string | null;
}

export interface EventStats {
  total: number;
  attending: number;
  not_attending: number;
  no_response: number;
  checked_in: number;
  not_checked_in: number;
  vip_total: number;
  vip_checked_in: number;
}

export interface CheckInResponse {
  already_checked_in: boolean;
  participant: AdminParticipant;
}

// پاسخ اندپوینت لغو چک‌این (DELETE) — was_checked_in یعنی قبل از این
// درخواست وضعیتش چی بوده (برای تشخیص no-op از تغییر واقعی)
export interface UndoCheckInResponse {
  was_checked_in: boolean;
  participant: AdminParticipant;
}

export interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  errors: unknown[];
}

// پارامترهای جستجو/فیلتر لیست مهمون‌ها.
// checked_in و is_vip سه‌حالته‌اند: undefined یعنی فیلتر نشده، true/false
// یعنی دقیقاً همون مقدار فیلتر بشه (طبق مستندات بک‌اند).
export interface SearchParticipantsParams {
  q?: string;
  checked_in?: boolean;
  is_vip?: boolean;
  limit?: number;
  offset?: number;
}

// نتیجه‌ی جستجو به‌همراه تعداد کل مطابقت‌ها (از هدر X-Total-Count) تا
// بشه صفحه‌بندی واقعی ساخت، نه فقط اندازه‌ی همون صفحه‌ی فعلی.
export interface SearchParticipantsResult {
  items: AdminParticipant[];
  total: number;
}

// ---------- Public: invites ----------

export function getInvite(codeOrSlug: string) {
  return request<InvitePublic>(`/api/invites/${encodeURIComponent(codeOrSlug)}`);
}

export function submitRsvp(codeOrSlug: string, payload: RsvpPayload) {
  return request<InvitePublic>(`/api/invites/${encodeURIComponent(codeOrSlug)}/rsvp`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ---------- Auth ----------

export function login(payload: LoginPayload) {
  return request<LoginResponse>(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe() {
  return request<LoginResponse["user"]>(`/api/auth/me`, { auth: true });
}

// ---------- Admin: event ----------

// جستجو/فیلتر لیست مهمون‌ها. حالا فیلترها سمت سرور اعمال می‌شن، نه روی
// نتایج محلی، پس درست کار می‌کنه حتی وقتی تعداد کل مهمون‌ها از یه صفحه
// بیشتر باشه. تعداد کل مطابقت‌ها هم از هدر X-Total-Count خونده می‌شه.
export async function searchParticipants(
  params: SearchParticipantsParams = {}
): Promise<SearchParticipantsResult> {
  const { q, checked_in, is_vip, limit = 50, offset = 0 } = params;

  const query = new URLSearchParams();
  if (q) query.set("q", q);
  // فقط وقتی که واقعاً مقدار داده شده باشه ست کن؛ چون undefined یعنی
  // "فیلتر نکن" و نباید اصلاً تو query ظاهر بشه.
  if (checked_in !== undefined) query.set("checked_in", String(checked_in));
  if (is_vip !== undefined) query.set("is_vip", String(is_vip));
  query.set("limit", String(limit));
  query.set("offset", String(offset));

  const { data, headers } = await requestWithHeaders<AdminParticipant[]>(
    `/api/event/participants?${query.toString()}`,
    { auth: true }
  );

  const totalHeader = headers.get("X-Total-Count");
  // اگه به هر دلیلی هدر نبود (مثلاً پروکسی حذفش کرده)، حداقل طول همین
  // صفحه رو به‌عنوان fallback در نظر بگیر تا UI نشکنه.
  const total = totalHeader !== null ? Number(totalHeader) : data.length;

  return { items: data, total: Number.isFinite(total) ? total : data.length };
}

export function getParticipant(invitationId: number) {
  return request<AdminParticipant>(`/api/event/participants/${invitationId}`, {
    auth: true,
  });
}

export function checkIn(invitationId: number) {
  return request<CheckInResponse>(`/api/event/participants/${invitationId}/check-in`, {
    method: "POST",
    auth: true,
  });
}

// لغو چک‌این (اصلاح خطای اسکن اشتباه در لحظه). Idempotent است: لغو یه
// چک‌این که از قبل لغو شده، خطا نمی‌ده و فقط was_checked_in: false برمی‌گرده.
export function undoCheckIn(invitationId: number) {
  return request<UndoCheckInResponse>(`/api/event/participants/${invitationId}/check-in`, {
    method: "DELETE",
    auth: true,
  });
}

export function getStats() {
  return request<EventStats>(`/api/event/stats`, { auth: true });
}

export function getReportCsvUrl() {
  // این اندپوینت فایل برمی‌گردونه، بهتره مستقیم به عنوان لینک دانلود استفاده بشه
  return `${BASE_URL}/api/event/report.csv`;
}

export function getReportXlsxUrl() {
  return `${BASE_URL}/api/event/report.xlsx`;
}

export function importGuests(file: File, mode: "upsert" | "skip" = "upsert") {
  const form = new FormData();
  form.append("file", file);
  return request<ImportResult>(`/api/event/import?mode=${mode}`, {
    method: "POST",
    auth: true,
    body: form,
  });
}

export function health() {
  return request<string>(`/health`);
}