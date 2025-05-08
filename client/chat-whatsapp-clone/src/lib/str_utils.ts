export function whichSubstringsExistInMainString(mainString: string, subStringsToFind: string[]): string[] {
	const lowerMainString = mainString.toLowerCase();
	return subStringsToFind
		.filter((subString) => lowerMainString.includes(subString.toLowerCase()))
		.map((subString) => subString.toLowerCase());
}

export function addSubstringsToMainString(
	mainString: string,
	subStringsToAppend: string[],
	separator: string = ', '
): string {
	const currentTags = mainString.split(separator).map((tag) => tag.trim());
	const newTags = subStringsToAppend.filter((subString) => !currentTags.includes(subString));
	return [...currentTags, ...newTags].filter(Boolean).join(separator);
}

// export function removeSubstringsFromString(
// 	mainString: string,
// 	subStringsToRemove: string[],
// 	separator: string = ', '
// ): string {
// 	const currentTags = mainString.split(separator).map((tag) => tag.trim());
// 	const updatedTags = currentTags.filter((tag) => !subStringsToRemove.includes(tag.toLowerCase()));
// 	return updatedTags.filter(Boolean).join(separator);
// }
export function removeSubstringsFromString(mainString: string, subStringsToRemove: string[]): string {
	// Normalize the main string and substrings to remove for case-insensitive comparison
	const normalizedMainString = mainString.toLocaleLowerCase();
	const normalizedSubStringsToRemove = subStringsToRemove.map((subStr) => subStr.toLocaleLowerCase());

	let resultString = mainString;

	// Iterate over the substrings to remove
	normalizedSubStringsToRemove.forEach((normalizedSubStr, index) => {
		// Find the original casing substring from the main string
		const originalSubStr = new RegExp(subStringsToRemove[index], 'gi').exec(mainString)?.[0] || '';

		// If found, remove it from the result string
		if (originalSubStr) {
			const regex = new RegExp(originalSubStr, 'g');
			resultString = resultString.replace(regex, '');
		}
	});

	// Clean up any extra spaces left after removal
	resultString = resultString.replace(/\s+/g, ' ').trim();

	return resultString;
}

export function capitalizeFirstLetterOfEachWord(inputString: string): string {
	return inputString
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function capitalizeWordsInArray(stringsArray: string[]): string[] {
	return stringsArray.map((str) => capitalizeFirstLetterOfEachWord(str));
}

export async function copyTextToClipboard_OldAsync(textToCopy: string): Promise<boolean> {
	try {
		// Try to use the Clipboard API first
		await navigator.clipboard.writeText(textToCopy);
		console.log('Text copied to clipboard using Clipboard API');
		return true;
	} catch (err) {
		console.warn('Clipboard API failed, attempting execCommand fallback', err);

		// Fallback to execCommand
		try {
			const textArea = document.createElement('textarea');
			textArea.value = textToCopy;

			// Make the textarea out of viewport
			textArea.style.position = 'fixed';
			textArea.style.left = '-999999px';
			textArea.style.top = '-999999px';

			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();

			const successful = document.execCommand('copy');
			document.body.removeChild(textArea);

			if (successful) {
				console.log('Text copied to clipboard using execCommand fallback');
				return true;
			} else {
				console.error('execCommand copy failed');
				return false;
			}
		} catch (err) {
			console.error('Fallback clipboard copy failed', err);
			return false;
		}
	}
}
export async function copyTextToClipboard(text: string): Promise<boolean> {
    // Function to use ClipboardItem with Promise
    const copyWithClipboardItem = async () => {
        const clipboardItem = new ClipboardItem({
            'text/plain': new Promise(async (resolve) => {
                resolve(new Blob([text], { type: 'text/plain' }));
            })
        });
        await navigator.clipboard.write([clipboardItem]);
        return true;
    };

    // Function to use execCommand as fallback
    const fallbackCopyTextToClipboard = (): boolean => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        textArea.style.top = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful;
        } catch (err) {
            console.error('Fallback: Unable to copy to clipboard', err);
            document.body.removeChild(textArea);
            return false;
        }
    };

    try {
        if (navigator.clipboard && 'write' in navigator.clipboard) {
            // Use ClipboardItem for all browsers that support it
            return await copyWithClipboardItem();
        } else {
            // Fallback to execCommand
            return fallbackCopyTextToClipboard();
        }
    } catch (error) {
        console.error('Copy failed:', error);
        // Final fallback to execCommand
        return fallbackCopyTextToClipboard();
    }
}
export function truncate(str: string, maxLength: number) {
	return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
}

function revertToHebrew(text: string): string {
	const hebrewCharMap: { [key: string]: string } = {
		à: 'א',
		á: 'ב',
		â: 'ג',
		ã: 'ד',
		ä: 'ה',
		å: 'ו',
		æ: 'ז',
		ç: 'ח',
		è: 'ט',
		é: 'י',
		ê: 'כ',
		ë: 'ל',
		ì: 'מ',
		í: 'נ',
		î: 'ס',
		ï: 'ע',
		ð: 'פ',
		ñ: 'צ',
		ò: 'ק',
		ó: 'ר',
		ô: 'ש',
		õ: 'ת',
		ö: 'ך',
		'÷': 'ם',
		ø: 'ן',
		ù: 'ף',
		ú: 'ץ',
	};

	return text
		.split('')
		.map((char) => hebrewCharMap[char] || char)
		.join('');
}
