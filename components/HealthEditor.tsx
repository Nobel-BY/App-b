
import React, { useState, useEffect } from 'react';
import { HealthMetrics } from '../types';
import { Icons } from '../constants';

interface HealthEditorProps {
    onClose: () => void;
}

const HealthEditor: React.FC<HealthEditorProps> = ({ onClose }) => {
    const [metrics, setMetrics] = useState<HealthMetrics>({
        height: 170,
        weight: 65,
        gender: 'male',
        lastUpdated: Date.now()
    });
    const [recordDate, setRecordDate] = useState(() => new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const savedMetrics = localStorage.getItem('health_metrics');
        if (savedMetrics) {
            try { setMetrics(JSON.parse(savedMetrics)); } catch {}
        }
    }, []);

    const saveMetrics = () => {
        const timestamp = new Date(`${recordDate}T12:00:00`).getTime();
        const updatedMetrics = { ...metrics, lastUpdated: timestamp };
        
        // Update history in LS
        const savedHistory = localStorage.getItem('health_history');
        let history: HealthMetrics[] = savedHistory ? JSON.parse(savedHistory) : [];

        const existingIndex = history.findIndex(h => {
            const hDate = new Date(h.lastUpdated).toISOString().split('T')[0];
            return hDate === recordDate;
        });

        if (existingIndex >= 0) {
            history[existingIndex] = updatedMetrics;
        } else {
            history = [updatedMetrics, ...history];
            history.sort((a, b) => b.lastUpdated - a.lastUpdated);
        }

        localStorage.setItem('health_metrics', JSON.stringify(updatedMetrics));
        localStorage.setItem('health_history', JSON.stringify(history));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[#fafafa] z-[100] flex flex-col animate-in slide-in-from-right duration-300 ease-out">
             {/* Header */}
             <div className="pt-[calc(env(safe-area-inset-top)+0.5rem)] px-4 pb-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100/50 shrink-0">
                <button 
                    onClick={onClose} 
                    className="px-3 py-2 text-gray-500 font-medium text-base active:opacity-50 transition-opacity"
                >
                    取消
                </button>
                <span className="font-extrabold text-gray-800 text-base">身体数据</span>
                <button 
                    onClick={saveMetrics} 
                    className="px-3 py-2 text-emerald-600 font-bold text-base active:opacity-50 transition-opacity"
                >
                    保存
                </button>
            </div>

            {/* Content Container - Flex layout to fit single screen */}
            <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
                
                {/* Top Row: Date & Gender */}
                <div className="flex gap-3">
                     <div className="flex-1 bg-white p-3 rounded-2xl shadow-sm border border-gray-50 flex flex-col">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">日期</label>
                        <input 
                            type="date"
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                            className="bg-transparent font-bold text-gray-800 outline-none text-sm font-sans w-full p-0"
                        />
                    </div>
                    
                    <div className="flex-1 bg-gray-100 p-1.5 rounded-2xl flex">
                        <button 
                            onClick={() => setMetrics({...metrics, gender: 'male'})}
                            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all duration-200 ${metrics.gender === 'male' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                        >
                            男生
                        </button>
                        <button 
                            onClick={() => setMetrics({...metrics, gender: 'female'})}
                            className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all duration-200 ${metrics.gender === 'female' ? 'bg-white text-pink-500 shadow-sm' : 'text-gray-400'}`}
                        >
                            女生
                        </button>
                    </div>
                </div>

                {/* Main Metrics: Height & Weight */}
                <div className="grid grid-cols-2 gap-3">
                     <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center py-5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">身高 (cm)</label>
                        <input 
                            type="number"
                            min="0"
                            value={metrics.height}
                            onChange={(e) => setMetrics({...metrics, height: Math.max(0, Number(e.target.value))})}
                            className="bg-transparent outline-none font-black text-3xl text-gray-800 text-center w-full p-0 placeholder-gray-200"
                            placeholder="0"
                        />
                    </div>
                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center py-5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">体重 (kg)</label>
                        <input 
                            type="number"
                            min="0"
                            value={metrics.weight}
                            onChange={(e) => setMetrics({...metrics, weight: Math.max(0, Number(e.target.value))})}
                            className="bg-transparent outline-none font-black text-3xl text-gray-800 text-center w-full p-0 placeholder-gray-200"
                            placeholder="0"
                        />
                    </div>
                </div>
                
                {/* Secondary Metrics: Body Composition */}
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex-1 flex flex-col">
                    <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wide mb-4 opacity-50">体成分 (选填)</h3>
                    
                    <div className="flex-1 flex flex-col justify-between gap-3">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-600">体脂率</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    min="0"
                                    step="0.1"
                                    placeholder="-"
                                    value={metrics.bodyFatPercentage || ''} 
                                    onChange={(e) => setMetrics({...metrics, bodyFatPercentage: Math.max(0, Number(e.target.value))})}
                                    className="w-20 bg-gray-50 p-2 rounded-xl text-center font-bold text-gray-800 outline-none focus:bg-emerald-50 focus:text-emerald-600 transition-colors text-sm"
                                />
                                <span className="text-xs font-bold text-gray-400 w-4">%</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-600">肌肉量</label>
                             <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    min="0"
                                    step="0.1"
                                    placeholder="-"
                                    value={metrics.muscleMass || ''} 
                                    onChange={(e) => setMetrics({...metrics, muscleMass: Math.max(0, Number(e.target.value))})}
                                    className="w-20 bg-gray-50 p-2 rounded-xl text-center font-bold text-gray-800 outline-none focus:bg-emerald-50 focus:text-emerald-600 transition-colors text-sm"
                                />
                                <span className="text-xs font-bold text-gray-400 w-4">kg</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-gray-600">内脏脂肪</label>
                             <div className="flex items-center gap-2">
                                <input 
                                    type="number" 
                                    min="0"
                                    step="0.1"
                                    placeholder="-"
                                    value={metrics.visceralFatLevel || ''} 
                                    onChange={(e) => setMetrics({...metrics, visceralFatLevel: Math.max(0, Number(e.target.value))})}
                                    className="w-20 bg-gray-50 p-2 rounded-xl text-center font-bold text-gray-800 outline-none focus:bg-emerald-50 focus:text-emerald-600 transition-colors text-sm"
                                />
                                <span className="text-xs font-bold text-gray-400 w-4">Lv</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom spacer for safe area if needed */}
                <div className="h-4 shrink-0" />
            </div>
        </div>
    );
};

export default HealthEditor;
