import { Fragment, useEffect } from "react";
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
  type LucideIcon,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

import Tooltip from "../components/Tooltip";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

type ToolButtonConfig = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  active?: boolean;
  shortcut?: string;
  separator?: boolean;
};

function ToolButton({
  onClick,
  active,
  icon: Icon,
  label,
  shortcut,
}: ToolButtonConfig) {
  return (
    <Tooltip text={`${label}${shortcut ? ` (${shortcut})` : ""}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={[
          "p-1.5 rounded-md transition",
          "hover:bg-gray-200",
          active ? "bg-gray-200 text-black" : "text-gray-600",
        ].join(" ")}
      >
        <Icon size={16} />
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
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: [
          "prose prose-sm max-w-none",
          "min-h-[220px]",
          "px-3 py-3",
          "text-sm text-gray-900",
          "focus:outline-none",
          "leading-normal",
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
  }, [value, editor]);

  if (!editor) return null;

  const buttons: ToolButtonConfig[] = [
    {
      label: "Undo",
      shortcut: "Ctrl+Z",
      icon: Undo,
      onClick: () => editor.chain().focus().undo().run(),
    },
    {
      label: "Redo",
      shortcut: "Ctrl+Y",
      icon: Redo,
      onClick: () => editor.chain().focus().redo().run(),
      separator: true,
    },
    {
      label: "H1",
      icon: Heading1,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: editor.isActive("heading", { level: 1 }),
    },
    {
      label: "H2",
      icon: Heading2,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive("heading", { level: 2 }),
      separator: true,
    },
    {
      label: "Bold",
      shortcut: "Ctrl+B",
      icon: Bold,
      onClick: () => editor.chain().focus().toggleBold().run(),
      active: editor.isActive("bold"),
    },
    {
      label: "Italic",
      shortcut: "Ctrl+I",
      icon: Italic,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      active: editor.isActive("italic"),
    },
    {
      label: "Underline",
      icon: UnderlineIcon,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      active: editor.isActive("underline"),
    },
    {
      label: "Strike",
      icon: Strikethrough,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      active: editor.isActive("strike"),
      separator: true,
    },
    {
      label: "Bullet List",
      icon: List,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive("bulletList"),
    },
    {
      label: "Numbered List",
      icon: ListOrdered,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive("orderedList"),
      separator: true,
    },
    {
      label: "Quote",
      icon: Quote,
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      active: editor.isActive("blockquote"),
    },
    {
      label: "Code",
      icon: Code,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      active: editor.isActive("codeBlock"),
      separator: true,
    },
    {
      label: "Clear",
      icon: Trash2,
      onClick: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
    },
  ];

  return (
    <div className="bg-white">
      <div className="flex flex-wrap items-center gap-1 px-2 py-1 border-b border-gray-200 bg-gray-50">
        {buttons.map((button) => (
          <Fragment key={button.label}>
            <ToolButton {...button} />
            {button.separator && <div className="w-px h-5 mx-1 bg-gray-300" />}
          </Fragment>
        ))}
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
