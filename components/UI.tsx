import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Globe } from 'lucide-react';
import { Language } from '../types';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
    const baseStyle = "px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-2 uppercase tracking-wide";
    const variants = {
        primary: "bg-primary text-gray-900 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]",
        secondary: "bg-secondary text-white hover:bg-pink-600 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]",
        outline: "border-2 border-dim text-dim hover:border-primary hover:text-primary bg-transparent"
    };

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </motion.button>
    );
};

interface ProgressBarProps {
    current: number;
    total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const progress = ((current + 1) / total) * 100;
    
    return (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-800 z-50">
            <motion.div 
                className="h-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
            />
        </div>
    );
};

interface NavigationProps {
    onNext: () => void;
    onPrev: () => void;
    canNext: boolean;
    canPrev: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ onNext, onPrev, canNext, canPrev }) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-6 z-40">
            <motion.button
                onClick={onPrev}
                disabled={!canPrev}
                className={`w-14 h-14 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md transition-colors ${!canPrev ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary hover:text-black hover:border-primary text-white cursor-pointer'}`}
                whileHover={canPrev ? { scale: 1.1 } : {}}
                whileTap={canPrev ? { scale: 0.9 } : {}}
            >
                <ChevronLeft size={24} />
            </motion.button>
            <motion.button
                onClick={onNext}
                disabled={!canNext}
                className={`w-14 h-14 rounded-full flex items-center justify-center border border-white/20 backdrop-blur-md transition-colors ${!canNext ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary hover:text-black hover:border-primary text-white cursor-pointer'}`}
                whileHover={canNext ? { scale: 1.1 } : {}}
                whileTap={canNext ? { scale: 0.9 } : {}}
            >
                <ChevronRight size={24} />
            </motion.button>
        </div>
    );
};

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
    <div className={`bg-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl ${className}`}>
        {children}
    </div>
);

// --- LANGUAGE SWITCHER ---

interface LanguageSwitcherProps {
    current: Language;
    onChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ current, onChange }) => {
    return (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10">
            <Globe size={16} className="text-dim ml-2" />
            {(['en', 'ru', 'uz'] as Language[]).map(lang => (
                <button
                    key={lang}
                    onClick={() => onChange(lang)}
                    className={`px-3 py-1 rounded-full text-sm font-bold transition-all ${
                        current === lang 
                            ? 'bg-primary text-black shadow-lg' 
                            : 'text-dim hover:text-white hover:bg-white/10'
                    }`}
                >
                    {lang.toUpperCase()}
                </button>
            ))}
        </div>
    );
};

// --- TRANSLATION HELPER ---
export const t = (lang: Language, text: { en: string; ru: string; uz: string }) => {
    return text[lang] || text.en;
};
