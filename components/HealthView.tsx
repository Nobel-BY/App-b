
import React, { useState, useEffect } from 'react';
import { HealthMetrics } from '../types';
import { Icons } from '../constants';

interface HealthViewProps {
  onAddClick: () => void;
}

const HealthView: React.FC<HealthViewProps> = ({ onAddClick }) => {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    height: 170,
    weight: 65,
    gender: 'male',
    lastUpdated: Date.now()
  });
  const [history, setHistory] = useState<HealthMetrics[]>([]);
  
  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);

  // History Expansion State
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const HISTORY_LIMIT = 7;

  // Load from local storage on mount
  useEffect(() => {
    const savedMetrics = localStorage.getItem('health_metrics');
    const savedHistory = localStorage.getItem('health_history');
    
    if (savedMetrics) {
        try { setMetrics(JSON.parse(savedMetrics)); } catch {}
    }
    if (savedHistory) {
        try { setHistory(JSON.parse(savedHistory)); } catch {}
    }
  }, []);

  // Selection Logic
  const toggleSelection = (timestamp: number) => {
    setConfirmDelete(false); // Reset delete confirmation on selection change
    const newSelected = new Set(selectedItems);
    if (newSelected.has(timestamp)) {
        newSelected.delete(timestamp);
    } else {
        newSelected.add(timestamp);
    }
    setSelectedItems(newSelected);
  };

  const toggleAll = () => {
    setConfirmDelete(false); // Reset delete confirmation
    if (selectedItems.size === history.length) {
        setSelectedItems(new Set());
    } else {
        setSelectedItems(new Set(history.map(h => h.lastUpdated)));
    }
  };

  const deleteSelected = () => {
    if (selectedItems.size === 0) return;
    
    if (confirmDelete) {
        // Perform delete
        const updatedHistory = history.filter(h => !selectedItems.has(h.lastUpdated));
        setHistory(updatedHistory);
        localStorage.setItem('health_history', JSON.stringify(updatedHistory));
        
        setIsSelectionMode(false);
        setSelectedItems(new Set());
        setConfirmDelete(false);
        
        // Update current metrics to latest of remaining history if exists
        if (updatedHistory.length > 0) {
            setMetrics(updatedHistory[0]);
            localStorage.setItem('health_metrics', JSON.stringify(updatedHistory[0]));
        }
    } else {
        // First click: Ask for confirmation
        setConfirmDelete(true);
        // Auto-reset after 3 seconds if not confirmed
        setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const cancelSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedItems(new Set());
    setConfirmDelete(false);
  };

  const calculateBMI = (h: number, w: number) => {
    const heightM = h / 100;
    if (heightM <= 0) return 0;
    return (w / (heightM * heightM)).toFixed(1);
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('zh-CN', {
        month: '2-digit',
        day: '2-digit',
    }).format(new Date(ts));
  };

  const getReferenceRanges = () => {
    const isMale = metrics.gender !== 'female';
    return {
        bmi: "18.5 - 23.9",
        bodyFat: isMale ? "10% - 20%" : "20% - 30%",
        muscle: isMale ? "> 40%" : "> 30%",
        visceral: "1 - 9",
    };
  };

  const ranges = getReferenceRanges();
  const currentBMI = calculateBMI(metrics.height, metrics.weight);

  const MetricCard = ({ label, value, unit, range, highlight, icon }: { label: string, value: string | number, unit?: string, range?: string, highlight?: boolean, icon?: React.ReactNode }) => (
    <div className={`p-5 rounded-[2rem] border flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${highlight ? 'col-span-2 bg-emerald-500 border-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-white border-gray-100 hover:shadow-lg hover:shadow-gray-100/50'}`}>
        {highlight && <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>}
        <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
                {icon && <div className={`p-1.5 rounded-lg ${highlight ? 'bg-white/20' : 'bg-gray-50'}`}>{icon}</div>}
                <span className={`text-xs font-bold ${highlight ? 'text-emerald-50' : 'text-gray-400'}`}>{label}</span>
            </div>
            {range && <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${highlight ? 'bg-white/20 text-white' : 'bg-gray-50 text-gray-400'}`}>{range}</span>}
        </div>
        <div className="mt-4 z-10">
            <span className={`font-black tracking-tighter ${highlight ? 'text-4xl' : 'text-3xl text-gray-800'}`}>{value}</span>
            {unit && <span className={`text-xs ml-1 font-bold ${highlight ? 'text-emerald-100' : 'text-gray-400'}`}>{unit}</span>}
        </div>
    </div>
  );

  const displayedHistory = isHistoryExpanded ? history : history.slice(0, HISTORY_LIMIT);

  return (
    <div className="pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-6 px-6 h-full overflow-y-auto no-scrollbar bg-[#fafafa]">
       <header className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tighter">健康档案</h1>
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">数据监控</p>
        </div>
        <button 
            onClick={onAddClick}
            className="text-white bg-gray-900 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-gray-900/20 active:scale-95 transition-all hover:bg-gray-800"
        >
            记录
        </button>
      </header>

      {/* Comprehensive Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <MetricCard 
            label="BMI 指数" 
            value={currentBMI} 
            range={ranges.bmi}
            highlight={true}
            icon={<Icons.Health className="w-4 h-4 text-emerald-500" />}
        />
        <MetricCard 
            label="当前体重" 
            value={metrics.weight} 
            unit="kg" 
        />
        <MetricCard 
            label="体脂率" 
            value={metrics.bodyFatPercentage || '--'} 
            unit="%" 
            range={ranges.bodyFat}
        />
        <MetricCard 
            label="肌肉含量" 
            value={metrics.muscleMass || '--'} 
            unit="kg" 
            range={ranges.muscle} 
        />
         <MetricCard 
            label="内脏脂肪" 
            value={metrics.visceralFatLevel || '--'} 
            unit="级"
            range={ranges.visceral}
        />
      </div>

      {/* History Table with Selection Mode */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4 min-h-[32px] px-1">
             <h3 className="text-gray-900 font-extrabold flex items-center gap-2 text-lg tracking-tight">
                历史记录
            </h3>
            {history.length > 0 && (
                <div className="flex items-center gap-2">
                    {isSelectionMode ? (
                        <>
                             <button 
                                type="button"
                                onClick={deleteSelected}
                                disabled={selectedItems.size === 0}
                                className={`text-[10px] px-3 py-1.5 rounded-full font-bold transition-all transform duration-200 ${
                                    selectedItems.size > 0 
                                        ? (confirmDelete 
                                            ? 'bg-red-600 text-white shadow-md scale-105' 
                                            : 'bg-red-500 text-white shadow-md shadow-red-500/20') 
                                        : 'bg-gray-100 text-gray-300'
                                }`}
                            >
                                {confirmDelete ? '确定删除?' : `删除 (${selectedItems.size})`}
                            </button>
                            <button 
                                onClick={cancelSelectionMode} 
                                className="text-[10px] text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full font-bold transition-colors"
                            >
                                取消
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => setIsSelectionMode(true)} 
                            className="text-[10px] text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full font-bold transition-colors"
                        >
                            管理
                        </button>
                    )}
                </div>
            )}
        </div>
       
        {history.length === 0 ? (
            <div className="text-center py-12 text-gray-300 bg-white rounded-[2rem] border border-gray-50 shadow-sm flex flex-col items-center">
                <Icons.Clock className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-bold">暂无数据</span>
            </div>
        ) : (
            <div className="bg-white rounded-[2rem] border border-gray-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-center table-fixed">
                        <thead className="bg-gray-50/50 text-gray-400 text-[9px] font-bold uppercase tracking-widest border-b border-gray-50">
                            <tr>
                                {isSelectionMode && (
                                    <th className="py-4 pl-3 w-8">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedItems.size === history.length && history.length > 0}
                                            onChange={toggleAll}
                                            className="rounded text-emerald-500 focus:ring-emerald-500 border-gray-300 w-4 h-4 bg-gray-100"
                                        />
                                    </th>
                                )}
                                <th className="py-4 font-extrabold w-[18%]">日期</th>
                                <th className="py-4 font-extrabold">身高</th>
                                <th className="py-4 font-extrabold">体重</th>
                                <th className="py-4 font-extrabold">BMI</th>
                                <th className="py-4 font-extrabold">体脂</th>
                                <th className="py-4 font-extrabold">肌肉</th>
                                <th className="py-4 font-extrabold pr-2">内脏</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-xs font-semibold">
                            {displayedHistory.map((record, index) => {
                                const isSelected = selectedItems.has(record.lastUpdated);
                                return (
                                    <tr 
                                        key={record.lastUpdated + index} 
                                        className={`transition-colors ${isSelected ? 'bg-emerald-50/60' : 'hover:bg-gray-50/50'} ${isSelectionMode ? 'cursor-pointer' : ''}`}
                                        onClick={() => isSelectionMode && toggleSelection(record.lastUpdated)}
                                    >
                                        {isSelectionMode && (
                                            <td className="py-4 pl-3" onClick={(e) => e.stopPropagation()}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={isSelected}
                                                    onChange={() => toggleSelection(record.lastUpdated)}
                                                    className="rounded text-emerald-500 focus:ring-emerald-500 border-gray-300 w-4 h-4"
                                                />
                                            </td>
                                        )}
                                        <td className="py-4 text-gray-500">
                                            {formatDate(record.lastUpdated)}
                                        </td>
                                        <td className="py-4 text-gray-500 font-medium">
                                            {record.height}
                                        </td>
                                        <td className="py-4 font-bold text-gray-900">
                                            {record.weight}
                                        </td>
                                        <td className="py-4 text-gray-600">
                                            {calculateBMI(record.height, record.weight)}
                                        </td>
                                        <td className="py-4 text-gray-400">
                                            {record.bodyFatPercentage || '-'}
                                        </td>
                                        <td className="py-4 text-gray-400">
                                            {record.muscleMass || '-'}
                                        </td>
                                        <td className="py-4 text-gray-400 pr-2">
                                            {record.visceralFatLevel || '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                 {history.length > HISTORY_LIMIT && (
                    <button 
                        onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                        className="w-full py-4 text-center text-[10px] text-gray-400 hover:bg-gray-50 hover:text-emerald-600 transition-colors border-t border-gray-50 font-bold uppercase tracking-wider"
                    >
                        {isHistoryExpanded ? '收起' : `查看全部 (${history.length})`}
                    </button>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default HealthView;
