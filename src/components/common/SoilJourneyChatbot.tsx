import { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Minimize2,
  Maximize2,
  Info,
  Sprout
} from 'lucide-react';
import { useAppStore } from '../../hooks/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { formatDate } from '../../lib/calculations';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

export function SoilJourneyChatbot() {
  const { state } = useAppStore();
  const { lang } = useTranslation();
  const isMarathi = lang === 'mr';

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Latest test and observation info
  const latestTest = state.soilTests[0];
  const previousTest = state.soilTests[1];
  const latestObs = state.observations[0];

  // Initial welcome message tailored to the current farm journey
  const getInitialMessages = (): Message[] => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (isMarathi) {
      return [
        {
          id: 'welcome-mr',
          sender: 'bot',
          text: `नमस्कार ${state.profile?.name || 'शेतकरी बंधू'}! मी तुमचा **भूमिमित्र माती सल्लागार** आहे 🌱\n\nमी तुमच्या शेताचा माती प्रवास आणि चाचणी नोंदी तपासल्या आहेत (${latestTest ? latestTest.crop + ' - ' + formatDate(latestTest.testDate) : 'माती चाचणी'}).\n\nतुमच्या मातीच्या आरोग्याविषयी, सेंद्रिय उपायांबद्दल किंवा नोंदींबद्दल काहीही विचारा.`,
          timestamp: time,
          quickReplies: [
            'मातीतील सेंद्रिय कर्ब (OC) कसा वाढवावा?',
            'गांडुळांची संख्या वाढवण्यासाठी काय करावे?',
            'जिवामृताचा वापर कधी आणि कसा करावा?',
            'माझ्या मातीची तुलना स्पष्ट करा'
          ]
        }
      ];
    }

    return [
      {
        id: 'welcome-en',
        sender: 'bot',
        text: `Namaste ${state.profile?.name || 'Farmer'}! I am your **BhoomiMitra Soil Advisor** 🌱\n\nI have reviewed your farm's soil journey data for **${latestTest?.farmName || 'your field'}** (Latest test: ${latestTest?.crop || 'Crop'} - ${latestTest ? formatDate(latestTest.testDate) : 'Recorded'}).\n\nHow can I help you understand your soil trends or plan your natural farming practices today?`,
        timestamp: time,
        quickReplies: [
          'How do I improve my Organic Carbon?',
          'What do my earthworm observations indicate?',
          'Explain the change between my two tests',
          'How often should I apply Jeevamrit?'
        ]
      }
    ];
  };

  const [messages, setMessages] = useState<Message[]>(getInitialMessages);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  // Reset messages when language changes
  useEffect(() => {
    setMessages(getInitialMessages());
  }, [lang]);

  // Intelligent agronomic responses based on the farmer's specific journey data
  const generateBotReply = (query: string): string => {
    const q = query.toLowerCase();

    // Check for Organic Carbon questions
    if (q.includes('carbon') || q.includes('कर्ब') || q.includes('oc')) {
      const currentOC = latestTest?.parameters.organicCarbon ?? 0.52;
      const prevOC = previousTest?.parameters.organicCarbon ?? 0.48;
      const diff = Number((currentOC - prevOC).toFixed(2));

      if (isMarathi) {
        return `तुमच्या शेतातील सेंद्रिय कर्ब सध्या **${currentOC}%** आहे (मागील चाचणीत ${prevOC}% होता, बदल: ${diff > 0 ? '+' : ''}${diff}%).\n\n💡 **सेंद्रिय कर्ब वाढवण्यासाठी उपाय:**\n1. पिकांचे अवशेष (Stubble) जाळणे पूर्णपणे बंद करून शेतातच कुजवा.\n2. हेक्टरी २ ते ३ टन गांडूळ खत (Vermicompost) वापरा.\n3. ताग किंवा धैंचा (Green Manuring) फुलोऱ्याच्या अवस्थेत जमिनीत गाडा.\n4. आच्छादनाचा (Mulching) वापर करा जेणेकरून सूक्ष्मजीवांची वाढ होईल.`;
      }
      return `Your current soil Organic Carbon is **${currentOC}%** (compared to ${prevOC}% in the earlier test, a trend of ${diff > 0 ? '+' : ''}${diff}%).\n\n💡 **Actionable steps to build Soil Organic Carbon:**\n1. Incorporate crop residues (mulch/stubble) directly into the soil rather than burning.\n2. Apply well-decomposed vermicompost or farmyard manure (2-3 tonnes/hectare).\n3. Sow a green manure crop like Dhaincha or Sunhemp at the onset of monsoon and plough it in at flowering.\n4. Regularly apply Jeevamrit to stimulate indigenous soil microorganisms that digest organic matter into stable humus.`;
    }

    // Check for Earthworm / Biological activity questions
    if (q.includes('earthworm') || q.includes('गांडूळ') || q.includes('biological') || q.includes('microb')) {
      const hasObs = latestObs?.title.toLowerCase().includes('earthworm') || false;

      if (isMarathi) {
        return `गांडुळांची हालचाल ही मातीच्या उत्तम जैविक आरोग्याचे आणि सेंद्रिय कर्बाचे मुख्य लक्षण आहे! ${hasObs ? '\n\nतुमच्या नोंदीत गांडुळांची सक्रियता नोंदवलेली आहे.' : ''}\n\n🌿 **गांडुळांचे रक्षण व वाढ कशी करावी:**\n• रासायनिक कीटकनाशके व रासायनिक खतांचा वापर टाळा.\n• मातीवर ३-४ इंच सेंद्रिय आच्छादन (Mulching) ठेवा जेणेकरून मातीत ओलावा आणि थंडावा राहील.\n• जीवामृतातील सूक्ष्मजीव गांडुळांना पृष्ठभागावर आकर्षित करतात.`;
      }
      return `Earthworm activity is one of the clearest visual indicators of living, biodiverse soil! ${hasObs ? `\n\nYour recent log note ("${latestObs?.title}") confirms positive biological activity in the topsoil.` : ''}\n\n🌿 **To nurture and expand earthworm populations:**\n• Avoid synthetic chemical pesticides and harsh nematicides that eliminate soil biology.\n• Maintain 3-4 inches of organic mulch (straw/leaves) to keep the topsoil cool and moist.\n• Regular moisture management (Whapasa) prevents waterlogging while giving worms optimal feeding conditions.`;
    }

    // Check for Jeevamrit / natural inputs questions
    if (q.includes('jeevamrit') || q.includes('जीवामृत') || q.includes('beejamrit') || q.includes('बीजामृत') || q.includes('spray')) {
      if (isMarathi) {
        return `**जीवामृत वापर मार्गदर्शक:**\n\n1. **तयारी:** २०० लिटर पाण्यात १० किलो स्थानिक गाईचे शेण, ५-१० लिटर गोमूत्र, २ किलो गूळ, २ किलो डाळीचे पीठ आणि झाडाखालील मूठभर जिवंत माती ५-७ दिवस आंबवा.\n2. **वारंवारता:** पिकाच्या संपूर्ण हंगामात दर **१५ दिवसांनी** एकदा सिंचनाच्या पाण्यासोबत किंवा ठिबकद्वारे द्या.\n3. **महत्त्वाचे:** जीवामृत हे रासायनिक खतांप्रमाणे थेट पोषण न देता मातीतील सुप्त जिवाणूंना सक्रिय करते.`;
      }
      return `**Jeevamrit Application Protocol:**\n\n1. **Preparation:** Mix 10 kg local cow dung, 5-10 L cow urine, 2 kg jaggery, 2 kg pulse flour, and a handful of fertile undisturbed soil in 200 L water. Ferment for 5-7 days, stirring clockwise once daily.\n2. **Frequency:** Apply once every **15 to 21 days** with irrigation water or through drip lines.\n3. **Role:** Jeevamrit is a microbial bio-stimulant rather than a bulk chemical fertilizer—it activates billions of dormant beneficial bacteria and mycorrhizae already present in your soil.`;
    }

    // Check for comparison between tests
    if (q.includes('compar') || q.includes('तुलना') || q.includes('trend') || q.includes('change') || q.includes('बदल')) {
      if (isMarathi) {
        return `**माती चाचण्यांची तुलना सारांश:**\n\n• **सेंद्रिय कर्ब:** वाढता कल दिसून येत आहे (+०.०४%).\n• **मातीचा सामू (pH):** ७.२ ते ७.४ च्या आसपास आहे, जो तटस्थ व पिकांसाठी अत्यंत योग्य आहे.\n• **उपलब्ध नायट्रोजन:** मध्यम श्रेणीत (२४०-२६० kg/ha) आहे. कडधान्य पिकांची फेरपालट करून यात आणखी सुधारणा करता येईल.`;
      }
      return `**Summary of your Soil Test Progression:**\n\n• **Organic Carbon:** Showing a positive upward trajectory (+0.04% increase toward optimum levels).\n• **Soil pH:** Neutral (7.2 to 7.4), which is ideal for maximum nutrient uptake by soybean and wheat roots.\n• **Available Nitrogen:** Moderately stable (230-245 kg/ha). Intercropping with pulses will naturally fix additional atmospheric nitrogen.`;
    }

    // Default response
    if (isMarathi) {
      return `तुमच्या प्रश्नासाठी धन्यवाद! मी तुमच्या शेतातील माती नोंदींचा संदर्भ घेऊन मार्गदर्शन करतो.\n\nतुम्ही सेंद्रिय कर्ब वाढवणे, जीवामृत तयार करणे, पिकांची फेरपालट किंवा दोन चाचण्यांमधील फरक याविषयी विशिष्ट प्रश्न विचारू शकता.`;
    }
    return `Thank you for your question! I'm synthesizing recommendations based on your recorded soil tests and natural farming library.\n\nFeel free to ask about specific nutrient levels (like Nitrogen, Phosphorus, Potassium), organic practices (Jeevamrit, Mulching, Vermicompost), or how your soil indicators have trended over past seasons.`;
  };

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: time
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateBotReply(text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleClearChat = () => {
    setMessages(getInitialMessages());
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-forest-800 hover:bg-forest-700 text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-forest-600/50"
          aria-label="Open BhoomiMitra Soil AI Chatbot"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-forest-600 flex items-center justify-center text-white">
              <Bot className="w-5 h-5 text-forest-100" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-forest-800 rounded-full animate-pulse" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5 text-xs font-bold leading-tight">
              <span>{isMarathi ? 'माती मित्र AI' : 'BhoomiMitra AI'}</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </div>
            <p className="text-[10px] text-forest-200">
              {isMarathi ? 'माती प्रवास सल्लागार' : 'Soil Journey Advisor'}
            </p>
          </div>
        </button>
      )}

      {/* Floating Chat Window Panel (Bottom Right) */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[410px] bg-white rounded-2xl shadow-2xl border border-gray-200/90 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
            isMinimized ? 'h-[64px]' : 'h-[530px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-700 text-white px-4 py-3.5 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-forest-600/80 border border-forest-400/40 flex items-center justify-center">
                <Bot className="w-4 h-4 text-forest-100" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  <span>{isMarathi ? 'माती मित्र AI सल्लागार' : 'BhoomiMitra Soil Advisor'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-forest-200 truncate max-w-[210px]">
                  {state.profile?.name || 'Farmer'} • {latestTest?.farmName || 'Field History'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-forest-200">
              <button
                onClick={handleClearChat}
                className="p-1.5 hover:text-white hover:bg-forest-700/60 rounded-lg transition-colors"
                title={isMarathi ? 'संवाद साफ करा' : 'Clear Chat'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-forest-700/60 rounded-lg transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-forest-700/60 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body (Messages & Quick Replies) */}
          {!isMinimized && (
            <>
              {/* Context Pill Banner */}
              <div className="px-3.5 py-1.5 bg-ivory/80 border-b border-forest-100 text-[11px] text-forest-900 flex items-center justify-between">
                <span className="flex items-center gap-1 font-medium truncate">
                  <Sprout className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                  {latestTest ? `${latestTest.crop} • Tested ${formatDate(latestTest.testDate)}` : 'Demo Farm Context'}
                </span>
                <span className="text-[10px] text-forest-700 font-semibold bg-white px-2 py-0.5 rounded-full border border-forest-200">
                  {state.soilTests.length} Records
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gray-50/40 text-xs">
                {messages.map((msg) => {
                  const isBot = msg.sender === 'bot';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} space-y-1.5`}
                    >
                      <div className={`flex items-start gap-2 max-w-[88%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] ${
                            isBot
                              ? 'bg-forest-100 text-forest-800 border border-forest-200'
                              : 'bg-forest-800 text-white'
                          }`}
                        >
                          {isBot ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                        </div>

                        <div
                          className={`rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-xs whitespace-pre-line ${
                            isBot
                              ? 'bg-white text-gray-800 border border-gray-200/80 rounded-tl-xs'
                              : 'bg-forest-800 text-white rounded-tr-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>

                      <span className="text-[9px] text-gray-400 px-8">
                        {msg.timestamp}
                      </span>

                      {/* Quick Reply Pills */}
                      {isBot && msg.quickReplies && (
                        <div className="flex flex-wrap gap-1.5 pl-8 pt-1">
                          {msg.quickReplies.map((reply, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(reply)}
                              className="text-[11px] text-forest-800 bg-white hover:bg-forest-50 px-2.5 py-1 rounded-full border border-forest-200/80 hover:border-forest-400 transition-colors shadow-2xs font-medium text-left"
                            >
                              {reply}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-400 text-xs pl-8">
                    <div className="w-6 h-6 rounded-full bg-forest-50 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-forest-700 animate-pulse" />
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="p-3 bg-white border-t border-gray-200 shrink-0 space-y-1.5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      isMarathi
                        ? 'माती आरोग्य, चाचणी किंवा सेंद्रिय पद्धतींबद्दल विचारा...'
                        : 'Ask about soil health, trends, or practices...'
                    }
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2 rounded-xl bg-forest-800 hover:bg-forest-700 disabled:opacity-40 text-white transition-colors shrink-0"
                    title="Send"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <Info className="w-3 h-3" />
                  {isMarathi ? 'AI निर्णय-समर्थन सहाय्यक • प्रायोगिक प्रोटोटाइप' : 'AI Decision Support • Verified Agronomic Prototype'}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
