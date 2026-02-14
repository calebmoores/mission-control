'use client';

import Link from 'next/link';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  href?: string;
  onClick?: () => void;
}

const defaultActions: QuickAction[] = [
  { id: 'new-mission', label: 'NEW MISSION', icon: '+', color: 'cyan' },
  { id: 'content-review', label: 'REVIEW', icon: '📝', color: 'purple', href: '/review' },
  { id: 'pause-all', label: 'PAUSE ALL', icon: '||', color: 'yellow' },
  { id: 'emergency', label: 'EMERGENCY', icon: '!', color: 'red' },
  { id: 'reports', label: 'REPORTS', icon: '📊', color: 'green' },
  { id: 'refresh', label: 'REFRESH', icon: '↻', color: 'green' },
];

interface QuickActionsProps {
  actions?: QuickAction[];
  onAction?: (actionId: string) => void;
}

export default function QuickActions({ actions = defaultActions, onAction }: QuickActionsProps) {
  const colorClasses: Record<string, { bg: string; border: string; text: string; hover: string; glow: string }> = {
    cyan: {
      bg: 'bg-cyan-400/10',
      border: 'border-cyan-400',
      text: 'text-cyan-400',
      hover: 'hover:bg-cyan-400/20',
      glow: 'hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]'
    },
    yellow: {
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400',
      text: 'text-yellow-400',
      hover: 'hover:bg-yellow-400/20',
      glow: 'hover:shadow-[0_0_15px_rgba(250,204,21,0.4)]'
    },
    red: {
      bg: 'bg-red-400/10',
      border: 'border-red-400',
      text: 'text-red-400',
      hover: 'hover:bg-red-400/20',
      glow: 'hover:shadow-[0_0_15px_rgba(248,113,113,0.4)]'
    },
    purple: {
      bg: 'bg-purple-400/10',
      border: 'border-purple-400',
      text: 'text-purple-400',
      hover: 'hover:bg-purple-400/20',
      glow: 'hover:shadow-[0_0_15px_rgba(192,132,252,0.4)]'
    },
    gray: {
      bg: 'bg-gray-400/10',
      border: 'border-gray-400',
      text: 'text-gray-400',
      hover: 'hover:bg-gray-400/20',
      glow: 'hover:shadow-[0_0_15px_rgba(156,163,175,0.4)]'
    },
    green: {
      bg: 'bg-green-400/10',
      border: 'border-green-400',
      text: 'text-green-400',
      hover: 'hover:bg-green-400/20',
      glow: 'hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]'
    },
  };

  const handleClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick();
    }
    onAction?.(action.id);
  };

  const renderActionButton = (action: QuickAction, index: number) => {
    const colors = colorClasses[action.color] || colorClasses.gray;
    const buttonContent = (
      <>
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

        {/* Corner accents */}
        <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${colors.border}`} />
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${colors.border}`} />

        {/* Content */}
        <div className="relative z-10">
          <div className={`font-pixel text-2xl ${colors.text} mb-2`}>
            {action.icon}
          </div>
          <div className={`font-terminal text-xs ${colors.text}`}>
            {action.label}
          </div>
        </div>

        {/* Hover glow */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${colors.bg} blur-xl`} />
      </>
    );

    if (action.href) {
      return (
        <Link
          key={action.id}
          href={action.href}
          className={`
            relative p-4 border-2 ${colors.border} ${colors.bg}
            ${colors.hover} ${colors.glow}
            transition-all duration-200 active:scale-95
            group overflow-hidden animate-fade-in-up block text-center
          `}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          {buttonContent}
        </Link>
      );
    }

    return (
      <button
        key={action.id}
        onClick={() => handleClick(action)}
        className={`
          relative p-4 border-2 ${colors.border} ${colors.bg}
          ${colors.hover} ${colors.glow}
          transition-all duration-200 active:scale-95
          group overflow-hidden animate-fade-in-up
        `}
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {buttonContent}
      </button>
    );
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-pixel text-sm text-purple-400">QUICK ACTIONS</h2>
        <span className="font-terminal text-xs text-gray-500">CMD READY</span>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => renderActionButton(action, index))}
      </div>

      {/* Command Input Simulation */}
      <div className="mt-4 border-2 border-gray-700 bg-gray-900/50 p-3">
        <div className="flex items-center gap-2">
          <span className="font-terminal text-green-400">$</span>
          <span className="font-terminal text-gray-400 text-sm">mission_control</span>
          <span className="w-2 h-4 bg-cyan-400 animate-blink" />
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        {[
          { key: 'F1', desc: 'HELP' },
          { key: 'F5', desc: 'REFRESH' },
          { key: 'ESC', desc: 'BACK' },
        ].map((shortcut) => (
          <div key={shortcut.key} className="bg-gray-800/50 px-2 py-1">
            <div className="font-pixel text-xs text-gray-400">{shortcut.key}</div>
            <div className="font-terminal text-xs text-gray-600">{shortcut.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
