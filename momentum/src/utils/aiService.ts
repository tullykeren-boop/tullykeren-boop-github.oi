import type { Goal, GoalCategory, AIMessage } from '../types';

interface GeneratedPlan {
  aiPlan: string;
  milestones: Array<{
    title: string;
    description?: string;
    tasks: Array<{ title: string; description?: string; priority?: 'low' | 'medium' | 'high'; estimatedMinutes?: number }>;
  }>;
  motivation: string;
}

const FALLBACK_PLANS: Record<GoalCategory, (title: string) => GeneratedPlan> = {
  health: (title) => ({
    aiPlan: `To achieve "${title}", start with a baseline assessment of your current fitness level. Build progressive habits by starting small and increasing intensity over time. Consistency beats intensity every time. Track your workouts and nutrition to stay accountable.`,
    milestones: [
      {
        title: 'Foundation Phase',
        description: 'Build the baseline habits and routines',
        tasks: [
          { title: 'Schedule initial health assessment', priority: 'high', estimatedMinutes: 30 },
          { title: 'Set up tracking system (app or journal)', priority: 'medium', estimatedMinutes: 20 },
          { title: 'Plan weekly workout schedule', priority: 'high', estimatedMinutes: 30 },
          { title: 'Prepare healthy meal prep routine', priority: 'medium', estimatedMinutes: 60 },
        ],
      },
      {
        title: 'Consistency Phase',
        description: 'Execute the plan and build momentum',
        tasks: [
          { title: 'Complete first week of workouts', priority: 'high', estimatedMinutes: 45 },
          { title: 'Track sleep and recovery metrics', priority: 'medium', estimatedMinutes: 10 },
          { title: 'Adjust diet based on energy levels', priority: 'medium', estimatedMinutes: 20 },
          { title: 'Find an accountability partner', priority: 'low', estimatedMinutes: 15 },
        ],
      },
      {
        title: 'Progress Phase',
        description: 'Push further and review results',
        tasks: [
          { title: 'Review progress against initial baseline', priority: 'high', estimatedMinutes: 30 },
          { title: 'Increase workout intensity or duration', priority: 'medium', estimatedMinutes: 60 },
          { title: 'Optimize nutrition plan', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Celebrate milestone achievements', priority: 'low', estimatedMinutes: 15 },
        ],
      },
    ],
    motivation: "Every rep, every healthy meal, every night of good sleep is compounding. You're not just building a body — you're building a life. The version of you in 6 months will thank you for starting today.",
  }),

  career: (title) => ({
    aiPlan: `Achieving "${title}" requires strategic action. Map out the skills gap, build visibility in your field, and consistently deliver results that speak for themselves. Your career is a long game — each step compounds.`,
    milestones: [
      {
        title: 'Clarity & Strategy',
        description: 'Define the path and requirements clearly',
        tasks: [
          { title: 'Research requirements and skill gaps', priority: 'high', estimatedMinutes: 60 },
          { title: 'Connect with 3 people in target role', priority: 'high', estimatedMinutes: 45 },
          { title: 'Create a skills development plan', priority: 'high', estimatedMinutes: 45 },
          { title: 'Update resume and LinkedIn profile', priority: 'medium', estimatedMinutes: 90 },
        ],
      },
      {
        title: 'Skill Building',
        description: 'Actively close the skill gap',
        tasks: [
          { title: 'Complete priority skill course or training', priority: 'high', estimatedMinutes: 120 },
          { title: 'Start a portfolio project to showcase skills', priority: 'high', estimatedMinutes: 180 },
          { title: 'Attend industry events or meetups', priority: 'medium', estimatedMinutes: 120 },
          { title: 'Request feedback from mentor', priority: 'medium', estimatedMinutes: 30 },
        ],
      },
      {
        title: 'Execution & Visibility',
        description: 'Put yourself out there and make progress',
        tasks: [
          { title: 'Apply to or pursue target opportunities', priority: 'high', estimatedMinutes: 60 },
          { title: 'Share work or insights publicly', priority: 'medium', estimatedMinutes: 45 },
          { title: 'Follow up on all active opportunities', priority: 'high', estimatedMinutes: 30 },
          { title: 'Reflect on progress and adjust strategy', priority: 'medium', estimatedMinutes: 30 },
        ],
      },
    ],
    motivation: "Your career is built one deliberate action at a time. The people you admire didn't just happen to get there — they showed up, learned, and pushed through. You have that same capacity. Start today.",
  }),

  learning: (title) => ({
    aiPlan: `Mastering "${title}" is a journey of deliberate practice. Break the subject into foundational concepts, build on them systematically, and apply what you learn through projects. Active recall and spaced repetition will dramatically accelerate your progress.`,
    milestones: [
      {
        title: 'Orientation & Resources',
        description: 'Map the subject and gather quality materials',
        tasks: [
          { title: 'Identify the best learning resources', priority: 'high', estimatedMinutes: 45 },
          { title: 'Create a structured study schedule', priority: 'high', estimatedMinutes: 30 },
          { title: 'Set up note-taking and review system', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Define what mastery looks like', priority: 'medium', estimatedMinutes: 20 },
        ],
      },
      {
        title: 'Core Learning',
        description: 'Absorb the fundamental concepts',
        tasks: [
          { title: 'Complete beginner foundations module', priority: 'high', estimatedMinutes: 120 },
          { title: 'Practice exercises daily for 30 minutes', priority: 'high', estimatedMinutes: 30 },
          { title: 'Review and quiz on completed sections', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Join a community of learners', priority: 'low', estimatedMinutes: 20 },
        ],
      },
      {
        title: 'Applied Practice',
        description: 'Build real skills through projects',
        tasks: [
          { title: 'Start a hands-on practice project', priority: 'high', estimatedMinutes: 180 },
          { title: 'Teach the concept to someone else', priority: 'medium', estimatedMinutes: 45 },
          { title: 'Tackle advanced challenges', priority: 'medium', estimatedMinutes: 120 },
          { title: 'Document your learning journey', priority: 'low', estimatedMinutes: 30 },
        ],
      },
    ],
    motivation: "Every expert was once a beginner. Learning is not linear — there will be breakthroughs and plateaus. Trust the process, stay curious, and remember: the discomfort you feel when learning is the feeling of growth.",
  }),

  finance: (title) => ({
    aiPlan: `Reaching "${title}" demands financial clarity and discipline. Start by understanding your current position, then create a concrete plan with automatic systems that remove willpower from the equation. Small, consistent actions compound dramatically over time.`,
    milestones: [
      {
        title: 'Financial Clarity',
        description: 'Know exactly where you stand',
        tasks: [
          { title: 'Calculate net worth and monthly cash flow', priority: 'high', estimatedMinutes: 60 },
          { title: 'Track all income and expenses for 1 month', priority: 'high', estimatedMinutes: 30 },
          { title: 'Identify top 3 expenses to reduce', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Define the specific financial target', priority: 'high', estimatedMinutes: 20 },
        ],
      },
      {
        title: 'System Setup',
        description: 'Build automatic financial habits',
        tasks: [
          { title: 'Automate savings contribution', priority: 'high', estimatedMinutes: 30 },
          { title: 'Set up budget categories and limits', priority: 'medium', estimatedMinutes: 45 },
          { title: 'Research and open optimal accounts', priority: 'medium', estimatedMinutes: 60 },
          { title: 'Eliminate or reduce high-cost expenses', priority: 'high', estimatedMinutes: 30 },
        ],
      },
      {
        title: 'Growth & Optimization',
        description: 'Accelerate progress toward the goal',
        tasks: [
          { title: 'Find one way to increase income', priority: 'high', estimatedMinutes: 60 },
          { title: 'Review and optimize investments', priority: 'medium', estimatedMinutes: 45 },
          { title: 'Monthly financial review', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Celebrate financial milestones', priority: 'low', estimatedMinutes: 15 },
        ],
      },
    ],
    motivation: "Financial freedom is built one decision at a time. You don't need to be perfect — you need to be consistent. Every dollar you save and invest is working for you while you sleep. The path is clear. Walk it.",
  }),

  relationships: (title) => ({
    aiPlan: `Building toward "${title}" requires intentional effort and vulnerability. Relationships grow when you consistently show up, listen deeply, and invest time in what matters to others. Quality over quantity — a few deep connections beat many shallow ones.`,
    milestones: [
      {
        title: 'Reflection & Intention',
        description: 'Get clear on what you want to build',
        tasks: [
          { title: 'Journal about relationship goals and values', priority: 'high', estimatedMinutes: 30 },
          { title: 'Identify key relationships to prioritize', priority: 'high', estimatedMinutes: 20 },
          { title: 'Research connection-building strategies', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Identify one habit that supports connection', priority: 'medium', estimatedMinutes: 20 },
        ],
      },
      {
        title: 'Active Outreach',
        description: 'Start building and deepening connections',
        tasks: [
          { title: 'Reach out to 3 important people this week', priority: 'high', estimatedMinutes: 30 },
          { title: 'Schedule quality time with loved ones', priority: 'high', estimatedMinutes: 20 },
          { title: 'Attend a social event or community gathering', priority: 'medium', estimatedMinutes: 120 },
          { title: 'Practice active listening in conversations', priority: 'medium', estimatedMinutes: 15 },
        ],
      },
      {
        title: 'Deepening Bonds',
        description: 'Nurture and strengthen relationships',
        tasks: [
          { title: 'Create a meaningful shared experience', priority: 'high', estimatedMinutes: 120 },
          { title: 'Express appreciation to important people', priority: 'medium', estimatedMinutes: 20 },
          { title: 'Resolve any lingering tensions honestly', priority: 'high', estimatedMinutes: 45 },
          { title: 'Reflect on what you bring to relationships', priority: 'medium', estimatedMinutes: 20 },
        ],
      },
    ],
    motivation: "The quality of your relationships is the quality of your life. It takes courage to be vulnerable, to reach out, to show up fully. But those who dare to connect deeply live the richest lives. Take the first step.",
  }),

  creativity: (title) => ({
    aiPlan: `Pursuing "${title}" is about showing up consistently, silencing the inner critic, and trusting the creative process. Creativity is a muscle — it grows with use. Commit to regular creative sessions, seek inspiration, and don't wait for perfect conditions.`,
    milestones: [
      {
        title: 'Creative Foundation',
        description: 'Set up your creative practice',
        tasks: [
          { title: 'Define your creative vision for this goal', priority: 'high', estimatedMinutes: 30 },
          { title: 'Set up dedicated creative workspace', priority: 'medium', estimatedMinutes: 45 },
          { title: 'Schedule daily creative blocks', priority: 'high', estimatedMinutes: 15 },
          { title: 'Gather inspiration and reference materials', priority: 'medium', estimatedMinutes: 45 },
        ],
      },
      {
        title: 'Creation & Experimentation',
        description: 'Make things, explore, and play',
        tasks: [
          { title: 'Complete first creative piece or experiment', priority: 'high', estimatedMinutes: 120 },
          { title: 'Try a new technique or approach', priority: 'medium', estimatedMinutes: 60 },
          { title: 'Share work with a trusted person for feedback', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Develop a body of work (5+ pieces)', priority: 'high', estimatedMinutes: 300 },
        ],
      },
      {
        title: 'Polish & Share',
        description: 'Refine your work and put it out in the world',
        tasks: [
          { title: 'Select best work to refine and complete', priority: 'high', estimatedMinutes: 120 },
          { title: 'Create platform to share your work', priority: 'medium', estimatedMinutes: 90 },
          { title: 'Share work publicly', priority: 'high', estimatedMinutes: 30 },
          { title: 'Connect with other creators in your space', priority: 'medium', estimatedMinutes: 45 },
        ],
      },
    ],
    motivation: "Your creativity is uniquely yours. The world needs your particular way of seeing and making. Don't let fear of imperfection stop you — done is better than perfect. Create boldly, share bravely, and keep going.",
  }),

  mindfulness: (title) => ({
    aiPlan: `The path to "${title}" begins with presence. Mindfulness practices rewire the brain over time — the key is consistency over intensity. Start with small, manageable sessions and gradually deepen your practice. Be patient and compassionate with yourself.`,
    milestones: [
      {
        title: 'Practice Foundation',
        description: 'Establish the core mindfulness habit',
        tasks: [
          { title: 'Choose a mindfulness practice (meditation, yoga, etc.)', priority: 'high', estimatedMinutes: 20 },
          { title: 'Set up a dedicated practice space', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Complete first 7 consecutive days of practice', priority: 'high', estimatedMinutes: 15 },
          { title: 'Read one book or resource on the practice', priority: 'medium', estimatedMinutes: 60 },
        ],
      },
      {
        title: 'Deepening Practice',
        description: 'Build depth and consistency',
        tasks: [
          { title: 'Extend daily sessions by 5 minutes', priority: 'medium', estimatedMinutes: 20 },
          { title: 'Attend a guided class or workshop', priority: 'medium', estimatedMinutes: 90 },
          { title: 'Journal about insights and experiences', priority: 'low', estimatedMinutes: 15 },
          { title: 'Practice mindfulness in daily activities', priority: 'high', estimatedMinutes: 10 },
        ],
      },
      {
        title: 'Integration',
        description: 'Weave mindfulness into daily life',
        tasks: [
          { title: 'Complete 30-day consecutive practice streak', priority: 'high', estimatedMinutes: 20 },
          { title: 'Share practice with a friend or family member', priority: 'low', estimatedMinutes: 30 },
          { title: 'Explore a retreat or intensive', priority: 'medium', estimatedMinutes: 60 },
          { title: 'Reflect on overall life changes from practice', priority: 'medium', estimatedMinutes: 30 },
        ],
      },
    ],
    motivation: "The present moment is the only place life actually happens. Your practice of returning to it, again and again, is one of the most profound investments you can make. Be gentle with yourself — this is a journey, not a destination.",
  }),

  other: (title) => ({
    aiPlan: `Achieving "${title}" requires clear intention, consistent action, and adaptability. Break it down into manageable phases, track your progress honestly, and celebrate every step forward. You have what it takes — start where you are.`,
    milestones: [
      {
        title: 'Planning & Preparation',
        description: 'Lay the groundwork for success',
        tasks: [
          { title: 'Define what success looks like clearly', priority: 'high', estimatedMinutes: 30 },
          { title: 'Research best approaches and strategies', priority: 'high', estimatedMinutes: 60 },
          { title: 'Identify needed resources and support', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Set weekly check-in schedule', priority: 'medium', estimatedMinutes: 15 },
        ],
      },
      {
        title: 'Active Execution',
        description: 'Take consistent action toward the goal',
        tasks: [
          { title: 'Complete first major action step', priority: 'high', estimatedMinutes: 60 },
          { title: 'Review progress and adjust approach', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Overcome the first obstacle you encounter', priority: 'high', estimatedMinutes: 45 },
          { title: 'Share progress with an accountability partner', priority: 'medium', estimatedMinutes: 20 },
        ],
      },
      {
        title: 'Final Push',
        description: 'Finish strong and lock in the result',
        tasks: [
          { title: 'Review all outstanding items', priority: 'high', estimatedMinutes: 30 },
          { title: 'Complete remaining actions', priority: 'high', estimatedMinutes: 120 },
          { title: 'Document lessons learned', priority: 'medium', estimatedMinutes: 30 },
          { title: 'Celebrate your achievement', priority: 'low', estimatedMinutes: 60 },
        ],
      },
    ],
    motivation: "Every big achievement started as a decision, followed by action. You've already taken the first step by committing to this goal. Keep that energy, trust the process, and know that every bit of effort is moving you forward.",
  }),
};

export async function generateGoalPlan(
  title: string,
  description: string,
  category: GoalCategory,
  apiKey?: string
): Promise<GeneratedPlan> {
  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are Momentum AI, an expert goal execution coach. Generate a detailed, actionable execution plan for a user's goal. Return ONLY valid JSON with this exact structure:
{
  "aiPlan": "2-3 paragraph strategic overview of how to achieve this goal",
  "motivation": "1 powerful motivational paragraph specific to this goal",
  "milestones": [
    {
      "title": "Phase name",
      "description": "Brief phase description",
      "tasks": [
        {
          "title": "Specific action task",
          "description": "Brief description",
          "priority": "high|medium|low",
          "estimatedMinutes": 30
        }
      ]
    }
  ]
}
Create 3 milestones with 4 tasks each. Tasks should be specific, actionable, and achievable.`,
            },
            {
              role: 'user',
              content: `Goal: ${title}\nDescription: ${description}\nCategory: ${category}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0]?.message?.content;
        if (content) {
          const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          return JSON.parse(cleaned);
        }
      }
    } catch {
      // Fall through to fallback
    }
  }

  return FALLBACK_PLANS[category](title);
}

const CHAT_FALLBACKS = [
  "That's a great question! Breaking your goal into smaller daily actions is key. What specific obstacle are you facing right now?",
  "Momentum is built through consistent small wins. What's one tiny step you could take in the next 30 minutes toward this goal?",
  "Every challenge on this journey is shaping you into the person who can achieve this goal. What would help you move forward today?",
  "You've already shown commitment by setting this goal. What part of your plan feels most uncertain right now?",
  "Progress isn't always linear. Reflect on what's working well, and let's focus on removing friction from what isn't.",
  "Accountability is one of the strongest predictors of goal success. Who could you share today's progress with?",
  "Your motivation is your fuel — what made you want to pursue this goal in the first place? Reconnect with that.",
  "Let's problem-solve together. What's the most important action you haven't taken yet, and what's stopping you?",
];

let fallbackIndex = 0;

export async function sendChatMessage(
  messages: AIMessage[],
  goal: Goal,
  apiKey?: string
): Promise<string> {
  if (apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are Momentum AI, an expert goal execution coach and accountability partner. The user is working on this goal:

Title: ${goal.title}
Description: ${goal.description}
Category: ${goal.category}
Status: ${goal.status}

Be encouraging, specific, and action-oriented. Keep responses concise (2-4 sentences). Focus on practical next steps, overcoming obstacles, and maintaining motivation. If they share progress, celebrate it genuinely.`,
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
          ],
          temperature: 0.8,
          max_tokens: 300,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.choices[0]?.message?.content || CHAT_FALLBACKS[fallbackIndex % CHAT_FALLBACKS.length];
      }
    } catch {
      // Fall through to fallback
    }
  }

  const response = CHAT_FALLBACKS[fallbackIndex % CHAT_FALLBACKS.length];
  fallbackIndex++;
  return response;
}
