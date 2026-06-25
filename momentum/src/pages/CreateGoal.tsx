import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Target,
  Calendar,
  Tag,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { generateGoalPlan } from '../utils/aiService';
import { getCategoryConfig } from '../utils/goalUtils';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import type { GoalCategory, Priority } from '../types';

const EMOJIS = ['🎯', '🚀', '💪', '📚', '💰', '❤️', '🎨', '🧘', '⭐', '🌟', '🏆', '💡', '🔥', '🌱', '🎵', '✈️', '🏃', '🧠', '💎', '🌊'];

const CATEGORIES: { key: GoalCategory; label: string; emoji: string; description: string }[] = [
  { key: 'health', label: 'Health & Fitness', emoji: '💪', description: 'Physical wellness, exercise, nutrition' },
  { key: 'career', label: 'Career & Work', emoji: '🚀', description: 'Professional growth, job goals, business' },
  { key: 'learning', label: 'Learning & Skills', emoji: '📚', description: 'Education, skills, knowledge' },
  { key: 'finance', label: 'Finance & Wealth', emoji: '💰', description: 'Savings, investing, income' },
  { key: 'relationships', label: 'Relationships', emoji: '❤️', description: 'Family, friends, social connections' },
  { key: 'creativity', label: 'Creativity', emoji: '🎨', description: 'Art, music, writing, making' },
  { key: 'mindfulness', label: 'Mindfulness', emoji: '🧘', description: 'Mental health, meditation, balance' },
  { key: 'other', label: 'Other', emoji: '⭐', description: 'Anything else that matters to you' },
];

const STEPS = [
  { id: 'basics', label: 'Goal Basics' },
  { id: 'details', label: 'Details' },
  { id: 'plan', label: 'AI Plan' },
];

interface FormData {
  title: string;
  description: string;
  category: GoalCategory;
  priority: Priority;
  targetDate: string;
  motivation: string;
  tags: string;
  coverEmoji: string;
}

export function CreateGoal() {
  const navigate = useNavigate();
  const { createGoal, settings } = useStore();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<Awaited<ReturnType<typeof generateGoalPlan>> | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [form, setForm] = useState<FormData>({
    title: '',
    description: '',
    category: 'career',
    priority: 'medium',
    targetDate: '',
    motivation: '',
    tags: '',
    coverEmoji: '🎯',
  });

  const update = (key: keyof FormData, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validateStep0 = () => {
    const e: Partial<FormData> = {};
    if (!form.title.trim()) e.title = 'Goal title is required';
    else if (form.title.length < 5) e.title = 'Title must be at least 5 characters';
    if (!form.description.trim()) e.description = 'Description is required';
    else if (form.description.length < 20) e.description = 'Please describe your goal in more detail (at least 20 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (step === 0) {
      if (!validateStep0()) return;
      setStep(1);
    } else if (step === 1) {
      setStep(2);
      setGenerating(true);
      try {
        const plan = await generateGoalPlan(form.title, form.description, form.category, settings.openaiApiKey);
        setGeneratedPlan(plan);
      } catch {
        toast('Could not generate AI plan, using default template.', 'info');
      } finally {
        setGenerating(false);
      }
    }
  };

  const handleCreate = () => {
    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const goal = createGoal({
      title: form.title,
      description: form.description,
      category: form.category,
      priority: form.priority,
      targetDate: form.targetDate || undefined,
      motivation: form.motivation || generatedPlan?.motivation,
      tags,
      coverEmoji: form.coverEmoji,
      aiPlan: generatedPlan?.aiPlan,
      milestones: generatedPlan?.milestones,
    });
    toast('Goal created! Your AI plan is ready. 🚀', 'success');
    navigate(`/goals/${goal.id}`);
  };

  const catConfig = getCategoryConfig(form.category);

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <button
          onClick={() => step === 0 ? navigate('/goals') : setStep(s => s - 1)}
          className="flex items-center gap-2 text-surface-400 hover:text-surface-200 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> {step === 0 ? 'Back to Goals' : 'Previous Step'}
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-100">Create New Goal</h1>
            <p className="text-surface-400 text-sm">AI will build your execution plan</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
              i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-brand-600 text-white animate-pulse-glow' : 'bg-surface-800 text-surface-500'
            }`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === step ? 'text-surface-200' : 'text-surface-500'}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 transition-all duration-300 ${i < step ? 'bg-emerald-500' : 'bg-surface-800'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Basics */}
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-6"
          >
            <Card>
              <h2 className="text-lg font-semibold text-surface-100 mb-5 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-400" />
                What's your goal?
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium text-surface-300 mb-2 block">Choose an icon</label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => update('coverEmoji', emoji)}
                        className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all duration-200 ${
                          form.coverEmoji === emoji
                            ? 'bg-brand-600/30 border-2 border-brand-500 scale-110'
                            : 'bg-surface-800 border border-surface-700 hover:bg-surface-700'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Goal Title"
                  placeholder="e.g. Run a 5K in under 25 minutes"
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  error={errors.title}
                />

                <Textarea
                  label="Description"
                  placeholder="Describe your goal in detail. What does success look like? Why does this matter to you?"
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  error={errors.description}
                  rows={4}
                />
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-surface-100 mb-5">Category</h2>
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => update('category', cat.key)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
                      form.category === cat.key
                        ? 'border-brand-500/50 bg-brand-600/10'
                        : 'border-surface-700 bg-surface-800/50 hover:border-surface-600'
                    }`}
                  >
                    <span className="text-xl">{cat.emoji}</span>
                    <div>
                      <p className={`text-sm font-medium ${form.category === cat.key ? 'text-brand-300' : 'text-surface-200'}`}>
                        {cat.label}
                      </p>
                      <p className="text-xs text-surface-500">{cat.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            <Button onClick={handleNext} size="lg" className="w-full" iconPosition="right" icon={<ArrowRight className="w-4 h-4" />}>
              Continue
            </Button>
          </motion.div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-6"
          >
            <Card>
              <h2 className="text-lg font-semibold text-surface-100 mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-400" />
                Goal Details
              </h2>
              <div className="flex flex-col gap-4">
                <Select
                  label="Priority"
                  value={form.priority}
                  onChange={e => update('priority', e.target.value)}
                >
                  <option value="high">🔴 High Priority</option>
                  <option value="medium">🟡 Medium Priority</option>
                  <option value="low">🟢 Low Priority</option>
                </Select>

                <Input
                  label="Target Date (optional)"
                  type="date"
                  value={form.targetDate}
                  onChange={e => update('targetDate', e.target.value)}
                  hint="When would you like to achieve this goal?"
                />

                <Textarea
                  label="Your Motivation (optional)"
                  placeholder="Why does this goal matter to you? What will achieving it mean for your life?"
                  value={form.motivation}
                  onChange={e => update('motivation', e.target.value)}
                  rows={3}
                />

                <Input
                  label="Tags (optional)"
                  placeholder="fitness, health, morning-routine (comma-separated)"
                  value={form.tags}
                  onChange={e => update('tags', e.target.value)}
                  leftIcon={<Tag className="w-4 h-4" />}
                  hint="Add tags to organize your goals"
                />
              </div>
            </Card>

            {/* Preview */}
            <Card className="border border-brand-500/20">
              <h3 className="text-sm font-semibold text-surface-300 mb-3">Goal Preview</h3>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${catConfig.bgClass}`}>
                  {form.coverEmoji}
                </div>
                <div>
                  <p className="font-semibold text-surface-100">{form.title || 'Your Goal Title'}</p>
                  <span className={`text-xs ${catConfig.textClass}`}>{catConfig.label}</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(0)} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1"
                icon={<Sparkles className="w-4 h-4" />}
                iconPosition="right"
              >
                Generate AI Plan
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: AI Plan */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="flex flex-col gap-6"
          >
            {generating ? (
              <Card className="py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center animate-pulse-glow">
                    <Sparkles className="w-8 h-8 text-brand-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-surface-200 mb-1">Building Your Plan</h3>
                    <p className="text-surface-400 text-sm">AI is creating a personalized execution plan...</p>
                  </div>
                  <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
                </div>
              </Card>
            ) : generatedPlan ? (
              <>
                <Card className="border border-brand-500/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-brand-400" />
                    <h2 className="text-lg font-semibold text-surface-100">Your AI-Generated Plan</h2>
                  </div>
                  <p className="text-surface-300 text-sm leading-relaxed mb-5">{generatedPlan.aiPlan}</p>

                  {generatedPlan.motivation && (
                    <div className="p-4 rounded-xl bg-brand-600/10 border border-brand-500/20">
                      <p className="text-sm text-brand-200 italic leading-relaxed">"{generatedPlan.motivation}"</p>
                    </div>
                  )}
                </Card>

                {generatedPlan.milestones.map((ms, i) => (
                  <Card key={i}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-full bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-400">
                        {i + 1}
                      </div>
                      <h3 className="font-semibold text-surface-100">{ms.title}</h3>
                    </div>
                    {ms.description && (
                      <p className="text-sm text-surface-400 mb-3">{ms.description}</p>
                    )}
                    <div className="flex flex-col gap-2">
                      {ms.tasks.map((task, j) => (
                        <div key={j} className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-800/50">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-surface-300">{task.title}</p>
                            {task.description && (
                              <p className="text-xs text-surface-500 mt-0.5">{task.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {task.estimatedMinutes && (
                              <span className="text-xs text-surface-500">{task.estimatedMinutes}m</span>
                            )}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              task.priority === 'low' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}

                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleCreate} className="flex-1" icon={<Check className="w-4 h-4" />}>
                    Create Goal & Start
                  </Button>
                </div>
              </>
            ) : (
              <Card className="text-center py-12">
                <p className="text-surface-400 mb-4">Failed to generate plan. Click below to try again.</p>
                <Button onClick={handleNext} icon={<Sparkles className="w-4 h-4" />}>Retry</Button>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
