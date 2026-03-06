'use client';

import {
  forwardRef,
  useRef,
  ChangeEvent,
  FocusEvent,
  ComponentProps,
} from 'react';
import { UseFormTrigger } from 'react-hook-form';
import { SignupFormInputs } from '@/lib/validations';
import { IMaskInput } from 'react-imask';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps
  extends Omit<ComponentProps<'input'>, 'onChange' | 'value'> {
  value?: string;
  onChange: (eventOrValue: ChangeEvent<HTMLInputElement> | string) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
  name: string;
  trigger?: UseFormTrigger<SignupFormInputs>;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onChange,
      onBlur,
      name,
      className,
      placeholder,
      trigger,
      ...props
    },
    ref,
  ) => {
    const dateInputRef = useRef<HTMLInputElement>(null);

    const openCalendar = () => {
      dateInputRef.current?.showPicker();
    };

    const handleChange = (newValue: string) => {
      onChange(newValue);
      trigger?.(name as keyof SignupFormInputs);
    };

    const handleMaskChange = (value: string) => {
      handleChange(value);
    };

    const handleDateChangeFromCalendar = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value) {
        const [year, month, day] = e.target.value.split('-');
        const formattedDate = `${day}/${month}/${year}`;
        handleChange(formattedDate);
      }
    };

    return (
      <div className='relative group'>
        <IMaskInput
          mask='00/00/0000'
          value={value}
          onAccept={handleMaskChange}
          onBlur={onBlur}
          {...props}
          ref={ref as React.Ref<HTMLInputElement>}
          id={name}
          name={name}
          placeholder={placeholder}
          className={cn('w-full pr-10', className)}
        />

        <button
          type='button'
          onClick={openCalendar}
          className='absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-400 transition-colors group-focus-within:text-primary hover:text-primary'
          aria-label='Abrir calendário'
        >
          <CalendarIcon className='h-5 w-5' aria-hidden='true' />
        </button>

        <input
          ref={dateInputRef}
          type='date'
          onChange={handleDateChangeFromCalendar}
          className='sr-only'
        />
      </div>
    );
  },
);

DatePicker.displayName = 'DatePicker';
