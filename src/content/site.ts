export interface SiteContent {
  product: {
    name: string;
    kicker: string;
    headline: string;
    heroBody: string;
    heroLinks: Array<{ label: string; href: string }>;
    pricingCallout: {
      priceText: string;
      ctaText: string;
      ctaHref: string;
    };
  };
  globalNav: {
    brand: string;
    links: Array<{ label: string; href: string }>;
  };
  highlights: {
    heading: string;
    actionLink: { label: string; href: string };
    cards: Array<{
      id: string;
      title: string;
      kicker: string;
      description: string;
    }>;
  };
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
  stories: Array<{
    id: string;
    company: string;
    quote: string;
    author: string;
    role: string;
    metric: string;
  }>;
  pricing: Array<{
    id: string;
    name: string;
    price: string;
    period: string;
    description: string;
    recommended?: boolean;
    features: string[];
    ctaText: string;
  }>;
  finalCta: {
    headline: string;
    body: string;
    ctaText: string;
    ctaHref: string;
  };
  footer: {
    notes: string[];
    directory: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    legal: {
      copyright: string;
      links: Array<{ label: string; href: string }>;
    };
  };
}

export const SITE_CONTENT: SiteContent = {
  product: {
    name: "SandipAI",
    kicker: "AI sales agent",
    headline: "The AI sales agent.\nBuilt to close.",
    heroBody: "Autonomous multi-turn lead qualification, contextual objection handling, and instant calendar booking for high-growth revenue teams.",
    heroLinks: [
      { label: "Watch how it works", href: "#how-it-works" },
      { label: "Explore features", href: "#features" },
    ],
    pricingCallout: {
      priceText: "From $1,490/mo or $125/seat",
      ctaText: "Get a demo",
      ctaHref: "#pricing",
    },
  },
  globalNav: {
    brand: "SandipAI",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Customers", href: "#customers" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  highlights: {
    heading: "Get the highlights.",
    actionLink: {
      label: "Explore capabilities",
      href: "#features",
    },
    cards: [
      {
        id: "chat-card",
        kicker: "Autonomous Conversation",
        title: "Discovers genuine buyer needs. Multi-turn. Real time.",
        description: "Engages visitors naturally, learns their stack, resolves technical questions, and steers toward booking.",
      },
      {
        id: "reasoning-card",
        kicker: "Transparent Reasoning",
        title: "Knows why it answers before sending a single word.",
        description: "Auditable chain-of-thought traces inspect intent, check product boundaries, and evaluate pricing fit.",
      },
      {
        id: "tool-card",
        kicker: "Live Tool Execution",
        title: "Checks rep availability and books the meeting on the spot.",
        description: "Direct Calendar and CRM API queries reserve slots and generate custom invites in milliseconds.",
      },
      {
        id: "task-card",
        kicker: "Pipeline Autopilot",
        title: "Executes every step from lead scoring to CRM logging.",
        description: "Enriches company data, updates opportunity records, and briefs account executives automatically.",
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
      kicker: "Conversational Intelligence",
      heading: "Talks like your top 1% AE. Reasons like your CRM.",
      body: "SandipAI handles complex enterprise sales cycles with nuanced product knowledge. It navigates technical compliance, security reviews, and pricing discussions with fluid human-level empathy.",
      linkText: "Learn about conversational safety",
      linkHref: "#how-it-works",
      align: "right",
      statsBadge: "94% objection resolution",
    },
    {
      id: "pipeline",
      kicker: "Pipeline Velocity",
      heading: "From first inquiry to confirmed calendar invite in under 30 seconds.",
      body: "When high-intent buyers arrive on your site, traditional lead forms lose 70% of prospects. SandipAI captures their peak motivation instantly, answering technical doubts and reserving executive meeting slots before they navigate away.",
      linkText: "See response time benchmarks",
      linkHref: "#customers",
      align: "left",
      statsBadge: "< 30s median response",
    },
    {
      id: "integrations",
      kicker: "Ecosystem Sync",
      heading: "Plugs directly into your CRM. Zero manual logging.",
      body: "Full bi-directional synchronization with Salesforce, HubSpot, Slack, and Google Workspace ensures every lead record, transcript note, and qualification metric is logged cleanly without rep intervention.",
      linkText: "Explore supported integrations",
      linkHref: "#pricing",
      align: "right",
      statsBadge: "100% automated logging",
    },
  ],
  stories: [
    {
      id: "story-1",
      company: "Apex Cloud",
      quote: "SandipAI qualified and scheduled $420k in pipeline during our very first weekend. It completely eliminated our Monday morning backlog.",
      author: "Marcus Vance",
      role: "VP of Global Sales",
      metric: "+142% Inbound Meetings",
    },
    {
      id: "story-2",
      company: "Synthetix Labs",
      quote: "Our response time dropped from 4 hours to 18 seconds. Buyers love the instant answers and our reps only step into calls with qualified buyers.",
      author: "Elena Rostova",
      role: "Head of Revenue Operations",
      metric: "18s Median Response",
    },
    {
      id: "story-3",
      company: "DataVeloce",
      quote: "The reasoning transparency is remarkable. We can audit every decision, objection handler, and tool call the agent made.",
      author: "David Chen",
      role: "Chief Revenue Officer",
      metric: "3.2x Pipeline Velocity",
    },
    {
      id: "story-4",
      company: "HyperScale Global",
      quote: "Handling multi-region inbound in English, German, and Spanish with native technical fluency. It paid for itself in week two.",
      author: "Sophia Lindqvist",
      role: "Director of Demand Gen",
      metric: "99.4% CSAT Rating",
    },
  ],
  pricing: [
    {
      id: "plan-growth",
      name: "Growth",
      price: "$1,490",
      period: "/ mo",
      description: "For scaling revenue teams seeking 24/7 lead capture and automatic qualification.",
      features: [
        "Up to 2,500 autonomous sales conversations / mo",
        "Autonomous meeting scheduling & qualification",
        "Bi-directional HubSpot & Google Calendar sync",
        "Custom playbook & tone alignment",
        "Standard analytics and velocity dashboards",
      ],
      ctaText: "Choose Growth",
    },
    {
      id: "plan-scale",
      name: "Scale",
      price: "$3,490",
      period: "/ mo",
      recommended: true,
      description: "For high-volume sales organizations requiring multi-channel coverage and deep CRM automation.",
      features: [
        "Up to 10,000 autonomous sales conversations / mo",
        "Omnichannel: Web Chat, Email, and SMS coverage",
        "Bi-directional Salesforce & HubSpot Enterprise sync",
        "Real-time reasoning logs & custom API tool actions",
        "Custom LLM fine-tuning on your top winning calls",
        "Dedicated Customer Success Manager",
      ],
      ctaText: "Get a demo",
    },
    {
      id: "plan-enterprise",
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For global enterprises demanding private VPC deployment, custom schemas, and SLA guarantees.",
      features: [
        "Unlimited autonomous conversations & custom seats",
        "Private cloud deployment (AWS, GCP, or On-prem)",
        "SOC 2 Type II & GDPR compliance guarantees",
        "Custom CRM schema mapping & bespoke webhook actions",
        "24/7 priority engineering support with 99.99% uptime",
        "Custom security audit reviews & SSO / SCIM",
      ],
      ctaText: "Contact Enterprise",
    },
  ],
  finalCta: {
    headline: "Never lose a qualified buyer to slow replies again.",
    body: "Deploy SandipAI into your website and CRM in under an hour. Watch your pipeline grow while you sleep.",
    ctaText: "Get a demo",
    ctaHref: "#pricing",
  },
  footer: {
    notes: [
      "1. Testing conducted with synthetic and live inbound prospect inquiries across SaaS lead workflows. Actual meeting conversion rates may vary depending on inbound traffic quality and offer structure.",
      "2. CRM sync speeds are based on standard API throughput limits for Salesforce Enterprise and HubSpot Pro tiers.",
      "3. All customer metrics reported by verified SandipAI early access design partners.",
    ],
    directory: [
      {
        title: "Product",
        links: [
          { label: "Conversational Agent", href: "#conversations" },
          { label: "Pipeline Intelligence", href: "#pipeline" },
          { label: "CRM Integrations", href: "#integrations" },
          { label: "Reasoning Trace", href: "#highlights" },
          { label: "Security & Compliance", href: "#editorial" },
        ],
      },
      {
        title: "Solutions",
        links: [
          { label: "Inbound Lead Qualification", href: "#editorial" },
          { label: "24/7 Meeting Booking", href: "#hero" },
          { label: "Enterprise Sales", href: "#pricing" },
          { label: "High-Growth Startups", href: "#pricing" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Documentation", href: "#" },
          { label: "API Reference", href: "#" },
          { label: "Customer Stories", href: "#stories" },
          { label: "Security Whitepaper", href: "#" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About SandipAI", href: "#hero" },
          { label: "Careers", href: "#" },
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
        ],
      },
    ],
    legal: {
      copyright: "Copyright © 2026 SandipAI Inc. All rights reserved.",
      links: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Use", href: "#" },
        { label: "Sales Policy", href: "#" },
        { label: "Legal", href: "#" },
        { label: "Site Map", href: "#" },
      ],
    },
  },
};
