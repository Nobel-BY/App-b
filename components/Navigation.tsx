
import React from 'react';
import { AppTab } from '../types';
import { Icons } from '../constants';

interface NavigationProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, onTabChange }) => {
  return (
    // 改为全宽、贴底、白色背景、顶部细边框
    // pb-[env(safe-area-inset-bottom)] 适配全面屏底部横条
    <div className="w-full bg-white border-t border-gray-100 flex justify-around items-center shrink-0 z-50 pb-[env(safe-area-inset-bottom)] pt-2">
      <button
        onClick={() => onTabChange(AppTab.DIARY)}
        className="flex-1 h-14 flex flex-col items-center justify-center group active:scale-95 transition-transform"
      >
        <div className={`transition-all duration-300 ${currentTab === AppTab.DIARY ? 'text-blue-600' : 'text-gray-400'}`}>
           <Icons.Diary className={`w-6 h-6 ${currentTab === AppTab.DIARY ? 'fill-blue-600 stroke-blue-600' : 'stroke-[1.5px]'}`} />
        </div>
        <span className={`text-[10px] font-bold mt-1 transition-all duration-300 ${currentTab === AppTab.DIARY ? 'text-blue-600' : 'text-gray-400'}`}>
          生活
        </span>
      </button>

      <div className="w-px h-6 bg-gray-100/50"></div>

      <button
        onClick={() => onTabChange(AppTab.HEALTH)}
        className="flex-1 h-14 flex flex-col items-center justify-center group active:scale-95 transition-transform"
      >
         <div className={`transition-all duration-300 ${currentTab === AppTab.HEALTH ? 'text-emerald-500' : 'text-gray-400'}`}>
            <Icons.Health className={`w-6 h-6 ${currentTab === AppTab.HEALTH ? 'fill-emerald-500 stroke-emerald-500' : 'stroke-[1.5px]'}`} />
        </div>
        <span className={`text-[10px] font-bold mt-1 transition-all duration-300 ${currentTab === AppTab.HEALTH ? 'text-emerald-600' : 'text-gray-400'}`}>
          健康
        </span>
      </button>
    </div>
  );
};

export default Navigation;
