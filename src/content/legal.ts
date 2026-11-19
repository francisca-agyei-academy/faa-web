import type { LegalSection } from "@/components/website/LegalPage";
import { disclaimer } from "./academy";

// Plain-language starting points. Have them reviewed by a lawyer before launch,
// and update `legalUpdated` whenever the wording changes.

export const legalUpdated = "19 November 2026";

export const privacyIntro =
  "This policy explains what personal information Gradvane Global collects when you use our website and courses, why we collect it, and the choices you have.";

export const privacySections: LegalSection[] = [
  {
    heading: "Who we are",
    paragraphs: [
      "Gradvane Global (\"we\", \"us\", \"our\") runs this website and its online courses. We are responsible for the personal information described in this policy.",
    ],
  },
  {
    heading: "Information we collect",
    list: [
      "Account details: your first and last name, email address, and phone number if you choose to give it.",
      "Your password, which we store only in a scrambled (hashed) form that we cannot read.",
      "Purchase records: the modules you buy, the amount, the date, the payment reference and when your access ends.",
      "Technical information: your IP address and basic request details, used to keep the site secure and to stop abuse such as repeated login attempts.",
      "Anything you send us, such as emails or, for premium services, application documents you share for review.",
    ],
    after: [
      "Payments are handled by our payment provider, Paystack. We never receive or store your full card or mobile money details.",
    ],
  },
  {
    heading: "How we use your information",
    list: [
      "To create and manage your account and confirm your email address.",
      "To give you access to the modules you have bought.",
      "To process payments and send you receipts and important account messages.",
      "To keep the website and your account secure.",
      "To answer your questions and provide any services you ask for.",
      "To improve our courses and website.",
      "To meet our legal and accounting obligations.",
    ],
    after: ["We do not sell your personal information. We only send marketing emails if you have agreed to receive them, and you can stop them at any time."],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "We only use cookies that are needed to keep you signed in and your account secure. We do not use advertising or tracking cookies.",
      "You can block cookies in your browser, but you will not be able to sign in if you do.",
    ],
  },
  {
    heading: "Who we share information with",
    paragraphs: [
      "We share information only with trusted service providers who help us run Gradvane Global, and only as much as they need to do their job:",
    ],
    list: [
      "Paystack, to process payments.",
      "Google, to send account and course emails.",
      "Supabase, which hosts our database.",
      "Vercel and Render, which host our website and services.",
      "Cloudflare, which stores course images.",
    ],
    after: ["We may also share information if the law requires it, or to protect the rights and safety of our students, our team or others."],
  },
  {
    heading: "International transfers",
    paragraphs: [
      "Some of our service providers store or process information outside Ghana, for example in the European Union or the United States. We choose reputable providers that protect personal information with appropriate security measures.",
    ],
  },
  {
    heading: "How long we keep your information",
    paragraphs: [
      "We keep your account information for as long as your account is open. We keep purchase records for as long as we need them for accounting and legal reasons. Application documents you share with us are used only for the service you asked for, kept confidential and deleted when no longer needed.",
      "When we no longer need information, we delete it or make it anonymous.",
    ],
  },
  {
    heading: "How we protect your information",
    paragraphs: [
      "We use secure (HTTPS) connections, store passwords only in hashed form, keep sign-in cookies out of reach of other scripts, and limit who on our team can see personal information. No system is completely secure, but we work hard to protect your information.",
    ],
  },
  {
    heading: "Your rights",
    paragraphs: [
      "Under Ghana's Data Protection Act, 2012 (Act 843), and other privacy laws that may apply to you, you can ask us to:",
    ],
    list: [
      "Give you a copy of the personal information we hold about you.",
      "Correct information that is wrong or incomplete.",
      "Delete your information, where we do not need to keep it for legal reasons.",
      "Stop using your information for a particular purpose, or withdraw your consent.",
    ],
    after: [
      "You can also complain to Ghana's Data Protection Commission, or the data protection authority where you live.",
    ],
  },
  {
    heading: "Children",
    paragraphs: [
      "Our courses are meant for adults. If you are under 18, please use Gradvane Global only with the permission of a parent or guardian.",
    ],
  },
  {
    heading: "Changes to this policy",
    paragraphs: [
      "We may update this policy from time to time. When we do, we will change the date at the top of this page, and tell you about important changes by email or on the website.",
    ],
  },
];

export const termsIntro =
  "These terms explain the rules for using the Gradvane Global website, creating an account and buying our courses. Please read them carefully.";

export const termsSections: LegalSection[] = [
  {
    heading: "Agreeing to these terms",
    paragraphs: [
      "By creating an account, buying a module or using this website, you agree to these Terms and Conditions and to our Privacy Policy. If you do not agree, please do not use the website.",
    ],
  },
  {
    heading: "Your account",
    list: [
      "Give accurate information when you sign up and keep it up to date.",
      "Your account is for you alone. Do not share your login details.",
      "Keep your password safe. You are responsible for what happens under your account.",
      "Tell us straight away if you think someone else has used your account.",
      "If you are under 18, you need a parent's or guardian's permission to use Gradvane Global.",
    ],
  },
  {
    heading: "Courses and access",
    paragraphs: [
      "Courses are sold module by module. When you buy a module, you get personal, non-transferable access to it for the access period shown before you pay. If no period is shown, you keep access for as long as we offer that course.",
      "We may update course content to keep it accurate and useful. If we ever have to withdraw a module you have paid for before your access period ends, we will offer you a fair alternative or a refund for the unused part.",
    ],
  },
  {
    heading: "Prices and payment",
    paragraphs: [
      "Prices are shown in Ghana cedis (GH₵) before you pay. Payments are processed securely by Paystack. Your access starts once your payment is confirmed.",
      "We may change our prices at any time, but a price change never affects a module you have already bought.",
    ],
  },
  {
    heading: "Refunds",
    paragraphs: [
      "Because modules give you instant access to digital content, purchases are non-refundable once you have started a module, except where the law requires otherwise.",
      "If you were charged by mistake or cannot access something you paid for, contact us within 14 days of payment and we will fix the problem or refund you.",
    ],
  },
  {
    heading: "Educational purpose and no guarantees",
    paragraphs: ["Our courses and resources are for guidance and education only."],
    list: disclaimer,
    after: ["You are responsible for your own applications and decisions, and for checking current requirements with official sources."],
  },
  {
    heading: "Our content",
    paragraphs: [
      "All course videos, text, templates and other materials belong to Gradvane Global or the people who license them to us, and are protected by copyright.",
      "You may use them for your own learning, and use our templates for your own applications. You may not copy, record, share, resell or publish our content, or use it to teach others, without our written permission.",
    ],
  },
  {
    heading: "Using the website responsibly",
    paragraphs: ["When using Gradvane Global, you must not:"],
    list: [
      "Break the law or help anyone else break it.",
      "Try to get into accounts, systems or content you have not paid for.",
      "Copy content in bulk, for example with automated tools.",
      "Upload or send anything harmful, offensive or that infringes someone else's rights.",
      "Disrupt the website or interfere with other people's use of it.",
    ],
  },
  {
    heading: "Suspending or closing accounts",
    paragraphs: [
      "We may suspend or close an account that breaks these terms, for example by sharing logins or course content. Where possible, we will tell you why first. You can ask us to close your account at any time.",
    ],
  },
  {
    heading: "Our responsibility to you",
    paragraphs: [
      "We work hard to keep the website available and our content accurate, but we cannot promise the website will always be available or free of errors.",
      "As far as the law allows, we are not responsible for indirect losses, such as missed opportunities, or for decisions you make based on our content. Our total responsibility to you for any claim is limited to the amount you paid for the module the claim relates to. Nothing in these terms limits any rights you have by law that cannot be limited.",
    ],
  },
  {
    heading: "Changes to these terms",
    paragraphs: [
      "We may update these terms from time to time. We will change the date at the top of this page and tell you about important changes. If you keep using the website after a change, the new terms apply.",
    ],
  },
  {
    heading: "Governing law",
    paragraphs: ["These terms are governed by the laws of Ghana, and the courts of Ghana will deal with any dispute about them."],
  },
];
