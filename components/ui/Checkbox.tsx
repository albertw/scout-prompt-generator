import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, checked, onChange, ...props }, ref) => {
    return (
      <label className={cn('flex items-start space-x-3 cursor-pointer', className)}>
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="text-sm">
            {label && (
              <span className="font-medium text-gray-700">{label}</span>
            )}
            {description && (
              <p className="text-gray-500">{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
