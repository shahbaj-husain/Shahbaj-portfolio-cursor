export type TopicOption = 'AI / ML' | 'Web Dev' | 'Python & Data' | 'Collaborate';

export type SkillCategory = 'All' | 'Languages' | 'Web' | 'AI / ML';

export interface SkillItem {
  id: string;
  number: string;
  name: string;
  category: Exclude<SkillCategory, 'All'>;
  focus: string;
  level: string;
}

export interface ProjectItem {
  id: string;
  index: string;
  name: string;
  status: string;
  category: string;
  summary: string;
  details: string[];
  stack: string[];
}

export const SERVICE_OPTIONS: TopicOption[] = [
  'AI / ML',
  'Web Dev',
  'Python & Data',
  'Collaborate',
];

export const HERO_COPY = {
  headline: "hey, i'm shahbaj.\nlearning by building!",
  description:
    "Second-year B.Tech CSE student exploring AI/ML and software development — building solid foundations in Python, C/C++, JavaScript, and data visualization.",
  promptTitle: 'What would you like to explore?',
  promptSubtitle: 'Select all that apply',
};

export const PROFILE_INFO = {
  brandName: 'Shahbaj®',
  fullName: 'Shahbaj',
  degree: 'B.Tech CSE · Second-Year Student',
  stage: 'Beginner → Intermediate · Progressing',
  headlineIntro: 'Exploring AI/ML and software development — learning by building.',
  paragraphs: [
    "I'm a second-year B.Tech CSE student building a solid foundation in programming, data structures and core computer science.",
    "I'm developing my skills in Python, C, C++, HTML, CSS and JavaScript through coursework and hands-on practice.",
    "For AI/ML, I'm exploring Python libraries including NumPy, Pandas, Matplotlib and Seaborn for working with data and creating visualizations.",
  ],
  learningStatements: [
    'I am a B.Tech CSE student building programming foundations.',
    'I am exploring AI/ML and software development.',
    'I learn by practising concepts and building projects.',
    'I use Python tools such as NumPy, Pandas, Matplotlib and Seaborn.',
  ],
  approach: [
    {
      index: '01',
      title: 'Build programming foundations',
      description:
        'Practising core syntax, memory concepts, algorithms, and data structures across C, C++, and Python.',
    },
    {
      index: '02',
      title: 'Practise through projects',
      description:
        'Turning coursework topics—like discrete structures, leaderboards, and simulations—into interactive working software.',
    },
    {
      index: '03',
      title: 'Explore data & AI/ML tooling',
      description:
        'Working with structured datasets, transformations, and visual analysis using NumPy, Pandas, Matplotlib, and Seaborn.',
    },
  ],
};

export const SKILLS_DATA: SkillItem[] = [
  {
    id: 'python',
    number: '01',
    name: 'Python Programming',
    category: 'Languages',
    focus: 'Core problem solving, scripting & data workflows',
    level: 'Coursework & Projects',
  },
  {
    id: 'c-lang',
    number: '02',
    name: 'C Programming',
    category: 'Languages',
    focus: 'Procedural logic, pointers & memory basics',
    level: 'Foundations',
  },
  {
    id: 'cpp',
    number: '03',
    name: 'C++ Foundations',
    category: 'Languages',
    focus: 'Object-oriented concepts & data structures',
    level: 'Foundations',
  },
  {
    id: 'html',
    number: '04',
    name: 'HTML',
    category: 'Web',
    focus: 'Semantic document structure & accessibility',
    level: 'Hands-on Practice',
  },
  {
    id: 'css',
    number: '05',
    name: 'CSS',
    category: 'Web',
    focus: 'Responsive layouts, typography & clean interfaces',
    level: 'Hands-on Practice',
  },
  {
    id: 'javascript',
    number: '06',
    name: 'JavaScript',
    category: 'Web',
    focus: 'Interactive DOM logic & browser visualizations',
    level: 'Projects',
  },
  {
    id: 'numpy-pandas',
    number: '07',
    name: 'NumPy & Pandas',
    category: 'AI / ML',
    focus: 'Array computation, tabular datasets & exploration',
    level: 'Exploring',
  },
  {
    id: 'matplotlib-seaborn',
    number: '08',
    name: 'Matplotlib & Seaborn',
    category: 'AI / ML',
    focus: 'Statistical charts, distributions & data storytelling',
    level: 'Exploring',
  },
  {
    id: 'aiml',
    number: '09',
    name: 'AI / ML Foundations',
    category: 'AI / ML',
    focus: 'Core machine learning concepts & experimentation',
    level: 'Beginner → Intermediate',
  },
  {
    id: 'problem-solving',
    number: '10',
    name: 'Problem Solving & DSA',
    category: 'Languages',
    focus: 'Discrete structures, trees, graphs, sorting & heaps',
    level: 'Progressing',
  },
];

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'arcadrank',
    index: '01',
    name: 'ARCADRANK',
    status: 'Completed',
    category: 'Web Application',
    summary:
      'A completed real-time leaderboard application with user accounts, game-score tracking and ranking updates.',
    details: [
      'Supports user account flows and persistent player profiles.',
      'Tracks submitted game scores and recalculates player rankings in real time.',
      'Built to practise end-to-end web application state and clean UI updates.',
    ],
    stack: ['Web Application', 'User Accounts', 'Real-Time Rankings'],
  },
  {
    id: 'evolution-arena',
    index: '02',
    name: 'EVOLUTION ARENA',
    status: 'Prototype',
    category: '3D Simulation',
    summary:
      'A learning project exploring simple digital creatures, movement, interaction and artificial evolution through simulation.',
    details: [
      'Models autonomous digital creatures inside a 3D environment.',
      'Explores movement rules, environment interactions, and generational selection.',
      'Designed as an experimental sandbox for simulation logic and visual feedback.',
    ],
    stack: ['3D Simulation', 'Autonomous Agents', 'Artificial Evolution'],
  },
  {
    id: 'dstl-visualizer',
    index: '03',
    name: 'DSTL VISUALIZER',
    status: 'Working Prototype',
    category: 'Academic Study Tool',
    summary:
      'A self-contained HTML, CSS and JavaScript study tool for discrete structures, logic and data structures, with editable examples and step-by-step visualizations.',
    details: [
      'Editable examples and animated, step-by-step walkthroughs built with vanilla HTML, CSS, and JavaScript.',
      'Covers discrete structures: relations and closure, truth tables, POSETs and Hasse diagrams, lattices, functions, Boolean algebra, and K-maps.',
      'Covers algorithms & data structures: graph algorithms, tree traversals, arrays, linked lists, stacks, queues, sorting, heaps, and recurrence relations.',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'Discrete Structures & DSA'],
  },
];

export const CONTACT_LINKS = {
  github: 'https://github.com/shahbaj-husain',
  linkedin: 'https://www.linkedin.com/in/shahbaj-husain-149743434/',
  email: 'shahbaj0042@gmail.com',
  locationNote: 'Open to learning, student collaborations and project discussions.',
  copyright: 'SHAHBAJ · B.TECH CSE · 2026',
};
