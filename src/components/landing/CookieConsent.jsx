import { useEffect, useState } from "react";
import { Cookie, Settings2, X } from "lucide-react";
import { Link } from "react-router-dom";

const CONSENT_KEY = "leanport_cookie_consent";

const defaultPreferences = {
  essential: true,
  preferences: false,
  analytics: false,
};

const preferenceDetails = [
  {
    id: "essential",
    title: "Essential",
    description: "Required for login state, route protection, security, and core site behavior.",
    required: true,
  },
  {
    id: "preferences",
    title: "Preferences",
    description: "Remembers non-essential choices such as cookie banner status and interface preferences.",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Reserved for optional product usage insights if analytics are added later.",
  },
];

const getSavedConsent = () => {
  try {
    const saved = window.localStorage.getItem(CONSENT_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const saveConsent = (status, preferences) => {
  const payload = {
    status,
    preferences: { ...defaultPreferences, ...preferences, essential: true },
    updatedAt: new Date().toISOString(),
  };

  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
  window.dispatchEvent(new CustomEvent("leanport-cookie-consent-change", { detail: payload }));
  return payload;
};

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    const saved = getSavedConsent();

    if (saved?.preferences) {
      setPreferences({ ...defaultPreferences, ...saved.preferences, essential: true });
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }

    const openSettings = () => {
      const latest = getSavedConsent();
      setPreferences({ ...defaultPreferences, ...latest?.preferences, essential: true });
      setIsManaging(true);
      setIsVisible(true);
    };

    window.addEventListener("leanport-open-cookie-settings", openSettings);
    return () => window.removeEventListener("leanport-open-cookie-settings", openSettings);
  }, []);

  const closeWithConsent = (status, nextPreferences) => {
    saveConsent(status, nextPreferences);
    setPreferences({ ...defaultPreferences, ...nextPreferences, essential: true });
    setIsVisible(false);
    setIsManaging(false);
  };

  const togglePreference = (id) => {
    if (id === "essential") return;
    setPreferences((current) => ({ ...current, [id]: !current[id] }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[120] px-4 pb-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="flex gap-4">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#222875] text-white sm:flex">
              <Cookie className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Cookie preferences</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                    We use essential browser storage for login/session behavior and core site operation.
                    Optional cookies or storage are used only if you accept them. Read the{" "}
                    <Link to="/company/cookie-policy" className="font-bold text-[#222875] hover:underline">
                      Cookie Policy
                    </Link>
                    .
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVisible(false)}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close cookie notice"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isManaging && (
                <div className="mt-5 grid gap-3">
                  {preferenceDetails.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => togglePreference(item.id)}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-[#90D7F5]"
                    >
                      <span>
                        <span className="block font-bold text-slate-950">{item.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-slate-600">{item.description}</span>
                      </span>
                      <span
                        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                          preferences[item.id] ? "bg-[#222875]" : "bg-slate-300"
                        } ${item.required ? "opacity-70" : ""}`}
                      >
                        <span
                          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                            preferences[item.id] ? "left-6" : "left-1"
                          }`}
                        />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:w-60 lg:flex-col">
            {isManaging ? (
              <>
                <button
                  type="button"
                  onClick={() => closeWithConsent("custom", preferences)}
                  className="inline-flex items-center justify-center rounded-full bg-[#222875] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1a1f5c]"
                >
                  Save choices
                </button>
                <button
                  type="button"
                  onClick={() => closeWithConsent("rejected", defaultPreferences)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-[#222875] hover:text-[#222875]"
                >
                  Reject optional
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => closeWithConsent("accepted", { essential: true, preferences: true, analytics: true })}
                  className="inline-flex items-center justify-center rounded-full bg-[#222875] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1a1f5c]"
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => closeWithConsent("rejected", defaultPreferences)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-[#222875] hover:text-[#222875]"
                >
                  Reject optional
                </button>
                <button
                  type="button"
                  onClick={() => setIsManaging(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[#222875] transition hover:bg-[#eefaff]"
                >
                  <Settings2 className="h-4 w-4" />
                  Manage choices
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
