import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDeadline(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `${diffDays} days left`;
}

export function getPriorityColor(priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW') {
  switch (priority) {
    case 'CRITICAL':
      return {
        bg: 'bg-rose-500/15',
        border: 'border-rose-500/40',
        text: 'text-rose-400',
        dot: 'bg-rose-500',
        badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      };
    case 'HIGH':
      return {
        bg: 'bg-amber-500/15',
        border: 'border-amber-500/40',
        text: 'text-amber-400',
        dot: 'bg-amber-500',
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-blue-500/15',
        border: 'border-blue-500/40',
        text: 'text-blue-400',
        dot: 'bg-blue-500',
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-500/15',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        dot: 'bg-emerald-500',
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      };
  }
}
