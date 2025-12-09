import React from 'react';

export type Language = 'en' | 'ru' | 'uz';

export interface SlideProps {
    isActive: boolean;
    onNext?: () => void;
    lang: Language;
}

export enum SlideType {
    INTRO,
    CONVERSATION_SORT, 
    
    // MFP 1: Idiom (Split)
    MFP_IDIOM_INTRO,
    MFP_IDIOM_MEANING,
    MFP_IDIOM_EXAMPLES,
    
    IDIOMS,            
    SILENCE_EXPERIMENT,
    
    // MFP 2: Subject Q (Split)
    MFP_SUBJECT_Q_INTRO,
    MFP_SUBJECT_Q_MEANING,
    MFP_SUBJECT_Q_EXAMPLES,

    GRAMMAR_SUBJECT_OBJECT,
    QUESTION_UNSCRAMBLE,
    SECTION_BREAK,
    COMM_TYPES,
    
    // MFP 3: Vocab (Split)
    MFP_VOCAB_STATIONERY_INTRO,
    MFP_VOCAB_STATIONERY_MEANING,
    MFP_VOCAB_STATIONERY_EXAMPLES,

    // NEW TIMELINES & MFP 4 (PPC)
    MFP_GRAMMAR_PPC_INTRO,
    TIMELINE_SIMPLE,      // NEW
    TIMELINE_CONTINUOUS,  // NEW
    MFP_GRAMMAR_PPC_MEANING,
    MFP_GRAMMAR_PPC_EXAMPLES,

    QUIZ_RESULT_ACTIVITY, 
    
    // Letter Grammar (Split)
    LETTER_GRAMMAR_1,    
    LETTER_GRAMMAR_2,

    // MFP 5: Collocation (Split)
    MFP_COLLOCATION_INTRO,
    MFP_COLLOCATION_MEANING,
    MFP_COLLOCATION_EXAMPLES,

    PREPOSITIONS,
    EMAIL_TASK
}

export interface IdiomCard {
    id: number;
    term: string;
    definition: { en: string; ru: string; uz: string };
    icon: React.ReactNode;
    example: string;
}
