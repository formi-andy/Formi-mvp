"use client";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect } from "react";

export default function RTE({
  content,
  loadedContent,
  onChange,
  maxLength,
  sticky = true,
}: {
  content?: string;
  loadedContent?: string;
  onChange?: (content: string) => void;
  maxLength?: number;
  sticky?: boolean;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content: content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (loadedContent && editor) {
      editor.commands.setContent(loadedContent);
    }
  }, [loadedContent, editor]);

  return (
    <div className="flex flex-col gap-y-4">
      <RichTextEditor
        editor={editor}
        classNames={{
          typographyStylesProvider: "!pl-0",
          toolbar: "!px-2 !py-1",
          controlsGroup: "border-none",
          control: "!border-none hover:bg-sky-100",
        }}
      >
        <RichTextEditor.Toolbar sticky={sticky} stickyOffset={0}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            {/* <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList /> */}
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
      {editor && (
        <div className="flex gap-x-2">
          <span className="flex whitespace-pre-wrap">
            <p className="font-medium">
              {editor.storage.characterCount.characters()}
              {maxLength && `/${maxLength}`}
            </p>
            <p> characters</p>
          </span>
          <span className="flex whitespace-pre-wrap">
            <p className="font-medium">
              {editor.storage.characterCount.words()}
            </p>
            <p> words</p>
          </span>
        </div>
      )}
    </div>
  );
}
