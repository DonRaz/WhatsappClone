'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, Copy, FileText } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import MarkdownRenderer from './components/renderMarkdown';


export default function OCRTestPage() {
	const [file, setFile] = useState<File | null>(null);
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<string>('');
	const [markdown, setMarkdown] = useState<string>('');
	const [pages, setPages] = useState<any[]>([]);
	const [error, setError] = useState<string>('');
	const [viewMode, setViewMode] = useState<'text' | 'markdown'>('markdown');

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			// Validate file type
			if (selectedFile.type !== 'application/pdf') {
				setError('Please select a PDF file');
				return;
			}
			// Validate file size (10MB limit with Server Actions)
			if (selectedFile.size > 10 * 1024 * 1024) {
				setError('File size must be less than 10MB');
				return;
			}
			setFile(selectedFile);
			setError('');
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!file) {
			setError('Please select a file');
			return;
		}

		setLoading(true);
		setError('');
		setResult('');
		setMarkdown('');
		setPages([]);

		try {
			const formData = new FormData();
			formData.append('pdf', file);

			// const response = await fetch('/api/ocr', {
			// 	method: 'POST',
			// 	body: formData,
			// });

      const response = await axios.post('http://localhost:3010/ocr/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status !== 200) {
        throw new Error(response.data.error || 'Something went wrong');
      }

      const data = response.data;
      
			// const data = await response.json();

			setResult(data.text || '');
			setMarkdown(data.markdown || '');
			setPages(data.pages || []);
			toast.success('Text extracted successfully!');
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'An error occurred';
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const copyToClipboard = async () => {
		try {
			const textToCopy = viewMode === 'markdown' ? markdown : result;
			await navigator.clipboard.writeText(textToCopy);
			toast.success('Text copied to clipboard!');
		} catch (err) {
			toast.error('Failed to copy text');
		}
	};

	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<div className="space-y-8">
				<div className="text-center space-y-2">
					<h1 className="text-4xl font-bold tracking-tight">PDF OCR</h1>
					<p className="text-muted-foreground text-lg">
						Upload a PDF document to extract text using AI-powered OCR
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Upload className="w-5 h-5" />
							Upload PDF
						</CardTitle>
						<CardDescription>Select a PDF file (max 10MB) to extract text content</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<Label htmlFor="pdf-upload">PDF File</Label>
								<Input
									id="pdf-upload"
									type="file"
									accept=".pdf"
									onChange={handleFileChange}
									disabled={loading}
									className="cursor-pointer"
								/>
								{file && (
									<p className="text-sm text-muted-foreground">
										Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
									</p>
								)}
							</div>

							{error && (
								<Alert variant="destructive">
									<AlertDescription>{error}</AlertDescription>
								</Alert>
							)}

							<Button type="submit" disabled={!file || loading} className="w-full" size="lg">
								{loading ? (
									<>
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
										Processing PDF...
									</>
								) : (
									<>
										<FileText className="w-4 h-4 mr-2" />
										Extract Text
									</>
								)}
							</Button>
						</form>
					</CardContent>
				</Card>

				{(result || markdown) && (
					<Card>
						<CardHeader>
							<div className="flex items-center justify-between">
								<div>
									<CardTitle className="flex items-center gap-2">
										<FileText className="w-5 h-5" />
										Extracted Content
									</CardTitle>
									<CardDescription>
										{pages.length > 0 && `${pages.length} pages processed • `}
										Text content extracted from your PDF
									</CardDescription>
								</div>
								<div className="flex items-center gap-2">
									<div className="flex items-center gap-1 bg-muted rounded-lg p-1">
										<Button
											variant={viewMode === 'markdown' ? 'default' : 'ghost'}
											size="sm"
											onClick={() => setViewMode('markdown')}
											className="h-7 px-2 text-xs"
										>
											Formatted
										</Button>
										<Button
											variant={viewMode === 'text' ? 'default' : 'ghost'}
											size="sm"
											onClick={() => setViewMode('text')}
											className="h-7 px-2 text-xs"
										>
											Plain Text
										</Button>
									</div>
									<Button
										variant="outline"
										size="sm"
										onClick={copyToClipboard}
										className="flex items-center gap-2"
									>
										<Copy className="w-4 h-4" />
										Copy
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent>
							<div className="bg-muted rounded-lg p-4 max-h-96 overflow-y-auto">
								{viewMode === 'markdown' ? (
									<MarkdownRenderer content={markdown} />
								) : (
									<pre className="whitespace-pre-wrap text-sm font-mono">{result}</pre>
								)}
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
