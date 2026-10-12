// /src/theme/Root.tsx

// Wraps every page so the analytics consent banner shows site-wide.
// See https://docusaurus.io/docs/swizzling#wrapper-your-site-with-root

// React modules
import React, { useEffect, useState } from "react";
import Link from "@docusaurus/Link";
// Consent storage and GA loading
import { getConsent, setConsent, type Consent } from "@site/src/analytics";

export default function Root({ children }: { children: React.ReactNode }) {
  // Hidden until mounted: the saved choice isn't readable during SSR.
  // ponytail: shown to every visitor; geo-targeting EU/UK needs a server or CDN rule
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(getConsent() === null), []);

  const choose = (consent: Consent) => {
    setConsent(consent);
    setOpen(false);
  };

  return (
    <>
      {children}
      {open && (
        <div className="consent-banner" role="region" aria-label="Cookie consent">
          <p>
            We'd like to use Google Analytics cookies to see which pages are
            read and improve these docs. Nothing is sent unless you accept. See
            the <Link to="/privacy-policy#consent">Privacy Policy</Link>.
          </p>
          <div className="consent-banner__buttons">
            <button
              className="button button--primary"
              onClick={() => choose("granted")}
            >
              Accept
            </button>
            <button
              className="button button--primary"
              onClick={() => choose("denied")}
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
