'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios'; // Reinstated axios
import { toast } from "sonner";
// import { toast } from 'sonner'; // Removed, replaced with alert()
// import Image from 'next/image'; // Removed, replaced with <img>
import { Paperclip, ArrowRight, Loader, Mic, CheckCircle, ZoomIn, ZoomOut, X, Move, Clipboard } from 'lucide-react';
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
    subtitle: translateFn('What vibe are you aiming for for this event? (Type or select from the list) [1/3]'),
    categoriesForStep: [
      { label: translateFn('energetic') },
      { label: translateFn('chill & relaxed') },
      { label: translateFn('romantic & intimate') },
      { label: translateFn('nostalgic throwbacks') },
      { label: translateFn('upbeat & dancey') },
    ],
  }),
  DECADES: (translateFn: TranslationFunction, _isShortPoll: boolean) => ({
    subtitle: translateFn('Any preferred decades for the music? (select one) [2/3]'),
    categoriesForStep: [
      { label: translateFn('60s') }, { label: translateFn('70s') }, { label: translateFn('80s') },
      { label: translateFn('90s') }, { label: translateFn('2000s') }, { label: translateFn('2010s') },
      { label: translateFn('Modern (2020s)') },
    ],
  }),
  GENRES: (translateFn: TranslationFunction, _isShortPoll: boolean) => ({
    subtitle: translateFn('What are your go-to music genres? (Type or select from the list) [3/3]'),
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
	onImageClick?: (imageUrl: string) => void;
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

// Image Modal Component
interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    // Add event listeners for dragging outside the image
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove as any);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-accent/95 rounded-lg p-4 max-w-[90vw] max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute right-2 top-2 bg-destructive text-white rounded-full p-1 z-10"
        >
          <X size={24} />
        </button>
        
        <div className="flex justify-center space-x-2 mb-4">
          <button 
            onClick={handleZoomIn} 
            className="bg-ring/20 hover:bg-ring/30 text-foreground p-2 rounded-full"
          >
            <ZoomIn size={20} />
          </button>
          <button 
            onClick={handleZoomOut} 
            className="bg-ring/20 hover:bg-ring/30 text-foreground p-2 rounded-full"
          >
            <ZoomOut size={20} />
          </button>
          <button 
            onClick={handleReset} 
            className="bg-ring/20 hover:bg-ring/30 text-foreground p-2 rounded-full"
          >
            <Move size={20} />
          </button>
        </div>
        
        <div 
          className="overflow-hidden relative h-[60vh] flex items-center justify-center"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <img 
            src={imageUrl} 
            alt="Full size" 
            className="max-w-full max-h-full object-contain select-none"
            style={{ 
              transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              transition: isDragging ? 'none' : 'transform 0.2s ease-out'
            }}
            onMouseDown={handleMouseDown}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

// Components
const Avatar: React.FC<{ imageUrl?: string; isUser: boolean }> = ({ imageUrl, isUser }) => (
	<div className={`w-8 h-8 rounded-full ${isUser ? 'bg-primary/90' : 'bg-ring/20'} mr-2 flex-shrink-0 overflow-hidden`}>
		{imageUrl ? <img src={imageUrl} alt={'avatar'} width={32} height={32} className="w-full h-full object-cover" /> : <div className="w-full h-full"></div>}
	</div>
);
const MessageTimestamp: React.FC<{ timestamp: string; color: string }> = ({ timestamp, color }) => (
	<div className={`text-xs mt-1 flex justify-end items-center ${color}`}><span>{timestamp}</span></div>
);
const ChatOption: React.FC<{ option: string; onClick: (option: string) => void; isSelected: boolean; isMultiAnswer: boolean; }> = ({ option, onClick, isSelected, isMultiAnswer }) => (
	<button onClick={() => onClick(option)} className={`relative bg-accent text-primary/80 font-bold py-2 px-4 rounded-lg mb-1 w-full hover:bg-muted-foreground/10 transition-all duration-300 ${isSelected ? 'ring-2 ring-ring/50' : ''}`}>
		<span className="capitalize">{option}</span>
		{isSelected && isMultiAnswer && <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 text-ring/80" size={20} />}
	</button>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, timestamp, avatarUrl, options, onOptionClick, isQuestion, isMultiAnswer, selectedOptions, onImageClick }) => {
	const isUser = role === 'user';
	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
			{!isUser && <Avatar imageUrl={avatarUrl} isUser={isUser} />}
			<div className="max-w-[70%]">
				<div className={`p-4 rounded-lg ${isUser ? 'bg-primary/90' : 'bg-primary/10'} ${isUser ? 'text-primary-foreground' : 'text-foreground'}`}>
					{content.map((item, index) => (
						<div key={index} className="mb-2 last:mb-0">
							{item.type === 'text' && <div className="font-semibold whitespace-pre-wrap">{item.text}</div>}
							{item.type === 'image_url' && (
                <div className="cursor-pointer hover:opacity-90 transition-opacity duration-200" onClick={() => onImageClick && onImageClick(item.image_url.url)}>
                  <img 
                    src={item.image_url.url} 
                    alt={'uploaded_image'} 
                    width={200} 
                    height={200} 
                    className="rounded-lg" 
                    style={{ height: 'auto', maxWidth: '100%' }} 
                  />
                </div>
              )}
						</div>
					))}
					<MessageTimestamp timestamp={timestamp} color={isUser ? 'text-primary-foreground' : 'text-foreground'} />
				</div>
				{options && isQuestion && onOptionClick && (
					<div className="mt-1 bg-secondary-foreground/5 p-2 rounded-lg">
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
	const aiAvatarUrl = '/portfolio-demo/tinder-swipe/images/dj-seeking.webp';
	const [modalImage, setModalImage] = useState<string | null>(null);
	const questions: Message[] = useMemo(() => generateQuestions(t), []);

	// Get latest message early to avoid usage before declaration
	const latestMessage = messages[messages.length - 1];
	const isInQuestionPhase = latestMessage?.isQuestion === true;
	const isMultiAnswerQuestion = latestMessage?.isMultiAnswer === true;
	const isSingleAnswerQuestion = isInQuestionPhase && !isMultiAnswerQuestion;
	const disableTextArea = isSending || isSingleAnswerQuestion;
	const disableSendButton = isSending || isSingleAnswerQuestion || (textAreaContent.trim() === '' && images.length === 0);

	useEffect(() => { endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
	useEffect(() => { if (messages.length === 0 && questions.length > 0) { setMessages([questions[0]]); } }, [questions, messages.length]); // Added messages.length to dependencies

    // Add clipboard paste handling
    useEffect(() => {
        const handlePaste = async (e: ClipboardEvent) => {
            if (isSending || (latestMessage?.isQuestion && !latestMessage?.isMultiAnswer)) {
                return; // Don't process paste when sending or in single-answer question mode
            }
            
            // Handle clipboard items (Files, Images)
            if (e.clipboardData?.items?.length) {
                // Check if we still have space for more images
                if (images.length >= 5) {
                    toast.error(t('max_5_images_allowed'));
                    return;
                }
                
                const items = Array.from(e.clipboardData.items);
                
                for (const item of items) {
                    // Check if this is a file
                    if (item.kind === 'file') {
                        const file = item.getAsFile();
                        if (!file) continue;
                        
                        // For images, add them to the images array
                        if (file.type.startsWith('image/')) {
                            // Check file size (5MB limit per file)
                            if (file.size > 5 * 1024 * 1024) {
                                toast.error(t('image_too_large_5mb_limit'));
                                continue;
                            }
                            
                            // Create a new file with a meaningful name
                            const renamedFile = new File(
                                [file], 
                                `pasted-image-${Date.now()}.${file.type.split('/')[1] || 'png'}`,
                                { type: file.type }
                            );
                            
                            setImages(prev => [...prev, renamedFile]);
                            toast.success(t('image_pasted_successfully'));
                            // Break after processing one image
                            break;
                        } else {
                            // Non-image file
                            toast.error(t('only_image_files_are_supported_for_paste'));
                            break;
                        }
                    }
                }
            }
            
            // Handle plain text paste (already handled by textarea)
        };
        
        // Add paste event listener to the document
        document.addEventListener('paste', handlePaste);
        
        // Remove event listener on cleanup
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, [images, isSending, latestMessage]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files);
			
			// Validate each file before adding
			const validFiles = filesArray.filter(file => {
				// Check if it's a valid image
				if (!file.type.startsWith('image/')) {
					toast.error(t('only_image_files_are_allowed'));
					return false;
				}
				
				// Check file size (5MB limit per file)
				if (file.size > 5 * 1024 * 1024) {
					toast.error(t('image_too_large_5mb_limit'));
					return false;
				}
				
				return true;
			});
			
			// Add only up to max limit (5 - current count)
			const maxNewFiles = Math.max(0, 5 - images.length);
			const filesToAdd = validFiles.slice(0, maxNewFiles);
			
			if (filesToAdd.length > 0) {
				setImages(prev => [...prev, ...filesToAdd]);
			}
			
			// Show warning if some files were ignored due to limit
			if (validFiles.length > maxNewFiles) {
				toast.warning(t('max_5_images_allowed_some_ignored'));
			}
		}
	};
	const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

	const handlePasteButtonClick = () => {
		if (navigator.clipboard && navigator.clipboard.read) {
			// Modern clipboard API
			navigator.clipboard.read()
				.then(async clipboardItems => {
					if (images.length >= 5) {
						toast.error(t('max_5_images_allowed'));
						return;
					}
					
					for (const clipboardItem of clipboardItems) {
						// Check for image types in clipboard
						const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
						
						if (imageTypes.length > 0) {
							// Get the first image type
							const blob = await clipboardItem.getType(imageTypes[0]);
							const file = new File(
								[blob], 
								`clipboard-image-${Date.now()}.${imageTypes[0].split('/')[1] || 'png'}`,
								{ type: imageTypes[0] }
							);
							
							// Validate file size
							if (file.size > 5 * 1024 * 1024) {
								toast.error(t('image_too_large_5mb_limit'));
								return;
							}
							
							setImages(prev => [...prev, file]);
							toast.success(t('image_pasted_successfully'));
							return;
						}
					}
					
					// If we got here, no images were found
					toast.info(t('no_images_in_clipboard'));
				})
				.catch(err => {
					console.error('Clipboard read failed:', err);
					toast.error(t('could_not_access_clipboard'));
				});
		} else {
			// Fallback - trigger the paste event
			toast.info(t('use_ctrl_v_to_paste_from_clipboard'));
		}
	};

	const handleSubmitForMultiAnswer = () => {
		if (textAreaContent.trim()) {
			handleAnswer(textAreaContent.trim());
		} else {
			toast.error(t('please_type_or_select_your_preferences'));
		}
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

		try {
			const userMessageContent: MessageContent[] = [];
			if(textAreaContent.trim()){ 
				userMessageContent.push({ type: 'text', text: textAreaContent.trim() }); 
			}
			
			// Process images in batches if needed to prevent memory issues
			const MAX_BATCH_SIZE = 1024 * 1024 * 5; // 5MB per batch
			const imageGroups: File[][] = [[]];
			let currentGroupSize = 0;
			let currentGroupIndex = 0;
			
			images.forEach(file => {
				if (currentGroupSize + file.size > MAX_BATCH_SIZE) {
					imageGroups.push([]);
					currentGroupIndex++;
					currentGroupSize = 0;
				}
				imageGroups[currentGroupIndex].push(file);
				currentGroupSize += file.size;
			});
			
			// Process each batch of images
			const allImageBase64: string[] = [];
			
			for (const group of imageGroups) {
				const imageBase64Promises = group.map(file => {
					return new Promise<string>((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => {
							try {
								resolve(reader.result as string);
							} catch (error) {
								console.error("Error processing image:", error);
								reject(error);
							}
						};
						reader.onerror = error => {
							console.error("Error reading file:", error);
							reject(error);
						};
						reader.readAsDataURL(file);
					});
				});
				
				const groupResults = await Promise.all(imageBase64Promises);
				allImageBase64.push(...groupResults);
			}
			
			// Add images to user message content
			userMessageContent.push(...allImageBase64.map(base64 => ({
				type: 'image_url' as const, 
				image_url: { url: base64 }
			})));
			
			// Create a version of content for display with blob URLs (more memory efficient)
			const displayUserMessageContent: MessageContent[] = [];
			if(textAreaContent.trim()){ 
				displayUserMessageContent.push({ type: 'text', text: textAreaContent.trim() }); 
			}
			displayUserMessageContent.push(...images.map(file => ({
				type: 'image_url' as const, 
				image_url: { url: URL.createObjectURL(file) }
			})));


			const newUserMessage: Message = {
				id: generateId(), 
				role: 'user', 
				content: displayUserMessageContent, 
				timestamp: getCurrentTime(),
			};
			
			setMessages(prev => [...prev, newUserMessage]);
			
			// Prepare payload for API
			const payload = {
				messages: [{
					role: 'user',
					content: userMessageContent,
				}],
			};
			
			// Clear input state
			setTextAreaContent(''); 
			setImages([]); 
			setSelectedOptions([]);

			const response = await axios.post('/api/openai', payload, {
				timeout: 60000, // 60-second timeout
				headers: {
					'Content-Type': 'application/json',
				}
			});
			
			if (!response.data.success || !response.data.message) {
				const errorMsg = response.data.error || t('api_error_no_message');
				console.error("API error:", errorMsg);
				
				const assistantErrorResponse: Message = {
					id: generateId(), 
					role: 'assistant',
					content: [{ type: 'text', text: t('sorry_i_encountered_an_error') }],
					timestamp: getCurrentTime(),
				};
				setMessages(prev => [...prev, assistantErrorResponse]);
			} else {
				const assistantMessageData = response.data.message.choices[0].message;
				let parsedContent: MessageContent[];
				
				// Handle different response formats
				if (typeof assistantMessageData.content === 'string') {
					parsedContent = [{ type: 'text', text: assistantMessageData.content }];
				} else if (Array.isArray(assistantMessageData.content)) {
					parsedContent = assistantMessageData.content;
				} else {
					parsedContent = [{ type: 'text', text: t('received_empty_response') }];
				}
				
				const assistantMessage: Message = {
					id: generateId(),

					role: assistantMessageData.role || 'assistant',
					content: parsedContent,
					timestamp: getCurrentTime(),
				};
				
				setMessages(prev => [...prev, assistantMessage]);
			}
		} catch (error) {
			console.error("API call failed:", error);
			
			const assistantErrorResponse: Message = {
				id: generateId(), 
				role: 'assistant',
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
		
		try {
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
				id: generateId(), 
				role: 'assistant',
				content: [{type: 'text', text: t('thanks_for_sharing_preferences_let_me_think')}],
				timestamp: getCurrentTime(),
			};
			setMessages(prev => [...prev, summaryConfirmation]);

			const payload = { messages: apiMessages };

			const response = await axios.post('/api/openai', payload, {
				timeout: 60000, // 60-second timeout
			});
			
			if (!response.data.success || !response.data.message) {
				const errorMsg = response.data.error || t('api_error_no_message_summary');
				console.error("API error (summary):", errorMsg);
				
				const assistantErrorResponse: Message = {
					id: generateId(), 
					role: 'assistant',
					content: [{ type: 'text', text: t('sorry_i_encountered_an_error_processing_summary') }],
					timestamp: getCurrentTime(),
				};
				setMessages(prev => [...prev, assistantErrorResponse]);
			} else {
				const assistantMessageData = response.data.message.choices[0].message;
				let parsedContent: MessageContent[];
				
				// Handle different response formats
				if (typeof assistantMessageData.content === 'string') {
					parsedContent = [{ type: 'text', text: assistantMessageData.content }];
				} else if (Array.isArray(assistantMessageData.content)) {
					parsedContent = assistantMessageData.content;
				} else {
					parsedContent = [{ type: 'text', text: t('received_empty_response') }];
				}
				
				const assistantMessage: Message = {
					id: generateId(),
					role: assistantMessageData.role || 'assistant',
					content: parsedContent,
					timestamp: getCurrentTime(),
				};
				
				setMessages(prev => [...prev, assistantMessage]);
			}
		} catch (error) {
			console.error("API call for summary failed:", error);
			
			const assistantErrorResponse: Message = {
				id: generateId(), 
				role: 'assistant',
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
			if (latestMessage?.isQuestion && latestMessage?.isMultiAnswer === false) {
				toast.error(t('please_select_an_option_from_the_list'));
				return;
			}
			if (latestMessage?.isQuestion && latestMessage?.isMultiAnswer === true) {
				handleSubmitForMultiAnswer();
			} else {
				sendMessage();
			}
		}
	};
	const handleMicrophoneClick = () => toast.info(t('voice_input_coming_soon'));

    const sendButtonAction = () => {
        if (isInQuestionPhase && isMultiAnswerQuestion) {
            handleSubmitForMultiAnswer(); 
        } else {
            sendMessage();
        }
    };

	const handleImageClick = (imageUrl: string) => {
		setModalImage(imageUrl);
	};
	
	const closeModal = () => {
		setModalImage(null);
	};

	return (
		<div className="flex flex-col h-[calc(100svh-15rem)] bg-gradient-to-b from-ring/20/30 via-muted-foreground/5 to-muted-foreground/10/30 container">
			<div className="bg-accent/50 text-foreground p-4 shadow-md flex items-center">
				<img src={aiAvatarUrl} alt="DJ Avatar" width={30} height={30} className="rounded-full mr-2" style={{ objectFit: 'cover' }} />
				<h1 className="text-xl font-bold">{t('your_dj_copilot')}</h1>
			</div>
			<div className="flex-1 overflow-y-auto p-4 bg-opacity-10 bg-accent backdrop-blur-sm">
				{messages.map(msg => (
          <ChatMessage 
            key={msg.id} 
            {...msg} 
            avatarUrl={msg.role !== 'user' ? aiAvatarUrl : undefined} 
            onOptionClick={handleOptionClick} 
            selectedOptions={selectedOptions} 
            onImageClick={handleImageClick}
          />
        ))}
				<div ref={endOfMessagesRef} />
			</div>
			<div className="p-4 bg-accent" dir="ltr">
				<div className="flex items-center space-x-2 mb-2">
					{images.map((image, index) => (
						<div key={index} className="relative inline-block">
							<img 
                src={URL.createObjectURL(image)} 
                alt={`upload ${index}`} 
                width={64} 
                height={64} 
                className="h-16 w-16 object-cover rounded-lg cursor-pointer hover:opacity-90" 
                onClick={() => handleImageClick(URL.createObjectURL(image))}
              />
							<button onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-destructive text-primary-foreground rounded-full p-1 text-xs leading-none" style={{width: '1.25rem', height: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>×</button>
						</div>
					))}
				</div>
				<div className="flex items-center space-x-2">
					<label className="flex justify-center items-center p-2 rounded-full bg-muted-foreground/10 text-muted-foreground w-10 h-10 cursor-pointer hover:bg-muted-foreground/20">
						<Paperclip className="h-5 w-5" /><input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" disabled={isSending || images.length >= 5} />
					</label>
                    <button 
                      className="flex justify-center items-center p-2 rounded-full bg-muted-foreground/10 text-muted-foreground w-10 h-10 hover:bg-muted-foreground/20" 
                      onClick={handlePasteButtonClick} 
                      disabled={isSending || images.length >= 5}
                      title={t('paste_from_clipboard')}
                    >
                      <Clipboard className="h-5 w-5" />
                    </button>
                    <button className="flex justify-center items-center p-2 rounded-full bg-ring/20 text-primary-foreground w-10 h-10 hover:bg-ring/30" onClick={handleMicrophoneClick} disabled={isSending}><Mic className="h-5 w-6" /></button>
					<textarea 
                      dir="ltr" 
                      ref={textareaRef} 
                      className="flex-1 border p-2 rounded-lg focus:ring-0 resize-none" 
                      placeholder={isSingleAnswerQuestion ? t('please_select_an_option') : t('type_your_message_here...')} 
                      rows={1} 
                      value={textAreaContent} 
                      onChange={handleTextAreaChange} 
                      onKeyDown={handleKeyDown} 
                      disabled={disableTextArea}
                    ></textarea>
					<button className={`flex justify-center items-center p-2 rounded-full bg-primary/90 text-primary-foreground w-10 h-10 ${!disableSendButton && (textAreaContent.trim().length > 0 || images.length > 0) ? 'animate-bounce' : ''} disabled:opacity-50 disabled:cursor-not-allowed`} onClick={sendButtonAction} disabled={disableSendButton}>
						{isSending ? <Loader className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
					</button>
				</div>
			</div>
      
      {/* Image Modal */}
      {modalImage && <ImageModal imageUrl={modalImage} onClose={closeModal} />}
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