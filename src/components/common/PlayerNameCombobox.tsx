import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerNameComboboxProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[]; // 從歷史記錄取得的玩家名稱
  placeholder?: string;
}

export default function PlayerNameCombobox({
  value,
  onChange,
  suggestions,
  placeholder = '搜尋或輸入玩家名稱'
}: PlayerNameComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 過濾玩家列表（去重並排序）
  // Reason: 過濾掉 null/undefined 值，避免 toLowerCase() 錯誤
  const uniqueSuggestions = Array.from(new Set(suggestions))
    .filter((name): name is string => name != null && name !== '') // 移除空值
    .sort();

  const filteredPlayers = uniqueSuggestions.filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSelect = (playerName: string) => {
    onChange(playerName);
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
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
          prev < filteredPlayers.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredPlayers[highlightedIndex]) {
          handleSelect(filteredPlayers[highlightedIndex]);
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
        onChange={handleInputChange}
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
        {isOpen && filteredPlayers.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-dune-deep border border-dune-sand/20 rounded-lg shadow-xl max-h-64 overflow-y-auto"
          >
            {filteredPlayers.map((playerName, index) => (
              <button
                key={playerName}
                onClick={() => handleSelect(playerName)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full text-left px-4 py-3 font-rajdhani transition-colors ${
                  index === highlightedIndex
                    ? 'bg-dune-spice text-white'
                    : 'text-dune-sand hover:bg-dune-sky'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${
                  index === filteredPlayers.length - 1 ? 'rounded-b-lg' : ''
                }`}
              >
                {playerName}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 提示訊息 */}
      {isOpen && searchTerm && filteredPlayers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-50 w-full mt-2 bg-dune-deep border border-dune-sand/20 rounded-lg shadow-xl p-4 text-center text-dune-sand/60 font-rajdhani"
        >
          按 Enter 新增「{searchTerm}」
        </motion.div>
      )}
    </div>
  );
}
