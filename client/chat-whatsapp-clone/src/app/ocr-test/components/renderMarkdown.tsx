'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ImageIcon } from 'lucide-react';
import 'katex/dist/katex.min.css';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Enhanced table rendering with proper styling
          table: ({ children, ...props }: React.ComponentPropsWithoutRef<'table'>) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300 bg-white dark:bg-gray-800" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }: React.ComponentPropsWithoutRef<'thead'>) => (
            <thead className="bg-gray-50 dark:bg-gray-700" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }: React.ComponentPropsWithoutRef<'th'>) => (
            <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 font-semibold text-left text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }: React.ComponentPropsWithoutRef<'td'>) => (
            <td className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </td>
          ),
          // Enhanced image handling with fallbacks
          img: ({ src, alt, title, ...props }: React.ComponentPropsWithoutRef<'img'>) => (
            <div className="my-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <ImageIcon className="w-4 h-4" />
                <span className="font-medium">
                  {alt || title || 'Embedded Image'}
                </span>
              </div>
              {src?.startsWith('data:') ? (
                <img 
                  src={src} 
                  alt={alt || 'Embedded image'} 
                  title={title}
                  className="max-w-full h-auto rounded shadow-sm border"
                  loading="lazy"
                  {...props}
                />
              ) : src ? (
                <div className="bg-white dark:bg-gray-700 p-3 rounded border">
                  <div className="text-sm text-gray-500 dark:text-gray-400 italic mb-1">
                    External Image Reference:
                  </div>
                  <div className="text-sm font-mono text-blue-600 dark:text-blue-400 break-all">
                    {src}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Image placeholder
                </div>
              )}
            </div>
          ),
          // Enhanced code block rendering
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (inline) {
              return (
                <code className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }
            
            return (
              <div className="my-4">
                {language && (
                  <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-t">
                    {language}
                  </div>
                )}
                <pre className={`bg-gray-50 dark:bg-gray-800 p-4 overflow-x-auto ${language ? 'rounded-b' : 'rounded'} border`}>
                  <code className={`${className} text-sm font-mono`} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          // Enhanced blockquote styling
          blockquote: ({ children, ...props }: React.ComponentPropsWithoutRef<'blockquote'>) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 italic" {...props}>
              {children}
            </blockquote>
          ),
          // Enhanced heading styling with anchor links
          h1: ({ children, ...props }: React.ComponentPropsWithoutRef<'h1'>) => (
            <h1 className="text-2xl font-bold mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }: React.ComponentPropsWithoutRef<'h2'>) => (
            <h2 className="text-xl font-semibold mt-6 mb-3 pb-1 border-b border-gray-100 dark:border-gray-800" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }: React.ComponentPropsWithoutRef<'h3'>) => (
            <h3 className="text-lg font-semibold mt-5 mb-2" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }: React.ComponentPropsWithoutRef<'h4'>) => (
            <h4 className="text-base font-semibold mt-4 mb-2" {...props}>
              {children}
            </h4>
          ),
          h5: ({ children, ...props }: React.ComponentPropsWithoutRef<'h5'>) => (
            <h5 className="text-sm font-semibold mt-3 mb-2" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }: React.ComponentPropsWithoutRef<'h6'>) => (
            <h6 className="text-xs font-semibold mt-3 mb-2 text-gray-600 dark:text-gray-400" {...props}>
              {children}
            </h6>
          ),
          // Enhanced list styling
          ul: ({ children, ...props }: React.ComponentPropsWithoutRef<'ul'>) => (
            <ul className="list-disc list-inside space-y-1 my-3 ml-4" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }: React.ComponentPropsWithoutRef<'ol'>) => (
            <ol className="list-decimal list-inside space-y-1 my-3 ml-4" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }: React.ComponentPropsWithoutRef<'li'>) => (
            <li className="text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </li>
          ),
          // Enhanced link styling
          a: ({ href, children, ...props }: React.ComponentPropsWithoutRef<'a'>) => (
            <a 
              href={href} 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              target="_blank" 
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          // Enhanced paragraph spacing
          p: ({ children, ...props }: React.ComponentPropsWithoutRef<'p'>) => (
            <p className="my-3 leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
              {children}
            </p>
          ),
          // Enhanced horizontal rule
          hr: (props: React.ComponentPropsWithoutRef<'hr'>) => (
            <hr className="my-8 border-t-2 border-gray-200 dark:border-gray-700" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}