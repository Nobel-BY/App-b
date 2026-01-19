
import React, { useState, useEffect } from 'react';
import { DiaryEntry } from '../types';
import { Icons } from '../constants';

interface DiaryViewProps {
  onAddClick: () => void;
  onEditClick: (entry: DiaryEntry) => void;
}

const DiaryView: React.FC<DiaryViewProps> = ({ onAddClick, onEditClick }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 每次组件挂载（从编辑器返回时）重新读取数据
  useEffect(() => {
    const saved = localStorage.getItem('diary_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse diary entries");
      }
    }
  }, []);

  const handleDelete = (id: string) => {
      const newEntries = entries.filter(e => e.id !== id);
      setEntries(newEntries);
      localStorage.setItem('diary_entries', JSON.stringify(newEntries));
  };

  const toDateKey = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
  };

  const entryDates = new Set(entries.map(e => toDateKey(new Date(e.timestamp))));

  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const filteredEntries = selectedDate 
    ? entries.filter(e => toDateKey(new Date(e.timestamp)) === selectedDate)
    : entries;

  return (
    <div className="pt-[calc(env(safe-area-inset-top)+1.5rem)] pb-6 px-6 h-full overflow-y-auto no-scrollbar bg-[#fafafa] flex flex-col">
      <header className="mb-6 flex justify-between items-center shrink-0">
        <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tighter">生活日记</h1>
            <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">记录美好点滴</p>
        </div>
        <div className="flex items-center space-x-3">
            <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${showCalendar ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-400 border border-gray-100 shadow-sm hover:bg-gray-50'}`}
            >
                <Icons.Calendar className="w-5 h-5" />
            </button>
            <button 
                onClick={onAddClick}
                className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-900/20 active:scale-95 transition-all hover:bg-gray-800"
            >
                <Icons.Plus className="w-6 h-6" />
            </button>
        </div>
      </header>

      {/* Calendar Overlay */}
      <div className={`transition-all duration-500 shrink-0 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${showCalendar ? 'max-h-[500px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0 overflow-hidden'}`}>
         <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-white/50">
                <div className="flex justify-between items-center mb-6 px-1">
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Icons.ChevronLeft className="w-5 h-5" /></button>
                    <span className="font-extrabold text-gray-800 tracking-tight text-lg">{viewDate.getFullYear()}年 {viewDate.getMonth() + 1}月</span>
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Icons.ChevronRight className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-gray-400 font-bold mb-3 uppercase tracking-widest">
                    {['日', '一', '二', '三', '四', '五', '六'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {generateCalendarDays().map((date, i) => {
                        if (!date) return <div key={i} />;
                        const key = toDateKey(date);
                        const isSelected = selectedDate === key;
                        const hasEntry = entryDates.has(key);
                        return (
                            <button 
                                key={key}
                                onClick={() => setSelectedDate(isSelected ? null : key)}
                                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'hover:bg-blue-50 text-gray-600'}`}
                            >
                                <span className="text-sm font-bold">{date.getDate()}</span>
                                {hasEntry && <span className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />}
                            </button>
                        );
                    })}
                </div>
         </div>
      </div>

      {/* Feed Area */}
      <div className="space-y-6 flex-grow pb-10">
        {filteredEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <Icons.Diary className="w-12 h-12 mb-3 stroke-1" />
                <span className="text-xs font-bold tracking-widest uppercase text-gray-500">记录第一篇日记</span>
            </div>
        ) : (
            filteredEntries.map(entry => (
                <div key={entry.id} className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] border border-gray-50/50 flex flex-col space-y-4 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] transition-all duration-300">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                {new Date(entry.timestamp).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
                            </span>
                             <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => <Icons.Star key={i} className={`w-3 h-3 ${i <= entry.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-100'}`} filled={i <= entry.rating} />)}
                            </div>
                        </div>
                        {entry.weather && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                            {entry.weather}
                        </span>}
                    </div>

                    {entry.content && <p className="text-gray-700 text-sm leading-7 font-medium whitespace-pre-wrap">{entry.content}</p>}

                    {/* Compact Workout Card - Reduced padding from p-4 to p-3, reduced spacing */}
                    {entry.workout && (
                        <div className="bg-gradient-to-br from-[#fff7ed] to-white rounded-3xl p-3 border border-orange-100/60 space-y-3 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                            
                            <div className="flex justify-between items-center relative z-10 pt-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
                                        <Icons.Dumbbell className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-sm font-extrabold text-gray-800">训练记录</span>
                                </div>
                                <div className="flex gap-1.5">
                                    {entry.workout.bodyParts.map(p => <span key={p} className="text-[9px] font-bold bg-white text-orange-600 border border-orange-100 px-2.5 py-1 rounded-lg">{p}</span>)}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center bg-orange-50/50 rounded-2xl p-2 border border-orange-100/50">
                                    <span className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5">开始</span>
                                    <span className="text-xs font-black text-gray-800 tracking-tight">{entry.workout.startTime}</span>
                                </div>
                                <div className="text-center bg-orange-50/50 rounded-2xl p-2 border border-orange-100/50">
                                    <span className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5">时长</span>
                                    <span className="text-xs font-black text-gray-800 tracking-tight">{entry.workout.duration}m</span>
                                </div>
                                <div className="text-center bg-orange-50/50 rounded-2xl p-2 border border-orange-100/50">
                                    <span className="block text-[9px] font-bold text-gray-400 uppercase mb-0.5">强度</span>
                                    <div className="flex gap-0.5 justify-center pt-0.5">
                                        {[1,2,3,4,5].map(i => <Icons.Fire key={i} className={`w-2.5 h-2.5 ${i <= entry.workout!.intensity ? 'text-orange-500' : 'text-gray-200'}`} />)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 pt-1">
                                {entry.workout.exercises.map((ex, idx) => (
                                    <div key={idx} className="flex flex-col gap-1.5">
                                        <h4 className="text-[11px] font-extrabold text-gray-900 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" /> {ex.name || '动作'}
                                        </h4>
                                        <div className="flex flex-wrap gap-2 pl-3.5">
                                            {ex.sets.map((s, si) => (
                                                <div key={si} className="text-[10px] font-bold bg-white px-2.5 py-1 rounded-lg border border-gray-100 text-gray-500 tabular-nums">
                                                    {s.weight}kg <span className="text-gray-300 mx-0.5">x</span> {s.reps}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                        <div className="flex flex-wrap gap-2">
                            {entry.tags?.map(t => <span key={t} className="text-[9px] font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">{t}</span>)}
                        </div>
                        <div className="flex gap-2 shrink-0 ml-auto">
                            <button onClick={() => onEditClick(entry)} className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Icons.Edit className="w-5 h-5" /></button>
                            <button onClick={() => handleDelete(entry.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Icons.Trash className="w-5 h-5" /></button>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
};

export default DiaryView;
