// jobMatchScorer.js
import fs from 'fs';
import readline from 'readline-sync';
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getJobMatchScore(resumeText, jobDesc) {
  const prompt = `
You are an expert career advisor. Compare the following resume to the job description.
Give:
1. A match score out of 100
2. Key strengths
3. Missing skills or experience
4. Suggestions to improve the resume

Resume:
${resumeText}

Job Description:
${jobDesc}
`;

  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a professional career coach and resume reviewer.' },
      { role: 'user', content: prompt }
    ],
  });

  return res.choices[0].message.content;
}


export function parsePdfWithExtract(pdfPath) {
  return new Promise((resolve, reject) => {
    extract(pdfPath, { layout: 'raw' }, (err, pages) => {
      if (err) {
        reject(err);
      } else {
        // Join all pages into one text block
        resolve(pages.join('\n'));
      }
    });
  });
}

async function main() {
  console.log('📄 AI Job Match Scorer');

  // const resumePath = readline.question('Enter path to your resume (TXT or PDF converted to text): ');
  // const jobDescPath = readline.question('Enter path to the job description (text file): ');

  let resumeText, jobDesc;
  try {
    resumeText = fs.readFileSync('./resume.txt', 'utf-8');
    jobDesc = fs.readFileSync('./jobDescription.txt', 'utf-8');
  } catch (err) {
    console.error('❌ Failed to read file:', err.message);
    return;
  }

  console.log('\n🔍 Scoring...');
  const result = await getJobMatchScore(resumeText, jobDesc);
  console.log('\n✅ Result:\n');
  console.log(result);
}

main();
