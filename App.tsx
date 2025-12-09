import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideType, Language } from './types';
import { ProgressBar, Navigation, LanguageSwitcher } from './components/UI';
import { 
    IntroSlide, 
    SilenceSlide, 
    IdiomsSlide, 
    GrammarSlide, 
    QuizSlide, 
    EmailSlide,
    ConversationSortSlide,
    QuestionUnscrambleSlide,
    CommTypesSlide,
    LetterGrammarSlide1,
    LetterGrammarSlide2,
    PrepositionsSlide,
    MFPIdiomIntro, MFPIdiomMeaning, MFPIdiomExamples,
    MFPSubjectQIntro, MFPSubjectQMeaning, MFPSubjectQExamples,
    MFPVocabIntro, MFPVocabMeaning, MFPVocabExamples,
    MFPPPPIntro, MFPPPPMeaning, MFPPPPExamples,
    MFPColloIntro, MFPColloMeaning, MFPColloExamples,
} from './components/LessonSlides';
import { TimelineSimpleSlide, TimelineContinuousSlide } from './components/TimelineSlides';

const App: React.FC = () => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [lang, setLang] = useState<Language>('en');

    // Defines the order of slides
    const slides = [
        { type: SlideType.INTRO, component: IntroSlide },
        { type: SlideType.CONVERSATION_SORT, component: ConversationSortSlide },
        
        // MFP 1: Idioms (Split)
        { type: SlideType.MFP_IDIOM_INTRO, component: MFPIdiomIntro },
        { type: SlideType.MFP_IDIOM_MEANING, component: MFPIdiomMeaning },
        { type: SlideType.MFP_IDIOM_EXAMPLES, component: MFPIdiomExamples },

        { type: SlideType.IDIOMS, component: IdiomsSlide },
        { type: SlideType.SILENCE_EXPERIMENT, component: SilenceSlide },
        
        // MFP 2: Subject Questions (Split)
        { type: SlideType.MFP_SUBJECT_Q_INTRO, component: MFPSubjectQIntro },
        { type: SlideType.MFP_SUBJECT_Q_MEANING, component: MFPSubjectQMeaning },
        { type: SlideType.MFP_SUBJECT_Q_EXAMPLES, component: MFPSubjectQExamples },

        { type: SlideType.GRAMMAR_SUBJECT_OBJECT, component: GrammarSlide },
        { type: SlideType.QUESTION_UNSCRAMBLE, component: QuestionUnscrambleSlide },
        { type: SlideType.COMM_TYPES, component: CommTypesSlide },
        
        // MFP 3: Vocab (Split)
        { type: SlideType.MFP_VOCAB_STATIONERY_INTRO, component: MFPVocabIntro },
        { type: SlideType.MFP_VOCAB_STATIONERY_MEANING, component: MFPVocabMeaning },
        { type: SlideType.MFP_VOCAB_STATIONERY_EXAMPLES, component: MFPVocabExamples },

        // MFP 4: PPC + Timelines (NEW)
        { type: SlideType.MFP_GRAMMAR_PPC_INTRO, component: MFPPPPIntro },
        { type: SlideType.TIMELINE_SIMPLE, component: TimelineSimpleSlide },         // NEW Animated Slide
        { type: SlideType.TIMELINE_CONTINUOUS, component: TimelineContinuousSlide }, // NEW Animated Slide
        { type: SlideType.MFP_GRAMMAR_PPC_MEANING, component: MFPPPPMeaning },
        { type: SlideType.MFP_GRAMMAR_PPC_EXAMPLES, component: MFPPPPExamples },

        { type: SlideType.QUIZ_RESULT_ACTIVITY, component: QuizSlide },
        
        // Reading Split
        { type: SlideType.LETTER_GRAMMAR_1, component: LetterGrammarSlide1 },
        { type: SlideType.LETTER_GRAMMAR_2, component: LetterGrammarSlide2 },

        // MFP 5: Collocation (Split)
        { type: SlideType.MFP_COLLOCATION_INTRO, component: MFPColloIntro },
        { type: SlideType.MFP_COLLOCATION_MEANING, component: MFPColloMeaning },
        { type: SlideType.MFP_COLLOCATION_EXAMPLES, component: MFPColloExamples },

        { type: SlideType.PREPOSITIONS, component: PrepositionsSlide },
        { type: SlideType.EMAIL_TASK, component: EmailSlide },
    ];

    const nextSlide = () => {
        if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                nextSlide();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentSlideIndex]);

    const CurrentSlideComponent = slides[currentSlideIndex].component;

    return (
        <div className="relative w-full h-screen bg-background overflow-hidden flex flex-col font-sans text-text selection:bg-primary selection:text-black">
            {/* Background Ambient Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[120px]" />
            </div>

            <ProgressBar current={currentSlideIndex} total={slides.length} />
            
            <LanguageSwitcher current={lang} onChange={setLang} />

            <main className="flex-1 relative z-10 w-full max-w-[1600px] mx-auto p-6 md:p-12 flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlideIndex}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full"
                    >
                        <CurrentSlideComponent 
                            isActive={true} 
                            onNext={nextSlide}
                            lang={lang}
                        />
                    </motion.div>
                </AnimatePresence>
            </main>

            <Navigation 
                onNext={nextSlide} 
                onPrev={prevSlide}
                canNext={currentSlideIndex < slides.length - 1}
                canPrev={currentSlideIndex > 0}
            />

            <div className="fixed bottom-4 right-6 text-dim text-xs opacity-50 font-mono hidden md:block">
                NAVIGATE B2 • {currentSlideIndex + 1} / {slides.length}
            </div>
        </div>
    );
};

export default App;
