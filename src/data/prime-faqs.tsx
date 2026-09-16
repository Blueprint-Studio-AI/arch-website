import type { FaqEntry } from "@/components/faq";

// ponytail: draft answers in the brand voice. Every claim here needs a check against the app
// and Matt before this ships.
export const PRIME_FAQS: FaqEntry[] = [
  {
    question: "What is primeBTC?",
    answer: (
      <p>
        Bitcoin that earns. Deposit aBTC, hold primeBTC. A curator runs the strategy and yield accrues
        daily to what you hold. Redeem to aBTC whenever you want.
      </p>
    ),
  },
  {
    question: "Is Arch Prime custodial?",
    answer: (
      <p>
        No. Prime connects to the wallet you already have. Moving Bitcoin takes a threshold of Arch
        validators signing together, never a single company or a single key.
      </p>
    ),
  },
  {
    question: "Can I withdraw whenever I want?",
    answer: <p>Yes. Your position is never locked. Redeem primeBTC to aBTC, or primeUSD to aUSD, at any time.</p>,
  },
  {
    question: "What does it cost?",
    answer: (
      <p>
        A performance fee on yield earned, shown on each product before you deposit. No fee on deposits or
        withdrawals beyond the network fee.
      </p>
    ),
  },
  {
    question: "What are the risks?",
    answer: (
      <p>
        Yield is variable and can fall. Borrowing against your Bitcoin can be liquidated if its value drops
        past your health limit. Boost adds leverage and so adds both. Every screen shows the numbers before
        you commit.
      </p>
    ),
  },
  {
    question: "What is Boost?",
    answer: (
      <p>
        Leverage on what you already hold. Boost primeBTC for more yield on the same Bitcoin, with the health
        factor and liquidation price in front of you the whole time. In build.
      </p>
    ),
  },
];
