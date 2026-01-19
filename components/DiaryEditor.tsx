
import React, { useState, useRef, useEffect } from 'react';
import { DiaryEntry, WorkoutRecord, WorkoutSet } from '../types';
import { Icons, BODY_PARTS } from '../constants';

interface DiaryEditorProps {
    initialEntry?: DiaryEntry;
    onClose: () => void;
}

const DiaryEditor: React.FC<DiaryEditorProps> = ({ initialEntry, onClose }) => {
    const [newContent, setNewContent] = useState(initialEntry?.content || '');
    const [rating, setRating] = useState(initialEntry?.rating || 3);
    const [weatherInput, setWeatherInput] = useState(initialEntry?.weather || '');
    const [selectedTags, setSelectedTags] = useState<string[]>(initialEntry?.tags || []);
    const [entryDate, setEntryDate] = useState(() => 
        initialEntry 
        ? new Date(initialEntry.timestamp).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0]
    );

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [isWorkoutEnabled, setIsWorkoutEnabled] = useState(!!initialEntry?.workout);
    const [workoutData, setWorkoutData] = useState<WorkoutRecord>(initialEntry?.workout || {
        startTime: '18:00',
        duration: 60,
        bodyParts: [],
        intensity: 3,
        warmup: '',
        exercises: []
    });

    // Auto-resize textarea logic
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newContent]);

    const handleSaveEntry = () => {
        if (!newContent.trim() && !isWorkoutEnabled) return;

        const timestamp = new Date(`${entryDate}T12:00:00`).getTime();
        const entryToSave: Partial<DiaryEntry> = {
            timestamp,
            content: newContent,
            rating,
            weather: weatherInput.trim() || undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            workout: isWorkoutEnabled ? workoutData : undefined,
        };

        const stored = localStorage.getItem('diary_entries');
        let entries: DiaryEntry[] = stored ? JSON.parse(stored) : [];

        if (initialEntry) {
            entries = entries.map(e => e.id === initialEntry.id ? { ...e, ...entryToSave } as DiaryEntry : e);
        } else {
            const newEntry: DiaryEntry = {
                id: Date.now().toString(),
                ...(entryToSave as Omit<DiaryEntry, 'id'>)
            };
            entries = [newEntry, ...entries];
        }

        localStorage.setItem('diary_entries', JSON.stringify(entries));
        onClose();
    };

    // Workout Helpers
    const addExercise = () => setWorkoutData({ ...workoutData, exercises: [...workoutData.exercises, { name: '', sets: [{ weight: 0, reps: 0 }] }] });
    const updateExerciseName = (index: number, name: string) => {
        const updated = [...workoutData.exercises];
        updated[index].name = name;
        setWorkoutData({ ...workoutData, exercises: updated });
    };
    const removeExercise = (index: number) => {
        const updated = workoutData.exercises.filter((_, i) => i !== index);
        setWorkoutData({ ...workoutData, exercises: updated });
    };
    const addSet = (exerciseIndex: number) => {
        const updated = [...workoutData.exercises];
        const lastSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1] || { weight: 0, reps: 0 };
        updated[exerciseIndex].sets.push({ ...lastSet });
        setWorkoutData({ ...workoutData, exercises: updated });
    };
    const updateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: number) => {
        const updated = [...workoutData.exercises];
        updated[exerciseIndex].sets[setIndex][field] = Math.max(0, value);
        setWorkoutData({ ...workoutData, exercises: updated });
    };
    const removeSet = (exerciseIndex: number, setIndex: number) => {
        const updated = [...workoutData.exercises];
        updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
        if (updated[exerciseIndex].sets.length === 0) removeExercise(exerciseIndex);
        else setWorkoutData({ ...workoutData, exercises: updated });
    };
    const toggleWorkoutBodyPart = (part: string) => {
        const current = workoutData.bodyParts;
        if (current.includes(part)) setWorkoutData({ ...workoutData, bodyParts: current.filter(p => p !== part) });
        else setWorkoutData({ ...workoutData, bodyParts: [...current, part] });
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
                
                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                     <input 
                        type="date" 
                        value={entryDate} 
                        onChange={e => setEntryDate(e.target.value)} 
                        className="text-xs font-bold text-gray-600 bg-transparent outline-none text-center font-sans" 
                    />
                </div>

                <button 
                    onClick={handleSaveEntry} 
                    className="px-3 py-2 text-blue-600 font-bold text-base active:opacity-50 transition-opacity"
                >
                    完成
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-5 pb-20">
                
                {/* Mood & Weather Card */}
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50">
                    <div className="mb-4">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">今日心情</label>
                        <div className="flex justify-between items-center px-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} onClick={() => setRating(s)} className={`transition-all duration-200 active:scale-90 p-2 rounded-full ${s === rating ? 'bg-amber-50 ring-2 ring-amber-100' : ''}`}>
                                    <Icons.Star className={`w-8 h-8 ${s <= rating ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-gray-200'}`} filled={s <= rating} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-gray-50 pt-4 flex items-center gap-3">
                         <div className="bg-blue-50 p-2 rounded-xl text-blue-500">
                            <Icons.Weather className="w-5 h-5" />
                         </div>
                         <input 
                            type="text" 
                            value={weatherInput} 
                            onChange={e => setWeatherInput(e.target.value)} 
                            placeholder="今天天气如何？" 
                            className="flex-1 text-sm font-bold text-gray-700 placeholder-gray-300 outline-none bg-transparent h-full" 
                        />
                    </div>
                </div>

                {/* Main Content Area - Auto expanding */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-50 min-h-[120px] transition-all duration-200">
                     <textarea
                        ref={textareaRef}
                        rows={1}
                        className="w-full min-h-[120px] p-5 bg-transparent rounded-3xl text-gray-800 placeholder-gray-300 outline-none resize-none leading-relaxed text-base font-medium overflow-hidden"
                        placeholder="写下今天的点滴..."
                        value={newContent}
                        onChange={e => setNewContent(e.target.value)}
                    />
                </div>

                 {/* Workout Toggle Button */}
                 <button 
                    onClick={() => setIsWorkoutEnabled(!isWorkoutEnabled)}
                    className={`w-full p-4 rounded-3xl border flex items-center justify-between transition-all duration-300 ${isWorkoutEnabled ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white border-gray-100 text-gray-400'}`}
                 >
                    <div className="flex items-center gap-3">
                        <Icons.Dumbbell className="w-6 h-6" />
                        <span className="font-bold text-sm">健身打卡</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isWorkoutEnabled ? 'border-white bg-white/20' : 'border-gray-200'}`}>
                        {isWorkoutEnabled && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                 </button>

                {/* Workout Section */}
                {isWorkoutEnabled && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Time & Duration */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-3xl border border-gray-50 shadow-sm">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">开始时间</label>
                                <input type="time" value={workoutData.startTime} onChange={e => setWorkoutData({...workoutData, startTime: e.target.value})} className="w-full bg-transparent text-xl font-black text-gray-800 outline-none" />
                            </div>
                            <div className="bg-white p-4 rounded-3xl border border-gray-50 shadow-sm">
                                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">时长 (Min)</label>
                                <input type="number" value={workoutData.duration} onChange={e => setWorkoutData({...workoutData, duration: Math.max(0, Number(e.target.value))})} className="w-full bg-transparent text-xl font-black text-gray-800 outline-none" />
                            </div>
                        </div>

                        {/* Intensity */}
                        <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-4 text-center">训练强度</label>
                            <div className="flex justify-between px-4">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <button key={i} onClick={() => setWorkoutData({...workoutData, intensity: i})} className={`transition-all duration-200 ${i <= workoutData.intensity ? 'text-orange-500 scale-110' : 'text-gray-200 scale-100'}`}>
                                        <Icons.Fire className="w-8 h-8" />
                                    </button>
                                ))}
                            </div>
                        </div>

                         {/* Body Parts - Updated to 4 cols Grid */}
                         <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm">
                            <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-3">受训部位</label>
                            <div className="grid grid-cols-4 gap-2">
                                {BODY_PARTS.map(part => (
                                    <button 
                                        key={part} 
                                        onClick={() => toggleWorkoutBodyPart(part)}
                                        className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${workoutData.bodyParts.includes(part) ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-gray-50 border-transparent text-gray-400'}`}
                                    >
                                        {part}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Exercises */}
                        <div className="space-y-4 pt-2">
                             <div className="flex justify-between items-center px-2">
                                <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">动作列表</h3>
                                <button onClick={addExercise} className="text-xs bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                    + 添加动作
                                </button>
                            </div>
                            
                            {workoutData.exercises.map((ex, exIdx) => (
                                <div key={exIdx} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                                     <div className="flex justify-between items-start mb-4">
                                        <input 
                                            type="text" 
                                            value={ex.name} 
                                            onChange={e => updateExerciseName(exIdx, e.target.value)}
                                            placeholder="动作名称..." 
                                            className="w-full bg-transparent text-lg font-extrabold text-gray-800 outline-none placeholder-gray-300 border-b border-transparent focus:border-gray-100 pb-1" 
                                        />
                                        <button onClick={() => removeExercise(exIdx)} className="p-2 text-gray-300 hover:text-red-500 transition-colors ml-2"><Icons.Trash className="w-5 h-5" /></button>
                                     </div>
                                    
                                    <div className="space-y-3">
                                        {ex.sets.map((set, setIdx) => (
                                            <div key={setIdx} className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-gray-300 w-4">#{setIdx + 1}</span>
                                                <div className="flex-1 flex items-center bg-gray-50 px-3 py-2 rounded-xl">
                                                    <input type="number" value={set.weight} onChange={e => updateSet(exIdx, setIdx, 'weight', Number(e.target.value))} className="w-full bg-transparent text-center text-sm font-bold text-gray-800 outline-none" />
                                                    <span className="text-[10px] text-gray-400 ml-1">KG</span>
                                                </div>
                                                <div className="flex-1 flex items-center bg-gray-50 px-3 py-2 rounded-xl">
                                                    <input type="number" value={set.reps} onChange={e => updateSet(exIdx, setIdx, 'reps', Number(e.target.value))} className="w-full bg-transparent text-center text-sm font-bold text-gray-800 outline-none" />
                                                    <span className="text-[10px] text-gray-400 ml-1">次</span>
                                                </div>
                                                <button onClick={() => removeSet(exIdx, setIdx)} className="text-gray-300 active:text-red-400 p-1"><Icons.Trash className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => addSet(exIdx)} className="w-full py-3 mt-2 bg-gray-50 rounded-xl text-xs font-bold text-gray-400 active:bg-gray-100 transition-colors">
                                            + 增加组
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiaryEditor;
