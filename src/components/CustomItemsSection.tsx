import React, { useState } from 'react';
import { Plus, Trash2, Layers, Check, Calculator } from 'lucide-react';
import { AdditionalCostItem } from '../types';
import { formatVND } from '../utils/formatters';

interface CustomItemsSectionProps {
  items: AdditionalCostItem[];
  onChange: (items: AdditionalCostItem[]) => void;
}

export const CustomItemsSection: React.FC<CustomItemsSectionProps> = ({ items, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('m²');
  const [newItemQuantity, setNewItemQuantity] = useState<number | ''>('');
  const [newItemUnitPrice, setNewItemUnitPrice] = useState<number | ''>('');
  const [newItemNote, setNewItemNote] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: AdditionalCostItem = {
      id: 'custom_' + Date.now(),
      name: newItemName.trim(),
      unit: newItemUnit.trim() || 'hạng mục',
      quantity: typeof newItemQuantity === 'number' ? newItemQuantity : 1,
      unitPrice: typeof newItemUnitPrice === 'number' ? newItemUnitPrice : 0,
      note: newItemNote.trim() || undefined,
    };

    onChange([...items, newItem]);
    setNewItemName('');
    setNewItemQuantity('');
    setNewItemUnitPrice('');
    setNewItemNote('');
  };

  const handleRemoveItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof AdditionalCostItem, value: any) => {
    onChange(
      items.map(item => item.id === id ? { ...item, [field]: value } : item)
    );
  };

  const totalCustom = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden">
      <div 
        className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-600" />
          <h3 className="font-bold text-sm text-slate-800">
            Hạng Mục Công Trình Bổ Sung & Phụ Trợ
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
            {items.length} mục
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">
            Tổng phụ trợ: <span className="text-amber-800">{formatVND(totalCustom)} đ</span>
          </span>
          <button 
            type="button" 
            className="text-xs font-medium text-amber-600 hover:text-amber-700"
          >
            {isOpen ? 'Thu gọn' : 'Mở rộng'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Quick preset add buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
            <span className="font-medium text-slate-500">Thêm nhanh:</span>
            {[
              { name: 'Đào móng đất cấp 3', unit: 'm³', quantity: 20, price: 180000 },
              { name: 'Xây tường rào bao quanh', unit: 'm²', quantity: 30, price: 650000 },
              { name: 'Hố ga & bể phốt tự hoại', unit: 'cái', quantity: 1, price: 12000000 },
              { name: 'Chi phí xin phép xây dựng', unit: 'gói', quantity: 1, price: 8000000 },
              { name: 'Cổng sắt hộp sơn tĩnh điện', unit: 'bộ', quantity: 1, price: 15000000 },
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange([
                    ...items,
                    {
                      id: 'preset_' + Date.now() + '_' + idx,
                      name: preset.name,
                      unit: preset.unit,
                      quantity: preset.quantity,
                      unitPrice: preset.price,
                    }
                  ]);
                }}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded transition-colors"
              >
                + {preset.name}
              </button>
            ))}
          </div>

          {/* Table of custom items */}
          {items.length > 0 ? (
            <div className="overflow-x-auto border border-slate-200 rounded-md">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Tên hạng mục</th>
                    <th className="p-2.5 w-20 text-center">ĐVT</th>
                    <th className="p-2.5 w-24 text-right">Khối lượng</th>
                    <th className="p-2.5 w-32 text-right">Đơn giá (đ)</th>
                    <th className="p-2.5 w-32 text-right">Thành tiền (đ)</th>
                    <th className="p-2.5 w-12 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const lineTotal = item.quantity * item.unitPrice;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                            className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded font-medium focus:ring-1 focus:ring-amber-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleUpdateItem(item.id, 'unit', e.target.value)}
                            className="w-full text-center px-1 py-1 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-amber-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            step="0.1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full text-right px-1.5 py-1 text-xs border border-slate-200 rounded font-medium focus:ring-1 focus:ring-amber-500"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            value={formatVND(item.unitPrice)}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, '');
                              handleUpdateItem(item.id, 'unitPrice', parseInt(raw, 10) || 0);
                            }}
                            className="w-full text-right px-1.5 py-1 text-xs border border-slate-200 rounded font-medium focus:ring-1 focus:ring-amber-500"
                          />
                        </td>
                        <td className="p-2 text-right font-bold text-slate-800">
                          {formatVND(lineTotal)}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                            title="Xóa dòng này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic text-center py-2">
              Chưa có hạng mục bổ sung nào. Bạn có thể thêm các chi phí phụ trợ khác tại đây nếu cần.
            </p>
          )}

          {/* Form to add item */}
          <form onSubmit={handleAddItem} className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-end">
            <div className="sm:col-span-4">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Tên hạng mục mới:
              </label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="VD: Cổng rào, Bể ngầm..."
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Đơn vị (ĐVT):
              </label>
              <input
                type="text"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                placeholder="m², cái, bộ..."
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Khối lượng:
              </label>
              <input
                type="number"
                step="0.5"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value === '' ? '' : parseFloat(e.target.value))}
                placeholder="1"
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Đơn giá (VNĐ):
              </label>
              <input
                type="text"
                value={newItemUnitPrice === '' ? '' : formatVND(Number(newItemUnitPrice))}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setNewItemUnitPrice(raw === '' ? '' : parseInt(raw, 10));
                }}
                placeholder="0"
                className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-1">
              <button
                type="submit"
                className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-xs flex items-center justify-center transition-colors shadow-xs"
                title="Thêm hạng mục"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
