import React, { useState } from 'react';
import { Sun, Moon, Sparkles, Monitor } from 'lucide-react';
import { ThemeMode } from '../hooks/useTheme';

interface ThemeSwitcherProps {
  themeMode: ThemeMode;
  onChangeMode: (mode: ThemeMode) => void;
  variant?: 'floating' | 'inline';
}

const MODES: { id: ThemeMode; label: string; icon: React.ElementType }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'blush', label: 'Blush', icon: Sparkles },
  { id: 'system', label: 'Auto', icon: Monitor },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  themeMode,
  onChangeMode,
  variant = 'floating',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const current = MODES.find((m) => m.id === themeMode) || MODES[0];
  const CurrentIcon = current.icon;

  if (variant === 'inline') {
    return (
      <div
        className="inline-flex items-center gap-1 p-1 rounded-full border border-[var(--aura-border)] bg-[var(--aura-surface-alt)]"
        role="group"
        aria-label="Appearance mode"
      >
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = themeMode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChangeMode(m.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                active
                  ? 'bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)] shadow-xs'
                  : 'text-[var(--aura-text-muted)] hover:text-[var(--aura-text-primary)]'
              }`}
              aria-pressed={active}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {isOpen && (
        <div
          className="p-1.5 rounded-2xl border border-[var(--aura-border)] bg-[var(--aura-surface)] shadow-xl flex flex-col gap-1 min-w-[140px]"
          role="menu"
          aria-label="Choose theme mode"
        >
          <span className="px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold text-[var(--aura-text-faint)]">
            Display Mode
          </span>
          {MODES.map((m) => {
            const Icon = m.icon;
            const active = themeMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  onChangeMode(m.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[var(--aura-btn-primary)] text-[var(--aura-btn-primary-text)]'
                    : 'text-[var(--aura-text-secondary)] hover:bg-[var(--aura-surface-alt)] hover:text-[var(--aura-text-primary)]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5" />
                  <span>{m.label}</span>
                </span>
                {active && <span className="text-[10px] opacity-80">On</span>}
              </button>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[var(--aura-border-strong)] bg-[var(--aura-surface)] text-[var(--aura-text-primary)] shadow-md hover:shadow-lg transition-all cursor-pointer text-xs font-medium whitespace-nowrap"
        aria-expanded={isOpen}
        aria-label={`Theme mode: ${current.label}. Click to switch mode.`}
      >
        <CurrentIcon className="w-3.5 h-3.5 text-[var(--aura-accent)]" />
        <span>Mode: {current.label}</span>
      </button>
    </div>
  );
};
