export interface CostComparisonDimension {
  metric: string;
  humanCoverage: {
    value: string;
    note: string;
  };
  orynvaiCoverage: {
    value: string;
    note: string;
  };
  operationalAdvantage: string;
}

export interface CostComparisonData {
  kicker: string;
  heading: string;
  subheading: string;
  configurationNotice: string;
  summaryMetrics: Array<{
    label: string;
    humanValue: string;
    orynvaiValue: string;
    delta: string;
    note: string;
  }>;
  dimensions: CostComparisonDimension[];
}

export interface HowItWorksFilmStage {
  id: string;
  step: string;
  shortTitle: string;
  headline: string;
  description: string;
  badge: string;
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
  kineticBand: string[];
  editorialSections: Array<{
    id: string;
    kicker: string;
    heading: string;
    body: string;
    linkText: string;
    linkHref: string;
    align: "left" | "right";
    statsBadge?: string;
  }>;
  costComparison: CostComparisonData;
  stories: Array<{
    id: string;
    company: string;
    quote: string;
    author: string;
    role: string;
    metric: string;
    video?: {
      available: boolean;
      videoUrl?: string;
      posterUrl?: string;
      duration?: string;
    };
  }>;
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
    heroBody: "Traditional sales teams lose high-intent buyers during off-hours and delayed response windows. ORYNVAI engages enterprise prospects instantly, resolves technical objections, and books confirmed executive calls 24/7.",
    heroLinks: [
      { label: "See how it works", href: "#how-it-works" },
      { label: "Compare coverage", href: "#comparison" },
    ],
    coverageBadge: "24/7 Continuous Inbound Sales Coverage",
  },
  globalNav: {
    brand: "ORYNVAI",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Cost comparison", href: "#comparison" },
      { label: "Customer proof", href: "#customers" },
    ],
    ctaVapi: "Talk to ORYNVAI",
    ctaBooking: "Book a sales call",
  },
  howItWorks: {
    kicker: "CONTINUOUS PRODUCT FILM",
    heading: "From first contact to a real opportunity.",
    subheading: "Watch how ORYNVAI turns an incoming inquiry into a confirmed meeting and updates your business systems in seconds.",
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
        description: "Inquiry arrives at 10:42 PM on a weekend. System acknowledges intent immediately.",
        badge: "Inbound Trigger",
      },
      {
        id: "ai-responds",
        step: "02",
        shortTitle: "ORYNVAI Responds",
        headline: "Engages in natural dialogue.",
        description: "Answers technical questions, resolves compliance inquiries, and keeps the buyer engaged.",
        badge: "Sub-30s Dialogue",
      },
      {
        id: "opportunity-clears",
        step: "03",
        shortTitle: "Intent Qualified",
        headline: "The opportunity becomes clear.",
        description: "Classifies enterprise intent and suggests meeting times tailored to representative availability.",
        badge: "Qualified Lead",
      },
      {
        id: "calendar-booking",
        step: "04",
        shortTitle: "3D Calendar",
        headline: "Tactile meeting confirmation.",
        description: "Calendar pages turn, date highlights, and a confirmed executive meeting is locked on the schedule.",
        badge: "Calendar Locked",
      },
      {
        id: "connected-systems",
        step: "05",
        shortTitle: "Connected Systems",
        headline: "Dispatches to your stack.",
        description: "Instant data movement into Salesforce, HubSpot, Slack, and Google Workspace.",
        badge: "Ecosystem Synced",
      },
    ],
  },
  kineticBand: [
    "Zero",
    "missed",
    "inbound",
    "leads.",
    "Instant",
    "qualification.",
    "High-intent",
    "meetings",
    "booked",
    "around",
    "the",
    "clock.",
  ],
  editorialSections: [
    {
      id: "conversations",
      kicker: "SMART CONVERSATIONS",
      heading: "Answers questions like your best rep. Instantly.",
      body: "Handles enterprise technical questions, compliance boundaries, and pricing discussions with verified accuracy.",
      linkText: "Learn about conversational safety",
      linkHref: "#how-it-works",
      align: "right",
      statsBadge: "94% objection resolution",
    },
    {
      id: "pipeline",
      kicker: "SPEED TO LEAD",
      heading: "From first contact to confirmed meeting in 30 seconds.",
      body: "Engages high-intent buyers the moment they land, preventing lead decay and lost opportunities.",
      linkText: "See response time benchmarks",
      linkHref: "#customers",
      align: "left",
      statsBadge: "< 30s median response",
    },
    {
      id: "integrations",
      kicker: "CONNECTED SYSTEMS",
      heading: "Syncs directly with your core sales stack.",
      body: "Live bi-directional synchronization with Salesforce, HubSpot, Slack, and Google Workspace without manual entry.",
      linkText: "Explore supported integrations",
      linkHref: "#how-it-works",
      align: "right",
      statsBadge: "100% automated logging",
    },
  ],
  costComparison: {
    kicker: "FINANCIAL & OPERATIONAL VALUE",
    heading: "Human sales capacity vs. continuous AI.",
    subheading: "A visual comparison of operating coverage, speed to lead, and organizational overhead.",
    configurationNotice: "Client Configuration Field: Industry benchmark baseline shown. Final enterprise unit economics will be calibrated to your exact compensation model and inbound lead volume.",
    summaryMetrics: [
      {
        label: "Weekly Active Coverage",
        humanValue: "40 hrs / wk",
        orynvaiValue: "168 hrs / wk",
        delta: "4.2x coverage",
        note: "Zero coverage drop during nights, weekends, and holidays.",
      },
      {
        label: "Speed to Lead Response",
        humanValue: "42 min – 4 hrs",
        orynvaiValue: "< 30 seconds",
        delta: "Instantaneous",
        note: "Captures prospect intent at peak buying momentum.",
      },
      {
        label: "Annual Cost per Rep Equiv.",
        humanValue: "$95k – $130k+",
        orynvaiValue: "Operational fraction",
        delta: "Significant OPEX savings",
        note: "Zero recruiter fees, healthcare, payroll tax, or ramp downtime.",
      },
    ],
    dimensions: [
      {
        metric: "Base & Target Compensation",
        humanCoverage: {
          value: "$65,000 – $85,000",
          note: "Base salary before OTE incentives",
        },
        orynvaiCoverage: {
          value: "Service investment",
          note: "Predictable software & operational usage",
        },
        operationalAdvantage: "Direct overhead reduction",
      },
      {
        metric: "Benefits, Taxes & Tooling",
        humanCoverage: {
          value: "+20% to 25%",
          note: "Healthcare, payroll taxes, seat licenses",
        },
        orynvaiCoverage: {
          value: "$0 payroll overhead",
          note: "All infrastructure included",
        },
        operationalAdvantage: "Zero ancillary costs",
      },
      {
        metric: "Recruitment & Placement",
        humanCoverage: {
          value: "$8,000 – $15,000",
          note: "Agency fees or internal sourcing costs",
        },
        orynvaiCoverage: {
          value: "$0 placement fee",
          note: "Immediate deployment",
        },
        operationalAdvantage: "Eliminates recruiting lag",
      },
      {
        metric: "Ramp & Onboarding Time",
        humanCoverage: {
          value: "3 to 4 months",
          note: "Time to full product fluency & quota",
        },
        orynvaiCoverage: {
          value: "< 1 hour setup",
          note: "Pre-trained on your collateral & CRM rules",
        },
        operationalAdvantage: "Instant pipeline contribution",
      },
      {
        metric: "After-Hours & Weekend Leads",
        humanCoverage: {
          value: "Unattended (lost)",
          note: "70% of inbound buyers decay within 1 hour",
        },
        orynvaiCoverage: {
          value: "100% engaged live",
          note: "Immediate technical qualification & booking",
        },
        operationalAdvantage: "Monetizes off-hours traffic",
      },
      {
        metric: "Concurrent Lead Capacity",
        humanCoverage: {
          value: "1 conversation at a time",
          note: "Spike traffic results in dropped leads",
        },
        orynvaiCoverage: {
          value: "Unlimited concurrent",
          note: "Scales elastically with zero queuing",
        },
        operationalAdvantage: "Zero queue bottlenecks",
      },
      {
        metric: "Tenure & Knowledge Retention",
        humanCoverage: {
          value: "14 – 18 month tenure",
          note: "Knowledge lost upon rep departure",
        },
        orynvaiCoverage: {
          value: "Permanent enterprise asset",
          note: "Continuous learning and versioned playbooks",
        },
        operationalAdvantage: "Retains institutional memory",
      },
    ],
  },
  stories: [
    {
      id: "story-1",
      company: "Apex Cloud",
      quote: "ORYNVAI qualified and scheduled $420k in pipeline during our very first weekend. It completely eliminated our Monday morning backlog.",
      author: "Marcus Vance",
      role: "VP of Global Sales",
      metric: "+142% Inbound Meetings",
      video: {
        available: false,
      },
    },
    {
      id: "story-2",
      company: "Synthetix Labs",
      quote: "Our response time dropped from 4 hours to 18 seconds. Buyers love the instant answers and our reps only step into calls with qualified buyers.",
      author: "Elena Rostova",
      role: "Head of Revenue Operations",
      metric: "18s Median Response",
      video: {
        available: false,
      },
    },
    {
      id: "story-3",
      company: "DataVeloce",
      quote: "The reasoning transparency is remarkable. We can audit every decision, objection handler, and tool call the agent made.",
      author: "David Chen",
      role: "Chief Revenue Officer",
      metric: "3.2x Pipeline Velocity",
      video: {
        available: false,
      },
    },
    {
      id: "story-4",
      company: "HyperScale Global",
      quote: "Handling multi-region inbound in English, German, and Spanish with native technical fluency. It paid for itself in week two.",
      author: "Sophia Lindqvist",
      role: "Director of Demand Gen",
      metric: "99.4% CSAT Rating",
      video: {
        available: false,
      },
    },
  ],
  finalCta: {
    headline: "Convert your extra hours into revenue.",
    body: "Deploy ORYNVAI across your inbound channels. Experience instantaneous lead response and continuous pipeline generation.",
    ctaBooking: "Book a sales call",
    ctaVapi: "Talk to ORYNVAI",
  },
  footer: {
    brand: "ORYNVAI",
    description: "Autonomous revenue intelligence converting inbound interest into qualified sales pipeline 24/7.",
    essentialLinks: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Cost comparison", href: "#comparison" },
      { label: "Customer proof", href: "#customers" },
    ],
    contactInfo: {
      note: "Enterprise consultations and custom deployments available worldwide.",
    },
    legal: {
      copyright: "Copyright © 2026 ORYNVAI Inc. All rights reserved.",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Security & Compliance", href: "#how-it-works" },
      ],
    },
  },
};
