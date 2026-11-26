// All reads/writes go to the FastAPI SERVER, never to browser localStorage.
// Default to the current website origin (/api). Use VITE_API_URL only when
// the frontend and backend are deliberately hosted on different origins.
const configuredApi = String(import.meta.env.VITE_API_URL || "")
  .trim()
  .replace(/\/+$/, "");
const isLoopback = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ["localhost", "127.0.0.1", "::1", "[::1]"].includes(
      parsed.hostname.toLowerCase(),
    );
  } catch {
    return false;
  }
};
if (import.meta.env.PROD && configuredApi && isLoopback(configuredApi)) {
  throw new Error(
    "Invalid production VITE_API_URL: localhost points to the visitor computer. Use /api or your public server API URL.",
  );
}
const API = configuredApi || "/api";
const API_BASE = API.endsWith("/api") ? API.slice(0, -4) : API;
export const ORG_ID = import.meta.env.VITE_ORGANIZATION_ID || "";
export const mediaUrl = (value: string = ""): string => {
  const clean = String(value || "")
    .trim()
    .replace(/\\/g, "/");
  if (!clean) return "";
  // Saved /uploads/ references must point to the same server as the API.
  // Also correct legacy absolute localhost media links in old JSON records.
  if (/^https?:\/\//i.test(clean)) {
    try {
      const parsed = new URL(clean);
      if (!isLoopback(clean)) return clean;
      if (parsed.pathname.startsWith("/uploads/"))
        return `${API_BASE}${parsed.pathname}${parsed.search}`;
    } catch {
      /* leave malformed external links unchanged */
    }
  }
  const marker = clean.toLowerCase().indexOf("/uploads/");
  if (marker >= 0) return `${API_BASE}${clean.slice(marker)}`;
  if (clean.toLowerCase().startsWith("uploads/")) return `${API_BASE}/${clean}`;
  return clean;
};
const token = () => localStorage.getItem("re_access_token");
export async function request<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const form = options.body instanceof FormData;
  let response: Response;
  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        ...(form ? {} : { "Content-Type": "application/json" }),
        ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
        ...options.headers,
      },
    });
  } catch (err) {
    throw new Error(
      `Cannot reach the server API (${API}). Check the server/reverse proxy and VITE_API_URL. ${err instanceof Error ? err.message : ""}`,
    );
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    // A session rejected by PostgreSQL must disappear from this browser too.
    // Incorrect OTPs do not affect an already authenticated browser session.
    if (response.status === 401 && !path.startsWith("/auth/") && token()) {
      localStorage.removeItem("re_access_token");
      localStorage.removeItem("re_last_activity");
      window.dispatchEvent(new Event("re-session-expired"));
    }
    const message =
      body.detail || body.error || `Server error (${response.status})`;
    throw new Error(
      typeof message === "string" ? message : JSON.stringify(message),
    );
  }
  return body as T;
}
export const publicData = () => request(`/public/${ORG_ID}`);
export const sendInquiry = (body: any) =>
  request(`/public/${ORG_ID}/inquiries`, {
    method: "POST",
    body: JSON.stringify(body),
  });
export const requestOtp = (email: string) =>
  request("/auth/request-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
export const verifyOtp = (email: string, otp: string) =>
  request("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
export const me = () => request("/auth/me");
export const recordLoginActivity = () =>
  localStorage.setItem("re_last_activity", String(Date.now()));
export const getLoginActivity = () =>
  Number(localStorage.getItem("re_last_activity") || 0);
export const setToken = (value: string) => {
  localStorage.setItem("re_access_token", value);
  recordLoginActivity();
};
export const logout = () => {
  const current = token();
  // Clear locally immediately; best-effort server revocation is independent.
  localStorage.removeItem("re_access_token");
  localStorage.removeItem("re_last_activity");
  if (current)
    void fetch(`${API}/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${current}` },
    }).catch(() => {});
};
export const superOrgs = () => request("/super/organizations");
export const createOrg = (body: any) =>
  request("/super/organizations", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updateOrg = (id: string, body: any) =>
  request(`/super/organizations/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const updateFeatures = (id: string, body: any) =>
  request(`/super/organizations/${id}/features`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
export const deleteOrg = (id: string) =>
  request(`/super/organizations/${id}`, { method: "DELETE" });
export const activities = () => request("/super/activities");
export const dashboard = () => request("/organization/dashboard");
export const listItems = (kind: string) => request(`/organization/${kind}`);
export const createItem = (kind: string, body: any) =>
  request(`/organization/${kind}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updateItem = (kind: string, id: string, body: any) =>
  request(`/organization/${kind}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteItem = (kind: string, id: string) =>
  request(`/organization/${kind}/${id}`, { method: "DELETE" });
export const getPageContent = () => request("/organization/page-content");
export const savePageContent = (body: any) =>
  request("/organization/page-content", {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const inquiries = () => request("/organization/inquiries");
export const uploadImage = (data: FormData) =>
  request("/organization/upload", { method: "POST", body: data });
export const uploadFieldMedia = (data: FormData) =>
  request("/organization/field-media", { method: "POST", body: data });
// Independent organization-wide Gallery page (PostgreSQL metadata / OneDrive files).
export const getSiteGallery = () => request("/organization/gallery");
export const saveSiteGallery = (body: any) =>
  request("/organization/gallery", {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const uploadSiteGalleryMedia = (body: FormData) =>
  request("/organization/gallery/media", { method: "POST", body });
export const reorderSiteGallery = (media_ids: string[]) =>
  request("/organization/gallery/order", {
    method: "PUT",
    body: JSON.stringify({ media_ids }),
  });
export const updateSiteGalleryMedia = (id: string, body: any) =>
  request(`/organization/gallery/media/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
export const deleteSiteGalleryMedia = (id: string) =>
  request(`/organization/gallery/media/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
export const propertyMedia = (propertyId: string) =>
  request(`/organization/properties/${propertyId}/media`);
export const uploadPropertyMedia = (propertyId: string, data: FormData) =>
  request(`/organization/properties/${propertyId}/media`, {
    method: "POST",
    body: data,
  });
export const updatePropertyMedia = (
  propertyId: string,
  mediaId: string,
  body: any,
) =>
  request(`/organization/properties/${propertyId}/media/${mediaId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deletePropertyMedia = (propertyId: string, mediaId: string) =>
  request(`/organization/properties/${propertyId}/media/${mediaId}`, {
    method: "DELETE",
  });

export const constructionMedia = (workId: string) =>
  request(`/organization/construction-works/${workId}/media`);
export const uploadConstructionMedia = (workId: string, data: FormData) =>
  request(`/organization/construction-works/${workId}/media`, {
    method: "POST",
    body: data,
  });
export const updateConstructionMedia = (
  workId: string,
  mediaId: string,
  body: any,
) =>
  request(`/organization/construction-works/${workId}/media/${mediaId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteConstructionMedia = (workId: string, mediaId: string) =>
  request(`/organization/construction-works/${workId}/media/${mediaId}`, {
    method: "DELETE",
  });
export const createLead = (body: any) =>
  request("/organization/inquiries", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updateLead = (id: string, body: any) =>
  request(`/organization/inquiries/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
export const deleteLead = (id: string) =>
  request(`/organization/inquiries/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
export const createFollowUp = (leadId: string, body: any) =>
  request(`/organization/inquiries/${encodeURIComponent(leadId)}/follow-ups`, {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updateFollowUp = (leadId: string, followId: string, body: any) =>
  request(
    `/organization/inquiries/${encodeURIComponent(leadId)}/follow-ups/${encodeURIComponent(followId)}`,
    { method: "PATCH", body: JSON.stringify(body) },
  );
export const deleteFollowUp = (leadId: string, followId: string) =>
  request(
    `/organization/inquiries/${encodeURIComponent(leadId)}/follow-ups/${encodeURIComponent(followId)}`,
    { method: "DELETE" },
  );

export const civilMedia = (serviceId: string) =>
  request(`/organization/civil-services/${serviceId}/media`);
export const uploadCivilMedia = (serviceId: string, data: FormData) =>
  request(`/organization/civil-services/${serviceId}/media`, {
    method: "POST",
    body: data,
  });
export const updateCivilMedia = (
  serviceId: string,
  mediaId: string,
  body: any,
) =>
  request(`/organization/civil-services/${serviceId}/media/${mediaId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteCivilMedia = (serviceId: string, mediaId: string) =>
  request(`/organization/civil-services/${serviceId}/media/${mediaId}`, {
    method: "DELETE",
  });

export const interiorMedia = (id: string) =>
  request(`/organization/interior-designs/${id}/media`);
export const uploadInteriorMedia = (id: string, data: FormData) =>
  request(`/organization/interior-designs/${id}/media`, {
    method: "POST",
    body: data,
  });
export const updateInteriorMedia = (id: string, mediaId: string, body: any) =>
  request(`/organization/interior-designs/${id}/media/${mediaId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteInteriorMedia = (id: string, mediaId: string) =>
  request(`/organization/interior-designs/${id}/media/${mediaId}`, {
    method: "DELETE",
  });

export const liftMedia = (id: string) =>
  request(`/organization/lift-designs/${id}/media`);
export const uploadLiftMedia = (id: string, data: FormData) =>
  request(`/organization/lift-designs/${id}/media`, {
    method: "POST",
    body: data,
  });
export const updateLiftMedia = (id: string, mediaId: string, body: any) =>
  request(`/organization/lift-designs/${id}/media/${mediaId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteLiftMedia = (id: string, mediaId: string) =>
  request(`/organization/lift-designs/${id}/media/${mediaId}`, {
    method: "DELETE",
  });

// Master-created custom website pages, assigned per organization.
export const superCustomPageTypes = () => request("/super/custom-page-types");
export const createCustomPageType = (body: any) =>
  request("/super/custom-page-types", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updateCustomPageType = (id: string, body: any) =>
  request(`/super/custom-page-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteCustomPageType = (id: string) =>
  request(`/super/custom-page-types/${id}`, { method: "DELETE" });
export const setOrganizationPageAccess = (
  orgId: string,
  page_type_ids: string[],
) =>
  request(`/super/organizations/${orgId}/custom-page-access`, {
    method: "PUT",
    body: JSON.stringify({ page_type_ids }),
  });
export const customPageTypes = () => request("/organization/custom-page-types");
export const customPageEntries = () =>
  request("/organization/custom-page-entries");
export const createCustomPageEntry = (body: any) =>
  request("/organization/custom-page-entries", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updateCustomPageEntry = (id: string, body: any) =>
  request(`/organization/custom-page-entries/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteCustomPageEntry = (id: string) =>
  request(`/organization/custom-page-entries/${id}`, { method: "DELETE" });
export const customPageMedia = (id: string) =>
  request(`/organization/custom-page-entries/${id}/media`);
export const uploadCustomPageMedia = (id: string, body: FormData) =>
  request(`/organization/custom-page-entries/${id}/media`, {
    method: "POST",
    body,
  });
export const updateCustomPageMedia = (id: string, mediaId: string, body: any) =>
  request(`/organization/custom-page-entries/${id}/media/${mediaId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteCustomPageMedia = (id: string, mediaId: string) =>
  request(`/organization/custom-page-entries/${id}/media/${mediaId}`, {
    method: "DELETE",
  });

// Charity & Foundation — isolated site and organization content collections.
export const foundationAdmin = () => request("/organization/foundation");
export const foundationSaveSite = (body: any) =>
  request("/organization/foundation/site", {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const foundationCreateEntry = (body: any) =>
  request("/organization/foundation/entries", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const foundationUpdateEntry = (id: string, body: any) =>
  request(`/organization/foundation/entries/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const foundationDeleteEntry = (id: string) =>
  request(`/organization/foundation/entries/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
export const foundationUploadMedia = (body: FormData) =>
  request("/organization/foundation/media", { method: "POST", body });
export const foundationDeleteMedia = (id: string) =>
  request(`/organization/foundation/media/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
export const foundationUpdateSubmission = (id: string, body: any) =>
  request(`/organization/foundation/submissions/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
export const foundationPublic = () => request(`/public/${ORG_ID}/foundation`);
export const foundationSubmit = (body: any) =>
  request(`/public/${ORG_ID}/foundation/submit`, {
    method: "POST",
    body: JSON.stringify(body),
  });
