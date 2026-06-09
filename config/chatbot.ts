// ============================================================================
// CHATBOT MODULE CONTENT  —  edit-in-one-place
// ----------------------------------------------------------------------------
// All teaching copy and case content for the "Chatbot Creation" module. The
// student builds Velara's customer support assistant with a no-code builder,
// then talks to it live on a mock Velara storefront. The framework we teach is
// GUARD: Goal, Understanding, Audience, Rules, Deflect.
//
// Keep all knowledge content believable and specific so a grounded bot can
// answer real questions ("where is order 4827?", "what is the returns window?")
// correctly, and a bot WITHOUT the relevant knowledge has nothing to invent
// from. No em dashes anywhere in user-facing copy.
// ============================================================================

// ---- The GUARD framework ---------------------------------------------------

export interface GuardPillar {
  letter: string;
  name: string;
  blurb: string;
}

export const GUARD: GuardPillar[] = [
  {
    letter: "G",
    name: "Goal",
    blurb:
      "Say what the assistant is for in one line. A support bot that knows its job stays on task and does not wander into sales pitches or off-topic chat. For Velara the goal is to answer customer questions about orders, shipping and returns, quickly and in the brand's voice.",
  },
  {
    letter: "U",
    name: "Understanding",
    blurb:
      "Give it the facts. A model only knows what you put in front of it. Without your shipping policy, returns window and order data it will guess, and a confident guess is worse than no answer. This is called grounding: the bot may only speak from the knowledge you provide.",
  },
  {
    letter: "A",
    name: "Audience and tone",
    blurb:
      "Tell it who it is speaking to and how to sound. A Velara customer expects calm, understated, helpful service, not exclamation marks and hard selling. The tone is part of the brand, so the bot should sound like a Velara concierge, not a generic chatbot.",
  },
  {
    letter: "R",
    name: "Rules",
    blurb:
      "Set the guardrails. Rules are the things the bot must never do: invent discount codes, promise a delivery date it cannot verify, discuss competitors, or answer questions that have nothing to do with Velara. Good rules keep a helpful bot from becoming a liability.",
  },
  {
    letter: "D",
    name: "Deflect",
    blurb:
      "Know when to hand off to a human. The smartest thing a bot can do is recognise what it cannot handle, an angry customer, a damaged order, anything outside its knowledge, and offer to connect the customer to the team instead of bluffing. A clean escalation builds trust.",
  },
];

// ---- Before / after teaching example --------------------------------------

export const BEFORE_AFTER = {
  topic:
    "Two assistants, same question. One was set up with no knowledge and no rules. The other was grounded in Velara's real policies and told when to escalate.",
  weak: {
    label: "Ungrounded bot",
    customer: "Hi, where is my order 4827, and is there a code for free shipping?",
    reply:
      "Your order 4827 is out for delivery and should arrive tomorrow by 1pm. You can also use code VELARA20 for free shipping on your next order.",
    note: "Both facts are invented. There is no order data and no such code. A made-up delivery date and a fake discount will reach a real customer and damage trust.",
  },
  strong: {
    label: "Well-built bot",
    customer: "Hi, where is my order 4827, and is there a code for free shipping?",
    reply:
      "Order 4827 is currently in transit and is on track to arrive by 11 June, so it is on its way to you. We do not run general discount codes, but UK orders over 250 pounds always ship free. Is there anything else I can help with?",
    note: "Every fact comes from the provided knowledge. It quotes the real order status, declines to invent a code, and stays in Velara's calm voice.",
  },
  escalation: {
    label: "Knowing when to step back",
    customer: "My coat arrived with a torn seam and I am really not happy.",
    reply:
      "I am sorry to hear your coat arrived damaged, that is not the standard we hold ourselves to. This is something our team should handle directly so we can arrange a replacement or refund for you. May I connect you with a member of the Velara team?",
    note: "A damaged order and an upset customer are outside what a bot should resolve alone. It apologises, stays calm, and escalates to a human.",
  },
};

// ---- Knowledge the builder can toggle ON -----------------------------------

export interface KnowledgeItem {
  id: string;
  label: string;
  content: string;
}

export const KNOWLEDGE: KnowledgeItem[] = [
  {
    id: "shipping",
    label: "Shipping and delivery",
    content: `SHIPPING AND DELIVERY
- UK standard delivery: 3 to 5 working days, 6 pounds, free on UK orders over 250 pounds.
- UK express delivery: next working day if ordered before 1pm, 12 pounds.
- Europe: 5 to 7 working days, 18 pounds.
- Rest of world: 7 to 12 working days, 30 pounds, duties may apply on arrival.
- Orders are dispatched from our London studio Monday to Friday. Orders placed at the weekend are processed the next working day.
- Every order ships with tracking, sent by email when the parcel leaves the studio.
- We do not guarantee a delivery date beyond the carrier estimate. If a customer asks for an exact date we have not confirmed, say it is an estimate.`,
  },
  {
    id: "returns",
    label: "Returns and exchanges",
    content: `RETURNS AND EXCHANGES
- Returns window: 30 days from the delivery date for a full refund.
- Items must be unworn, with original tags and packaging.
- UK returns are free using the prepaid label included in every order.
- Exchanges for a different size are free, subject to availability.
- Refunds are processed within 5 working days of the return arriving at our studio, back to the original payment method.
- Made-to-order and altered pieces are final sale and cannot be returned, this is stated on the product page at purchase.
- Faulty or damaged items are handled by the team directly, not through the standard returns process.`,
  },
  {
    id: "materials",
    label: "Materials and sustainability",
    content: `MATERIALS AND SUSTAINABILITY
- Velara is a UK sustainable luxury house, founded in 2019, based in London.
- Collections are small-batch and made from certified materials: GOTS-certified organic cotton, responsible wool (RWS), and recycled cashmere.
- We do not use virgin animal fur or exotic skins.
- Every garment is made to last and comes with a repair-first promise: we offer a repairs service to extend a piece's life rather than replace it.
- Packaging is plastic-free and recyclable.
- We publish our supplier list and carbon footprint in our annual impact report on the website.`,
  },
  {
    id: "orders",
    label: "Sample order data",
    content: `ORDER LOOKUP (sample data, use only these records, never invent an order)
- Order 4827: Wool Overcoat, Camel, size M. Status: in transit, on track to arrive by 11 June. Carrier: Royal Mail Tracked 24.
- Order 4913: Silk Slip Dress, Ink, size 10. Status: delivered on 6 June, signed for.
- Order 5002: Cashmere Crew, Oat, size S. Status: processing in the studio, expected to dispatch within 1 working day.
- Order 5188: Tailored Trousers, Slate, size 12. Status: returned, refund issued on 5 June to the original card.
- If a customer gives an order number that is not in this list, say you cannot find it and offer to connect them to the team to look it up.`,
  },
];

// ---- Tone presets ----------------------------------------------------------

export interface TonePreset {
  id: string;
  label: string;
}

export const TONE_PRESETS: TonePreset[] = [
  { id: "understated", label: "Understated and calm" },
  { id: "warm", label: "Warm and personal" },
  { id: "sustainability", label: "Sustainability-led" },
  { id: "concise", label: "Concise and efficient" },
];

// ---- Guardrail options -----------------------------------------------------

export interface GuardrailOption {
  id: string;
  label: string;
  rule: string;
}

export const GUARDRAIL_OPTIONS: GuardrailOption[] = [
  {
    id: "no-codes",
    label: "Never invent discount codes",
    rule: "Never invent, guess or offer discount or promotion codes. Only mention a discount if it appears verbatim in your knowledge.",
  },
  {
    id: "no-delivery-promise",
    label: "Never promise a delivery date without order data",
    rule: "Never promise a specific delivery date unless it comes from the order record in your knowledge. Otherwise describe the carrier estimate as an estimate, not a guarantee.",
  },
  {
    id: "velara-only",
    label: "Only answer questions about Velara",
    rule: "Only answer questions about Velara, its products, orders and policies. Politely decline anything unrelated and steer back to how you can help with Velara.",
  },
  {
    id: "no-competitors",
    label: "Do not discuss competitors",
    rule: "Do not discuss, compare or recommend other brands or competitors. Keep the focus on Velara.",
  },
  {
    id: "no-personal-data",
    label: "Do not ask for sensitive personal data",
    rule: "Never ask for full payment card numbers, passwords or other sensitive personal data. An order number and email are enough to help.",
  },
];

// ---- Comprehension quiz ----------------------------------------------------

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explain: string;
}

export const QUIZ: QuizQuestion[] = [
  {
    id: "grounding",
    question:
      "A customer asks for an exact delivery date the bot has not been given. What should a well-built support bot do?",
    options: [
      "Confidently give a date so the customer feels reassured",
      "Say it does not have that confirmed and offer the carrier estimate or to check with the team",
      "Make up a plausible date based on the average",
      "Refuse to answer anything about delivery",
    ],
    correctIndex: 1,
    explain:
      "This is grounding, the U in GUARD. A bot should only state facts it actually has. A confident guess about a delivery date is exactly the kind of error that reaches a real customer.",
  },
  {
    id: "u-meaning",
    question: "In GUARD, what does the U (Understanding) pillar give the bot?",
    options: [
      "A friendly personality",
      "The specific facts and policies it is allowed to speak from",
      "Permission to search the open web",
      "A list of competitors to avoid",
    ],
    correctIndex: 1,
    explain:
      "Understanding is the knowledge you ground the bot in: your shipping policy, returns window and order data. Without it the bot has nothing real to draw on and will guess.",
  },
  {
    id: "deflect",
    question:
      "An angry customer reports a damaged order. What is the best response from the bot?",
    options: [
      "Apologise and offer to connect them to a human on the team",
      "Tell them to read the returns policy themselves",
      "Promise an immediate full refund on the spot",
      "Explain that damaged goods are not the bot's department and end the chat",
    ],
    correctIndex: 0,
    explain:
      "This is Deflect, the D in GUARD. A damaged order and an upset customer are exactly when a bot should escalate, apologising and handing off to a human rather than bluffing.",
  },
  {
    id: "rules",
    question: "Why do we give a support bot explicit Rules (guardrails)?",
    options: [
      "To make the bot reply more slowly and carefully",
      "To stop a helpful bot from doing harmful things like inventing codes or discussing competitors",
      "Rules are optional and rarely matter",
      "To let the bot answer any question on any topic",
    ],
    correctIndex: 1,
    explain:
      "Rules are the guardrails that keep a capable bot safe: no invented discount codes, no competitor talk, no unverified delivery promises. They turn a helpful bot into a trustworthy one.",
  },
  {
    id: "tone",
    question: "Why does the Audience and tone pillar matter for Velara specifically?",
    options: [
      "Tone has no effect on a support bot",
      "The bot should sound as excited and salesy as possible",
      "The bot's voice is part of the brand, so it should sound like a calm Velara concierge",
      "Customers prefer a robotic, formal tone in every case",
    ],
    correctIndex: 2,
    explain:
      "For a luxury brand the voice is part of the product. A Velara support bot should feel like the in-store concierge: understated, helpful and on-brand, not a generic chatbot.",
  },
];

// ---- Intro and framing copy ------------------------------------------------

export const COPY = {
  intro:
    "Velara's customers love the product but cannot get simple answers online. Where is my order? Can I still return this? Support is buried under the same questions every day, and replies are slow. Your job is to build the assistant that lives on the Velara website and handles these conversations, in the brand's voice, without ever inventing an answer.",
  buildIntro:
    "Configure your assistant on the left using GUARD, then click the chat bubble on the Velara site to talk to it as a customer. Try asking where order 4827 is, or whether you can return a coat. Notice how it behaves before and after you give it Knowledge.",
  exportNote:
    "This compiled prompt is the real artifact. Paste it into a Custom GPT, a Claude Project, or any no-code chatbot builder to deploy the same assistant.",
};
