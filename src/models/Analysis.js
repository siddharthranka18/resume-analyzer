const mongoose = require('mongoose');
const analysisSchema = new mongoose.Schema({
  filename: { type: String },
  aiAnalysis: {
    matchScore: Number,
    matchedSkills: [String],
    missingSkills: [String],
    strengths: [String],
    improvements: [String],
    summary: String
  },
  skillMatch: {
    resumeSkills: [String],
    jdSkills: [String],
    matchedSkills: [String],
    missingSkills: [String],
    matchPercentage: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);