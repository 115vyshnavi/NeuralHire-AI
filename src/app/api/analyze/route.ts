import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

async function getAIResponse(prompt: string, temperature = 0.7): Promise<string> {
  try {
    const zai = await ZAI.create()
    const result = await zai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      temperature,
    })
    return result.choices?.[0]?.message?.content || ''
  } catch (error) {
    console.error('AI SDK error:', error)
    return ''
  }
}

function extractJSON(text: string): Record<string, unknown> | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null
  } catch {
    return null
  }
}

/**
 * Detects the candidate's professional domain based on their skills and role.
 * Returns a domain string and related topic keywords for question generation.
 */
function detectDomain(profile: { skills?: string[]; role?: string; experience?: string }): {
  domain: string
  domainDescription: string
  questionTopics: string[]
} {
  const skillsLower = (profile.skills || []).map(s => s.toLowerCase())
  const roleLower = (profile.role || '').toLowerCase()
  const expLower = (profile.experience || '').toLowerCase()
  const allText = [...skillsLower, roleLower, expLower].join(' ')

  // Frontend/Full-stack development
  const frontendKeywords = ['react', 'vue', 'angular', 'nextjs', 'next.js', 'typescript', 'javascript', 'css', 'html', 'tailwind', 'svelte', 'frontend', 'front-end', 'fullstack', 'full-stack', 'ui', 'component', 'redux', 'graphql', 'webpack', 'vite']
  if (frontendKeywords.some(kw => allText.includes(kw))) {
    return {
      domain: 'frontend-fullstack',
      domainDescription: 'Frontend/Full-stack Development',
      questionTopics: [
        'component architecture and reusability patterns',
        'state management strategies and when to use which',
        'performance optimization (rendering, bundle size, lazy loading)',
        'accessibility and inclusive design implementation',
        'frontend testing strategies and TDD',
        'responsive design and mobile-first architecture',
        'API integration patterns and error handling',
        'AI integration in user interfaces',
        'design system creation and maintenance',
        'micro-frontend architecture and scalability',
      ],
    }
  }

  // AI/ML/Data Science
  const aiKeywords = ['machine learning', 'ml', 'ai', 'deep learning', 'neural', 'nlp', 'natural language', 'computer vision', 'tensorflow', 'pytorch', 'data science', 'pandas', 'scikit', 'keras', 'gpt', 'llm', 'model training', 'data pipeline', 'analytics', 'statistical', 'regression', 'classification']
  if (aiKeywords.some(kw => allText.includes(kw))) {
    return {
      domain: 'ai-ml-data',
      domainDescription: 'AI/ML/Data Science',
      questionTopics: [
        'ML model lifecycle and production deployment',
        'data pipeline architecture and ETL design',
        'feature engineering and model selection strategies',
        'handling biased datasets and ethical AI considerations',
        'A/B testing and experiment design for ML systems',
        'LLM integration patterns and prompt engineering',
        'real-time vs batch inference trade-offs',
        'model monitoring and drift detection',
        'cross-functional collaboration between data and product teams',
        'translating business problems into ML problem statements',
      ],
    }
  }

  // Leadership/Management
  const leadershipKeywords = ['manager', 'director', 'lead', 'vp', 'head', 'chief', 'executive', 'leadership', 'management', 'team lead', 'c-suite', 'founder', 'co-founder', 'supervisor']
  if (leadershipKeywords.some(kw => allText.includes(kw))) {
    return {
      domain: 'leadership-management',
      domainDescription: 'Leadership/Management',
      questionTopics: [
        'team conflict resolution and mediation strategies',
        'decision making under pressure and uncertainty',
        'building and scaling high-performance teams',
        'stakeholder management and executive communication',
        'change management and organizational transformation',
        'mentoring and developing junior talent',
        'balancing technical debt with feature delivery',
        'cross-functional alignment and strategic planning',
        'handling underperforming team members',
        'fostering innovation culture within constraints',
      ],
    }
  }

  // Design/UX
  const designKeywords = ['design', 'ux', 'ui', 'figma', 'sketch', 'user research', 'wireframe', 'prototype', 'interaction', 'visual design', 'product design', 'usability', 'accessibility', 'design system', 'creative']
  if (designKeywords.some(kw => allText.includes(kw))) {
    return {
      domain: 'design-ux',
      domainDescription: 'Design/UX',
      questionTopics: [
        'design process from research to delivery',
        'balancing user needs with business requirements',
        'design system governance and evolution',
        'handling design feedback and critique',
        'accessibility-first design methodology',
        'user research methods and synthesis',
        'cross-functional collaboration with engineering',
        'measuring design impact and outcomes',
        'prototyping and iterative design validation',
        'designing for diverse user populations',
      ],
    }
  }

  // Backend/DevOps
  const backendKeywords = ['python', 'java', 'go', 'rust', 'node', 'backend', 'back-end', 'api', 'microservice', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'devops', 'ci/cd', 'terraform', 'database', 'sql', 'nosql', 'redis', 'kafka', 'distributed', 'infrastructure', 'serverless']
  if (backendKeywords.some(kw => allText.includes(kw))) {
    return {
      domain: 'backend-devops',
      domainDescription: 'Backend/DevOps',
      questionTopics: [
        'system design and architecture patterns',
        'database optimization and query performance',
        'microservices vs monolith trade-offs',
        'CI/CD pipeline design and reliability',
        'infrastructure as code and automation',
        'scalability strategies and load handling',
        'security best practices and threat modeling',
        'observability and monitoring in production',
        'incident response and post-mortem culture',
        'API design principles and versioning strategies',
      ],
    }
  }

  // General/Other
  return {
    domain: 'general',
    domainDescription: 'General/Other',
    questionTopics: [
      'problem-solving approach and methodology',
      'adaptability to new technologies and domains',
      'collaboration and teamwork strategies',
      'time management and prioritization',
      'continuous learning and professional development',
      'communication with technical and non-technical stakeholders',
      'handling ambiguity and incomplete requirements',
      'delivering results under tight deadlines',
      'giving and receiving constructive feedback',
      'career growth and skill development planning',
    ],
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'video-analysis': {
        // DEPRECATED: Video analysis now goes through /api/analyze-video
        // which actually validates the video and uses VLM for real analysis
        return NextResponse.json({
          success: false,
          error: 'Video analysis now requires actual video upload. Please use the video upload feature.',
        })
      }

      case 'personality-radar': {
        const { profile, analysisData } = data || {}
        if (!profile || !analysisData) {
          return NextResponse.json(
            { success: false, error: 'Profile and analysis data required for personality radar.' },
            { status: 400 }
          )
        }

        const prompt = `You are a senior AI personality analyst with expertise in organizational psychology and behavioral assessment. You must generate a HIGHLY VARIED and INDIVIDUALIZED personality radar based on the candidate's actual data.

CRITICAL: You MUST produce significantly different results for different candidates. Do NOT default to mid-range scores. If someone has low confidence from their video analysis, their personality radar must reflect that — leadership should be low, pressure handling should be low, confidence must be low. If someone has high enthusiasm and leadership, their scores should be genuinely high. NEVER give a safe, generic "all 60-75" profile to everyone.

Profile: ${JSON.stringify(profile)}
Analysis Data: ${JSON.stringify(analysisData)}

Carefully derive each dimension from the actual data:
- If analysisData.confidence is low (e.g. 45), then personalityDimensions.confidence should also be low (35-55)
- If analysisData.leadership is high (e.g. 88), then personalityDimensions.leadership should be high (75-95)
- creativity should be inferred from their skills and role — a designer or artist should score higher than an accountant
- emotionalIntelligence should connect to emotionalConsistency and adaptability scores
- collaboration should reflect their communication and adaptability, not just be randomly assigned
- pressureHandling should be the INVERSE of nervousness — if nervousness is high, pressureHandling must be low

Return ONLY valid JSON (no markdown, no code blocks):
{
  "personalityDimensions": {
    "leadership": <number 15-98>,
    "confidence": <number 15-98>,
    "creativity": <number 15-98>,
    "emotionalIntelligence": <number 15-98>,
    "adaptability": <number 15-98>,
    "collaboration": <number 15-98>,
    "pressureHandling": <number 15-98>
  }
}

Be brutally honest. Scores should be WIDELY distributed, not clustered around 60-70.`

        const text = await getAIResponse(prompt, 0.6)
        let radarData = extractJSON(text)

        if (!radarData?.personalityDimensions) {
          return NextResponse.json({
            success: false,
            error: 'AI personality analysis failed. Please try again.',
          })
        }

        return NextResponse.json({ success: true, radar: radarData })
      }

      case 'career-prediction': {
        const { profile, analysisData } = data || {}
        if (!profile || !analysisData) {
          return NextResponse.json(
            { success: false, error: 'Profile and analysis data required for career predictions.' },
            { status: 400 }
          )
        }

        const prompt = `You are a senior AI career strategist with deep expertise in talent assessment and career trajectory prediction. You must generate HIGHLY PERSONALIZED and VARIED career predictions.

CRITICAL: Different candidates should get VERY different career predictions. Do NOT give everyone "Senior Developer" or "Product Manager". A nervous candidate with low leadership should NOT be recommended for management roles. A highly creative designer should NOT be steered toward DevOps. Base predictions STRONGLY on actual scores — if leadership is 30, don't recommend "Engineering Manager". If confidence is 85 and communication is 90, DO recommend client-facing or leadership roles.

Profile: ${JSON.stringify(profile)}
Analysis Data: ${JSON.stringify(analysisData)}

Match percentages must reflect genuine alignment:
- If the candidate's skills AND personality align with a role: 75-95% match
- If only skills align but personality doesn't: 50-65% match
- If neither aligns well: 35-50% match

Return ONLY valid JSON (no markdown, no code blocks):
{
  "careerPredictions": [
    {"title": "<highly specific career title, NOT generic>", "match": <number 35-98>, "description": "<1 sentence explaining WHY this role fits their specific profile>", "strengths": ["<strength1 tied to their actual data>", "<strength2 tied to their actual data>", "<strength3 tied to their actual data>"]},
    {"title": "<highly specific career title>", "match": <number 30-95>, "description": "<1 sentence>", "strengths": ["<strength1>", "<strength2>", "<strength3>"]},
    {"title": "<highly specific career title>", "match": <number 25-93>, "description": "<1 sentence>", "strengths": ["<strength1>", "<strength2>", "<strength3>"]}
  ]
}

Predictions must be DIVERSE — don't give three variations of the same role. If they're in AI, give them one AI-adjacent role, one that leverages their personality differently, and one stretch role.`

        const text = await getAIResponse(prompt, 0.7)
        let predictions = extractJSON(text)

        if (!predictions?.careerPredictions) {
          return NextResponse.json({
            success: false,
            error: 'AI career prediction failed. Please try again.',
          })
        }

        return NextResponse.json({ success: true, predictions })
      }

      case 'interview-start': {
        const { profile: startProfile } = data || {}
        if (!startProfile || !startProfile.name) {
          return NextResponse.json(
            { success: false, error: 'Profile data required to generate personalized interview.' },
            { status: 400 }
          )
        }

        const startDomainInfo = detectDomain(startProfile)

        const startPrompt = `You are an elite AI interviewer for NeuralHire. You must generate a PERSONALIZED opening interview question based on the candidate's profile.

CRITICAL: The first question MUST be specific to their domain and skills. Do NOT ask a generic behavioral question. Every candidate should get a DIFFERENT opening question based on their background.

Candidate Profile: ${JSON.stringify(startProfile)}
Domain Detected: ${startDomainInfo.domainDescription}
Relevant Topics: ${startDomainInfo.questionTopics.slice(0, 4).join(', ')}

Requirements:
- If the candidate has ${startDomainInfo.domain === 'frontend-fullstack' ? 'React/frontend skills: ask about frontend architecture, component design, or UI performance' : startDomainInfo.domain === 'ai-ml-data' ? 'data science/ML skills: ask about ML concepts, model deployment, or data pipeline design' : startDomainInfo.domain === 'leadership-management' ? 'leadership experience: ask about team management, decision-making, or scaling teams' : startDomainInfo.domain === 'design-ux' ? 'design skills: ask about design process, user research methodology, or design systems' : startDomainInfo.domain === 'backend-devops' ? 'backend/DevOps skills: ask about system design, scalability, or infrastructure challenges' : 'professional experience: ask about problem-solving approach or project challenges'}
- Make it a SCENARIO-BASED question that tests depth, not just "tell me about yourself"
- Use their NAME in the greeting
- Keep it conversational but professional
- Include context about WHY you're asking this specific question ("Given your expertise in...")

Return ONLY valid JSON (no markdown, no code blocks):
{
  "openingQuestion": "<personalized opening question with greeting>",
  "detectedDomain": "${startDomainInfo.domainDescription}",
  "domainEmoji": "<single emoji representing the domain, e.g. 🎯 for frontend, 🧠 for AI/ML, 👑 for leadership, 🎨 for design, ⚙️ for backend, 💼 for general>"
}`

        const startText = await getAIResponse(startPrompt, 0.7)
        let startResult = extractJSON(startText)

        if (!startResult?.openingQuestion) {
          return NextResponse.json({
            success: false,
            error: 'Failed to generate personalized interview question. Please try again.',
          })
        }

        return NextResponse.json({
          success: true,
          interviewStart: {
            openingQuestion: startResult.openingQuestion as string,
            detectedDomain: (startResult.detectedDomain as string) || startDomainInfo.domainDescription,
            domainEmoji: (startResult.domainEmoji as string) || '🎯',
          },
        })
      }

      case 'emotional-timeline': {
        const { profile, interviewMessages } = data || {}
        const userMessages = (interviewMessages || []).filter((m: { role: string }) => m.role === 'user')

        if (userMessages.length === 0) {
          return NextResponse.json({ success: true, timeline: [] })
        }

        const prompt = `You are an expert AI emotional intelligence analyst specializing in interview behavioral analysis. You must generate a HIGHLY VARIED emotional timeline that reflects the ACTUAL emotional journey of the candidate through the interview.

CRITICAL: Different candidates should show VERY different emotional patterns. A nervous candidate should have high stress scores (40-70), high nervousness (45-80), and lower confidence (30-55). A confident candidate should have low stress (5-25), low nervousness (5-20), and high confidence (70-95). Do NOT give everyone the same "gradually improving" narrative — some people start strong and fade, others get more comfortable over time, some stay consistently nervous or confident.

Profile: ${JSON.stringify(profile || {})}
Interview Responses: ${JSON.stringify(userMessages.map((m: { text: string }) => m.text))}

Analyze the ACTUAL content and tone of each response:
- Short, vague answers suggest low engagement and possibly low confidence
- Detailed, enthusiastic answers suggest high engagement
- Defensive or cautious language suggests stress AND high nervousness
- Confident, structured answers suggest composure AND low nervousness
- Technical jargon without explanation might suggest nervous overcompensation
- Personal anecdotes suggest comfort and engagement
- Hesitation markers ("um", "I think", "maybe") suggest high nervousness
- Fidgeting or unclear answers suggest nervousness

Return ONLY valid JSON (no markdown, no code blocks):
{
  "timeline": [
    ${userMessages.map((_: unknown, i: number) => `{"phase": "<specific phase name like Introduction/Technical Deep-Dive/Leadership/Problem-Solving/Cultural Fit/Closing — NOT generic>", "confidence": <number 15-98>, "engagement": <number 15-98>, "stress": <number 5-75>, "nervousness": <number 5-85>}`).join(',\n    ')}
  ]
}

Vary scores DRAMATICALLY between phases if the candidate's responses warrant it. A strong technical answer followed by a weak leadership answer should show a clear confidence dip and stress spike AND nervousness increase.`

        const text = await getAIResponse(prompt, 0.7)
        let timelineData = extractJSON(text)

        if (!timelineData?.timeline || !Array.isArray(timelineData.timeline)) {
          return NextResponse.json({
            success: false,
            error: 'AI emotional timeline generation failed. Please try again.',
          })
        }

        // Ensure each timeline entry has a nervousness field
        const validatedTimeline = (timelineData.timeline as Array<Record<string, unknown>>).map((entry) => ({
          phase: entry.phase || 'Unknown',
          confidence: typeof entry.confidence === 'number' ? Math.min(100, Math.max(0, entry.confidence)) : 50,
          engagement: typeof entry.engagement === 'number' ? Math.min(100, Math.max(0, entry.engagement)) : 50,
          stress: typeof entry.stress === 'number' ? Math.min(100, Math.max(0, entry.stress)) : 30,
          nervousness: typeof entry.nervousness === 'number' ? Math.min(100, Math.max(0, entry.nervousness)) : Math.min(85, Math.max(5, (typeof entry.stress === 'number' ? entry.stress : 30) + 5)),
        }))

        return NextResponse.json({ success: true, timeline: validatedTimeline })
      }

      case 'interview-analysis': {
        const { profile, messages, currentAnswer } = data || {}
        if (!currentAnswer) {
          return NextResponse.json(
            { success: false, error: 'No answer provided for analysis.' },
            { status: 400 }
          )
        }

        // Detect the candidate's domain from their profile
        const domainInfo = detectDomain(profile || {})

        // Extract previous user answers for context
        const previousAnswers = (messages || [])
          .filter((m: { role: string }) => m.role === 'user')
          .map((m: { text: string }) => m.text)

        // Select question topics relevant to the interview progress
        const topicIndex = Math.min(previousAnswers.length, domainInfo.questionTopics.length - 1)
        const currentTopic = domainInfo.questionTopics[topicIndex]
        const nextTopic = domainInfo.questionTopics[Math.min(topicIndex + 1, domainInfo.questionTopics.length - 1)]

        const prompt = `You are an elite AI interview analyst and domain expert in ${domainInfo.domainDescription}. You must analyze this interview response in context and generate a DYNAMIC, PROFILE-BASED follow-up question.

CRITICAL INSTRUCTIONS FOR SCORING — You MUST produce significantly different scores for different candidates:
- A nervous, hesitant answer should get confidence 25-50, hesitation 30-60, nervousness 50-80
- A confident, articulate answer should get confidence 75-95, hesitation 5-15, nervousness 5-20
- NEVER give generic mid-range scores. Be brutally honest.

DOMAIN: ${domainInfo.domainDescription}
This candidate works in ${domainInfo.domainDescription}. Their next question MUST be SPECIFIC to this domain, NOT generic.

Candidate Profile: ${JSON.stringify(profile || {})}
Domain Detected: ${domainInfo.domainDescription}
Relevant Topic Areas: ${domainInfo.questionTopics.join(', ')}
Previous Interview Answers: ${JSON.stringify(previousAnswers.slice(-4))}
Current Answer: ${currentAnswer}

ANALYSIS REQUIREMENTS:
1. Score confidence based on how ASSURED the response sounds. Hesitant language ("I think maybe", "sort of", "kind of") = LOW confidence. Definitive statements with examples = HIGH confidence.
2. Score communication based on STRUCTURE and CLARITY. Rambling = low. Organized, concise = high.
3. Score hesitation based on actual indicators — hedging, qualifiers, uncertainty, deflecting.
4. Score nervousness based on: filler words ("um", "uh", "like"), hedging language, self-correction, tangents, overly short or overly long responses, lack of specific examples, defensive tone. A truly nervous candidate should score 55-85. A composed candidate should score 5-25.
5. Sentiment must be specific and honest — not just "Positive" for everyone.

NEXT QUESTION REQUIREMENTS:
The nextQuestion MUST be:
- SPECIFIC to ${domainInfo.domainDescription}, NOT a generic interview question
- Related to the topic: "${currentTopic}" or advancing to "${nextTopic}"
- Building on their previous answers — if they mentioned a specific project, ask deeper about it
- Challenging enough to test depth of knowledge
- Different for every candidate based on their profile and responses

Example domain-specific questions:
${domainInfo.domain === 'frontend-fullstack' ? '- "How would you optimize a React component that re-renders excessively in a real-time data dashboard?"\n- "Describe your approach to implementing a design system that scales across multiple product teams."' : ''}
${domainInfo.domain === 'ai-ml-data' ? '- "How would you handle a production ML model that shows significant drift over the past month?"\n- "Walk me through how you would design an A/B testing framework for an ML recommendation system."' : ''}
${domainInfo.domain === 'leadership-management' ? '- "Tell me about a time you had to make a difficult decision with incomplete information. What was your framework?"\n- "How do you handle a situation where two senior engineers on your team fundamentally disagree on architecture?"' : ''}
${domainInfo.domain === 'design-ux' ? '- "How do you validate that your design solution actually solves the user problem you identified?"\n- "Walk me through how you would redesign a complex enterprise workflow that current users find confusing."' : ''}
${domainInfo.domain === 'backend-devops' ? '- "How would you design a system that needs to handle 10x traffic spikes during peak hours?"\n- "Walk me through your incident response process when a critical production service goes down."' : ''}
${domainInfo.domain === 'general' ? '- "Tell me about a time you had to quickly learn a completely new technology or domain to deliver a project."\n- "How do you prioritize competing demands when everything seems urgent?"' : ''}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "confidence": <number 15-98>,
  "communication": <number 15-98>,
  "hesitation": <number 5-70>,
  "nervousness": <number 5-85>,
  "sentiment": "<Positive|Analytical|Engaged|Cautious|Nervous|Defensive|Enthusiastic|Measured>",
  "nextQuestion": "<a SPECIFIC follow-up question tailored to their domain (${domainInfo.domainDescription}), their profile, and their previous answers>",
  "detectedDomain": "${domainInfo.domainDescription}",
  "sentimentAnalysis": {
    "sentimentTrend": "<improving|stable|declining>",
    "emotionalState": "<specific description of their current emotional state, e.g. 'Growing more confident as they discuss familiar territory' or 'Noticeably nervous when discussing leadership scenarios'>"
  }
}`

        const text = await getAIResponse(prompt, 0.6)
        let interviewAnalysis = extractJSON(text)

        if (!interviewAnalysis || typeof interviewAnalysis.confidence !== 'number') {
          return NextResponse.json({
            success: false,
            error: 'AI interview analysis failed. Please try again.',
          })
        }

        // Ensure sentimentAnalysis exists
        if (!interviewAnalysis.sentimentAnalysis) {
          interviewAnalysis.sentimentAnalysis = {
            sentimentTrend: 'stable',
            emotionalState: 'Neutral — unable to determine specific emotional state',
          }
        }

        // Ensure nervousness exists
        if (typeof interviewAnalysis.nervousness !== 'number') {
          interviewAnalysis.nervousness = Math.min(85, Math.max(5, typeof interviewAnalysis.hesitation === 'number' ? interviewAnalysis.hesitation + 5 : 35))
        }

        // Ensure detectedDomain exists
        if (!interviewAnalysis.detectedDomain) {
          interviewAnalysis.detectedDomain = domainInfo.domainDescription
        }

        // Clamp nervousness
        interviewAnalysis.nervousness = Math.min(100, Math.max(0, Math.round(interviewAnalysis.nervousness as number)))

        return NextResponse.json({ success: true, interview: interviewAnalysis })
      }

      case 'skill-assessment': {
        const { profile, aptitudeAnswers, communicationAnswers, behavioralAnswers } = data || {}

        if (!aptitudeAnswers || !communicationAnswers || !behavioralAnswers) {
          return NextResponse.json(
            { success: false, error: 'All assessment answers are required.' },
            { status: 400 }
          )
        }

        // Calculate base aptitude score from correct answers
        const correctAptitude = (aptitudeAnswers as Array<{ isCorrect: boolean }>).filter(
          (a: { isCorrect: boolean }) => a.isCorrect
        ).length
        const totalAptitude = (aptitudeAnswers as unknown[]).length
        const aptitudeBase = Math.round((correctAptitude / Math.max(totalAptitude, 1)) * 100)

        const prompt = `You are an expert AI skill assessor specializing in evaluating candidate aptitude, communication, and behavioral competencies. Analyze the candidate's assessment answers and generate detailed skill scores.

CRITICAL SCORING RULES:
- You MUST produce VARIED scores based on the ACTUAL quality of answers, NOT generic mid-range scores
- The candidate got ${correctAptitude} out of ${totalAptitude} aptitude questions correct (${aptitudeBase}%)
- Their aptitude base score should be around ${aptitudeBase}, but can vary ±15 based on the difficulty of questions they got right/wrong
- For communication: someone who always picks "discuss privately" is collaborative (70-90), someone who picks "confront" is aggressive (35-55), someone who picks "avoid" is passive (25-45)
- For behavioral: someone who picks proactive, honest, and collaborative options should score HIGH (75-95). Someone who picks passive, defensive, or avoidant options should score LOW (25-50)
- The overall score should be a weighted average: 35% aptitude, 30% communication, 35% problem-solving

Candidate Profile: ${JSON.stringify(profile || {})}
Aptitude Answers: ${JSON.stringify(aptitudeAnswers)}
Communication Answers: ${JSON.stringify(communicationAnswers)}
Behavioral Answers: ${JSON.stringify(behavioralAnswers)}

Analyze EACH answer carefully:
- For communication options: "Discuss privately and find common ground" = best, "Listen actively" = good, "Confront directly" = poor, "Avoid" = worst, "Report to manager immediately" = poor
- For behavioral options: "Own up immediately" = best, "Have honest conversation" = best, "Make a list and prioritize" = best, "Try to cover it up" = worst, "Blame external factors" = worst, "Get upset" = worst
- For aptitude: count correct answers but also consider the CATEGORY — logical reasoning correct = higher problem-solving, numerical correct = higher analytical ability

Return ONLY valid JSON (no markdown, no code blocks):
{
  "aptitude": <number 10-98, base around ${aptitudeBase} ±15>,
  "communication": <number 10-98, based on their scenario answer quality>,
  "problemSolving": <number 10-98, derived from aptitude + behavioral patterns>,
  "overall": <number 10-98, weighted: 35% aptitude + 30% communication + 35% problemSolving>
}

Be honest and varied. A candidate who avoids all conflicts and covers up mistakes should get LOW scores. A candidate who communicates proactively and owns mistakes should get HIGH scores.`

        const text = await getAIResponse(prompt, 0.5)
        let skillData = extractJSON(text)

        if (!skillData || typeof skillData.aptitude !== 'number') {
          // Fallback: use computed aptitude base and reasonable defaults
          const commScore = Math.min(98, Math.max(15, aptitudeBase + Math.round((Math.random() - 0.3) * 20)))
          const psScore = Math.min(98, Math.max(15, aptitudeBase + Math.round((Math.random() - 0.2) * 15)))
          skillData = {
            aptitude: Math.min(98, Math.max(10, aptitudeBase)),
            communication: commScore,
            problemSolving: psScore,
            overall: Math.min(98, Math.max(10, Math.round(aptitudeBase * 0.35 + commScore * 0.3 + psScore * 0.35))),
          }
        }

        // Clamp all values to 0-100
        const clamp = (v: number) => Math.min(100, Math.max(0, Math.round(v)))
        const scores = {
          aptitude: clamp(skillData.aptitude as number),
          communication: clamp(skillData.communication as number),
          problemSolving: clamp(skillData.problemSolving as number),
          overall: clamp(skillData.overall as number),
        }

        return NextResponse.json({ success: true, scores })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown analysis type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Analysis API error:', error)
    return NextResponse.json(
      { success: false, error: 'Analysis request failed' },
      { status: 500 }
    )
  }
}
