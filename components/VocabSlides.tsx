
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideProps, VocabItem } from '../types';
import { Button, t } from './UI';
import { Speaker, BookOpen, Check, X, ArrowRight } from 'lucide-react';
import { unit1Vocab } from '../data/vocab';

// Utility to get random distractors
const getDistractors = (currentItem: VocabItem, count: number = 3): string[] => {
    const otherItems = unit1Vocab.filter(i => i.id !== currentItem.id);
    const shuffled = [...otherItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(i => i.word);
};

export const VocabSectionIntro: React.FC<SlideProps> = ({ onNext, lang }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-indigo-900 to-purple-900 text-white"
    >
        <BookOpen size={160} className="mb-10 text-yellow-400" />
        <h1 className="text-8xl font-black mb-6 uppercase tracking-tighter drop-shadow-lg">Vocabulary</h1>
        <p className="text-4xl text-purple-200 mb-16">{t(lang, {en: "Unit 1 Wordlist", ru: "Словарь Раздела 1", uz: "1-Bo'lim So'zlari"})}</p>
        <Button onClick={onNext} className="bg-yellow-400 text-black border-none hover:bg-yellow-300 text-3xl px-16 py-8">
            {t(lang, {en: "Start Learning", ru: "Начать учить", uz: "O'rganishni boshlash"})}
        </Button>
    </motion.div>
);

export const VocabTeachingSlide: React.FC<SlideProps> = ({ data, onNext, lang }) => {
    const word = data as VocabItem;

    const playAudio = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(word.word);
            utterance.lang = 'en-GB';
            utterance.rate = 0.8;
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col h-full w-full max-w-[90vw] mx-auto px-6 pt-10 pb-20 overflow-y-auto custom-scroll"
        >
            {/* Header: Word & Audio */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                <div>
                    <h2 className="text-8xl md:text-[8rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4 leading-none">
                        {word.word}
                    </h2>
                    <div className="flex items-center gap-8 text-4xl text-dim font-serif italic">
                        <span>{word.partOfSpeech}</span>
                        <span>{word.pronunciation}</span>
                    </div>
                </div>
                <button 
                    onClick={playAudio}
                    className="p-8 bg-white/5 rounded-full hover:bg-white/10 border-2 border-white/10 transition-all active:scale-95"
                >
                    <Speaker size={64} className="text-yellow-400" />
                </button>
            </div>

            {/* Definitions */}
            <div className="grid grid-cols-3 gap-8 mb-12">
                <div className="bg-blue-900/20 border-2 border-blue-500/30 p-8 rounded-[2rem] flex flex-col justify-center">
                    <div className="text-sm font-bold text-blue-400 uppercase mb-4 tracking-widest">English</div>
                    <p className="text-3xl text-white font-medium">{word.definitions.en}</p>
                </div>
                <div className="bg-red-900/20 border-2 border-red-500/30 p-8 rounded-[2rem] flex flex-col justify-center">
                    <div className="text-sm font-bold text-red-400 uppercase mb-4 tracking-widest">Russian</div>
                    <p className="text-3xl text-white font-medium">{word.definitions.ru}</p>
                </div>
                <div className="bg-green-900/20 border-2 border-green-500/30 p-8 rounded-[2rem] flex flex-col justify-center">
                    <div className="text-sm font-bold text-green-400 uppercase mb-4 tracking-widest">Uzbek</div>
                    <p className="text-3xl text-white font-medium">{word.definitions.uz}</p>
                </div>
            </div>

            {/* Examples */}
            <div className="space-y-6 mb-8">
                <h3 className="text-dim font-bold uppercase tracking-[0.2em] text-lg border-b border-white/10 pb-4">Examples</h3>
                {word.examples.map((ex, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className="bg-card p-6 rounded-2xl border-l-8 border-primary shadow-xl"
                    >
                        <p className="text-3xl text-white font-medium leading-relaxed">"{ex}"</p>
                    </motion.div>
                ))}
            </div>

            {onNext && (
                <div className="flex justify-end mt-auto pt-6">
                    <Button onClick={onNext} variant="primary" className="text-2xl px-12 py-6">
                        {t(lang, {en: "Start Quiz", ru: "Начать тест", uz: "Testni boshlash"})} <ArrowRight className="ml-3" size={32} />
                    </Button>
                </div>
            )}
        </motion.div>
    );
};

export const VocabQuizSlide: React.FC<SlideProps> = ({ data, onNext, lang }) => {
    const word = data as VocabItem;
    const [options, setOptions] = useState<string[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [timeLeft, setTimeLeft] = useState(15);
    const [quizExample, setQuizExample] = useState("");

    // Setup quiz on mount
    useEffect(() => {
        const distractors = getDistractors(word);
        const allOptions = [word.word, ...distractors].sort(() => 0.5 - Math.random());
        setOptions(allOptions);
        
        const randomEx = word.examples[Math.floor(Math.random() * word.examples.length)];
        
        // Robust masking: Split target into words and create regex that ignores brackets like (to)
        // E.g., "adapt (to)" -> "adapt"
        const cleanWord = word.word.split('(')[0].trim();
        // Escape special chars just in case
        const escapedWord = cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); 
        
        // Create a regex to replace the word (case insensitive)
        const regex = new RegExp(`\\b${escapedWord}\\w*\\b`, 'gi');
        
        const masked = randomEx.replace(regex, "_______");
        setQuizExample(masked);
    }, [word]);

    // Timer
    useEffect(() => {
        if (selected !== null) return;
        if (timeLeft <= 0) {
            // Time up logic 
            return;
        }
        const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, selected]);

    const handleSelect = (option: string) => {
        if (selected) return;
        setSelected(option);
        const correct = option === word.word;
        setIsCorrect(correct);
    };

    const colors = [
        "bg-red-600 hover:bg-red-500",
        "bg-blue-600 hover:bg-blue-500",
        "bg-yellow-600 hover:bg-yellow-500",
        "bg-green-600 hover:bg-green-500"
    ];

    const shapes = ["▲", "◆", "●", "■"];

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden bg-background">
            {/* Background Music Visuals (Abstract) */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                 <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl animate-pulse" />
                 <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s'}} />
            </div>

            {/* Top Bar: Timer & Score */}
            <div className="flex justify-between items-center p-8 z-10">
                <div className="flex items-center gap-4 bg-white/10 px-6 py-3 rounded-full">
                    <div className={`w-4 h-4 rounded-full animate-pulse ${timeLeft < 5 ? 'bg-red-500' : 'bg-green-500'}`} />
                    <span className="font-mono font-bold text-3xl">{timeLeft}s</span>
                </div>
                <div className="text-dim font-bold uppercase tracking-[0.2em] text-xl">
                    {t(lang, {en: "Complete the sentence", ru: "Закончи предложение", uz: "Gapni to'ldiring"})}
                </div>
            </div>

            {/* Question Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 z-10 text-center -mt-10">
                <div className="bg-white text-black p-12 rounded-[2rem] shadow-2xl max-w-5xl w-full transform -rotate-1 border-4 border-gray-100">
                    <p className="text-4xl md:text-6xl font-bold font-serif leading-relaxed">
                        {quizExample}
                    </p>
                </div>
                
                {/* Result Feedback Overlay */}
                <AnimatePresence>
                    {isCorrect !== null && (
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className={`mt-12 px-12 py-6 rounded-full flex items-center gap-6 text-4xl font-bold shadow-2xl border-4 border-white/20 ${isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                        >
                            {isCorrect ? <Check size={48} /> : <X size={48} />}
                            {isCorrect ? "Correct!" : "Wrong!"}
                            {onNext && (
                                <button onClick={onNext} className="ml-6 bg-white/20 p-3 rounded-full hover:bg-white/40">
                                    <ArrowRight size={32} />
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Options Grid (Kahoot Style) */}
            <div className="grid grid-cols-2 gap-6 p-8 h-[35vh] z-10">
                {options.map((opt, i) => {
                    // Logic to highlight correct answer even if user picked wrong
                    const isTheCorrectOption = opt === word.word;
                    const isSelected = selected === opt;
                    const shouldDim = selected !== null && !isSelected && !isTheCorrectOption;
                    const shouldHighlightCorrect = selected !== null && !isCorrect && isTheCorrectOption;

                    return (
                        <motion.button
                            key={i}
                            whileHover={!selected ? { scale: 1.02 } : {}}
                            whileTap={!selected ? { scale: 0.98 } : {}}
                            onClick={() => handleSelect(opt)}
                            disabled={selected !== null}
                            className={`
                                ${colors[i % 4]} 
                                relative rounded-3xl flex items-center p-8 shadow-xl transition-all
                                ${shouldDim ? 'opacity-30 grayscale' : 'opacity-100'}
                                ${isSelected ? 'ring-8 ring-white scale-105 z-20' : ''}
                                ${shouldHighlightCorrect ? 'ring-8 ring-green-400 scale-105 z-20 opacity-100' : ''}
                            `}
                        >
                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 text-5xl font-black">
                                {shapes[i % 4]}
                            </div>
                            <span className="w-full text-center text-white font-bold text-3xl md:text-5xl shadow-black drop-shadow-md">
                                {opt}
                            </span>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    );
};
