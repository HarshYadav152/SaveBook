"use client"

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Markdown } from 'tiptap-markdown'
import EditorToolbar from './EditorToolbar'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Mathematics from '@tiptap/extension-mathematics'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import 'katex/dist/katex.min.css'

const RichTextEditor = ({
    content,
    onChange,
    placeholder,
    className,
    minHeight = "200px"
}) => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'Start writing...',
                emptyEditorClass: 'is-editor-empty',
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
                render: {
                    item: ({ node, updateAttributes }) => {
                        return (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={node.attrs.checked}
                                    onChange={() => {
                                        updateAttributes({
                                            checked: !node.attrs.checked,
                                        });
                                    }}
                                    className="mr-2 focus:ring-2 focus:ring-blue-500 rounded"
                                    aria-label={`Toggle task: ${node.textContent || 'empty task'}`}
                                />
                            </div>
                        );
                    },
                },
            }),
            Markdown.configure({
                html: false,
                transformPastedText: true,
                transformCopiedText: true,
            }),
            Mathematics,
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
        ],
        content: content || '',
        editorProps: {
            attributes: {
                'aria-label': 'Note content editor',
                role: 'textbox',
                'aria-multiline': 'true',
                class: clsx(
                    'prose dark:prose-invert max-w-none focus:outline-none p-4 min-h-[150px]',
                    'text-white',
                    'prose-p:text-white prose-p:my-1',
                    'prose-h1:text-white prose-h1:text-3xl prose-h1:font-bold prose-h1:my-2',
                    'prose-h2:text-white prose-h2:text-2xl prose-h2:font-semibold prose-h2:my-2',
                    'prose-h3:text-white prose-h3:text-xl prose-h3:font-semibold prose-h3:my-1',
                    'prose-ul:text-white prose-ul:my-1 prose-ol:text-white prose-ol:my-1',
                    'prose-li:p-0 prose-li:m-0',
                    '[&_ul[data-type="taskList"]]:list-none [&_ul[data-type="taskList"]]:p-0 [&_ul[data-type="taskList"]]:m-0',
                    '[&_ul[data-type="taskList"]>li]:flex [&_ul[data-type="taskList"]>li]:items-center [&_ul[data-type="taskList"]>li]:gap-2',
                    '[&_li[data-type="taskItem"]]:flex [&_li[data-type="taskItem"]]:items-center [&_li[data-type="taskItem"]]:gap-2 [&_li[data-type="taskItem"]]:mb-1',
                    '[&_li[data-type="taskItem"]_div]:m-0 [&_li[data-type="taskItem"]_div]:p-0',
                    '[&_li[data-type="taskItem"]_p]:m-0 [&_li[data-type="taskItem"]_p]:p-0',
                    '[&_li[data-type="taskItem"]_input[type="checkbox"]]:mt-1.5 [&_li[data-type="taskItem"]_input[type="checkbox"]]:shrink-0 [&_li[data-type="taskItem"]_input[type="checkbox"]]:cursor-pointer [&_li[data-type="taskItem"]_input[type="checkbox"]]:accent-blue-500 [&_li[data-type="taskItem"]_input[type="checkbox"]]:w-4 [&_li[data-type="taskItem"]_input[type="checkbox"]]:h-4',
                    'prose-a:text-blue-400 prose-a:cursor-pointer hover:prose-a:text-blue-300',
                    'prose-strong:text-white',
                    'prose-blockquote:border-l-4 prose-blockquote:border-gray-500 prose-blockquote:text-gray-300 prose-blockquote:italic prose-blockquote:my-1',
                    'prose-code:text-pink-400 prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none',
                    'prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:my-1',
                    '[&_.tableWrapper]:overflow-x-auto [&_.tableWrapper]:my-2',
                    '[&_table]:border-collapse [&_table]:w-full [&_table]:my-2',
                    '[&_th]:border [&_th]:border-gray-500 [&_th]:bg-gray-700 [&_th]:text-white [&_th]:p-2 [&_th]:text-left',
                    '[&_td]:border [&_td]:border-gray-500 [&_td]:text-white [&_td]:p-2',
                    '[&_.math-node]:text-blue-300',
                ),
            },
        },
        onUpdate: ({ editor }) => {
            const markdown = editor.storage.markdown.getMarkdown()
            onChange?.(markdown)
        },
    })

    useEffect(() => {
        if (!editor) return

        const currentMarkdown = editor.storage.markdown.getMarkdown()

        if (content !== currentMarkdown) {
            editor.commands.setContent(content || '')
        }
    }, [content, editor])

    if (!editor) return null

    return (
        <div
            className={twMerge(
                "border border-gray-600 rounded-lg overflow-hidden bg-gray-900 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200",
                className
            )}
        >
            <EditorToolbar editor={editor} />

            <div
                className="cursor-text"
                onClick={() => editor.chain().focus().run()}
                style={{ minHeight }}
            >
                <EditorContent editor={editor} />
            </div>

            <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #6b7280;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .math-node {
          cursor: pointer;
          padding: 2px 4px;
          border-radius: 4px;
          background: rgba(59, 130, 246, 0.1);
        }
        .math-node.ProseMirror-selectednode {
          background: rgba(59, 130, 246, 0.25);
          outline: 2px solid #3b82f6;
        }
        .tableWrapper {
          overflow-x: auto;
          margin: 8px 0;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
        th, td {
          border: 1px solid #4b5563;
          padding: 6px 12px;
          text-align: left;
        }
        th {
          background-color: #374151;
          font-weight: 600;
        }
        tr:nth-child(even) td {
          background-color: #1f2937;
        }
      `}</style>
        </div>
    )
}

export default RichTextEditor