import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with fallback for development
const getApiKey = () => {
    // In development, use the environment variable
    if (import.meta.env.DEV) {
        return import.meta.env.VITE_GEMINI_API_KEY;
    }
    // In production, use the window.__GEMINI_API_KEY__ that we'll inject
    return window.__GEMINI_API_KEY__;
};

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(getApiKey(), {
    apiVersion: 'v1beta'
});

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCFpQskmYqzF6YMWtzyw8yaLEPNFTwQcz0",
  authDomain: "networkprep-4e66a.firebaseapp.com",
  projectId: "networkprep-4e66a",
  storageBucket: "networkprep-4e66a.firebasestorage.app",
  messagingSenderId: "924055263229",
  appId: "1:924055263229:web:b535c6cfce9783ef12ab94"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();


// Simple icon components (replacing Lucide)
const BrainIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="M12 2a9 9 0 0 0-9 9c0 1.5.4 2.9 1 4.1.6 1.2 1.4 2.2 2.4 3a9 9 0 0 0 11.2 0c1-.8 1.8-1.8 2.4-3 .6-1.2 1-2.6 1-4.1A9 9 0 0 0 12 2z"/>
    <path d="M8 12h.01M16 12h.01M12 16c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z"/>
</svg>
);

const SendIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="m22 2-7 20-4-9-9-4 20-7z"/>
</svg>
);

const StarIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
</svg>
);

const TrophyIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55.47.98.97 1.21C11.56 18.75 12 19.38 12 20v2"/>
    <path d="M14 14.66V17c0 .55-.47.98-.97 1.21C12.44 18.75 12 19.38 12 20v2"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
</svg>
);

const CheckCircleIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22,4 12,14.01 9,11.01"/>
</svg>
);

const LightbulbIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
</svg>
);

const UserIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
</svg>
);

const TargetIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
</svg>
);

const BookOpenIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
</svg>
);

const TrendingUpIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
    <polyline points="16,7 22,7 22,13"/>
</svg>
);

const AwardIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
</svg>
);

const EditIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
</svg>
);

const EyeIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
</svg>
);

const MessageCircleIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
</svg>
);

const SparklesIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/>
    <path d="M19 17v4"/>
    <path d="M3 5h4"/>
    <path d="M17 19h4"/>
</svg>
);

const MenuIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <line x1="4" x2="20" y1="12" y2="12"/>
    <line x1="4" x2="20" y1="6" y2="6"/>
    <line x1="4" x2="20" y1="18" y2="18"/>
</svg>
);

const NetworkIcon = () => (
<svg className="icon" viewBox="0 0 24 24">
    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
    <path d="M2 17L12 22L22 17"/>
    <path d="M2 12L12 17L22 12"/>
</svg>
);

// Sample data
const sampleScenarios = [
{
    id: 1,
    title: "Cold Email to Researcher",
    description: "Reach out to a researcher in your field of interest",
    category: "Research",
    difficulty: "Intermediate",
    prompt: "Write a cold email to Dr. Sarah Johnson, a leading AI researcher at MIT, expressing interest in her work on neural networks and requesting a brief informational interview."
},
{
    id: 2,
    title: "Career Fair Follow-up",
    description: "Follow up after meeting someone at a career fair",
    category: "Career",
    difficulty: "Beginner",
    prompt: "You met Jessica from Google at a career fair yesterday. Write a follow-up email thanking her for the conversation and asking about potential internship opportunities."
},
{
    id: 3,
    title: "Reconnecting with Alumni",
    description: "Reach out to an old college contact",
    category: "Alumni",
    difficulty: "Advanced",
    prompt: "Write to your college classmate Mark, who now works at a startup you're interested in. You haven't spoken in 2 years but want to reconnect professionally."
},
{
    id: 4,
    title: "LinkedIn Introduction",
    description: "Request an introduction through a mutual connection",
    category: "LinkedIn",
    difficulty: "Intermediate",
    prompt: "Ask your mutual connection Sarah to introduce you to David Chen, a product manager at Tesla, for career insights."
},
{
    id: 5,
    title: "Thank You After Interview",
    description: "Professional follow-up after a job interview",
    category: "Interview",
    difficulty: "Beginner",
    prompt: "Write a thank you email to your interviewer, Maria Rodriguez, after your product manager interview at Spotify."
},
{
    id: 6,
    title: "Conference Speaker Outreach",
    description: "Connect with a speaker after attending their talk",
    category: "Conference",
    difficulty: "Advanced",
    prompt: "Reach out to keynote speaker Dr. Amanda Liu after her presentation on sustainable technology at TechCon 2024."
}
];

const sampleTemplates = [
{
    id: 1,
    title: "Cold Outreach Template",
    category: "Cold Email",
    content: `Subject: [Specific Interest/Connection]

Hi [Name],

I hope this email finds you well. I came across your work on [specific project/research] and was impressed by [specific detail].

[Brief personal connection or reason for reaching out]

I'd love to learn more about your experience in [field/role]. Would you be open to a brief 15-minute call in the coming weeks?

Best regards,
[Your name]`,
    rating: 4.8
},
{
    id: 2,
    title: "Thank You Follow-up",
    category: "Follow-up",
    content: `Subject: Thank you for your time - [Event/Meeting]

Hi [Name],

Thank you for taking the time to speak with me about [topic] at [event/meeting]. I really appreciated your insights on [specific point discussed].

[Optional: Reference to action item or next step]

I look forward to staying in touch.

Best,
[Your name]`,
    rating: 4.9
},
{
    id: 3,
    title: "LinkedIn Introduction Request",
    category: "Introduction",
    content: `Subject: Introduction Request - [Target Person's Name]

Hi [Mutual Connection],

I hope you're doing well! I'm reaching out because I noticed you're connected with [Target Person's Name] on LinkedIn.

I'm interested in learning more about [specific area/company] and would love to connect with [him/her/them] for a brief informational chat.

Would you be comfortable making an introduction? I'd be happy to draft something for you to forward.

Thank you for considering this!

Best,
[Your name]`,
    rating: 4.7
},
{
    id: 4,
    title: "Conference Follow-up",
    category: "Conference",
    content: `Subject: Great meeting you at [Conference Name]

Hi [Name],

It was wonderful meeting you at [Conference Name] yesterday. I really enjoyed our conversation about [specific topic discussed].

As mentioned, I'm attaching [resource/document] that might be helpful for your work on [project/initiative].

I'd love to continue our discussion sometime. Are you available for a brief coffee chat in the next few weeks?

Looking forward to hearing from you.

Best regards,
[Your name]`,
    rating: 4.6
}
];

const sampleBadges = [
{ id: 1, name: "First Email", description: "Sent your first networking email", icon: "📧", earned: true },
{ id: 2, name: "Cold Caller", description: "Sent 10 cold emails", icon: "❄️", earned: true },
{ id: 3, name: "Thank You Master", description: "Mastered thank you notes", icon: "🙏", earned: false },
{ id: 4, name: "Networking Ninja", description: "Completed 50 scenarios", icon: "🥷", earned: false },
{ id: 5, name: "Tone Expert", description: "Perfect tone score 10 times", icon: "🎯", earned: false },
{ id: 6, name: "Research Pro", description: "Excelled in research outreach", icon: "🔬", earned: true },
{ id: 7, name: "Conference Champion", description: "Master of conference networking", icon: "🎤", earned: false },
{ id: 8, name: "LinkedIn Legend", description: "LinkedIn networking expert", icon: "💼", earned: false }
];

const vocabularyTips = [
{
    category: "Opening Lines",
    tips: [
        "Instead of 'I hope this email finds you well' try 'I hope you're having a great week'",
        "Replace 'I am writing to...' with 'I'm reaching out because...'",
        "Use 'I came across your work on...' instead of 'I found your contact information'"
    ]
},
{
    category: "Expressing Interest",
    tips: [
        "Say 'I was particularly intrigued by...' instead of 'I liked...'",
        "Use 'Your insights on... resonated with me' rather than 'I agree with you'",
        "Try 'I'd value your perspective on...' instead of 'What do you think about...'"
    ]
},
{
    category: "Making Requests",
    tips: [
        "Use 'Would you be open to...' instead of 'Can you...'",
        "Say 'I'd appreciate any insights you might share' rather than 'Please help me'",
        "Try 'If you have 15 minutes to spare' instead of 'When you have time'"
    ]
}
];

function NetworkingPlatform() {
const [activeTab, setActiveTab] = useState('scenarios');
const [selectedScenario, setSelectedScenario] = useState(null);
const [userMessage, setUserMessage] = useState('');
const [analysis, setAnalysis] = useState(null);
const [isAnalyzing, setIsAnalyzing] = useState(false);
const [selectedTemplate, setSelectedTemplate] = useState(null);
const [userProgress, setUserProgress] = useState({
    clarity: 75,
    tone: 68,
    personalization: 82,
    subjectLines: 60
});
const [currentUser, setCurrentUser] = useState(null);

// Temporary code to list available models
useEffect(() => {
    const listModels = async () => {
        try {
            const models = await genAI.listModels();
            console.log("Available models:", models);
        } catch (error) {
            console.error("Error listing models:", error);
        }
    };
    listModels();
}, []);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
  });
  return () => unsubscribe();
}, []);

// Add this at the start of your component
useEffect(() => {
    console.log("API Key available:", !!import.meta.env.VITE_GEMINI_API_KEY);
    console.log("API Key length:", import.meta.env.VITE_GEMINI_API_KEY?.length);
    
    // Test the API connection
    const testConnection = async () => {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent({
                contents: [{
                    parts: [{
                        text: "Hello"
                    }]
                }]
            });
            console.log("API connection test successful");
        } catch (error) {
            console.error("API connection test failed:", error);
        }
    };
    testConnection();
}, []);

// Replace the mock analyzeMessage function with this real implementation
const analyzeMessage = async (message, scenario) => {
    setIsAnalyzing(true);
    
    try {
        // Check if API key is available
        if (!getApiKey()) {
            throw new Error("API key not configured. Please set up your API key in GitHub Secrets.");
        }

        // Use the correct model name
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        });
        
        const prompt = `Analyze this networking email for a ${scenario.title} scenario. 
        The email is: "${message}"
        
        Provide a detailed analysis in the following JSON format:
        {
            "overallScore": number (0-100),
            "clarity": number (0-100),
            "tone": number (0-100),
            "personalization": number (0-100),
            "subjectLine": number (0-100),
            "feedback": string[],
            "suggestions": string[],
            "toneAnalysis": {
                "formality": number (0-100),
                "confidence": number (0-100),
                "friendliness": number (0-100)
            },
            "vocabularyImprovements": [
                {
                    "original": string,
                    "improved": string
                }
            ]
        }
        
        Focus on professional networking context and provide specific, actionable feedback.`;

        // Create the content parts as expected by the API
        const result = await model.generateContent({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        });

        const response = await result.response;
        const text = response.text();
        
        // Clean the response text to ensure it's valid JSON
        const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
        
        // Parse the JSON response
        const analysis = JSON.parse(cleaned);
        setAnalysis(analysis);
    } catch (error) {
        console.error("Analysis error:", error);
        // Fallback to mock data if there's an error
        const mockAnalysis = {
            overallScore: 75,
            clarity: 80,
            tone: 70,
            personalization: 65,
            subjectLine: 75,
            feedback: ["Error analyzing email. Please try again."],
            suggestions: [
                error.message === "API key not configured. Please set up your API key in GitHub Secrets."
                    ? "Please configure your API key in GitHub Secrets."
                    : "Make sure your API key is properly configured."
            ],
            toneAnalysis: {
                formality: 75,
                confidence: 68,
                friendliness: 82
            },
            vocabularyImprovements: []
        };
        setAnalysis(mockAnalysis);
    } finally {
        setIsAnalyzing(false);
    }
};

const ScenarioCard = ({ scenario, onClick }) => (
    <div 
        className="skill-card bg-white rounded-xl p-6 shadow-lg cursor-pointer hover:shadow-xl border border-gray-100"
        onClick={() => onClick(scenario)}
    >
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{scenario.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                scenario.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                scenario.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
            }`}>
                {scenario.difficulty}
            </span>
        </div>
        <p className="text-gray-600 mb-3">{scenario.description}</p>
        <div className="flex items-center justify-between">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {scenario.category}
            </span>
            <SendIcon />
        </div>
    </div>
);

const TemplateCard = ({ template }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-800">{template.title}</h3>
            <div className="flex items-center">
                <StarIcon />
                <span className="text-sm text-gray-600 ml-1">{template.rating}</span>
            </div>
        </div>
        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium mb-3 inline-block">
            {template.category}
        </span>
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {template.content}
            </pre>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setUserMessage(template.content)}
                className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                <EditIcon />
                <span className="ml-1">Use Template</span>
            </button>
            <button 
                onClick={() => setSelectedTemplate(template)}
                className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
                <EyeIcon />
                <span className="ml-1">Preview</span>
            </button>
        </div>
    </div>
);

const ProgressChart = ({ label, value, color }) => (
    <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <span className="text-sm font-bold text-gray-900">{value}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className={`progress-bar h-2 rounded-full ${color}`}
                style={{ width: `${value}%` }}
            ></div>
        </div>
    </div>
);

const BadgeCard = ({ badge }) => (
    <div className={`bg-white rounded-xl p-4 shadow-lg border-2 ${
        badge.earned ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
    }`}>
        <div className="text-center">
            <div className="text-3xl mb-2">{badge.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{badge.name}</h3>
            <p className="text-sm text-gray-600">{badge.description}</p>
            {badge.earned && (
                <div className="mx-auto mt-2 w-5 h-5 text-green-500">
                    <CheckCircleIcon />
                </div>
            )}
        </div>
    </div>
);

const VocabularyCard = ({ category, tips }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <SparklesIcon />
            <span className="ml-2">{category}</span>
        </h3>
        <div className="space-y-3">
            {tips.map((tip, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">{tip}</p>
                </div>
            ))}
        </div>
    </div>
);

const renderTabContent = () => {
    switch(activeTab) {
        case 'scenarios':
            return (
                <div>
                    {selectedScenario ? (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => setSelectedScenario(null)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    ← Back to Scenarios
                                </button>
                            </div>
                            
                            <div className="bg-white rounded-xl p-6 shadow-lg">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedScenario.title}</h2>
                                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                    <p className="text-gray-700">{selectedScenario.prompt}</p>
                                </div>
                                
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Your Email Draft
                                    </label>
                                    <textarea
                                        value={userMessage}
                                        onChange={(e) => setUserMessage(e.target.value)}
                                        className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Type your email here..."
                                    />
                                    
                                    <button
                                        onClick={() => analyzeMessage(userMessage, selectedScenario)}
                                        disabled={!userMessage.trim() || isAnalyzing}
                                        className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isAnalyzing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Analyzing...
                                            </>
                                        ) : (
                                            <>
                                                <BrainIcon />
                                                <span className="ml-2">Analyze Email</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {analysis && (
                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">AI Analysis Results</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-600">{analysis.overallScore}%</div>
                                            <div className="text-sm text-gray-600">Overall Score</div>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">{analysis.clarity}%</div>
                                            <div className="text-sm text-gray-600">Clarity</div>
                                        </div>
                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-600">{analysis.tone}%</div>
                                            <div className="text-sm text-gray-600">Tone</div>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-600">{analysis.personalization}%</div>
                                            <div className="text-sm text-gray-600">Personal Touch</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3">Feedback</h4>
                                            <div className="space-y-2">
                                                {analysis.feedback.map((item, index) => (
                                                    <div key={index} className="flex items-start">
                                                        <div className="w-4h-4 text-green-500 mr-2 mt-0.5">
                                                            <CheckCircleIcon />
                                                        </div>
                                                        <p className="text-sm text-gray-700">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3">Suggestions</h4>
                                            <div className="space-y-2">
                                                {analysis.suggestions.map((item, index) => (
                                                    <div key={index} className="flex items-start">
                                                        <div className="w-4 h-4 text-blue-500 mr-2 mt-0.5">
                                                            <LightbulbIcon />
                                                        </div>
                                                        <p className="text-sm text-gray-700">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-semibold text-gray-800 mb-3">Vocabulary Improvements</h4>
                                        <div className="space-y-2">
                                            {analysis.vocabularyImprovements.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
                                                    <span className="text-sm text-red-600 line-through">{item.original}</span>
                                                    <span className="text-sm">→</span>
                                                    <span className="text-sm text-green-600 font-medium">{item.improved}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-4">Practice Scenarios</h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Choose a networking scenario to practice. Our AI will analyze your message and provide detailed feedback to help you improve.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sampleScenarios.map(scenario => (
                                    <ScenarioCard 
                                        key={scenario.id} 
                                        scenario={scenario} 
                                        onClick={setSelectedScenario}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        
        case 'templates':
            return (
                <div>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Email Templates</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Professional templates to kickstart your networking emails. Customize them for your specific needs.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {sampleTemplates.map(template => (
                            <TemplateCard key={template.id} template={template} />
                        ))}
                    </div>
                </div>
            );
        
        case 'progress':
            return (
                <div>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Progress</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Track your networking skills development across different areas.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <ProgressChart label="Clarity" value={userProgress.clarity} color="bg-blue-500" />
                        <ProgressChart label="Tone" value={userProgress.tone} color="bg-green-500" />
                        <ProgressChart label="Personalization" value={userProgress.personalization} color="bg-purple-500" />
                        <ProgressChart label="Subject Lines" value={userProgress.subjectLines} color="bg-yellow-500" />
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <TrophyIcon />
                            <span className="ml-2">Achievement Badges</span>
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {sampleBadges.map(badge => (
                                <BadgeCard key={badge.id} badge={badge} />
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <TrendingUpIcon />
                            <span className="ml-2">Recent Activity</span>
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <MessageCircleIcon />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Completed "Cold Email to Researcher"</p>
                                        <p className="text-sm text-gray-600">Score: 85% - Great job on personalization!</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">2 hours ago</span>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                        <AwardIcon />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Earned "Research Pro" badge</p>
                                        <p className="text-sm text-gray-600">Excelled in research outreach scenarios</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">1 day ago</span>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                        <BookOpenIcon />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Used "Thank You Follow-up" template</p>
                                        <p className="text-sm text-gray-600">Customized for career fair follow-up</p>
                                    </div>
                                </div>
                                <span className="text-sm text-gray-500">3 days ago</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        
        case 'vocabulary':
            return (
                <div>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Vocabulary Builder</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Enhance your networking vocabulary with professional alternatives and power phrases.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {vocabularyTips.map((category, index) => (
                            <VocabularyCard key={index} category={category.category} tips={category.tips} />
                        ))}
                    </div>
                    
                    <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                        <h3 className="text-xl font-bold mb-4">💡 Pro Tip</h3>
                        <p className="mb-4">
                            The key to effective networking emails is finding the right balance between professional and personal. 
                            Your message should feel genuine while maintaining appropriate boundaries.
                        </p>
                        <div className="bg-white bg-opacity-20 rounded-lg p-4">
                            <p className="text-sm">
                                <strong>Remember:</strong> Personalization beats perfection. A genuine, well-researched email 
                                will always outperform a generic template, no matter how polished.
                            </p>
                        </div>
                    </div>
                </div>
            );
        
        default:
            return null;
    }
};

return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="gradient-bg text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-6">
                    <div className="flex items-center">
                        <div className="floating-animation">
                            <NetworkIcon />
                        </div>
                        <h1 className="ml-3 text-2xl font-bold">NetworkPrep</h1>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                    {currentUser ? (
                    <div className="flex items-center gap-3">
                      <span className="hidden md:inline text-sm font-medium">{currentUser.displayName}</span>
                      <button onClick={logout} className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 text-sm">
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button onClick={signInWithGoogle} className="bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 text-sm">
                      Sign in with Google
                    </button>
                  )}

                        <a href="#" className="hover:text-blue-200 transition-colors">Home</a>
                        <a href="#" className="hover:text-blue-200 transition-colors">About</a>
                        <a href="#" className="hover:text-blue-200 transition-colors">Contact</a>
                    </nav>
                    <div className="md:hidden">
                        <MenuIcon />
                    </div>
                </div>
            </div>
        </header>

        {/* Hero Section */}
        <section className="gradient-bg text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-4xl md:text-6xl font-bold mb-6" id = "network-introduction">
                    {!currentUser ? "Master Professional Networking" : currentUser.displayName + " -- improving their networking skills!"}
                </h2>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                    AI-powered platform to improve your networking emails, practice real scenarios, and build meaningful professional relationships.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="glass-effect px-8 py-4 rounded-full font-semibold hover:bg-white hover:bg-opacity-20 transition-all duration-300">
                        Start Practicing
                    </button>
                    <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300">
                        Watch Demo
                    </button>
                </div>
            </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                    { id: 'scenarios', label: 'Practice Scenarios', icon: <TargetIcon /> },
                    { id: 'templates', label: 'Email Templates', icon: <BookOpenIcon /> },
                    { id: 'progress', label: 'Your Progress', icon: <TrendingUpIcon /> },
                    { id: 'vocabulary', label: 'Vocabulary Builder', icon: <SparklesIcon /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                            activeTab === tab.id 
                                ? 'tab-active text-white shadow-lg transform scale-105' 
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                        {tab.icon}
                        <span className="ml-2">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-96">
                {renderTabContent()}
            </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center mb-4">
                            <NetworkIcon />
                            <h3 className="ml-2 text-xl font-bold">NetworkPrep</h3>
                        </div>
                        <p className="text-gray-400">
                            Empowering professionals to build meaningful connections through AI-powered networking tools.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Features</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Practice Scenarios</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Email Templates</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">AI Analysis</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Progress Tracking</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Best Practices</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 NetworkPrep. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
);
}

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out Error:", error);
  }
};

export default NetworkingPlatform;
