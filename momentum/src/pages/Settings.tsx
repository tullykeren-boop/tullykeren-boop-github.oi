import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Key,
  Eye,
  EyeOff,
  Bell,
  Check,
  Zap,
  Trash2,
  Download,
  Upload,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';

export function Settings() {
  const { settings, updateSettings, goals } = useStore();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState(settings.openaiApiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveApiKey = () => {
    updateSettings({ openaiApiKey: apiKey || undefined });
    setSaved(true);
    toast('API key saved!');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = {
      exportDate: new Date().toISOString(),
      goals,
      version: '1.0',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `momentum-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Data exported successfully!');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (data.goals) {
            toast('Import feature coming soon! For now, export keeps your data safe.', 'info');
          }
        } catch {
          toast('Invalid file format', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearData = () => {
    if (confirm('⚠️ This will permanently delete ALL your goals and data. This cannot be undone. Are you absolutely sure?')) {
      if (confirm('Last chance — really delete everything?')) {
        localStorage.removeItem('momentum_app_state');
        window.location.reload();
      }
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-surface-800 border border-surface-700 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-surface-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-100">Settings</h1>
            <p className="text-surface-400 text-sm">Manage your Momentum preferences</p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* AI Configuration */}
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-400" />
            </div>
            <div>
              <h2 className="font-semibold text-surface-100">AI Configuration</h2>
              <p className="text-sm text-surface-400">Connect your OpenAI API key for personalized AI coaching</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-brand-600/5 border border-brand-500/20 mb-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-surface-300">
                <p className="font-medium text-brand-300 mb-1">Without API key</p>
                <p className="text-surface-400">Momentum uses built-in templates for goal planning and generic coaching responses.</p>
                <p className="font-medium text-brand-300 mt-3 mb-1">With your OpenAI API key</p>
                <p className="text-surface-400">Get fully personalized AI-generated execution plans and coaching conversations tailored exactly to your goals.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-surface-900 border border-surface-700 rounded-xl px-4 py-2.5 pr-12 text-sm text-surface-100 placeholder-surface-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 font-mono"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-200 transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleSaveApiKey}
                icon={saved ? <Check className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                variant={saved ? 'success' : 'primary'}
              >
                {saved ? 'Saved!' : 'Save API Key'}
              </Button>
              {apiKey && (
                <Button variant="ghost" onClick={() => { setApiKey(''); updateSettings({ openaiApiKey: undefined }); toast('API key removed'); }}>
                  Remove Key
                </Button>
              )}
            </div>

            <p className="text-xs text-surface-500">
              Your API key is stored locally in your browser and never sent to any server other than OpenAI.
              Get your key at{' '}
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300">
                platform.openai.com
              </a>
            </p>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-surface-800 border border-surface-700 flex items-center justify-center">
              <Bell className="w-5 h-5 text-surface-400" />
            </div>
            <div>
              <h2 className="font-semibold text-surface-100">Notifications</h2>
              <p className="text-sm text-surface-400">Manage how Momentum keeps you on track</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-800/50">
            <div>
              <p className="text-sm font-medium text-surface-200">Daily Reminders</p>
              <p className="text-xs text-surface-500 mt-0.5">Get reminded to check in on your goals</p>
            </div>
            <button
              onClick={() => {
                updateSettings({ notifications: !settings.notifications });
                toast(`Notifications ${!settings.notifications ? 'enabled' : 'disabled'}`);
              }}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${settings.notifications ? 'bg-brand-600' : 'bg-surface-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${settings.notifications ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </Card>

        {/* Data Management */}
        <Card>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-surface-800 border border-surface-700 flex items-center justify-center">
              <Download className="w-5 h-5 text-surface-400" />
            </div>
            <div>
              <h2 className="font-semibold text-surface-100">Data Management</h2>
              <p className="text-sm text-surface-400">Export or manage your Momentum data</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-800/50">
              <div>
                <p className="text-sm font-medium text-surface-200">Export Data</p>
                <p className="text-xs text-surface-500 mt-0.5">Download all your goals as a JSON backup</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleExport} icon={<Download className="w-4 h-4" />}>
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-800/50">
              <div>
                <p className="text-sm font-medium text-surface-200">Import Data</p>
                <p className="text-xs text-surface-500 mt-0.5">Restore from a Momentum backup file</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleImport} icon={<Upload className="w-4 h-4" />}>
                Import
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div>
                <p className="text-sm font-medium text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Clear All Data
                </p>
                <p className="text-xs text-surface-500 mt-0.5">Permanently delete all goals and history</p>
              </div>
              <Button variant="danger" size="sm" onClick={handleClearData} icon={<Trash2 className="w-4 h-4" />}>
                Clear All
              </Button>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-surface-100">Momentum</h2>
              <p className="text-sm text-surface-400">AI-Powered Goal Execution Planner · v1.0.0</p>
              <p className="text-xs text-surface-500 mt-1">Built with React, TypeScript, and love ❤️</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
