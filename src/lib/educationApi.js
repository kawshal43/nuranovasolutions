const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080").replace(/\/$/, "");

async function apiRequest(path, options = {}) {
  const { body, headers, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof payload === "string" && payload) ||
      payload?.message ||
      payload?.error ||
      "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function apiFormRequest(path, formData, options = {}) {
  const { headers, ...rest } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    method: "POST",
    body: formData,
    headers,
    ...rest,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      (typeof payload === "string" && payload) ||
      payload?.message ||
      payload?.error ||
      "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function resolveApiAssetUrl(value) {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return value.startsWith("/api/") ? `${API_BASE_URL}${value}` : value;
}

export function getCurrentUser() {
  return apiRequest("/api/auth/me");
}

export function registerUser(body) {
  return apiRequest("/api/auth/register", { method: "POST", body });
}

export function loginUser(body) {
  return apiRequest("/api/auth/login", { method: "POST", body });
}

export function logoutUser() {
  return apiRequest("/api/auth/logout", { method: "POST" });
}

export function updateProfile(body) {
  return apiRequest("/api/profile/me", { method: "PUT", body });
}

export function uploadProfileAvatar(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFormRequest("/api/profile/me/avatar", formData);
}

export function deleteProfileAvatar() {
  return apiRequest("/api/profile/me/avatar", { method: "DELETE" });
}

export function changeProfilePassword(body) {
  return apiRequest("/api/profile/me/password", { method: "PUT", body });
}

export function deleteOwnAccount() {
  return apiRequest("/api/profile/me", { method: "DELETE" });
}

export function getPublicCourses() {
  return apiRequest("/api/courses/public");
}

export function getCourses() {
  return apiRequest("/api/courses");
}

export function getPublicCourseDetail(slug) {
  return apiRequest(`/api/courses/public/${slug}`);
}

export function getCourseDetail(slug) {
  return apiRequest(`/api/courses/${slug}`);
}

export function markLessonCompleted(slug, lessonId) {
  return apiRequest(`/api/courses/${slug}/lessons/${lessonId}/complete`, { method: "POST" });
}

export function getAdminDashboard() {
  return apiRequest("/api/admin/dashboard");
}

export function getAdminUsers() {
  return apiRequest("/api/admin/users");
}

export function updateAdminUserRole(userId, role) {
  return apiRequest(`/api/admin/users/${userId}/role`, {
    method: "PUT",
    body: { role },
  });
}

export function getAdminCourses() {
  return apiRequest("/api/admin/courses");
}

export function getAdminCourse(courseId) {
  return apiRequest(`/api/admin/courses/${courseId}`);
}

export function createAdminCourse(body) {
  return apiRequest("/api/admin/courses", { method: "POST", body });
}

export function updateAdminCourse(courseId, body) {
  return apiRequest(`/api/admin/courses/${courseId}`, { method: "PUT", body });
}

export function deleteAdminCourse(courseId) {
  return apiRequest(`/api/admin/courses/${courseId}`, { method: "DELETE" });
}

export function getAdminLessons(courseId) {
  return apiRequest(`/api/admin/courses/${courseId}/lessons`);
}

export function createAdminLesson(body) {
  return apiRequest("/api/admin/lessons", { method: "POST", body });
}

export function updateAdminLesson(lessonId, body) {
  return apiRequest(`/api/admin/lessons/${lessonId}`, { method: "PUT", body });
}

export function deleteAdminLesson(lessonId) {
  return apiRequest(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
}

export function uploadAdminLessonVideo(lessonId, file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFormRequest(`/api/admin/lessons/${lessonId}/video`, formData);
}

export function updateAdminAccess(body) {
  return apiRequest("/api/admin/access-grants", { method: "POST", body });
}
