// Seed data for the demo. In production this lives in PostgreSQL (see PDF blueprint).
const Q = (q, o, a) => ({ q, o, a });

const SEED_COURSES = [
  { id: 'fsd', icon: '💻', title: 'Full Stack Web Development Program', duration: '6 months', level: 'Beginner → Job-ready',
    about: 'HTML, CSS, JavaScript, React, Node.js, databases and deployment with live projects.',
    roadmap: ['Level 0 · Computer & web basics', 'Level 1 · HTML, CSS, Git', 'Level 2 · JavaScript & React', 'Level 3 · Node, APIs, SQL', 'Level 4 · Capstone & deployment', 'Level 5 · Interview & placement prep'],
    modules: [
      { t: 'Web Foundations', v: [['How the web works', 18], ['HTML essentials', 32], ['CSS layout & Flexbox', 40]] },
      { t: 'JavaScript & React', v: [['JS fundamentals', 45], ['DOM & events', 30], ['React components & state', 55]] },
      { t: 'Backend & Deploy', v: [['Node & Express', 50], ['REST APIs + SQL', 48], ['Deploying to cloud', 25]] } ],
    questions: [
      Q('Which HTML tag creates a hyperlink?', ['<link>', '<a>', '<href>', '<url>'], 1),
      Q('Which CSS property controls flex item direction?', ['flex-direction', 'align-items', 'float', 'display-flow'], 0),
      Q('In React, which hook manages local state?', ['useRef', 'useEffect', 'useState', 'useMemo'], 2),
      Q('Which HTTP method is normally used to create a resource?', ['GET', 'POST', 'DELETE', 'HEAD'], 1),
      Q('What does SQL JOIN do?', ['Deletes rows', 'Combines rows from tables', 'Sorts rows', 'Creates indexes'], 1) ] },
  { id: 'devops', icon: '☁️', title: 'DevOps Certification Program with AWS and Azure', duration: '5 months', level: 'Intermediate',
    about: 'Linux, Git, Docker, Kubernetes, CI/CD, Terraform on AWS and Azure.',
    roadmap: ['Level 0 · Linux & networking basics', 'Level 1 · Git & scripting', 'Level 2 · Docker & CI/CD', 'Level 3 · Kubernetes & IaC', 'Level 4 · AWS + Azure projects', 'Level 5 · Certification prep'],
    modules: [
      { t: 'Foundations', v: [['Linux command line', 40], ['Git workflows', 35]] },
      { t: 'Containers & CI/CD', v: [['Docker deep dive', 50], ['GitHub Actions pipeline', 42]] },
      { t: 'Cloud', v: [['AWS core services', 60], ['Azure core services', 55], ['Terraform basics', 45]] } ],
    questions: [
      Q('Which command lists running Docker containers?', ['docker ps', 'docker ls -r', 'docker run', 'docker top -a'], 0),
      Q('CI/CD stands for?', ['Code Integration/Code Delivery', 'Continuous Integration/Continuous Delivery', 'Central Index/Central Deploy', 'None'], 1),
      Q('Which AWS service provides object storage?', ['EC2', 'RDS', 'S3', 'VPC'], 2),
      Q('Terraform is mainly used for?', ['Monitoring', 'Infrastructure as Code', 'Testing UI', 'Chat'], 1),
      Q('Kubernetes smallest deployable unit?', ['Node', 'Pod', 'Cluster', 'Service'], 1) ] },
  { id: 'ds', icon: '📊', title: 'Data Science and Data Analytics Program', duration: '6 months', level: 'Beginner → Intermediate',
    about: 'Python, statistics, SQL, Power BI, machine learning basics and business case studies.',
    roadmap: ['Level 0 · Excel & maths refresh', 'Level 1 · Python & SQL', 'Level 2 · Statistics & EDA', 'Level 3 · Visualization (Power BI)', 'Level 4 · ML models', 'Level 5 · Portfolio & interviews'],
    modules: [
      { t: 'Python & SQL', v: [['Python for data', 50], ['Pandas', 45], ['SQL queries', 40]] },
      { t: 'Analytics', v: [['Statistics essentials', 55], ['Power BI dashboards', 48]] },
      { t: 'Machine Learning', v: [['Regression & classification', 60], ['Model evaluation', 35]] } ],
    questions: [
      Q('Which library is used for dataframes in Python?', ['NumPy', 'Pandas', 'Flask', 'Pillow'], 1),
      Q('Mean of 2, 4, 6?', ['3', '4', '5', '6'], 1),
      Q('SQL clause to filter groups?', ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], 1),
      Q('Overfitting means model…', ['Fits training too well, generalizes poorly', 'Is too simple', 'Has no data', 'Is faster'], 0),
      Q('Best chart for trend over time?', ['Pie', 'Line', 'Scatter only', 'Table'], 1) ] },
  { id: 'de', icon: '🛠️', title: 'Data Engineering Program', duration: '5 months', level: 'Intermediate',
    about: 'SQL, Python, Spark, Airflow, data warehousing and cloud pipelines.',
    roadmap: ['Level 0 · SQL & Linux', 'Level 1 · Python ETL', 'Level 2 · Warehousing', 'Level 3 · Spark & Airflow', 'Level 4 · Cloud pipelines', 'Level 5 · Capstone'],
    modules: [
      { t: 'Core', v: [['Advanced SQL', 50], ['Python ETL', 45]] },
      { t: 'Big Data', v: [['Spark fundamentals', 60], ['Airflow orchestration', 48], ['Warehouse modelling', 42]] } ],
    questions: [
      Q('ETL stands for?', ['Extract Transform Load', 'Edit Test Launch', 'Export Trim Link', 'None'], 0),
      Q('Apache Airflow is used for?', ['Workflow orchestration', 'Image editing', 'Email', 'Hosting'], 0),
      Q('Star schema has a central…', ['Dimension table', 'Fact table', 'View', 'Index'], 1),
      Q('Spark processes data…', ['Only on single core', 'In distributed memory', 'Only in Excel', 'Offline paper'], 1),
      Q('Parquet is a…', ['Columnar file format', 'Database', 'Language', 'OS'], 0) ] },
  { id: 'aiml', icon: '🤖', title: 'AI and Machine Learning (AIML) Program', duration: '6 months', level: 'Intermediate → Advanced',
    about: 'Python, ML, deep learning, NLP, generative AI and deployment.',
    roadmap: ['Level 0 · Maths & Python', 'Level 1 · ML basics', 'Level 2 · Deep learning', 'Level 3 · NLP & GenAI', 'Level 4 · MLOps', 'Level 5 · Capstone'],
    modules: [
      { t: 'ML Core', v: [['Supervised learning', 55], ['Unsupervised learning', 45]] },
      { t: 'Deep Learning', v: [['Neural networks', 60], ['CNNs', 50], ['Transformers & GenAI', 65]] } ],
    questions: [
      Q('Which is supervised learning?', ['Clustering', 'Classification', 'PCA', 'K-means'], 1),
      Q('Activation function example?', ['ReLU', 'JOIN', 'GROUP', 'HTTP'], 0),
      Q('CNN is mostly used for?', ['Images', 'Billing', 'Emails only', 'Routing'], 0),
      Q('Gradient descent is used to…', ['Minimize loss', 'Store data', 'Draw UI', 'Encrypt'], 0),
      Q('LLM stands for?', ['Large Language Model', 'Long Logic Machine', 'Linear Layer Map', 'None'], 0) ] },
  { id: 'sap', icon: '🏢', title: 'SAP Certification Program', duration: '4 months', level: 'Beginner → Professional',
    about: 'SAP modules for finance, supply chain and business processes with certification prep.',
    roadmap: ['Level 0 · ERP & business basics', 'Level 1 · SAP navigation', 'Level 2 · Core module (FICO/MM/SD)', 'Level 3 · Configuration', 'Level 4 · Case projects', 'Level 5 · Certification'],
    modules: [
      { t: 'ERP Basics', v: [['What is ERP', 20], ['SAP navigation', 30]] },
      { t: 'Modules', v: [['Finance (FICO) basics', 55], ['Materials Management', 50], ['Sales & Distribution', 50]] } ],
    questions: [
      Q('ERP stands for?', ['Enterprise Resource Planning', 'Easy Record Printing', 'Entry Rate Plan', 'None'], 0),
      Q('SAP MM handles?', ['Materials Management', 'Marketing Media', 'Mail Merge', 'Mobile Money'], 0),
      Q('SAP SD relates to?', ['Sales & Distribution', 'System Design', 'Storage Disk', 'None'], 0),
      Q('FICO covers?', ['Finance & Controlling', 'Files & Icons', 'Flow & Code', 'None'], 0),
      Q('A purchase order is raised to…', ['Buy goods/services', 'Hire staff', 'Close books', 'Ship returns'], 0) ] },
  { id: 'cert', icon: '🎓', title: 'Comprehensive IT Certification Programs', duration: 'Flexible', level: 'All levels',
    about: 'Foundation to professional certification tracks in networking, cloud, security and programming.',
    roadmap: ['Level 0 · IT fundamentals', 'Level 1 · Networking', 'Level 2 · OS & Security', 'Level 3 · Cloud basics', 'Level 4 · Specialisation', 'Level 5 · Exam prep'],
    modules: [
      { t: 'IT Fundamentals', v: [['Hardware & OS', 35], ['Networking basics', 40]] },
      { t: 'Security & Cloud', v: [['Cyber security intro', 45], ['Cloud fundamentals', 40]] } ],
    questions: [
      Q('IP stands for?', ['Internet Protocol', 'Internal Port', 'Input Panel', 'None'], 0),
      Q('Which is an operating system?', ['Linux', 'Chrome', 'Python', 'HTML'], 0),
      Q('A firewall is used to…', ['Filter network traffic', 'Print', 'Cook', 'Edit video'], 0),
      Q('HTTPS adds…', ['Encryption', 'Speed only', 'Ads', 'Colors'], 0),
      Q('RAM is…', ['Volatile memory', 'Permanent disk', 'Network card', 'Monitor'], 0) ] }
];

// Common entry mock interview — same for every new student before counselling
const COMMON_Q = [
  Q('If 3 pens cost ₹45, what do 7 pens cost?', ['₹95', '₹105', '₹115', '₹125'], 1),
  Q('Series: 2, 6, 12, 20, ? ', ['28', '30', '32', '36'], 1),
  Q('Which is the best way to introduce yourself in an interview?', ['Read your resume aloud', 'Short story: who you are, skills, goal', 'Say you have no goals', 'Talk only about salary'], 1),
  Q('A computer "browser" is software to…', ['Print documents', 'View websites', 'Store power', 'Cool the CPU'], 1),
  Q('Choose the correct sentence.', ['He go to school.', 'He goes to school.', 'He going school.', 'He gone school.'], 1),
  Q('Which of these is a programming language?', ['Python', 'Pixel', 'Portal', 'Printer'], 0),
  Q('If all coders are learners and Riya is a coder, then Riya is…', ['A learner', 'Not a learner', 'A teacher', 'Unknown'], 0),
  Q('What matters most for a career in IT?', ['Continuous learning & practice', 'Memorising once', 'Avoiding projects', 'Waiting for luck'], 0),
  Q('25% of 480 =', ['100', '110', '120', '140'], 2),
  Q('A "bug" in software means…', ['A feature', 'An error', 'A virus only', 'A password'], 1)
];

const SEED_USERS = [
  { id: 'u_admin', role: 'admin', name: 'Admin Desk', email: 'admin@aptech.demo', pass: 'admin123', phone: '', createdAt: Date.now() - 86400000 * 90 },
  { id: 'u_support', role: 'admin', name: 'Support Counsellor', email: 'support@aptech.demo', pass: 'support123', phone: '', createdAt: Date.now() - 86400000 * 80 },
  { id: 'u_s1', role: 'student', name: 'Ananya Sahoo', email: 'ananya@demo.in', pass: 'demo123', phone: '9437000001', type: 'new', stage: 'enrolled', createdAt: Date.now() - 86400000 * 30,
    interest: { courseId: 'fsd', qual: 'B.Sc. Computer Science', college: 'Utkal University', year: '2025', goal: 'Get a web developer job', exp: 'Beginner' },
    review: { notes: 'Good logic skills. Needs coding foundation — start Level 0/1.', recommended: 'fsd', by: 'Support Counsellor', at: Date.now() - 86400000 * 28 }, git: { user: 'ananya-codes' } },
  { id: 'u_s2', role: 'student', name: 'Rahul Mishra', email: 'rahul@demo.in', pass: 'demo123', phone: '9437000002', type: 'new', stage: 'review', createdAt: Date.now() - 86400000 * 2,
    interest: { courseId: 'ds', qual: 'B.Tech Mechanical', college: 'CET Bhubaneswar', year: '2024', goal: 'Switch to data analytics', exp: 'Some Excel' }, git: null },
  { id: 'u_s3', role: 'student', name: 'Sneha Patra', email: 'sneha@demo.in', pass: 'demo123', phone: '9437000003', type: 'new', stage: 'assessment', createdAt: Date.now() - 86400000,
    interest: { courseId: 'aiml', qual: 'MCA (pursuing)', college: 'Ravenshaw', year: '2026', goal: 'AI engineer', exp: 'Python basics' }, git: null },
  { id: 'u_s4', role: 'student', name: 'Bikash Nayak', email: 'bikash@demo.in', pass: 'demo123', phone: '9437000004', type: 'existing', stage: 'enrolled', createdAt: Date.now() - 86400000 * 60,
    interest: { courseId: 'devops', qual: 'Diploma IT', college: 'Govt Polytechnic', year: '2023', goal: 'Cloud engineer', exp: 'Intermediate' },
    review: { notes: 'Strong. Fast-track.', recommended: 'devops', by: 'Admin Desk', at: Date.now() - 86400000 * 55 }, git: { user: 'bikash-ops' } }
];

const SEED_EXTRA = {
  enrollments: [
    { id: 'e1', uid: 'u_s1', courseId: 'fsd', at: Date.now() - 86400000 * 27, by: 'Support Counsellor', done: ['fsd-0-0', 'fsd-0-1', 'fsd-0-2', 'fsd-1-0'] },
    { id: 'e2', uid: 'u_s4', courseId: 'devops', at: Date.now() - 86400000 * 54, by: 'Admin Desk', done: ['devops-0-0', 'devops-0-1', 'devops-1-0'] },
    { id: 'e3', uid: 'u_s4', courseId: 'cert', at: Date.now() - 86400000 * 10, by: 'Admin Desk', done: [] }
  ],
  attempts: [
    { id: 'a1', uid: 'u_s1', type: 'common', score: 8, total: 10, at: Date.now() - 86400000 * 29 },
    { id: 'a2', uid: 'u_s1', type: 'fsd', score: 4, total: 5, at: Date.now() - 86400000 * 8 },
    { id: 'a3', uid: 'u_s2', type: 'common', score: 6, total: 10, at: Date.now() - 86400000 * 2 },
    { id: 'a4', uid: 'u_s4', type: 'common', score: 9, total: 10, at: Date.now() - 86400000 * 56 },
    { id: 'a5', uid: 'u_s4', type: 'devops', score: 3, total: 5, at: Date.now() - 86400000 * 5 }
  ],
  messages: [
    { id: 'm1', uid: 'u_s1', from: 'admin', mode: 'online', text: 'Welcome Ananya! Your Full Stack course is now active. Batch starts Monday 10 AM at our Bhubaneswar centre.', at: Date.now() - 86400000 * 27 },
    { id: 'm2', uid: 'u_s2', from: 'admin', mode: 'call', text: 'We will call you tomorrow 11 AM to discuss your mock result and course options.', at: Date.now() - 3600000 * 5 }
  ],
  log: [
    { id: 'l1', at: Date.now() - 3600000 * 5, text: 'Support Counsellor scheduled a call with Rahul Mishra' },
    { id: 'l2', at: Date.now() - 86400000 * 2, text: 'Rahul Mishra completed the common mock interview (6/10)' }
  ]
};
