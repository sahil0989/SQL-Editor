import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "JOIN", "INNER", "LEFT", "RIGHT", "OUTER",
  "ON", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET", "AS",
  "AND", "OR", "NOT", "IN", "LIKE", "BETWEEN", "IS", "NULL",
  "COUNT", "SUM", "AVG", "MIN", "MAX", "DISTINCT", "CASE", "WHEN",
  "THEN", "ELSE", "END", "WITH", "UNION", "INTERSECT", "EXCEPT",
  "ASC", "DESC", "EXISTS", "ALL", "ANY"
];

const SqlEditor = ({ value, onChange, onExecute }) => {
  const editorRef = useRef(null);
  const isDark = document.documentElement?.classList?.contains("dark");

  const handleMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register SQL completions
    monaco?.languages?.registerCompletionItemProvider("sql", {
      provideCompletionItems: (model, position) => {
        const suggestions = SQL_KEYWORDS?.map((kw) => ({
          label: kw,
          kind: monaco?.languages?.CompletionItemKind?.Keyword,
          insertText: kw,
          detail: "SQL Keyword"
        }));
        ["users", "orders"]?.forEach((t) => {
          suggestions?.push({
            label: t,
            kind: monaco?.languages?.CompletionItemKind?.Class,
            insertText: t,
            detail: "Table"
          });
        });
        return { suggestions };
      }
    });

    // Ctrl+Enter to execute
    editor?.addCommand(
      monaco?.KeyMod?.CtrlCmd | monaco?.KeyCode?.Enter,
      () => onExecute && onExecute()
    );
  };

  return (
    <div style={{ height: "100%", minHeight: 220 }}>
      <Editor
        height="100%"
        defaultLanguage="sql"
        value={value}
        onChange={(v) => onChange(v || "")}
        onMount={handleMount}
        theme={isDark ? "vs-dark" : "vs"}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          renderLineHighlight: "line",
          wordWrap: "on",
          tabSize: 2,
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          padding: { top: 12, bottom: 12 },
          scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 }
        }}
      />
    </div>
  );
};

export default SqlEditor;