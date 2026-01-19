
import React, { useState } from 'react';
import Navigation from './components/Navigation';
import DiaryView from './components/DiaryView';
import HealthView from './components/HealthView';
import DiaryEditor from './components/DiaryEditor';
import HealthEditor from './components/HealthEditor';
import { AppTab, DiaryEntry } from './types';

type EditorMode = 
  | { type: 'diary', entry?: DiaryEntry } 
  | { type: 'health' } 
  | null;

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>(AppTab.DIARY);
  const [editorMode, setEditorMode] = useState<EditorMode>(null);

  // 如果处于编辑模式，渲染全屏编辑器，不显示导航栏
  if (editorMode) {
    if (editorMode.type === 'diary') {
      return (
        <DiaryEditor 
          initialEntry={editorMode.entry} 
          onClose={() => setEditorMode(null)} 
        />
      );
    }
    if (editorMode.type === 'health') {
      return (
        <HealthEditor 
          onClose={() => setEditorMode(null)} 
        />
      );
    }
  }

  // 默认主视图
  return (
    <div className="fixed inset-0 w-full bg-[#fafafa] flex flex-col">
      <main className="flex-1 w-full overflow-hidden relative flex flex-col">
        {currentTab === AppTab.DIARY && (
          <DiaryView 
            onAddClick={() => setEditorMode({ type: 'diary' })}
            onEditClick={(entry) => setEditorMode({ type: 'diary', entry })}
          />
        )}
        {currentTab === AppTab.HEALTH && (
          <HealthView 
            onAddClick={() => setEditorMode({ type: 'health' })}
          />
        )}
      </main>

      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
};

export default App;
