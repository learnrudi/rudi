const courses = {
  foundations: {
    title: "Foundations in Artificial Intelligence",
    meta: "5 lessons · 26 minutes",
    playlist: "https://www.youtube.com/playlist?list=PLPTXZL0HD7A4",
    lessons: [
      { id: "foundations-intro", videoId: "27RjvlXmkRw", duration: "1:38", title: "Foundations in Artificial Intelligence: Course Introduction", summary: "Build a practical foundation for understanding artificial intelligence. This introduction previews AI fundamentals, generative AI, large language models, and prompt engineering." },
      { id: "human-to-ai", videoId: "Tk-SxtaeSbA", duration: "5:48", title: "From Human Intelligence to Artificial Intelligence", summary: "Trace a path from early information networks and externalized language to the research proposal that helped establish artificial intelligence as a field." },
      { id: "traditional-vs-generative", videoId: "Hi3v4nwxGVw", duration: "4:08", title: "Traditional AI vs. Generative AI", summary: "Explore robotics, computer vision, natural language processing, machine learning, and what makes generative AI different from earlier systems." },
      { id: "language-matters", videoId: "hWuQeMD2pR4", duration: "2:55", title: "Why Language Matters to Artificial Intelligence", summary: "Connect human intelligence, language, and artificial intelligence—and see why different forms of language matter to large language models." },
      { id: "how-llms-work", videoId: "HrGXwE_Vo1s", duration: "12:28", title: "How Large Language Models Work: Tokens, Transformers, and Attention", summary: "Learn how training data, tokenization, numerical representations, transformers, attention, and next-token prediction work together." },
    ],
  },
  prompting: {
    title: "Large Language Models and Prompt Engineering",
    meta: "8 lessons · 53 minutes",
    playlist: "https://www.youtube.com/playlist?list=PLbViaRGXlkMQ",
    lessons: [
      { id: "prompting-intro", videoId: "x7kq6udvgb8", duration: "0:58", title: "Large Language Models & Prompt Engineering: Course Introduction", summary: "Preview prediction, model limitations, conversational prompting, prompt anatomy, and practical techniques for stronger instructions." },
      { id: "prediction-engines", videoId: "tktszPnaiRc", duration: "4:55", title: "How Large Language Models Predict the Next Word", summary: "Understand patterns in language, transformer-based attention, next-token prediction, and why convincing output can still be wrong." },
      { id: "hallucinations-bias", videoId: "NMMPSDr9Bv4", duration: "5:55", title: "AI Hallucinations and Bias: What LLM Users Need to Know", summary: "See why models can produce plausible but incorrect or biased information—and why informed human judgment must remain in the loop." },
      { id: "conversational-loop", videoId: "7fhp5zwfzl8", duration: "6:55", title: "Prompting Is a Conversation: System, User, and Assistant Roles", summary: "Use an iterative refinement loop and understand how system instructions, user prompts, assistant responses, and context work together." },
      { id: "prompt-anatomy", videoId: "LgAshETu4S8", duration: "12:34", title: "The Anatomy of an Effective AI Prompt", summary: "Structure stronger requests around persona, task, context, and format, then compare vague prompts with intentional ones." },
      { id: "system-prompts", videoId: "oHyS2AdAi-o", duration: "5:43", title: "Using System Prompts for Complex AI Tasks", summary: "Separate durable system instructions from the current user request to create more consistent, repeatable AI behavior." },
      { id: "model-parameters", videoId: "DWhDaIRXpzk", duration: "12:46", title: "Temperature, Top P, and Output Length Explained", summary: "See how common generation controls influence predictability, variation, vocabulary, and response length. Available controls vary by current model." },
      { id: "prompting-conclusion", videoId: "okeDTmYlkZE", duration: "2:53", title: "Large Language Models & Prompt Engineering: Course Conclusion", summary: "Review prediction, limitations, human oversight, conversational refinement, prompt structure, and the practice of evaluating model output." },
    ],
  },
  agents: {
    title: "Building Conversational AI Agents",
    meta: "8 lessons · 44 minutes",
    playlist: "https://www.youtube.com/playlist?list=PLSUe4-GJ3ysc",
    lessons: [
      { id: "agents-intro", videoId: "FJaD3x8Mx8E", duration: "0:34", title: "Building Conversational AI Agents: Course Introduction", summary: "Preview agent components, prompt structures, memory, tools, and an end-to-end agent build." },
      { id: "chatbots-vs-agents", videoId: "qqt77ZRm5dg", duration: "6:09", title: "Chatbots vs. AI Agents: What’s the Difference?", summary: "Move from reactive answers to systems that can plan, use context, call tools, and complete multiple steps toward a goal." },
      { id: "agent-roles", videoId: "dneLfxWrS0A", duration: "7:14", title: "System, User, and Assistant Roles in AI Agents", summary: "Understand how a reasoning model, system instructions, user prompts, and assistant responses establish agent behavior." },
      { id: "memory-tools", videoId: "RZ-TFzuhxIY", duration: "6:01", title: "Short-Term Memory, Long-Term Memory, and AI Tools", summary: "Distinguish context-window memory from durable storage, then see how search and APIs extend what an agent can do." },
      { id: "agent-prompts", videoId: "Z6iuUKlowqo", duration: "9:07", title: "How to Structure an AI Agent Prompt", summary: "Build system instructions around role, task, context, and format, then test the framework in a grounded analysis scenario." },
      { id: "agentic-workflows", videoId: "-zbu2Fwg_Gs", duration: "4:25", title: "How to Chain Prompts into an Agentic Workflow", summary: "Chain actions toward a goal and turn a multi-output sequence into a reusable agent workflow." },
      { id: "content-agent", videoId: "iM45dv9WwsM", duration: "9:33", title: "Build a Content-Extraction AI Agent: End-to-End Demo", summary: "Define an agent’s identity, trigger, tools, sequence, and output, then watch a content-extraction workflow run end to end." },
      { id: "agents-conclusion", videoId: "hcx8V6DBv1k", duration: "0:33", title: "Building Conversational AI Agents: Course Conclusion", summary: "Review prompting, roles, memory, tools, structured workflows, and iterative testing—and identify a practical next build." },
    ],
  },
};

const player = document.querySelector("#lesson-player");
const lessonKicker = document.querySelector("#lesson-kicker");
const lessonHeading = document.querySelector("#lesson-heading");
const lessonSummary = document.querySelector("#lesson-summary");
const youtubeLink = document.querySelector("#youtube-link");
const playlistLink = document.querySelector("#playlist-link");
const courseHeading = document.querySelector("#course-heading");
const courseMeta = document.querySelector("#course-meta");
const lessonList = document.querySelector("#lesson-list");
const courseTabs = [...document.querySelectorAll(".learn-course-tab")];

let activeCourse = "foundations";
let activeLesson = 0;

function updateHash(courseKey, lessonIndex) {
  const lesson = courses[courseKey].lessons[lessonIndex];
  const nextHash = lessonIndex === 0 ? courseKey : `${courseKey}/${lesson.id}`;
  window.history.replaceState(null, "", `#${nextHash}`);
}

function renderLessonList() {
  const course = courses[activeCourse];
  const buttons = course.lessons.map((lesson, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "learn-lesson-button";
    button.setAttribute("aria-current", String(index === activeLesson));
    button.setAttribute("aria-label", `Play lesson ${index + 1}: ${lesson.title}`);

    const number = document.createElement("span");
    number.className = "learn-lesson-index";
    number.textContent = String(index + 1).padStart(2, "0");

    const title = document.createElement("span");
    title.className = "learn-lesson-title";
    title.textContent = lesson.title;

    const duration = document.createElement("span");
    duration.className = "learn-lesson-duration";
    duration.textContent = lesson.duration;

    button.append(number, title, duration);
    button.addEventListener("click", () => renderLesson(activeCourse, index));
    return button;
  });

  lessonList.replaceChildren(...buttons);
}

function renderLesson(courseKey, lessonIndex, shouldUpdateHash = true) {
  const course = courses[courseKey];
  if (!course || !course.lessons[lessonIndex]) return;

  const lesson = course.lessons[lessonIndex];
  activeCourse = courseKey;
  activeLesson = lessonIndex;

  player.src = `https://www.youtube-nocookie.com/embed/${lesson.videoId}?rel=0`;
  player.title = lesson.title;
  lessonKicker.textContent = `${course.title} · Lesson ${lessonIndex + 1} of ${course.lessons.length}`;
  lessonHeading.textContent = lesson.title;
  lessonSummary.textContent = lesson.summary;
  youtubeLink.href = `https://www.youtube.com/watch?v=${lesson.videoId}`;
  playlistLink.href = course.playlist;
  courseHeading.textContent = course.title;
  courseMeta.textContent = course.meta;

  courseTabs.forEach((tab) => {
    tab.setAttribute("aria-selected", String(tab.dataset.course === courseKey));
  });
  renderLessonList();
  if (shouldUpdateHash) updateHash(courseKey, lessonIndex);
}

function selectionFromHash() {
  const [courseKey, lessonId] = window.location.hash.slice(1).split("/");
  if (!courses[courseKey]) return { courseKey: "foundations", lessonIndex: 0 };
  const lessonIndex = lessonId
    ? courses[courseKey].lessons.findIndex((lesson) => lesson.id === lessonId)
    : 0;
  return { courseKey, lessonIndex: Math.max(0, lessonIndex) };
}

courseTabs.forEach((tab) => {
  tab.addEventListener("click", () => renderLesson(tab.dataset.course, 0));
});

window.addEventListener("hashchange", () => {
  const selection = selectionFromHash();
  renderLesson(selection.courseKey, selection.lessonIndex, false);
});

const initialSelection = selectionFromHash();
renderLesson(initialSelection.courseKey, initialSelection.lessonIndex, false);
