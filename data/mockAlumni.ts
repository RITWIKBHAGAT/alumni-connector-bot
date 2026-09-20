import { AlumniProfile } from "@/types/alumni";

export const MOCK_ALUMNI: AlumniProfile[] = [
  {
    id: "alumni-1",
    name: "Maya Lin",
    initials: "ML",
    university: "Stanford University",
    degree: "B.A. in Economics, Minor in Data Science",
    graduationYear: 2019,
    currentRole: "Senior Engagement Manager",
    company: "Vanguard Strategy Partners",
    location: "New York, NY",
    industry: "Management Consulting",
    fieldCategory: "Business & Consulting",
    avatarColor: "from-blue-600 via-indigo-600 to-cyan-500",
    matchPercentage: 98,
    skills: ["Case Interview Prep", "Market Sizing", "Growth Strategy", "Digital Transformation", "Client Advisory"],
    relevanceExplanation:
      "Direct transition from undergraduate economics into elite strategy consulting. Maya has conducted 40+ mock case interviews for campus students and leads cross-border digital transformation work.",
    careerPath: [
      "Summer Business Analyst @ Vanguard Strategy",
      "Strategy Consultant (Promoted after 2 yrs)",
      "Senior Engagement Manager & Campus Recruiting Lead",
    ],
    isAvailableForMentorship: true,
    personalizationRationale:
      "References your interest in strategy consulting frameworks, her background transitioning from undergraduate studies to Vanguard, and her specific experience leading mock case interview workshops.",
    conversationStarters: [
      {
        id: "cs-1",
        topic: "Case Interview Routine",
        starterText: "How did you structure your weekly practice routine during senior year for case and behavioral interview rounds?",
      },
      {
        id: "cs-2",
        topic: "First 6 Months as Analyst",
        starterText: "What was the steepest learning curve you experienced transitioning from college coursework to live client delivery?",
      },
      {
        id: "cs-3",
        topic: "Project Staffing & Culture",
        starterText: "How did you evaluate culture, travel expectations, and staffing models when deciding between strategy practices?",
      },
    ],
    outreachDrafts: {
      professional: {
        subject: "University Alumni Connection — Inquiry on Strategy Consulting Career Path",
        body: `Dear Maya,

I hope this note finds you well. I am a university student actively preparing to enter management consulting, and I discovered your profile through the Alumni Connector platform.

Your progression at Vanguard Strategy Partners following your graduation from Stanford is very inspiring. As I prepare for upcoming recruitment cycles and practice case interview frameworks, I would be immensely grateful for 10–15 minutes of your time for a brief introductory conversation.

I would love to learn more about your experience transitioning directly into consulting and any advice you have for standing out during the interview process.

Thank you very much for your time and continued support of our alumni community.

Warm regards,
[Your Name]`,
      },
      conversational: {
        subject: "Hello from an aspiring consultant & fellow student!",
        body: `Hi Maya,

I came across your journey on the Alumni Connector and wanted to reach out! I am currently working on breaking into strategy consulting and loved seeing what you've accomplished at Vanguard Strategy Partners.

If your schedule permits a quick 10-15 minute virtual coffee chat over the coming weeks, I would love to hear about how you tackled case preparation during senior year and your transition into client engagements.

No worries at all if your calendar is packed right now. Thanks so much for being an active part of our alumni network!

Best,
[Your Name]`,
      },
      "in-depth": {
        subject: "Consulting Recruitment Strategy & Case Preparation — Alumni Inquiry",
        body: `Dear Maya,

I am writing to you as an aspiring consultant preparing for upcoming full-time recruitment cycles. Having reviewed your trajectory from undergraduate economics to Senior Engagement Manager at Vanguard Strategy Partners, I was particularly drawn to your focus on digital transformation.

As I evaluate strategy consulting practices, I would greatly value your perspective on:
1. What distinguishes standout candidates during the final-round partner case discussions?
2. How can an incoming analyst best position themselves for high-impact project staffing early in their tenure?

If you have 15 minutes available for a brief conversation, I would be deeply grateful for your insights.

Thank you for your guidance and leadership.

Sincerely,
[Your Name]`,
      },
    },
  },
  {
    id: "alumni-2",
    name: "Julian Thorne",
    initials: "JT",
    university: "UC Berkeley",
    degree: "B.S. in Electrical Engineering & Computer Science",
    graduationYear: 2021,
    currentRole: "Lead Product Manager",
    company: "Northstar Cloud Systems",
    location: "San Francisco, CA",
    industry: "Enterprise Software & Cloud",
    fieldCategory: "Technology & Digital",
    avatarColor: "from-cyan-500 via-teal-500 to-blue-600",
    matchPercentage: 95,
    skills: ["Product Strategy", "Technical Roadmapping", "User Research", "APM Recruiting", "Cloud Infrastructure"],
    relevanceExplanation:
      "Secured an Associate Product Manager (APM) role right out of undergraduate studies. Julian has mentored dozens of students on product design exercises and technical cross-functional leadership.",
    careerPath: [
      "Associate Product Manager @ Northstar Cloud",
      "Product Manager — Core Infrastructure",
      "Lead Product Manager — Developer Platform",
    ],
    isAvailableForMentorship: true,
    personalizationRationale:
      "Tailored around his undergraduate engineering background, his transition into an APM program, and Northstar Cloud Systems' focus on developer infrastructure.",
    conversationStarters: [
      {
        id: "cs-4",
        topic: "APM Interview Preparation",
        starterText: "What product sense or system design resources were most effective during your APM interview prep?",
      },
      {
        id: "cs-5",
        topic: "Technical Credibility",
        starterText: "How do you build credibility with engineering teams when starting as an early-career product manager?",
      },
      {
        id: "cs-6",
        topic: "Portfolio & Side Projects",
        starterText: "Did side projects or campus leadership play a larger role in helping your resume stand out to APM recruiters?",
      },
    ],
    outreachDrafts: {
      professional: {
        subject: "Alumni Connection — Aspiring Product Manager Seeking Perspective",
        body: `Dear Julian,

I hope you are having a productive week. I am a university student passionate about product management in enterprise software, and I discovered your profile through the Alumni Connector network.

Your track record building at Northstar Cloud Systems following your graduation from UC Berkeley is truly commendable. As I prepare for upcoming APM applications, I would appreciate the opportunity to ask 2–3 questions about your transition into tech product management.

If your schedule permits, could we schedule a brief 15-minute call sometime in the next couple of weeks?

Thank you for your time and willingness to support students.

Sincerely,
[Your Name]`,
      },
      conversational: {
        subject: "Quick hello from an aspiring PM & fellow alumnus!",
        body: `Hi Julian,

Hope you're having a great week! I found your profile on Alumni Connector while looking for alumni working in product management. 

Your work at Northstar Cloud Systems looks incredible. I'm currently preparing for APM programs and product design interviews, and would love to hear any advice you have for early-career PMs.

Would you be open to a quick 10-minute virtual chat sometime this month? Completely understand if you're busy!

Cheers,
[Your Name]`,
      },
      "in-depth": {
        subject: "Inquiry on APM Recruiting & Product Leadership — Alumni Mentorship",
        body: `Dear Julian,

I am reaching out as a student actively building towards a career in technical product management. Seeing your trajectory from campus to Lead Product Manager at Northstar Cloud Systems has been very inspiring.

I am particularly interested in learning how candidates can best demonstrate product judgment and technical fluency during the interview loop.

If you have 15 minutes available for a brief informational interview, I would welcome the chance to speak. Thank you for your leadership within our alumni network.

Warm regards,
[Your Name]`,
      },
    },
  },
  {
    id: "alumni-3",
    name: "Zara Henderson",
    initials: "ZH",
    university: "Columbia University",
    degree: "B.A. in Financial Economics & Mathematics",
    graduationYear: 2018,
    currentRole: "Vice President, Technology M&A",
    company: "Beacon Capital Advisory",
    location: "London, UK",
    industry: "Investment Banking & Private Equity",
    fieldCategory: "Finance & Accounting",
    avatarColor: "from-indigo-600 via-purple-600 to-pink-500",
    matchPercentage: 92,
    skills: ["Financial Modeling", "Valuation", "M&A Execution", "Analyst Recruiting", "LBO Modeling"],
    relevanceExplanation:
      "Completed 2 years as a high-performing investment banking analyst before fast-tracking into M&A leadership. Zara frequently reviews student resumes and advises on technical financial modeling tests.",
    careerPath: [
      "Investment Banking Analyst — M&A Group",
      "Associate — Technology, Media & Telecom",
      "Vice President — Technology M&A Advisory",
    ],
    isAvailableForMentorship: false,
    personalizationRationale:
      "Addresses her cross-border banking career in London, her progression from analyst to VP at Beacon Capital, and her focus on tech M&A deal execution.",
    conversationStarters: [
      {
        id: "cs-7",
        topic: "Technical Interview Mastery",
        starterText: "What financial modeling concepts are most frequently tested in the Superday technical interviews?",
      },
      {
        id: "cs-8",
        topic: "Managing Deal Intensity",
        starterText: "What advice would you give an incoming analyst on managing intense deal cycles while maintaining precision?",
      },
      {
        id: "cs-9",
        topic: "London vs US Banking Markets",
        starterText: "How does the investment banking recruitment cycle and day-to-day culture differ between European and US markets?",
      },
    ],
    outreachDrafts: {
      professional: {
        subject: "University Alumni Outreach — Career Advisory Inquiry in Investment Banking",
        body: `Dear Zara,

I hope this email finds you well. I am a student preparing for investment banking recruitment and noticed your profile via our university Alumni Connector.

Your accomplishments within Technology M&A at Beacon Capital Advisory are exceptional. As I refine my technical preparation and deal knowledge, I would be grateful for the chance to connect briefly for 10–15 minutes.

I would love to hear your insights on what distinguishes successful junior analysts in technology transactions.

Thank you very much for your consideration and time.

Kind regards,
[Your Name]`,
      },
      conversational: {
        subject: "Quick hello from a student interested in Investment Banking!",
        body: `Hi Zara,

I came across your profile through the Alumni Connector and was excited to see an alumnus thriving in Tech M&A in London! 

I'm currently preparing for banking recruitment and practicing financial modeling. If you have 10 minutes over the next few weeks for a short catch-up, I would love to hear any pointers you'd recommend to an aspiring analyst.

Thank you so much for your time!

Best,
[Your Name]`,
      },
      "in-depth": {
        subject: "Investment Banking Advisory & Career Guidance — Alumni Network",
        body: `Dear Zara,

I am writing to you as an undergraduate preparing for M&A recruitment. Your progression from Analyst to Vice President at Beacon Capital Advisory is a model career path I deeply admire.

With tech sector deal environments evolving rapidly, I would value your perspective on how junior bankers can develop stronger strategic intuition alongside quantitative modeling.

If your schedule allows for a brief 15-minute phone call, I would be honored to speak with you. Thank you for your continued engagement with our student community.

Sincerely,
[Your Name]`,
      },
    },
  },
  {
    id: "alumni-4",
    name: "Dr. David K. O'Connor",
    initials: "DO",
    university: "MIT",
    degree: "Ph.D. in Computer Science (Artificial Intelligence)",
    graduationYear: 2020,
    currentRole: "Staff AI Research Scientist",
    company: "Aether Intelligence Labs",
    location: "Seattle, WA",
    industry: "Artificial Intelligence & ML",
    fieldCategory: "Technology & Digital",
    avatarColor: "from-cyan-400 via-blue-600 to-indigo-700",
    matchPercentage: 89,
    skills: ["Large Language Models", "PyTorch", "Model Evaluation", "Research Publishing", "Alignment"],
    relevanceExplanation:
      "Publishes regularly at top machine learning venues (NeurIPS, ICML). David advises students on navigating the transition from computer science coursework to industry AI research labs.",
    careerPath: [
      "Graduate Research Assistant @ MIT CSAIL",
      "Research Scientist @ Aether Labs",
      "Staff AI Research Scientist & Foundation Model Lead",
    ],
    isAvailableForMentorship: true,
    personalizationRationale:
      "Highlights his academic research roots at MIT CSAIL, publication track record, and current work on frontier generative models at Aether Intelligence Labs.",
    conversationStarters: [
      {
        id: "cs-10",
        topic: "Research vs Engineering Pathways",
        starterText: "How did you decide between applied machine learning engineering and dedicated AI research roles?",
      },
      {
        id: "cs-11",
        topic: "Pre-training vs Fine-tuning",
        starterText: "What foundational skills in model evaluation and alignment are currently most in demand at frontier labs?",
      },
      {
        id: "cs-12",
        topic: "Ph.D. vs Industry Transition",
        starterText: "What factors should a student weigh when deciding whether to pursue a Ph.D. or enter industry research directly?",
      },
    ],
    outreachDrafts: {
      professional: {
        subject: "Alumni Connection — Student Interested in AI Research Pathways",
        body: `Dear Dr. O'Connor,

I hope you are having a wonderful week. I am an undergraduate studying computer science with a focus on machine learning, and I discovered your profile through the Alumni Connector directory.

Your research work at Aether Intelligence Labs on large language models is truly fascinating. As I consider post-graduation opportunities in industry AI labs, I would greatly appreciate the opportunity to ask a few questions about your research path.

Would you be open to a brief 15-minute virtual conversation at your convenience?

Thank you for your time and continued support of our university community.

Best regards,
[Your Name]`,
      },
      conversational: {
        subject: "Hello from a fellow student passionate about Machine Learning!",
        body: `Hi David,

I came across your profile on the Alumni Connector! I've been following recent publications coming out of Aether Intelligence Labs and was so excited to see an alumnus on the research team.

I'm currently working on ML projects and trying to decide between industry research and grad school. If you ever have 10-15 minutes to chat, I'd love to learn about your path and any advice you have.

No pressure at all, but thanks for being part of our alumni community!

Cheers,
[Your Name]`,
      },
      "in-depth": {
        subject: "Inquiry regarding ML Research Careers & Graduate School — Alumni Network",
        body: `Dear Dr. O'Connor,

I am reaching out as a student actively conducting research in deep learning and natural language processing. Your transition into a Staff Scientist role at Aether Intelligence Labs represents the exact career trajectory I aim to pursue.

I would be deeply grateful to discuss how students can best demonstrate research independence and strong engineering fundamentals when applying to competitive research residency programs.

If you have 15 minutes available in the coming weeks, I would be grateful for a brief conversation. Thank you for your guidance.

Warm regards,
[Your Name]`,
      },
    },
  },
  {
    id: "alumni-5",
    name: "Elena Vasquez",
    initials: "EV",
    university: "Rhode Island School of Design / Brown",
    degree: "B.F.A. in Industrial Design & Human Factors",
    graduationYear: 2020,
    currentRole: "Staff Product Designer",
    company: "Linear Studio Systems",
    location: "Austin, TX",
    industry: "Design, Media & Creative",
    fieldCategory: "Design, Media & Creative",
    avatarColor: "from-fuchsia-500 via-rose-500 to-amber-500",
    matchPercentage: 94,
    skills: ["Design Systems", "Interaction Design", "Figma Prototyping", "Design Engineering", "User Research"],
    relevanceExplanation:
      "Crafts industry-defining developer tool interfaces. Elena transitioned from student portfolio reviews directly into hyper-growth design teams and leads design critiques for young designers.",
    careerPath: [
      "Product Design Intern @ Tech Studio",
      "Senior Product Designer — Design Systems",
      "Staff Product Designer @ Linear Studio",
    ],
    isAvailableForMentorship: true,
    personalizationRationale:
      "Focuses on her design systems craftsmanship at Linear Studio Systems, portfolio curation strategy, and transition from design school to lead designer.",
    conversationStarters: [
      {
        id: "cs-13",
        topic: "Portfolio Storytelling",
        starterText: "What core elements make an early-career product design case study immediately compelling to design directors?",
      },
      {
        id: "cs-14",
        topic: "Design Systems Craft",
        starterText: "How do you balance systematic design tokens with rapid micro-interaction prototyping?",
      },
      {
        id: "cs-15",
        topic: "Cross-Disciplinary Growth",
        starterText: "How much front-end code should an aspiring product designer understand to collaborate effectively with engineering?",
      },
    ],
    outreachDrafts: {
      professional: {
        subject: "Alumni Connection — Design Mentorship & Portfolio Inquiry",
        body: `Dear Elena,

I hope you are doing well. I am a student studying product design and human-computer interaction, and I came across your profile via our Alumni Connector network.

Your design craftsmanship at Linear Studio Systems is exceptional. As I assemble my entry-level design portfolio, I would be grateful for 10–15 minutes of your time to ask about what design teams value most in early-career hires.

Thank you very much for your time and willingness to mentor.

Best regards,
[Your Name]`,
      },
      conversational: {
        subject: "Quick hello from an aspiring UX/UI designer!",
        body: `Hi Elena,

I found your profile on the Alumni Connector and just wanted to say how much I admire your work at Linear Studio Systems! 

I'm currently putting together my design portfolio and working on UI micro-interactions. If you ever have 10 minutes for a virtual coffee chat, I'd love to ask a couple of quick questions about breaking into product design.

Thanks so much!

Best,
[Your Name]`,
      },
      "in-depth": {
        subject: "Product Design Craft & Portfolio Architecture — Alumni Inquiry",
        body: `Dear Elena,

I am writing to you as an aspiring product designer preparing for upcoming studio recruitment cycles. Your work pioneering interaction design at Linear Studio Systems represents the standard of craftsmanship I strive toward.

I would be grateful for your perspective on how students can best showcase systems thinking and engineering empathy within their case studies.

Thank you for your continued support of our creative alumni community.

Warm regards,
[Your Name]`,
      },
    },
  },
  {
    id: "alumni-6",
    name: "Marcus Vance",
    initials: "MV",
    university: "Johns Hopkins University",
    degree: "B.S. in Biomedical Engineering & Biotechnology",
    graduationYear: 2019,
    currentRole: "Director of Translational Therapeutics",
    company: "NexuBio Genomics",
    location: "Boston, MA",
    industry: "Healthcare & Life Sciences",
    fieldCategory: "Healthcare & Life Sciences",
    avatarColor: "from-emerald-500 via-teal-600 to-cyan-700",
    matchPercentage: 91,
    skills: ["Drug Discovery", "Genomic Editing", "Translational Medicine", "Clinical Trials", "R&D Strategy"],
    relevanceExplanation:
      "Led novel mRNA and CRISPR screening programs from university lab bench through pre-clinical phases. Marcus advises undergraduate researchers transitioning into biotech startups.",
    careerPath: [
      "Research Associate @ Harvard Medical School",
      "Senior Scientist — Cell Therapy @ NexuBio",
      "Director of Translational Therapeutics",
    ],
    isAvailableForMentorship: true,
    personalizationRationale:
      "Connects your interest in biotechnology and translational medicine with his trajectory moving from academic research at JHU to biotech executive leadership in Boston.",
    conversationStarters: [
      {
        id: "cs-16",
        topic: "Academia to Biotech Transition",
        starterText: "What was the most important mindset shift when transitioning from academic bench science to a biotech startup?",
      },
      {
        id: "cs-17",
        topic: "Pre-clinical Regulatory Strategy",
        starterText: "How early should translational researchers begin preparing for FDA IND filings during discovery?",
      },
      {
        id: "cs-18",
        topic: "Early-Career Lab Roles",
        starterText: "What technical assays and computational skills are most in demand for entry-level research scientists?",
      },
    ],
    outreachDrafts: {
      professional: {
        subject: "Alumni Connection — Biotechnology & Translational Medicine Inquiry",
        body: `Dear Marcus,

I hope you are well. I am an undergraduate student studying biomedical engineering and biotechnology, and I discovered your profile through the Alumni Connector network.

Your career trajectory from Johns Hopkins to directing translational research at NexuBio Genomics is remarkably inspiring. As I evaluate career pathways in therapeutic discovery, I would be grateful for 10–15 minutes of your guidance.

Thank you very much for your time and continued support of students.

Sincerely,
[Your Name]`,
      },
      conversational: {
        subject: "Hello from a fellow biotech student & researcher!",
        body: `Hi Marcus,

I saw your journey on the Alumni Connector and wanted to reach out! I'm currently working on wet-lab research in genomics and hoping to transition into the Boston biotech scene after graduation.

If you have 10-15 minutes for a virtual coffee chat sometime this month, I'd love to hear your thoughts on making the jump from academic research into biotech.

Thanks so much!

Best,
[Your Name]`,
      },
      "in-depth": {
        subject: "Translational Biotech Careers & Pre-clinical Strategy — Alumni Guidance",
        body: `Dear Marcus,

I am reaching out as an aspiring biomedical researcher preparing for post-graduation opportunities in therapeutics. Following your work at NexuBio Genomics, I am eager to understand how early-career scientists can balance deep technical specialization with broader commercial strategy.

If you have 15 minutes available in the coming weeks, I would be honored to speak with you.

Thank you for your guidance.

Warm regards,
[Your Name]`,
      },
    },
  },
];

export const SUGGESTED_GOALS = [
  "I want to break into management consulting at a top strategy firm.",
  "I want to become an Associate Product Manager (APM) in tech.",
  "I want to land an investment banking analyst role in M&A.",
  "I want to transition into an applied AI / machine learning research role.",
  "I want to build a career in product design and design systems.",
  "I want to transition from lab research into biotechnology and drug discovery.",
];
