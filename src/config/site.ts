export interface SiteLink {
  label: string;
  href: string;
}

export interface FooterGroup {
  label: string;
  links: readonly SiteLink[];
}

export const siteIdentity = {
  name: "RUDI",
  definition: "Responsible Use of Digital Intelligence",
  description: "Build AI capacity that lasts.",
  email: "hoff@learnrudi.com",
  location: "Cincinnati, Ohio",
  previewHome: "/home-preview/",
} as const;

export const primaryNavigation: readonly SiteLink[] = [
  { label: "How RUDI Helps", href: "/home-preview/#ways-to-work" },
  { label: "Methods", href: "/home-preview/#methods" },
  { label: "Case Studies", href: "/case-studies/" },
  { label: "Insights", href: "/insights/" },
  { label: "Resources", href: "/home-preview/#resources" },
  { label: "About", href: "/about.html" },
];

export const footerGroups: readonly FooterGroup[] = [
  {
    label: "Work with RUDI",
    links: [
      { label: "Strategy & Enablement", href: "/ai-enablement-preview/" },
      { label: "Applied AI Learning", href: "/ai-training.html" },
      { label: "RUDI Digital Coworkers", href: "/contact.html" },
      { label: "Contact", href: "/contact.html" },
    ],
  },
  {
    label: "Explore",
    links: [
      { label: "Methods", href: "/framework.html" },
      { label: "Case Studies", href: "/case-studies/" },
      { label: "Insights", href: "/insights/" },
      { label: "Resources", href: "/prompting.html" },
    ],
  },
  {
    label: "About",
    links: [
      { label: "RUDI", href: "/about.html" },
      { label: "Founder", href: "/founder.html" },
      { label: "Partners", href: "/partners.html" },
      { label: "Privacy", href: "/privacy.html" },
    ],
  },
];
