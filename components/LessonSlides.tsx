
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideProps, IdiomCard } from '../types';
import { Button, Card, t } from './UI';
import { 
    Timer, Footprints, Zap, CloudSun, CheckCircle, XCircle, Send, 
    ThumbsUp, ThumbsDown, ArrowRight, RefreshCw, Mail, Smartphone, Layers,
    Link, Type, Speaker, AlertTriangle, Eye, Globe
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
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(target);
            utterance.lang = 'en-GB'; 
            utterance.rate = 0.9; 
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full">
            <h3 className="text-dim uppercase tracking-[0.2em] mb-8 font-bold text-2xl">{t(lang, { en: "Target Language", ru: "Целевой Язык", uz: "O'rganilayotgan Til" })}</h3>
            <h2 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-12 text-center drop-shadow-sm max-w-[90vw] leading-tight">
                {target}
            </h2>
            <motion.button 
                onClick={playAudio}
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-6 text-4xl text-dim font-serif italic bg-white/5 px-12 py-6 rounded-full cursor-pointer transition-colors group border border-white/5 hover:border-primary/30"
            >
                <span className="opacity-70">/{pronunciation}/</span>
                <Speaker size={40} className="text-primary group-hover:text-white transition-colors" />
            </motion.button>
            <p className="text-dim/50 text-xl mt-6 uppercase tracking-widest font-bold">
                {t(lang, { en: "Tap to Listen", ru: "Нажми, чтобы послушать", uz: "Eshitish uchun bosing" })}
            </p>
            {onNext && <div className="mt-16"><Button onClick={onNext}>{t(lang, { en: "Meaning & Form", ru: "Значение и Форма", uz: "Ma'no va Shakl" })}</Button></div>}
        </motion.div>
    );
};

// Phase 2: Meaning & Form
const MFPMeaning: React.FC<Pick<MFPProps, 'meaningEn' | 'meaningRu' | 'meaningUz' | 'form' | 'lang' | 'onNext'>> = ({ meaningEn, meaningRu, meaningUz, form, lang, onNext }) => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-[80vw] mx-auto">
        <div className="bg-card/50 backdrop-blur-md border border-white/10 rounded-[3rem] p-12 w-full mb-10 shadow-2xl">
            <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-xl mb-8">
                <Globe size={24} /> {t(lang, { en: "Meaning", ru: "Значение", uz: "Ma'nosi" })}
            </div>
            <div className="space-y-8">
                <div className="border-l-8 border-blue-500 pl-8">
                    <span className="text-lg text-blue-400 font-bold uppercase block mb-1">English</span>
                    <p className="text-4xl text-white font-medium leading-normal">{meaningEn}</p>
                </div>
                <div className="border-l-8 border-red-500 pl-8">
                    <span className="text-lg text-red-400 font-bold uppercase block mb-1">Russian</span>
                    <p className="text-4xl text-white font-medium leading-normal">{meaningRu}</p>
                </div>
                <div className="border-l-8 border-green-500 pl-8">
                    <span className="text-lg text-green-400 font-bold uppercase block mb-1">Uzbek</span>
                    <p className="text-4xl text-white font-medium leading-normal">{meaningUz}</p>
                </div>
            </div>
        </div>

        {form && (
            <div className="w-full bg-black/20 rounded-3xl p-8 border border-white/5">
                <span className="text-dim text-lg uppercase font-bold block mb-4">{t(lang, { en: "Form / Structure", ru: "Форма / Структура", uz: "Shakl / Tuzilma" })}</span>
                <code className="text-yellow-400 text-4xl font-mono block">{form}</code>
            </div>
        )}

        {onNext && <div className="mt-12"><Button onClick={onNext}>{t(lang, { en: "Examples", ru: "Примеры", uz: "Misollar" })}</Button></div>}
    </motion.div>
);

// Phase 3: Examples
const MFPExamples: React.FC<Pick<MFPProps, 'examples' | 'lang' | 'onNext'>> = ({ examples, lang, onNext }) => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-[80vw] mx-auto px-6">
        <h2 className="text-5xl font-bold text-white mb-12">{t(lang, { en: "Examples & Common Errors", ru: "Примеры и Ошибки", uz: "Misollar va Xatolar" })}</h2>
        
        <div className="flex flex-col gap-6 w-full">
            {examples.map((ex, i) => (
                <motion.div 
                    key={i} 
                    variants={itemVariants}
                    className={`relative p-8 rounded-3xl border-l-[12px] shadow-lg ${ex.isCorrect ? 'bg-green-500/10 border-green-500' : 'bg-red-500/10 border-red-500'}`}
                >
                    <div className="absolute top-8 right-8">
                        {ex.isCorrect ? <CheckCircle className="text-green-500" size={32}/> : <XCircle className="text-red-500" size={32}/>}
                    </div>
                    <p className={`text-3xl font-medium pr-14 leading-relaxed ${ex.isCorrect ? 'text-white' : 'text-dim line-through decoration-red-500/50 decoration-4'}`}>
                        {ex.text}
                    </p>
                    {ex.note && (
                        <div className="mt-4 text-xl flex items-center gap-3 font-bold">
                            {ex.isCorrect ? (
                                <span className="text-green-400">{ex.note}</span>
                            ) : (
                                <span className="text-red-400 flex items-center gap-2"><AlertTriangle size={24}/> {ex.note}</span>
                            )}
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
        {onNext && <div className="mt-16"><Button onClick={onNext}>{t(lang, { en: "Continue", ru: "Продолжить", uz: "Davom etish" })} <ArrowRight size={24} /></Button></div>}
    </motion.div>
);

// --- SPECIFIC MFP SLIDES ---
// (Unchanged logic, just utilizing the new larger components)
export const MFPIdiomIntro: React.FC<SlideProps> = (props) => <MFPIntro target="Put your foot in it" pronunciation="pʊt jɔː fʊt ɪn ɪt" {...props} />;
export const MFPIdiomMeaning: React.FC<SlideProps> = (props) => <MFPMeaning meaningEn="To accidentally say something that embarrasses or upsets someone." meaningRu="Сболтнуть лишнее; попасть впросак." meaningUz="Qovun tushurmoq; noo'rin gapirib qo'ymoq." form="Idiom: Verb Phrase" {...props} />;
export const MFPIdiomExamples: React.FC<SlideProps> = (props) => <MFPExamples examples={[{ text: "I really put my foot in it when I asked about her ex-husband.", isCorrect: true }, { text: "He put his foot in it by mentioning the surprise party.", isCorrect: true }, { text: "I put my leg in it yesterday.", isCorrect: false, note: "Wrong body part! Always 'foot'." }]} {...props} />;

export const MFPSubjectQIntro: React.FC<SlideProps> = (props) => <MFPIntro target="Who called you?" pronunciation="huː kɔːld juː" {...props} />;
export const MFPSubjectQMeaning: React.FC<SlideProps> = (props) => <MFPMeaning meaningEn="Asking about the person who did the action (Subject)." meaningRu="Вопрос к подлежащему (Кто звонил?). Вспомогательный глагол не нужен." meaningUz="Ega so'roq gapi (Sizga kim qo'ng'iroq qildi?)." form="Who / What + Verb + Object?" {...props} />;
export const MFPSubjectQExamples: React.FC<SlideProps> = (props) => <MFPExamples examples={[{ text: "Who broke the window?", isCorrect: true }, { text: "What happened next?", isCorrect: true }, { text: "Who did break the window?", isCorrect: false, note: "Do NOT use 'did' for Subject questions." }]} {...props} />;

export const MFPVocabIntro: React.FC<SlideProps> = (props) => <MFPIntro target="Stationery" pronunciation="ˈsteɪʃənri" {...props} />;
export const MFPVocabMeaning: React.FC<SlideProps> = (props) => <MFPMeaning meaningEn="Materials used for writing, such as paper, pens, pencils." meaningRu="Канцелярские товары." meaningUz="Kantselyariya mollari." form="Uncountable Noun" {...props} />;
export const MFPVocabExamples: React.FC<SlideProps> = (props) => <MFPExamples examples={[{ text: "I need to buy some stationery.", isCorrect: true }, { text: "The stationery was beautiful.", isCorrect: true }, { text: "I bought many stationeries.", isCorrect: false, note: "Uncountable! No plural 's'." }]} {...props} />;

export const MFPPPPIntro: React.FC<SlideProps> = (props) => <MFPIntro target="Have been running" pronunciation="hæv biːn ˈrʌnɪŋ" {...props} />;
export const MFPPPPMeaning: React.FC<SlideProps> = (props) => <MFPMeaning meaningEn="Present Perfect Continuous: Focuses on the activity or recent side effects." meaningRu="Акцент на процессе или видимом результате." meaningUz="Harakat jarayoniga urg'u beriladi." form="Have/Has + been + Verb-ing" {...props} />;
export const MFPPPPExamples: React.FC<SlideProps> = (props) => <MFPExamples examples={[{ text: "Sorry I'm late, I've been waiting for the bus.", isCorrect: true }, { text: "She has been working here for 10 years.", isCorrect: true }, { text: "I have been knowing him for years.", isCorrect: false, note: "Stative verbs (know, like) cannot be continuous." }]} {...props} />;

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
        className="flex flex-col items-center justify-center h-full text-center max-w-[90vw] mx-auto px-4"
    >
        <motion.div variants={itemVariants} className="mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text text-[12rem] font-black tracking-tighter drop-shadow-2xl leading-none">
                B2
            </span>
        </motion.div>
        <motion.h2 variants={itemVariants} className="text-6xl md:text-8xl font-bold text-white mb-8">
            Unit 1: Communication
        </motion.h2>
        <motion.p variants={itemVariants} className="text-3xl md:text-4xl text-dim mb-16 max-w-5xl leading-relaxed">
            {t(lang, {
                en: "The rules of conversation, question types, and the evolution of written correspondence.",
                ru: "Правила разговора, типы вопросов и эволюция письменной переписки.",
                uz: "Suhbat qoidalari, savol turlari va yozma yozishmalarning rivojlanishi."
            })}
        </motion.p>
        <motion.div variants={itemVariants}>
            <Button onClick={onNext} className="text-2xl px-12 py-6">{t(lang, { en: "Start Lesson", ru: "Начать Урок", uz: "Darsni Boshlash" })}</Button>
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
    
    const showAnswers = () => {
        const newClassified: Record<string, 'good' | 'bad'> = {};
        items.forEach(item => {
            newClassified[item.id] = item.type as 'good' | 'bad';
        });
        setClassified(newClassified);
        setShowResults(true);
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full w-full max-w-[95vw] mx-auto px-4 pt-4">
            <div className="text-center mb-6">
                <h2 className="text-5xl font-bold text-white mb-2">{t(lang, { en: "The Rules of Conversation", ru: "Правила разговора", uz: "Suhbat qoidalari" })}</h2>
                <p className="text-dim text-2xl">{t(lang, { en: "Aim to do vs. Avoid", ru: "Что делать vs. Чего избегать", uz: "Qilish kerak vs. Qochish kerak" })}</p>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-8 mb-4 min-h-0">
                {/* Good Zone */}
                <div className="bg-green-500/10 border-4 border-green-500/30 rounded-3xl p-6 flex flex-col gap-4 overflow-y-auto custom-scroll">
                    <div className="flex items-center justify-center gap-3 text-green-400 font-bold mb-4 text-3xl uppercase tracking-wider">
                        <ThumbsUp size={32} /> {t(lang, { en: "Aim to Do", ru: "Делай это", uz: "Buni qil" })}
                    </div>
                    <AnimatePresence>
                        {items.filter(i => classified[i.id] === 'good').map(item => (
                            <motion.div
                                key={item.id}
                                layoutId={item.id}
                                className={`bg-card p-6 rounded-2xl shadow-lg border-2 text-2xl font-medium ${showResults && item.type === 'bad' ? 'border-red-500 text-red-200' : 'border-green-500/50 text-white'}`}
                                onClick={() => !showResults && handleClassify(item.id, 'bad')} 
                            >
                                {item.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Neutral Zone */}
                <div className="flex flex-col gap-4 justify-center">
                    <AnimatePresence>
                        {items.filter(i => !classified[i.id]).map(item => (
                            <motion.div
                                key={item.id}
                                layoutId={item.id}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white/10 hover:bg-white/20 p-6 rounded-2xl cursor-pointer text-center font-bold text-2xl backdrop-blur-sm transition-colors border border-white/5"
                            >
                                <div className="mb-4">{item.text}</div>
                                <div className="flex justify-center gap-6">
                                    <button onClick={(e) => { e.stopPropagation(); handleClassify(item.id, 'good'); }} className="p-4 bg-green-500/20 hover:bg-green-500 text-green-400 hover:text-white rounded-full transition-colors"><ThumbsUp size={24} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleClassify(item.id, 'bad'); }} className="p-4 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-full transition-colors"><ThumbsDown size={24} /></button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {items.some(i => !classified[i.id]) && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-8">
                            <Button onClick={showAnswers} variant="secondary">{t(lang, { en: "Reveal All", ru: "Показать все", uz: "Hammasini ko'rsatish" })}</Button>
                        </motion.div>
                    )}

                    {Object.keys(classified).length === items.length && !showResults && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-8">
                            <Button onClick={checkAnswers}>{t(lang, { en: "Check", ru: "Проверить", uz: "Tekshirish" })}</Button>
                        </motion.div>
                    )}
                </div>

                {/* Bad Zone */}
                <div className="bg-red-500/10 border-4 border-red-500/30 rounded-3xl p-6 flex flex-col gap-4 overflow-y-auto custom-scroll">
                    <div className="flex items-center justify-center gap-3 text-red-400 font-bold mb-4 text-3xl uppercase tracking-wider">
                        <ThumbsDown size={32} /> {t(lang, { en: "Avoid", ru: "Избегай", uz: "Qoching" })}
                    </div>
                    <AnimatePresence>
                        {items.filter(i => classified[i.id] === 'bad').map(item => (
                            <motion.div
                                key={item.id}
                                layoutId={item.id}
                                className={`bg-card p-6 rounded-2xl shadow-lg border-2 text-2xl font-medium ${showResults && item.type === 'good' ? 'border-green-500 text-green-200' : 'border-red-500/50 text-white'}`}
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
            icon: <Footprints size={64} />, 
            example: '"I asked about his wife, forgetting they divorced."' 
        },
        { 
            id: 2, 
            term: "Hit it off", 
            definition: { en: "To like someone immediately.", ru: "Сразу поладить с кем-то.", uz: "Bir ko'rishda yoqtirib qolmoq." }, 
            icon: <Zap size={64} />, 
            example: '"We met at the party and just hit it off."' 
        },
        { 
            id: 3, 
            term: "Small talk", 
            definition: { en: "Polite conversation about unimportant matters.", ru: "Светская беседа.", uz: "Kichik suhbat (havo haqida)." }, 
            icon: <CloudSun size={64} />, 
            example: '"I hate small talk about the weather."' 
        },
    ];

    const [flippedId, setFlippedId] = useState<number | null>(null);

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full px-4">
            <motion.h2 variants={itemVariants} className="text-6xl font-bold text-white mb-16">{t(lang, { en: "Idioms Cards", ru: "Идиомы", uz: "Iboralar" })}</motion.h2>
            
            <div className="grid grid-cols-3 gap-12 w-full max-w-[90vw]">
                {idioms.map((idiom) => (
                    <div key={idiom.id} className="h-[500px] w-full perspective-1000 cursor-pointer group" onClick={() => setFlippedId(flippedId === idiom.id ? null : idiom.id)}>
                        <motion.div 
                            className="relative w-full h-full duration-500 preserve-3d"
                            animate={{ rotateY: flippedId === idiom.id ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden bg-card/40 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors shadow-2xl">
                                <div className="text-primary mb-8">{idiom.icon}</div>
                                <h3 className="text-4xl font-bold text-white">{idiom.term}</h3>
                                <p className="text-dim mt-8 text-lg uppercase tracking-widest">{t(lang, { en: "Tap to Flip", ru: "Нажми", uz: "Aylantirish" })}</p>
                            </div>
                            
                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-primary to-orange-600 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center rotate-y-180 shadow-2xl">
                                <h3 className="text-3xl font-black text-gray-900 mb-6">{idiom.term}</h3>
                                <p className="text-white font-bold text-2xl mb-8 leading-relaxed">{t(lang, idiom.definition)}</p>
                                <div className="bg-black/20 p-6 rounded-2xl w-full">
                                    <p className="text-white italic text-xl">"{idiom.example}"</p>
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

    const radius = 180;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (Math.min(timeLeft, maxTime) / maxTime) * circumference;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full">
            <motion.h2 variants={itemVariants} className="text-6xl font-bold text-primary mb-4">{t(lang, { en: "The Silence Experiment", ru: "Эксперимент с молчанием", uz: "Sukunat tajribasi" })}</motion.h2>
            <motion.p variants={itemVariants} className="text-dim text-2xl mb-16 max-w-4xl text-center leading-relaxed">
                {t(lang, {
                    en: "In some cultures silence shows respect. In others it causes anxiety. Test your tolerance.",
                    ru: "В некоторых культурах молчание — знак уважения. В других оно вызывает тревогу. Проверьте себя.",
                    uz: "Ba'zi madaniyatlarda sukunat hurmat belgisidir. Boshqalarida esa xavotir uyg'otadi. O'zingizni sinab ko'ring."
                })}
            </motion.p>
            
            <div className="relative mb-16">
                <svg width="400" height="400" className="transform -rotate-90">
                    <circle cx="200" cy="200" r={radius} stroke="#1f2937" strokeWidth="20" fill="transparent" />
                    <motion.circle
                        cx="200"
                        cy="200"
                        r={radius}
                        stroke={timeLeft > 10 ? "#ec4899" : "#f59e0b"}
                        strokeWidth="20"
                        fill="transparent"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1, ease: "linear" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl font-mono font-bold text-white">
                        {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                </div>
            </div>

            <motion.div variants={itemVariants} className="flex gap-8">
                <Button onClick={toggleTimer} variant={isActive ? "secondary" : "primary"} className="text-2xl px-10 py-4">
                    {isActive ? t(lang, {en:"Pause", ru:"Пауза", uz:"To'xtatish"}) : t(lang, {en:"Start", ru:"Старт", uz:"Boshlash"})}
                </Button>
                <Button onClick={resetTimer} variant="outline" className="text-2xl px-10 py-4">{t(lang, {en:"Reset", ru:"Сброс", uz:"Qayta"})}</Button>
            </motion.div>
        </motion.div>
    );
};

export const GrammarSlide: React.FC<SlideProps> = ({ lang }) => {
    const [mode, setMode] = useState<'subject' | 'object'>('subject');

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-[85vw] mx-auto">
            <motion.h2 variants={itemVariants} className="text-6xl font-bold text-primary mb-12">{t(lang, { en: "Subject vs Object Questions", ru: "Вопросы к подлежащему vs дополнению", uz: "Ega va To'ldiruvchi so'roqlari" })}</motion.h2>
            
            <motion.div variants={itemVariants} className="bg-black/30 p-2 rounded-full flex mb-16 relative">
                <motion.div 
                    className="absolute top-2 bottom-2 w-[240px] bg-secondary rounded-full shadow-lg"
                    animate={{ left: mode === 'subject' ? '8px' : '260px' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
                <button 
                    onClick={() => setMode('subject')} 
                    className={`relative z-10 w-[250px] py-4 rounded-full font-bold text-2xl transition-colors ${mode === 'subject' ? 'text-white' : 'text-dim hover:text-white'}`}
                >
                    Subject
                </button>
                <button 
                    onClick={() => setMode('object')} 
                    className={`relative z-10 w-[250px] py-4 rounded-full font-bold text-2xl transition-colors ${mode === 'object' ? 'text-white' : 'text-dim hover:text-white'}`}
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
                    <Card className="text-center min-h-[400px] flex flex-col items-center justify-center p-16">
                        {mode === 'subject' ? (
                            <>
                                <h3 className="text-7xl font-black text-white mb-10">
                                    <span className="text-secondary">WHO</span> called you?
                                </h3>
                                <p className="text-3xl text-dim mb-12 max-w-5xl leading-relaxed">
                                    {t(lang, {
                                        en: "We don't know the person performing the action (Subject). Do NOT use auxiliary verbs.",
                                        ru: "Мы не знаем, кто совершает действие (Подлежащее). НЕ используйте вспомогательные глаголы.",
                                        uz: "Biz harakat bajaruvchisini (Ega) bilmaymiz. Yordamchi fe'llardan foydalanmang."
                                    })}
                                </p>
                                <div className="grid grid-cols-2 gap-8 w-full text-left">
                                    <div className="bg-red-500/10 border-2 border-red-500/30 p-8 rounded-2xl flex items-center gap-6">
                                        <XCircle className="text-red-500 shrink-0 w-12 h-12" />
                                        <span className="text-red-200 text-3xl line-through">Who did call you?</span>
                                    </div>
                                    <div className="bg-green-500/10 border-2 border-green-500/30 p-8 rounded-2xl flex items-center gap-6">
                                        <CheckCircle className="text-green-500 shrink-0 w-12 h-12" />
                                        <span className="text-green-200 text-3xl font-bold">Who called you?</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-7xl font-black text-white mb-10">
                                    <span className="text-primary">WHO</span> did you call?
                                </h3>
                                <p className="text-3xl text-dim mb-12 max-w-5xl leading-relaxed">
                                    {t(lang, {
                                        en: "We know the subject (You). We want the recipient (Object). Use auxiliary verbs.",
                                        ru: "Мы знаем подлежащее (Ты). Нам нужен получатель (Объект). Используйте вспомогательные глаголы.",
                                        uz: "Biz egani bilamiz (Siz). Bizga qabul qiluvchi (To'ldiruvchi) kerak. Yordamchi fe'llardan foydalaning."
                                    })}
                                </p>
                                <div className="grid grid-cols-2 gap-8 w-full text-left">
                                    <div className="bg-red-500/10 border-2 border-red-500/30 p-8 rounded-2xl flex items-center gap-6">
                                        <XCircle className="text-red-500 shrink-0 w-12 h-12" />
                                        <span className="text-red-200 text-3xl line-through">Who you called?</span>
                                    </div>
                                    <div className="bg-green-500/10 border-2 border-green-500/30 p-8 rounded-2xl flex items-center gap-6">
                                        <CheckCircle className="text-green-500 shrink-0 w-12 h-12" />
                                        <span className="text-green-200 text-3xl font-bold">Who <b>DID</b> you call?</span>
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
    // FIX: Using Objects with unique IDs to handle duplicate words correctly
    interface WordObj { id: string; text: string }
    
    const questions = [
        { id: 1, words: ['What', 'makes', 'you', 'laugh', '?'], scrambled: ['laugh', 'makes', 'What', 'you', '?'] },
        { id: 2, words: ['Who', 'do', 'you', 'think', 'will', 'go', 'out', 'tonight', '?'], scrambled: ['out', 'think', 'go', 'do', 'will', 'you', 'Who', 'tonight', '?'] },
        { id: 3, words: ['Do', 'you', 'know', 'why', 'your', 'parents', 'chose', 'your', 'name', '?'], scrambled: ['your', 'why', 'name', 'Do', 'parents', 'chose', 'know', 'your', 'you', '?'] },
    ];

    const [currentQ, setCurrentQ] = useState(0);
    const [userOrder, setUserOrder] = useState<WordObj[]>([]);
    const [pool, setPool] = useState<WordObj[]>([]);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    // Initialize Pool with Unique IDs
    useEffect(() => {
        const initialPool = questions[currentQ].scrambled.map((w, i) => ({ id: `w-${i}-${w}`, text: w }));
        setPool(initialPool);
        setUserOrder([]);
        setIsCorrect(null);
    }, [currentQ]);

    const addToSentence = (wordObj: WordObj) => {
        if (isCorrect) return;
        setPool(prev => prev.filter(w => w.id !== wordObj.id));
        setUserOrder(prev => [...prev, wordObj]);
    };

    const returnToPool = (wordObj: WordObj) => {
        if (isCorrect) return;
        setUserOrder(prev => prev.filter(w => w.id !== wordObj.id));
        setPool(prev => [...prev, wordObj]);
    };

    const checkAnswer = () => {
        const userString = userOrder.map(w => w.text).join(' ');
        const correctString = questions[currentQ].words.join(' ');
        setIsCorrect(userString === correctString);
    };

    const showAnswer = () => {
        const correctOrder = questions[currentQ].words.map((w, i) => ({ id: `ans-${i}-${w}`, text: w }));
        setUserOrder(correctOrder);
        setPool([]);
        setIsCorrect(true);
    }

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-[90vw] mx-auto px-4">
            <motion.h2 variants={itemVariants} className="text-5xl font-bold text-white mb-4">{t(lang, {en:"Build the Question", ru:"Составь вопрос", uz:"Savol tuzing"})}</motion.h2>
            <motion.p variants={itemVariants} className="text-dim mb-12 text-2xl">{t(lang, {en:"Tap words to arrange them.", ru:"Нажимай на слова, чтобы расставить их.", uz:"So'zlarni tartiblash uchun bosing."})}</motion.p>
            
            {/* Answer Area */}
            <div className="w-full min-h-[150px] bg-white/5 border-4 border-dashed border-white/20 rounded-3xl p-8 flex flex-wrap gap-4 items-center justify-center mb-12 relative">
                 <AnimatePresence>
                    {userOrder.map((wordObj) => (
                        <motion.button
                            key={wordObj.id}
                            layoutId={wordObj.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={() => returnToPool(wordObj)}
                            className="bg-primary text-black font-bold text-2xl px-6 py-3 rounded-xl shadow-lg hover:bg-yellow-400"
                        >
                            {wordObj.text}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Word Pool */}
            <div className="flex flex-wrap gap-4 justify-center mb-16 max-w-5xl min-h-[100px]">
                 <AnimatePresence>
                    {pool.map((wordObj) => (
                        <motion.button
                            key={wordObj.id}
                            layoutId={wordObj.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={() => addToSentence(wordObj)}
                            className="bg-card border-2 border-white/20 text-white font-medium text-2xl px-6 py-3 rounded-xl hover:bg-white/10"
                        >
                            {wordObj.text}
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex gap-6 items-center h-20">
                {isCorrect !== true && (
                    <>
                        <Button onClick={checkAnswer} disabled={userOrder.length === 0} className="text-xl px-8 py-4">{t(lang, {en:"Check", ru:"Проверить", uz:"Tekshirish"})}</Button>
                        <Button onClick={showAnswer} variant="secondary" className="text-xl px-8 py-4">{t(lang, {en:"Show Answer", ru:"Показать ответ", uz:"Javobni ko'rsatish"})}</Button>
                    </>
                )}
                
                {isCorrect === true && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-6">
                        <div className="flex items-center gap-3 text-green-400 font-bold text-3xl"><CheckCircle size={32} /> Correct!</div>
                        {currentQ < questions.length - 1 ? (
                            <Button onClick={() => setCurrentQ(prev => prev + 1)} variant="secondary" className="text-xl px-8 py-4">Next Question</Button>
                        ) : (
                            <div className="text-dim text-2xl">All Done!</div>
                        )}
                    </motion.div>
                )}
                {isCorrect === false && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                         <div className="text-red-400 font-bold text-2xl">Try Again</div>
                         <button onClick={() => { setUserOrder([]); setIsCorrect(null); const initialPool = questions[currentQ].scrambled.map((w, i) => ({ id: `w-${i}-${w}`, text: w })); setPool(initialPool); }} className="p-3 bg-white/10 rounded-full hover:bg-white/20"><RefreshCw size={24}/></button>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export const CommTypesSlide: React.FC<SlideProps> = ({ lang }) => {
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
    const revealAll = () => {
        const correct: Record<number, string> = {};
        items.forEach(i => correct[i.id] = i.cat);
        setAssignments(correct);
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full w-full max-w-[95vw] mx-auto px-4 pt-4">
            <h2 className="text-5xl font-bold text-white text-center mb-12">{t(lang, {en:"Communication Channels", ru:"Каналы связи", uz:"Aloqa kanallari"})}</h2>
            
            <div className="grid grid-cols-3 gap-8 h-[50vh]">
                {['Paper', 'Electronic', 'Both'].map(cat => {
                    const catKey = cat.toLowerCase();
                    const icon = catKey === 'paper' ? <Mail size={40} /> : catKey === 'electronic' ? <Smartphone size={40} /> : <Layers size={40} />;
                    const color = catKey === 'paper' ? 'border-orange-500/50 bg-orange-500/10' : catKey === 'electronic' ? 'border-blue-500/50 bg-blue-500/10' : 'border-purple-500/50 bg-purple-500/10';
                    return (
                        <div key={cat} className={`rounded-3xl border-4 ${color} p-6 flex flex-col items-center`}>
                            <div className="flex items-center gap-3 font-bold text-white mb-6 uppercase tracking-widest text-2xl">{icon} {cat}</div>
                            <div className="w-full flex-1 flex flex-col gap-3">
                                {items.filter(i => assignments[i.id] === catKey).map(i => (
                                    <motion.div layoutId={`item-${i.id}`} key={i.id} className="bg-card px-6 py-4 rounded-xl text-center shadow-lg text-xl font-bold border border-white/10">
                                        {i.text}
                                        {i.cat !== catKey && <span className="ml-2 text-red-500">⚠</span>}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center mt-12 p-8 bg-white/5 rounded-3xl min-h-[140px]">
                {items.filter(i => !assignments[i.id]).map(i => (
                    <motion.div layoutId={`item-${i.id}`} key={i.id} className="bg-card border-2 border-white/20 px-8 py-4 rounded-xl cursor-pointer hover:scale-105 transition-transform flex flex-col items-center gap-2 group relative text-xl font-bold shadow-xl">
                        {i.text}
                        <div className="absolute -top-16 hidden group-hover:flex gap-2 bg-black/90 p-2 rounded-xl backdrop-blur z-20 shadow-2xl">
                            <button onClick={() => assign(i.id, 'paper')} className="p-2 hover:text-orange-400 bg-white/10 rounded-lg"><Mail size={24}/></button>
                            <button onClick={() => assign(i.id, 'electronic')} className="p-2 hover:text-blue-400 bg-white/10 rounded-lg"><Smartphone size={24}/></button>
                            <button onClick={() => assign(i.id, 'both')} className="p-2 hover:text-purple-400 bg-white/10 rounded-lg"><Layers size={24}/></button>
                        </div>
                    </motion.div>
                ))}
                
                {items.some(i => !assignments[i.id]) && (
                    <div className="w-full flex justify-center mt-4">
                        <Button onClick={revealAll} variant="secondary" className="text-lg">Show Answers</Button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export const QuizSlide: React.FC<SlideProps> = ({ lang }) => {
    const [selected, setSelected] = useState<'simple' | 'continuous' | null>(null);

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col h-full w-full pt-10 px-4">
            <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-5xl font-bold text-white mb-4">{t(lang, {en:"Result vs Activity", ru:"Результат или Действие", uz:"Natija yoki Harakat"})}</h2>
                <p className="text-dim text-2xl">{t(lang, {en:"Which sentence matches the image?", ru:"Какое предложение подходит?", uz:"Qaysi gap rasmga mos?"})}</p>
            </motion.div>

            <div className="flex-1 flex gap-12 items-center justify-center max-w-[90vw] mx-auto w-full pb-20">
                {/* Option 1 */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected('simple')}
                    className={`flex-1 h-[500px] rounded-[3rem] cursor-pointer border-8 transition-all duration-300 flex flex-col items-center justify-center gap-8 p-12 relative overflow-hidden shadow-2xl ${selected === 'simple' ? 'border-red-500 bg-red-500/10' : 'border-gray-700 bg-card hover:border-gray-500'}`}
                >
                    <div className="text-[10rem]">🥵</div>
                    <p className="text-4xl font-bold text-center">"I have run."</p>
                    {selected === 'simple' && (
                        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-red-900/90 flex items-center justify-center backdrop-blur-md">
                            <div className="text-center p-8">
                                <XCircle className="text-red-500 w-32 h-32 mx-auto mb-6" />
                                <p className="text-white font-bold text-4xl">Incorrect</p>
                                <p className="text-red-200 mt-4 text-xl">"Have run" focuses on the finished result, not the side effects.</p>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Option 2 */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelected('continuous')}
                    className={`flex-1 h-[500px] rounded-[3rem] cursor-pointer border-8 transition-all duration-300 flex flex-col items-center justify-center gap-8 p-12 relative overflow-hidden shadow-2xl ${selected === 'continuous' ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-card hover:border-gray-500'}`}
                >
                    <div className="text-[10rem]">🥵 + ⏱️</div>
                    <p className="text-4xl font-bold text-center">"I have been running."</p>
                    {selected === 'continuous' && (
                        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-green-900/90 flex items-center justify-center backdrop-blur-md">
                            <div className="text-center p-8">
                                <CheckCircle className="text-green-500 w-32 h-32 mx-auto mb-6" />
                                <p className="text-white font-bold text-4xl">Correct!</p>
                                <p className="text-green-200 mt-4 text-xl">Continuous form explains WHY you are hot/tired now.</p>
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
        return answers[id].some(a => val === a || val === a.replace("has ", "'s "));
    };

    const fillAnswers = () => {
        const newInputs = {...inputs};
        Object.keys(answers).forEach(key => {
            const k = parseInt(key);
            if (part === 1 && k <= 3) newInputs[k] = answers[k][0];
            if (part === 2 && k >= 4) newInputs[k] = answers[k][0];
        });
        setInputs(newInputs);
        setChecked(true);
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-[90vw] mx-auto px-4 overflow-y-auto custom-scroll py-10">
            <h2 className="text-5xl font-bold text-white mb-10 sticky top-0 bg-background/95 backdrop-blur z-10 py-4 w-full text-center shadow-lg rounded-b-3xl">
                Letters of Note ({part}/2)
            </h2>
            
            <div className="bg-white text-gray-900 p-12 rounded-[2rem] shadow-2xl font-serif text-3xl leading-loose max-w-5xl w-full relative">
                <div className="absolute top-8 right-8 p-4 opacity-5 pointer-events-none"><Type size={180} /></div>
                
                {part === 1 ? (
                    <>
                        <p className="mb-8">
                            Shaun Usher is a blogger who, since 2009, 
                            <span className="inline-block mx-4 border-b-4 border-gray-400 min-w-[300px] relative top-2">
                                <input 
                                    type="text" 
                                    className={`w-full bg-transparent outline-none font-sans font-bold text-2xl text-center pb-2 ${checked ? (isCorrect(1) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} 
                                    placeholder="(collect)" 
                                    value={inputs[1] || ''}
                                    onChange={(e) => setInputs({...inputs, 1: e.target.value})} 
                                />
                            </span>
                            letters written by famous people. 
                        </p>
                        <p className="mb-8">
                            He 
                            <span className="inline-block mx-4 border-b-4 border-gray-400 min-w-[300px] relative top-2">
                                <input 
                                    type="text" 
                                    className={`w-full bg-transparent outline-none font-sans font-bold text-2xl text-center pb-2 ${checked ? (isCorrect(2) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} 
                                    placeholder="(post)" 
                                    value={inputs[2] || ''}
                                    onChange={(e) => setInputs({...inputs, 2: e.target.value})} 
                                />
                            </span>
                            them on his website, which 
                            <span className="inline-block mx-4 border-b-4 border-gray-400 min-w-[300px] relative top-2">
                                <input 
                                    type="text" 
                                    className={`w-full bg-transparent outline-none font-sans font-bold text-2xl text-center pb-2 ${checked ? (isCorrect(3) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} 
                                    placeholder="(become)" 
                                    value={inputs[3] || ''}
                                    onChange={(e) => setInputs({...inputs, 3: e.target.value})} 
                                />
                            </span>
                            extremely popular.
                        </p>
                    </>
                ) : (
                    <>
                         <p className="mb-8">
                            He 
                            <span className="inline-block mx-4 border-b-4 border-gray-400 min-w-[300px] relative top-2">
                                <input 
                                    type="text" 
                                    className={`w-full bg-transparent outline-none font-sans font-bold text-2xl text-center pb-2 ${checked ? (isCorrect(4) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} 
                                    placeholder="(get)" 
                                    value={inputs[4] || ''}
                                    onChange={(e) => setInputs({...inputs, 4: e.target.value})} 
                                />
                            </span>
                            together 900 letters. He 
                            <span className="inline-block mx-4 border-b-4 border-gray-400 min-w-[350px] relative top-2">
                                <input 
                                    type="text" 
                                    className={`w-full bg-transparent outline-none font-sans font-bold text-2xl text-center pb-2 ${checked ? (isCorrect(5) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} 
                                    placeholder="(just / release)" 
                                    value={inputs[5] || ''}
                                    onChange={(e) => setInputs({...inputs, 5: e.target.value})} 
                                />
                            </span>
                            the letters in a book.
                        </p>
                        <p>
                            Usher 
                            <span className="inline-block mx-4 border-b-4 border-gray-400 min-w-[350px] relative top-2">
                                <input 
                                    type="text" 
                                    className={`w-full bg-transparent outline-none font-sans font-bold text-2xl text-center pb-2 ${checked ? (isCorrect(6) ? 'text-green-600' : 'text-red-600') : 'text-blue-600'}`} 
                                    placeholder="(recently / start)" 
                                    value={inputs[6] || ''}
                                    onChange={(e) => setInputs({...inputs, 6: e.target.value})} 
                                />
                            </span>
                            a new project...
                        </p>
                    </>
                )}
            </div>
            
            <div className="mt-12 flex gap-6">
                <Button onClick={() => setChecked(true)} className="text-xl px-10 py-4">{t(lang, {en:"Check", ru:"Проверить", uz:"Tekshirish"})}</Button>
                <Button onClick={fillAnswers} variant="outline" className="text-xl px-10 py-4">{t(lang, {en:"Show Answers", ru:"Показать ответы", uz:"Javoblarni ko'rsatish"})}</Button>
                {onNext && <Button variant="secondary" onClick={onNext} className="text-xl px-10 py-4">Next Part</Button>}
            </div>
        </motion.div>
    );
};

export const LetterGrammarSlide1: React.FC<SlideProps> = (props) => <LetterGrammarBase part={1} {...props} />;
export const LetterGrammarSlide2: React.FC<SlideProps> = (props) => <LetterGrammarBase part={2} {...props} />;

export const PrepositionsSlide: React.FC<SlideProps> = ({ lang }) => {
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

    const revealAll = () => {
        setSolved(pairs.map(p => p.verb));
    }

    const prepsDisplay = [...new Set(pairs.map(p => p.prep))].sort();

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-[90vw] mx-auto px-4">
            <h2 className="text-5xl font-bold text-white mb-16">{t(lang, {en:"Verbs + Prepositions", ru:"Глаголы + Предлоги", uz:"Fe'llar + Predloglar"})}</h2>
            <div className="flex w-full gap-32 justify-center items-start">
                <div className="flex flex-col gap-6">
                    {pairs.map((pair) => (
                        <motion.button
                            key={pair.verb}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleVerbClick(pair.verb)}
                            className={`px-10 py-4 rounded-2xl font-bold text-2xl transition-all border-4 w-[300px] ${solved.includes(pair.verb) ? 'bg-green-500 border-green-500 text-white opacity-50 cursor-default' : selectedVerb === pair.verb ? 'bg-primary border-primary text-black' : 'bg-card border-white/10 text-white hover:border-primary'}`}
                        >
                            {pair.verb}
                        </motion.button>
                    ))}
                </div>
                <div className="flex flex-col justify-center items-center text-dim pt-20">
                    {error ? <XCircle className="text-red-500 animate-bounce w-16 h-16" /> : <Link size={64} />}
                </div>
                <div className="flex flex-col gap-6 justify-center">
                    {prepsDisplay.map((prep) => (
                        <motion.button
                            key={prep}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePrepClick(prep)}
                            className="px-10 py-4 rounded-2xl font-bold text-2xl bg-card border-4 border-white/10 text-white hover:border-secondary hover:bg-secondary/10 transition-all w-[200px]"
                        >
                            {prep.toUpperCase()}
                        </motion.button>
                    ))}
                </div>
            </div>
            
            {solved.length !== pairs.length && (
                 <div className="mt-12">
                    <Button onClick={revealAll} variant="secondary">Reveal All</Button>
                </div>
            )}
        </motion.div>
    );
};

export const EmailSlide: React.FC<SlideProps> = ({ lang }) => {
    const [sent, setSent] = useState(false);
    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center h-full w-full max-w-5xl mx-auto px-4">
            <motion.h2 variants={itemVariants} className="text-5xl font-bold text-white mb-8">{t(lang, {en:"Mission Complete", ru:"Миссия выполнена", uz:"Vazifa bajarildi"})}</motion.h2>
            <motion.p variants={itemVariants} className="text-dim mb-12 text-center text-2xl">{t(lang, {en:"Write your exit email to the teacher.", ru:"Напиши прощальное письмо учителю.", uz:"O'qituvchiga yakuniy xat yozing."})}</motion.p>
            {!sent ? (
                <motion.div variants={itemVariants} className="w-full bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="bg-gray-100 p-6 border-b border-gray-200 flex items-center justify-between"><span className="font-bold text-gray-700 text-xl">New Message</span></div>
                    <div className="p-10">
                        <div className="border-b border-gray-200 pb-4 mb-6 text-gray-500 text-xl">To: <span className="text-gray-900 font-bold">Teacher</span></div>
                        <textarea className="w-full h-64 resize-none outline-none font-serif text-3xl text-gray-800 placeholder-gray-300 leading-relaxed" placeholder="I've been thinking about..."></textarea>
                        <div className="flex justify-end mt-8">
                            <button onClick={() => setSent(true)} className="bg-blue-600 text-white px-10 py-4 rounded-xl hover:bg-blue-700 transition flex items-center gap-4 text-xl font-bold"><Send size={24} /> Send</button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-green-500/20 border border-green-500 p-16 rounded-[3rem] text-center backdrop-blur">
                    <CheckCircle className="text-green-500 w-32 h-32 mx-auto mb-8" />
                    <h3 className="text-6xl font-bold text-white">Sent!</h3>
                </motion.div>
            )}
        </motion.div>
    );
};
