import { CheckCircle, Clock, FlaskConical } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface StatusBadgeProps {
  status: 'verified' | 'pending-review' | 'demo';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useTranslation();
  
  const config = {
    verified: { label: t.common.verified, icon: CheckCircle, className: 'bg-forest-100 text-forest-800 border-forest-300' },
    'pending-review': { label: t.common.pendingReview, icon: Clock, className: 'bg-amber-100 text-amber-800 border-amber-300' },
    demo: { label: t.common.demo, icon: FlaskConical, className: 'bg-blue-100 text-blue-800 border-blue-300' },
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
