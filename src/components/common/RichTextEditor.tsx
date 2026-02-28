"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ImageUrlModal } from "./ImageUrlModal";

import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  AlignRight,
  AlignCenter,
  AlignLeft,
  Link2,
  Unlink,
  Image as ImageIcon,
  Code2,
  Undo2,
  Redo2,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "ابدأ الكتابة...",
  className,
  disabled = false,
}: RichTextEditorProps) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: "bg-gray-100 dark:bg-gray-800 rounded p-2 font-mono text-sm",
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Color,
      TextStyle,
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: !disabled,
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none",
          "min-h-[500px] p-4",
          "prose-headings:font-bold prose-p:leading-relaxed",
          "prose-ul:list-disc prose-ol:list-decimal",
          "prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline",
          "prose-img:rounded-lg prose-img:shadow-md",
          "prose-blockquote:border-r-4 prose-blockquote:border-gray-300 prose-blockquote:pr-4",
          "prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded",
          className
        ),
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const handleInsertLink = (url: string, text?: string) => {
    if (!editor) return;

    if (text?.trim()) {
      editor.chain().focus().insertContent(`<a href="${url}">${text}</a>`).run();
      return;
    }

    // لو مفيش نص: لو فيه selection هيعمل link عليه
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const unsetLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  const handleInsertImage = (url: string, alt?: string) => {
    editor?.chain().focus().setImage({ src: url, alt: alt || "" }).run();
  };

  if (!editor) return null;

  const Btn = ({
    onClick,
    disabled: btnDisabled,
    active,
    title,
    children,
    danger,
  }: {
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    title: string;
    children: React.ReactNode;
    danger?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={btnDisabled}
      title={title}
      className={cn(
        "p-2 rounded transition-colors inline-flex items-center justify-center",
        "text-gray-700 hover:bg-gray-200",
        active && "bg-gray-300",
        danger && "text-red-600 hover:bg-red-100",
        btnDisabled && "cursor-not-allowed opacity-50 hover:bg-transparent"
      )}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

  return (
    <div
      dir="rtl"
      className={cn(
        "border border-gray-200 rounded-lg overflow-hidden",
        "bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
        <Btn
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run() || disabled}
          active={editor.isActive("bold")}
          title="عريض"
        >
          <Bold className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run() || disabled}
          active={editor.isActive("italic")}
          title="مائل"
        >
          <Italic className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run() || disabled}
          active={editor.isActive("strike")}
          title="خط في المنتصف"
        >
          <Strikethrough className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          active={editor.isActive("underline")}
          title="خط سفلي"
        >
          <UnderlineIcon className="w-4 h-4" />
        </Btn>

        <Divider />

        <Btn
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          active={editor.isActive("heading", { level: 1 })}
          title="عنوان رئيسي"
        >
          <Heading1 className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          active={editor.isActive("heading", { level: 2 })}
          title="عنوان فرعي"
        >
          <Heading2 className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          active={editor.isActive("heading", { level: 3 })}
          title="عنوان صغير"
        >
          <Heading3 className="w-4 h-4" />
        </Btn>

        <Divider />

        <Btn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          active={editor.isActive("bulletList")}
          title="قائمة نقطية"
        >
          <List className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          active={editor.isActive("orderedList")}
          title="قائمة مرقمة"
        >
          <ListOrdered className="w-4 h-4" />
        </Btn>

        <Divider />

        <Btn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          active={editor.isActive("blockquote")}
          title="اقتباس"
        >
          <Quote className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={disabled}
          title="خط أفقي"
        >
          <Minus className="w-4 h-4" />
        </Btn>

        <Divider />

        <Btn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          disabled={disabled}
          active={editor.isActive({ textAlign: "right" })}
          title="محاذاة يمين"
        >
          <AlignRight className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          disabled={disabled}
          active={editor.isActive({ textAlign: "center" })}
          title="محاذاة وسط"
        >
          <AlignCenter className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          disabled={disabled}
          active={editor.isActive({ textAlign: "left" })}
          title="محاذاة يسار"
        >
          <AlignLeft className="w-4 h-4" />
        </Btn>

        <Divider />

        <Btn
          onClick={() => setShowLinkModal(true)}
          disabled={disabled}
          active={editor.isActive("link")}
          title="إضافة رابط"
        >
          <Link2 className="w-4 h-4" />
        </Btn>

        {editor.isActive("link") && (
          <Btn
            onClick={unsetLink}
            disabled={disabled}
            title="إزالة رابط"
            danger
          >
            <Unlink className="w-4 h-4" />
          </Btn>
        )}

        <Btn
          onClick={() => setShowImageModal(true)}
          disabled={disabled}
          title="إضافة صورة"
        >
          <ImageIcon className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={disabled}
          active={editor.isActive("codeBlock")}
          title="كود برمجي"
        >
          <Code2 className="w-4 h-4" />
        </Btn>

        <Divider />

        <Btn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run() || disabled}
          title="تراجع"
        >
          <Undo2 className="w-4 h-4" />
        </Btn>

        <Btn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run() || disabled}
          title="إعادة"
        >
          <Redo2 className="w-4 h-4" />
        </Btn>
      </div>

      {/* Modals */}
      <ImageUrlModal
        open={showLinkModal}
        onOpenChange={setShowLinkModal}
        onInsert={handleInsertLink}
        type="link"
      />
      <ImageUrlModal
        open={showImageModal}
        onOpenChange={setShowImageModal}
        onInsert={handleInsertImage}
        type="image"
      />

      {/* Editor Content */}
      <div className="relative min-h-[500px] max-h-[700px] overflow-y-auto bg-white">
        <EditorContent
          editor={editor}
          className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:p-4 [&_.ProseMirror]:prose [&_.ProseMirror]:prose-sm [&_.ProseMirror]:sm:prose-base [&_.ProseMirror]:lg:prose-lg [&_.ProseMirror]:max-w-none [&_.ProseMirror]:focus:outline-none"
        />
      </div>
    </div>
  );
}