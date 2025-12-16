import React, { useMemo, useState } from "react"
import Editor from "@monaco-editor/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Helper: build a simple file tree from paths
function buildTree(paths) {
    const root = { name: "", type: "dir", children: {} }

    for (const p of paths) {
        const parts = p.split("/").filter(Boolean)
        let node = root
        parts.forEach((part, i) => {
            const isLast = i === parts.length - 1
            if (!node.children[part]) {
                node.children[part] = {
                    name: part,
                    type: isLast ? "file" : "dir",
                    children: {},
                    path: isLast ? p : null,
                }
            }
            node = node.children[part]
        })
    }

    function toArray(dir) {
        return Object.values(dir.children)
            .sort((a, b) => {
                if (a.type !== b.type) return a.type === "dir" ? -1 : 1
                return a.name.localeCompare(b.name)
            })
            .map((n) => (n.type === "dir" ? { ...n, childrenArr: toArray(n) } : n))
    }

    return toArray(root)
}

function guessLanguage(filename) {
    const f = filename.toLowerCase()
    if (f.endsWith(".js")) return "javascript"
    if (f.endsWith(".jsx")) return "javascript"
    if (f.endsWith(".ts")) return "typescript"
    if (f.endsWith(".tsx")) return "typescript"
    if (f.endsWith(".json")) return "json"
    if (f.endsWith(".css")) return "css"
    if (f.endsWith(".html")) return "html"
    if (f.endsWith(".md")) return "markdown"
    if (f.endsWith(".sql")) return "sql"
    if (f.endsWith(".py")) return "python"
    return "plaintext"
}

export default function CodeViewer({
    title = "Code",
    // files: { "src/App.jsx": "code here", "src/main.jsx": "..." }
    files,
    height = 520,
}) {
    const filePaths = useMemo(() => Object.keys(files || {}), [files])
    const tree = useMemo(() => buildTree(filePaths), [filePaths])

    const [query, setQuery] = useState("")
    const [selected, setSelected] = useState(filePaths[0] || "")
    const code = selected ? files[selected] : ""

    const filteredPaths = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return null
        return new Set(filePaths.filter((p) => p.toLowerCase().includes(q)))
    }, [query, filePaths])

    function renderNode(node, depth = 0) {
        if (node.type === "file") {
            if (filteredPaths && !filteredPaths.has(node.path)) return null

            const active = node.path === selected
            return (
                <button
                    key={node.path}
                    onClick={() => setSelected(node.path)}
                    className={[
                        "w-full text-left rounded-md px-2 py-1 text-sm",
                        "hover:bg-muted",
                        active ? "bg-muted font-medium" : "",
                    ].join(" ")}
                    style={{ paddingLeft: 8 + depth * 14 }}
                    title={node.path}
                >
                    {node.name}
                </button>
            )
        }

        // dir
        const children = node.childrenArr
            .map((c) => renderNode(c, depth + 1))
            .filter(Boolean)

        if (filteredPaths && children.length === 0) return null

        return (
            <div key={`${node.name}-${depth}`} className="space-y-1">
                <div
                    className="text-xs uppercase text-muted-foreground px-2"
                    style={{ paddingLeft: 8 + depth * 14 }}
                >
                    {node.name}
                </div>
                <div className="space-y-1">{children}</div>
            </div>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
                <CardTitle className="text-base">{title}</CardTitle>

                <div className="flex items-center gap-2">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search files..."
                        className="h-8 w-56"
                    />
                    <Button
                        variant="outline"
                        className="h-8"
                        onClick={() => {
                            if (!selected) return
                            navigator.clipboard.writeText(code || "")
                        }}
                        disabled={!selected}
                    >
                        Copy
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 md:col-span-3">
                        <div className="rounded-lg border bg-background">
                            <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                                Files
                            </div>
                            <ScrollArea className="h-[520px] p-2">
                                <div className="space-y-2">{tree.map((n) => renderNode(n, 0))}</div>
                            </ScrollArea>
                        </div>
                    </div>

                    <div className="col-span-8 md:col-span-9">
                        <div className="rounded-lg border overflow-hidden">
                            <div className="px-3 py-2 text-xs text-muted-foreground border-b flex items-center justify-between">
                                <span className="truncate">{selected || "No file selected"}</span>
                                <span className="text-[11px]">{guessLanguage(selected)}</span>
                            </div>

                            <Editor
                                height={height}
                                value={code}
                                language={guessLanguage(selected)}
                                theme="vs-dark"
                                options={{
                                    readOnly: true,
                                    domReadOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 13,
                                    scrollBeyondLastLine: false,
                                    wordWrap: "on",
                                    renderLineHighlight: "none",
                                    folding: true,
                                    smoothScrolling: true,
                                }}
                                beforeMount={(monaco) => {
                                    // Turn off red squiggles / diagnostics (so it doesn't “show errors”)
                                    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
                                        noSemanticValidation: true,
                                        noSyntaxValidation: true,
                                    })
                                    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
                                        noSemanticValidation: true,
                                        noSyntaxValidation: true,
                                    })
                                }}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
