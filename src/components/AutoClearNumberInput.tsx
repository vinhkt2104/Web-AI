import React, { useState, useEffect, useRef } from 'react';
import { formatVND } from '../utils/formatters';

interface AutoClearNumberInputProps {
  id: string;
  value: number;
  onChange: (val: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number | string;
  isCurrency?: boolean;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
}

/**
 * AutoClearNumberInput:
 * - Khi click/focus vào ô, tự động xóa trắng giá trị hiện tại để người dùng nhập ngay số mới
 *   mà không phải mất công xóa từng ký tự (tránh lỗi cộng dồn số 6680 khi muốn nhập 80).
 * - Hiển thị số cũ dưới dạng placeholder mờ mờ để người dùng dễ nhớ.
 * - Sử dụng type="text" và inputMode="decimal" để hỗ trợ hoàn hảo bộ gõ tiếng Việt (Unikey, EVKey),
 *   dấu phẩy/chấm bàn phím số numpad máy tính và bàn phím điện thoại.
 * - Tiền nhảy ngay lập tức theo từng phím gõ (real-time calculation).
 * - Khi click ra ngoài mà chưa gõ gì thì an toàn khôi phục lại giá trị cũ.
 */
export const AutoClearNumberInput: React.FC<AutoClearNumberInputProps> = ({
  id,
  value,
  onChange,
  unit,
  min = 0,
  max,
  step,
  isCurrency = false,
  className = '',
  placeholder,
  ariaLabel,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [localText, setLocalText] = useState<string>('');
  const prevValueRef = useRef<number>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cập nhật prevValueRef khi value từ bên ngoài thay đổi mà không focus
  useEffect(() => {
    if (!isFocused) {
      prevValueRef.current = value;
    }
  }, [value, isFocused]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    prevValueRef.current = value;
    // Tự động làm trống ô khi bấm vào để người dùng nhập ngay số mới như yêu cầu
    setLocalText('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (isCurrency) {
      // Đối với tiền tệ: chỉ lấy các chữ số
      const digitsOnly = raw.replace(/\D/g, '');
      if (!digitsOnly) {
        setLocalText('');
        onChange(0);
        return;
      }
      const num = parseInt(digitsOnly, 10);
      setLocalText(formatVND(num));
      onChange(isNaN(num) ? 0 : num);
    } else {
      // Đối với số đo (m², m, tầng): cho phép số thập phân, hỗ trợ cả dấu phẩy ',' và dấu chấm '.'
      // Chuẩn hóa dấu phẩy thành dấu chấm
      const normalized = raw.replace(/,/g, '.');
      // Chỉ giữ lại chữ số và tối đa một dấu chấm
      const cleaned = normalized.replace(/[^0-9.]/g, '');
      
      // Xử lý không cho nhập nhiều dấu chấm
      const parts = cleaned.split('.');
      const formatted = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;
      
      setLocalText(formatted);

      if (formatted === '' || formatted === '.') {
        onChange(0);
        return;
      }

      const parsed = parseFloat(formatted);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Nếu người dùng chỉ click vào rồi click ra mà không gõ gì thì khôi phục lại giá trị trước đó
    if (localText.trim() === '') {
      onChange(prevValueRef.current);
    }
  };

  // Xác định giá trị hiển thị trên ô input
  let displayValue = '';
  if (isFocused) {
    displayValue = localText;
  } else if (isCurrency) {
    displayValue = value ? formatVND(value) : (placeholder ? '' : '0');
  } else {
    displayValue = value === 0 ? (placeholder ? '' : '0') : value.toString();
  }

  // Placeholder gợi ý số cũ mờ mờ khi đang nhập
  const hintPlaceholder = placeholder || (isCurrency 
    ? (prevValueRef.current ? formatVND(prevValueRef.current) : '0')
    : (prevValueRef.current !== undefined ? prevValueRef.current.toString() : '0'));

  return (
    <div 
      className="flex items-center justify-end px-2 sm:px-3 py-1.5 gap-0.5 w-full cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode={isCurrency ? 'numeric' : 'decimal'}
        autoComplete="off"
        spellCheck="false"
        value={displayValue}
        placeholder={hintPlaceholder}
        aria-label={ariaLabel || id}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`w-full min-w-0 text-right bg-transparent focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1 text-xs sm:text-sm placeholder:text-slate-400 placeholder:italic transition-colors ${className}`}
      />
      {unit && (
        <span 
          className="text-[11px] sm:text-xs text-slate-600 shrink-0 select-none font-medium ml-1 pointer-events-none"
        >
          {unit}
        </span>
      )}
    </div>
  );
};
