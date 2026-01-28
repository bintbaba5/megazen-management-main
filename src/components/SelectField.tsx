import useColorMode from "@/hooks/useColorMode";
import React, { useEffect, useState } from "react";
import Select from "react-select";

interface OptionType {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  options: OptionType[];
  value: OptionType | OptionType[] | null;
  placeholder: string;
  onChange: (selectedOption: OptionType | OptionType[] | null) => void;
  required?: boolean;
  isMulti?: boolean; // Add the isMulti prop to support multiple selections
  isDisabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  options,
  value,
  placeholder = "",
  onChange,
  required = false,
  isMulti = false, // Default is false (single selection)
  isDisabled = false,
}) => {
  const { colorMode } = useColorMode(); // Use the useColorMode hook
  const [darkMode, setDarkMode] = useState(colorMode === "dark"); // Local state to track dark mode
  // Update darkMode when colorMode changes (e.g., from light to dark theme)
  useEffect(() => {
    setDarkMode(colorMode === "dark");
  }, [colorMode]);

  // Custom styles for react-select, adjusting based on darkMode
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#24303F" : "#FFFFFF", // Dark or light background
      borderColor: state.isFocused
        ? darkMode
          ? "#3C50E0"
          : "#3C50E0"
        : darkMode
        ? "#2E3A47"
        : "#E2E8F0", // Blue border on focus
      color: darkMode ? "#FFFFFF" : "#1C2434", // Text color based on theme
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      minHeight: "38px", // Adjust control height
      height: "38px",
      fontSize: "14px",
      padding: "0 10px", // Padding for control
      placeholderColor: darkMode ? "#FFFFFF" : "#9CA3AF", // Placeholder color based on theme
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#24303F" : "#FFFFFF", // Dark or light menu background
      color: darkMode ? "#FFFFFF" : "#1C2434", // White or dark text color
      borderRadius: "4px", // Optional border radius
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? darkMode
          ? "#259AE6"
          : "#3C50E0" // Blue highlight when focused
        : state.isSelected
        ? darkMode
          ? "#1A222C"
          : "#E5E7EB" // Dark background when selected in dark mode, light in light mode
        : darkMode
        ? "#24303F"
        : "#FAFAFA", // Default dark or light background
      color: state.isSelected ? "#FFFFFF" : darkMode ? "#AEB7C0" : "#1C2434", // Light or dark text when selected
      cursor: "pointer",
      padding: "8px 12px", // Padding for options
      hover: {
        backgroundColor: darkMode ? "#3C50E0" : "#3C50E0", // Blue highlight on hover
        color: "#FFFFFF", // White text on hover
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: darkMode ? "#3C50E0" : "#3C50E0", // Blue background for selected items
      color: "#FFFFFF", // White text in selected items
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#FFFFFF", // White text color in selected items
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#FFFFFF", // White remove button
      ":hover": {
        backgroundColor: darkMode ? "#FFBA00" : "#FFBA00", // Yellow hover effect for remove button
        color: "#FFFFFF", // Keep white text on hover
      },
    }),
  };

  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={id}
      >
        {label}
      </label>
      <Select
        id={id}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        isMulti={isMulti} // Enable multi-select when needed
        classNamePrefix="react-select"
        required={required}
        placeholder={placeholder}
        isDisabled={isDisabled}
        styles={customStyles} // Apply custom styles
      />
    </div>
  );
};

export default SelectField;
