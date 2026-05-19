const SKILLS_DATABASE = [
  // Frontend
  'react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'tailwind',
  'bootstrap', 'nextjs', 'redux', 'jquery',
  // Backend
  'node', 'nodejs', 'express', 'django', 'flask', 'fastapi', 'spring', 'laravel',
  'rest', 'graphql', 'websocket', 'socket.io',
  // Databases
  'mongodb', 'mysql', 'postgresql', 'redis', 'firebase', 'sqlite', 'dynamodb',
  // Cloud & DevOps
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'ci/cd', 'github actions', 'linux',
  // AI/ML
  'python', 'tensorflow', 'pytorch', 'langchain', 'openai', 'llm', 'machine learning',
  'deep learning', 'nlp', 'computer vision',
  // Tools
  'git', 'github', 'postman', 'jira', 'figma', 'vercel', 'render',
  // Concepts
  'oops', 'data structures', 'algorithms', 'system design', 'microservices',
  'event driven', 'agile', 'scrum', 'bullmq', 'queue', 'jwt', 'auth'
];

const extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  return SKILLS_DATABASE.filter(skill => lowerText.includes(skill.toLowerCase()));
};

const matchSkills = (resumeText, jobDescriptionText) => {
  const resumeSkills = extractSkills(resumeText);
  const jdSkills = extractSkills(jobDescriptionText);

  const matched = resumeSkills.filter(skill => jdSkills.includes(skill));
  const missing = jdSkills.filter(skill => !resumeSkills.includes(skill));

  const matchPercentage = jdSkills.length > 0
    ? Math.round((matched.length / jdSkills.length) * 100)
    : 0;

  return {
    resumeSkills,
    jdSkills,
    matchedSkills: matched,
    missingSkills: missing,
    matchPercentage
  };
};

module.exports = { matchSkills };