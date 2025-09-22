import { useEffect, useState } from 'react';
import Select from 'react-select';

export type Option = {
  value: string;
  label: string;
};

export interface CommonSelectProps {
  options: Option[];
  defaultValue?: Option;
  className?: string;
  styles?: any;
  value?: string; // ✅ comes from react-hook-form field.value
  onChange?: (value: string) => void; // ✅ comes from react-hook-form field.onChange
}

const CommonSelect: React.FC<CommonSelectProps> = ({
  options,
  defaultValue,
  className,
  value,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(defaultValue);

  const handleChange = (option: Option | null) => {
    setSelectedOption(option || undefined);
    if (onChange) {
      onChange(option ? option.value : ''); // ✅ propagate value to RHF
    }
  };

  useEffect(() => {
    if (value) {
      const matched = options.find((opt) => opt.value === value);
      setSelectedOption(matched);
    } else {
      setSelectedOption(defaultValue || undefined);
    }
  }, [value, defaultValue, options]);

  return (
    <Select
      classNamePrefix="react-select"
      className={className}
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Select"
    />
  );
};

export default CommonSelect;
