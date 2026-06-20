/**
 * Generates TOEIC exam JSON files (2020-2026, 2 forms/year) + vocabulary topics.
 * Run: node scripts/generate-toeic-content.mjs
 */
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const EXAMS_DIR = join(ROOT, "src", "data", "exams");
const VOCAB_DIR = join(ROOT, "src", "data", "vocabulary");

const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
const FORMS = [1, 2];

const P1_IMAGES = [
  "photo-1497366216548-37526070297c", "photo-1556761175-b413da4baf72",
  "photo-1586528116311-ad8dd3c8310d", "photo-1556742049-0cfed4f6a45d",
  "photo-1436491865332-7a61a109cc05", "photo-1521737711867-e3b97375f902",
  "photo-1504384308090-c894fdcc538d", "photo-1486312338219-ce68d2c6f44d",
  "photo-1454165804606-c3d57bc86b40", "photo-1553877522-43269d4ea984",
  "photo-1517245386807-bb43f82c33c4", "photo-1522071820081-009f0129c71c",
];

function choice(id, text) { return { id, text: `(${id.toUpperCase()}) ${text}` }; }
function audioPath(examId, qId) { return `/audio/toeic/${examId}/${qId}.mp3`; }

function part1Bank(seed) {
  const items = [
    { img: 0, q: "Look at the picture. What is the woman doing?", correct: "a",
      choices: ["She is typing on a computer.", "She is talking on the phone.", "She is reading a document.", "She is writing on a whiteboard."],
      transcript: "A. She is typing on a computer.", exp: "The woman is seated at a desk working on a laptop." },
    { img: 1, q: "Look at the picture. What are the people doing?", correct: "a",
      choices: ["They are having a meeting.", "They are eating lunch.", "They are waiting in line.", "They are playing sports."],
      transcript: "A. They are having a meeting.", exp: "Several people are seated around a conference table." },
    { img: 2, q: "Look at the picture. Where is this taking place?", correct: "a",
      choices: ["At a warehouse", "At a restaurant", "At a hospital", "At a school"],
      transcript: "A. At a warehouse.", exp: "Shelves stacked with boxes indicate a warehouse." },
    { img: 3, q: "Look at the picture. What is the man holding?", correct: "a",
      choices: ["A credit card", "A newspaper", "A cup of coffee", "A mobile phone"],
      transcript: "A. A credit card.", exp: "The man is at a checkout counter making a payment." },
    { img: 4, q: "Look at the picture. What is happening?", correct: "c",
      choices: ["Passengers are boarding a plane.", "Workers are loading luggage.", "A plane is taking off.", "Mechanics are repairing an engine."],
      transcript: "C. A plane is taking off.", exp: "The airplane is visible above the runway." },
    { img: 5, q: "Look at the picture. What are the colleagues doing?", correct: "b",
      choices: ["They are presenting a report.", "They are discussing a project.", "They are having a coffee break.", "They are signing documents."],
      transcript: "B. They are discussing a project.", exp: "Two colleagues are pointing at a screen together." },
    { img: 6, q: "Look at the picture. What type of work is shown?", correct: "a",
      choices: ["Software development", "Construction work", "Food preparation", "Medical examination"],
      transcript: "A. Software development.", exp: "Multiple monitors with code suggest software work." },
    { img: 7, q: "Look at the picture. What is the person doing?", correct: "c",
      choices: ["Sending an e-mail", "Making a phone call", "Taking notes", "Printing a document"],
      transcript: "C. Taking notes.", exp: "The person is writing in a notebook during a meeting." },
    { img: 8, q: "Look at the picture. What is on the desk?", correct: "b",
      choices: ["A stack of files", "A laptop and a coffee cup", "A telephone and a calendar", "A printer and paper"],
      transcript: "B. A laptop and a coffee cup.", exp: "A laptop and coffee cup are visible on the desk." },
    { img: 9, q: "Look at the picture. What is the team reviewing?", correct: "a",
      choices: ["Charts and graphs", "Product samples", "Legal contracts", "Shipping labels"],
      transcript: "A. Charts and graphs.", exp: "The team is looking at performance charts on a display." },
    { img: 10, q: "Look at the picture. Where are the people?", correct: "c",
      choices: ["In a cafeteria", "In a parking lot", "In a conference room", "In a lobby"],
      transcript: "C. In a conference room.", exp: "The setting shows a large table and presentation screen." },
    { img: 11, q: "Look at the picture. What are they doing?", correct: "d",
      choices: ["Repairing equipment", "Loading a truck", "Cleaning the office", "Collaborating on a task"],
      transcript: "D. Collaborating on a task.", exp: "Team members are working together at a shared workspace." },
  ];
  return items.map((item, i) => {
    const idx = (i + seed) % items.length;
    const t = items[idx];
    const ids = ["a", "b", "c", "d"];
    return { ...t, choices: t.choices.map((c, j) => choice(ids[j], c)) };
  }).slice(0, 6);
}

function part2Bank(seed) {
  const items = [
    { q: "When does the meeting start?", correct: "a", choices: ["At nine o'clock.", "In the conference room.", "With the marketing team.", "About the new project."], transcript: "When does the meeting start?", exp: "'When' asks for time — answer with a time." },
    { q: "Who is responsible for the report?", correct: "b", choices: ["It was finished yesterday.", "Ms. Chen is.", "On the third floor.", "Very detailed."], transcript: "Who is responsible for the report?", exp: "'Who' requires a person as answer." },
    { q: "Would you like to join us for lunch?", correct: "a", choices: ["Yes, I'd love to.", "At the cafeteria.", "About thirty minutes.", "The chicken sandwich."], transcript: "Would you like to join us for lunch?", exp: "Accept or decline an invitation." },
    { q: "Where can I find the printer?", correct: "a", choices: ["Next to the supply cabinet.", "It needs new ink.", "Every morning.", "The color copies."], transcript: "Where can I find the printer?", exp: "'Where' needs a location." },
    { q: "How long will the training session last?", correct: "b", choices: ["In the main hall.", "About two hours.", "The HR department.", "Very informative."], transcript: "How long will the training session last?", exp: "'How long' asks for duration." },
    { q: "Why was the shipment delayed?", correct: "b", choices: ["By express delivery.", "Because of bad weather.", "To the warehouse.", "Five hundred units."], transcript: "Why was the shipment delayed?", exp: "'Why' asks for a reason." },
    { q: "How much does the subscription cost?", correct: "c", choices: ["Every month.", "On the website.", "Fifty dollars a year.", "Credit card only."], transcript: "How much does the subscription cost?", exp: "'How much' asks for price." },
    { q: "Shouldn't we call the client first?", correct: "a", choices: ["That's a good idea.", "At three o'clock.", "The sales department.", "A signed contract."], transcript: "Shouldn't we call the client first?", exp: "Respond to a suggestion." },
    { q: "When is the deadline for the proposal?", correct: "b", choices: ["In the marketing folder.", "This Friday at noon.", "Mr. Patterson.", "About twenty pages."], transcript: "When is the deadline for the proposal?", exp: "Deadline question needs a date/time." },
    { q: "Who will lead the orientation session?", correct: "c", choices: ["In Conference Room A.", "For two hours.", "Ms. Rivera will.", "All new hires."], transcript: "Who will lead the orientation session?", exp: "'Who' needs a person's name." },
    { q: "Where should I submit the expense form?", correct: "a", choices: ["To the finance department.", "By the end of the month.", "Three receipts.", "Mr. Kim approved it."], transcript: "Where should I submit the expense form?", exp: "'Where' needs a place or department." },
    { q: "How often are safety inspections conducted?", correct: "d", choices: ["In the factory.", "By the safety team.", "Very thoroughly.", "Once every quarter."], transcript: "How often are safety inspections conducted?", exp: "'How often' asks for frequency." },
  ];
  const out = [];
  for (let i = 0; i < 12; i++) {
    const t = items[(i + seed) % items.length];
    const ids = ["a", "b", "c", "d"];
    out.push({ ...t, choices: t.choices.map((c, j) => choice(ids[j], c)) });
  }
  return out;
}

function part3Bank(seed) {
  const convos = [
    { transcript: "Woman: The printer on the second floor stopped working again. Man: I'll use the one in marketing. Woman: Good idea. The presentation is at two.", questions: [
      { q: "What problem does the man mention?", correct: "a", choices: ["The printer is broken.", "The meeting was canceled.", "The report is incomplete.", "The office is too cold."], exp: "The printer stopped working." },
      { q: "What will the woman probably do next?", correct: "b", choices: ["Call IT support", "Print documents elsewhere", "Reschedule the meeting", "Order a new printer"], exp: "She'll use the marketing department printer." },
      { q: "What time is the presentation?", correct: "b", choices: ["1:00 P.M.", "2:00 P.M.", "3:00 P.M.", "4:00 P.M."], exp: "The presentation is at two o'clock." },
    ]},
    { transcript: "Man: Have you reviewed the quarterly budget? Woman: Yes, but we need to cut travel expenses by ten percent. Man: I'll revise the figures and send them by tomorrow.", questions: [
      { q: "What are they discussing?", correct: "c", choices: ["A new hire", "A product launch", "The quarterly budget", "Office relocation"], exp: "They discuss the quarterly budget and travel expenses." },
      { q: "What change is needed?", correct: "b", choices: ["Increase salaries", "Reduce travel costs", "Hire more staff", "Extend deadlines"], exp: "Travel expenses must be cut by ten percent." },
      { q: "When will the man send revised figures?", correct: "a", choices: ["By tomorrow", "Next week", "This afternoon", "At the meeting"], exp: "He will send them by tomorrow." },
    ]},
    { transcript: "Woman: Did you receive the shipment from Osaka? Man: Only half arrived. The rest is delayed at customs. Woman: I'll contact the supplier immediately.", questions: [
      { q: "What is the problem?", correct: "c", choices: ["The order was canceled", "The invoice is wrong", "Part of the shipment is delayed", "The warehouse is full"], exp: "Half the shipment is delayed at customs." },
      { q: "What will the woman do?", correct: "b", choices: ["Visit customs", "Contact the supplier", "Cancel the order", "File a complaint"], exp: "She will contact the supplier." },
      { q: "Where is the shipment from?", correct: "d", choices: ["Seoul", "Singapore", "Shanghai", "Osaka"], exp: "The shipment is from Osaka." },
    ]},
  ];
  const c = convos[seed % convos.length];
  return c.questions.map((q) => ({ ...q, transcript: c.transcript, choices: q.choices.map((ch, j) => choice(["a","b","c","d"][j], ch)) }));
}

function part4Bank(seed) {
  const talks = [
    { transcript: "Attention all staff. The lobby will be renovated starting next Monday. Please use the side entrance on Elm Street. The project should be completed within three weeks. Thank you.", questions: [
      { q: "What is the announcement about?", correct: "c", choices: ["A change in office hours", "A new employee orientation", "A building renovation", "A company picnic"], exp: "The lobby will be renovated." },
      { q: "When will the work begin?", correct: "b", choices: ["This Friday", "Next Monday", "Next month", "In two weeks"], exp: "Work begins next Monday." },
      { q: "What should employees do?", correct: "b", choices: ["Work from home", "Use the side entrance", "Park in the back lot", "Contact HR"], exp: "Use the side entrance on Elm Street." },
    ]},
    { transcript: "Welcome to today's webinar on workplace safety. Remember to report hazards immediately. Fire drills will be held every quarter. Certificates will be issued upon completion of the online module.", questions: [
      { q: "What is the topic of the webinar?", correct: "a", choices: ["Workplace safety", "Tax preparation", "Customer service", "Time management"], exp: "The webinar is on workplace safety." },
      { q: "How often are fire drills held?", correct: "c", choices: ["Monthly", "Twice a year", "Every quarter", "Once a year"], exp: "Fire drills are held every quarter." },
      { q: "What do participants receive?", correct: "d", choices: ["A bonus", "A new ID badge", "Free lunch", "A certificate"], exp: "Certificates are issued upon completion." },
    ]},
    { transcript: "This is a reminder that the annual health fair will take place this Thursday in the cafeteria from ten A.M. to two P.M. Free screenings and flu shots will be available. Please bring your employee ID.", questions: [
      { q: "When is the health fair?", correct: "b", choices: ["Wednesday", "Thursday", "Friday", "Saturday"], exp: "The fair is this Thursday." },
      { q: "Where will it be held?", correct: "a", choices: ["In the cafeteria", "In the gym", "In the lobby", "In the parking lot"], exp: "It will be in the cafeteria." },
      { q: "What should employees bring?", correct: "c", choices: ["A doctor's note", "A registration form", "Their employee ID", "Medical insurance"], exp: "Bring your employee ID." },
    ]},
  ];
  const t = talks[seed % talks.length];
  return t.questions.map((q) => ({ ...q, transcript: t.transcript, choices: q.choices.map((ch, j) => choice(["a","b","c","d"][j], ch)) }));
}

function part5Bank(seed) {
  const items = [
    { q: "The company _____ a new product line next quarter.", correct: "c", choices: ["launch", "launches", "will launch", "launching"], exp: "'Next quarter' = future → will launch." },
    { q: "All employees must _____ their expense reports by Friday.", correct: "a", choices: ["submit", "submits", "submitted", "submitting"], exp: "Modal 'must' + base verb." },
    { q: "Ms. Park is responsible _____ coordinating the event.", correct: "a", choices: ["for", "to", "with", "at"], exp: "Collocation: responsible for." },
    { q: "The meeting was postponed _____ the director was unavailable.", correct: "a", choices: ["because", "because of", "although", "despite"], exp: "'Because' + clause." },
    { q: "Please make sure the documents are _____ before noon.", correct: "c", choices: ["approve", "approving", "approved", "approval"], exp: "Passive: are approved." },
    { q: "The warehouse stores more than 10,000 _____ of merchandise.", correct: "b", choices: ["item", "items", "item's", "items'"], exp: "Plural after number > 1." },
    { q: "Mr. Tanaka asked _____ the contract be reviewed by legal counsel.", correct: "b", choices: ["what", "that", "which", "who"], exp: "Asked that + subjunctive." },
    { q: "Neither the manager nor the assistants _____ available today.", correct: "b", choices: ["is", "are", "was", "has been"], exp: "Verb agrees with nearer subject 'assistants'." },
    { q: "We look forward to _____ from you soon.", correct: "d", choices: ["hear", "heard", "hearing", "hears"], exp: "Look forward to + gerund." },
    { q: "The seminar was _____ informative that many attendees stayed for questions.", correct: "a", choices: ["so", "such", "very", "too"], exp: "So + adjective + that..." },
    { q: "Employees are required _____ safety goggles in the laboratory.", correct: "c", choices: ["wear", "wearing", "to wear", "wore"], exp: "Required to + infinitive." },
    { q: "The invoice _____ to the accounting department yesterday.", correct: "d", choices: ["sends", "sent", "was sent", "sending"], exp: "Passive past: was sent." },
    { q: "_____ the rain, the outdoor event was moved indoors.", correct: "b", choices: ["Although", "Because of", "Despite", "Unless"], exp: "Because of + noun phrase." },
    { q: "The new policy will take _____ next month.", correct: "a", choices: ["effect", "affect", "effective", "effectively"], exp: "Take effect = become active." },
    { q: "She has worked here _____ five years.", correct: "c", choices: ["since", "during", "for", "while"], exp: "For + duration." },
  ];
  const out = [];
  for (let i = 0; i < 15; i++) {
    const t = items[(i + seed) % items.length];
    out.push({ ...t, choices: t.choices.map((c, j) => choice(["a","b","c","d"][j], c)) });
  }
  return out;
}

function part6Passages(seed) {
  const passages = [
    { title: "Email — Office Relocation", content: "To: All Staff\nFrom: Human Resources\nSubject: Office Relocation\n\nOur office relocation to Park Avenue will take place on March 15. Complete packing by March 12. IT support will assist with computer setup on March 14. The current office closes at 5:00 P.M. on March 14. Normal hours resume March 16.\n\nJennifer Walsh\nHR Manager", questions: [
      { q: "When will the relocation take place?", correct: "c", choices: ["March 12", "March 14", "March 15", "March 16"], exp: "Relocation is on March 15." },
      { q: "What should employees do by March 12?", correct: "b", choices: ["Set up computers", "Complete packing", "Contact HR", "Attend orientation"], exp: "Complete packing by March 12." },
      { q: "When do normal hours resume?", correct: "d", choices: ["March 14", "March 15", "March 16", "March 17"], exp: "Normal hours resume March 16." },
      { q: "Who sent the email?", correct: "a", choices: ["Human Resources", "IT support", "The building manager", "The finance team"], exp: "From: Human Resources." },
    ]},
    { title: "Memo — Training Program", content: "MEMORANDUM\nTo: Department Heads\nFrom: Training Division\nDate: April 3\nRe: New Employee Training\n\nStarting next month, new employees must complete a two-day orientation. Sessions are held every Monday and Wednesday in Conference Room B. Notify Training at least one week before a new hire's start date.", questions: [
      { q: "How long is the orientation?", correct: "b", choices: ["One day", "Two days", "One week", "Two weeks"], exp: "Two-day orientation." },
      { q: "What should department heads do?", correct: "c", choices: ["Conduct sessions", "Issue certificates", "Notify Training in advance", "Reserve Room A"], exp: "Notify Training one week before start date." },
    ]},
  ];
  const p = passages[seed % passages.length];
  return { passage: p, questions: p.questions.map((q) => ({ ...q, choices: q.choices.map((c, j) => choice(["a","b","c","d"][j], c)) })) };
}

function part7Passages(seed) {
  const passages = [
    { title: "Article — Remote Work Trends", content: "A survey by Global Workforce Institute found that 62% of companies offer remote work, up from 40% five years ago. Employee satisfaction rose 23% in organizations with flexible policies. Managers report challenges monitoring productivity. Experts predict hybrid models will be standard by 2030.", questions: [
      { q: "What is the main topic?", correct: "a", choices: ["The growth of remote work", "Employee training", "International expansion", "Safety regulations"], exp: "Article discusses remote work growth." },
      { q: "What percentage offer remote work?", correct: "c", choices: ["23%", "40%", "62%", "75%"], exp: "62% of companies offer remote work." },
      { q: "What will be standard by 2030?", correct: "b", choices: ["Fully remote work", "Hybrid work models", "Four-day weeks", "Office-only policies"], exp: "Hybrid models will be standard." },
    ]},
    { title: "Advertisement — CloudSync Pro", content: "CloudSync Pro offers secure cloud storage from $9.99/month for 100 GB. Features: hourly backup, real-time collaboration, 256-bit encryption, 24/7 support. Sign up before June 30 for three months free on annual plans. Visit www.cloudsyncpro.com.", questions: [
      { q: "What is CloudSync Pro?", correct: "b", choices: ["Project management tool", "Cloud storage service", "Video conferencing app", "Accounting software"], exp: "Secure cloud storage service." },
      { q: "What special offer is mentioned?", correct: "b", choices: ["Free laptop", "Three months free on annual plans", "Unlimited storage", "50% discount"], exp: "Three months free on annual plans." },
      { q: "How often are files backed up?", correct: "a", choices: ["Every hour", "Every day", "Every week", "Every month"], exp: "Hourly backup." },
    ]},
  ];
  const p = passages[seed % passages.length];
  return { passage: p, questions: p.questions.map((q) => ({ ...q, choices: q.choices.map((c, j) => choice(["a","b","c","d"][j], c)) })) };
}

function buildExam(year, form) {
  const examId = `toeic-${year}-${String(form).padStart(2, "0")}`;
  const seed = year * 10 + form;
  const questions = [];
  const passages = [];

  part1Bank(seed).forEach((item, i) => {
    const id = `${examId}-p1-q${i + 1}`;
    questions.push({
      id, part: "part1", imageUrl: `https://images.unsplash.com/${P1_IMAGES[(i + seed) % P1_IMAGES.length]}?w=600&h=400&fit=crop`,
      audioUrl: audioPath(examId, id), transcript: item.transcript, questionText: item.q,
      choices: item.choices, correctChoiceId: item.correct, explanation: item.exp,
    });
  });

  part2Bank(seed).forEach((item, i) => {
    const id = `${examId}-p2-q${i + 1}`;
    questions.push({
      id, part: "part2", audioUrl: audioPath(examId, id), transcript: item.transcript,
      questionText: item.q, choices: item.choices, correctChoiceId: item.correct, explanation: item.exp,
    });
  });

  part3Bank(seed).forEach((item, i) => {
    const id = `${examId}-p3-q${i + 1}`;
    questions.push({
      id, part: "part3", audioUrl: audioPath(examId, id), transcript: item.transcript,
      questionText: item.q, choices: item.choices, correctChoiceId: item.correct, explanation: item.exp,
    });
  });

  part4Bank(seed + 1).forEach((item, i) => {
    const id = `${examId}-p4-q${i + 1}`;
    questions.push({
      id, part: "part4", audioUrl: audioPath(examId, id), transcript: item.transcript,
      questionText: item.q, choices: item.choices, correctChoiceId: item.correct, explanation: item.exp,
    });
  });

  part5Bank(seed).forEach((item, i) => {
    const id = `${examId}-p5-q${i + 1}`;
    questions.push({
      id, part: "part5", questionText: item.q, choices: item.choices,
      correctChoiceId: item.correct, explanation: item.exp,
    });
  });

  [0, 1].forEach((pi) => {
    const { passage, questions: pqs } = part6Passages(seed + pi);
    const pid = `${examId}-p6-passage-${pi + 1}`;
    const qids = [];
    pqs.forEach((item, i) => {
      const id = `${examId}-p6-q${pi * 4 + i + 1}`;
      qids.push(id);
      questions.push({
        id, part: "part6", passageId: pid, questionText: item.q, choices: item.choices,
        correctChoiceId: item.correct, explanation: item.exp,
      });
    });
    passages.push({ id: pid, title: passage.title, content: passage.content, questionIds: qids });
  });

  [0, 1].forEach((pi) => {
    const { passage, questions: pqs } = part7Passages(seed + pi + 2);
    const pid = `${examId}-p7-passage-${pi + 1}`;
    const qids = [];
    pqs.forEach((item, i) => {
      const id = `${examId}-p7-q${pi * 3 + i + 1}`;
      qids.push(id);
      questions.push({
        id, part: "part7", passageId: pid, questionText: item.q, choices: item.choices,
        correctChoiceId: item.correct, explanation: item.exp,
      });
    });
    passages.push({ id: pid, title: passage.title, content: passage.content, questionIds: qids });
  });

  return {
    id: examId, year, form,
    title: `TOEIC ${year} — Đề ${String(form).padStart(2, "0")}`,
    description: `Đề luyện tập TOEIC mô phỏng năm ${year}, Form ${form} — ${questions.length} câu`,
    timeLimit: 75,
    parts: ["part1","part2","part3","part4","part5","part6","part7"],
    passages, questions,
  };
}

// ─── Vocabulary ───
const VOCAB_TOPICS = {
  business: { label: "Business", icon: "💼", words: [
    ["revenue","/ˈrevənjuː/","noun","doanh thu","The company's revenue increased by 15%."],
    ["negotiate","/nɪˈɡoʊʃieɪt/","verb","đàm phán","We need to negotiate better terms."],
    ["deadline","/ˈdedlaɪn/","noun","hạn chót","The deadline is next Friday."],
    ["profitable","/ˈprɒfɪtəbl/","adjective","có lợi nhuận","The product line has been profitable."],
    ["merger","/ˈmɜːrdʒər/","noun","sáp nhập","The merger created the largest bank."],
    ["inventory","/ˈɪnvəntɔːri/","noun","hàng tồn kho","Check inventory before ordering."],
    ["stakeholder","/ˈsteɪkhoʊldər/","noun","bên liên quan","All stakeholders were notified."],
    ["outsource","/ˈaʊtsɔːrs/","verb","thuê ngoài","They outsourced IT support."],
    ["quarterly","/ˈkwɔːrtərli/","adjective","hàng quý","Quarterly earnings exceeded expectations."],
    ["acquisition","/ˌækwɪˈzɪʃn/","noun","mua lại","The acquisition was finalized in March."],
    ["subsidiary","/səbˈsɪdieri/","noun","công ty con","The subsidiary operates in Asia."],
    ["turnover","/ˈtɜːrnoʊvər/","noun","doanh số / tỷ lệ nghỉ việc","Annual turnover reached $2 million."],
    ["liability","/ˌlaɪəˈbɪləti/","noun","trách nhiệm pháp lý","The company reduced its liabilities."],
    ["dividend","/ˈdɪvɪdend/","noun","cổ tức","Shareholders received a dividend."],
    ["franchise","/ˈfræntʃaɪz/","noun","nhượng quyền","They opened a franchise in Hanoi."],
    ["benchmark","/ˈbentʃmɑːrk/","noun","chuẩn so sánh","Set a benchmark for performance."],
    ["compliance","/kəmˈplaɪəns/","noun","tuân thủ","Ensure compliance with regulations."],
    ["overhead","/ˈoʊvərhed/","noun","chi phí hoạt động","Overhead costs rose this year."],
    ["procurement","/prəˈkjʊrmənt/","noun","mua sắm","The procurement team found savings."],
    ["scalable","/ˈskeɪləbl/","adjective","có thể mở rộng","The solution is highly scalable."],
    ["synergy","/ˈsɪnərdʒi/","noun","hiệp lực","The merger created synergy."],
    ["leverage","/ˈlevərɪdʒ/","verb","tận dụng","Leverage technology to grow."],
    ["portfolio","/pɔːrtˈfoʊlioʊ/","noun","danh mục đầu tư","Diversify your investment portfolio."],
    ["amortize","/əˈmɔːrtaɪz/","verb","khấu hao","Amortize the loan over ten years."],
    ["fiduciary","/fɪˈduːʃieri/","adjective","ủy thác","He has a fiduciary duty to clients."],
  ]},
  travel: { label: "Travel", icon: "✈️", words: [
    ["itinerary","/aɪˈtɪnəreri/","noun","lịch trình","Review your itinerary before the trip."],
    ["departure","/dɪˈpɑːrtʃər/","noun","khởi hành","The departure gate changed to Gate 12."],
    ["accommodation","/əˌkɒməˈdeɪʃn/","noun","chỗ ở","We booked accommodation near the center."],
    ["customs","/ˈkʌstəmz/","noun","hải quan","Go through customs upon arrival."],
    ["layover","/ˈleɪoʊvər/","noun","quá cảnh","We have a three-hour layover."],
    ["reservation","/ˌrezərˈveɪʃn/","noun","đặt chỗ","Confirm my reservation for tonight."],
    ["boarding pass","/ˈbɔːrdɪŋ pæs/","noun","thẻ lên máy bay","Show your boarding pass at the gate."],
    ["baggage claim","/ˈbæɡɪdʒ kleɪm/","noun","khu nhận hành lý","Meet at baggage claim."],
    ["immigration","/ˌɪmɪˈɡreɪʃn/","noun","nhập cư","Immigration took thirty minutes."],
    ["concierge","/ˌkɒnˈsjeərʒ/","noun","nhân viên lễ tân","Ask the concierge for directions."],
    ["excursion","/ɪkˈskɜːrʒn/","noun","chuyến tham quan","Join the city excursion tomorrow."],
    ["turbulence","/ˈtɜːrbjələns/","noun","sự chập chờn","The plane experienced turbulence."],
    ["visa","/ˈviːzə/","noun","thị thực","Apply for a visa two weeks early."],
    ["roaming","/ˈroʊmɪŋ/","noun","chuyển vùng","Enable roaming before you travel."],
    ["souvenir","/ˌsuːvəˈnɪr/","noun","quà lưu niệm","Buy souvenirs at the market."],
    ["round-trip","/raʊnd trɪp/","adjective","khứ hồi","I booked a round-trip ticket."],
    ["check-in","/tʃek ɪn/","noun","làm thủ tục","Online check-in opens 24 hours before."],
    ["overbooked","/ˌoʊvərˈbʊkt/","adjective","đặt quá số ghế","The flight was overbooked."],
    ["jet lag","/dʒet læɡ/","noun","lệch múi giờ","I have jet lag after the long flight."],
    ["passport","/ˈpæspɔːrt/","noun","hộ chiếu","Keep your passport in a safe place."],
    ["terminal","/ˈtɜːrmɪnl/","noun","nhà ga","Terminal 2 handles international flights."],
    ["shuttle","/ˈʃʌtl/","noun","xe đưa đón","Take the hotel shuttle from the airport."],
    ["refund","/ˈriːfʌnd/","noun","hoàn tiền","Request a refund for the canceled flight."],
    ["destination","/ˌdestɪˈneɪʃn/","noun","điểm đến","Our destination is Tokyo."],
    ["expedition","/ˌekspəˈdɪʃn/","noun","chuyến thám hiểm","The expedition lasted three weeks."],
  ]},
  office: { label: "Office", icon: "🏢", words: [
    ["memo","/ˈmemoʊ/","noun","bản ghi nhớ","The manager sent a memo."],
    ["colleague","/ˈkɒliːɡ/","noun","đồng nghiệp","My colleague will cover for me."],
    ["conference room","/ˈkɒnfərəns ruːm/","noun","phòng họp","Meet in Conference Room B."],
    ["overtime","/ˈoʊvərtaɪm/","noun","làm thêm giờ","Overtime requires manager approval."],
    ["supervisor","/ˈsuːpərvaɪzər/","noun","người giám sát","Get approval from your supervisor."],
    ["paperwork","/ˈpeɪpərwɜːrk/","noun","giấy tờ","Complete the paperwork by Friday."],
    ["workspace","/ˈwɜːrkspeɪs/","noun","không gian làm việc","Hot-desking freed up workspace."],
    ["headquarters","/ˌhedˈkwɔːrtərz/","noun","trụ sở chính","Visit headquarters next month."],
    ["receptionist","/rɪˈsepʃənɪst/","noun","lễ tân","The receptionist will greet visitors."],
    ["cubicle","/ˈkjuːbɪkl/","noun","vách ngăn văn phòng","She works in cubicle 14."],
    ["stationery","/ˈsteɪʃəneri/","noun","văn phòng phẩm","Order stationery from supply."],
    ["attendance","/əˈtendəns/","noun","chuyên cần","Attendance is tracked electronically."],
    ["promotion","/prəˈmoʊʃn/","noun","thăng chức","She received a promotion."],
    ["resignation","/ˌrezɪɡˈneɪʃn/","noun","đơn từ chức","He submitted his resignation."],
    ["onboarding","/ˈɒnbɔːrdɪŋ/","noun","hội nhập nhân viên","Onboarding lasts two days."],
    ["workflow","/ˈwɜːrkfloʊ/","noun","quy trình làm việc","Streamline the approval workflow."],
    ["bulletin board","/ˈbʊlətɪn bɔːrd/","noun","bảng thông báo","Check the bulletin board for updates."],
    ["archives","/ˈɑːrkaɪvz/","noun","lưu trữ","Files are stored in the archives."],
    ["nameplate","/ˈneɪmpleɪt/","noun","bảng tên","Her nameplate is on the door."],
    ["break room","/breɪk ruːm/","noun","phòng nghỉ","Coffee is in the break room."],
    ["facilities","/fəˈsɪlətiz/","noun","cơ sở vật chất","Facilities management handles repairs."],
    ["directory","/dəˈrektəri/","noun","danh bạ","Look up extensions in the directory."],
    ["intercom","/ˈɪntərkɒm/","noun","hệ thống liên lạc nội bộ","Use the intercom to reach security."],
    ["badge","/bædʒ/","noun","thẻ nhân viên","Swipe your badge at the entrance."],
    ["reimbursement","/ˌriːɪmˈbɜːrsmənt/","noun","hoàn trả chi phí","Submit receipts for reimbursement."],
  ]},
  finance: { label: "Finance", icon: "💰", words: [
    ["interest rate","/ˈɪntrəst reɪt/","noun","lãi suất","The interest rate dropped to 4%."],
    ["mortgage","/ˈmɔːrɡɪdʒ/","noun","thế chấp","They applied for a mortgage."],
    ["audit","/ˈɔːdɪt/","noun","kiểm toán","The annual audit starts Monday."],
    ["depreciation","/dɪˌpriːʃiˈeɪʃn/","noun","khấu hao","Calculate asset depreciation."],
    ["liquidity","/lɪˈkwɪdəti/","noun","thanh khoản","The firm has strong liquidity."],
    ["invoice","/ˈɪnvɔɪs/","noun","hóa đơn","Send the invoice by e-mail."],
    ["budget","/ˈbʌdʒɪt/","noun","ngân sách","Stay within the budget."],
    ["transaction","/trænˈzækʃn/","noun","giao dịch","Each transaction is logged."],
    ["collateral","/kəˈlætərəl/","noun","tài sản thế chấp","The bank required collateral."],
    ["equity","/ˈekwəti/","noun","vốn chủ sở hữu","Equity investors joined the round."],
    ["bond","/bɒnd/","noun","trái phiếu","Government bonds are low-risk."],
    ["portfolio","/pɔːrtˈfoʊlioʊ/","noun","danh mục","Rebalance your portfolio yearly."],
    ["overdraft","/ˈoʊvərdræft/","noun","thấu chi","Avoid overdraft fees."],
    ["fiscal year","/ˈfɪskl jɪr/","noun","năm tài chính","The fiscal year ends in June."],
    ["amortization","/əˌmɔːrtɪˈzeɪʃn/","noun","khấu trừ dần","Amortization spreads the cost."],
    ["creditworthiness","/ˈkredɪtwɜːrðinəs/","noun","khả năng trả nợ","Banks assess creditworthiness."],
    ["dividend yield","/ˈdɪvɪdend jiːld/","noun","tỷ suất cổ tức","The dividend yield is attractive."],
    ["capital expenditure","/ˈkæpɪtl ɪkˈspendɪtʃər/","noun","chi phí đầu tư","CapEx rose this quarter."],
    ["write-off","/raɪt ɒf/","noun","xóa nợ","They took a tax write-off."],
    ["reconciliation","/ˌrekənsɪliˈeɪʃn/","noun","đối chiếu","Monthly bank reconciliation is due."],
    ["underwriting","/ˈʌndərˌraɪtɪŋ/","noun","bảo lãnh phát hành","Underwriting fees were disclosed."],
    ["hedge","/hedʒ/","verb","phòng ngừa rủi ro","Hedge against currency risk."],
    ["solvency","/ˈsɒlvənsi/","noun","khả năng thanh toán","Test the company's solvency."],
    ["accrual","/əˈkruːəl/","noun","dồn tích","Revenue is recognized on accrual basis."],
    ["foreclosure","/fɔːrˈkloʊʒər/","noun","tịch thu tài sản","Foreclosure was avoided."],
  ]},
  technology: { label: "Technology", icon: "💻", words: [
    ["bandwidth","/ˈbændwɪdθ/","noun","băng thông","Upgrade bandwidth for video calls."],
    ["encryption","/ɪnˈkrɪpʃn/","noun","mã hóa","Use 256-bit encryption."],
    ["firewall","/ˈfaɪərwɔːl/","noun","tường lửa","Configure the firewall rules."],
    ["malware","/ˈmælwer/","noun","phần mềm độc hại","Scan for malware weekly."],
    ["database","/ˈdeɪtəbeɪs/","noun","cơ sở dữ liệu","Back up the database nightly."],
    ["interface","/ˈɪntərfeɪs/","noun","giao diện","The interface is user-friendly."],
    ["algorithm","/ˈælɡərɪðəm/","noun","thuật toán","The algorithm improves search results."],
    ["prototype","/ˈproʊtətaɪp/","noun","nguyên mẫu","Build a prototype by Friday."],
    ["deployment","/dɪˈplɔɪmənt/","noun","triển khai","Deployment is scheduled tonight."],
    ["latency","/ˈleɪtənsi/","noun","độ trễ","Reduce network latency."],
    ["cloud computing","/klaʊd kəmˈpjuːtɪŋ/","noun","điện toán đám mây","Migrate to cloud computing."],
    ["automation","/ˌɔːtəˈmeɪʃn/","noun","tự động hóa","Automation saves labor costs."],
    ["debug","/diːˈbʌɡ/","verb","gỡ lỗi","Debug the application before release."],
    ["patch","/pætʃ/","noun","bản vá","Install the security patch."],
    ["server","/ˈsɜːrvər/","noun","máy chủ","The server will restart at midnight."],
    ["API","/ˌeɪ piː ˈaɪ/","noun","giao diện lập trình","Integrate via the REST API."],
    ["scalability","/ˌskeɪləˈbɪləti/","noun","khả năng mở rộng","Test scalability under load."],
    ["backup","/ˈbækʌp/","noun","sao lưu","Restore from the latest backup."],
    ["virtualization","/ˌvɜːrtʃuələˈzeɪʃn/","noun","ảo hóa","Virtualization reduces hardware costs."],
    ["open-source","/ˌoʊpən ˈsɔːrs/","adjective","mã nguồn mở","They adopted open-source tools."],
    ["iteration","/ˌɪtəˈreɪʃn/","noun","lần lặp","Each iteration adds features."],
    ["throughput","/ˈθruːpʊt/","noun","thông lượng","Throughput doubled after optimization."],
    ["repository","/rɪˈpɒzətɔːri/","noun","kho mã","Push changes to the repository."],
    ["middleware","/ˈmɪdlwer/","noun","phần mềm trung gian","Middleware connects the systems."],
    ["render","/ˈrendər/","verb","kết xuất","The page renders in under a second."],
  ]},
  manufacturing: { label: "Manufacturing", icon: "🏭", words: [
    ["assembly line","/əˈsembli laɪn/","noun","dây chuyền lắp ráp","Workers on the assembly line."],
    ["quality control","/ˈkwɒləti kənˈtroʊl/","noun","kiểm soát chất lượng","QC rejected the batch."],
    ["raw material","/rɔː məˈtɪriəl/","noun","nguyên liệu thô","Raw material costs increased."],
    ["throughput","/ˈθruːpʊt/","noun","sản lượng","Factory throughput hit a record."],
    ["defect","/ˈdiːfekt/","noun","lỗi sản phẩm","Defect rate fell below 1%."],
    ["warehouse","/ˈwerhaʊs/","noun","kho hàng","Ship from the regional warehouse."],
    ["logistics","/ləˈdʒɪstɪks/","noun","hậu cần","Logistics handles distribution."],
    ["fabrication","/ˌfæbrɪˈkeɪʃn/","noun","gia công chế tạo","Metal fabrication is outsourced."],
    ["calibration","/ˌkælɪˈbreɪʃn/","noun","hiệu chuẩn","Annual calibration is required."],
    ["downtime","/ˈdaʊntaɪm/","noun","thời gian ngừng máy","Minimize downtime during maintenance."],
    ["batch","/bætʃ/","noun","lô sản xuất","Process the next batch tonight."],
    ["specification","/ˌspesɪfɪˈkeɪʃn/","noun","quy cách kỹ thuật","Meet all specifications."],
    ["tooling","/ˈtuːlɪŋ/","noun","đồ gá","New tooling speeds production."],
    ["lean manufacturing","/liːn ˌmænjuˈfæktʃərɪŋ/","noun","sản xuất tinh gọn","Lean manufacturing cut waste."],
    ["supply chain","/səˈplaɪ tʃeɪn/","noun","chuỗi cung ứng","Disruptions hit the supply chain."],
    ["work order","/wɜːrk ˈɔːrdər/","noun","lệnh sản xuất","Complete work order 4472."],
    ["hazardous","/ˈhæzərdəs/","adjective","nguy hiểm","Handle hazardous materials carefully."],
    ["recycle","/riːˈsaɪkl/","verb","tái chế","Recycle scrap metal."],
    ["overhaul","/ˈoʊvərhɔːl/","noun","đại tu","Schedule a machine overhaul."],
    ["tolerance","/ˈtɒlərəns/","noun","dung sai","Parts must be within tolerance."],
    ["prototype","/ˈproʊtətaɪp/","noun","mẫu thử","Approve the prototype first."],
    ["conveyor","/kənˈveɪər/","noun","băng chuyền","Items move on the conveyor."],
    ["inventory turnover","/ˈɪnvəntɔːri ˈtɜːrnoʊvər/","noun","vòng quay hàng tồn","Improve inventory turnover."],
    ["safety protocol","/ˈseɪfti ˈproʊtəkɒl/","noun","quy trình an toàn","Follow safety protocols."],
    ["production quota","/prəˈdʌkʃn ˈkwoʊtə/","noun","chỉ tiêu sản xuất","We met the production quota."],
  ]},
  marketing: { label: "Marketing", icon: "📣", words: [
    ["brand awareness","/brænd əˈwernəs/","noun","nhận diện thương hiệu","Campaigns boost brand awareness."],
    ["target audience","/ˈtɑːrɡɪt ˈɔːdiəns/","noun","đối tượng mục tiêu","Define your target audience."],
    ["conversion rate","/kənˈvɜːrʒn reɪt/","noun","tỷ lệ chuyển đổi","Conversion rate improved 8%."],
    ["market share","/ˈmɑːrkɪt ʃer/","noun","thị phần","We gained market share."],
    ["endorsement","/ɪnˈdɔːrsmənt/","noun","sự bảo trợ","Celebrity endorsement helped sales."],
    ["demographic","/ˌdeməˈɡræfɪk/","noun","nhóm nhân khẩu học","Study the key demographic."],
    ["promotional","/prəˈmoʊʃənl/","adjective","quảng bá","Launch a promotional offer."],
    ["segmentation","/ˌseɡmənˈteɪʃn/","noun","phân khúc","Use market segmentation."],
    ["ROI","/ˌɑːr oʊ ˈaɪ/","noun","lợi tức đầu tư","Measure ROI on ad spend."],
    ["loyalty program","/ˈlɔɪəlti ˈproʊɡræm/","noun","chương trình khách hàng thân thiết","Join our loyalty program."],
    ["billboard","/ˈbɪlbɔːrd/","noun","bảng quảng cáo","Billboards line the highway."],
    ["newsletter","/ˈnuːzletər/","noun","bản tin","Subscribe to the newsletter."],
    ["viral","/ˈvaɪrəl/","adjective","lan truyền","The video went viral."],
    ["slogan","/ˈsloʊɡən/","noun","khẩu hiệu","The new slogan is catchy."],
    ["focus group","/ˈfoʊkəs ɡruːp/","noun","nhóm khảo sát","Run a focus group test."],
    ["A/B testing","/eɪ biː ˈtestɪŋ/","noun","thử nghiệm A/B","A/B testing picked the winner."],
    ["influencer","/ˈɪnfluənsər/","noun","người có ảnh hưởng","Partner with an influencer."],
    ["retargeting","/riːˈtɑːrɡɪtɪŋ/","noun","quảng cáo nhắm lại","Retargeting recovered abandoned carts."],
    ["collateral","/kəˈlætərəl/","noun","tài liệu marketing","Print new sales collateral."],
    ["upsell","/ˈʌpsel/","verb","bán thêm","Train staff to upsell."],
    ["cross-sell","/krɒs sel/","verb","bán chéo","Cross-sell related products."],
    ["impression","/ɪmˈpreʃn/","noun","lượt hiển thị","Impressions exceeded one million."],
    ["click-through","/klɪk θruː/","noun","tỷ lệ nhấp","Click-through rate doubled."],
    ["positioning","/pəˈzɪʃənɪŋ/","noun","định vị","Clarify brand positioning."],
    ["launch","/lɔːntʃ/","noun","ra mắt sản phẩm","The launch is set for April."],
  ]},
  hr: { label: "Human Resources", icon: "👥", words: [
    ["recruitment","/rɪˈkruːtmənt/","noun","tuyển dụng","Recruitment starts in January."],
    ["benefits package","/ˈbenɪfɪts ˈpækɪdʒ/","noun","gói phúc lợi","Review the benefits package."],
    ["performance review","/pərˈfɔːrməns rɪˈvjuː/","noun","đánh giá hiệu suất","Annual performance reviews begin."],
    ["severance","/ˈsevərəns/","noun","trợ cấp thôi việc","She received severance pay."],
    ["probation","/proʊˈbeɪʃn/","noun","thử việc","Probation lasts three months."],
    ["compensation","/ˌkɒmpenˈseɪʃn/","noun","thù lao","Compensation is competitive."],
    ["diversity","/daɪˈvɜːrsəti/","noun","đa dạng","Promote workplace diversity."],
    ["harassment","/həˈræsmənt/","noun","quấy rối","Report harassment immediately."],
    ["retention","/rɪˈtenʃn/","noun","giữ chân nhân viên","Improve employee retention."],
    ["appraisal","/əˈpreɪzl/","noun","thẩm định","Complete your self-appraisal."],
    ["payroll","/ˈpeɪroʊl/","noun","bảng lương","Payroll runs every two weeks."],
    ["leave of absence","/liːv əv ˈæbsəns/","noun","nghỉ phép dài","She took a leave of absence."],
    ["workforce","/ˈwɜːrkfɔːrs/","noun","lực lượng lao động","The workforce grew 10%."],
    ["mentorship","/ˈmentɔːrʃɪp/","noun","cố vấn","Join the mentorship program."],
    ["termination","/ˌtɜːrmɪˈneɪʃn/","noun","chấm dứt hợp đồng","Termination requires documentation."],
    ["job description","/dʒɒb dɪˈskrɪpʃn/","noun","mô tả công việc","Update the job description."],
    ["collective bargaining","/kəˈlektɪv ˈbɑːrɡənɪŋ/","noun","thương lượng tập thể","Collective bargaining continues."],
    ["grievance","/ˈɡriːvəns/","noun","khiếu nại","File a formal grievance."],
    ["orientation","/ˌɔːriənˈteɪʃn/","noun","định hướng","Orientation is on Monday."],
    ["succession planning","/səkˈseʃn ˈplænɪŋ/","noun","kế hoạch kế nhiệm","Succession planning is critical."],
    ["headhunter","/ˈhedhʌntər/","noun","công ty săn nhân tài","A headhunter contacted her."],
    ["attrition","/əˈtrɪʃn/","noun","tỷ lệ nghỉ việc","Attrition rose last quarter."],
    ["freelance","/ˈfriːlæns/","adjective","làm tự do","Hire freelance designers."],
    ["non-compete","/nɒn kəmˈpiːt/","noun","điều khoản cạnh tranh","Sign a non-compete clause."],
    ["wellness program","/ˈwelnəs ˈproʊɡræm/","noun","chương trình sức khỏe","Join the wellness program."],
  ]},
  health: { label: "Health", icon: "🏥", words: [
    ["diagnosis","/ˌdaɪəɡˈnoʊsɪs/","noun","chẩn đoán","The diagnosis was confirmed."],
    ["prescription","/prɪˈskrɪpʃn/","noun","đơn thuốc","Fill the prescription at the pharmacy."],
    ["symptom","/ˈsɪmptəm/","noun","triệu chứng","Report any new symptoms."],
    ["vaccination","/ˌvæksɪˈneɪʃn/","noun","tiêm chủng","Vaccination is recommended."],
    ["outpatient","/ˈaʊtpeɪʃənt/","noun","bệnh nhân ngoại trú","Outpatient services expanded."],
    ["insurance coverage","/ɪnˈʃʊrəns ˈkʌvərɪdʒ/","noun","bảo hiểm y tế","Check your insurance coverage."],
    ["rehabilitation","/ˌriːəˌbɪlɪˈteɪʃn/","noun","phục hồi chức năng","Rehabilitation takes six weeks."],
    ["hygiene","/ˈhaɪdʒiːn/","noun","vệ sinh","Maintain strict hygiene."],
    ["chronic","/ˈkrɒnɪk/","adjective","mãn tính","Manage chronic conditions."],
    ["screening","/ˈskriːnɪŋ/","noun","sàng lọc","Free health screening is offered."],
    ["dosage","/ˈdoʊsɪdʒ/","noun","liều lượng","Follow the correct dosage."],
    ["allergy","/ˈælərdʒi/","noun","dị ứng","List any food allergies."],
    ["immunity","/ɪˈmjuːnəti/","noun","miễn dịch","Boost your immunity."],
    ["wellness","/ˈwelnəs/","noun","sức khỏe tổng thể","Focus on employee wellness."],
    ["epidemic","/ˌepɪˈdemɪk/","noun","dịch bệnh","Protocols were updated for the epidemic."],
    ["surgeon","/ˈsɜːrdʒən/","noun","bác sĩ phẫu thuật","The surgeon scheduled the operation."],
    ["pharmaceutical","/ˌfɑːrməˈsuːtɪkl/","adjective","dược phẩm","Pharmaceutical research continues."],
    ["medication","/ˌmedɪˈkeɪʃn/","noun","thuốc","Take medication with food."],
    ["preventive","/prɪˈventɪv/","adjective","phòng ngừa","Preventive care reduces costs."],
    ["intensive care","/ɪnˈtensɪv ker/","noun","hồi sức","He was moved to intensive care."],
    ["discharge","/dɪsˈtʃɑːrdʒ/","verb","xuất viện","Patients discharge after recovery."],
    ["anesthesia","/ˌænəsˈθiːʒə/","noun","gây mê","Anesthesia will be administered."],
    ["contagious","/kənˈteɪdʒəs/","adjective","lây nhiễm","Stay home if contagious."],
    ["nutrient","/ˈnuːtriənt/","noun","chất dinh dưỡng","Foods rich in nutrients."],
    ["paramedic","/ˌpærəˈmedɪk/","noun","nhân viên cấp cứu","Paramedics arrived quickly."],
  ]},
  dining: { label: "Dining", icon: "🍽️", words: [
    ["reservation","/ˌrezərˈveɪʃn/","noun","đặt bàn","Make a reservation for eight."],
    ["appetizer","/ˈæpɪtaɪzər/","noun","món khai vị","We ordered appetizers to share."],
    ["entree","/ˈɒntreɪ/","noun","món chính","The entree includes two sides."],
    ["beverage","/ˈbevərɪdʒ/","noun","đồ uống","Beverages are refilled free."],
    ["gratuity","/ɡrəˈtuːəti/","noun","tiền boa","Gratuity is included for large parties."],
    ["catering","/ˈkeɪtərɪŋ/","noun","dịch vụ ăn uống","Catering handles the conference lunch."],
    ["buffet","/bəˈfeɪ/","noun","tiệc tự chọn","The buffet opens at noon."],
    ["dietary","/ˈdaɪəteri/","adjective","ăn kiêng","Note any dietary restrictions."],
    ["complimentary","/ˌkɒmplɪˈmentəri/","adjective","miễn phí","Enjoy a complimentary dessert."],
    ["specialty","/ˈspeʃəlti/","noun","đặc sản","Try the chef's specialty."],
    ["seasonal","/ˈsiːzənl/","adjective","theo mùa","Seasonal menu items change monthly."],
    ["refill","/riːˈfɪl/","noun","đổ thêm","Ask for a coffee refill."],
    ["takeout","/ˈteɪkaʊt/","noun","mang đi","Order takeout online."],
    ["banquet","/ˈbæŋkwɪt/","noun","tiệc lớn","The banquet hall seats 200."],
    ["sommelier","/ˌsʌməlˈjeɪ/","noun","chuyên gia rượu","The sommelier recommended a wine."],
    ["gluten-free","/ˈɡluːtn friː/","adjective","không gluten","We offer gluten-free options."],
    ["portion","/ˈpɔːrʃn/","noun","khẩu phần","Portion sizes are generous."],
    ["cutlery","/ˈkʌtləri/","noun","dao nĩa","Sterilized cutlery is provided."],
    ["patron","/ˈpeɪtrən/","noun","khách quen","Regular patrons get discounts."],
    ["maitre d","/ˌmeɪtrə ˈdiː/","noun","quản gia nhà hàng","The maitre d greeted us."],
    ["a la carte","/ˌɑː lə ˈkɑːrt/","adverb","gọi món riêng","Order a la carte or from the set menu."],
    ["house wine","/haʊs waɪn/","noun","rượu của nhà hàng","Try the house wine."],
    ["food poisoning","/fuːd ˈpɔɪzənɪŋ/","noun","ngộ độc thực phẩm","Report suspected food poisoning."],
    ["vegan","/ˈviːɡən/","adjective","thuần chay","Vegan dishes are marked on the menu."],
    ["checkout","/ˈtʃekaʊt/","noun","thanh toán","Pay at checkout by the door."],
  ]},
  shipping: { label: "Shipping", icon: "🚢", words: [
    ["freight","/freɪt/","noun","hàng hóa vận chuyển","Freight arrives tomorrow."],
    ["customs clearance","/ˈkʌstəmz ˈklɪərəns/","noun","thông quan","Customs clearance was delayed."],
    ["bill of lading","/bɪl əv ˈleɪdɪŋ/","noun","vận đơn","Sign the bill of lading."],
    ["container","/kənˈteɪnər/","noun","container","Load the container by Friday."],
    ["dispatch","/dɪˈspætʃ/","verb","gửi đi","Dispatch the order today."],
    ["tracking number","/ˈtrækɪŋ ˈnʌmbər/","noun","mã vận đơn","Use the tracking number online."],
    ["tariff","/ˈtærɪf/","noun","thuế quan","Tariffs increased on imports."],
    ["consignment","/kənˈsaɪnmənt/","noun","lô hàng ký gửi","The consignment arrived intact."],
    ["port of entry","/pɔːrt əv ˈentri/","noun","cảng nhập khẩu","Goods enter at the port of entry."],
    ["warehousing","/ˈwerhaʊzɪŋ/","noun","lưu kho","Warehousing fees apply."],
    ["carrier","/ˈkæriər/","noun","đơn vị vận chuyển","The carrier picked up the pallet."],
    ["hazardous goods","/ˈhæzərdəs ɡʊdz/","noun","hàng nguy hiểm","Label hazardous goods properly."],
    ["pallet","/ˈpælɪt/","noun","pallet","Stack boxes on a pallet."],
    ["manifest","/ˈmænɪfest/","noun","bản kê khai","Check the shipping manifest."],
    ["ETA","/ˌiː tiː ˈeɪ/","noun","thời gian dự kiến đến","ETA is Thursday morning."],
    ["dock","/dɒk/","noun","bến bãi","Trucks wait at the loading dock."],
    ["courier","/ˈkʊriər/","noun","chuyển phát nhanh","Send it by courier."],
    ["overseas","/ˌoʊvərˈsiːz/","adverb","nước ngoài","Ship overseas via air freight."],
    ["consolidation","/kənˌsɒlɪˈdeɪʃn/","noun","gom hàng","Consolidation reduces shipping costs."],
    ["demurrage","/dɪˈmʌrɪdʒ/","noun","phí lưu container","Avoid demurrage charges."],
    ["waybill","/ˈweɪbɪl/","noun","vận đơn đường bộ","Attach the waybill to the crate."],
    ["intermodal","/ˌɪntərˈmoʊdl/","adjective","đa phương thức","Use intermodal transport."],
    ["shipment","/ˈʃɪpmənt/","noun","lô hàng","The shipment is en route."],
    ["logistics hub","/ləˈdʒɪstɪks hʌb/","noun","trung tâm logistics","The logistics hub opened in 2023."],
    ["fulfillment","/fʊlˈfɪlmənt/","noun","hoàn tất đơn hàng","Order fulfillment takes two days."],
  ]},
  "real-estate": { label: "Real Estate", icon: "🏠", words: [
    ["lease","/liːs/","noun","hợp đồng thuê","Sign a five-year lease."],
    ["mortgage","/ˈmɔːrɡɪdʒ/","noun","thế chấp","Apply for a fixed-rate mortgage."],
    ["appraisal","/əˈpreɪzl/","noun","thẩm định giá","The appraisal came in higher."],
    ["tenant","/ˈtenənt/","noun","người thuê","The tenant renewed the lease."],
    ["landlord","/ˈlændlɔːrd/","noun","chủ nhà","Contact the landlord for repairs."],
    ["down payment","/daʊn ˈpeɪmənt/","noun","tiền đặt cọc","Save for a larger down payment."],
    ["zoning","/ˈzoʊnɪŋ/","noun","quy hoạch","Check zoning regulations."],
    ["foreclosure","/fɔːrˈkloʊʒər/","noun","tịch thu nhà","Foreclosure listings increased."],
    ["renovation","/ˌrenəˈveɪʃn/","noun","cải tạo","Renovation will take three months."],
    ["square footage","/skwer ˈfuːtɪdʒ/","noun","diện tích","The office has 2,000 square footage."],
    ["amenities","/əˈmenətiz/","noun","tiện ích","Building amenities include a gym."],
    ["escrow","/ˈeskroʊ/","noun","tài khoản ký quỹ","Funds are held in escrow."],
    ["listing","/ˈlɪstɪŋ/","noun","tin rao bán","View the online listing."],
    ["broker","/ˈbroʊkər/","noun","môi giới","Hire a licensed broker."],
    ["occupancy rate","/ˈɒkjəpənsi reɪt/","noun","tỷ lệ lấp đầy","Occupancy rate reached 95%."],
    ["property tax","/ˈprɒpərti tæks/","noun","thuế tài sản","Property tax is due in April."],
    ["deed","/diːd/","noun","giấy chứng nhận quyền sở hữu","The deed was recorded yesterday."],
    ["sublease","/sʌbˈliːs/","verb","cho thuê lại","You may not sublease without approval."],
    ["condominium","/ˌkɒndəˈmɪniəm/","noun","căn hộ chung cư","She bought a condominium downtown."],
    ["eviction","/ɪˈvɪkʃn/","noun","đuổi thuê","Eviction requires legal notice."],
    ["inspection","/ɪnˈspekʃn/","noun","kiểm tra","Schedule a home inspection."],
    ["refinance","/riːˈfaɪnæns/","verb","tái cấp vốn","Refinance at a lower rate."],
    ["commercial property","/kəˈmɜːrʃl ˈprɒpərti/","noun","bất động sản thương mại","Invest in commercial property."],
    ["rental agreement","/ˈrentl əˈɡriːmənt/","noun","hợp đồng thuê","Read the rental agreement carefully."],
    ["closing costs","/ˈkloʊzɪŋ kɒsts/","noun","chi phí chốt giao dịch","Budget for closing costs."],
  ]},
};

// ─── Main ───
mkdirSync(EXAMS_DIR, { recursive: true });
mkdirSync(VOCAB_DIR, { recursive: true });

const manifest = { exams: [] };

for (const year of YEARS) {
  for (const form of FORMS) {
    const exam = buildExam(year, form);
    const filename = `${exam.id}.json`;
    writeFileSync(join(EXAMS_DIR, filename), JSON.stringify(exam, null, 2));
    manifest.exams.push({
      id: exam.id, year, form, title: exam.title,
      description: exam.description, timeLimit: exam.timeLimit,
      questionCount: exam.questions.length, file: filename,
    });
    console.log(`✓ ${exam.id} — ${exam.questions.length} questions`);
  }
}

writeFileSync(join(EXAMS_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));

const vocabManifest = { topics: [] };
for (const [topicId, topic] of Object.entries(VOCAB_TOPICS)) {
  const cards = topic.words.map(([word, phonetic, pos, meaning, example], i) => ({
    id: `v-${topicId}-${i + 1}`,
    word, phonetic, partOfSpeech: pos, meaning, exampleSentence: example, topic: topicId,
    audioUrl: `/audio/vocab/${topicId}/${word.replace(/\s+/g, "-").toLowerCase()}.mp3`,
  }));
  writeFileSync(join(VOCAB_DIR, `topic-${topicId}.json`), JSON.stringify({ topic: topicId, label: topic.label, icon: topic.icon, cards }, null, 2));
  vocabManifest.topics.push({ id: topicId, label: topic.label, icon: topic.icon, count: cards.length, file: `topic-${topicId}.json` });
  console.log(`✓ vocab/${topicId} — ${cards.length} words`);
}

writeFileSync(join(VOCAB_DIR, "manifest.json"), JSON.stringify(vocabManifest, null, 2));
console.log(`\nDone: ${manifest.exams.length} exams, ${vocabManifest.topics.length} vocab topics`);
