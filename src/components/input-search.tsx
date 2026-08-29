"use client";

import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5"; // Ícone mais moderno para limpar

interface InputSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  placeholder?: string;
  className?: string;
}

const InputSearch: React.FC<InputSearchProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  onFocus,
  name,
  placeholder = "Pesquisar produtos...",
  className = "",
}) => {
  const router = useRouter();

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSearch = () => {
    onSearch();
    if (value.trim()) {
      const slug = slugify(value);
      router.push(`/list?value=${slug}`);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative flex items-center group">
        {/* Ícone de Lupa Decorativo (Esquerda) */}
        <div className="absolute left-4 text-gray-400 group-focus-within:text-green-500 transition-colors">
          <FaSearch size={16} />
        </div>

        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onFocus={onFocus}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full bg-gray-100 dark:bg-gray-800 border-none rounded-2xl py-3 pl-11 pr-12 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-700 transition-all outline-none text-sm md:text-base shadow-sm"
          placeholder={placeholder}
        />

        {/* Botão de Ação (Direita) */}
        <div className="absolute right-2 flex items-center">
          {value ? (
            <button
              type="button"
              onClick={onClear}
              className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              aria-label="Clear search"
            >
              <IoCloseCircle size={22} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSearch}
              className="hidden sm:flex p-2 mr-1 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all active:scale-95 items-center justify-center"
              aria-label="Submit Search"
            >
              <FaSearch size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputSearch;