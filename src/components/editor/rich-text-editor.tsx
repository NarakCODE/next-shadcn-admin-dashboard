"use client";

import { useEffect, useState } from "react";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { LinkNode } from "@lexical/link";
import { $createListNode, ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";
import { $wrapNodes } from "@lexical/selection";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  type EditorState,
  FORMAT_TEXT_COMMAND,
  type LexicalEditor,
  type TextFormatType,
} from "lexical";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const editorConfig = {
  namespace: "ProductDescriptionEditor",
  theme: editorTheme,
  nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode, LinkNode],
  onError(error: Error) {
    console.error(error);
  },
};

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter description...",
  className,
}: RichTextEditorProps) {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div
        className={cn(
          "overflow-hidden rounded-md border bg-background",
          className,
        )}
      >
        <Toolbar />
        <EditorContent
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
    </LexicalComposer>
  );
}

function Toolbar() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/20 p-1.5">
      <FormatButton editor={editor} format="bold">
        <Bold className="h-4 w-4" />
      </FormatButton>
      <FormatButton editor={editor} format="italic">
        <Italic className="h-4 w-4" />
      </FormatButton>
      <FormatButton editor={editor} format="underline">
        <Underline className="h-4 w-4" />
      </FormatButton>
      <FormatButton editor={editor} format="strikethrough">
        <Strikethrough className="h-4 w-4" />
      </FormatButton>
      <FormatButton editor={editor} format="code">
        <Code className="h-4 w-4" />
      </FormatButton>

      <div className="mx-1 h-4 w-px bg-border" />

      <BlockButton editor={editor} format="h1">
        <Heading1 className="h-4 w-4" />
      </BlockButton>
      <BlockButton editor={editor} format="h2">
        <Heading2 className="h-4 w-4" />
      </BlockButton>
      <BlockButton editor={editor} format="h3">
        <Heading3 className="h-4 w-4" />
      </BlockButton>

      <div className="mx-1 h-4 w-px bg-border" />

      <BlockButton editor={editor} format="ul">
        <List className="h-4 w-4" />
      </BlockButton>
      <BlockButton editor={editor} format="ol">
        <ListOrdered className="h-4 w-4" />
      </BlockButton>
      <BlockButton editor={editor} format="quote">
        <Quote className="h-4 w-4" />
      </BlockButton>
    </div>
  );
}

function FormatButton({
  editor,
  format,
  children,
}: {
  editor: LexicalEditor;
  format: TextFormatType;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)}
      type="button"
    >
      {children}
    </Button>
  );
}

function BlockButton({
  editor,
  format,
  children,
}: {
  editor: LexicalEditor;
  format: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if (format === "h1" || format === "h2" || format === "h3") {
              const headingNode = $createHeadingNode(
                format as "h1" | "h2" | "h3",
              );
              $wrapNodes(selection, () => headingNode);
            } else if (format === "quote") {
              const quoteNode = $createQuoteNode();
              $wrapNodes(selection, () => quoteNode);
            } else if (format === "ul") {
              const listNode = $createListNode("bullet");
              $wrapNodes(selection, () => listNode);
            } else if (format === "ol") {
              const listNode = $createListNode("number");
              $wrapNodes(selection, () => listNode);
            }
          }
        });
      }}
      type="button"
    >
      {children}
    </Button>
  );
}

function EditorContent({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value?: string;
  onChange?: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (value && value.length > 0 && !hasInitialized) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().clear();
        $getRoot().append(...nodes);
      });
      setHasInitialized(true);
    }
  }, [editor, value, hasInitialized]);

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor);
      onChange?.(html);
    });
  };

  return (
    <div className="relative">
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="min-h-[200px] p-4 text-sm outline-none"
            aria-placeholder={placeholder}
            placeholder={
              <div className="pointer-events-none absolute top-4 left-4 select-none text-muted-foreground text-sm">
                {placeholder}
              </div>
            }
          />
        }
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary as any}
      />
      <OnChangePlugin onChange={handleChange} />
      <HistoryPlugin />
      <ListPlugin />
      <LinkPlugin />
    </div>
  );
}
