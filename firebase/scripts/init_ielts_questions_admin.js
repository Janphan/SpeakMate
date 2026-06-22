const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

const ieltsBanks = [
    {
        topic: 'Hometown & Accommodation',
        level: 'Band 5-6',
        part1: [
            'Where is your hometown?',
            'What do you like about your hometown?',
            'What do you not like about your hometown?',
            'How important is your hometown to you?',
            'Do you think you will continue to live in your hometown?',
            'Tell me about the kind of accommodation you live in.',
            'Does the place you live in have many amenities?',
            'What would you like to change about where you live?',
            'Do you live in a house or a flat?',
            'How long have you lived there?',
        ],
        part2: [
            {
                cueCard: 'Describe your hometown.',
                prompts: ['Where it is located', 'What it is famous for', 'What you like most about it', 'How it has changed over the years'],
            },
            {
                cueCard: 'Describe a place you like to visit in your hometown.',
                prompts: ['Where it is', 'When you go there', 'What you do there', 'Why you like it'],
            },
        ],
        part3: [
            'How has your hometown changed over the years?',
            'What could be improved in your hometown?',
            'What are the advantages and disadvantages of urban versus rural living?',
            'How do housing trends reflect social changes in your country?',
            'What factors do people consider when choosing where to live?',
        ],
    },
    {
        topic: 'Hometown & Accommodation',
        level: 'Band 6-7',
        part1: [
            'How would you describe the cultural significance of your hometown?',
            'What role does your hometown play in the regional economy?',
            'How have housing prices changed in your area?',
            'What makes your accommodation suitable for your lifestyle?',
            'How does the cost of living affect quality of life where you are?',
        ],
        part2: [
            {
                cueCard: 'Describe a significant change that has happened in your hometown.',
                prompts: ['What the change was', 'When it happened', 'How it affected the community', 'How you felt about it'],
            },
        ],
        part3: [
            'What challenges does your hometown face in terms of urban development?',
            'How has modernization affected the traditional character of your area?',
            'What infrastructure improvements would benefit your area most?',
            'How do you think your hometown will change in the next 20 years?',
            'What are the environmental issues affecting your hometown?',
            'How has immigration or migration affected your community?',
        ],
    },
    {
        topic: 'Hometown & Accommodation',
        level: 'Band 7-8',
        part1: [
            'How do you perceive the relationship between urban development and cultural preservation in your area?',
            'What factors do you think are most important when evaluating quality of urban life?',
        ],
        part2: [
            {
                cueCard: 'Describe a city or town you have visited that left a strong impression on you.',
                prompts: ['Where it was', 'When you visited', 'What made it memorable', 'How it compared to your own hometown'],
            },
        ],
        part3: [
            'Analyze the tension between economic development and preserving cultural heritage in modern cities.',
            'How should societies balance individual housing needs with environmental sustainability?',
            'What are the social implications of increasing urbanization and gentrification?',
            'How might climate change reshape where and how people live in the future?',
            'Evaluate the role of government versus private sector in urban planning and housing.',
        ],
    },
    {
        topic: 'Technology & Mobile Phones',
        level: 'Band 5-6',
        part1: [
            'How often do you use technology?',
            'What technology do you use most often?',
            'Do you think technology makes life easier?',
            'How do you use your mobile phone?',
            'Could you live without your mobile phone?',
            'What apps do you use most on your phone?',
            'Do you use social media? How often?',
        ],
        part2: [
            {
                cueCard: 'Describe a piece of technology you find very useful.',
                prompts: ['What it is', 'How you use it', 'Why you find it useful', 'How it has changed your daily life'],
            },
        ],
        part3: [
            'What are the advantages and disadvantages of smartphones?',
            'Do you think children spend too much time using technology?',
            'How has technology changed the way people communicate?',
            'Is technology changing too fast?',
        ],
    },
    {
        topic: 'Technology & Mobile Phones',
        level: 'Band 6-7',
        part1: [
            'How has the digital divide affected different generations in your country?',
            'How do you balance the benefits and risks of social media?',
            'What role does technology play in your daily learning?',
        ],
        part2: [
            {
                cueCard: 'Describe a way technology has improved your life.',
                prompts: ['What the technology is', 'How you started using it', 'How it has helped you', 'Whether there are any drawbacks'],
            },
        ],
        part3: [
            'How do you think artificial intelligence will impact daily life in the future?',
            'What are the privacy implications of increasing digital connectivity?',
            'What cybersecurity challenges do individuals and organizations face today?',
            'How has e-commerce changed consumer behavior and business models?',
            'What ethical considerations arise from data collection and algorithmic decision-making?',
        ],
    },
    {
        topic: 'Technology & Mobile Phones',
        level: 'Band 7-8',
        part1: [
            'How do you perceive the role of technology in shaping human identity?',
            'What philosophical questions arise from the development of artificial intelligence?',
        ],
        part2: [
            {
                cueCard: 'Describe a technological innovation that you think will significantly change society in the next decade.',
                prompts: ['What the innovation is', 'How it works', 'What changes it might bring', 'Whether there are any risks'],
            },
        ],
        part3: [
            'How might the metaverse reshape social interaction and human experience?',
            'Analyze the tension between technological innovation and data sovereignty in the global economy.',
            'What frameworks can help evaluate the long-term societal impacts of emerging technologies?',
            'How can democratic institutions adapt to govern rapidly evolving technological landscapes?',
            'What are the philosophical implications of human-AI collaboration and potential machine consciousness?',
        ],
    },
    {
        topic: 'Health & Fitness',
        level: 'Band 5-6',
        part1: [
            'How do you keep healthy?',
            'Do you do any sports or exercise?',
            'What do you think is the best way to stay fit?',
            'Do you pay attention to your diet?',
            'How often do you exercise?',
            'Do you prefer exercising alone or with others?',
            'How many hours of sleep do you usually get?',
        ],
        part2: [
            {
                cueCard: 'Describe an activity you do to keep fit or healthy.',
                prompts: ['What the activity is', 'How often you do it', 'Why you started it', 'How it has benefited you'],
            },
        ],
        part3: [
            'Do you think mental health is as important as physical health?',
            'What unhealthy habits do you think people should avoid?',
            'Is it easy to keep fit in your country?',
            'What advice would you give to someone who wants to be healthier?',
        ],
    },
    {
        topic: 'Health & Fitness',
        level: 'Band 6-7',
        part1: [
            'How do socioeconomic factors affect access to healthcare in your country?',
            'How has your understanding of health and well-being evolved?',
            'What role does preventive care play in your approach to health?',
        ],
        part2: [
            {
                cueCard: 'Describe a change you made to improve your health or fitness.',
                prompts: ['What the change was', 'Why you decided to make it', 'How you implemented it', 'What results you have seen'],
            },
        ],
        part3: [
            'How do cultural attitudes toward body image and fitness vary across societies?',
            'What role should governments play in promoting public health?',
            'How has the understanding of mental health evolved in recent decades?',
            'What impact has modern technology had on physical activity levels?',
            'How can communities create environments that promote healthier living?',
        ],
    },
    {
        topic: 'Health & Fitness',
        level: 'Band 7-8',
        part1: [
            'How do you think society should balance individual health choices with collective public health responsibilities?',
            'What is your perspective on the role of genetics versus lifestyle in determining health outcomes?',
        ],
        part2: [
            {
                cueCard: 'Describe a public health issue that you think deserves more attention.',
                prompts: ['What the issue is', 'Who it affects most', 'Why it deserves more attention', 'What could be done to address it'],
            },
        ],
        part3: [
            'What are the bioethical implications of genetic screening and personalized medicine?',
            'How might advances in neuroscience challenge our understanding of personal responsibility for health?',
            'What frameworks should guide resource allocation in healthcare during times of scarcity?',
            'How should societies address the ethical complexities of end-of-life care?',
            'Analyze the relationship between social inequality, mental health, and systemic change.',
        ],
    },
    {
        topic: 'Travel & Holidays',
        level: 'Band 5-6',
        part1: [
            'Do you like to travel?',
            'Where do you usually go on holiday?',
            'Do you prefer traveling alone or with others?',
            'What was your most memorable holiday?',
            'Do you prefer beach holidays or city breaks?',
            'How do you usually prepare for a trip?',
            'Do you like trying local food when you travel?',
        ],
        part2: [
            {
                cueCard: 'Describe a memorable holiday or trip you have taken.',
                prompts: ['Where you went', 'Who you went with', 'What you did there', 'Why it was memorable'],
            },
        ],
        part3: [
            'Do you think holidays are important? Why?',
            'What is your dream holiday destination and why?',
            'How has travel become easier or more difficult compared to the past?',
        ],
    },
    {
        topic: 'Travel & Holidays',
        level: 'Band 6-7',
        part1: [
            'How has your approach to travel changed as you have gotten older?',
            'What factors are most important to you when choosing a travel destination?',
            'Do you prefer planned trips or spontaneous travel?',
        ],
        part2: [
            {
                cueCard: 'Describe a place you would like to visit in the future.',
                prompts: ['Where it is', 'How you know about it', 'What you would like to do there', 'Why you want to go there'],
            },
        ],
        part3: [
            'How has technology changed the way people plan and experience travel?',
            'What are the benefits and drawbacks of overtourism in popular destinations?',
            'What role does sustainable tourism play in protecting cultural and natural heritage?',
            'How has the pandemic affected global travel patterns?',
            'What ethical considerations should travelers keep in mind when visiting other cultures?',
        ],
    },
    {
        topic: 'Travel & Holidays',
        level: 'Band 7-8',
        part1: [
            'How do you think travel shapes a person\'s worldview and cultural understanding?',
            'What is your philosophy on balancing tourism with authentic cultural experiences?',
        ],
        part2: [
            {
                cueCard: 'Describe a journey that had a significant impact on your personal growth.',
                prompts: ['Where you went', 'When it took place', 'What happened during the journey', 'How it changed you'],
            },
        ],
        part3: [
            'How might virtual reality and digital experiences reshape the concept of travel?',
            'What are the neo-colonial implications of certain forms of tourism in developing regions?',
            'Analyze the tension between preserving authentic cultural experiences and meeting tourist expectations.',
            'How might climate change fundamentally alter global tourism patterns?',
            'What role should international organizations play in regulating tourism\'s environmental and social impacts?',
        ],
    },
    {
        topic: 'Environment & Nature',
        level: 'Band 5-6',
        part1: [
            'Do you like spending time in nature?',
            'What is the environment like in your hometown?',
            'What can people do to protect the environment?',
            'Do you recycle at home?',
            'Do you try to save energy at home?',
            'What is your favorite natural place?',
        ],
        part2: [
            {
                cueCard: 'Describe a natural place you enjoy visiting.',
                prompts: ['Where it is', 'How often you go there', 'What you do there', 'Why you enjoy it'],
            },
        ],
        part3: [
            'Are there any environmental problems in your country?',
            'Do you think climate change is a serious problem?',
            'How can we encourage people to care more about nature?',
            'Do you prefer natural or urban environments?',
        ],
    },
    {
        topic: 'Environment & Nature',
        level: 'Band 6-7',
        part1: [
            'How do you balance personal convenience with environmental responsibility?',
            'What environmental issue concerns you the most?',
            'How has your awareness of environmental issues changed over time?',
        ],
        part2: [
            {
                cueCard: 'Describe something you do to help protect the environment.',
                prompts: ['What you do', 'How often you do it', 'Why you started doing it', 'How effective you think it is'],
            },
        ],
        part3: [
            'What role should governments play in addressing climate change?',
            'How do economic interests conflict with environmental protection?',
            'What are the most effective strategies for promoting sustainable development?',
            'How has urbanization affected local ecosystems and biodiversity?',
            'What technological solutions show promise for addressing environmental problems?',
        ],
    },
    {
        topic: 'Environment & Nature',
        level: 'Band 7-8',
        part1: [
            'How do different cultural perspectives on nature influence environmental policy?',
            'What is your view on the role of technology in solving environmental problems?',
        ],
        part2: [
            {
                cueCard: 'Describe an environmental challenge that you believe requires urgent global action.',
                prompts: ['What the challenge is', 'Why it is urgent', 'Who is most affected', 'What solutions you would propose'],
            },
        ],
        part3: [
            'What are the ethical implications of geoengineering as a response to climate change?',
            'How should intergenerational justice influence environmental policy decisions today?',
            'Analyze the paradox of growth-dependent economic systems in a finite ecological world.',
            'What role should indigenous knowledge systems play in addressing global environmental crises?',
            'How do we navigate the tension between immediate human needs and long-term planetary health?',
        ],
    },
    {
        topic: 'Food & Cooking',
        level: 'Band 5-6',
        part1: [
            'What is your favorite type of food?',
            'Do you like cooking? Why or why not?',
            'What do you usually eat for breakfast?',
            'Do you prefer eating at home or in restaurants?',
            'What foods are popular in your country?',
            'Do you enjoy trying new foods?',
        ],
        part2: [
            {
                cueCard: 'Describe a meal or dish that you particularly enjoy.',
                prompts: ['What it is', 'When you usually eat it', 'How it is prepared', 'Why you enjoy it'],
            },
        ],
        part3: [
            'How important are family meals in your culture?',
            'Do you think fast food is unhealthy?',
            'Have your eating habits changed over the years?',
            'What role does food play in social gatherings?',
        ],
    },
    {
        topic: 'Food & Cooking',
        level: 'Band 6-7',
        part1: [
            'How do food traditions reflect cultural identity in your country?',
            'What factors influence your food choices?',
            'How has globalization affected the food you eat?',
        ],
        part2: [
            {
                cueCard: 'Describe a traditional dish from your country.',
                prompts: ['What the dish is', 'What ingredients are used', 'When it is typically eaten', 'Why it is significant'],
            },
        ],
        part3: [
            'How has globalization affected local food systems and culinary traditions?',
            'What are the environmental impacts of different dietary patterns?',
            'How do economic factors influence people\'s dietary choices?',
            'What role does food play in social bonding and community building?',
            'What ethical considerations arise from different approaches to animal agriculture?',
        ],
    },
    {
        topic: 'Food & Cooking',
        level: 'Band 7-8',
        part1: [
            'How do you think food systems will need to evolve to meet future challenges?',
            'What is your perspective on the relationship between food, culture, and identity?',
        ],
        part2: [
            {
                cueCard: 'Describe a food tradition that you think is worth preserving.',
                prompts: ['What the tradition is', 'How it is practiced', 'Why it is important', 'What threats it faces'],
            },
        ],
        part3: [
            'How do food systems intersect with issues of social justice and economic inequality?',
            'How might climate change fundamentally alter global food production and consumption?',
            'Analyze the tension between food sovereignty movements and global trade liberalization.',
            'What are the implications of genetic modification for future food security?',
            'How should governments balance regulating food marketing with individual freedom of choice?',
        ],
    },
    {
        topic: 'Family & Relationships',
        level: 'Band 5-6',
        part1: [
            'Tell me about your family.',
            'How often do you see your family members?',
            'Are you close to your parents?',
            'Do you have any brothers or sisters?',
            'What do you like doing with your family?',
            'Do you prefer spending time with family or friends?',
        ],
        part2: [
            {
                cueCard: 'Describe a person in your family who you admire.',
                prompts: ['Who the person is', 'What they are like', 'Why you admire them', 'How they have influenced you'],
            },
        ],
        part3: [
            'How important is family support in your life?',
            'Do you think family relationships are changing in modern society?',
            'What qualities make a good friend?',
            'How do you maintain friendships over time?',
        ],
    },
    {
        topic: 'Family & Relationships',
        level: 'Band 6-7',
        part1: [
            'How have family dynamics changed in your country over recent generations?',
            'What role does technology play in your family communication?',
            'How do different generations in your family navigate changing values?',
        ],
        part2: [
            {
                cueCard: 'Describe a family celebration or tradition that is important to you.',
                prompts: ['What the celebration is', 'When it takes place', 'What you do', 'Why it is meaningful'],
            },
        ],
        part3: [
            'What challenges do modern families face in maintaining close relationships?',
            'How have concepts of marriage and partnership evolved in recent decades?',
            'What factors contribute to successful long-term relationships?',
            'How do economic pressures impact family life?',
            'What role do friends play compared to family in providing emotional support?',
        ],
    },
    {
        topic: 'Family & Relationships',
        level: 'Band 7-8',
        part1: [
            'How do societal changes in gender roles reshape family dynamics?',
            'What is your perspective on the changing definition of family in modern society?',
        ],
        part2: [
            {
                cueCard: 'Describe a relationship that has significantly shaped who you are.',
                prompts: ['Who the person is', 'How the relationship developed', 'What you learned from it', 'How it shaped your perspective'],
            },
        ],
        part3: [
            'What are the psychological and social implications of declining birth rates in developed societies?',
            'How do we balance individual autonomy with family obligations and cultural expectations?',
            'What ethical considerations arise from assisted reproductive technologies?',
            'How might concepts of kinship evolve with increasing global mobility and digital connectivity?',
            'What are the implications of increasing life expectancy for intergenerational relationships?',
        ],
    },
    {
        topic: 'Education & Learning',
        level: 'Band 5-6',
        part1: [
            'What subjects did you enjoy most at school?',
            'Do you think education is important? Why?',
            'How do you prefer to learn new things?',
            'What was your favorite teacher like?',
            'Do you prefer learning alone or in groups?',
            'What skills would you like to learn in the future?',
        ],
        part2: [
            {
                cueCard: 'Describe a teacher who had a positive influence on you.',
                prompts: ['Who the teacher was', 'What subject they taught', 'How they influenced you', 'Why you remember them'],
            },
        ],
        part3: [
            'Do you think exams are a good way to test knowledge?',
            'How has technology changed education?',
            'Do you think education should be free for everyone?',
            'How do you think schools could be improved?',
            'Is lifelong learning important in today\'s world?',
        ],
    },
    {
        topic: 'Education & Learning',
        level: 'Band 6-7',
        part1: [
            'How do you think educational systems should adapt to modern needs?',
            'What role has technology played in your own learning journey?',
            'How do you stay motivated when learning something difficult?',
        ],
        part2: [
            {
                cueCard: 'Describe a skill you learned that was challenging but rewarding.',
                prompts: ['What the skill was', 'How you learned it', 'What made it challenging', 'How it has been rewarding'],
            },
        ],
        part3: [
            'What are the benefits and drawbacks of standardized testing?',
            'How can education systems address inequality and provide equal opportunities?',
            'What role should critical thinking and creativity play in education?',
            'How has digitalization transformed learning opportunities?',
            'What skills will be most valuable in the future economy?',
        ],
    },
    {
        topic: 'Education & Learning',
        level: 'Band 7-8',
        part1: [
            'How do you think education should balance market demands with humanistic ideals?',
            'What is your perspective on the role of education in promoting democratic citizenship?',
        ],
        part2: [
            {
                cueCard: 'Describe an educational experience that fundamentally changed your way of thinking.',
                prompts: ['What the experience was', 'When and where it happened', 'What you learned', 'How it changed your perspective'],
            },
        ],
        part3: [
            'How should educational institutions balance preparing students for jobs with broader life skills?',
            'What are the implications of artificial intelligence for personalized learning and assessment?',
            'How might neuroscientific insights reshape pedagogical practices?',
            'What are the ethical implications of educational data collection and algorithmic decision-making?',
            'How do we reconcile local cultural knowledge with global educational standards?',
        ],
    },
    {
        topic: 'Media & Entertainment',
        level: 'Band 5-6',
        part1: [
            'What types of movies do you enjoy watching?',
            'What music do you like to listen to?',
            'How often do you use social media?',
            'Do you prefer watching TV or reading books?',
            'What is your favorite way to relax and be entertained?',
            'How do you usually find out about news?',
        ],
        part2: [
            {
                cueCard: 'Describe a movie, show, or book that you enjoyed.',
                prompts: ['What it was', 'What it was about', 'Why you enjoyed it', 'Whether you would recommend it'],
            },
        ],
        part3: [
            'Do you think there is too much violence in movies and TV?',
            'Do you think celebrities have too much influence on society?',
            'How has streaming changed the way people watch entertainment?',
            'How do you choose what to watch or read?',
        ],
    },
    {
        topic: 'Media & Entertainment',
        level: 'Band 6-7',
        part1: [
            'How has social media changed the way you consume news and information?',
            'What role does entertainment play in your life?',
            'How do you think media influences public opinion?',
        ],
        part2: [
            {
                cueCard: 'Describe a form of entertainment that has become popular recently.',
                prompts: ['What it is', 'Who it appeals to', 'Why it has become popular', 'Whether you think it will last'],
            },
        ],
        part3: [
            'How has the rise of streaming platforms affected traditional media industries?',
            'How do algorithmic recommendations influence our entertainment choices?',
            'What ethical responsibilities do media companies have toward their audiences?',
            'How can consumers develop critical media literacy skills?',
            'What are the psychological effects of constant media consumption?',
        ],
    },
    {
        topic: 'Media & Entertainment',
        level: 'Band 7-8',
        part1: [
            'How do you think media representations shape social identities?',
            'What is your perspective on the role of public media in democratic societies?',
        ],
        part2: [
            {
                cueCard: 'Describe a media trend that you find concerning or promising.',
                prompts: ['What the trend is', 'How it has developed', 'Why you find it concerning or promising', 'What its long-term effects might be'],
            },
        ],
        part3: [
            'What are the implications of deepfakes and synthetic media for social trust?',
            'How might immersive technologies alter storytelling and audience engagement?',
            'Analyze the tension between free expression and platform responsibility in digital media.',
            'What are the philosophical implications of algorithm-curated reality for human agency?',
            'How might blockchain and decentralized technologies reshape media ownership?',
        ],
    },
    {
        topic: 'Daily Routine & Free Time',
        level: 'Band 5-6',
        part1: [
            'What is your daily routine like?',
            'What time do you usually wake up and go to bed?',
            'How do you spend your free time?',
            'Do you prefer relaxing at home or going out?',
            'What activities help you relax?',
            'How do you spend your weekends?',
            'Do you have any hobbies?',
        ],
        part2: [
            {
                cueCard: 'Describe a typical weekend for you.',
                prompts: ['What you usually do', 'Who you spend time with', 'What you enjoy most', 'Whether you prefer busy or quiet weekends'],
            },
        ],
        part3: [
            'Do you think people have enough free time nowadays?',
            'Do you think it is important to have a routine?',
            'How has technology changed the way people spend their free time?',
            'What would you like to do if you had more free time?',
        ],
    },
    {
        topic: 'Daily Routine & Free Time',
        level: 'Band 6-7',
        part1: [
            'How do you prioritize different activities in your daily schedule?',
            'How do you adapt your routine when circumstances change?',
            'What role does physical exercise play in your daily life?',
        ],
        part2: [
            {
                cueCard: 'Describe how you would spend a perfect free day.',
                prompts: ['What you would do', 'Where you would go', 'Who you would spend it with', 'Why it would be perfect'],
            },
        ],
        part3: [
            'How do cultural factors influence daily routines in your country?',
            'Do you think work-life balance is achievable in modern society?',
            'What are the benefits and drawbacks of having a structured routine?',
            'How do you manage stress and maintain well-being in your daily life?',
            'What impact does social media have on how people use their free time?',
        ],
    },
    {
        topic: 'Daily Routine & Free Time',
        level: 'Band 7-8',
        part1: [
            'How do societal expectations and individual autonomy intersect in shaping daily routines?',
            'What is your perspective on the increasing blurring of work and personal time?',
        ],
        part2: [
            {
                cueCard: 'Describe a change in your daily routine that significantly improved your quality of life.',
                prompts: ['What the change was', 'Why you made it', 'How it improved your life', 'Whether you would recommend it to others'],
            },
        ],
        part3: [
            'How do you think the concept of leisure will evolve as societies become more automated?',
            'Analyze the relationship between routine, creativity, and personal fulfillment.',
            'How do economic inequalities affect access to meaningful leisure activities?',
            'What are the implications of the "always-on" culture for mental health?',
            'What role should governments play in ensuring adequate time for rest and recreation?',
        ],
    },
    {
        topic: 'Transportation & Cities',
        level: 'Band 5-6',
        part1: [
            'How do you usually get around your city?',
            'Do you prefer public transportation or driving?',
            'What are the traffic problems in your area?',
            'What do you like most about where you live?',
            'Do you prefer city life or country life?',
            'How important is public transportation in your city?',
        ],
        part2: [
            {
                cueCard: 'Describe your favorite place in your city or town.',
                prompts: ['Where it is', 'What you do there', 'How often you go there', 'Why it is your favorite'],
            },
        ],
        part3: [
            'What makes a city a good place to live?',
            'Do you think cities are getting too crowded?',
            'What transportation improvements would you like to see in your area?',
            'How do you think cities will look in the future?',
        ],
    },
    {
        topic: 'Transportation & Cities',
        level: 'Band 6-7',
        part1: [
            'How has the pandemic affected urban mobility where you live?',
            'What role does citizen participation play in urban development?',
            'How do you think cities can accommodate population growth while maintaining quality of life?',
        ],
        part2: [
            {
                cueCard: 'Describe a city or town that you think is well designed.',
                prompts: ['Where it is', 'What makes it well designed', 'What features stand out', 'How it compares to other places you know'],
            },
        ],
        part3: [
            'How can urban planning balance economic development with sustainability?',
            'What are the benefits and challenges of transitioning to electric vehicles?',
            'How do transportation systems affect social equity and access to opportunities?',
            'What are the implications of smart city technologies for privacy?',
            'How can cities become more resilient to climate change?',
        ],
    },
    {
        topic: 'Transportation & Cities',
        level: 'Band 7-8',
        part1: [
            'How do you think urban design influences community and social interaction?',
            'What is your vision for the future of urban transportation?',
        ],
        part2: [
            {
                cueCard: 'Describe a city that you believe represents the future of urban living.',
                prompts: ['Which city it is', 'What features make it futuristic', 'What challenges it still faces', 'What lessons other cities could learn'],
            },
        ],
        part3: [
            'What are the implications of autonomous vehicles for urban space and social interaction?',
            'How might concepts of citizenship evolve in increasingly mobile populations?',
            'Analyze the tension between efficient urban systems and human-scale community development.',
            'What ethical frameworks should guide the use of surveillance in smart cities?',
            'How might remote work fundamentally alter the function and form of cities?',
        ],
    },
];

async function initIeltsBanks(serviceAccountPath) {
    if (!serviceAccountPath) {
        console.error('Usage: node init_ielts_questions_admin.js /path/to/serviceAccountKey.json');
        process.exit(1);
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    initializeApp({ credential: cert(serviceAccount) });
    const db = getFirestore();

    const questionsRef = db.collection('questions');
    let count = 0;

    for (const bank of ieltsBanks) {
        const docId = `${bank.topic}_${bank.level}`.replace(/\s+/g, '_');
        await questionsRef.doc(docId).set({
            topic: bank.topic,
            level: bank.level,
            part1: bank.part1,
            part2: bank.part2,
            part3: bank.part3,
            createdAt: new Date(),
        });
        console.log(`✅ ${bank.topic} - ${bank.level}`);
        count++;
    }

    console.log(`\n🎉 Done! ${count} IELTS question banks initialized.`);
}

initIeltsBanks(process.argv[2]).catch(console.error);
