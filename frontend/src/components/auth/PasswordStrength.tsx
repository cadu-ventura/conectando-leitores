import { FaCheck } from 'react-icons/fa';
import { passwordRules } from '@/lib/validation.config';
import clsx from 'clsx';

interface PasswordStrengthProps {
  password?: string;
}

const Requirement = ({ met, text }: { met: boolean; text: string }) => (
  <li
    className={clsx(
      'flex',
      'items-center',
      'text-sm',
      'transition-colors',
      `${met ? 'text-green-500' : 'text-gray-500'}`,
    )}
  >
    <FaCheck
      className={clsx(
        'mr-2',
        'transition-opacity',
        `${met ? 'opacity-100' : 'opacity-30'}`,
      )}
    />
    {text}
  </li>
);

export default function PasswordStrength({
  password = '',
}: PasswordStrengthProps) {
  return (
    <div className={clsx('mt-2', 'space-y-1', 'text-xs', 'text-text-color')}>
      <p className={clsx('text-sm', 'font-semibold', 'pb-4')}>
        A senha deve ter:
      </p>
      <ul className={clsx('list-inside', 'pl-2')}>
        {passwordRules.map(rule => (
          <Requirement
            key={rule.id}
            met={rule.validator(password)}
            text={rule.text}
          />
        ))}
      </ul>
    </div>
  );
}
