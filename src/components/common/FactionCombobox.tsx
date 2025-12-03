import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DUNE_FACTIONS } from '@/lib/constants';

interface FactionComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function FactionCombobox({ value, onChange, placeholder = '搜尋或選擇角色' }: FactionComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 過濾角色列表
  const filteredFactions = DUNE_FACTIONS.filter(faction =>
    faction.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 重置高亮索引當過濾結果改變時
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  const handleSelect = (faction: string) => {
    onChange(faction);
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      e.preventDefault();
      setIsOpen(true);
      return;
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredFactions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredFactions[highlightedIndex]) {
          handleSelect(filteredFactions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  const displayValue = value || searchTerm;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={isOpen ? searchTerm : displayValue}
        onChange={e => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-dune-sky text-dune-sand px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dune-spice"
        autoComplete="off"
      />

      {/* 清除按鈕 */}
      {value && !isOpen && (
        <button
          onClick={() => {
            onChange('');
            setSearchTerm('');
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dune-sand/50 hover:text-dune-sand"
        >
          ✕
        </button>
      )}

      {/* 下拉選單 */}
      <AnimatePresence>
        {isOpen && filteredFactions.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-dune-deep border border-dune-sand/20 rounded-lg shadow-xl max-h-64 overflow-y-auto"
          >
            {filteredFactions.map((faction, index) => (
              <button
                key={faction}
                onClick={() => handleSelect(faction)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full text-left px-4 py-3 font-rajdhani transition-colors ${
                  index === highlightedIndex
                    ? 'bg-dune-spice text-white'
                    : 'text-dune-sand hover:bg-dune-sky'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${
                  index === filteredFactions.length - 1 ? 'rounded-b-lg' : ''
                }`}
              >
                {faction}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 無搜尋結果 */}
      {isOpen && searchTerm && filteredFactions.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 w-full mt-2 bg-dune-deep border border-dune-sand/20 rounded-lg shadow-xl p-4 text-center text-dune-sand/60 font-rajdhani"
        >
          找不到匹配的角色
        </motion.div>
      )}
    </div>
  );
}
