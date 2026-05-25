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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'video-analysis': {
        const { name, role, skills, experience, bio } = data.profile || {}
        const prompt = `You are an AI human intelligence analyst. Analyze this person's profile and generate a comprehensive video resume analysis with realistic scores.

Person Profile:
- Name: ${name || 'Unknown'}
- Role: ${role || 'Unknown'}
- Skills: ${skills?.join(', ') || 'None listed'}
- Experience: ${experience || 'Unknown'}
- Bio: ${bio || 'No bio provided'}

Based on this profile, generate a realistic analysis as if they had submitted a video resume. Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "overallScore": <number 60-98>,
  "speechClarity": <number 55-98>,
  "confidence": <number 50-96>,
  "communication": <number 55-98>,
  "enthusiasm": <number 50-95>,
  "leadership": <number 45-95>,
  "eyeContact": <number 50-97>,
  "emotionalConsistency": <number 50-96>,
  "adaptability": <number 50-95>,
  "personalityInsights": [
    {"title": "<string>", "description": "<string>", "score": <number 60-98>},
    {"title": "<string>", "description": "<string>", "score": <number 60-98>},
    {"title": "<string>", "description": "<string>", "score": <number 60-98>},
    {"title": "<string>", "description": "<string>", "score": <number 60-98>}
  ],
  "personalitySummary": "<2-3 sentence summary>",
  "communicationStyle": "<brief style description>",
  "primaryTrait": "<main personality trait>"
}`

        const text = await getAIResponse(prompt, 0.7)
        let analysis = extractJSON(text)

        if (!analysis || typeof analysis.overallScore !== 'number') {
          analysis = generateFallbackVideoAnalysis(data.profile)
        }

        return NextResponse.json({ success: true, analysis })
      }

      case 'personality-radar': {
        const { profile, analysisData } = data || {}
        const prompt = `You are an AI personality analyst. Based on this person's profile and analysis data, generate a detailed personality radar.

Profile: ${JSON.stringify(profile || {})}
Analysis Data: ${JSON.stringify(analysisData || {})}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "personalityDimensions": {
    "leadership": <number 40-98>,
    "confidence": <number 40-98>,
    "creativity": <number 40-98>,
    "emotionalIntelligence": <number 40-98>,
    "adaptability": <number 40-98>,
    "collaboration": <number 40-98>,
    "pressureHandling": <number 40-98>
  }
}`

        const text = await getAIResponse(prompt, 0.6)
        let radarData = extractJSON(text)

        if (!radarData?.personalityDimensions) {
          radarData = {
            personalityDimensions: generateFallbackPersonalityDimensions(data.profile),
          }
        }

        return NextResponse.json({ success: true, radar: radarData })
      }

      case 'career-prediction': {
        const { profile, analysisData } = data || {}
        const prompt = `You are an AI career predictor. Based on this person's profile and analysis, predict career paths.

Profile: ${JSON.stringify(profile || {})}
Analysis Data: ${JSON.stringify(analysisData || {})}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "careerPredictions": [
    {"title": "<career title>", "match": <number 70-98>, "description": "<1 sentence>", "strengths": ["<strength1>", "<strength2>", "<strength3>"]},
    {"title": "<career title>", "match": <number 65-95>, "description": "<1 sentence>", "strengths": ["<strength1>", "<strength2>", "<strength3>"]},
    {"title": "<career title>", "match": <number 60-93>, "description": "<1 sentence>", "strengths": ["<strength1>", "<strength2>", "<strength3>"]}
  ]
}`

        const text = await getAIResponse(prompt, 0.7)
        let predictions = extractJSON(text)

        if (!predictions?.careerPredictions) {
          predictions = generateFallbackCareerPredictions(data.profile)
        }

        return NextResponse.json({ success: true, predictions })
      }

      case 'emotional-timeline': {
        const { profile, interviewMessages } = data || {}
        const userMessages = (interviewMessages || []).filter((m: { role: string }) => m.role === 'user')
        
        if (userMessages.length === 0) {
          return NextResponse.json({ success: true, timeline: [] })
        }

        const prompt = `You are an AI emotional intelligence analyst. Based on this person's profile and interview responses, generate an emotional timeline showing how their emotional state evolved during the interview.

Profile: ${JSON.stringify(profile || {})}
Interview Responses: ${JSON.stringify(userMessages.map((m: { text: string }) => m.text))}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "timeline": [
    ${userMessages.map((_: unknown, i: number) => `{"phase": "<phase name like Introduction/Experience/Leadership/Problem-Solving/Creativity/Cultural Fit/Closing>", "confidence": <number 40-98>, "engagement": <number 40-98>, "stress": <number 5-60>}`).join(',\n    ')}
  ]
}

Vary the scores realistically - confidence and engagement should generally increase as the interview progresses (but can dip), stress may spike during difficult questions then decrease. Make the data feel natural and human.`

        const text = await getAIResponse(prompt, 0.7)
        let timelineData = extractJSON(text)

        if (!timelineData?.timeline || !Array.isArray(timelineData.timeline)) {
          // Fallback: derive from analysis data
          const analysisData = data?.analysisData || {}
          const baseConf = analysisData.confidence || 70
          const baseEng = analysisData.communication || 65
          const baseStress = 100 - (analysisData.confidence || 70)
          
          const phaseNames = ['Introduction', 'Experience', 'Leadership', 'Problem-Solving', 'Creativity', 'Cultural Fit', 'Closing']
          timelineData = {
            timeline: userMessages.map((_: unknown, i: number) => ({
              phase: phaseNames[i % phaseNames.length],
              confidence: Math.min(98, Math.max(40, baseConf + (i * 2) - 5)),
              engagement: Math.min(98, Math.max(40, baseEng + (i * 3) - 3)),
              stress: Math.min(60, Math.max(5, baseStress - (i * 4) + 10)),
            }))
          }
        }

        return NextResponse.json({ success: true, timeline: timelineData.timeline })
      }

      case 'interview-analysis': {
        const { profile, messages, currentAnswer } = data || {}
        const prompt = `You are an AI interview analyst. Analyze this interview response in context.

Profile: ${JSON.stringify(profile || {})}
Interview Messages So Far: ${JSON.stringify(messages?.slice(-6) || [])}
Current Answer: ${currentAnswer || ''}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "confidence": <number 50-98>,
  "communication": <number 50-98>,
  "hesitation": <number 5-40>,
  "sentiment": "<Positive|Analytical|Engaged|Cautious>",
  "nextQuestion": "<a relevant follow-up interview question>"
}`

        const text = await getAIResponse(prompt, 0.6)
        let interviewAnalysis = extractJSON(text)

        if (!interviewAnalysis || typeof interviewAnalysis.confidence !== 'number') {
          interviewAnalysis = {
            confidence: 72,
            communication: 75,
            hesitation: 18,
            sentiment: 'Positive',
            nextQuestion: 'Can you tell me about a time you had to adapt to a significant change at work?',
          }
        }

        return NextResponse.json({ success: true, interview: interviewAnalysis })
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

function generateFallbackPersonalityDimensions(profile: Record<string, unknown>) {
  const skills = (profile?.skills as string[]) || []
  const experience = (profile?.experience as string) || '0-2'
  const expBonus = experience === '10+' ? 8 : experience === '6-10' ? 5 : experience === '3-5' ? 3 : 0
  const skillBonus = Math.min(skills.length, 5)
  const nameHash = ((profile?.name as string) || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0) % 10
  const base = 65

  return {
    leadership: Math.min(95, base + expBonus + (nameHash % 7)),
    confidence: Math.min(93, base + expBonus + (nameHash % 5)),
    creativity: Math.min(96, base + skillBonus + (nameHash % 8)),
    emotionalIntelligence: Math.min(94, base + (nameHash % 6)),
    adaptability: Math.min(92, base + skillBonus + (nameHash % 5)),
    collaboration: Math.min(90, base + (nameHash % 7)),
    pressureHandling: Math.min(91, base + expBonus + (nameHash % 6)),
  }
}

function generateFallbackVideoAnalysis(profile: Record<string, unknown>) {
  const name = (profile?.name as string) || 'Candidate'
  const skills = (profile?.skills as string[]) || []
  const experience = (profile?.experience as string) || '0-2'

  const expBonus = experience === '10+' ? 10 : experience === '6-10' ? 7 : experience === '3-5' ? 4 : 0
  const skillBonus = Math.min(skills.length * 2, 10)
  // Deterministic hash from profile name for consistent scores
  const nameHash = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const variation = nameHash % 8

  const base = 65
  const overall = Math.min(98, base + expBonus + skillBonus + variation)

  return {
    overallScore: overall,
    speechClarity: Math.min(98, base + expBonus + (nameHash % 12)),
    confidence: Math.min(96, base + expBonus + (nameHash % 10)),
    communication: Math.min(98, base + expBonus + skillBonus + (nameHash % 8)),
    enthusiasm: Math.min(95, base + (nameHash % 12)),
    leadership: Math.min(95, base + expBonus + (nameHash % 10)),
    eyeContact: Math.min(97, base + (nameHash % 11)),
    emotionalConsistency: Math.min(96, base + (nameHash % 10)),
    adaptability: Math.min(95, base + skillBonus + (nameHash % 8)),
    personalityInsights: [
      {
        title: 'Clear Communicator',
        description: `${name} demonstrates structured thinking and clear articulation of ideas`,
        score: Math.min(95, base + expBonus + (nameHash % 8)),
      },
      {
        title: 'Adaptable Professional',
        description: 'Shows flexibility and willingness to embrace new challenges',
        score: Math.min(92, base + skillBonus + (nameHash % 8)),
      },
      {
        title: 'Emotionally Balanced',
        description: 'Maintains composure and demonstrates emotional awareness',
        score: Math.min(90, base + (nameHash % 8)),
      },
      {
        title: 'Growth Oriented',
        description: 'Exhibits curiosity and commitment to continuous improvement',
        score: Math.min(88, base + (nameHash % 7)),
      },
    ],
    personalitySummary: `${name} presents a balanced professional profile with notable strengths in communication and adaptability. Their experience and skill set suggest strong potential for growth-oriented roles.`,
    communicationStyle: 'Structured and articulate with a collaborative approach',
    primaryTrait: 'Adaptable Communicator',
  }
}

function generateFallbackCareerPredictions(profile: Record<string, unknown>) {
  const role = (profile?.role as string) || 'Professional'
  const skills = (profile?.skills as string[]) || []

  return {
    careerPredictions: [
      {
        title: `Senior ${role}`,
        match: 88,
        description: `Strong alignment with senior ${role.toLowerCase()} responsibilities based on current skill set`,
        strengths: skills.length > 0 ? skills.slice(0, 3) : ['Leadership', 'Communication', 'Strategy'],
      },
      {
        title: 'Team Lead',
        match: 82,
        description: 'Natural leadership qualities suited for team management roles',
        strengths: ['Team Building', 'Mentoring', 'Project Management'],
      },
      {
        title: 'Product Strategist',
        match: 78,
        description: 'Strategic thinking and analytical capabilities well-suited for product roles',
        strengths: ['Strategic Planning', 'Data Analysis', 'Innovation'],
      },
    ],
  }
}
