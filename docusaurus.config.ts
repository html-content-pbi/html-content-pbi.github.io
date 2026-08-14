import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "HTML Content",
  tagline: "Generate rich, dynamic content in your Power BI reports",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://html-content.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "html-content-pbi", // Usually your GitHub org/user name.
  projectName: "html-content-doc", // Usually your repo name.
  trailingSlash: false,

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // 1.6 is the published baseline; docs/ is the "next" working copy.
          lastVersion: "1.6",
          versions: {
            current: {
              label: "2.0 🚧",
              banner: "unreleased",
              noIndex: true,
            },
          },
          // 2.0 (current) ships alongside 1.6 and appears in the version
          // dropdown for beta testing. It keeps the unreleased banner and
          // noIndex until it becomes the published baseline.
          // Exclude agent-internal work artifacts from the published site.
          // docs/plans/ holds implementation plans authored for agent execution;
          // they are not user-facing documentation and their internal cross-link
          // style is not Docusaurus-resolvable.
          exclude: ["plans/**"],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/html-content-pbi/html-content-pbi.github.io/tree/main",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/html-content-pbi/html-content-pbi.github.io/tree/main",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
        gtag: {
          trackingID: "G-8BPRENKBZR",
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        // Unversioned community/process docs (early access builds, etc.).
        // Lives outside the 1.6/2.0 versioning because the process is
        // version-independent and must always be visible in production.
        id: "community",
        path: "community",
        routeBasePath: "community",
        sidebarPath: "./sidebarsCommunity.ts",
        editUrl:
          "https://github.com/html-content-pbi/html-content-pbi.github.io/tree/main",
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      logo: {
        alt: "My Site Logo",
        src: "img/banner.svg",
        srcDark: "img/banner-dark.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Docs",
        },
        { to: "/blog", label: "Blog", position: "left" },
        { to: "/community/early-access", label: "Community", position: "left" },
        {
          type: "docsVersionDropdown",
          position: "right",
        },
        {
          href: "https://github.com/sponsors/dm-p",
          label: "Sponsor",
          position: "right",
        },
        {
          href: "/privacy-policy",
          label: "Privacy Policy",
          position: "right",
        },
        {
          href: "https://github.com/dm-p/powerbi-visuals-html-content",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `HTML Content and HTML Content (lite) are released under the MIT License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
