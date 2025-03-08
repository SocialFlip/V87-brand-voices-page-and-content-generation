import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function PasswordInput({ 
  id, 
  name, 
  value, 
  onChange, 
  placeholder = "Password",
  required = true,
  minLength,
  autoComplete
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        autoComplete={autoComplete}
        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? (
          <FiEyeOff className="h-5 w-5" />
        ) : (
          <FiEye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}