import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  onSubmit: (goal: string) => void;
  loading: boolean;
}

const EXAMPLES = [
  'Learn to code in Python from zero',
  'Start running 3 times a week',
  'Read 12 books this year',
  'Launch a freelance side project',
  'Improve my sleep schedule',
];

export function GoalInput({ onSubmit, loading }: Props) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  };

  const handleExample = (ex: string) => {
    setValue(ex);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Describe your goal in plain language..."
          maxLength={500}
          rows={3}
          disabled={loading}
          className="w-full px-5 py-4 pr-16 text-base border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-400 transition resize-none disabled:opacity-60 bg-white shadow-sm placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm"
          title="Generate plan"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <ArrowRight size={18} />
          )}
        </button>
        {value.length > 400 && (
          <span className="absolute bottom-4 right-16 text-xs text-slate-400">
            {value.length}/500
          </span>
        )}
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-slate-400 self-center">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => handleExample(ex)}
            disabled={loading}
            className="px-3 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-40"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
