import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../types';
import { Button } from './UI';
import { t } from './UI';
import { ArrowRight, Clock } from 'lucide-react';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

export const TimelineSimpleSlide: React.FC<SlideProps> = ({ onNext, lang }) => {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full px-4">
            <h2 className="text-4xl font-bold text-white mb-2">Present Perfect Simple</h2>
            <p className="text-xl text-secondary mb-12 italic">
                {t(lang, { 
                    en: "Focus on Result", 
                    ru: "Акцент на результате", 
                    uz: "Natijaga urg'u" 
                })}
            </p>

            <div className="relative w-full max-w-4xl h-64 mb-12 flex items-center justify-center">
                {/* Timeline Base */}
                <div className="absolute w-full h-1 bg-gray-700 rounded-full" />
                
                {/* Past Label */}
                <div className="absolute left-0 -top-8 text-dim font-bold">
                    {t(lang, { en: "PAST", ru: "ПРОШЛОЕ", uz: "O'TMISH" })}
                </div>
                
                {/* Present Label */}
                <div className="absolute right-0 -top-8 text-white font-bold">
                    {t(lang, { en: "NOW", ru: "СЕЙЧАС", uz: "HOZIR" })}
                </div>

                {/* Animation: X marks the spot in past */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="absolute left-1/4 text-red-500 text-6xl font-black z-10"
                >
                    ❌
                </motion.div>

                {/* Animation: Line moving to present */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <motion.path
                        d="M 25% 50% L 98% 50%"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="4"
                        strokeDasharray="100%"
                        strokeDashoffset="100%"
                        initial={{ strokeDashoffset: "100%" }}
                        animate={{ strokeDashoffset: "0%" }}
                        transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
                    />
                    {/* Arrow Head */}
                    <motion.path 
                        d="M 98% 48% L 100% 50% L 98% 52%"
                        fill="transparent"
                        stroke="#f59e0b"
                        strokeWidth="4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3 }}
                    />
                </svg>

                {/* Result Box */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3.2 }}
                    className="absolute right-0 top-10 bg-card border border-primary p-4 rounded-xl"
                >
                    <span className="text-primary font-bold">
                        {t(lang, { en: "RESULT", ru: "РЕЗУЛЬТАТ", uz: "NATIJA" })}
                    </span>
                </motion.div>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 max-w-2xl text-center">
                <p className="text-3xl font-medium text-white mb-2">
                    "I <span className="text-primary font-bold">have broken</span> my leg."
                </p>
                <p className="text-dim">
                    {t(lang, {
                        en: "The action happened in the past. The result (broken leg) is important NOW.",
                        ru: "Действие произошло в прошлом. Результат (сломанная нога) важен СЕЙЧАС.",
                        uz: "Harakat o'tmishda sodir bo'lgan. Natija (singan oyoq) HOZIR muhim."
                    })}
                </p>
            </div>

            {onNext && <div className="mt-8"><Button onClick={onNext}>Next</Button></div>}
        </motion.div>
    );
};

export const TimelineContinuousSlide: React.FC<SlideProps> = ({ onNext, lang }) => {
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full px-4">
            <h2 className="text-4xl font-bold text-white mb-2">Present Perfect Continuous</h2>
            <p className="text-xl text-secondary mb-12 italic">
                {t(lang, { 
                    en: "Focus on Activity / Duration", 
                    ru: "Акцент на действии / длительности", 
                    uz: "Harakat / davomiylikka urg'u" 
                })}
            </p>

            <div className="relative w-full max-w-4xl h-64 mb-12 flex items-center justify-center">
                {/* Timeline Base */}
                <div className="absolute w-full h-1 bg-gray-700 rounded-full" />
                
                <div className="absolute left-0 -top-8 text-dim font-bold">
                    {t(lang, { en: "PAST", ru: "ПРОШЛОЕ", uz: "O'TMISH" })}
                </div>
                
                <div className="absolute right-0 -top-8 text-white font-bold">
                    {t(lang, { en: "NOW", ru: "СЕЙЧАС", uz: "HOZIR" })}
                </div>

                {/* Animation: Wavy line showing duration */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <motion.path
                        d="M 100,128 Q 150,80 200,128 T 300,128 T 400,128 T 500,128 T 600,128 T 700,128 T 800,128"
                        fill="transparent"
                        stroke="#ec4899"
                        strokeWidth="6"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 4, ease: "linear" }}
                    />
                </svg>

                {/* Clock Animation following the path */}
                <motion.div
                    className="absolute top-1/2 -translate-y-1/2 bg-black text-secondary p-2 rounded-full border border-secondary z-10"
                    initial={{ left: "10%" }}
                    animate={{ left: "90%" }}
                    transition={{ duration: 4, ease: "linear" }}
                >
                    <Clock size={24} className="animate-spin" />
                </motion.div>

                {/* Label Box */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4 }}
                    className="absolute right-0 top-16 bg-card border border-secondary p-4 rounded-xl"
                >
                    <span className="text-secondary font-bold">
                        {t(lang, { en: "ACTIVITY", ru: "ПРОЦЕСС", uz: "JARAYON" })}
                    </span>
                </motion.div>
            </div>

            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 max-w-2xl text-center">
                <p className="text-3xl font-medium text-white mb-2">
                    "I <span className="text-secondary font-bold">have been running</span>."
                </p>
                <p className="text-dim">
                    {t(lang, {
                        en: "We started in the past and continued until now. We are tired/sweating.",
                        ru: "Начали в прошлом, продолжали до сих пор. Мы устали/вспотели.",
                        uz: "O'tmishda boshlab, hozirgacha davom etdik. Charchaganmiz/terlaganmiz."
                    })}
                </p>
            </div>

            {onNext && <div className="mt-8"><Button onClick={onNext}>Next</Button></div>}
        </motion.div>
    );
};
