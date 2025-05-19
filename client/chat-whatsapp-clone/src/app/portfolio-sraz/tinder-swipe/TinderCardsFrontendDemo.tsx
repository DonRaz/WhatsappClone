'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimation } from 'framer-motion';
// import { toast } from 'react-hot-toast';
import { toast } from 'sonner';

import { create } from 'zustand';
import { VolumeX, Volume2, Star, X, RotateCcw, Heart, Zap, ThumbsUp, ThumbsDown, Tag } from 'lucide-react';

// Asset path configuration
const assetsPrefix = '/portfolio-demo/tinder-swipe';

// Types
interface Card {
	id: number; // dtrackFullObj.id
	cardTitle: string; // dtrackFullObj.title
	cardSubtitle: string; // dtrackFullObj.artists (concated with , delimiter)
	pages: {
		image: string; // dtrackFullObj.extras.images[0].url
		sound: string; // 
		title: string;
		details?: string[];
	}[];
}

// Mock data with updated asset paths
const mockCards: Card[] = 
[
	
	     {
        "id": 1,
        "cardTitle": "Eiffel 65 - Blue",
        "cardSubtitle": "90s",
        "pages": [
            {
                "image": `${assetsPrefix}/images/AC-Eiffel_65-Blue_DALLE.webp`,
                "sound": `${assetsPrefix}/sounds/Eiffel 65 - Blue SMPL_part1.mp3`,
                "title": "Blue - Eiffel 65",
                "details": ["90s", "Pop", "EDM"]
            },
            {
                "image": `${assetsPrefix}/images/dj-like-pixar.png`,
                "sound": `${assetsPrefix}/sounds/Eiffel 65 - Blue SMPL_part2.mp3`,
                "title": "Blue - Eiffel 65",
                "details": ["Energy - 8", "Popularity - 9", "Nostalgic", "Climax"]
            },
            {
                "image": `${assetsPrefix}/images/AC-Eiffel_65-Blue_DALLE.webp`,
                "sound": `${assetsPrefix}/sounds/Eiffel 65 - Blue SMPL_part3.mp3`,
                "title": "Blue - Eiffel 65",
                "details": ["Wedding", "Bachelorette Party", "Bar-Mitzvah"]
            }
        ]
    },
    {
        "id": 2,
        "cardTitle": "Corona - Rhythm of The Night",
        "cardSubtitle": "90s",
        "pages": [
            {
                "image": `${assetsPrefix}/images/AC-Corona-Rhythm_of_The_Night-DALLE.webp`,
                "sound": `${assetsPrefix}/sounds/Corona - Rhythm of The Night SMPL_part1.mp3`,
                "title": "Rhythm of The Night - Corona",
                "details": ["90s", "Dance", "Eurodance"]
            },
            {
                "image": `${assetsPrefix}/images/dj-like-pixar.png`,
                "sound": `${assetsPrefix}/sounds/Corona - Rhythm of The Night SMPL_part2.mp3`,
                "title": "Rhythm of The Night - Corona",
                "details": ["Energy - 9", "Popularity - 8", "Upbeat", "Danceable"]
            },
            {
                "image": `${assetsPrefix}/images/AC-Corona-Rhythm_of_The_Night-DALLE.webp`,
                "sound": `${assetsPrefix}/sounds/Corona - Rhythm of The Night SMPL_part3.mp3`,
                "title": "Rhythm of The Night - Corona",
                "details": ["Club", "Dance Party", "Festival"]
            }
        ]
    },
	 

    {
        "id": 3,
        "cardTitle": "Britney Spears - Crazy",
        "cardSubtitle": "90s",
        "pages": [
            {
                "image": `${assetsPrefix}/images/event-placeholder.png`,
                "sound": `${assetsPrefix}/sounds/Britney Spears - Crazy SMPL_part1.mp3`,
                "title": "Crazy - Britney Spears",
                "details": ["90s", "Pop", "Dance"]
            },
            {
                "image": `${assetsPrefix}/images/dj-like-pixar.png`,
                "sound": `${assetsPrefix}/sounds/Britney Spears - Crazy SMPL_part2.mp3`,
                "title": "Crazy - Britney Spears",
                "details": ["Energy - 7", "Popularity - 10", "Iconic", "Catchy"]
            },
            {
                "image": `${assetsPrefix}/images/event-placeholder.png`,
                "sound": `${assetsPrefix}/sounds/Britney Spears - Crazy SMPL_part3.mp3`,
                "title": "Crazy - Britney Spears",
                "details": ["Teen Party", "Bachelorette Party", "90s Night"]
            }
        ]
    },
    {
        "id": 4,
        "cardTitle": "Aqua - Barbie Girl",
        "cardSubtitle": "90s",
        "pages": [
            {
                "image": `${assetsPrefix}/images/event-placeholder.png`,
                "sound": `${assetsPrefix}/sounds/Aqua - Barbie Girl SMPL_part1.mp3`,
                "title": "Barbie Girl - Aqua",
                "details": ["90s", "Pop", "Dance"]
            },
            {
                "image": `${assetsPrefix}/images/dj-like-pixar.png`,
                "sound": `${assetsPrefix}/sounds/Aqua - Barbie Girl SMPL_part2.mp3`,
                "title": "Barbie Girl - Aqua",
                "details": ["Energy - 8", "Popularity - 9", "Fun", "Cheerful"]
            },
            {
                "image": `${assetsPrefix}/images/event-placeholder.png`,
                "sound": `${assetsPrefix}/sounds/Aqua - Barbie Girl SMPL_part3.mp3`,
                "title": "Barbie Girl - Aqua",
                "details": ["Children's Party", "Themed Party", "Fun Fair"]
            }
        ]
    },
    {
        "id": 5,
        "cardTitle": "Los Lobos - La Bamba",
        "cardSubtitle": "50s",
        "pages": [
            {
                "image": `${assetsPrefix}/images/event-placeholder.png`,
                "sound": `${assetsPrefix}/sounds/Los Lobos - La Bamba SMPL_part1.mp3`,
                "title": "La Bamba - Los Lobos",
                "details": ["50s", "Rock 'n' Roll", "Latin"]
            },
            {
                "image": `${assetsPrefix}/images/dj-like-pixar.png`,
                "sound": `${assetsPrefix}/sounds/Los Lobos - La Bamba SMPL_part2.mp3`,
                "title": "La Bamba - Los Lobos",
                "details": ["Energy - 7", "Popularity - 8", "Classic", "Danceable"]
            },
            {
                "image": `${assetsPrefix}/images/event-placeholder.png`,
                "sound": `${assetsPrefix}/sounds/Los Lobos - La Bamba SMPL_part3.mp3`,
                "title": "La Bamba - Los Lobos",
                "details": ["Wedding", "Cultural Event", "Fiesta"]
            }
        ]
    },
    {
        "id": 6,
        "cardTitle": "Chubby Checker - Let's Twist Again",
        "cardSubtitle": "60s",
        "pages": [
            {
                "image": `${assetsPrefix}/images/event-placeholder.png`,
                "sound": `${assetsPrefix}/sounds/Chubby Checker - Let's Twist Again SMPL_part1.mp3`,
                "title": "Let's Twist Again - Chubby Checker",
                "details": ["60s", "Rock 'n' Roll", "Dance"]
            },
            {
                "image": `${assetsPrefix}/images/dj-like-pixar.png`,
                "sound": `${assetsPrefix}/sounds/Chubby Checker - Let's Twist Again SMPL_part2.mp3`,
                "title": "Let's Twist Again - Chubby Checker",
                "details": ["Energy - 8", "Popularity - 9", "Nostalgic", "Fun"]
            },
            {
                "image": `${assetsPrefix}/images/event-placeholder.png`,
                "sound": `${assetsPrefix}/sounds/Chubby Checker - Let's Twist Again SMPL_part3.mp3`,
                "title": "Let's Twist Again - Chubby Checker",
                "details": ["Retro Party", "Dance Party", "Birthday"]
            }
        ]
    },
    {
        "id": 7,
        "cardTitle": "Jerry Lee Lewis - Great Balls of Fire",
        "cardSubtitle": "50s",
        "pages": [
            {
                "image": `${assetsPrefix}/images/event-placeholder.png`,
                "sound": `${assetsPrefix}/sounds/Jerry Lee Lewis - Great Balls of Fire_SMPL_part1.mp3`,
                "title": "Great Balls of Fire - Jerry Lee Lewis",
                "details": ["50s", "Rock 'n' Roll", "Piano Rock"]
            },
            {
                "image": `${assetsPrefix}/images/dj-like-pixar.png`,
                "sound": `${assetsPrefix}/sounds/Jerry Lee Lewis - Great Balls of Fire_SMPL_part2.mp3`,
                "title": "Great Balls of Fire - Jerry Lee Lewis",
                "details": ["Energy - 9", "Popularity - 8", "High Energy", "Classic"]
            },
            {
                "image": `${assetsPrefix}/images/event-placeholder.png`,
                "sound": `${assetsPrefix}/sounds/Jerry Lee Lewis - Great Balls of Fire_SMPL_part3.mp3`,
                "title": "Great Balls of Fire - Jerry Lee Lewis",
                "details": ["Rock 'n' Roll Party", "Dance Party", "50s Themed Event"]
            }
        ]
    }
];

// Zustand store for audio management
interface AudioStore {
	playableFileName: string | null;
	volume: number;
	progress: number;
	setPlayableFileName: (fileName: string | null) => void;
	setVolume: (volume: number) => void;
	setProgress: (progress: number) => void;
	isUserEnabledPlayback: boolean;
	setIsUserEnabledPlayback: (isUserEnabledPlayback: boolean) => void;
}

const useAudioStore = create<AudioStore>((set) => ({
	playableFileName: null,
	volume: 1,
	progress: 0,
	setPlayableFileName: (fileName) => set({ playableFileName: fileName, progress: 0 }),
	setVolume: (volume) => set({ volume }),
	setProgress: (progress) => set({ progress }),
	isUserEnabledPlayback: true,
	setIsUserEnabledPlayback: (isUserEnabledPlayback) => set({ isUserEnabledPlayback }),
}));

// AudioPlayer Component
const AudioPlayer: React.FC<{ src: string }> = ({ src }) => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const {
		playableFileName,
		volume,
		setPlayableFileName,
		setProgress,
		isUserEnabledPlayback,
		setIsUserEnabledPlayback,
	} = useAudioStore();

	// useEffect(() => {
	//   setPlayableFileName(src); // Set the playableFileName when the component is initialized with the src
	// }, [src, setPlayableFileName]); // Added this useEffect

	//sets up event listeners
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => {
			setProgress(audio.currentTime / audio.duration);
		};

		const handleEnded = () => {
			setPlayableFileName(src); // Reset to play the same one again
			setProgress(0);
		};

		audio.addEventListener('timeupdate', handleTimeUpdate);
		audio.addEventListener('ended', handleEnded);

		return () => {
			audio.removeEventListener('timeupdate', handleTimeUpdate);
			audio.removeEventListener('ended', handleEnded);
		};
	}, [setProgress, setPlayableFileName, setIsUserEnabledPlayback]);

	// playback based on state changes
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		audio.src = src;
		audio.volume = volume;

		if (playableFileName === src && isUserEnabledPlayback) {
			audio.play().catch((error) => {
				if (error.name === 'NotAllowedError') {
					console.log('User interaction required before playback');
					setIsUserEnabledPlayback(false);
				} else {
					console.error('Audio playback failed', error);
				}
			});
			setProgress(0);
		} else {
			audio.pause();
		}
	}, [src, volume, playableFileName, isUserEnabledPlayback, setIsUserEnabledPlayback, isUserEnabledPlayback]);

	const togglePlayPause = () => {
		if (isUserEnabledPlayback && playableFileName === src) {
			setIsUserEnabledPlayback(false);
		} else {
			setIsUserEnabledPlayback(true);
		}
	};

	return (
		<div className="mt-2">
			<audio ref={audioRef} />
			<button onClick={togglePlayPause} className=" text-white4_dd px-4 py-2 rounded">
				{isUserEnabledPlayback && playableFileName === src ? (
					<Volume2 className="w-6 h-6" />
				) : (
					<VolumeX className="w-6 h-6" />
				)}
			</button>
		</div>
	);
};

// CardContent Component
const CardContent: React.FC<{ card: Card; isActive: boolean }> = ({ card, isActive }) => {
	const [currentPage, setCurrentPage] = useState(0);
	const { progress, playableFileName, setPlayableFileName } = useAudioStore();

	const nextPage = () => {
		if (isActive) {
			setPlayableFileName(null);
			setCurrentPage((prev) => (prev + 1) % card.pages.length);
		}
	};

	useEffect(() => {
		if (isActive) {
			setPlayableFileName(card.pages[currentPage].sound);
		}
	}, [currentPage, card.pages, setPlayableFileName, isActive]);

	return (
		<div className="relative w-full h-5/6">
			{/* Progress indicators */}
			<div className="absolute top-2 left-2 right-2 flex justify-center space-x-1 z-20">
				{card.pages.map((page, index) => (
					<div
						key={index}
						className={`flex-1 h-1 ${
							index === currentPage ? 'bg-white4_dd' : 'bg-white4_dd/60'
						} rounded overflow-hidden`}
						style={{ maxWidth: `${90 / card.pages.length}%` }}
					>
						{isActive && index === currentPage && playableFileName === page.sound && (
							<div
								className="h-full bg-pink_dd"
								style={{ width: `${progress * 100}%`, transition: 'width 0.1s linear' }}
							/>
						)}
					</div>
				))}
			</div>

			{/* Image and gradient overlay */}
			<div className="relative w-full h-full" onClick={nextPage}>
			<Image
          src={card.pages[currentPage].image}
          alt={`Card ${card.id}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          draggable="false"
          priority={currentPage === 0} // Load the first image with priority
        />
				{/* <Image
					src={card.pages[currentPage].image}
					alt={`Card ${card.id}`}
					layout="fill"
					objectFit="cover"
					draggable="false"
				/> */}
				<div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black_dd to-transparent opacity-100 z-10"></div>
			</div>

			{/* Title and details */}
			<div className="absolute bottom-0 left-0 right-0 p-4 z-20 text-white2_dd">
				<h3 className="text-2xl font-bold mb-3">{card.pages[currentPage].title}</h3>
				{card.pages[currentPage].details?.length && (
					<div className="flex flex-wrap gap-2 text-sm">
						{card.pages[currentPage].details!.map((detail, index) => (
							<span
								key={index}
								className="bg-gray_dd text-white1_dd px-3 py-1 rounded-full border-2 border-gray-300"
							>
								{detail}
							</span>
						))}
					</div>
				)}
			</div>

			{/* Audio player */}
			<div className="absolute bottom-4 right-4 z-30">
				{isActive && <AudioPlayer src={card.pages[currentPage].sound} />}
			</div>
		</div>
	);
};

// Card Component
const Card: React.FC<{
	card: Card;
	onSwipe: (direction: 'left' | 'right' | 'up' | 'down') => void;
	isActive: boolean;
	onUndo: () => void;
	isReversing: boolean;
	lastDirection: 'left' | 'right' | 'up' | 'down' | null;
}> = ({ card, onSwipe, isActive, onUndo, isReversing, lastDirection }) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const controls = useAnimation();
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const rotate = useTransform(x, [-200, 200], [-30, 30]);
	const [overlayState, setOverlayState] = useState<{ opacity: number; type: 'like' | 'nope' | 'up' | 'down' }>({
		opacity: 0,
		type: 'nope',
	});
	const { setPlayableFileName } = useAudioStore();
	const dragThreshold = 30; // Minimum drag distance to trigger overlay (in pixels)
	const isDragging = useRef(false);

	useEffect(() => {
		setPlayableFileName(isActive ? card.pages[0].sound : null);
	}, [isActive, card.pages, setPlayableFileName]);

	useEffect(() => {
		if (isReversing && lastDirection) {
			const reverseAnimation = {
				left: { x: [-window.innerWidth, 0], y: 0 },
				right: { x: [window.innerWidth, 0], y: 0 },
				up: { x: 0, y: [-window.innerHeight, 0] },
				down: { x: 0, y: [window.innerHeight, 0] },
			};

			controls.start({
				...reverseAnimation[lastDirection],
				opacity: [0, 1],
				transition: { duration: 0.2 },
			});
		}
	}, [isReversing, lastDirection, controls]);

	const updateOverlay = useCallback(() => {
		if (!cardRef.current || !isDragging.current) return;

		const xVal = x.get();
		const yVal = y.get();
		const distance = Math.sqrt(xVal ** 2 + yVal ** 2);

		if (distance < dragThreshold) {
			setOverlayState({ opacity: 0, type: 'nope' });
			return;
		}

		const newOpacity = Math.min((distance - dragThreshold) / dragThreshold, 1);
		const newType = Math.abs(xVal) > Math.abs(yVal) ? (xVal > 0 ? 'like' : 'nope') : yVal > 0 ? 'down' : 'up';

		setOverlayState({ opacity: newOpacity, type: newType });
	}, [x, y]);

	useEffect(() => {
		const unsubscribeX = x.onChange(updateOverlay);
		const unsubscribeY = y.onChange(updateOverlay);

		return () => {
			unsubscribeX();
			unsubscribeY();
		};
	}, [x, y, updateOverlay]);

	const handleDragStart = () => {
		isDragging.current = true;
	};

	const calculateDisplacement = useCallback(() => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;
		const deltaX = x.get();
		const deltaY = y.get();
		const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
		let angle = Math.atan2(-deltaY, deltaX) * (180 / Math.PI);
		if (angle < 0) {
			angle += 360;
		}
		return { distance, angle };
	}, [x, y]);

	const handleSwipe = useCallback(
		async (direction: 'left' | 'right' | 'up' | 'down') => {
			setPlayableFileName(null);
			const displacement = calculateDisplacement();
			if (displacement) {
				const { distance, angle } = displacement;
				toast.success(`Displaced ${distance.toFixed(2)}px at ${angle.toFixed(2)}°`);
			}

			const swipeDirection = {
				left: { x: -window.innerWidth, y: 0 },
				right: { x: window.innerWidth, y: 0 },
				up: { x: 0, y: -window.innerHeight },
				down: { x: 0, y: window.innerHeight },
			};

			await controls.start({
				...swipeDirection[direction],
				opacity: 0,
				transition: { duration: 0.5 },
			});
			onSwipe(direction);
		},
		[calculateDisplacement, controls, onSwipe, setPlayableFileName]
	);

	const handleDragEnd = useCallback(
		async (event: any, info: any) => {
			isDragging.current = false;
			const offsetX = info.offset.x;
			const offsetY = info.offset.y;
			const velocityX = info.velocity.x;
			const velocityY = info.velocity.y;

			if (Math.abs(offsetX) > cardRef.current!.offsetWidth / 3 || Math.abs(velocityX) > 800) {
				await handleSwipe(offsetX > 0 ? 'right' : 'left');
			} else if (Math.abs(offsetY) > cardRef.current!.offsetHeight / 3 || Math.abs(velocityY) > 800) {
				await handleSwipe(offsetY > 0 ? 'down' : 'up');
			} else {
				controls.start({ x: 0, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } });
				setOverlayState({ opacity: 0, type: 'nope' });
			}
		},
		[controls, handleSwipe]
	);

	const buttonVariants = {
		normal: { scale: 1 },
		expanded: { scale: 1.2 },
	};

	const handleTag = () => {
		toast.success('Tag action triggered!');
	};

	return (
		<motion.div
			ref={cardRef}
			className="absolute inset-0 bg-black_dd rounded-lg shadow-lg overflow-hidden"
			style={{ x, y, rotate }}
			drag={!isReversing}
			dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			animate={controls}
		>
			<CardContent card={card} isActive={isActive} />

			{overlayState.opacity > 0 && (
				<motion.div
					className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: overlayState.opacity }}
					exit={{ opacity: 0 }}
				>
				<Image
						src={`${assetsPrefix}/images/${
							overlayState.type === 'like'
								? 'boom-green'
								: overlayState.type === 'nope'
								? 'nooo'
								: overlayState.type === 'up'
								? 'loveit'
								: 'wow'//'down'
						}-overlay.png`}
						alt={overlayState.type}
						width={200}
						height={200}
						style={{ width: 'auto', height: 'auto' }}
					/>
				</motion.div>
			)}

			<div className="absolute bottom-4 left-0 w-full flex justify-center items-center">
				<div className="w-11/12 flex justify-between items-center">
					<motion.button
						className={`w-12 h-12 rounded-full flex items-center justify-center border-2 bg-transparent ${
							lastDirection ? 'border-yellow_dd' : 'border-yellow_dark_dd'
						}`}
						variants={buttonVariants}
						whileHover="expanded"
						onClick={onUndo}
					>
						<RotateCcw className={`w-6 h-6 ${lastDirection ? 'text-yellow_dd' : 'text-yellow_dark_dd'}`} />
					</motion.button>
					<motion.button
						className="w-16 h-16 bg-transparent rounded-full flex items-center justify-center border-2 border-red_dd"
						variants={buttonVariants}
						animate={overlayState.opacity > 0 && overlayState.type === 'nope' ? 'expanded' : 'normal'}
						whileHover="expanded"
						onClick={() => handleSwipe('left')}
					>
						<X className="w-8 h-8 text-red_dd" />
					</motion.button>
					<motion.button
						className="w-14 h-14 bg-transparent rounded-full flex items-center justify-center border-2 border-pink_dd"
						variants={buttonVariants}
						whileHover="expanded"
						animate={overlayState.opacity > 0 && overlayState.type === 'up' ? 'expanded' : 'normal'}
						onClick={() => handleSwipe('up')}
					>
						<Star className="w-6 h-6 text-pink_dd" />
					</motion.button>
					<motion.button
						className="w-16 h-16 bg-transparent rounded-full flex items-center justify-center border-2 border-progress_green_dd2"
						variants={buttonVariants}
						animate={overlayState.opacity > 0 && overlayState.type === 'like' ? 'expanded' : 'normal'}
						whileHover="expanded"
						onClick={() => handleSwipe('right')}
					>
						<ThumbsUp className="w-8 h-8 text-progress_green_dd2" />
					</motion.button>
					<motion.button
						className="w-14 h-14 bg-transparent rounded-full flex items-center justify-center border-2 border-purple_dd"
						variants={buttonVariants}
						whileHover="expanded"
						onClick={handleTag}
					>
						<Tag className="w-6 h-6 text-purple_dd" />
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
};

// CardStack Component

const CardStack: React.FC<{ cards: Card[]; onGoBack?: () => void }> = ({ cards, onGoBack }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [lastSwipedIndex, setLastSwipedIndex] = useState(-1);
	const [lastDirection, setLastDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null);
	const [isReversing, setIsReversing] = useState(false);
	const { setPlayableFileName } = useAudioStore();
	const isLastCard = useRef(false);

	useEffect(() => {
		if (cards[currentIndex]) {
			setPlayableFileName(cards[currentIndex].pages[0].sound);
		}
		isLastCard.current = currentIndex === cards.length - 1;
	}, [currentIndex, cards, setPlayableFileName]);

	const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
		setPlayableFileName(null);
		setLastSwipedIndex(currentIndex);
		setCurrentIndex((prevIndex) => prevIndex + 1);
		setLastDirection(direction);
	};

	const handleGoBack = () => {
		if (onGoBack) {
			onGoBack();
		} else {
			setCurrentIndex(0);
			setLastSwipedIndex(-1);
		}
	};

	const handleUndo = () => {
		if (lastSwipedIndex >= 0) {
			if (lastSwipedIndex == 0){
				setLastDirection(null);
			}
			setIsReversing(true);
			setCurrentIndex(lastSwipedIndex);
			setLastSwipedIndex(lastSwipedIndex - 1);
			
			// Reset the reversing state after animation
			setTimeout(() => {
				setIsReversing(false);
			}, 300);
		}
	};

	const isStackFinished = currentIndex >= cards.length;

	return (
		<div className="relative w-full h-full" dir='ltr'>
			<AnimatePresence>
				{isStackFinished ? (
					<motion.div
						key="finished"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
					>
						<h2 className="text-2xl font-bold mb-4 text-pink_dd">Finished Stack</h2>
						<button
							onClick={handleGoBack}
							className="px-4 py-2 bg-purple_dd/70 text-white1_dd rounded hover:bg-purple_dd transition-colors"
						>
							Go back
						</button>
					</motion.div>
				) : (
					<>
						{cards.slice(currentIndex, currentIndex + 2).map((card, index) => (
							<motion.div
								key={card.id}
								className="absolute inset-0"
								style={{ zIndex: cards.length - (currentIndex + index) }}
							>
								<Card
									card={card}
									onSwipe={handleSwipe}
									isActive={index === 0}
									onUndo={handleUndo}
									isReversing={isReversing && index === 0}
									lastDirection={lastDirection}
								/>
							</motion.div>
						))}
						{isLastCard.current && (
							<motion.div
								key="finished-background"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900"
								style={{ zIndex: cards.length - (currentIndex + 2) }}
							>
								<h2 className="text-2xl font-bold mb-4 text-pink_dd">Finished Stack</h2>
								<button
									onClick={handleGoBack}
									className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
								>
									Go back
								</button>
							</motion.div>
						)}
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

// Main App Component
const TinderCardsFrontendDemo: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-[calc(60svh)] bg-gray-100 dark:bg-gray-900">
			<div className="relative w-full  h-[calc(60svh)]">
				<CardStack cards={mockCards} />
			</div>
		</div>
	);
};

export default TinderCardsFrontendDemo;
