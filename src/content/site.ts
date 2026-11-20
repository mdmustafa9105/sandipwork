export interface CostComparisonData {
  kicker: string;
  heading: string;
  subheading: string;
  configurationNotice: string;
}

export interface HowItWorksFilmStage {
  id: string;
  step: string;
  shortTitle: string;
  headline: string;
  description: string;
}

export interface HowItWorksSection {
  kicker: string;
  heading: string;
  subheading: string;
  actionLink: { label: string; href: string };
  stages: HowItWorksFilmStage[];
}

export interface SiteContent {
  product: {
    name: string;
    kicker: string;
    headline: string;
    heroBody: string;
    heroLinks: Array<{ label: string; href: string }>;
    coverageBadge: string;
  };
  globalNav: {
    brand: string;
    links: Array<{ label: string; href: string }>;
    ctaVapi: string;
    ctaBooking: string;
  };
  howItWorks: HowItWorksSection;
  costComparison: CostComparisonData;
  finalCta: {
    headline: string;
    body: string;
    ctaBooking: string;
    ctaVapi: string;
  };
  footer: {
    brand: string;
    description: string;
    essentialLinks: Array<{ label: string; href: string }>;
    contactInfo?: {
      email?: string;
      note?: string;
    };
    legal: {
      copyright: string;
      links: Array<{ label: string; href: string }>;
    };
  };
}

export const SITE_CONTENT: SiteContent = {
  product: {
    name: "ORYNVAI",
    kicker: "Autonomous Revenue Intelligence",
    headline: "Convert your extra hours into revenue.\nClose inbound buyers around the clock.",
    heroBody: "Traditional sales teams lose high-intent buyers during off-hours and delayed response windows. ORYNVAI engages enterprise prospects instantly, resolves technical objections, and books confirmed executive calls — continuously.",
    heroLinks: [
      { label: "See how it works", href: "#how-it-works" },
      { label: "Compare coverage", href: "#comparison" },
    ],
    coverageBadge: "Continuous Inbound Sales Coverage",
  },
  globalNav: {
    brand: "ORYNVAI",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Cost comparison", href: "#comparison" },
    ],
    ctaVapi: "Talk to ORYNVAI",
    ctaBooking: "Book a sales call",
  },
  howItWorks: {
    kicker: "HOW IT WORKS",
    heading: "From first contact to a real opportunity.",
    subheading: "Watch how ORYNVAI turns an incoming inquiry into a confirmed meeting and updates your business systems — automatically.",
    actionLink: {
      label: "Compare economic coverage",
      href: "#comparison",
    },
    stages: [
      {
        id: "lead-arrives",
        step: "01",
        shortTitle: "Lead Arrives",
        headline: "A potential buyer reaches out.",
        description: "An inquiry arrives outside business hours. ORYNVAI acknowledges intent immediately.",
      },
      {
        id: "ai-responds",
        step: "02",
        shortTitle: "ORYNVAI Responds",
        headline: "Engages in natural dialogue.",
        description: "Answers technical questions, resolves compliance inquiries, and keeps the buyer engaged.",
      },
      {
        id: "opportunity-clears",
        step: "03",
        shortTitle: "Intent Qualified",
        headline: "The opportunity becomes clear.",
        description: "Classifies enterprise intent and suggests meeting times tailored to representative availability.",
      },
      {
        id: "calendar-booking",
        step: "04",
        shortTitle: "Meeting Booked",
        headline: "Meeting confirmed on the calendar.",
        description: "A confirmed executive meeting is locked on the schedule with calendar invite and video link.",
      },
      {
        id: "connected-systems",
        step: "05",
        shortTitle: "Systems Updated",
        headline: "Your business stack is updated.",
        description: "Data flows into Salesforce, HubSpot, Slack, and Google Workspace automatically.",
      },
    ],
  },
  costComparison: {
    kicker: "COVERAGE COMPARISON",
    heading: "Human sales capacity vs. continuous AI.",
    subheading: "A visual comparison of operating coverage and responsiveness.",
    configurationNotice: "Specific unit economics will be calibrated to your compensation model and inbound lead volume during consultation.",
  },
  finalCta: {
    headline: "Convert your extra hours into revenue.",
    body: "Deploy ORYNVAI across your inbound channels. See how continuous lead response can transform your pipeline.",
    ctaBooking: "Book a sales call",
    ctaVapi: "Talk to ORYNVAI",
  },
  footer: {
    brand: "ORYNVAI",
    description: "Autonomous revenue intelligence converting inbound interest into qualified sales pipeline — continuously.",
    essentialLinks: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Cost comparison", href: "#comparison" },
    ],
    contactInfo: {
      note: "Enterprise consultations and custom deployments available worldwide.",
    },
    legal: {
      copyright: "Copyright © 2026 ORYNVAI Inc. All rights reserved.",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
  },
};
