export type Challenge = {
  id: string;
  number: number;
  context: string;
  aiContent: string;
  expertCritique: string;
  constraint: string;
  weakPhrases: string[];
};

export const STORAGE_KEY = "cfg-train-your-eye-sg-v1";

export type SavedState = {
  completedIds: string[];
  critiques: Record<string, string>;
  rewrites: Record<string, string>;
};

export const DEFAULT_STATE: SavedState = {
  completedIds: [],
  critiques: {},
  rewrites: {},
};

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    number: 1,
    context: "HDB block party announcement",
    aiContent:
      "Join us for a heartwarming community event celebrating the vibrant spirit of our neighbourhood! Come and be part of an amazing experience filled with fun activities for the whole family. Let&apos;s strengthen our bonds and create beautiful memories together at this special occasion.",
    expertCritique:
      "Every word here could be from any community event anywhere. &ldquo;Heartwarming&rdquo;, &ldquo;vibrant spirit&rdquo;, &ldquo;amazing experience&rdquo; — zero specificity. You can&apos;t picture the void deck, smell the satay, or know who organised it. The piece says everything and tells you nothing.",
    constraint: "No adjectives. One specific fact must appear in the first sentence.",
    weakPhrases: [
      "heartwarming",
      "vibrant spirit",
      "amazing experience",
      "fun activities",
      "strengthen our bonds",
      "beautiful memories",
      "special occasion",
    ],
  },
  {
    id: "challenge-2",
    number: 2,
    context: "Volunteer recruitment post",
    aiContent:
      "Are you passionate about making a difference in your community? Join our dedicated team of volunteers and help create positive change for vulnerable populations across Singapore! Together we can build a more inclusive society where everyone has the opportunity to thrive.",
    expertCritique:
      "&ldquo;Passionate&rdquo;, &ldquo;making a difference&rdquo;, &ldquo;positive change&rdquo; — these are the words of someone who has never met a real volunteer. Nobody signs up because they feel passionate about &ldquo;positive change&rdquo;. They sign up because they know someone who benefited, or they have a free Tuesday evening and want it to mean something.",
    constraint: "Name what the volunteer actually does. One concrete action in the first sentence.",
    weakPhrases: [
      "passionate about",
      "making a difference",
      "positive change",
      "vulnerable populations",
      "more inclusive society",
      "opportunity to thrive",
    ],
  },
  {
    id: "challenge-3",
    number: 3,
    context: "Mental health helpline tagline",
    aiContent:
      "Your mental health matters. We&apos;re here to help you thrive and find your inner strength on your wellness journey. Our compassionate team is ready to support you in achieving emotional balance and personal growth.",
    expertCritique:
      "&ldquo;Wellness journey&rdquo; and &ldquo;inner strength&rdquo; are so overused they have become white noise. The person reading this is struggling — and this copy sounds like it was written for someone who has already recovered. It meets no one where they are. It speaks to the destination, not the moment.",
    constraint: "Speak to the person&apos;s actual moment right now. Not where you want them to end up.",
    weakPhrases: [
      "your mental health matters",
      "thrive",
      "inner strength",
      "wellness journey",
      "emotional balance",
      "personal growth",
    ],
  },
  {
    id: "challenge-4",
    number: 4,
    context: "Food bank donation appeal",
    aiContent:
      "Together, we can fight food insecurity and empower communities across Singapore. Your generous donation will help us provide nutritious meals to those in need and create a more equitable future for all. Join us in our mission to end hunger in Singapore.",
    expertCritique:
      "&ldquo;Fight food insecurity&rdquo;, &ldquo;empower communities&rdquo;, &ldquo;equitable future&rdquo; — this reads like a grant application, not a call from one person to another. The statistical scale of the problem replaces the specific weight of it. One real person&apos;s situation would do more work than all of this.",
    constraint: "One real person&apos;s situation. No statistics. No mission statements.",
    weakPhrases: [
      "fight food insecurity",
      "empower communities",
      "nutritious meals to those in need",
      "equitable future for all",
      "mission to end hunger",
    ],
  },
  {
    id: "challenge-5",
    number: 5,
    context: "Hawker centre app description",
    aiContent:
      "Discover Singapore&apos;s culinary heritage through our innovative digital platform. Enjoy a seamless experience browsing our curated listings of authentic local dishes from trusted hawker vendors. Your ultimate food discovery journey starts here.",
    expertCritique:
      "&ldquo;Innovative digital platform&rdquo;, &ldquo;seamless experience&rdquo;, &ldquo;curated listings&rdquo; — every one of these phrases is borrowed from a 2018 tech pitch deck. A person deciding what to eat for lunch does not think in these terms. They think: I want char kway teow. Where is the best one near me? Is the stall open?",
    constraint: "A person ordering lunch. Present tense. No tech words at all.",
    weakPhrases: [
      "innovative digital platform",
      "seamless experience",
      "curated listings",
      "culinary heritage",
      "food discovery journey",
      "ultimate",
    ],
  },
  {
    id: "challenge-6",
    number: 6,
    context: "Senior care service announcement",
    aiContent:
      "We provide comprehensive care solutions designed to meet the evolving needs of elderly individuals in Singapore. Our holistic approach to care delivery ensures that seniors receive personalised support tailored to their unique circumstances and well-being requirements.",
    expertCritique:
      "&ldquo;Elderly individuals&rdquo;, &ldquo;care delivery&rdquo;, &ldquo;well-being requirements&rdquo; — no one who loves someone talks like this. The clinical register creates distance exactly where closeness is needed. This copy belongs in a government procurement form, not in an announcement for families.",
    constraint: "Write it as you would explain this service to your grandmother. Plain words only.",
    weakPhrases: [
      "comprehensive care solutions",
      "evolving needs",
      "elderly individuals",
      "care delivery",
      "holistic approach",
      "well-being requirements",
    ],
  },
  {
    id: "challenge-7",
    number: 7,
    context: "Neighbourhood watch notice",
    aiContent:
      "Dear residents, we urge everyone to remain vigilant and report any suspicious activities in our neighbourhood. By staying alert and working together as a community, we can ensure the safety and security of our shared living environment for all residents.",
    expertCritique:
      "This says nothing a resident can act on. &ldquo;Suspicious activities&rdquo; is so vague it could mean anything — or nothing. The effect is a low hum of anxiety with no useful direction. A notice that asks people to be vigilant without telling them what to look for is not a safety measure. It&apos;s a liability cover.",
    constraint: "Name one specific thing to notice. What does it look like?",
    weakPhrases: [
      "remain vigilant",
      "suspicious activities",
      "staying alert",
      "safety and security",
      "shared living environment",
    ],
  },
  {
    id: "challenge-8",
    number: 8,
    context: "Digital literacy programme for adults",
    aiContent:
      "No experience needed! Our friendly step-by-step programme makes it easy for anyone to learn essential digital skills. Our patient instructors will guide you through every stage of your digital journey in a comfortable, supportive environment.",
    expertCritique:
      "&ldquo;No experience needed&rdquo; and &ldquo;easy for anyone&rdquo; are reassurances that feel like warnings. They signal: this is for people who struggle. Many adults who need this programme already know they&apos;re capable of learning — they just haven&apos;t been given a reason to start. This copy treats them as the problem instead of meeting them as the solution.",
    constraint: "Write for someone who already knows they&apos;re capable. Give them a reason to start.",
    weakPhrases: [
      "no experience needed",
      "easy for anyone",
      "step-by-step",
      "patient instructors",
      "supportive environment",
      "digital journey",
    ],
  },
  {
    id: "challenge-9",
    number: 9,
    context: "Accessible toilet finder app",
    aiContent:
      "Our app promotes inclusive design by providing comprehensive accessibility features for users with mobility challenges. Find mobility solutions and accessible facilities near you, supporting Singapore&apos;s commitment to an inclusive society for all.",
    expertCritique:
      "This describes the app&apos;s politics, not its use. &ldquo;Inclusive design&rdquo;, &ldquo;mobility solutions&rdquo;, &ldquo;commitment to an inclusive society&rdquo; — these are the reasons someone built it, not the reason someone opens it. The person opening it needs a toilet. Now. The copy should answer that urgency, not explain the developer&apos;s values.",
    constraint: "Write for the person, not the feature. What do they get, right now?",
    weakPhrases: [
      "inclusive design",
      "accessibility features",
      "mobility challenges",
      "mobility solutions",
      "commitment to an inclusive society",
    ],
  },
  {
    id: "challenge-10",
    number: 10,
    context: "Community garden initiative",
    aiContent:
      "Join us in cultivating a greener, more sustainable future for Singapore! Our community garden initiative brings residents together to strengthen community bonds, promote environmental awareness, and create beautiful green spaces that benefit everyone.",
    expertCritique:
      "&ldquo;Sustainable future&rdquo;, &ldquo;community bonds&rdquo;, &ldquo;environmental awareness&rdquo; — these are the reasons a grant committee would fund a garden, not the reasons a person would show up on Saturday morning with gloves on. The real reason is specific and small: the neighbour who showed them around last time, the smell of something growing, the hour of silence before the rest of the day starts.",
    constraint: "Why would this specific person show up on a Saturday morning? One reason. Make it specific.",
    weakPhrases: [
      "sustainable future",
      "community bonds",
      "environmental awareness",
      "greener",
      "benefit everyone",
      "beautiful green spaces",
    ],
  },
];
