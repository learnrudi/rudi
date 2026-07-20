"""Per-day editorial content for RUDI Daily editions (2026-07-15 onward).

Written by the editorial pass (see the rudi-rundown-writer skill) from the
day's discovery annotation data. Each entry:
  topics   — 3-4 news-forward phrases for the title tag
  dek      — 1-2 sentences; generator appends "All N stories from the day, below."
  modified — dateModified for schema (bump on final-edition republish)
  open     — callable(L) returning paragraph-inner-HTML strings; L(title_substr,
             text) resolves links by unique title substring and FAILS LOUDLY on
             a miss. NO HTML entities inside L() text — use literal — “ ” ’
             characters (entities there double-escape). Entities are fine in the
             raw paragraph strings outside L().
  qa       — list of (question, answer, title_substr_for_source, source_label).

Editions 2026-07-01 .. 2026-07-14 are committed history under their original
rudi-rundown-ai-news-* URLs; their content intentionally does not live here.
"""

DAY = {
"15": {
 "topics": "DeepSeek $71B, Qwen in Apple Intelligence, Publishers v. Google",
 "dek": "DeepSeek reportedly raises at a $71 billion valuation as China's AI boom defies US restrictions, Alibaba's Qwen heads into Apple Intelligence, publishers widen the Google training lawsuit, and South Korea tenders a universal basic AI chatbot.",
 "modified": "2026-07-15",
 "open": lambda L: [
  'China&rsquo;s AI economy had its statement day. ' + L('DeepSeek Races to $71B', 'DeepSeek is reportedly raising $1.5 billion at a $71 billion valuation') + ' ahead of a potential 2027 IPO &mdash; a growth story built while US chip restrictions were supposed to prevent exactly this. ' + L('Qwen to be integrated', 'Alibaba’s Qwen will power Apple Intelligence features in China') + ', per a regulatory filing. And a compression lab showed ' + L('Bonsai 27B', 'a 27-billion-parameter model running locally on an iPhone in under 4GB of memory') + ', retaining about 90% of its performance by its maker&rsquo;s account. The restrictions were the policy; the receipts are the rebuttal.',
  'The watchdog conversation compounded into day two. Coverage of Hassabis&rsquo;s call ' + L('wants US-led global watchdog', 'now frames it against the government’s crackdown on Anthropic’s Mythos models') + ', and a War on the Rocks analysis argued for ' + L('Threat Fusion Center', 'an AI threat fusion center before the next such incident') + '. South Korea went the other direction entirely: ' + L('universal basic AI chatbot', 'a government tender for a universal basic AI chatbot and public-services agent') + ', built on local models with state-provided GPUs. One government wants frontier AI checked before release; another wants it issued like a utility.',
  'The courtroom docket grew again. Publishers&rsquo; ' + L('Publishers Sue Google', 'class action against Google over Gemini training on Google Books titles') + ' now includes, per one report, an internal document warning of billions in exposure. ' + L('Meta Sued For Allegedly', 'Meta faces a suit from 26 former employees alleging its AI layoff tools discriminated') + ' against workers on disability or family leave. And OpenAI, undeterred by its own legal week, is reportedly ' + L('Screenless AI Speaker', 'betting on a screenless AI speaker') + ' as its first hardware act &mdash; a proactive home companion, with all the trust questions that phrase implies.',
 ],
 "qa": [
  ("What is DeepSeek worth now?",
   "DeepSeek is reportedly in talks to raise $1.5 billion at a $71 billion valuation, with an IPO planned for 2027 — a milestone for China's AI sector despite US chip restrictions.",
   "in Talks to Raise $1.5 Billion", "Caproasia"),
  ("Is Apple using Alibaba's Qwen?",
   "In China, yes — a regulatory filing shows Alibaba's Qwen will be integrated into Apple Intelligence to power on-device AI features for Apple devices sold there.",
   "Qwen to be integrated", "TechNode"),
  ("Why are publishers suing Google?",
   "Major publishers allege Google trained Gemini on copyrighted books from Google Books and Google Play without authorization — with one report citing an internal Google document warning of billions in potential exposure.",
   "Publishers Sue Google", "Eastern Herald"),
  ("What is South Korea's universal basic AI chatbot?",
   "South Korea issued a government tender for a universal basic AI chatbot and an AI agent for government services — required to run on local models, with GPUs provided by the state.",
   "universal basic AI chatbot", "The Register"),
  ("Why is Meta being sued over AI layoffs?",
   "Twenty-six former employees allege Meta's AI systems used in layoff decisions discriminated against workers on disability or family leave.",
   "Meta Sued For Allegedly", "Gizmodo"),
  ("Can a serious AI model really run on an iPhone?",
   "PrismML's Bonsai 27B — a compressed 27-billion-parameter model — reportedly runs locally on an iPhone in 3.9GB of memory while retaining roughly 90% of the original model's performance.",
   "Bonsai 27B", "Gigazine"),
  ("Is OpenAI building hardware?",
   "Reportedly yes — a screenless AI speaker positioned as a proactive home companion, facing significant trust and privacy questions before launch.",
   "Screenless AI Speaker", "SquaredTech"),
  ("What is an AI threat fusion center?",
   "A proposed structure for public-private intelligence sharing on advanced AI risks — argued for in a War on the Rocks analysis as the lesson of the Mythos incident, before the next one.",
   "Threat Fusion Center", "War on the Rocks"),
 ],
},
}
