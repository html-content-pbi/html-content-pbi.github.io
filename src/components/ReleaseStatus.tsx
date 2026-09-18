// /src/components/ReleaseStatus.tsx

// React modules
import React from "react";
// Docusaurus admonition, so output matches the markdown ::: styles
import Admonition from "@theme/Admonition";

// Lifecycle stages for a release; "ga" (or omitting the stage) renders nothing
type ReleaseStage = "development" | "beta" | "submitted" | "deploying" | "ga";

// HTML Content ships as two separate AppSource visuals, which can sit at
// different points in the release lifecycle. Omitting the edition means the
// message applies to both.
type Edition = "regular" | "secure";

interface IReleaseStatusProps {
  version: string;
  stage?: ReleaseStage;
  edition?: Edition;
}

// Product name(s) to use in the message body for the supplied edition
const getEditionName = (edition?: Edition) => {
  switch (edition) {
    case "regular":
      return "HTML Content";
    case "secure":
      return "HTML Content Secure";
    default:
      return "HTML Content and HTML Content Secure";
  }
};

// Only the Secure edition is certified; the Regular edition is an uncertified
// AppSource visual, so certification wording must never be applied to it alone
const isCertified = (edition?: Edition) => edition !== "regular";

// Component to render the release lifecycle status admonition at the top of a
// change log entry. Update the stage prop in change-log.md as the release moves
// through its lifecycle, rather than commenting/uncommenting blocks. Mirrors the
// equivalent component in the Deneb documentation site, with the edition prop
// added for this visual's two editions.
const ReleaseStatus = ({
  version,
  stage = "ga",
  edition,
}: IReleaseStatusProps) => {
  // Reads correctly for one edition or both, e.g. "Version 2.0.0 of HTML
  // Content Secure", "Version 2.0.0 of HTML Content and HTML Content Secure"
  const subject = `Version ${version} of ${getEditionName(edition)}`;
  const certified = isCertified(edition);
  switch (stage) {
    case "development":
      return (
        <Admonition type="info" title="Under development 🚧">
          <p>
            Documentation is being written ahead of starting alpha testing, so
            the features described below are subject to change as testing and
            feedback is received. We will update this page and other pertinent
            areas in this version's documentation with any changes to the
            planned features, and will also add more details on each feature as
            they are finalized.
          </p>
          <p>
            Changes are currently only available in{" "}
            <a href="/community/early-access">alpha builds</a>, but we'll
            release and submit soon once testing is complete.
          </p>
        </Admonition>
      );
    case "beta":
      return (
        <Admonition type="info" title="In Beta Testing">
          <p>
            {subject} is currently in a beta testing phase. If you would like to
            help test this release prior to general availability, please visit
            the <a href="/community/early-access">early access community page</a>{" "}
            to download the beta build and provide feedback.
          </p>
        </Admonition>
      );
    case "submitted":
      return certified ? (
        <Admonition type="info" title="Submitted for certification">
          <p>
            {subject} has been submitted to AppSource for certification.
            Approval is dependent on the{" "}
            <a href="https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified">
              certification rules
            </a>
            , and may require additional changes (and resubmission) before the
            update is accepted.
          </p>
        </Admonition>
      ) : (
        <Admonition type="info" title="Submitted to AppSource">
          <p>
            {subject} has been submitted to AppSource for review. Approval may
            require additional changes (and resubmission) before the update is
            accepted.
          </p>
        </Admonition>
      );
    case "deploying":
      return (
        <Admonition type="info" title="Pending deployment to AppSource">
          <p>
            {subject}{" "}
            {certified
              ? "has passed certification and is"
              : "has been approved and is"}{" "}
            currently undergoing deployment to your reports. This can take a
            couple of weeks from the publish date.
          </p>
        </Admonition>
      );
    default:
      return null;
  }
};

export default ReleaseStatus;
