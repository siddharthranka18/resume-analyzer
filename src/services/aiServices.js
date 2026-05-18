const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const analyzeResume = async (resumeText, jobDescription) => {
  const prompt = `
You are an expert HR analyst and resume reviewer.

Analyze the following resume against the job description and return a JSON response with this exact structure:
{
  "matchScore": <number 0-100>,
  "matchedSkills": [<list of skills found in both resume and JD>],
  "missingSkills": [<list of skills required in JD but missing from resume>],
  "strengths": [<list of strong points in the resume for this role>],
  "improvements": [<list of specific actionable improvements>],
  "summary": "<2-3 line overall assessment>"
}

Return ONLY the JSON. No explanation, no markdown, no extra text.

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
`;

  const response = await groq.chat.completions.create({
   model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: 'You are an expert HR analyst. Always respond with valid JSON only.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.3
  });

  const raw = response.choices[0].message.content;
  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    throw new Error('AI returned invalid JSON: ' + raw);
  }
};

module.exports = { analyzeResume };