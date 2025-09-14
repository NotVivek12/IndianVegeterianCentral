import React from 'react';
import { ExclamationCircleIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

type BadgeType = 'safe' | 'caution' | 'avoid';

interface DietaryBadgeProps {
  type: BadgeType;
  text: string;
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ type, text }) => {
  const badgeStyles = {
    safe: 'bg-green-100 text-green-800',
    caution: 'bg-yellow-100 text-yellow-800',
    avoid: 'bg-red-100 text-red-800',
  };

  const icons = {
    safe: CheckCircleIcon,
    caution: ExclamationCircleIcon,
    avoid: XCircleIcon,
  };

  const Icon = icons[type];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[type]}`}>
      <Icon className="mr-1.5 h-4 w-4" />
      {text}
    </span>
  );
};

export default DietaryBadge;
