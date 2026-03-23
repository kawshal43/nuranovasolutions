import { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProtectedVideoPlayer from "../components/ProtectedVideoPlayer";
import YouTubeCustomPlayer from "../components/YouTubeCustomPlayer";
import {
  changeProfilePassword,
  createAdminCourse,
  createAdminLesson,
  deleteOwnAccount,
  deleteAdminCourse,
  deleteAdminLesson,
  deleteProfileAvatar,
  getAdminCourse,
  getAdminCourses,
  getAdminDashboard,
  getAdminLessons,
  getAdminUsers,
  getCourseDetail,
  getCourses,
  getCurrentUser,
  getPublicCourseDetail,
  getPublicCourses,
  loginUser,
  markLessonCompleted,
  resolveApiAssetUrl,
  registerUser,
  updateAdminAccess,
  updateAdminCourse,
  updateAdminLesson,
  updateAdminUserRole,
  updateProfile,
  uploadAdminLessonVideo,
  uploadProfileAvatar,
} from "../lib/educationApi";
import "./EducationPlatform.css";

const EMPTY_LOGIN_FORM = {
  usernameOrEmail: "",
  password: "",
};

const EMPTY_REGISTER_FORM = {
  username: "",
  email: "",
  fullName: "",
  password: "",
};

const EMPTY_PROFILE_FORM = {
  username: "",
  fullName: "",
  email: "",
  bio: "",
};

const EMPTY_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
};

const EMPTY_COURSE_FORM = {
  slug: "",
  title: "",
  shortDescription: "",
  description: "",
  category: "",
  iconUrl: "",
  progressPercent: 0,
  sortOrder: 0,
  published: true,
};

const EMPTY_LESSON_FORM = {
  courseId: "",
  title: "",
  description: "",
  videoUrl: "",
  durationLabel: "",
  accessLevel: "FREE",
  sortOrder: 0,
  published: true,
};

const EMPTY_ACCESS_FORM = {
  userId: "",
  lessonId: "",
  allowed: true,
};

const ROLE_OPTIONS = ["USER", "PREMIUM", "ADMIN"];
const ACCESS_OPTIONS = ["FREE", "PREMIUM", "CUSTOM"];

function toTitleCase(value) {
  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildProfileForm(user) {
  return {
    username: user?.username ?? "",
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    bio: user?.bio ?? "",
  };
}

function normalizeProfileTab(value) {
  return ["information", "password", "delete"].includes(value) ? value : "information";
}

function buildCourseForm(course) {
  if (!course) {
    return EMPTY_COURSE_FORM;
  }

  return {
    slug: course.slug ?? "",
    title: course.title ?? "",
    shortDescription: course.shortDescription ?? "",
    description: course.description ?? "",
    category: course.category ?? "",
    iconUrl: course.iconUrl ?? "",
    progressPercent: course.progressPercent ?? 0,
    sortOrder: course.sortOrder ?? 0,
    published: course.published ?? true,
  };
}

function buildLessonForm(courseId, lesson) {
  if (!lesson) {
    return {
      ...EMPTY_LESSON_FORM,
      courseId: courseId ? String(courseId) : "",
    };
  }

  return {
    courseId: lesson.courseId ? String(lesson.courseId) : courseId ? String(courseId) : "",
    title: lesson.title ?? "",
    description: lesson.description ?? "",
    videoUrl: lesson.videoUrl ?? "",
    durationLabel: lesson.durationLabel ?? "",
    accessLevel: lesson.accessLevel ?? "FREE",
    sortOrder: lesson.sortOrder ?? 0,
    published: lesson.published ?? true,
  };
}

function estimateCompletedLessons(courses) {
  return courses.reduce((count, course) => {
    const progress = course.progressPercent ?? 0;
    return count + Math.round((progress / 100) * (course.totalLessons ?? 0));
  }, 0);
}

function getResumeLesson(lessons) {
  return (
    lessons.find((lesson) => lesson.accessible && !lesson.completed) ??
    lessons.find((lesson) => lesson.accessible) ??
    lessons[0] ??
    null
  );
}

function isAdminUser(user) {
  return user?.role === "ADMIN";
}

function isPremiumUser(user) {
  return user?.role === "PREMIUM" || user?.role === "ADMIN";
}

function CourseIcon({ course, large = false }) {
  const iconClassName = `education-course-mark ${large ? "education-course-mark-large" : ""}`;

  if (course?.iconUrl) {
    return (
      <div className={`${iconClassName} education-course-mark-image`} aria-hidden="true">
        <img alt="" src={resolveApiAssetUrl(course.iconUrl)} />
      </div>
    );
  }

  return (
    <div className={iconClassName} aria-hidden="true">
      <span>{course?.title?.slice(0, 2)?.toUpperCase() ?? "ED"}</span>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="education-hero-illustration" aria-hidden="true">
      <div className="education-hero-tile education-hero-tile-top">A+</div>
      <div className="education-hero-tile education-hero-tile-left">Lab</div>
      <div className="education-hero-tile education-hero-tile-right">101</div>
      <div className="education-hero-core">
        <img alt="" src="/services/education.png" />
      </div>
    </div>
  );
}

function StatusBanner({ feedback, onDismiss }) {
  if (!feedback) {
    return null;
  }

  return (
    <div className={`education-status-banner is-${feedback.tone}`}>
      <span>{feedback.text}</span>
      <button onClick={onDismiss} type="button">
        Dismiss
      </button>
    </div>
  );
}

function AuthDialog({
  authMode,
  loginForm,
  registerForm,
  onClose,
  onFieldChange,
  onModeChange,
  onTogglePassword,
  onSubmit,
  pending,
  errorMessage,
  showPassword,
}) {
  return (
    <div className="education-modal-backdrop" onClick={onClose} role="presentation">
      <div
        aria-label={authMode === "login" ? "Login to education platform" : "Create education platform account"}
        aria-modal="true"
        className="education-auth-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="education-auth-header">
          <div>
            <span className="education-overline">Secure access</span>
            <h2>{authMode === "login" ? "Welcome back" : "Create your account"}</h2>
            <p>
              {authMode === "login"
                ? "Use your account to continue courses, track progress, and unlock protected lessons."
                : "Register to access free lessons now and let the admin grant premium or custom access later."}
            </p>
          </div>

          <button className="education-modal-close" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="education-auth-switch">
          <button
            className={authMode === "login" ? "is-active" : ""}
            onClick={() => onModeChange("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={authMode === "register" ? "is-active" : ""}
            onClick={() => onModeChange("register")}
            type="button"
          >
            Register
          </button>
        </div>

        <form className="education-auth-form" onSubmit={onSubmit}>
          {authMode === "login" ? (
            <>
              <label>
                <span>Username or Email</span>
                <input
                  name="usernameOrEmail"
                  onChange={onFieldChange}
                  placeholder="Enter username or email"
                  required
                  value={loginForm.usernameOrEmail}
                />
              </label>

              <label>
                <span>Password</span>
                <div className="education-password-field">
                  <input
                    name="password"
                    onChange={onFieldChange}
                    placeholder="Enter password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={loginForm.password}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="education-password-toggle"
                    onClick={onTogglePassword}
                    type="button"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path
                        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                      <circle cx="12" cy="12" fill="none" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </button>
                </div>
              </label>
            </>
          ) : (
            <>
              <label>
                <span>Full Name</span>
                <input
                  name="fullName"
                  onChange={onFieldChange}
                  placeholder="Your full name"
                  required
                  value={registerForm.fullName}
                />
              </label>

              <label>
                <span>Username</span>
                <input
                  name="username"
                  onChange={onFieldChange}
                  placeholder="Choose a username"
                  required
                  value={registerForm.username}
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  name="email"
                  onChange={onFieldChange}
                  placeholder="Your email address"
                  required
                  type="email"
                  value={registerForm.email}
                />
              </label>

              <label>
                <span>Password</span>
                <div className="education-password-field">
                  <input
                    name="password"
                    onChange={onFieldChange}
                    placeholder="Create a password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={registerForm.password}
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="education-password-toggle"
                    onClick={onTogglePassword}
                    type="button"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path
                        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                      />
                      <circle cx="12" cy="12" fill="none" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </button>
                </div>
              </label>
            </>
          )}

          {errorMessage ? <p className="education-inline-error">{errorMessage}</p> : null}

          <button className="education-primary-button" disabled={pending} type="submit">
            {pending ? "Working..." : authMode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

function DashboardStat({ label, value, accent = "blue" }) {
  return (
    <article className={`education-dashboard-stat is-${accent}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function CourseListItem({ course, onOpen, showProgress }) {
  return (
    <button className="education-course-list-card" onClick={() => onOpen(course.slug)} type="button">
      <CourseIcon course={course} />

      <div className="education-course-list-copy">
        <div className="education-course-list-head">
          <h3>{course.title}</h3>
          <span>{course.category}</span>
        </div>
        <p>{course.shortDescription}</p>

        <div className="education-course-meta">
          <span>{course.totalLessons} lessons</span>
          <span>{course.lockedLessons} locked</span>
          {showProgress ? <strong>{course.progressPercent}% complete</strong> : null}
        </div>
      </div>
    </button>
  );
}

function LessonCard({ lesson, isActive, onSelect }) {
  return (
    <button
      className={`education-video-card ${isActive ? "is-active" : ""}`}
      data-locked={!lesson.accessible}
      onClick={() => onSelect(lesson)}
      type="button"
    >
      <div className="education-video-thumb">
        <div className="education-video-thumb-brand">
          <span className={`education-access-pill is-${lesson.accessLevel.toLowerCase()}`}>
            {toTitleCase(lesson.accessLevel)}
          </span>
        </div>

        {!lesson.accessible ? (
          <div className="education-video-thumb-overlay">
            <div className="education-thumb-lock" aria-hidden="true" />
            <span>
              {lesson.accessLevel === "FREE"
                ? "Login to view this lesson"
                : lesson.accessLevel === "CUSTOM"
                  ? "Admin approval is required to view this lesson"
                  : "Premium access is required to view this lesson"}
            </span>
          </div>
        ) : (
          <div className="education-video-thumb-play" aria-hidden="true">
            <span>{lesson.videoReady ? "Play lesson" : "Lesson details"}</span>
          </div>
        )}
      </div>

      <div className="education-video-copy">
        <h3>{lesson.title}</h3>
        <p>{lesson.description}</p>
        <small>{lesson.durationLabel || "On-demand lesson"}</small>
      </div>

      <div
        aria-hidden="true"
        className={`education-video-status ${
          lesson.completed ? "is-complete" : lesson.accessible ? "is-available" : "is-locked"
        }`}
      />
    </button>
  );
}

function EmptyState({ title, description }) {
  return (
    <article className="education-empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

export default function EducationPlatform({ service }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [courseDetail, setCourseDetail] = useState(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN_FORM);
  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER_FORM);
  const [authPending, setAuthPending] = useState(false);
  const [authError, setAuthError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [showProfilePanel, setShowProfilePanel] = useState(false);
  const [profileTab, setProfileTab] = useState("information");
  const [profileForm, setProfileForm] = useState(EMPTY_PROFILE_FORM);
  const [profilePending, setProfilePending] = useState(false);
  const [profileAvatarFile, setProfileAvatarFile] = useState(null);
  const [profileAvatarPreview, setProfileAvatarPreview] = useState("");
  const [passwordForm, setPasswordForm] = useState(EMPTY_PASSWORD_FORM);
  const [passwordPending, setPasswordPending] = useState(false);
  const [showCurrentProfilePassword, setShowCurrentProfilePassword] = useState(false);
  const [showNewProfilePassword, setShowNewProfilePassword] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [workspace, setWorkspace] = useState("learn");
  const [markingLessonId, setMarkingLessonId] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminDashboard, setAdminDashboard] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminCourses, setAdminCourses] = useState([]);
  const [selectedAdminCourseId, setSelectedAdminCourseId] = useState(null);
  const [adminLessons, setAdminLessons] = useState([]);
  const [selectedAdminLessonId, setSelectedAdminLessonId] = useState(null);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE_FORM);
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON_FORM);
  const [lessonVideoFile, setLessonVideoFile] = useState(null);
  const [accessForm, setAccessForm] = useState(EMPTY_ACCESS_FORM);
  const [adminPendingAction, setAdminPendingAction] = useState("");
  const coursesRef = useRef(null);

  const deferredSearchValue = useDeferredValue(searchValue);
  const activeCourseSlug = searchParams.get("course");
  const requestedProfilePanel = searchParams.get("panel");
  const requestedProfileTab = normalizeProfileTab(searchParams.get("tab"));
  const requestedWorkspace = searchParams.get("workspace");
  const activeLesson =
    courseDetail?.lessons.find((lesson) => lesson.id === selectedLessonId) ??
    getResumeLesson(courseDetail?.lessons ?? []);
  const activeLessonUsesYoutube = activeLesson?.videoProvider === "YOUTUBE" && activeLesson?.videoSourceId;
  const activeLessonUsesUpload = activeLesson?.videoProvider === "UPLOAD" && activeLesson?.videoPlaybackUrl;
  const activeLessonHasPlayer = Boolean(activeLesson?.accessible && (activeLessonUsesYoutube || activeLessonUsesUpload));
  const accountAvatarSrc = profileAvatarPreview || resolveApiAssetUrl(user?.avatarUrl);
  const categories = ["All", ...new Set(courses.map((course) => course.category).filter(Boolean))];
  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch =
      !deferredSearchValue ||
      course.title.toLowerCase().includes(deferredSearchValue.toLowerCase()) ||
      course.shortDescription.toLowerCase().includes(deferredSearchValue.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const learningStats = {
    totalCourses: courses.length,
    lockedLessons: courses.reduce((total, course) => total + (course.lockedLessons ?? 0), 0),
    completedLessons: estimateCompletedLessons(courses),
  };
  const customLessons = adminLessons.filter((lesson) => lesson.accessLevel === "CUSTOM");
  const selectedAdminLesson = adminLessons.find((lesson) => lesson.id === selectedAdminLessonId) ?? null;

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        const currentUser = await getCurrentUser();
        if (!isMounted) {
          return;
        }

        setUser(currentUser);
        setProfileForm(buildProfileForm(currentUser));
        setWorkspace(currentUser.role === "ADMIN" ? "admin" : "learn");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error.status === 401) {
          setUser(null);
          setProfileForm(EMPTY_PROFILE_FORM);
          setShowProfilePanel(false);
          setPasswordForm(EMPTY_PASSWORD_FORM);
          setProfileAvatarFile(null);
          setWorkspace("learn");
          return;
        }

        setFeedback({ tone: "error", text: error.message });
      } finally {
        if (isMounted) {
          setSessionReady(true);
        }
      }
    }

    loadSession();

    const handleAuthChanged = () => {
      loadSession();
    };

    window.addEventListener("nuranova-auth-changed", handleAuthChanged);

    return () => {
      isMounted = false;
      window.removeEventListener("nuranova-auth-changed", handleAuthChanged);
    };
  }, []);

  useEffect(() => {
    if (!profileAvatarFile) {
      setProfileAvatarPreview("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(profileAvatarFile);
    setProfileAvatarPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profileAvatarFile]);

  useEffect(() => {
    if (!user) {
      setShowProfilePanel(false);
      return;
    }

    if (requestedProfilePanel === "profile") {
      setShowProfilePanel(true);
      setProfileTab(requestedProfileTab);
    }
  }, [requestedProfilePanel, requestedProfileTab, user]);

  useEffect(() => {
    if (!isAdminUser(user)) {
      return;
    }

    if (requestedWorkspace === "learn" || requestedWorkspace === "admin") {
      setWorkspace(requestedWorkspace);
    }
  }, [requestedWorkspace, user]);

  useEffect(() => {
    if (!sessionReady) {
      return;
    }

    let isMounted = true;

    async function loadCourses() {
      setCoursesLoading(true);

      try {
        const nextCourses = user ? await getCourses() : await getPublicCourses();
        if (!isMounted) {
          return;
        }

        setCourses(nextCourses);
        setSelectedCategory((currentCategory) =>
          currentCategory !== "All" && !nextCourses.some((course) => course.category === currentCategory)
            ? "All"
            : currentCategory
        );
      } catch (error) {
        if (isMounted) {
          setFeedback({ tone: "error", text: error.message });
        }
      } finally {
        if (isMounted) {
          setCoursesLoading(false);
        }
      }
    }

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [sessionReady, user]);

  useEffect(() => {
    if (!activeCourseSlug) {
      setCourseDetail(null);
      setSelectedLessonId(null);
      return;
    }

    let isMounted = true;

    async function loadCourse() {
      setCourseLoading(true);

      try {
        const nextCourse = user ? await getCourseDetail(activeCourseSlug) : await getPublicCourseDetail(activeCourseSlug);
        if (!isMounted) {
          return;
        }

        setCourseDetail(nextCourse);
        setSelectedLessonId((currentLessonId) => {
          if (nextCourse.lessons.some((lesson) => lesson.id === currentLessonId)) {
            return currentLessonId;
          }

          return getResumeLesson(nextCourse.lessons)?.id ?? null;
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setCourseDetail(null);
        setSelectedLessonId(null);
        setFeedback({ tone: "error", text: error.message });

        startTransition(() => {
          setSearchParams({});
        });
      } finally {
        if (isMounted) {
          setCourseLoading(false);
        }
      }
    }

    loadCourse();

    return () => {
      isMounted = false;
    };
  }, [activeCourseSlug, setSearchParams, user]);

  useEffect(() => {
    if (!isAdminUser(user) || workspace !== "admin") {
      return;
    }

    let isMounted = true;

    async function loadAdminData() {
      setAdminLoading(true);

      try {
        const [dashboard, users, coursesList] = await Promise.all([
          getAdminDashboard(),
          getAdminUsers(),
          getAdminCourses(),
        ]);

        if (!isMounted) {
          return;
        }

        setAdminDashboard(dashboard);
        setAdminUsers(users);
        setAdminCourses(coursesList);
        setSelectedAdminCourseId((currentCourseId) => {
          if (currentCourseId && coursesList.some((course) => course.id === currentCourseId)) {
            return currentCourseId;
          }

          return coursesList[0]?.id ?? null;
        });
      } catch (error) {
        if (isMounted) {
          setFeedback({ tone: "error", text: error.message });
        }
      } finally {
        if (isMounted) {
          setAdminLoading(false);
        }
      }
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [user, workspace]);

  useEffect(() => {
    if (!isAdminUser(user) || workspace !== "admin" || !selectedAdminCourseId) {
      setAdminLessons([]);
      setLessonForm((current) => ({
        ...current,
        courseId: selectedAdminCourseId ? String(selectedAdminCourseId) : "",
      }));
      return;
    }

    let isMounted = true;

    async function loadSelectedCourse() {
      try {
        const [selectedCourse, lessons] = await Promise.all([
          getAdminCourse(selectedAdminCourseId),
          getAdminLessons(selectedAdminCourseId),
        ]);

        if (!isMounted) {
          return;
        }

        setCourseForm(buildCourseForm(selectedCourse));
        setAdminLessons(lessons);
        setSelectedAdminLessonId((currentLessonId) => {
          if (currentLessonId && lessons.some((lesson) => lesson.id === currentLessonId)) {
            return currentLessonId;
          }

          return lessons[0]?.id ?? null;
        });
        setLessonForm((current) => {
          if (current.courseId && Number(current.courseId) === selectedCourse.id && current.title) {
            return current;
          }

          return buildLessonForm(selectedCourse.id, lessons[0] ?? null);
        });
      } catch (error) {
        if (isMounted) {
          setFeedback({ tone: "error", text: error.message });
        }
      }
    }

    loadSelectedCourse();

    return () => {
      isMounted = false;
    };
  }, [selectedAdminCourseId, user, workspace]);

  useEffect(() => {
    if (!selectedAdminLessonId) {
      setLessonVideoFile(null);
      setLessonForm((current) => ({
        ...current,
        courseId: selectedAdminCourseId ? String(selectedAdminCourseId) : current.courseId,
      }));
      return;
    }

    const selectedLesson = adminLessons.find((lesson) => lesson.id === selectedAdminLessonId);
    if (selectedLesson) {
      setLessonVideoFile(null);
      setLessonForm(buildLessonForm(selectedAdminCourseId, selectedLesson));
    }
  }, [adminLessons, selectedAdminCourseId, selectedAdminLessonId]);

  function scrollToCourses() {
    coursesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openCourse(slug) {
    startTransition(() => {
      setSearchParams({ course: slug });
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeCourse() {
    startTransition(() => {
      setSearchParams({});
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openAuth(nextMode = "login") {
    setAuthMode(nextMode);
    setShowPassword(false);
    setAuthError("");
    setShowAuthDialog(true);
  }

  function closeAuth() {
    setShowAuthDialog(false);
    setShowPassword(false);
    setAuthError("");
  }

  function handleAuthFieldChange(event) {
    const { name, value } = event.target;

    if (authMode === "login") {
      setLoginForm((current) => ({ ...current, [name]: value }));
      return;
    }

    setRegisterForm((current) => ({ ...current, [name]: value }));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setAuthPending(true);
    setAuthError("");

    try {
      const response =
        authMode === "login" ? await loginUser(loginForm) : await registerUser(registerForm);

      setUser(response.user);
      setProfileForm(buildProfileForm(response.user));
      setWorkspace(response.user.role === "ADMIN" ? "admin" : "learn");
      setFeedback({ tone: "success", text: response.message });
      setShowAuthDialog(false);
      setShowPassword(false);
      setLoginForm(EMPTY_LOGIN_FORM);
      setRegisterForm(EMPTY_REGISTER_FORM);
      setProfileAvatarFile(null);
      window.dispatchEvent(new Event("nuranova-auth-changed"));
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthPending(false);
    }
  }

  function updateEducationSearchParams(mutator) {
    const nextParams = new URLSearchParams(searchParams);
    mutator(nextParams);
    setSearchParams(nextParams);
  }

  function openProfilePanel(tab = "information") {
    const normalizedTab = normalizeProfileTab(tab);
    setProfileTab(normalizedTab);
    setShowProfilePanel(true);
    updateEducationSearchParams((params) => {
      params.set("panel", "profile");
      params.set("tab", normalizedTab);
    });
  }

  function closeProfilePanel() {
    setShowProfilePanel(false);
    setShowDeleteConfirm(false);
    setPasswordForm(EMPTY_PASSWORD_FORM);
    setShowCurrentProfilePassword(false);
    setShowNewProfilePassword(false);
    updateEducationSearchParams((params) => {
      params.delete("panel");
      params.delete("tab");
    });
  }

  function handleProfileFieldChange(event) {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  }

  function handleProfileAvatarChange(event) {
    const nextFile = event.target.files?.[0] ?? null;
    setProfileAvatarFile(nextFile);
  }

  async function handleProfileSave(event) {
    event.preventDefault();
    setProfilePending(true);
    let updatedUser = null;

    try {
      updatedUser = await updateProfile(profileForm);
      updatedUser = profileAvatarFile ? await uploadProfileAvatar(profileAvatarFile) : updatedUser;

      setUser(updatedUser);
      setProfileForm(buildProfileForm(updatedUser));
      setProfileAvatarFile(null);
      setFeedback({ tone: "success", text: "Profile updated successfully" });
      window.dispatchEvent(new Event("nuranova-auth-changed"));
    } catch (error) {
      if (updatedUser) {
        setUser(updatedUser);
        setProfileForm(buildProfileForm(updatedUser));
      }
      setFeedback({ tone: "error", text: error.message });
    } finally {
      setProfilePending(false);
    }
  }

  function handlePasswordFieldChange(event) {
    const { name, value } = event.target;
    setPasswordForm((current) => ({ ...current, [name]: value }));
  }

  async function handlePasswordSave(event) {
    event.preventDefault();
    setPasswordPending(true);

    try {
      const updatedUser = await changeProfilePassword(passwordForm);
      setUser(updatedUser);
      setPasswordForm(EMPTY_PASSWORD_FORM);
      setShowCurrentProfilePassword(false);
      setShowNewProfilePassword(false);
      setFeedback({ tone: "success", text: "Password updated successfully" });
      window.dispatchEvent(new Event("nuranova-auth-changed"));
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    } finally {
      setPasswordPending(false);
    }
  }

  async function handleAvatarDelete() {
    try {
      const updatedUser = await deleteProfileAvatar();
      setUser(updatedUser);
      setProfileAvatarFile(null);
      setProfileForm(buildProfileForm(updatedUser));
      setFeedback({ tone: "success", text: "Profile photo removed successfully" });
      window.dispatchEvent(new Event("nuranova-auth-changed"));
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    }
  }

  async function handleDeleteAccount() {
    setDeletePending(true);

    try {
      const response = await deleteOwnAccount();
      setShowDeleteConfirm(false);
      setShowProfilePanel(false);
      window.dispatchEvent(new Event("nuranova-auth-changed"));
      navigate("/");
      setFeedback({ tone: "success", text: response.message });
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    } finally {
      setDeletePending(false);
    }
  }

  async function handleLessonSelect(lesson) {
    if (!lesson.accessible && !user) {
      openAuth("login");
      return;
    }

    if (!lesson.accessible) {
      setFeedback({
        tone: "info",
        text:
          lesson.accessLevel === "CUSTOM"
            ? "This lesson needs a custom admin access grant."
            : "Upgrade the account role to Premium or ask the admin to unlock this lesson.",
      });
      return;
    }

    setSelectedLessonId(lesson.id);
  }

  async function refreshLearningData() {
    if (!activeCourseSlug) {
      return;
    }

    try {
      const [nextCourseDetail, nextCourses] = await Promise.all([
        getCourseDetail(activeCourseSlug),
        getCourses(),
      ]);

      setCourseDetail(nextCourseDetail);
      setCourses(nextCourses);
      setSelectedLessonId((currentLessonId) => {
        if (nextCourseDetail.lessons.some((lesson) => lesson.id === currentLessonId)) {
          return currentLessonId;
        }

        return getResumeLesson(nextCourseDetail.lessons)?.id ?? null;
      });
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    }
  }

  async function handleMarkDone() {
    if (!user || !activeCourseSlug || !activeLesson?.accessible) {
      if (!user) {
        openAuth("login");
      }
      return;
    }

    setMarkingLessonId(activeLesson.id);

    try {
      const response = await markLessonCompleted(activeCourseSlug, activeLesson.id);
      await refreshLearningData();
      setFeedback({ tone: "success", text: response.message });
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    } finally {
      setMarkingLessonId(null);
    }
  }

  function handleCourseFormChange(event) {
    const { name, value, type, checked } = event.target;
    setCourseForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "progressPercent" || name === "sortOrder"
            ? Number(value)
            : value,
    }));
  }

  function handleLessonFormChange(event) {
    const { name, value, type, checked } = event.target;
    setLessonForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "courseId" || name === "sortOrder"
            ? value === ""
              ? ""
              : Number(value)
            : value,
    }));
  }

  function handleLessonVideoFileChange(event) {
    const nextFile = event.target.files?.[0] ?? null;
    setLessonVideoFile(nextFile);
  }

  function handleAccessFormChange(event) {
    const { name, value, type, checked } = event.target;
    setAccessForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : name === "userId" || name === "lessonId"
            ? value === ""
              ? ""
              : Number(value)
            : value,
    }));
  }

  async function reloadAdminWorkspace(targetCourseId = selectedAdminCourseId, targetLessonId = selectedAdminLessonId) {
    const [dashboard, users, coursesList] = await Promise.all([
      getAdminDashboard(),
      getAdminUsers(),
      getAdminCourses(),
    ]);

    setAdminDashboard(dashboard);
    setAdminUsers(users);
    setAdminCourses(coursesList);

    const nextCourseId =
      targetCourseId && coursesList.some((course) => course.id === targetCourseId)
        ? targetCourseId
        : coursesList[0]?.id ?? null;

    setSelectedAdminCourseId(nextCourseId);

    if (!nextCourseId) {
      setAdminLessons([]);
      setCourseForm(EMPTY_COURSE_FORM);
      setLessonForm(EMPTY_LESSON_FORM);
      setLessonVideoFile(null);
      setSelectedAdminLessonId(null);
      return;
    }

    const [selectedCourse, lessons] = await Promise.all([
      getAdminCourse(nextCourseId),
      getAdminLessons(nextCourseId),
    ]);

    setCourseForm(buildCourseForm(selectedCourse));
    setAdminLessons(lessons);
    const nextLessonId =
      targetLessonId && lessons.some((lesson) => lesson.id === targetLessonId)
        ? targetLessonId
        : lessons[0]?.id ?? null;
    const nextLesson = lessons.find((lesson) => lesson.id === nextLessonId) ?? null;
    setSelectedAdminLessonId(nextLessonId);
    setLessonVideoFile(null);
    setLessonForm(buildLessonForm(nextCourseId, nextLesson));
  }

  async function handleCourseSubmit(event) {
    event.preventDefault();
    setAdminPendingAction("course-save");

    try {
      const activeCourse = adminCourses.find((course) => course.id === selectedAdminCourseId);
      const response = activeCourse
        ? await updateAdminCourse(activeCourse.id, courseForm)
        : await createAdminCourse(courseForm);

      await reloadAdminWorkspace(response.id);
      setFeedback({
        tone: "success",
        text: activeCourse ? "Course updated successfully" : "Course created successfully",
      });
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    } finally {
      setAdminPendingAction("");
    }
  }

  function handleNewCourse() {
    setSelectedAdminCourseId(null);
    setCourseForm(EMPTY_COURSE_FORM);
    setAdminLessons([]);
    setSelectedAdminLessonId(null);
    setLessonVideoFile(null);
    setLessonForm(EMPTY_LESSON_FORM);
  }

  async function handleDeleteCourse() {
    if (!selectedAdminCourseId) {
      return;
    }

    setAdminPendingAction("course-delete");

    try {
      const response = await deleteAdminCourse(selectedAdminCourseId);
      await reloadAdminWorkspace(null);
      setFeedback({ tone: "success", text: response.message });
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    } finally {
      setAdminPendingAction("");
    }
  }

  async function handleLessonSubmit(event) {
    event.preventDefault();
    setAdminPendingAction("lesson-save");

    try {
      const activeLessonId = selectedAdminLessonId;
      const savedLesson = await (activeLessonId
        ? updateAdminLesson(activeLessonId, lessonForm)
        : createAdminLesson({
            ...lessonForm,
            courseId: Number(lessonForm.courseId),
          }));

      if (lessonVideoFile) {
        await uploadAdminLessonVideo(savedLesson.id, lessonVideoFile);
      }

      await reloadAdminWorkspace(Number(lessonForm.courseId), savedLesson.id);
      const hasVideoSource = Boolean(lessonForm.videoUrl.trim() || lessonVideoFile);
      setFeedback({
        tone: "success",
        text:
          activeLessonId
            ? hasVideoSource
              ? "Lesson and video source updated successfully"
              : "Lesson updated successfully"
            : hasVideoSource
              ? "Lesson created and video source connected successfully"
              : "Lesson created successfully",
      });
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    } finally {
      setAdminPendingAction("");
    }
  }

  function handleNewLesson() {
    setSelectedAdminLessonId(null);
    setLessonVideoFile(null);
    setLessonForm(buildLessonForm(selectedAdminCourseId, null));
  }

  async function handleDeleteLesson() {
    if (!selectedAdminLessonId) {
      return;
    }

    setAdminPendingAction("lesson-delete");

    try {
      const response = await deleteAdminLesson(selectedAdminLessonId);
      await reloadAdminWorkspace(selectedAdminCourseId);
      setFeedback({ tone: "success", text: response.message });
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    } finally {
      setAdminPendingAction("");
    }
  }

  async function handleRoleChange(userId, role) {
    setAdminPendingAction(`role-${userId}`);

    try {
      await updateAdminUserRole(userId, role);
      await reloadAdminWorkspace(selectedAdminCourseId);
      setFeedback({ tone: "success", text: "User role updated successfully" });
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    } finally {
      setAdminPendingAction("");
    }
  }

  async function handleAccessSubmit(event) {
    event.preventDefault();
    setAdminPendingAction("access-save");

    try {
      const response = await updateAdminAccess({
        userId: Number(accessForm.userId),
        lessonId: Number(accessForm.lessonId),
        allowed: accessForm.allowed,
      });
      setFeedback({ tone: "success", text: response.message });
    } catch (error) {
      setFeedback({ tone: "error", text: error.message });
    } finally {
      setAdminPendingAction("");
    }
  }

  const shellStyle = {
    "--education-primary": service.accent.primary,
    "--education-secondary": service.accent.secondary,
    "--education-glow": service.accent.glow,
  };

  return (
    <main className="education-page" style={shellStyle}>
      <div className="education-page-blobs" aria-hidden="true">
        <span className="education-blob education-blob-a" />
        <span className="education-blob education-blob-b" />
        <span className="education-blob education-blob-c" />
        <span className="education-blob education-blob-d" />
      </div>

      <div className="education-container">
        <StatusBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

        <section className="education-shell-bar">
          <div>
            <span className="education-overline">NuraNova learning ecosystem</span>
            <h1>Education & Tutorials</h1>
          </div>
        </section>

        {showProfilePanel && user ? (
          <div className="education-modal-backdrop" onClick={closeProfilePanel} role="presentation">
            <div
              aria-label="Profile settings"
              aria-modal="true"
              className="education-profile-modal"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <button className="education-profile-modal-close" onClick={closeProfilePanel} type="button">
                x
              </button>

              <div className="education-profile-layout">
                <aside className="education-profile-sidebar-nav">
                  <span className="education-profile-sidebar-label">Edit Profile</span>
                  <button
                    className={`education-profile-tab ${profileTab === "information" ? "is-active" : ""}`}
                    onClick={() => openProfilePanel("information")}
                    type="button"
                  >
                    Information
                  </button>
                  <button
                    className={`education-profile-tab ${profileTab === "password" ? "is-active" : ""}`}
                    onClick={() => openProfilePanel("password")}
                    type="button"
                  >
                    Password
                  </button>
                  <button
                    className={`education-profile-tab ${profileTab === "delete" ? "is-active" : ""}`}
                    onClick={() => openProfilePanel("delete")}
                    type="button"
                  >
                    Delete Account
                  </button>
                </aside>

                <section className="education-profile-content">
                  {profileTab === "information" ? (
                    <>
                      <div className="education-profile-section-head">
                        <h2>Information</h2>
                      </div>

                      <form className="education-profile-form" onSubmit={handleProfileSave}>
                        <div className="education-profile-photo-row">
                          <div className="education-profile-avatar education-profile-avatar-large">
                            {accountAvatarSrc ? (
                              <img alt={user.fullName} src={accountAvatarSrc} />
                            ) : (
                              <span>{user.fullName?.charAt(0) ?? "N"}</span>
                            )}
                          </div>

                          <div className="education-profile-photo-copy">
                            <div className="education-profile-photo-actions">
                              <label className="education-primary-button education-photo-action" role="button">
                                Change
                                <input
                                  accept="image/png,image/jpeg,image/webp,image/gif"
                                  hidden
                                  onChange={handleProfileAvatarChange}
                                  type="file"
                                />
                              </label>
                              <button className="education-secondary-button education-photo-action" onClick={handleAvatarDelete} type="button">
                                Delete
                              </button>
                            </div>
                            <small>
                              {profileAvatarFile
                                ? profileAvatarFile.name
                                : "JPG, GIF or PNG. Max size 800KB."}
                            </small>
                          </div>
                        </div>

                        <label>
                          <span>Username</span>
                          <input name="username" onChange={handleProfileFieldChange} required value={profileForm.username} />
                        </label>
                        <label>
                          <span>Full Name</span>
                          <input name="fullName" onChange={handleProfileFieldChange} required value={profileForm.fullName} />
                        </label>
                        <label>
                          <span>Email address</span>
                          <input name="email" onChange={handleProfileFieldChange} required type="email" value={profileForm.email} />
                        </label>
                        <label>
                          <span>Bio</span>
                          <textarea
                            name="bio"
                            onChange={handleProfileFieldChange}
                            placeholder="Describe yourself..."
                            rows="5"
                            value={profileForm.bio}
                          />
                        </label>

                        <button className="education-primary-button education-profile-save" disabled={profilePending} type="submit">
                          {profilePending ? "Saving..." : "Save"}
                        </button>
                      </form>
                    </>
                  ) : null}

                  {profileTab === "password" ? (
                    <>
                      <div className="education-profile-section-head">
                        <h2>Password</h2>
                      </div>

                      <form className="education-profile-form education-password-settings" onSubmit={handlePasswordSave}>
                        <label>
                          <span>Current Password</span>
                          <div className="education-password-field">
                            <input
                              name="currentPassword"
                              onChange={handlePasswordFieldChange}
                              required
                              type={showCurrentProfilePassword ? "text" : "password"}
                              value={passwordForm.currentPassword}
                            />
                            <button
                              className="education-password-inline"
                              onClick={() => setShowCurrentProfilePassword((current) => !current)}
                              type="button"
                            >
                              {showCurrentProfilePassword ? "Hide" : "Show"}
                            </button>
                          </div>
                        </label>

                        <label>
                          <span>New Password</span>
                          <div className="education-password-field">
                            <input
                              name="newPassword"
                              onChange={handlePasswordFieldChange}
                              required
                              type={showNewProfilePassword ? "text" : "password"}
                              value={passwordForm.newPassword}
                            />
                            <button
                              className="education-password-inline"
                              onClick={() => setShowNewProfilePassword((current) => !current)}
                              type="button"
                            >
                              {showNewProfilePassword ? "Hide" : "Show"}
                            </button>
                          </div>
                        </label>

                        <button className="education-primary-button education-profile-save" disabled={passwordPending} type="submit">
                          {passwordPending ? "Changing..." : "Change"}
                        </button>
                      </form>
                    </>
                  ) : null}

                  {profileTab === "delete" ? (
                    <>
                      <div className="education-profile-section-head">
                        <h2>Delete Account</h2>
                      </div>

                      <div className="education-delete-panel">
                        <p>Are you sure you want to continue?</p>
                        <p>
                          If you have a problem, our customer support team will be happy to help.
                          {" "}
                          <a href="/#contact">Get in touch</a>
                        </p>
                        <p>If you delete your account:</p>
                        <ul className="education-delete-list">
                          <li>You will lose all of your course progress</li>
                          <li>You will lose access to your tutorials and protected lessons</li>
                          <li>Your connected access grants will be removed</li>
                          <li>Account deletion is permanent. This action cannot be undone.</li>
                        </ul>

                        <button className="education-danger-button" onClick={() => setShowDeleteConfirm(true)} type="button">
                          Delete Account
                        </button>
                      </div>
                    </>
                  ) : null}
                </section>
              </div>

              {showDeleteConfirm ? (
                <div className="education-delete-confirm-backdrop" role="presentation">
                  <div className="education-delete-confirm">
                    <button className="education-profile-modal-close" onClick={() => setShowDeleteConfirm(false)} type="button">
                      x
                    </button>
                    <div className="education-delete-confirm-illustration" aria-hidden="true">
                      <span>*</span>
                    </div>
                    <h3>Are you ready to say Goodbye?</h3>
                    <p>If you're sure, this will permanently remove your NuraNova learning account.</p>
                    <div className="education-delete-confirm-actions">
                      <button className="education-secondary-button" onClick={() => setShowDeleteConfirm(false)} type="button">
                        Go back
                      </button>
                      <button className="education-danger-button" disabled={deletePending} onClick={handleDeleteAccount} type="button">
                        {deletePending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {workspace === "admin" && isAdminUser(user) ? (
          <section className="education-admin-shell">
            <div className="education-admin-header">
              <div>
                <span className="education-overline">Admin control center</span>
                <h2>Manage courses, lessons, access, and learner roles</h2>
              </div>

              <button className="education-pill-button" onClick={() => reloadAdminWorkspace(selectedAdminCourseId)} type="button">
                Refresh Admin Data
              </button>
            </div>

            <div className="education-admin-stats">
              <DashboardStat accent="blue" label="Users" value={adminDashboard?.totalUsers ?? 0} />
              <DashboardStat accent="green" label="Courses" value={adminDashboard?.totalCourses ?? 0} />
              <DashboardStat accent="gold" label="Lessons" value={adminDashboard?.totalLessons ?? 0} />
              <DashboardStat accent="pink" label="Progress Records" value={adminDashboard?.totalProgressRecords ?? 0} />
            </div>

            <div className="education-admin-grid">
              <article className="education-admin-card">
                <div className="education-admin-card-head">
                  <div>
                    <span className="education-overline">Courses</span>
                    <h3>Course manager</h3>
                  </div>
                  <button className="education-pill-button" onClick={handleNewCourse} type="button">
                    New Course
                  </button>
                </div>

                <div className="education-admin-list">
                  {adminCourses.map((course) => (
                    <button
                      className={`education-admin-list-item ${selectedAdminCourseId === course.id ? "is-active" : ""}`}
                      key={course.id}
                      onClick={() => {
                        setSelectedAdminCourseId(course.id);
                        setSelectedAdminLessonId(null);
                      }}
                      type="button"
                    >
                      <div>
                        <strong>{course.title}</strong>
                        <span>{course.category}</span>
                      </div>
                      <small>{course.totalLessons} lessons</small>
                    </button>
                  ))}
                </div>

                <form className="education-admin-form" onSubmit={handleCourseSubmit}>
                  <label>
                    <span>Slug</span>
                    <input name="slug" onChange={handleCourseFormChange} required value={courseForm.slug} />
                  </label>
                  <label>
                    <span>Title</span>
                    <input name="title" onChange={handleCourseFormChange} required value={courseForm.title} />
                  </label>
                  <label>
                    <span>Short Description</span>
                    <textarea name="shortDescription" onChange={handleCourseFormChange} required rows="3" value={courseForm.shortDescription} />
                  </label>
                  <label>
                    <span>Full Description</span>
                    <textarea name="description" onChange={handleCourseFormChange} required rows="5" value={courseForm.description} />
                  </label>
                  <label>
                    <span>Category</span>
                    <input name="category" onChange={handleCourseFormChange} required value={courseForm.category} />
                  </label>
                  <label>
                    <span>Icon URL</span>
                    <input name="iconUrl" onChange={handleCourseFormChange} value={courseForm.iconUrl} />
                  </label>

                  <div className="education-admin-form-row">
                    <label>
                      <span>Preview Progress %</span>
                      <input
                        max="100"
                        min="0"
                        name="progressPercent"
                        onChange={handleCourseFormChange}
                        type="number"
                        value={courseForm.progressPercent}
                      />
                    </label>
                    <label>
                      <span>Sort Order</span>
                      <input min="0" name="sortOrder" onChange={handleCourseFormChange} type="number" value={courseForm.sortOrder} />
                    </label>
                  </div>

                  <label className="education-checkbox">
                    <input checked={courseForm.published} name="published" onChange={handleCourseFormChange} type="checkbox" />
                    <span>Published</span>
                  </label>

                  <div className="education-admin-actions">
                    <button className="education-primary-button" disabled={adminPendingAction === "course-save"} type="submit">
                      {adminPendingAction === "course-save" ? "Saving..." : selectedAdminCourseId ? "Update Course" : "Create Course"}
                    </button>

                    <button
                      className="education-secondary-button"
                      disabled={!selectedAdminCourseId || adminPendingAction === "course-delete"}
                      onClick={handleDeleteCourse}
                      type="button"
                    >
                      {adminPendingAction === "course-delete" ? "Deleting..." : "Delete Course"}
                    </button>
                  </div>
                </form>
              </article>

              <article className="education-admin-card">
                <div className="education-admin-card-head">
                  <div>
                    <span className="education-overline">Lessons</span>
                    <h3>Lesson manager</h3>
                  </div>
                  <button
                    className="education-pill-button"
                    disabled={!selectedAdminCourseId}
                    onClick={handleNewLesson}
                    type="button"
                  >
                    New Lesson
                  </button>
                </div>

                <div className="education-admin-list">
                  {adminLessons.map((lesson) => (
                    <button
                      className={`education-admin-list-item ${selectedAdminLessonId === lesson.id ? "is-active" : ""}`}
                      key={lesson.id}
                      onClick={() => setSelectedAdminLessonId(lesson.id)}
                      type="button"
                    >
                      <div>
                        <strong>{lesson.title}</strong>
                        <span>{toTitleCase(lesson.accessLevel)}</span>
                      </div>
                      <small>{lesson.durationLabel || "No duration"}</small>
                    </button>
                  ))}

                  {!adminLessons.length ? (
                    <EmptyState
                      description="Choose or create a course first, then add lesson details, access rules, and upload the protected video file."
                      title="No lessons yet"
                    />
                  ) : null}
                </div>

                <form className="education-admin-form" onSubmit={handleLessonSubmit}>
                  <label>
                    <span>Course</span>
                    <select name="courseId" onChange={handleLessonFormChange} required value={lessonForm.courseId}>
                      <option value="">Select a course</option>
                      {adminCourses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Lesson Title</span>
                    <input name="title" onChange={handleLessonFormChange} required value={lessonForm.title} />
                  </label>
                  <label>
                    <span>Description</span>
                    <textarea name="description" onChange={handleLessonFormChange} required rows="4" value={lessonForm.description} />
                  </label>
                  <label>
                    <span>YouTube Video URL</span>
                    <input
                      name="videoUrl"
                      onChange={handleLessonFormChange}
                      placeholder="https://youtu.be/zGjZS5xnH1A"
                      value={lessonForm.videoUrl}
                    />
                  </label>
                  <label className="education-file-field">
                    <span>Optional Uploaded Video</span>
                    <input accept="video/mp4,video/webm,video/ogg,video/quicktime" onChange={handleLessonVideoFileChange} type="file" />
                    <small>
                      {lessonVideoFile
                        ? lessonVideoFile.name
                        : selectedAdminLessonId
                          ? selectedAdminLesson?.hasUploadedVideo
                            ? lessonForm.videoUrl
                              ? `${selectedAdminLesson?.videoOriginalFilename || "Uploaded video ready"} (kept as fallback while the YouTube link is active).`
                              : selectedAdminLesson?.videoOriginalFilename || "Uploaded video ready"
                            : lessonForm.videoUrl
                              ? "The pasted YouTube link will be used for playback."
                              : "No uploaded fallback video yet."
                          : lessonForm.videoUrl
                            ? "Save the lesson to activate the pasted YouTube link."
                            : "Paste a YouTube link above, or upload an optional fallback lesson file."}
                    </small>
                  </label>

                  <div className="education-admin-form-row">
                    <label>
                      <span>Duration Label</span>
                      <input name="durationLabel" onChange={handleLessonFormChange} value={lessonForm.durationLabel} />
                    </label>
                    <label>
                      <span>Access Level</span>
                      <select name="accessLevel" onChange={handleLessonFormChange} value={lessonForm.accessLevel}>
                        {ACCESS_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {toTitleCase(option)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Sort Order</span>
                      <input min="0" name="sortOrder" onChange={handleLessonFormChange} type="number" value={lessonForm.sortOrder} />
                    </label>
                  </div>

                  <label className="education-checkbox">
                    <input checked={lessonForm.published} name="published" onChange={handleLessonFormChange} type="checkbox" />
                    <span>Published</span>
                  </label>

                  <div className="education-admin-actions">
                    <button
                      className="education-primary-button"
                      disabled={adminPendingAction === "lesson-save" || !lessonForm.courseId}
                      type="submit"
                    >
                      {adminPendingAction === "lesson-save" ? "Saving..." : selectedAdminLessonId ? "Update Lesson" : "Create Lesson"}
                    </button>
                    <button
                      className="education-secondary-button"
                      disabled={!selectedAdminLessonId || adminPendingAction === "lesson-delete"}
                      onClick={handleDeleteLesson}
                      type="button"
                    >
                      {adminPendingAction === "lesson-delete" ? "Deleting..." : "Delete Lesson"}
                    </button>
                  </div>
                </form>
              </article>

              <article className="education-admin-card">
                <div className="education-admin-card-head">
                  <div>
                    <span className="education-overline">Users</span>
                    <h3>User roles and profile access</h3>
                  </div>
                </div>

                <div className="education-admin-table">
                  {adminUsers.map((account) => (
                    <div className="education-admin-table-row" key={account.id}>
                      <div>
                        <strong>{account.fullName}</strong>
                        <span>
                          @{account.username} . {account.email}
                        </span>
                      </div>

                      <select
                        disabled={adminPendingAction === `role-${account.id}`}
                        onChange={(event) => handleRoleChange(account.id, event.target.value)}
                        value={account.role}
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {toTitleCase(role)}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </article>

              <article className="education-admin-card">
                <div className="education-admin-card-head">
                  <div>
                    <span className="education-overline">Custom access</span>
                    <h3>Grant or revoke protected lessons</h3>
                  </div>
                </div>

                <form className="education-admin-form" onSubmit={handleAccessSubmit}>
                  <label>
                    <span>User</span>
                    <select name="userId" onChange={handleAccessFormChange} required value={accessForm.userId}>
                      <option value="">Select user</option>
                      {adminUsers
                        .filter((account) => account.role !== "ADMIN")
                        .map((account) => (
                          <option key={account.id} value={account.id}>
                            {account.fullName} (@{account.username})
                          </option>
                        ))}
                    </select>
                  </label>

                  <label>
                    <span>Custom Lesson</span>
                    <select name="lessonId" onChange={handleAccessFormChange} required value={accessForm.lessonId}>
                      <option value="">Select lesson</option>
                      {customLessons.map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>
                          {lesson.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="education-checkbox">
                    <input checked={accessForm.allowed} name="allowed" onChange={handleAccessFormChange} type="checkbox" />
                    <span>Allow access</span>
                  </label>

                  <button className="education-primary-button" disabled={adminPendingAction === "access-save"} type="submit">
                    {adminPendingAction === "access-save" ? "Saving..." : "Update Access"}
                  </button>
                </form>
              </article>
            </div>

            {adminLoading ? <p className="education-loading-note">Loading admin data...</p> : null}
          </section>
        ) : (
          <section className="education-list-view">
            <section className="education-landing-hero">
              <div className="education-landing-copy">
                <span className="education-overline">Modern guided learning</span>
                <h2>
                  Unlock Your Potential.
                  <br />
                  Learn, Grow, Achieve.
                </h2>

                <p>
                  Discover structured courses, secure lesson access, personalized progress tracking, and a clean
                  education experience built directly into the NuraNova website.
                </p>

                <div className="education-landing-actions">
                  {user ? (
                    <>
                      <button className="education-primary-button" onClick={scrollToCourses} type="button">
                        Continue Learning
                      </button>
                      <button className="education-secondary-button" onClick={() => openProfilePanel("information")} type="button">
                        Update Profile
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="education-primary-button" onClick={() => openAuth("login")} type="button">
                        Login
                      </button>
                      <button className="education-secondary-button" onClick={() => openAuth("register")} type="button">
                        Register
                      </button>
                    </>
                  )}
                  <button className="education-pill-button" onClick={scrollToCourses} type="button">
                    Explore Courses
                  </button>
                </div>
              </div>

              <HeroIllustration />
            </section>

            {user ? (
              <section className="education-dashboard-band">
                <div className="education-dashboard-copy">
                  <span className="education-overline">Learner dashboard</span>
                  <h3>
                    Welcome back, {user.fullName}.
                    <br />
                    Your learning continues here.
                  </h3>
                  <p>
                    Track course progress, resume accessible lessons, and manage your account details without leaving
                    the site.
                  </p>
                </div>

                <div className="education-dashboard-stats">
                  <DashboardStat accent="blue" label="Courses" value={learningStats.totalCourses} />
                  <DashboardStat accent="green" label="Completed Lessons" value={learningStats.completedLessons} />
                  <DashboardStat accent="gold" label="Locked Lessons" value={learningStats.lockedLessons} />
                </div>
              </section>
            ) : null}

            {activeCourseSlug ? (
              <section className="education-detail-view">
                <div className="education-detail-topbar">
                  <button className="education-pill-button" onClick={closeCourse} type="button">
                    Back to Courses
                  </button>

                  <div className="education-detail-actions" />
                </div>

                {courseLoading && !courseDetail ? (
                  <EmptyState
                    description="The selected course is loading from the backend."
                    title="Loading course"
                  />
                ) : courseDetail ? (
                  <>
                    <article className="education-detail-hero-card">
                      <div className="education-detail-hero-head">
                        <CourseIcon course={courseDetail} large />
                        <div>
                          <h2>{courseDetail.title}</h2>
                          <span>{courseDetail.category}</span>
                        </div>
                      </div>

                      <p>{courseDetail.description}</p>

                      <div className="education-progress-row">
                        <span className="education-progress-pill">
                          {user ? "IN PROGRESS" : "PREVIEW"}
                        </span>
                        <strong>{courseDetail.progressPercent}%</strong>
                      </div>

                      <div className="education-progress-track">
                        <span style={{ width: `${courseDetail.progressPercent}%` }} />
                      </div>
                    </article>

                    <section className="education-player-shell">
                      <div
                        className="education-player-card"
                        onContextMenu={(event) => event.preventDefault()}
                        role="presentation"
                      >
                        {activeLessonHasPlayer ? (
                          <>
                            <div className="education-player-frame">
                              {activeLessonUsesYoutube ? (
                                <YouTubeCustomPlayer
                                  title={activeLesson.title}
                                  videoId={activeLesson.videoSourceId}
                                  watermark={user?.fullName ?? ""}
                                />
                              ) : (
                                <ProtectedVideoPlayer
                                  src={resolveApiAssetUrl(activeLesson.videoPlaybackUrl)}
                                  title={activeLesson.title}
                                  watermark={user?.fullName ?? ""}
                                />
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="education-player-locked">
                            <div className="education-thumb-lock" aria-hidden="true" />
                            <h3>{activeLesson?.title ?? "Protected lesson playback"}</h3>
                            <p>
                              {!user
                                ? "Login to watch this lesson and unlock your course dashboard."
                                : activeLesson?.accessible
                                  ? "The admin still needs to connect a playable video source for this lesson."
                                  : activeLesson?.accessLevel === "CUSTOM"
                                    ? "This lesson needs a custom grant from the admin panel before it can be played."
                                    : "This lesson is premium-only. Upgrade the account role to unlock it."}
                            </p>
                            {!user ? (
                              <button className="education-primary-button" onClick={() => openAuth("login")} type="button">
                                Login to Watch
                              </button>
                            ) : null}
                          </div>
                        )}
                      </div>

                      <aside className="education-player-sidebar">
                        <span className="education-overline">Current lesson</span>
                        <h3>{activeLesson?.title ?? "Choose a lesson"}</h3>
                        <p>
                          {activeLesson?.description ??
                            "Select a lesson to preview the details, access level, and protected video playback area."}
                        </p>
                        <div className="education-player-meta">
                          <span>{activeLesson?.durationLabel || "On-demand"}</span>
                          <span>{activeLesson ? toTitleCase(activeLesson.accessLevel) : "No access level"}</span>
                        </div>

                        <button
                          className="education-primary-button"
                          disabled={!activeLesson?.accessible || activeLesson?.completed || markingLessonId === activeLesson?.id}
                          onClick={handleMarkDone}
                          type="button"
                        >
                          {activeLesson?.completed
                            ? "Completed"
                            : markingLessonId === activeLesson?.id
                              ? "Saving..."
                              : "Mark as Done"}
                        </button>
                      </aside>
                    </section>

                    <div className="education-video-list">
                      {courseDetail.lessons.map((lesson) => (
                        <LessonCard
                          isActive={lesson.id === activeLesson?.id}
                          key={lesson.id}
                          lesson={lesson}
                          onSelect={handleLessonSelect}
                        />
                      ))}
                    </div>
                  </>
                ) : null}
              </section>
            ) : (
              <section className="education-courses-section" ref={coursesRef}>
                <div className="education-section-title-row">
                  <div>
                    <span className="education-overline">Browse the catalog</span>
                    <h2>Courses</h2>
                  </div>
                  {user ? (
                    <span className="education-role-pill education-role-pill-active">{`${toTitleCase(user.role)} account`}</span>
                  ) : null}
                </div>

                <div className="education-toolbar">
                  <label className="education-search-field">
                    <span>Search</span>
                    <input
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder="Search courses or topics"
                      value={searchValue}
                    />
                  </label>

                  <div className="education-category-row">
                    {categories.map((category) => (
                      <button
                        aria-pressed={selectedCategory === category}
                        className="education-category-chip"
                        data-active={selectedCategory === category}
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        type="button"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {coursesLoading ? (
                  <EmptyState
                    description="Course data is being loaded from the backend."
                    title="Loading courses"
                  />
                ) : filteredCourses.length ? (
                  <div className="education-course-list">
                    {filteredCourses.map((course) => (
                      <CourseListItem
                        course={course}
                        key={course.id}
                        onOpen={openCourse}
                        showProgress={Boolean(user)}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    description={
                      courses.length
                        ? "Try a different search term or category filter."
                        : "No courses have been added in the database yet. Login as the nuranova admin account to create them."
                    }
                    title={courses.length ? "No courses matched" : "No courses published yet"}
                  />
                )}
              </section>
            )}
          </section>
        )}
      </div>

      {showAuthDialog ? (
        <AuthDialog
          authMode={authMode}
          errorMessage={authError}
          loginForm={loginForm}
          onClose={closeAuth}
          onFieldChange={handleAuthFieldChange}
          onModeChange={(nextMode) => {
            setAuthMode(nextMode);
            setShowPassword(false);
          }}
          onTogglePassword={() => setShowPassword((current) => !current)}
          onSubmit={handleAuthSubmit}
          pending={authPending}
          registerForm={registerForm}
          showPassword={showPassword}
        />
      ) : null}
    </main>
  );
}
