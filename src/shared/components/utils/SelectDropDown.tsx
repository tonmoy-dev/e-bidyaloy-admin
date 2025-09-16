import { useEffect, useState } from 'react';
import Select from 'react-select';

export type Option = {
  value: string | number;
  label: string;
};

export interface SelectProps {
  options: Option[];
  defaultValue?: Option;
  className?: string;
  styles?: any;
  value?: Option | null;
  onChange?: (option: Option | null) => void;
  placeholder?: string | null;
}

const SelectDropDown: React.FC<SelectProps> = ({
  options,
  defaultValue,
  className,
  styles,
  value,
  onChange,
  placeholder = 'Select',
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(defaultValue || null);

  const handleChange = (option: Option | null) => {
    setSelectedOption(option);
    onChange?.(option); // notify parent
  };

  // keep state in sync with defaultValue
  useEffect(() => {
    setSelectedOption(defaultValue || null);
  }, [defaultValue]);

  return (
    <Select
      classNamePrefix="react-select"
      className={className}
      styles={styles}
      options={options}
      value={value ?? selectedOption} // controlled (if provided) OR internal
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export default SelectDropDown;
