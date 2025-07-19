import React from "react";
import { Text, View } from "@react-pdf/renderer";

// Define a type for parsed HTML nodes
interface HtmlNode {
  type: string;
  tag?: string;
  content?: string;
  attrs?: Record<string, string>;
  children?: HtmlNode[];
}

// --- 1. Simple HTML Tokenizer & Parser ---
// This is a basic parser for a subset of HTML, not a full spec-compliant parser.
function tokenizeHtml(
  html: string
): Array<{ type: "tag" | "text"; value: string }> {
  const regex = /(<[^>]+>)|([^<]+)/g;
  const tokens: Array<{ type: "tag" | "text"; value: string }> = [];
  let match;
  while ((match = regex.exec(html))) {
    if (match[1]) {
      tokens.push({ type: "tag", value: match[1] });
    } else if (match[2]) {
      tokens.push({ type: "text", value: match[2] });
    }
  }
  return tokens;
}

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /(\w+)(?:\s*=\s*(["'])(.*?)\2)?/g;
  let match;
  while ((match = attrRegex.exec(tag))) {
    if (match[1] !== undefined && match[3] !== undefined) {
      attrs[match[1]] = match[3];
    } else if (match[1] !== undefined) {
      attrs[match[1]] = "";
    }
  }
  return attrs;
}

function parseHtml(html: string): HtmlNode[] {
  const tokens = tokenizeHtml(html);
  const stack: HtmlNode[] = [];
  const root: HtmlNode = { type: "root", children: [] };
  let current = root;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "text") {
      const text = token.value.replace(/\s+/g, " ");
      if (text.trim()) {
        (current.children = current.children || []).push({
          type: "text",
          content: text,
        });
      }
    } else if (token.type === "tag") {
      const isClosing = /^<\//.test(token.value);
      const tagMatch = /^<\/?([a-zA-Z0-9]+)([^>]*)\/?\s*>$/.exec(token.value);
      if (!tagMatch) continue;
      const tag = tagMatch[1].toLowerCase();
      const isSelfClosing =
        /\/$/.test(token.value) || ["br", "hr"].includes(tag);
      if (isClosing) {
        // Pop stack until matching tag
        let popped;
        do {
          popped = stack.pop();
        } while (popped && popped.tag !== tag);
        current = stack.length > 0 ? stack[stack.length - 1] : root;
      } else {
        const node: HtmlNode = {
          type: "element",
          tag,
          attrs: parseAttributes(tagMatch[2] || ""),
          children: [],
        };
        (current.children = current.children || []).push(node);
        if (!isSelfClosing) {
          stack.push(node);
          current = node;
        }
      }
    }
  }
  return root.children || [];
}

// --- 2. Renderer: Map HTML nodes to @react-pdf/renderer elements ---
function renderHtmlNodes(nodes: HtmlNode[], keyPrefix = ""): React.ReactNode[] {
  return nodes.map((node, idx) => {
    const key = keyPrefix + idx;
    if (node.type === "text") {
      return <Text key={key}>{node.content}</Text>;
    }
    if (node.type === "element") {
      const children = node.children
        ? renderHtmlNodes(node.children, key + "-")
        : null;
      switch (node.tag) {
        case "p":
          return (
            <Text key={key} style={{ marginBottom: 5 }}>
              {children}
            </Text>
          );
        case "br":
          return <Text key={key}>{"\n"}</Text>;
        case "b":
        case "strong":
          return (
            <Text key={key} style={{ fontWeight: 700 }}>
              {children}
            </Text>
          );
        case "i":
        case "em":
          return (
            <Text key={key} style={{ fontStyle: "italic" }}>
              {children}
            </Text>
          );
        case "u":
          return (
            <Text key={key} style={{ textDecoration: "underline" }}>
              {children}
            </Text>
          );
        case "s":
        case "strike":
          return (
            <Text key={key} style={{ textDecoration: "line-through" }}>
              {children}
            </Text>
          );
        case "h1":
          return (
            <Text
              key={key}
              style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}
            >
              {children}
            </Text>
          );
        case "h2":
          return (
            <Text
              key={key}
              style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}
            >
              {children}
            </Text>
          );
        case "h3":
          return (
            <Text
              key={key}
              style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}
            >
              {children}
            </Text>
          );
        case "h4":
        case "h5":
        case "h6":
          return (
            <Text
              key={key}
              style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}
            >
              {children}
            </Text>
          );
        case "ul":
          return (
            <View key={key} style={{ marginLeft: 10, marginBottom: 5 }}>
              {node.children
                ?.filter((li) => li.tag === "li")
                .map((li, liIdx) => (
                  <View
                    key={key + "-li-" + liIdx}
                    style={{
                      flexDirection: "row",
                      marginBottom: 8,
                      marginLeft: 5,
                    }} // Increased marginBottom
                  >
                    <Text>• </Text>
                    <View style={{ flex: 1 }}>
                      {renderHtmlNodes(
                        li.children || [],
                        key + "-li-" + liIdx + "-"
                      )}
                    </View>
                  </View>
                ))}
            </View>
          );
        case "ol":
          let olIndex = 0;
          return (
            <View key={key} style={{ marginLeft: 10, marginBottom: 5 }}>
              {node.children
                ?.filter((li) => li.tag === "li")
                .map((li, liIdx) => {
                  olIndex++;
                  return (
                    <View
                      key={key + "-li-" + liIdx}
                      style={{
                        flexDirection: "row",
                        marginBottom: 2,
                        marginLeft: 5,
                      }}
                    >
                      <Text>{olIndex + ". "}</Text>
                      <Text>
                        {renderHtmlNodes(
                          li.children || [],
                          key + "-li-" + liIdx + "-"
                        )}
                      </Text>
                    </View>
                  );
                })}
            </View>
          );
        case "li":
          return (
            <Text key={key} style={{ marginBottom: 5 }}>
              {children}
            </Text>
          );
        case "a":
          return (
            <Text
              key={key}
              style={{ color: "#3182ce", textDecoration: "underline" }}
            >
              {children}
            </Text>
          );
        case "blockquote":
          return (
            <View
              key={key}
              style={{
                borderLeftWidth: 2,
                borderLeftColor: "#e2e8f0",
                paddingLeft: 10,
                marginBottom: 10,
              }}
            >
              {children}
            </View>
          );
        case "pre":
          return (
            <View
              key={key}
              style={{
                backgroundColor: "#f7fafc",
                padding: 8,
                borderRadius: 4,
                marginBottom: 10,
              }}
            >
              <Text style={{ fontFamily: "Courier", fontSize: 10 }}>
                {children}
              </Text>
            </View>
          );
        case "code":
          return (
            <Text
              key={key}
              style={{
                backgroundColor: "#f7fafc",
                paddingHorizontal: 4,
                borderRadius: 2,
                fontFamily: "Courier",
                fontSize: 10,
              }}
            >
              {children}
            </Text>
          );
        case "hr":
          return (
            <View
              key={key}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#e2e8f0",
                marginVertical: 10,
              }}
            />
          );
        case "span":
        case "div":
          return (
            <View key={key} style={{ marginBottom: 5 }}>
              {children}
            </View>
          );
        default:
          return <Text key={key}>{children}</Text>;
      }
    }
    return null;
  });
}

// --- 3. Main Exported Function ---
export function parseHtmlToPdfElements(html: string): React.ReactNode[] {
  const nodes = parseHtml(html);
  return renderHtmlNodes(nodes);
}
