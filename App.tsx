
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlideType, Language, SlideProps } from './types';
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
import { VocabSectionIntro, VocabTeachingSlide, VocabQuizSlide } from './components/VocabSlides';
import { unit1Vocab } from './data/vocab';

const App: React.FC = () => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [lang, setLang] = useState<Language>('en');

    // Generate Dynamic Vocab Slides (Teaching + Quiz for each word)
    const vocabSequence = unit1Vocab.flatMap(word => [
        { type: SlideType.VOCAB_TEACHING, component: VocabTeachingSlide, data: word },
        { type: SlideType.VOCAB_QUIZ, component: VocabQuizSlide, data: word }
    ]);

    // LOGICAL ORDER:
    // 1. Intro & Warm-up (Silence)
    // 2. Speaking Skills (Conversation Rules & Idioms)
    // 3. Grammar 1 (Question Forms)
    // 4. Written Communication (Types & Stationery)
    // 5. Grammar 2 (Present Perfect - in context of letters)
    // 6. Vocabulary Skills (Collocations)
    // 7. Full Unit Vocab Review
    // 8. Production (Writing)

    const slides: { type: SlideType; component: React.FC<SlideProps>; data?: any }[] = [
        // --- SECTION 1.1: CONVERSATION ---
        { type: SlideType.INTRO, component: IntroSlide },
        { type: SlideType.SILENCE_EXPERIMENT, component: SilenceSlide },
        { type: SlideType.CONVERSATION_SORT, component: ConversationSortSlide },
        
        // Idiom Deep Dive
        { type: SlideType.MFP_IDIOM_INTRO, component: MFPIdiomIntro },
        { type: SlideType.MFP_IDIOM_MEANING, component: MFPIdiomMeaning },
        { type: SlideType.MFP_IDIOM_EXAMPLES, component: MFPIdiomExamples },
        { type: SlideType.IDIOMS, component: IdiomsSlide },

        // Grammar: Question Forms
        { type: SlideType.MFP_SUBJECT_Q_INTRO, component: MFPSubjectQIntro },
        { type: SlideType.MFP_SUBJECT_Q_MEANING, component: MFPSubjectQMeaning },
        { type: SlideType.MFP_SUBJECT_Q_EXAMPLES, component: MFPSubjectQExamples },
        { type: SlideType.GRAMMAR_SUBJECT_OBJECT, component: GrammarSlide },
        { type: SlideType.QUESTION_UNSCRAMBLE, component: QuestionUnscrambleSlide },

        // --- SECTION 1.2: WRITTEN COMMUNICATION ---
        { type: SlideType.COMM_TYPES, component: CommTypesSlide },
        
        // Vocab Highlight: Stationery
        { type: SlideType.MFP_VOCAB_STATIONERY_INTRO, component: MFPVocabIntro },
        { type: SlideType.MFP_VOCAB_STATIONERY_MEANING, component: MFPVocabMeaning },
        { type: SlideType.MFP_VOCAB_STATIONERY_EXAMPLES, component: MFPVocabExamples },

        // Reading Context for Grammar
        { type: SlideType.LETTER_GRAMMAR_1, component: LetterGrammarSlide1 },
        { type: SlideType.LETTER_GRAMMAR_2, component: LetterGrammarSlide2 },

        // Grammar: Present Perfect Simple vs Continuous
        { type: SlideType.MFP_GRAMMAR_PPC_INTRO, component: MFPPPPIntro },
        { type: SlideType.TIMELINE_SIMPLE, component: TimelineSimpleSlide },         
        { type: SlideType.TIMELINE_CONTINUOUS, component: TimelineContinuousSlide }, 
        { type: SlideType.MFP_GRAMMAR_PPC_MEANING, component: MFPPPPMeaning },
        { type: SlideType.MFP_GRAMMAR_PPC_EXAMPLES, component: MFPPPPExamples },
        { type: SlideType.QUIZ_RESULT_ACTIVITY, component: QuizSlide },

        // --- SECTION 1.3: VOCABULARY SKILLS ---
        // Collocation Deep Dive
        { type: SlideType.MFP_COLLOCATION_INTRO, component: MFPColloIntro },
        { type: SlideType.MFP_COLLOCATION_MEANING, component: MFPColloMeaning },
        { type: SlideType.MFP_COLLOCATION_EXAMPLES, component: MFPColloExamples },
        { type: SlideType.PREPOSITIONS, component: PrepositionsSlide },

        // --- FULL VOCABULARY REVIEW ---
        { type: SlideType.VOCAB_SECTION_INTRO, component: VocabSectionIntro },
        ...vocabSequence,

        // --- PRODUCTION ---
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

    const currentSlide = slides[currentSlideIndex];
    const CurrentSlideComponent = currentSlide.component;

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
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full"
                    >
                        <CurrentSlideComponent 
                            isActive={true} 
                            onNext={nextSlide}
                            lang={lang}
                            data={currentSlide.data} 
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
