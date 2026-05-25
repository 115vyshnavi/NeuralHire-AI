import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case 'video-analysis': {
        const analysis = {
          overallScore: 92,
          categories: {
            speechClarity: 94,
            confidence: 88,
            communication: 91,
            enthusiasm: 85,
            leadership: 79,
            eyeContact: 90,
            emotionalConsistency: 86,
            adaptability: 82,
          },
          insights: [
            {
              title: 'Natural Communicator',
              description: 'Demonstrates exceptional verbal clarity and structured thinking',
              score: 94,
            },
            {
              title: 'Confident Leader',
              description: 'Shows strong leadership indicators with decisive communication patterns',
              score: 88,
            },
            {
              title: 'Emotionally Balanced',
              description: 'Maintains emotional consistency with high adaptability under pressure',
              score: 86,
            },
            {
              title: 'Growth Mindset',
              description: 'Exhibits curiosity and openness to learning and development',
              score: 82,
            },
          ],
          personalitySummary:
            'The candidate exhibits strong communication skills with natural leadership potential. Their emotional balance and adaptability suggest readiness for challenging roles.',
        }
        return NextResponse.json({ success: true, analysis })
      }

      case 'personality-radar': {
        const radar = {
          dimensions: [
            { name: 'Leadership', value: 85 },
            { name: 'Confidence', value: 78 },
            { name: 'Creativity', value: 92 },
            { name: 'Emotional Intelligence', value: 88 },
            { name: 'Adaptability', value: 80 },
            { name: 'Collaboration', value: 75 },
            { name: 'Pressure Handling', value: 82 },
          ],
          summary:
            'The candidate exhibits a rare combination of creative innovation and emotional intelligence. Their leadership profile suggests natural authority balanced with empathy.',
        }
        return NextResponse.json({ success: true, radar })
      }

      case 'career-prediction': {
        const predictions = {
          careers: [
            {
              title: 'Chief Technology Officer',
              match: 94,
              description: 'Exceptional technical leadership combined with strategic vision',
              strengths: ['Technical Vision', 'Strategic Thinking', 'Innovation'],
              growth: '+28%',
            },
            {
              title: 'Product Strategy Lead',
              match: 89,
              description: 'Strong innovation mindset with cross-functional collaboration skills',
              strengths: ['Innovation', 'Collaboration', 'Strategy'],
              growth: '+22%',
            },
            {
              title: 'Startup Founder',
              match: 87,
              description: 'High risk tolerance with creative problem-solving and resilience',
              strengths: ['Risk-Taking', 'Creativity', 'Resilience'],
              growth: '+35%',
            },
          ],
          leadership: {
            score: 88,
            dimensions: {
              Vision: 90,
              DecisionMaking: 85,
              TeamBuilding: 82,
              Communication: 92,
              StrategicThinking: 88,
            },
          },
          management: {
            score: 82,
            dimensions: {
              TechnicalManagement: 88,
              PeopleManagement: 78,
              ProjectManagement: 85,
              InnovationManagement: 91,
            },
          },
        }
        return NextResponse.json({ success: true, predictions })
      }

      case 'interview-analysis': {
        const interview = {
          confidence: 82,
          communication: 88,
          hesitation: 15,
          sentiment: 'Positive',
          emotionalTimeline: [
            { phase: 'Introduction', confidence: 72, engagement: 65, stress: 30 },
            { phase: 'Experience', confidence: 78, engagement: 70, stress: 45 },
            { phase: 'Leadership', confidence: 85, engagement: 82, stress: 25 },
            { phase: 'Problem-Solving', confidence: 80, engagement: 75, stress: 55 },
            { phase: 'Creativity', confidence: 88, engagement: 90, stress: 20 },
            { phase: 'Cultural Fit', confidence: 82, engagement: 85, stress: 35 },
            { phase: 'Closing', confidence: 90, engagement: 88, stress: 15 },
          ],
        }
        return NextResponse.json({ success: true, interview })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown analysis type' },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
