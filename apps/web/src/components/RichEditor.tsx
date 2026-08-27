import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect } from "react";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Trash2,
} from "lucide-react";

import Tooltip from "../components/Tooltip";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function ToolButton({
  onClick,
  active,
  children,
  label,
  shortcut,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  label: string;
  shortcut?: string;
}) {
  return (
    <Tooltip text={`${label}${shortcut ? ` (${shortcut})` : ""}`}>
      <button
        type="button"
        onClick={onClick}
        className={[
          "p-1.5 rounded-md transition",
          "hover:bg-gray-200",
          active ? "bg-gray-200 text-black" : "text-gray-600",
        ].join(" ")}
      >
        {children}
      </button>
    </Tooltip>
  );
}

export default function RichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    //   Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },

    editorProps: {
      attributes: {
        class: [
          "prose prose-sm max-w-none",
          "min-h-[220px]",
          "px-3 py-3",
          "text-sm text-gray-900",
          "focus:outline-none",
          "leading-normal",

          // 🔥 FIX SPACING PROBLEMS
          "[&>p]:my-1",
          "[&>h1]:my-2",
          "[&>h2]:my-2",
          "[&>ul]:my-1",
          "[&>ol]:my-1",
        ].join(" "),
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="bg-white">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 px-2 py-1 border-b border-gray-200 bg-gray-50">
        <ToolButton
          label="Undo"
          shortcut="Ctrl+Z"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo size={16} />
        </ToolButton>

        <ToolButton
          label="Redo"
          shortcut="Ctrl+Y"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo size={16} />
        </ToolButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolButton
          label="H1"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 size={16} />
        </ToolButton>

        <ToolButton
          label="H2"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 size={16} />
        </ToolButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolButton
          label="Bold"
          shortcut="Ctrl+B"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        >
          <Bold size={16} />
        </ToolButton>

        <ToolButton
          label="Italic"
          shortcut="Ctrl+I"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        >
          <Italic size={16} />
        </ToolButton>

        <ToolButton
          label="Underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        >
          <UnderlineIcon size={16} />
        </ToolButton>

        <ToolButton
          label="Strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        >
          <Strikethrough size={16} />
        </ToolButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolButton
          label="Bullet List"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
        >
          <List size={16} />
        </ToolButton>

        <ToolButton
          label="Numbered List"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
        >
          <ListOrdered size={16} />
        </ToolButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolButton
          label="Quote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
        >
          <Quote size={16} />
        </ToolButton>

        <ToolButton
          label="Code"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
        >
          <Code size={16} />
        </ToolButton>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        <ToolButton
          label="Clear"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          <Trash2 size={16} />
        </ToolButton>
      </div>

      {/* EDITOR */}
      <EditorContent editor={editor} />
    </div>
  );
}
