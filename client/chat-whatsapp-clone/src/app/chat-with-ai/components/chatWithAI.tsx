'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios'; // Reinstated axios
// import { toast } from 'sonner'; // Removed, replaced with alert()
// import Image from 'next/image'; // Removed, replaced with <img>
import { Paperclip, ArrowRight, Loader, Mic, CheckCircle } from 'lucide-react';
// import { useTranslations } from 'next-intl'; // Removed

// import quizTemplates, { TranslationFunction } from '@/lib/shortPoll_utils'; // Removed
// import { SafeEvent, SafeUser } from '../types'; // Removed

// ____________ DUMMY REPLACEMENTS & UTILITIES ____________ START

// Dummy t function (replaces useTranslations)
const t = (key: string, _params?: object): string => {
  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Dummy TranslationFunction type
type TranslationFunction = (translateMe: string) => string;

// Dummy quizTemplates
const dummyQuizTemplates = {
  VIBES: (translateFn: TranslationFunction, _isShortPoll: boolean) => ({
    subtitle: translateFn('What vibe are you aiming for for this event?'),
    categoriesForStep: [
      { label: translateFn('energetic') },
      { label: translateFn('chill & relaxed') },
      { label: translateFn('romantic & intimate') },
      { label: translateFn('nostalgic throwbacks') },
      { label: translateFn('upbeat & dancey') },
    ],
  }),
  DECADES: (translateFn: TranslationFunction, _isShortPoll: boolean) => ({
    subtitle: translateFn('Any preferred decades for the music?'),
    categoriesForStep: [
      { label: translateFn('60s') }, { label: translateFn('70s') }, { label: translateFn('80s') },
      { label: translateFn('90s') }, { label: translateFn('2000s') }, { label: translateFn('2010s') },
      { label: translateFn('Modern (2020s)') },
    ],
  }),
  GENRES: (translateFn: TranslationFunction, _isShortPoll: boolean) => ({
    subtitle: translateFn('What are your go-to music genres?'),
    categoriesForStep: [
      { label: translateFn('pop') }, { label: translateFn('rock') }, { label: translateFn('hip hop / rap') },
      { label: translateFn('electronic / edm') }, { label: translateFn('r&b / soul') },
      { label: translateFn('jazz / blues') }, { label: translateFn('classical') },
    ],
  }),
};

// Dummy SafeEvent and SafeUser types
interface SafeEvent {
  id: string;
  occasion: string;
  locationValue?: { address: string; };
  date: string; 
}

interface SafeUser {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

// String utilities
const whichSubstringsExistInMainString = (mainString: string, substrings: string[]): string[] => {
  if (!mainString || !substrings || substrings.length === 0) return [];
  const mainStringLower = mainString.toLowerCase();
  return substrings.filter(sub => mainStringLower.includes(sub.toLowerCase()));
};

const addSubstringsToMainString = (mainString: string, substringsToAdd: string[]): string => {
  let currentItems = mainString.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
  let changed = false;
  substringsToAdd.forEach(sub => {
    const subLower = sub.toLowerCase();
    if (!currentItems.includes(subLower)) {
      currentItems.push(subLower);
      changed = true;
    }
  });
  if (changed) {
    return currentItems.map(item => capitalizeFirstLetterOfEachWord(item)).join(', ');
  }
  return mainString;
};

const removeSubstringsFromString = (mainString: string, substringsToRemove: string[]): string => {
  let items = mainString.split(',').map(s => s.trim());
  const itemsLower = items.map(item => item.toLowerCase());
  const substringsToRemoveLower = substringsToRemove.map(s => s.toLowerCase());
  const filteredItems = items.filter((_item, index) => !substringsToRemoveLower.includes(itemsLower[index]));
  return filteredItems.join(', ');
};

const capitalizeWordsInArray = (arr: string[]): string[] => {
  return arr.map(word => capitalizeFirstLetterOfEachWord(word));
};

const capitalizeFirstLetterOfEachWord = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};
// ____________ DUMMY REPLACEMENTS & UTILITIES ____________ END

// Types
type MessageContent = TextContent | ImageContent;
type TextContent = { type: 'text'; text: string; };
type ImageContent = { type: 'image_url'; image_url: { url: string; }; };
type Message = {
	id: string;
	role: 'assistant' | 'system' | 'user';
	content: MessageContent[];
	timestamp: string;
	options?: string[];
	isMultiAnswer?: boolean;
	isQuestion?: boolean;
};
interface ChatMessageProps {
	content: MessageContent[];
	role: 'assistant' | 'system' | 'user';
	timestamp: string;
	avatarUrl?: string;
	options?: string[];
	onOptionClick?: (option: string) => void;
	isQuestion?: boolean;
	isMultiAnswer?: boolean;
	selectedOptions: string[];
}

// ____________ Utility functions ____________ START
const getEventDetails = (event: SafeEvent, translateFn: (translateMe: string) => string) => {
	if (!event) return null;
	const details = [event.occasion, event.locationValue?.address, event.date].filter(Boolean);
	if (details.length === 0) return null;
	return `${translateFn('events_details_are')} ${details.join(', ')}`;
};
const generateId = (): string => Math.random().toString(36).substr(2, 9);
const getCurrentTime = (): string => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// ____________ Utility functions ____________ END

// Components
const Avatar: React.FC<{ imageUrl?: string; isUser: boolean }> = ({ imageUrl, isUser }) => (
	<div className={`w-8 h-8 rounded-full ${isUser ? 'bg-blue-500' : 'bg-purple-600'} mr-2 flex-shrink-0 overflow-hidden`}>
		{imageUrl ? <img src={imageUrl} alt={'avatar'} width={32} height={32} className="w-full h-full object-cover" /> : <div className="w-full h-full"></div>}
	</div>
);
const MessageTimestamp: React.FC<{ timestamp: string; color: string }> = ({ timestamp, color }) => (
	<div className={`text-xs mt-1 flex justify-end items-center ${color}`}><span>{timestamp}</span></div>
);
const ChatOption: React.FC<{ option: string; onClick: (option: string) => void; isSelected: boolean; isMultiAnswer: boolean; }> = ({ option, onClick, isSelected, isMultiAnswer }) => (
	<button onClick={() => onClick(option)} className={`relative bg-white2_dd text-purple-600 font-bold py-2 px-4 rounded-lg mb-1 w-full hover:bg-white1_dd transition-all duration-300 ${isSelected ? 'ring-2 ring-purple-500' : ''}`}>
		<span className="capitalize">{option}</span>
		{isSelected && isMultiAnswer && <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600" size={20} />}
	</button>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, timestamp, avatarUrl, options, onOptionClick, isQuestion, isMultiAnswer, selectedOptions }) => {
	const isUser = role === 'user';
	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
			{!isUser && <Avatar imageUrl={avatarUrl} isUser={isUser} />}
			<div className="max-w-[70%]">
				<div className={`p-4 rounded-lg ${isUser ? 'bg-blue-500' : 'bg-white2_dd'} ${isUser ? 'text-white1_dd' : 'text-black_dd'}`}>
					{content.map((item, index) => (
						<div key={index} className="mb-2 last:mb-0">
							{item.type === 'text' && <div className="font-semibold whitespace-pre-wrap">{item.text}</div>}
							{item.type === 'image_url' && <img src={item.image_url.url} alt={'uploaded_image'} width={200} height={200} className="rounded-lg" style={{ height: 'auto', maxWidth: '100%' }} />}
						</div>
					))}
					<MessageTimestamp timestamp={timestamp} color={isUser ? 'text-white1_dd' : 'text-black_dd'} />
				</div>
				{options && isQuestion && onOptionClick && (
					<div className="mt-1">
						{options.map((option, index) => <ChatOption key={index} option={option} onClick={() => onOptionClick(option)} isSelected={selectedOptions.includes(option)} isMultiAnswer={!!isMultiAnswer} />)}
					</div>
				)}
			</div>
		</div>
	);
};

interface ChatContainerProps { event?: SafeEvent; user?: SafeUser; }

const ChatContainer: React.FC<ChatContainerProps> = ({ event, user }) => {
    const generateQuestions = (translateFn: TranslationFunction): Message[] => {
        const vibeTemplate = dummyQuizTemplates.VIBES(translateFn, false);
        const decadesTemplate = dummyQuizTemplates.DECADES(translateFn, false);
        const genresTemplate = dummyQuizTemplates.GENRES(translateFn, false);
        return [
            { id: generateId(), role: 'assistant', content: [{ type: 'text', text: vibeTemplate.subtitle }], timestamp: getCurrentTime(), options: vibeTemplate.categoriesForStep.map(c => c.label), isMultiAnswer: true, isQuestion: true },
            { id: generateId(), role: 'assistant', content: [{ type: 'text', text: decadesTemplate.subtitle }], timestamp: getCurrentTime(), options: decadesTemplate.categoriesForStep.map(c => c.label), isMultiAnswer: false, isQuestion: true },
            { id: generateId(), role: 'assistant', content: [{ type: 'text', text: genresTemplate.subtitle }], timestamp: getCurrentTime(), options: genresTemplate.categoriesForStep.map(c => c.label), isMultiAnswer: true, isQuestion: true },
        ];
    };

	const [images, setImages] = useState<File[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [isSending, setIsSending] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [initialAnswers, setInitialAnswers] = useState<{ [key: string]: string }>({});
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [textAreaContent, setTextAreaContent] = useState('');
	const endOfMessagesRef = useRef<HTMLDivElement>(null);
	const aiAvatarUrl = 'https://via.placeholder.com/40/8A2BE2/FFFFFF?text=AI';
	const questions: Message[] = useMemo(() => generateQuestions(t), []);

	useEffect(() => { endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
	useEffect(() => { if (messages.length === 0 && questions.length > 0) { setMessages([questions[0]]); } }, [questions, messages.length]); // Added messages.length to dependencies

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			setImages(prev => [...prev, ...filesArray.slice(0, 5 - prev.length)]);
		}
	};
	const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

	const handleSubmitForMultiAnswer = () => {
		if (textAreaContent.trim()) {
			handleAnswer(textAreaContent.trim());
		} else { alert(t('please_type_or_select_your_preferences')); }
	};

	const handleOptionClick = (option: string) => {
		const currentMessage = messages[messages.length - 1];
		if (!currentMessage?.isQuestion) return;
		if (!currentMessage.isMultiAnswer) { handleAnswer(option); }
		else {
			let updatedSelectedOptions: string[]; let updatedTextAreaValue: string;
			if (selectedOptions.map(s => s.toLowerCase()).includes(option.toLowerCase())) {
				updatedSelectedOptions = selectedOptions.filter(item => item.toLowerCase() !== option.toLowerCase());
				updatedTextAreaValue = removeSubstringsFromString(textAreaContent, [option]);
			} else {
				updatedSelectedOptions = [...selectedOptions, option];
				updatedTextAreaValue = addSubstringsToMainString(textAreaContent, [option]);
			}
            setSelectedOptions(capitalizeWordsInArray(updatedSelectedOptions));
            setTextAreaContent(updatedTextAreaValue);
		}
	};

	const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newContent = e.target.value; setTextAreaContent(newContent);
        const currentMessage = messages[messages.length - 1];
		if (currentMessage?.isQuestion && currentMessage.isMultiAnswer && currentMessage.options) {
            setSelectedOptions(capitalizeWordsInArray(whichSubstringsExistInMainString(newContent, currentMessage.options)));
        }
	};

	const sendMessage = async () => {
		if (textAreaContent.trim() === '' && images.length === 0) return;
		setIsSending(true);

		const userMessageContent: MessageContent[] = [];
        if(textAreaContent.trim()){ userMessageContent.push({ type: 'text', text: textAreaContent.trim() }); }
		
        const imageBase64Promises = images.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        });
        const imageBase64Strings = await Promise.all(imageBase64Promises);
        userMessageContent.push(...imageBase64Strings.map(base64 => ({
            type: 'image_url' as const, image_url: { url: base64 }
        })));
        
        // Create a version of content for display with blob URLs
        const displayUserMessageContent: MessageContent[] = [];
        if(textAreaContent.trim()){ displayUserMessageContent.push({ type: 'text', text: textAreaContent.trim() }); }
        displayUserMessageContent.push(...images.map(file => ({
            type: 'image_url' as const, image_url: { url: URL.createObjectURL(file) }
        })))


		const newUserMessage: Message = {
			id: generateId(), role: 'user', content: displayUserMessageContent, timestamp: getCurrentTime(),
		};
		setMessages(prev => [...prev, newUserMessage]);
        const currentMessagesForApi = [...messages, newUserMessage].filter(msg => msg.role === 'user' || msg.role === 'assistant'); // Send context

        // Prepare payload for API (using base64 for images)
		const payload = {
			messages: [{
				role: 'user',
				content: userMessageContent, // This now includes base64 images
			}],
		};
        
        setTextAreaContent(''); setImages([]); setSelectedOptions([]);

		try {
			const response = await axios.post('/api/openai', payload);
			if (!response.data.success || !response.data.message) {
				alert(response.data.error || t('api_error_no_message'));
                const assistantErrorResponse: Message = {
                    id: generateId(), role: 'assistant',
                    content: [{ type: 'text', text: t('sorry_i_encountered_an_error') }],
                    timestamp: getCurrentTime(),
                };
                setMessages(prev => [...prev, assistantErrorResponse]);
			} else {
				const assistantMessageData = response.data.message.choices[0].message;
				const assistantMessage: Message = {
					id: generateId(), role: assistantMessageData.role || 'assistant',
					content: Array.isArray(assistantMessageData.content) ? assistantMessageData.content : [{ type: 'text', text: assistantMessageData.content || t('received_empty_response')}],
					timestamp: getCurrentTime(),
				};
				setMessages(prev => [...prev, assistantMessage]);
			}
		} catch (error) {
			console.error("API call failed:", error);
			alert(t('something_went_wrong_contacting_ai'));
            const assistantErrorResponse: Message = {
                id: generateId(), role: 'assistant',
                content: [{ type: 'text', text: t('sorry_i_encountered_an_error_please_try_again') }],
                timestamp: getCurrentTime(),
            };
            setMessages(prev => [...prev, assistantErrorResponse]);
		} finally {
			setIsSending(false);
		}
	};

	const handleAnswer = (answer: string) => {
		const currentQuestionMessage = messages[messages.length - 1];
        if (!currentQuestionMessage?.isQuestion) return;

		const userAnswer: Message = {
			id: generateId(), role: 'user', content: [{ type: 'text', text: answer }], timestamp: getCurrentTime(),
		};
		setMessages(prev => [
			...prev.map(msg => msg.id === currentQuestionMessage.id ? { ...msg, options: undefined, isQuestion: false } : msg),
			userAnswer,
		]);
        const questionText = currentQuestionMessage.content[0].type === 'text' ? (currentQuestionMessage.content[0] as TextContent).text : `Question ${currentQuestionIndex + 1}`;
		setInitialAnswers(prev => ({ ...prev, [questionText]: answer }));
        setTextAreaContent(''); setSelectedOptions([]);

		const nextQuestionIdx = currentQuestionIndex + 1;
		setCurrentQuestionIndex(nextQuestionIdx);
		if (nextQuestionIdx < questions.length) {
			setMessages(prev => [...prev, questions[nextQuestionIdx]]);
		} else {
			sendInitialSummary(answer, questionText);
		}
	};

	const sendInitialSummary = async (lastAnswer: string, lastQuestionText: string) => {
		setIsSending(true);
        const allAnswers = { ...initialAnswers, [lastQuestionText]: lastAnswer };
		const summary = Object.entries(allAnswers).map(([q, a]) => `${capitalizeFirstLetterOfEachWord(q)}: ${a}`).join('\n');
		
        const apiMessages: {role: 'system' | 'user', content: MessageContent[]}[] = [];
		if (event) {
			const eventDetails = getEventDetails(event, t);
            if(eventDetails) apiMessages.push({ role: 'system', content: [{ type: 'text', text: eventDetails }] });
		}
		apiMessages.push({
			role: 'user',
			content: [{ type: 'text', text: `${t('here_are_my_preferences')}\n${summary}\n - ${t('suggest_3_artists_and_ask_songs')}` }],
		});

        const summaryConfirmation: Message = {
            id: generateId(), role: 'assistant',
            content: [{type: 'text', text: t('thanks_for_sharing_preferences_let_me_think')}],
            timestamp: getCurrentTime(),
        };
        setMessages(prev => [...prev, summaryConfirmation]);

		const payload = { messages: apiMessages };

		try {
			const response = await axios.post('/api/openai', payload);
			if (!response.data.success || !response.data.message) {
                alert(response.data.error || t('api_error_no_message_summary'));
                const assistantErrorResponse: Message = {
                    id: generateId(), role: 'assistant',
                    content: [{ type: 'text', text: t('sorry_i_encountered_an_error_processing_summary') }],
                    timestamp: getCurrentTime(),
                };
                setMessages(prev => [...prev, assistantErrorResponse]);
			} else {
				const assistantMessageData = response.data.message.choices[0].message;
				const assistantMessage: Message = {
					id: generateId(), role: assistantMessageData.role || 'assistant',
					content: Array.isArray(assistantMessageData.content) ? assistantMessageData.content : [{ type: 'text', text: assistantMessageData.content || t('received_empty_response') }],
					timestamp: getCurrentTime(),
				};
				setMessages(prev => [...prev, assistantMessage]);
			}
		} catch (error) {
			console.error("API call for summary failed:", error);
            alert(t('something_went_wrong_contacting_ai_for_summary'));
            const assistantErrorResponse: Message = {
                id: generateId(), role: 'assistant',
                content: [{ type: 'text', text: t('sorry_i_encountered_an_error_please_try_again_later') }],
                timestamp: getCurrentTime(),
            };
            setMessages(prev => [...prev, assistantErrorResponse]);
		} finally {
			setIsSending(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			const latestMessage = messages[messages.length - 1];
			if (latestMessage?.isQuestion && latestMessage?.isMultiAnswer === false) {
				alert(t('please_select_an_option_from_the_list')); return;
			}
            if (latestMessage?.isQuestion && latestMessage?.isMultiAnswer === true) { handleSubmitForMultiAnswer(); }
            else { sendMessage(); }
		}
	};
	const handleMicrophoneClick = () => alert(t('voice_input_coming_soon'));

    const latestMessage = messages[messages.length - 1];
    const isInQuestionPhase = latestMessage?.isQuestion === true;
    const isMultiAnswerQuestion = latestMessage?.isMultiAnswer === true;
    const isSingleAnswerQuestion = isInQuestionPhase && !isMultiAnswerQuestion;
    const disableTextArea = isSending || isSingleAnswerQuestion;
    const disableSendButton = isSending || isSingleAnswerQuestion || (textAreaContent.trim() === '' && images.length === 0);
    const sendButtonAction = () => {
        if (isInQuestionPhase && isMultiAnswerQuestion) { handleSubmitForMultiAnswer(); }
        else { sendMessage(); }
    };

	return (
		<div className="flex flex-col h-[calc(100svh-10rem)] bg-gradient-to-b from-purple_dd/30 via-white4_dd/30 to-white3_dd/30">
			<div className="bg-white2_dd/50 text-black p-4 shadow-lg flex items-center">
				<img src={aiAvatarUrl} alt="DJ Avatar" width={30} height={30} className="rounded-full mr-2" />
				<h1 className="text-xl font-bold">{t('your_dj_copilot')}</h1>
			</div>
			<div className="flex-1 overflow-y-auto p-4 bg-opacity-10 bg-white2_dd backdrop-blur-sm">
				{messages.map(msg => <ChatMessage key={msg.id} {...msg} avatarUrl={msg.role !== 'user' ? aiAvatarUrl : undefined} onOptionClick={handleOptionClick} selectedOptions={selectedOptions} />)}
				<div ref={endOfMessagesRef} />
			</div>
			<div className="p-4 bg-white2_dd" dir="ltr">
				<div className="flex items-center space-x-2 mb-2">
					{images.map((image, index) => (
						<div key={index} className="relative inline-block">
							<img src={URL.createObjectURL(image)} alt={`upload ${index}`} width={64} height={64} className="h-16 w-16 object-cover rounded-lg" />
							<button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white1_dd rounded-full p-1 text-xs leading-none" style={{width: '1.25rem', height: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>×</button>
						</div>
					))}
				</div>
				<div className="flex items-center space-x-2">
					<label className="flex justify-center items-center p-2 rounded-full bg-gray-200 text-gray-500 w-10 h-10 cursor-pointer hover:bg-gray-300">
						<Paperclip className="h-5 w-5" /><input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" disabled={isSending || images.length >= 5} />
					</label>
                    <button className="flex justify-center items-center p-2 rounded-full bg-indigo-500 text-white1_dd w-10 h-10 hover:bg-indigo-600" onClick={handleMicrophoneClick} disabled={isSending}><Mic className="h-5 w-6" /></button>
					<textarea dir="ltr" ref={textareaRef} className="flex-1 border p-2 rounded-lg focus:ring-0 resize-none" placeholder={isSingleAnswerQuestion ? t('please_select_an_option') : t('type_your_message_here...')} rows={1} value={textAreaContent} onChange={handleTextAreaChange} onKeyDown={handleKeyDown} disabled={disableTextArea}></textarea>
					<button className={`flex justify-center items-center p-2 rounded-full bg-blue-600 text-white1_dd w-10 h-10 ${!disableSendButton && (textAreaContent.trim().length > 0 || images.length > 0) ? 'animate-bounce' : ''} disabled:opacity-50 disabled:cursor-not-allowed`} onClick={sendButtonAction} disabled={disableSendButton}>
						{isSending ? <Loader className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ChatContainer;

/*
// ____________ How to use for portfolio display ____________

// 1. Make sure your API route /api/openai is deployed and accessible.
//    It needs the OPENAI_API_KEY environment variable.
//    The API route's dependencies (like next-intl if not a Next.js project) should be handled.

// 2. Define dummy event and user data (optional)
const dummyEventData: SafeEvent = {
  id: 'evt001',
  occasion: 'Birthday Bash',
  locationValue: { address: 'My Place, 123 Fun St.' },
  date: new Date(new Date().setDate(new Date().getDate() + 14)).toLocaleDateString(), // "Two weeks from now"
};



// 3. Render the component in your portfolio page:
// <ChatContainer event={dummyEventData} />
// or just
// <ChatContainer />

// Ensure you have Tailwind CSS setup (or adapt styles) and Lucide-react icons installed.
// `axios` should also be installed in your portfolio project.
*/