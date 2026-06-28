"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Undo,
  Redo,
  RemoveFormatting,
  Eye,
  Code,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "",
  dir = "ltr",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showCode, setShowCode] = useState(false);
  const [codeValue, setCodeValue] = useState(value);

  // Sync value from parent if it changed externally (e.g., when clicking Edit on a product)
  useEffect(() => {
    if (editorRef.current) {
      const currentHTML = editorRef.current.innerHTML;
      if (value !== currentHTML) {
        editorRef.current.innerHTML = value || "";
      }
    }
    setCodeValue(value);
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If editor contains only empty break tags, send empty string to parent
      const cleanHTML = html === "<br>" || html === "<div><br></div>" ? "" : html;
      onChange(cleanHTML);
      setCodeValue(cleanHTML);
    }
  };

  const executeCommand = (command: string, arg: string = "") => {
    document.execCommand(command, false, arg);
    handleInput();
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const toggleCodeView = () => {
    if (showCode) {
      // Switching from code view to visual view
      if (editorRef.current) {
        editorRef.current.innerHTML = codeValue;
      }
      onChange(codeValue);
    }
    setShowCode(!showCode);
  };

  const handleCodeChange = (val: string) => {
    setCodeValue(val);
    onChange(val);
  };

  return (
    <div
      className="border rounded-lg bg-background focus-within:ring-1 focus-within:ring-primary overflow-hidden flex flex-col border-input transition-shadow shadow-sm"
      dir={dir}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-1 bg-muted/40 border-b border-border sticky top-0 z-10 select-none">
        {/* Undo / Redo */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("undo")}
          title="Undo"
          disabled={showCode}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("redo")}
          title="Redo"
          disabled={showCode}
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground font-bold"
          onClick={() => executeCommand("formatBlock", "<h1>")}
          title="Heading 1"
          disabled={showCode}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground font-bold"
          onClick={() => executeCommand("formatBlock", "<h2>")}
          title="Heading 2"
          disabled={showCode}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground font-bold text-xs"
          onClick={() => executeCommand("formatBlock", "<p>")}
          title="Paragraph"
          disabled={showCode}
        >
          P
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Basic formatting */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("bold")}
          title="Bold"
          disabled={showCode}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("italic")}
          title="Italic"
          disabled={showCode}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("underline")}
          title="Underline"
          disabled={showCode}
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("insertUnorderedList")}
          title="Bullet List"
          disabled={showCode}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("insertOrderedList")}
          title="Numbered List"
          disabled={showCode}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("justifyLeft")}
          title="Align Left"
          disabled={showCode}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("justifyCenter")}
          title="Align Center"
          disabled={showCode}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("justifyRight")}
          title="Align Right"
          disabled={showCode}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("justifyFull")}
          title="Justify"
          disabled={showCode}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Clear formatting */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          onClick={() => executeCommand("removeFormat")}
          title="Clear Formatting"
          disabled={showCode}
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        {/* View Code / Preview HTML toggle */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleCodeView}
          className="h-8 gap-1 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          {showCode ? (
            <>
              <Eye className="h-3.5 w-3.5" />
              Visual
            </>
          ) : (
            <>
              <Code className="h-3.5 w-3.5" />
              HTML
            </>
          )}
        </Button>
      </div>

      {/* Editor Content Area */}
      <div className="min-h-[160px] relative flex flex-col bg-card">
        {showCode ? (
          <textarea
            value={codeValue}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full flex-1 p-4 font-mono text-xs bg-muted/20 text-foreground resize-y focus:outline-none min-h-[160px] border-0"
            dir="ltr"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="w-full flex-1 p-4 outline-none min-h-[160px] overflow-y-auto max-w-none text-foreground text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-bold [&_a]:text-primary [&_a]:underline"
            dir={dir}
            style={{ minHeight: "160px" }}
          />
        )}

        {/* Placeholder styling using CSS absolute overlay when editor is empty */}
        {!showCode && (!value || value === "<br>" || value === "<div><br></div>" || value === "") && (
          <div
            className={`absolute top-4 ${dir === "rtl" ? "right-4" : "left-4"} text-muted-foreground pointer-events-none text-sm select-none opacity-60`}
            dir={dir}
          >
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
