import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.tagline}
        </Heading>
        <div className={styles.visualProducts}>
          <div className={styles.visualProduct}>
            <div className={styles.productLogo}>
              <a
                href="https://appsource.microsoft.com/en-us/product/power-bi-visuals/WA200001930"
                target="_blank"
              >
                <img
                  src="img/logo-regular.png"
                  title="Get it from Microsoft AppSource"
                />
              </a>
            </div>
            <div className={styles.productTitle}>HTML Content</div>
            <div className={styles.productSubtitle}>
              Use raw data or DAX to generate HTML and SVG on the Power BI
              report canvas.
            </div>
          </div>
          <div className={styles.visualProduct}>
            <div className={styles.productLogo}>
              <a
                href="https://appsource.microsoft.com/en-us/product/PowerBIVisuals/coacervolimited1596856650797.htmlcontent_certified"
                target="_blank"
              >
                <img
                  src="img/logo-certified.png"
                  title="Get it from Microsoft AppSource"
                />
              </a>
            </div>
            <div className={styles.productTitle}>HTML Content (lite) 🛡️</div>
            <div className={styles.productSubtitle}>
              A focused subset of HTML and SVG, with the benefits of Microsoft
              certification.
            </div>
          </div>
        </div>
        <div className={styles.bannerOptions}>
          <div>
            <Link
              className="button button--secondary button--outline button--lg"
              to="docs/visual-editions"
            >
              Compare editions
            </Link>
          </div>
          <div>
            <Link
              className="button button--secondary button--outline button--lg"
              to="docs/simple-example"
            >
              Get started
            </Link>
          </div>
          <div>
            <span className={styles.indexCtasGitHubButtonWrapper}>
              <iframe
                className={styles.indexCtasGitHubButton}
                src="https://ghbtns.com/github-btn.html?user=dm-p&amp;repo=powerbi-visuals-html-content&amp;type=star&amp;count=true&amp;size=large"
                width={150}
                height={30}
                title="GitHub Stars"
              />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main></main>
    </Layout>
  );
}
