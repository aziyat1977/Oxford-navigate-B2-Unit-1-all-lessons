import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideProps, IdiomCard } from '../types';
import { Button, Card, t } from './UI';
import { 
    Timer, Footprints, Zap, CloudSun, CheckCircle, XCircle, Send, 
    ThumbsUp, ThumbsDown, ArrowRight, RefreshCw, Mail, Smartphone, Layers,
    Link, Type, Speaker, AlertTriangle, Info, Globe
} from 'lucide-react';

// --- Shared Animations ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    exit: { opacity: 0 }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// --- SPLIT MFP COMPONENT PARTS ---

interface MFPProps {
    target: string;
    pronunciation: string;
    meaningEn: string;
    meaningRu: string;
    meaningUz: string;
    form?: string;
    examples: { text: string; isCorrect: boolean; note?: string }[];
    lang: 'en' | 'ru' | 'uz';
    onNext?: () => void;
}

// Phase 1: Intro (Target + Pronunciation)
const MFPIntro: React.FC<Pick<MFPProps, 'target' | 'pronunciation' | 'lang' | 'onNext'>> = ({ target, pronunciation, lang, onNext }) => {
    const playAudio = () => {
        if ('speechSynthesis' in window) {
            // Cancel any current speaking
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(target);
            utterance.lang = 'en-GB'; // Default to British English for Navigate B2 context
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1;
            
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full">
            <h3 className="text-dim uppercase tracking-widest mb-4 font-bold">{t(lang, { en: "Target Language", ru: "Целевой Язык", uz: "O'rganilayotgan Til" })}</h3>
            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-8 text-center drop-shadow-sm">
                {target}
            </h2>
            <motion.button 
                onClick={playAudio}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-4 text-3xl text-dim font-serif italic bg-white/5 px-8 py-4 rounded-full cursor-pointer transition-colors group border border-white/5 hover:border-primary/30"
            >
                <span className="opacity-70">/{pronunciation}/</span>
                <Speaker size={32} className="text-primary group-hover:text-white transition-colors" />
            </motion.button>
            <p className="text-dim/50 text-sm mt-4 uppercase tracking-widest font-bold">
                {t(lang, { en: "Tap to Listen", ru: "Нажми, чтобы послушать", uz: "Eshitish uchun bosing" })}
            </p>
            {onNext && <div className="mt-12"><Button onClick={onNext}>{t(lang, { en: "Meaning & Form", ru: "Значение и Форма", uz: "Ma'no va Shakl" })}</Button></div>}
        </motion.div>
    );
};

// Phase 2: Meaning & Form
const MFPMeaning: React.FC<Pick<MFPProps, 'meaningEn' | 'meaningRu' | 'meaningUz' | 'form' | 'lang' | 'onNext'>> = ({ meaningEn, meaningRu, meaningUz, form, lang, onNext }) => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-6">
        <div className="bg-card/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 w-full mb-8">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm mb-6">
                <Globe size={16} /> {t(lang, { en: "Meaning", ru: "Значение", uz: "Ma'nosi" })}
            </div>
            <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                    <span className="text-xs text-blue-400 font-bold uppercase">English</span>
                    <p className="text-2xl text-white font-medium leading-relaxed">{meaningEn}</p>
                </div>
                <div className="border-l-4 border-red-500 pl-6">
                    <span className="text-xs text-red-400 font-bold uppercase">Russian</span>
                    <p className="text-2xl text-white font-medium leading-relaxed">{meaningRu}</p>
                </div>
                <div className="border-l-4 border-green-500 pl-6">
                    <span className="text-xs text-green-400 font-bold uppercase">Uzbek</span>
                    <p className="text-2xl text-white font-medium leading-relaxed">{meaningUz}</p>
                </div>
            </div>
        </div>

        {form && (
            <div className="w-full bg-black/20 rounded-2xl p-6 border border-white/5">
                <span className="text-dim text-sm uppercase font-bold block mb-2">{t(lang, { en: "Form / Structure", ru: "Форма / Структура", uz: "Shakl / Tuzilma" })}</span>
                <code className="text-yellow-400 text-xl md:text-2xl font-mono">{form}</code>
            </div>
        )}

        {onNext && <div className="mt-8"><Button onClick={onNext}>{t(lang, { en: "Examples", ru: "Примеры", uz: "Misollar" })}</Button></div>}
    </motion.div>
);

// Phase 3: Examples
const MFPExamples: React.FC<Pick<MFPProps, 'examples' | 'lang' | 'onNext'>> = ({ examples, lang, onNext }) => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-white mb-8">{t(lang, { en: "Examples & Common Errors", ru: "Примеры и Ошибки", uz: "Misollar va Xatolar" })}</h2>
        
        <div className="flex flex-col gap-4 w-full">
            {examples.map((ex, i) => (
                <motion.div 
                    key={i} 
                    variants={itemVariants}
                    className={`relative p-6 rounded-2xl border-l-8 ${ex.isCorrect ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}
                >
                    <div className="absolute top-6 right-6">
                        {ex.isCorrect ? <CheckCircle className="text-green-500" size={24}/> : <XCircle className="text-red-500" size={24}/>}
                    </div>
                    <p className={`text-xl md:text-2xl font-medium pr-10 ${ex.isCorrect ? 'text-white' : 'text-dim line-through decoration-red-500/50'}`}>
                        {ex.text}
                    </p>
                    {ex.note && (
                        <div className="mt-3 text-base flex items-center gap-2 font-bold">
                            {ex.isCorrect ? (
                                <span className="text-green-400">{ex.note}</span>
                            ) : (
                                <span className="text-red-400 flex items-center gap-1"><AlertTriangle size={16}/> {ex.note}</span>
                            )}
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
        {onNext && <div className="mt-12"><Button onClick={onNext}>{t(lang, { en: "Continue", ru: "Продолжить", uz: "Davom etish" })} <ArrowRight size={18} /></Button></div>}
    </motion.div>
);

// --- SPECIFIC MFP SLIDES (Constructed from parts) ---

// 1. Idiom
export const MFPIdiomIntro: React.FC<SlideProps> = (props) => <MFPIntro target="Put your foot in it" pronunciation="pʊt jɔː fʊt ɪn ɪt" {...props} />;
export const MFPIdiomMeaning: React.FC<SlideProps> = (props) => <MFPMeaning meaningEn="To accidentally say something that embarrasses or upsets someone." meaningRu="Сболтнуть лишнее; попасть впросак." meaningUz="Qovun tushurmoq; noo'rin gapirib qo'ymoq." form="Idiom: Verb Phrase" {...props} />;
export const MFPIdiomExamples: React.FC<SlideProps> = (props) => <MFPExamples examples={[{ text: "I really put my foot in it when I asked about her ex-husband.", isCorrect: true }, { text: "He put his foot in it by mentioning the surprise party.", isCorrect: true }, { text: "I put my leg in it yesterday.", isCorrect: false, note: "Wrong body part! Always 'foot'." }]} {...props} />;

// 2. Subject Q
export const MFPSubjectQIntro: React.FC<SlideProps> = (props) => <MFPIntro target="Who called you?" pronunciation="huː kɔːld juː" {...props} />;
export const MFPSubjectQMeaning: React.FC<SlideProps> = (props) => <MFPMeaning meaningEn="Asking about the person who did the action (Subject)." meaningRu="Вопрос к подлежащему (Кто звонил?). Вспомогательный глагол не нужен." meaningUz="Ega so'roq gapi (Sizga kim qo'ng'iroq qildi?)." form="Who / What + Verb + Object?" {...props} />;
export const MFPSubjectQExamples: React.FC<SlideProps> = (props) => <MFPExamples examples={[{ text: "Who broke the window?", isCorrect: true }, { text: "What happened next?", isCorrect: true }, { text: "Who did break the window?", isCorrect: false, note: "Do NOT use 'did' for Subject questions." }]} {...props} />;

// 3. Vocab
export const MFPVocabIntro: React.FC<SlideProps> = (props) => <MFPIntro target="Stationery" pronunciation="ˈsteɪʃənri" {...props} />;
export const MFPVocabMeaning: React.FC<SlideProps> = (props) => <MFPMeaning meaningEn="Materials used for writing, such as paper, pens, pencils." meaningRu="Канцелярские товары." meaningUz="Kantselyariya mollari." form="Uncountable Noun" {...props} />;
export const MFPVocabExamples: React.FC<SlideProps> = (props) => <MFPExamples examples={[{ text: "I need to buy some stationery.", isCorrect: true }, { text: "The stationery was beautiful.", isCorrect: true }, { text: "I bought many stationeries.", isCorrect: false, note: "Uncountable! No plural 's'." }]} {...props} />;

// 4. Grammar PPC
export const MFPPPPIntro: React.FC<SlideProps> = (props) => <MFPIntro target="Have been running" pronunciation="hæv biːn ˈrʌnɪŋ" {...props} />;
export const MFPPPPMeaning: React.FC<SlideProps> = (props) => <MFPMeaning meaningEn="Present Perfect Continuous: Focuses on the activity or recent side effects." meaningRu="Акцент на процессе или видимом результате." meaningUz="Harakat jarayoniga urg'u beriladi." form="Have/Has + been + Verb-ing" {...props} />;
export const MFPPPPExamples: React.FC<SlideProps> = (props) => <MFPExamples examples={[{ text: "Sorry I'm late, I've been waiting for the bus.", isCorrect: true }, { text: "She has been working here for 10 years.", isCorrect: true }, { text: "I have been knowing him for years.", isCorrect: false, note: "Stative verbs (know, like) cannot be continuous." }]} {...props} />;

// 5. Collocation
export const MFPColloIntro: React.FC<SlideProps> = (props) => <MFPIntro target="Depend on" pronunciation="dɪˈpend ɒn" {...props} />;
export const MFPColloMeaning: React.FC<SlideProps> = (props) => <MFPMeaning meaningEn="To be determined by something else; to rely on." meaningRu="Зависеть от (кого-то/чего-то)." meaningUz="...ga bog'liq bo'lmoq; tayanmoq." form="Verb + Preposition 'ON'" {...props} />;
export const MFPColloExamples: React.FC<SlideProps> = (props) => <MFPExamples examples={[{ text: "Our trip depends on the weather.", isCorrect: true }, { text: "You can always depend on me.", isCorrect: true }, { text: "It depends from the price.", isCorrect: false, note: "Common Error! Always 'depend ON'." }]} {...props} />;


// --- OTHER SLIDES ---

export const IntroSlide: React.FC<SlideProps> = ({ onNext, lang }) => (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto px-4"
    >
        <motion.div variants={itemVariants} className="mb-4">
            <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text text-9xl font-black tracking-tighter drop-shadow-2xl">
                B2
            </span>
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-bold text-white mb-6">
            Unit 1: Communication
        </motion.h2>
        <motion.p variants={itemVariants} className="text-xl md:text-2xl text-dim mb-12 max-w-2xl leading-relaxed">
            {t(lang, {
                en: "The rules of conversation, question types, and the evolution of written correspondence.",
                ru: "Правила разговора, типы вопросов и эволюция письменной переписки.",
                uz: "Suhbat qoidalari, savol turlari va yozma yozishmalarning rivojlanishi."
            })}
        </motion.p>
        <motion.div variants={itemVariants}>
            <Button onClick={onNext}>{t(lang, { en: "Start Lesson", ru: "Начать Урок", uz: "Darsni Boshlash" })}</Button>
        </motion.div>
    </motion.div>
);

export const ConversationSortSlide: React.FC<SlideProps> = ({ onNext, lang }) => {
    const initialItems = [
        { id: '1', text: 'have a row', type: 'bad' },
        { id: '2', text: 'put someone at ease', type: 'good' },
        { id: '3', text: 'listen enthusiastically', type: 'good' },
        { id: '4', text: 'have awkward silences', type: 'bad' },
        { id: '5', text: 'put your foot in it', type: 'bad' },
        { id: '6', text: 'establish shared interests', type: 'good' },
        { id: '7', text: 'dominate conversation', type: 'bad' },
        { id: '8', text: 'hit it off', type: 'good' },
    ];

    const [items, setItems] = useState(initialItems.sort(() => Math.random() - 0.5));
    const [classified, setClassified] = useState<Record<string, 'good' | 'bad' | null>>({});
    const [showResults, setShowResults] = useState(false);

    const handleClassify = (id: string, type: 'good' | 'bad') => {
        setClassified(prev => ({ ...prev, [id]: type }));
    };

    const checkAnswers = () => setShowResults(true);

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full w-full max-w-6xl mx-auto px-4 pt-4">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white">{t(lang, { en: "The Rules of Conversation", ru: "Правила разговора", uz: "Suhbat qoidalari" })}</h2>
                <p className="text-dim">{t(lang, { en: "Aim to do vs. Avoid", ru: "Что делать vs. Чего избегать", uz: "Qilish kerak vs. Qochish kerak" })}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 min-h-0">
                {/* Good Zone */}
                <div className="bg-green-500/10 border-2 border-green-500/30 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto custom-scroll">
                    <div className="flex items-center justify-center gap-2 text-green-400 font-bold mb-2">
                        <ThumbsUp size={24} /> {t(lang, { en: "Aim to Do", ru: "Делай это", uz: "Buni qil" })}
                    </div>
                    <AnimatePresence>
                        {items.filter(i => classified[i.id] === 'good').map(item => (
                            <motion.div
                                key={item.id}
                                layoutId={item.id}
                                className={`bg-card p-3 rounded-lg shadow-md border ${showResults && item.type === 'bad' ? 'border-red-500' : 'border-green-500/50'}`}
                                onClick={() => !showResults && handleClassify(item.id, 'bad')} 
                            >
                                {item.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Neutral Zone */}
                <div className="flex flex-col gap-3 justify-center">
                    <AnimatePresence>
                        {items.filter(i => !classified[i.id]).map(item => (
                            <motion.div
                                key={item.id}
                                layoutId={item.id}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white/10 hover:bg-white/20 p-4 rounded-xl cursor-pointer text-center font-medium backdrop-blur-sm transition-colors border border-white/5"
                            >
                                <div className="mb-2">{item.text}</div>
                                <div className="flex justify-center gap-4">
                                    <button onClick={(e) => { e.stopPropagation(); handleClassify(item.id, 'good'); }} className="p-2 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-full transition-colors"><ThumbsUp size={16} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleClassify(item.id, 'bad'); }} className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full transition-colors"><ThumbsDown size={16} /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {Object.keys(classified).length === items.length && !showResults && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-4">
                            <Button onClick={checkAnswers}>{t(lang, { en: "Check", ru: "Проверить", uz: "Tekshirish" })}</Button>
                        </motion.div>
                    )}
                </div>

                {/* Bad Zone */}
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto custom-scroll">
                    <div className="flex items-center justify-center gap-2 text-red-400 font-bold mb-2">
                        <ThumbsDown size={24} /> {t(lang, { en: "Avoid", ru: "Избегай", uz: "Qoching" })}
                    </div>
                    <AnimatePresence>
                        {items.filter(i => classified[i.id] === 'bad').map(item => (
                            <motion.div
                                key={item.id}
                                layoutId={item.id}
                                className={`bg-card p-3 rounded-lg shadow-md border ${showResults && item.type === 'good' ? 'border-green-500' : 'border-red-500/50'}`}
                                onClick={() => !showResults && handleClassify(item.id, 'good')}
                            >
                                {item.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export const IdiomsSlide: React.FC<SlideProps> = ({ lang }) => {
    const idioms: IdiomCard[] = [
        { 
            id: 1, 
            term: "Put your foot in it", 
            definition: { en: "To say something embarrassing.", ru: "Сказать что-то неловкое.", uz: "Noqulay gap aytib qo'ymoq." }, 
            icon: <Footprints size={48} />, 
            example: '"I asked about his wife, forgetting they divorced."' 
        },
        { 
            id: 2, 
            term: "Hit it off", 
            definition: { en: "To like someone immediately.", ru: "Сразу поладить с кем-то.", uz: "Bir ko'rishda yoqtirib qolmoq." }, 
            icon: <Zap size={48} />, 
            example: '"We met at the party and just hit it off."' 
        },
        { 
            id: 3, 
            term: "Small talk", 
            definition: { en: "Polite conversation about unimportant matters.", ru: "Светская беседа.", uz: "Kichik suhbat (havo haqida)." }, 
            icon: <CloudSun size={48} />, 
            example: '"I hate small talk about the weather."' 
        },
    ];

    const [flippedId, setFlippedId] = useState<number | null>(null);

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full px-4">
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-white mb-10">{t(lang, { en: "Idioms Cards", ru: "Идиомы", uz: "Iboralar" })}</motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
                {idioms.map((idiom) => (
                    <div key={idiom.id} className="h-80 w-full perspective-1000 cursor-pointer group" onClick={() => setFlippedId(flippedId === idiom.id ? null : idiom.id)}>
                        <motion.div 
                            className="relative w-full h-full duration-500 preserve-3d"
                            animate={{ rotateY: flippedId === idiom.id ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors">
                                <div className="text-primary mb-4">{idiom.icon}</div>
                                <h3 className="text-2xl font-bold text-white">{idiom.term}</h3>
                                <p className="text-dim mt-4 text-sm uppercase tracking-widest">{t(lang, { en: "Click", ru: "Кликни", uz: "Bosing" })}</p>
                            </div>
                            
                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary to-orange-600 rounded-2xl p-6 flex flex-col items-center justify-center text-center rotate-y-180 shadow-xl">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{idiom.term}</h3>
                                <p className="text-gray-900 font-medium mb-4">{t(lang, idiom.definition)}</p>
                                <div className="bg-black/10 p-3 rounded-lg">
                                    <p className="text-gray-900 italic text-sm">{idiom.example}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export const SilenceSlide: React.FC<SlideProps> = ({ lang }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const maxTime = 60; 

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isActive) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => { setIsActive(false); setTimeLeft(0); };

    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.min(timeLeft, maxTime) / maxTime) * circumference;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full">
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-primary mb-2">{t(lang, { en: "The Silence Experiment", ru: "Эксперимент с молчанием", uz: "Sukunat tajribasi" })}</motion.h2>
            <motion.p variants={itemVariants} className="text-dim text-lg mb-8 max-w-xl text-center">
                {t(lang, {
                    en: "In some cultures silence shows respect. In others it causes anxiety. Test your tolerance.",
                    ru: "В некоторых культурах молчание — знак уважения. В других оно вызывает тревогу. Проверьте себя.",
                    uz: "Ba'zi madaniyatlarda sukunat hurmat belgisidir. Boshqalarida esa xavotir uyg'otadi. O'zingizni sinab ko'ring."
                })}
            </motion.p>
            
            <div className="relative mb-10">
                <svg width="300" height="300" className="transform -rotate-90">
                    <circle cx="150" cy="150" r={radius} stroke="#1f2937" strokeWidth="12" fill="transparent" />
                    <motion.circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke={timeLeft > 10 ? "#ec4899" : "#f59e0b"}
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "linear" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-mono font-bold text-white">
                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                </div>
            </div>

            <motion.div variants={itemVariants} className="flex gap-4">
                <Button onClick={toggleTimer} variant={isActive ? "secondary" : "primary"}>
                    {isActive ? t(lang, {en:"Pause", ru:"Пауза", uz:"To'xtatish"}) : t(lang, {en:"Start", ru:"Старт", uz:"Boshlash"})}
                </Button>
                <Button onClick={resetTimer} variant="outline">{t(lang, {en:"Reset", ru:"Сброс", uz:"Qayta"})}</Button>
            </motion.div>
        </motion.div>
    );
};

export const GrammarSlide: React.FC<SlideProps> = ({ lang }) => {
    const [mode, setMode] = useState<'subject' | 'object'>('subject');

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto">
            <motion.h2 variants={itemVariants} className="text-4xl font-bold text-primary mb-8">{t(lang, { en: "Subject vs Object Questions", ru: "Вопросы к подлежащему vs дополнению", uz: "Ega va To'ldiruvchi so'roqlari" })}</motion.h2>
            
            <motion.div variants={itemVariants} className="bg-black/30 p-1.5 rounded-full flex mb-12 relative">
                <motion.div 
                    className="absolute top-1.5 bottom-1.5 w-[140px] bg-secondary rounded-full shadow-lg"
                    animate={{ left: mode === 'subject' ? '6px' : '150px' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <button 
                    onClick={() => setMode('subject')} 
                    className={`relative z-10 w-[140px] py-3 rounded-full font-bold transition-colors ${mode === 'subject' ? 'text-white' : 'text-dim hover:text-white'}`}
                >
                    Subject
                </button>
                <button 
                    onClick={() => setMode('object')} 
                    className={`relative z-10 w-[140px] py-3 rounded-full font-bold transition-colors ${mode === 'object' ? 'text-white' : 'text-dim hover:text-white'}`}
                >
                    Object
                </button>
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <Card className="text-center min-h-[300px] flex flex-col items-center justify-center">
                        {mode === 'subject' ? (
                            <>
                                <h3 className="text-5xl font-black text-white mb-6">
                                    <span className="text-secondary">WHO</span> called you?
                                </h3>
                                <p className="text-xl text-dim mb-8">
                                    {t(lang, {
                                        en: "We don't know the person performing the action (Subject). Do NOT use auxiliary verbs.",
                                        ru: "Мы не знаем, кто совершает действие (Подлежащее). НЕ используйте вспомогательные глаголы.",
                                        uz: "Biz harakat bajaruvchisini (Ega) bilmaymiz. Yordamchi fe'llardan foydalanmang."
                                    })}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3">
                                        <XCircle className="text-red-500 shrink-0" />
                                        <span className="text-red-200">Who did call you?</span>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center gap-3">
                                        <CheckCircle className="text-green-500 shrink-0" />
                                        <span className="text-green-200">Who called you?</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-5xl font-black text-white mb-6">
                                    <span className="text-primary">WHO</span> did you call?
                                </h3>
                                <p className="text-xl text-dim mb-8">
                                    {t(lang, {
                                        en: "We know the subject (You). We want the recipient (Object). Use auxiliary verbs.",
                                        ru: "Мы знаем подлежащее (Ты). Нам нужен получатель (Объект). Используйте вспомогательные глаголы.",
                                        uz: "Biz egani bilamiz (Siz). Bizga qabul qiluvchi (To'ldiruvchi) kerak. Yordamchi fe'llardan foydalaning."
                                    })}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
                                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl flex items-center gap-3">
                                        <XCircle className="text-red-500 shrink-0" />
                                        <span className="text-red-200">Who you called?</span>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center gap-3">
                                        <CheckCircle className="text-green-500 shrink-0" />
                                        <span className="text-green-200">Who <b>DID</b> you call?</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </Card>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export const QuestionUnscrambleSlide: React.FC<SlideProps> = ({ lang }) => {
    // ... logic same as before, just translate instructions
    const questions = [
        { id: 1, words: ['What', 'makes', 'you', 'laugh', '?'], scrambled: ['laugh', 'makes', 'What', 'you', '?'] },
        { id: 2, words: ['Who', 'do', 'you', 'think', 'will', 'go', 'out', 'tonight', '?'], scrambled: ['out', 'think', 'go', 'do', 'will', 'you', 'Who', 'tonight', '?'] },
        { id: 3, words: ['Do', 'you', 'know', 'why', 'your', 'parents', 'chose', 'your', 'name', '?'], scrambled: ['your', 'why', 'name', 'Do', 'parents', 'chose', 'know', 'your', 'you', '?'] },
    ];
    // Reimplement logic for brevity, reusing existing state
    const [currentQ, setCurrentQ] = useState(0);
    const [userOrder, setUserOrder] = useState<string[]>([]);
    const [pool, setPool] = useState<string[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        setPool(questions[currentQ].scrambled);
        setUserOrder([]);
        setIsCorrect(null);
    }, [currentQ]);

    const addToSentence = (word: string, index: number) => {
        if (isCorrect) return;
        const newPool = [...pool];
        newPool.splice(index, 1);
        setPool(newPool);
        setUserOrder([...userOrder, word]);
    };

    const returnToPool = (word: string, index: number) => {
        if (isCorrect) return;
        const newOrder = [...userOrder];
        newOrder.splice(index, 1);
        setUserOrder(newOrder);
        setPool([...pool, word]);
    };

    const checkAnswer = () => {
        const correct = JSON.stringify(userOrder) === JSON.stringify(questions[currentQ].words);
        setIsCorrect(correct);
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-4">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-2">{t(lang, {en:"Build the Question", ru:"Составь вопрос", uz:"Savol tuzing"})}</motion.h2>
            <motion.p variants={itemVariants} className="text-dim mb-8">{t(lang, {en:"Tap words to arrange them.", ru:"Нажимай на слова, чтобы расставить их.", uz:"So'zlarni tartiblash uchun bosing."})}</motion.p>
            
            <div className="w-full min-h-[100px] bg-white/5 border-2 border-dashed border-white/20 rounded-2xl p-6 flex flex-wrap gap-3 items-center justify-center mb-8 relative">
                 <AnimatePresence>
                    {userOrder.map((word, i) => (
                        <motion.button
                            key={`${word}-${i}`}
                            layoutId={`${word}-${i}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={() => returnToPool(word, i)}
                            className="bg-primary text-black font-bold px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-400"
                        >
                            {word}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex flex-wrap gap-3 justify-center mb-10 max-w-2xl">
                 <AnimatePresence>
                    {pool.map((word, i) => (
                        <motion.button
                            key={`${word}-pool-${i}`}
                            layoutId={`${word}-pool-${i}`}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={() => addToSentence(word, i)}
                            className="bg-card border border-white/20 text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                        >
                            {word}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            <div className="flex gap-4 items-center h-16">
                {isCorrect === null && userOrder.length > 0 && (
                    <Button onClick={checkAnswer}>{t(lang, {en:"Check", ru:"Проверить", uz:"Tekshirish"})}</Button>
                )}
                {isCorrect === true && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-green-400 font-bold text-xl"><CheckCircle /> Correct!</div>
                        {currentQ < questions.length - 1 ? (
                            <Button onClick={() => setCurrentQ(prev => prev + 1)} variant="secondary">Next</Button>
                        ) : (
                            <div className="text-dim">Done!</div>
                        )}
                    </motion.div>
                )}
                {isCorrect === false && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                         <button onClick={() => { setUserOrder([]); setPool(questions[currentQ].scrambled); setIsCorrect(null); }} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><RefreshCw size={20}/></button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export const CommTypesSlide: React.FC<SlideProps> = ({ lang }) => {
    // ... logic same
    const items = [
        { id: 1, text: 'Handwriting', cat: 'paper' },
        { id: 2, text: 'Emoticon', cat: 'electronic' },
        { id: 3, text: 'Postage stamp', cat: 'paper' },
        { id: 4, text: 'Texting', cat: 'electronic' },
        { id: 5, text: 'Inbox', cat: 'electronic' },
        { id: 6, text: 'Stationery', cat: 'paper' },
        { id: 7, text: 'Confidential', cat: 'both' },
        { id: 8, text: 'Punctuation', cat: 'both' },
    ];
    const [assignments, setAssignments] = useState<Record<number, string>>({});
    const assign = (id: number, cat: string) => { setAssignments(prev => ({...prev, [id]: cat})); };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full w-full max-w-6xl mx-auto px-4 pt-4">
            <h2 className="text-3xl font-bold text-white text-center mb-8">{t(lang, {en:"Communication Channels", ru:"Каналы связи", uz:"Aloqa kanallari"})}</h2>
            
            <div className="grid grid-cols-3 gap-6 h-[400px]">
                {['Paper', 'Electronic', 'Both'].map(cat => {
                    const catKey = cat.toLowerCase();
                    const icon = catKey === 'paper' ? <Mail /> : catKey === 'electronic' ? <Smartphone /> : <Layers />;
                    const color = catKey === 'paper' ? 'border-orange-500/50 bg-orange-500/10' : catKey === 'electronic' ? 'border-blue-500/50 bg-blue-500/10' : 'border-purple-500/50 bg-purple-500/10';
                    return (
                        <div key={cat} className={`rounded-2xl border-2 ${color} p-4 flex flex-col items-center`}>
                            <div className="flex items-center gap-2 font-bold text-white mb-4 uppercase tracking-widest">{icon} {cat}</div>
                            <div className="w-full flex-1 flex flex-col gap-2">
                                {items.filter(i => assignments[i.id] === catKey).map(i => (
                                    <motion.div layoutId={`item-${i.id}`} key={i.id} className="bg-card px-4 py-2 rounded-lg text-center shadow-sm text-sm border border-white/10">
                                        {i.text}
                                        {i.cat !== catKey && <span className="ml-2 text-red-500">⚠</span>}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-8 p-6 bg-white/5 rounded-2xl min-h-[100px]">
                {items.filter(i => !assignments[i.id]).map(i => (
                    <motion.div layoutId={`item-${i.id}`} key={i.id} className="bg-card border border-white/20 px-4 py-2 rounded-lg cursor-pointer hover:scale-105 transition-transform flex flex-col items-center gap-2 group relative">
                        {i.text}
                        <div className="absolute -top-10 hidden group-hover:flex gap-1 bg-black/80 p-1 rounded backdrop-blur z-20">
                            <button onClick={() => assign(i.id, 'paper')} className="p-1 hover:text-orange-400"><Mail size={14}/></button>
                            <button onClick={() => assign(i.id, 'electronic')} className="p-1 hover:text-blue-400"><Smartphone size={14}/></button>
                            <button onClick={() => assign(i.id, 'both')} className="p-1 hover:text-purple-400"><Layers size={14}/></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export const QuizSlide: React.FC<SlideProps> = ({ lang }) => {
    const [selected, setSelected] = useState<'simple' | 'continuous' | null>(null);

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full w-full pt-10 px-4">
            <motion.div variants={itemVariants} className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">{t(lang, {en:"Result vs Activity", ru:"Результат или Действие", uz:"Natija yoki Harakat"})}</h2>
                <p className="text-dim">{t(lang, {en:"Which sentence matches the image?", ru:"Какое предложение подходит?", uz:"Qaysi gap rasmga mos?"})}</p>
            </motion.div>

            <div className="flex-1 flex gap-6 md:gap-12 items-center justify-center max-w-6xl mx-auto w-full pb-20">
                {/* Option 1 */}
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelected('simple')}
                    className={`flex-1 h-[400px] rounded-3xl cursor-pointer border-4 transition-all duration-300 flex flex-col items-center justify-center gap-6 p-8 relative overflow-hidden ${selected === 'simple' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 bg-card hover:border-gray-500'}`}
                >
                    <div className="text-8xl">🥵</div>
                    <p className="text-2xl font-bold text-center">"I have run."</p>
                    {selected === 'simple' && (
                        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-red-900/80 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-center p-6">
                                <XCircle className="text-red-500 w-20 h-20 mx-auto mb-4" />
                                <p className="text-white font-bold text-xl">Incorrect</p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Option 2 */}
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelected('continuous')}
                    className={`flex-1 h-[400px] rounded-3xl cursor-pointer border-4 transition-all duration-300 flex flex-col items-center justify-center gap-6 p-8 relative overflow-hidden ${selected === 'continuous' ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-card hover:border-gray-500'}`}
                >
                    <div className="text-8xl">🥵 + ⏱️</div>
                    <p className="text-2xl font-bold text-center">"I have been running."</p>
                    {selected === 'continuous' && (
                        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-green-900/80 flex items-center justify-center backdrop-blur-sm">
                            <div className="text-center p-6">
                                <CheckCircle className="text-green-500 w-20 h-20 mx-auto mb-4" />
                                <p className="text-white font-bold text-xl">Correct!</p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

// --- SPLIT LETTER GRAMMAR ---

const LetterGrammarBase: React.FC<{ 
    part: 1 | 2; 
    lang: 'en' | 'ru' | 'uz'; 
    onNext?: () => void 
}> = ({ part, lang, onNext }) => {
    const [inputs, setInputs] = useState<Record<number, string>>({});
    const [checked, setChecked] = useState(false);
    
    const answers: Record<number, string[]> = {
        1: ['has collected', 'has been collecting'],
        2: ['has posted', 'has been posting'],
        3: ['has become'],
        4: ['has got', 'has gotten'],
        5: ['has just released', 'has released'],
        6: ['has recently started', 'has started'],
        7: ['has gathered'],
        8: ['has obtained']
    };

    const isCorrect = (id: number) => {
        const val = inputs[id]?.toLowerCase().trim() || "";
        return answers[id].some(a => val.includes(a));
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-4 overflow-y-auto custom-scroll py-10">
            <h2 className="text-3xl font-bold text-white mb-6 sticky top-0 bg-background/95 backdrop-blur z-10 py-2 w-full text-center">
                Letters of Note ({part}/2)
            </h2>
            
            <div className="bg-white text-gray-900 p-8 rounded-lg shadow-2xl font-serif text-lg leading-relaxed max-w-2xl w-full relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Type size={100} /></div>
                
                {part === 1 ? (
                    <>
                        <p className="mb-4">
                            Shaun Usher is a blogger who, since 2009, 
                            <span className="inline-block mx-2 border-b-2 border-gray-400 min-w-[120px]">
                                <input type="text" className={`w-full bg-transparent outline-none font-sans font-bold text-sm ${checked ? (isCorrect(1) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} placeholder="(collect)" onChange={(e) => setInputs({...inputs, 1: e.target.value})} />
                            </span>
                            letters written by famous people. 
                        </p>
                        <p className="mb-4">
                            He 
                            <span className="inline-block mx-2 border-b-2 border-gray-400 min-w-[120px]">
                                <input type="text" className={`w-full bg-transparent outline-none font-sans font-bold text-sm ${checked ? (isCorrect(2) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} placeholder="(post)" onChange={(e) => setInputs({...inputs, 2: e.target.value})} />
                            </span>
                            them on his website, which 
                            <span className="inline-block mx-2 border-b-2 border-gray-400 min-w-[120px]">
                                <input type="text" className={`w-full bg-transparent outline-none font-sans font-bold text-sm ${checked ? (isCorrect(3) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} placeholder="(become)" onChange={(e) => setInputs({...inputs, 3: e.target.value})} />
                            </span>
                            extremely popular.
                        </p>
                    </>
                ) : (
                    <>
                         <p className="mb-4">
                            He 
                            <span className="inline-block mx-2 border-b-2 border-gray-400 min-w-[120px]">
                                <input type="text" className={`w-full bg-transparent outline-none font-sans font-bold text-sm ${checked ? (isCorrect(4) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} placeholder="(get)" onChange={(e) => setInputs({...inputs, 4: e.target.value})} />
                            </span>
                            together 900 letters. He 
                            <span className="inline-block mx-2 border-b-2 border-gray-400 min-w-[140px]">
                                <input type="text" className={`w-full bg-transparent outline-none font-sans font-bold text-sm ${checked ? (isCorrect(5) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} placeholder="(just / release)" onChange={(e) => setInputs({...inputs, 5: e.target.value})} />
                            </span>
                            the letters in a book.
                        </p>
                        <p>
                            Usher 
                            <span className="inline-block mx-2 border-b-2 border-gray-400 min-w-[140px]">
                                <input type="text" className={`w-full bg-transparent outline-none font-sans font-bold text-sm ${checked ? (isCorrect(6) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} placeholder="(recently / start)" onChange={(e) => setInputs({...inputs, 6: e.target.value})} />
                            </span>
                            a new project...
                        </p>
                    </>
                )}
            </div>
            
            <div className="mt-8 flex gap-4">
                <Button onClick={() => setChecked(true)}>{t(lang, {en:"Check", ru:"Проверить", uz:"Tekshirish"})}</Button>
                {onNext && <Button variant="secondary" onClick={onNext}>Next Part</Button>}
            </div>
        </motion.div>
    );
};

export const LetterGrammarSlide1: React.FC<SlideProps> = (props) => <LetterGrammarBase part={1} {...props} />;
export const LetterGrammarSlide2: React.FC<SlideProps> = (props) => <LetterGrammarBase part={2} {...props} />;

export const PrepositionsSlide: React.FC<SlideProps> = ({ lang }) => {
    // Logic kept simple, UI translated
    const pairs = [
        { verb: 'depend', prep: 'on' },
        { verb: 'contribute', prep: 'to' },
        { verb: 'prevent', prep: 'from' },
        { verb: 'disapprove', prep: 'of' },
        { verb: 'confuse', prep: 'with' },
        { verb: 'result', prep: 'in' },
        { verb: 'heard', prep: 'of' },
    ];
    const [selectedVerb, setSelectedVerb] = useState<string | null>(null);
    const [solved, setSolved] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleVerbClick = (v: string) => {
        if (solved.includes(v)) return;
        setSelectedVerb(v);
        setError(null);
    };

    const handlePrepClick = (p: string) => {
        if (!selectedVerb) return;
        const correct = pairs.find(pair => pair.verb === selectedVerb)?.prep;
        if (correct === p) {
            setSolved([...solved, selectedVerb]);
            setSelectedVerb(null);
        } else {
            setError("Try again!");
            setTimeout(() => setError(null), 1000);
        }
    };

    const prepsDisplay = [...new Set(pairs.map(p => p.prep))].sort();

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-8">{t(lang, {en:"Verbs + Prepositions", ru:"Глаголы + Предлоги", uz:"Fe'llar + Predloglar"})}</h2>
            <div className="flex w-full gap-20 justify-center">
                <div className="flex flex-col gap-4">
                    {pairs.map((pair) => (
                        <motion.button
                            key={pair.verb}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleVerbClick(pair.verb)}
                            className={`px-8 py-3 rounded-xl font-bold text-lg transition-all border-2 ${solved.includes(pair.verb) ? 'bg-green-500 border-green-500 text-white opacity-50 cursor-default' : selectedVerb === pair.verb ? 'bg-primary border-primary text-black' : 'bg-card border-white/10 text-white hover:border-primary'}`}
                        >
                            {pair.verb}
                        </motion.button>
                    ))}
                </div>
                <div className="flex flex-col justify-center items-center text-dim w-10">
                    {error ? <XCircle className="text-red-500 animate-bounce" /> : <Link />}
                </div>
                <div className="flex flex-col gap-4 justify-center">
                    {prepsDisplay.map((prep) => (
                        <motion.button
                            key={prep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePrepClick(prep)}
                            className="px-8 py-3 rounded-xl font-bold text-lg bg-card border-2 border-white/10 text-white hover:border-secondary hover:bg-secondary/10 transition-all"
                        >
                            {prep.toUpperCase()}
                        </motion.button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export const EmailSlide: React.FC<SlideProps> = ({ lang }) => {
    const [sent, setSent] = useState(false);
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto px-4">
            <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-6">{t(lang, {en:"Mission Complete", ru:"Миссия выполнена", uz:"Vazifa bajarildi"})}</motion.h2>
            <motion.p variants={itemVariants} className="text-dim mb-8 text-center">{t(lang, {en:"Write your exit email to the teacher.", ru:"Напиши прощальное письмо учителю.", uz:"O'qituvchiga yakuniy xat yozing."})}</motion.p>
            {!sent ? (
                <motion.div variants={itemVariants} className="w-full bg-white text-gray-900 rounded-lg overflow-hidden shadow-2xl">
                    <div className="bg-gray-100 p-4 border-b border-gray-200 flex items-center justify-between"><span className="font-bold text-gray-700">New Message</span></div>
                    <div className="p-6">
                        <div className="border-b border-gray-200 pb-2 mb-4 text-gray-500 text-sm">To: <span className="text-gray-900">Teacher</span></div>
                        <textarea className="w-full h-32 resize-none outline-none font-serif text-lg text-gray-800 placeholder-gray-300" placeholder="I've been thinking about..."></textarea>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setSent(true)} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"><Send size={16} /> Send</button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-500/20 border border-green-500 p-8 rounded-2xl text-center">
                    <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white">Sent!</h3>
                </motion.div>
            )}
        </motion.div>
    );
};