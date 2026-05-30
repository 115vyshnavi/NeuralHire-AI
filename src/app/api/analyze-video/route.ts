import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// This API route ACTUALLY analyzes video frames using VLM (Vision Language Model)
// It validates whether the video is a genuine resume/interview video
// and ONLY returns analysis if it's valid

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
    const { frames, profile } = body as {
      frames: string[] // base64 encoded video frames
      profile: { name: string; role: string; skills: string[]; experience: string; bio: string }
    }

    if (!frames || frames.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No video frames provided. Please upload a valid video file.' },
        { status: 400 }
      )
    }

    // Use only up to 3 frames to stay within API limits
    const framesToAnalyze = frames.slice(0, 3)

    const zai = await ZAI.create()

    // Step 1: VALIDATE — Is this a video resume/interview?
    const validationMessages = [
      {
        role: 'system' as const,
        content: 'You are an AI that validates video resumes. You must determine if the provided video frames show a person presenting themselves professionally (like a video resume, job interview, or professional introduction). Be strict — a music video, gameplay, nature video, cartoon, empty/blank video, or any non-personal-presentation content should be rejected. You must respond with valid JSON only, no markdown.',
      },
      {
        role: 'user' as const,
        content: [
          {
            type: 'text' as const,
            text: 'Analyze these video frames from an uploaded file. Is this a video resume or professional introduction where a person is presenting themselves? Respond with JSON: { "isValidResume": boolean, "reason": "explanation of why it is or isn\'t valid", "detectedContent": "what you actually see in the video" }',
          },
          ...framesToAnalyze.map(
            (frame) =>
              ({
                type: 'image_url' as const,
                image_url: { url: frame.startsWith('data:') ? frame : `data:image/jpeg;base64,${frame}` },
              }) as const
          ),
        ],
      },
    ]

    let validationResult: { isValidResume: boolean; reason: string; detectedContent: string } | null = null

    try {
      // Use createVision so the model can actually SEE the video frames
      const validationResponse = await zai.chat.completions.createVision({
        messages: validationMessages as any,
        temperature: 0.3,
        thinking: { type: 'disabled' },
      })

      const validationText = validationResponse.choices?.[0]?.message?.content || ''
      const parsed = extractJSON(validationText)
      if (parsed && typeof parsed.isValidResume === 'boolean') {
        validationResult = {
          isValidResume: parsed.isValidResume as boolean,
          reason: (parsed.reason as string) || 'Unknown reason',
          detectedContent: (parsed.detectedContent as string) || 'Content not identified',
        }
      }
    } catch (error) {
      console.error('Validation VLM error:', error)
    }

    // If validation failed or determined it's NOT a resume video
    if (!validationResult) {
      return NextResponse.json({
        success: false,
        error: 'Unable to validate video content. The AI vision service may be temporarily unavailable. Please try again.',
        errorType: 'VALIDATION_UNAVAILABLE',
      })
    }

    if (!validationResult.isValidResume) {
      return NextResponse.json({
        success: false,
        error: `This doesn't appear to be a video resume. Detected: ${validationResult.detectedContent}. ${validationResult.reason}. Please upload a video where you are presenting yourself professionally, speaking to the camera about your experience and skills.`,
        errorType: 'INVALID_VIDEO',
        detectedContent: validationResult.detectedContent,
      })
    }

    // Step 2: ANALYZE — The video IS a valid resume. Now analyze it deeply.
    const analysisMessages = [
      {
        role: 'system' as const,
        content: `You are an elite AI human intelligence analyst specializing in video resume and interview analysis. You have been trained by top behavioral psychologists, executive coaches, and hiring managers. Your analysis must be granular, behavior-focused, and brutally honest.

You MUST produce significantly different scores for different candidates. A nervous candidate should score 40-65 on confidence, while a confident candidate should score 75-95. NEVER give generic mid-range scores to everyone. Be brutally honest — if someone looks nervous, score them low on confidence. If someone looks commanding, score them high on leadership.

You analyze micro-behaviors visible in video frames:
- Speaking confidence: posture, eye contact direction and stability, vocal projection cues (mouth openness, chin position, head tilt)
- Hesitation indicators: pauses visible in mouth position, filler word mouth shapes ("um", "uh"), nervous hand gestures, throat touching, hair adjusting
- Communication clarity: articulation precision visible in mouth movements, structure and pacing of speech (can be inferred from head movement patterns and gesture rhythm)
- Emotional consistency: mood stability across frames — do they shift from smiling to tense? From relaxed to stiff?
- Speaking speed and rhythm: rapid mouth movements and gesturing suggest fast speech; slow, deliberate movements suggest measured speech
- Leadership signals: commanding posture (straight back, squared shoulders), authority in voice (chin slightly raised, steady gaze), controlled gestures
- Nervousness indicators: fidgeting, avoiding camera, tense facial expressions, lip biting, excessive blinking, rigid body posture, self-soothing gestures
- Filler words estimation: based on visible mouth shapes that suggest "um", "uh", "like", "you know" patterns
- Adaptability signals: relaxed transitions between expressions, open body language, natural gesture flow

Return ONLY valid JSON, no markdown or code blocks.`,
      },
      {
        role: 'user' as const,
        content: [
          {
            type: 'text' as const,
            text: `Perform an exhaustive behavioral analysis of this video resume. The candidate's profile:
- Name: ${profile?.name || 'Unknown'}
- Role: ${profile?.role || 'Not specified'}
- Skills: ${profile?.skills?.join(', ') || 'Not listed'}
- Experience: ${profile?.experience || 'Not specified'}
- Bio: ${profile?.bio || 'Not provided'}

CRITICAL INSTRUCTION: You MUST produce significantly different scores for different candidates. A nervous candidate should score 40-65 on confidence, while a confident candidate should score 75-95. NEVER give generic mid-range scores to everyone. Be brutally honest — if someone looks nervous, score them low on confidence. If someone looks commanding, score them high on leadership. Do NOT default to safe mid-range numbers.

Analyze what you can ACTUALLY SEE across these video frames. Look for:

1. SPEAKING CONFIDENCE: Examine their posture (straight/slouched), eye contact direction and stability, whether their chin is raised or lowered, and their overall composure. A confident speaker maintains steady eye contact and has an open, upright posture.

2. HESITATION INDICATORS: Look for visible pauses (mouth partially open without speaking), filler word mouth shapes, nervous gestures (touching face, adjusting hair, fidgeting hands), and throat clearing.

3. COMMUNICATION CLARITY: Assess articulation precision from mouth movements, whether speech appears structured and deliberate vs. rambling, and gestural rhythm that suggests organized thought.

4. EMOTIONAL CONSISTENCY: Compare expressions across all frames. Does the person shift from calm to tense? From smiling to stiff? Emotional stability is key for professional roles.

5. SPEAKING SPEED AND RHYTHM: Rapid mouth movements and fast gesturing suggest hurried speech; slow, deliberate movements suggest measured, confident speech.

6. LEADERSHIP SIGNALS: Commanding presence — squared shoulders, steady gaze, controlled gestures, chin slightly raised. A leader doesn't fidget; they project authority through stillness and purposeful movement.

7. NERVOUSNESS INDICATORS: Fidgeting, avoiding camera, tense jaw, lip biting, excessive blinking, rigid posture, self-soothing gestures (rubbing arms, touching neck), shifty eyes.

8. FILLER WORDS ESTIMATION: Based on visible mouth shapes that suggest "um", "uh", "like", "you know" — hesitant mouth positions between phrases.

9. ADAPTABILITY SIGNALS: Relaxed transitions between expressions, open body language (arms uncrossed, palms visible), natural gesture flow, ability to smile naturally without forcing.

Return ONLY valid JSON with this exact structure:
{
  "isValidResume": true,
  "overallScore": <number 20-98, truly reflective of the person's presence>,
  "speechClarity": <number 15-98>,
  "confidence": <number 15-98, LOW for nervous candidates 40-65, HIGH for confident 75-95>,
  "communication": <number 15-98>,
  "enthusiasm": <number 15-98>,
  "leadership": <number 10-98, LOW for passive demeanor 25-50, HIGH for commanding 70-95>,
  "eyeContact": <number 15-98>,
  "emotionalConsistency": <number 15-98>,
  "adaptability": <number 15-98>,
  "nervousnessIndicators": {
    "score": <number 0-100, where 0=completely calm, 100=extremely nervous>,
    "observed": ["<specific observation 1>", "<specific observation 2>"]
  },
  "fillerWordEstimate": {
    "frequency": "<none|minimal|moderate|frequent|excessive>",
    "estimatedCount": <number, estimated filler words per minute of speech>,
    "types": ["<types of filler words estimated, e.g. 'um', 'uh', 'like', 'you know'>"]
  },
  "speakingSpeedEstimate": {
    "pace": "<very slow|slow|moderate|fast|very fast>",
    "wordsPerMinuteEstimate": <number 80-200>,
    "rhythmDescription": "<brief description of speech rhythm observed>"
  },
  "personalityInsights": [
    {"title": "<specific behavioral insight based on observation>", "description": "<2-3 sentence detailed explanation referencing specific visual cues>", "score": <number 15-98>},
    {"title": "<specific behavioral insight based on observation>", "description": "<2-3 sentence detailed explanation referencing specific visual cues>", "score": <number 15-98>},
    {"title": "<specific behavioral insight based on observation>", "description": "<2-3 sentence detailed explanation referencing specific visual cues>", "score": <number 15-98>},
    {"title": "<specific behavioral insight based on observation>", "description": "<2-3 sentence detailed explanation referencing specific visual cues>", "score": <number 15-98>}
  ],
  "personalitySummary": "<3-4 sentence brutally honest assessment of this person's professional presentation and behavioral patterns>",
  "communicationStyle": "<specific communication style observed, e.g. 'Measured and authoritative' or 'Hesitant with frequent pauses'>",
  "primaryTrait": "<dominant personality trait observed, NOT generic — be specific like 'Steady authority' or 'Nervous earnestness'>",
  "strengths": ["<observed strength 1 with behavioral evidence>", "<observed strength 2 with behavioral evidence>", "<observed strength 3 with behavioral evidence>"],
  "areasForImprovement": ["<observed area 1 with specific behavioral reference>", "<observed area 2 with specific behavioral reference>"]
}`,
          },
          ...framesToAnalyze.map(
            (frame) =>
              ({
                type: 'image_url' as const,
                image_url: { url: frame.startsWith('data:') ? frame : `data:image/jpeg;base64,${frame}` },
              }) as const
          ),
        ],
      },
    ]

    try {
      // Use createVision so the model can actually SEE the video frames
      const analysisResponse = await zai.chat.completions.createVision({
        messages: analysisMessages as any,
        temperature: 0.5,
        thinking: { type: 'disabled' },
      })

      const analysisText = analysisResponse.choices?.[0]?.message?.content || ''
      const analysis = extractJSON(analysisText)

      if (analysis && typeof analysis.overallScore === 'number') {
        const clamp = (val: unknown, min: number, max: number) =>
          Math.min(max, Math.max(min, typeof val === 'number' ? val : min))

        const result = {
          isValidResume: true,
          overallScore: clamp(analysis.overallScore, 20, 98),
          speechClarity: clamp(analysis.speechClarity, 15, 98),
          confidence: clamp(analysis.confidence, 15, 98),
          communication: clamp(analysis.communication, 15, 98),
          enthusiasm: clamp(analysis.enthusiasm, 15, 98),
          leadership: clamp(analysis.leadership, 10, 98),
          eyeContact: clamp(analysis.eyeContact, 15, 98),
          emotionalConsistency: clamp(analysis.emotionalConsistency, 15, 98),
          adaptability: clamp(analysis.adaptability, 15, 98),
          nervousnessIndicators: analysis.nervousnessIndicators && typeof analysis.nervousnessIndicators === 'object'
            ? {
                score: clamp((analysis.nervousnessIndicators as Record<string, unknown>).score, 0, 100),
                observed: Array.isArray((analysis.nervousnessIndicators as Record<string, unknown>).observed)
                  ? ((analysis.nervousnessIndicators as Record<string, unknown>).observed as unknown[]).slice(0, 5).map(String)
                  : ['No specific indicators identified'],
              }
            : { score: 30, observed: ['No specific indicators identified'] },
          fillerWordEstimate: analysis.fillerWordEstimate && typeof analysis.fillerWordEstimate === 'object'
            ? {
                frequency: String((analysis.fillerWordEstimate as Record<string, unknown>).frequency || 'minimal'),
                estimatedCount: clamp((analysis.fillerWordEstimate as Record<string, unknown>).estimatedCount, 0, 30),
                types: Array.isArray((analysis.fillerWordEstimate as Record<string, unknown>).types)
                  ? ((analysis.fillerWordEstimate as Record<string, unknown>).types as unknown[]).slice(0, 5).map(String)
                  : ['um', 'uh'],
              }
            : { frequency: 'minimal', estimatedCount: 2, types: ['um', 'uh'] },
          speakingSpeedEstimate: analysis.speakingSpeedEstimate && typeof analysis.speakingSpeedEstimate === 'object'
            ? {
                pace: String((analysis.speakingSpeedEstimate as Record<string, unknown>).pace || 'moderate'),
                wordsPerMinuteEstimate: clamp((analysis.speakingSpeedEstimate as Record<string, unknown>).wordsPerMinuteEstimate, 80, 200),
                rhythmDescription: String((analysis.speakingSpeedEstimate as Record<string, unknown>).rhythmDescription || 'Steady pace'),
              }
            : { pace: 'moderate', wordsPerMinuteEstimate: 140, rhythmDescription: 'Steady pace' },
          personalityInsights: Array.isArray(analysis.personalityInsights)
            ? analysis.personalityInsights.slice(0, 4).map((insight: Record<string, unknown>) => ({
                title: String(insight.title || 'Observation'),
                description: String(insight.description || 'Based on video analysis'),
                score: clamp(insight.score, 15, 98),
              }))
            : [],
          personalitySummary: String(
            analysis.personalitySummary || 'Analysis completed based on video observation.'
          ),
          communicationStyle: String(analysis.communicationStyle || 'Professional'),
          primaryTrait: String(analysis.primaryTrait || 'Analytical'),
          strengths: Array.isArray(analysis.strengths)
            ? analysis.strengths.slice(0, 5).map(String)
            : [],
          areasForImprovement: Array.isArray(analysis.areasForImprovement)
            ? analysis.areasForImprovement.slice(0, 3).map(String)
            : [],
        }

        return NextResponse.json({ success: true, analysis: result })
      }
    } catch (error) {
      console.error('Analysis VLM error:', error)
    }

    return NextResponse.json({
      success: false,
      error: 'Video was recognized as a valid resume, but the AI analysis failed to generate results. Please try again.',
      errorType: 'ANALYSIS_FAILED',
    })
  } catch (error) {
    console.error('Video analysis API error:', error)
    return NextResponse.json(
      { success: false, error: 'Video analysis request failed. Please try again.' },
      { status: 500 }
    )
  }
}
