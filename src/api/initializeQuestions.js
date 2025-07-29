import { db } from './firebaseConfig';
import { collection, setDoc, doc } from 'firebase/firestore';

// Function to initialize question banks with topic-based document IDs
export const initializeQuestionBanks = async () => {
    const questionBanks = [
        {
            topic: 'Work or Study',
            level: 'Band 5-6',
            questions: [
                'Do you work or are you a student?',
                'Why did you choose this kind of work/study?',
                'Do you enjoy your work/study?',
                'What is the most interesting part of your work/study?',
                'What would you like to do in the future?',
                'Do you prefer working alone or with others?',
                'How do you balance work and leisure?',
                'Is your work/study difficult?',
                'What skills have you learned from your work/study?',
                'Would you change your job or field of study in the future?',
            ],
            createdAt: new Date(),
        },
        {
            topic: 'Daily Routine & Free Time',
            level: 'Band 5-6',
            questions: [
                'What is your daily routine like?',
                'How do you spend your free time?',
                'Do you prefer relaxing at home or going out in your free time?',
                'What do you usually do after work or school?',
                'How much free time do you have each day?',
                'Do you think it’s important to have a routine?',
                'How has your routine changed recently?',
                'What would you like to do if you had more free time?',
                'Do you plan your free time or just relax?',
                'What activities help you relax?',
            ],
            createdAt: new Date(),
        },
        {
            topic: 'Technology & Mobile Phones',
            level: 'Band 5-6',
            questions: [
                'How often do you use technology?',
                'What technology do you use most often?',
                'Do you think technology makes life easier?',
                'How do you use your mobile phone?',
                'Could you live without your mobile phone?',
                'What are the advantages of smartphones?',
                'Are there any disadvantages to using technology?',
                'How has technology changed the way we communicate?',
                'Do you use technology for studying or working?',
                'What new technology would you like to have?',
            ],
            createdAt: new Date(),
        },
        {
            topic: 'Health & Fitness',
            level: 'Band 5-6',
            questions: [
                'How do you keep healthy?',
                'Do you do any sports or exercise?',
                'What do you think is the best way to stay fit?',
                'Do you pay attention to your diet?',
                'How often do you exercise?',
                'Is it easy to keep fit in your country?',
                'What are popular sports in your country?',
                'Have your health habits changed recently?',
                'Do you prefer exercising alone or with others?',
                'What advice would you give to someone who wants to be healthier?',
            ],
            createdAt: new Date(),
        },
        {
            topic: 'Travel & Holidays',
            level: 'Band 5-6',
            questions: [
                'Do you like to travel?',
                'Where do you usually go on holiday?',
                'Why do you like going there?',
                'What do you like to do on holiday?',
                'Do you prefer traveling alone or with others?',
                'What is your dream holiday destination?',
                'How do you usually prepare for a trip?',
                'Have you ever had any problems while traveling?',
                'Do you think holidays are important? Why?',
                'What was your most memorable holiday?',
            ],
            createdAt: new Date(),
        },
        {
            topic: 'Environment & Nature',
            level: 'Band 5-6',
            questions: [
                'Do you like spending time in nature?',
                'What is the environment like in your hometown?',
                'Are there any environmental problems in your country?',
                'What can people do to protect the environment?',
                'Do you recycle at home?',
                'How can we encourage people to care for nature?',
                'Have you ever participated in an environmental project?',
                'What is your favorite natural place?',
                'Do you think environmental education is important?',
                'How has the environment changed in recent years?',
            ],
            createdAt: new Date(),
        },
    ];

    try {
        const questionsRef = collection(db, 'questions');
        for (const bank of questionBanks) {
            await setDoc(doc(questionsRef, bank.topic), bank);
            console.log(`Added/updated question bank for ${bank.topic}`);
        }
        console.log('Question banks initialized successfully');
    } catch (error) {
        console.error('Error initializing question banks:', error.message);
    }
};