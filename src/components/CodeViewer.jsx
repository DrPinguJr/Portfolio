import React, { useEffect, useMemo, useState } from "react"
import Editor from "@monaco-editor/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
    const f = (filename || "").toLowerCase()
    if (f.endsWith(".js") || f.endsWith(".jsx")) return "javascript"
    if (f.endsWith(".ts") || f.endsWith(".tsx")) return "typescript"
    if (f.endsWith(".json")) return "json"
    if (f.endsWith(".css")) return "css"
    if (f.endsWith(".html")) return "html"
    if (f.endsWith(".md")) return "markdown"
    if (f.endsWith(".sql")) return "sql"
    if (f.endsWith(".py")) return "python"
    if (f.endsWith(".cs")) return "csharp"
    if (f.endsWith(".vb")) return "vb"
    if (f.endsWith(".xml")) return "xml"
    if (f.endsWith(".yml") || f.endsWith(".yaml")) return "yaml"
    return "plaintext"
}

function parseRepo(repo) {
    if (!repo) return null
    if (typeof repo === "string") {
        const m = repo.trim().match(/^([^/]+)\/([^/]+)$/)
        if (!m) return null
        return { owner: m[1], name: m[2] }
    }
    if (typeof repo === "object" && repo.owner && repo.name) {
        return { owner: String(repo.owner), name: String(repo.name) }
    }
    return null
}

function safeAllowedPaths(paths) {
    return (paths || [])
        .map((p) => String(p || "").trim())
        .filter(Boolean)
        .filter((p) => !p.startsWith("/") && !p.includes("..") && !p.includes("\\"))
}

function parseGithubBlobUrl(url) {
    const m = String(url || "")
        .trim()
        .match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/)
    if (!m) return null
    const [, owner, repo, branch, path] = m
    return { owner, repo, branch, path }
}

function rawFromParts({ owner, repo, branch, path }) {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`
}

function rawFromRepoPath({ owner, name, branch, path }) {
    return `https://raw.githubusercontent.com/${owner}/${name}/${branch}/${path}`
}

const TEXT_EXTS = new Set([
    ".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".html", ".md",
    ".sql", ".py", ".cs", ".vb", ".xml", ".yml", ".yaml", ".txt",
    ".env", ".gitignore", ".config", ".ini", ".sh", ".ps1", ".java", ".go", ".rs"
])

function isLikelyTextFile(path) {
    const p = (path || "").toLowerCase()
    const dot = p.lastIndexOf(".")
    if (dot === -1) return true
    const ext = p.slice(dot)
    return TEXT_EXTS.has(ext)
}

export default function CodeViewer({
    title = "Code",
    files,
    // github:
    //  - showAll: true  -> list repo files via GitHub API + display them
    //  - OR allowedUrls: [blob urls]
    //  - OR repo+allowedPaths
    github,
    height = 520,
}) {
    const githubPrefix = github?.prefix ?? "github/"
    const githubRepo = useMemo(() => parseRepo(github?.repo), [github?.repo])

    const githubBranch = github?.branch || "main"
    const githubAllowedPaths = useMemo(() => safeAllowedPaths(github?.allowedPaths), [github?.allowedPaths])

    const githubAllowedUrls = useMemo(() => {
        return (github?.allowedUrls || [])
            .map((u) => String(u || "").trim())
            .filter(Boolean)
            .filter((u) => !!parseGithubBlobUrl(u))
    }, [github?.allowedUrls])

    // NEW: show-all mode (repo browser)
    const [repoPaths, setRepoPaths] = useState([])
    const [repoStatus, setRepoStatus] = useState({ loading: false, err: null, branch: null })

    useEffect(() => {
        if (!github?.showAll || !githubRepo) {
            setRepoPaths([])
            setRepoStatus({ loading: false, err: null, branch: null })
            return
        }

        let alive = true
        const owner = githubRepo.owner
        const name = githubRepo.name

        async function loadRepoTree() {
            setRepoStatus({ loading: true, err: null, branch: null })
            try {
                // 1) get default branch (more reliable than guessing main/master)
                const repoRes = await fetch(`https://api.github.com/repos/${owner}/${name}`)
                if (!repoRes.ok) throw new Error(`${repoRes.status} ${repoRes.statusText}`)
                const repoJson = await repoRes.json()
                const branch = repoJson.default_branch || "main"

                // 2) load tree recursively
                const treeRes = await fetch(
                    `https://api.github.com/repos/${owner}/${name}/git/trees/${branch}?recursive=1`
                )
                if (!treeRes.ok) throw new Error(`${treeRes.status} ${treeRes.statusText}`)
                const treeJson = await treeRes.json()

                const paths = (treeJson.tree || [])
                    .filter((n) => n.type === "blob" && n.path)
                    .map((n) => n.path)
                    .filter((p) => isLikelyTextFile(p))

                if (!alive) return
                setRepoPaths(paths)
                setRepoStatus({ loading: false, err: null, branch })
            } catch (e) {
                if (!alive) return
                setRepoPaths([])
                setRepoStatus({ loading: false, err: e, branch: null })
            }
        }

        loadRepoTree()
        return () => {
            alive = false
        }
    }, [github?.showAll, githubRepo])

    const sources = useMemo(() => {
        const map = new Map()

        // local files
        for (const [path, content] of Object.entries(files || {})) {
            map.set(path, { kind: "local", displayPath: path, content: String(content ?? "") })
        }

        // github show-all
        if (github?.showAll && githubRepo && repoPaths.length) {
            const branch = repoStatus.branch || githubBranch
            for (const p of repoPaths) {
                const displayPath = `${githubPrefix}${p}`
                map.set(displayPath, {
                    kind: "github",
                    displayPath,
                    originalPath: p,
                    url: rawFromRepoPath({
                        owner: githubRepo.owner,
                        name: githubRepo.name,
                        branch,
                        path: p,
                    }),
                })
            }
            return map
        }

        // github via blob urls
        for (const blobUrl of githubAllowedUrls) {
            const info = parseGithubBlobUrl(blobUrl)
            if (!info) continue
            const displayPath = `${githubPrefix}${info.path}`
            map.set(displayPath, {
                kind: "github",
                displayPath,
                originalPath: info.path,
                url: rawFromParts(info),
            })
        }

        // github via repo + allowlist paths
        if (githubRepo && githubAllowedPaths.length) {
            for (const p of githubAllowedPaths) {
                const displayPath = `${githubPrefix}${p}`
                map.set(displayPath, {
                    kind: "github",
                    displayPath,
                    originalPath: p,
                    url: rawFromRepoPath({
                        owner: githubRepo.owner,
                        name: githubRepo.name,
                        branch: githubBranch,
                        path: p,
                    }),
                })
            }
        }

        return map
    }, [
        files,
        github,
        githubRepo,
        githubBranch,
        githubAllowedUrls,
        githubAllowedPaths,
        githubPrefix,
        repoPaths,
        repoStatus.branch,
    ])

    const filePaths = useMemo(() => Array.from(sources.keys()), [sources])
    const tree = useMemo(() => buildTree(filePaths), [filePaths])

    const [query, setQuery] = useState("")
    const [selected, setSelected] = useState(filePaths[0] || "")

    const [githubCache, setGithubCache] = useState(() => new Map())
    const [loading, setLoading] = useState(false)
    const [loadErr, setLoadErr] = useState(null)

    useEffect(() => {
        if (!selected && filePaths[0]) setSelected(filePaths[0])
        if (selected && !sources.has(selected)) setSelected(filePaths[0] || "")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filePaths.join("|")])

    const selectedSource = selected ? sources.get(selected) : null

    useEffect(() => {
        const src = selectedSource
        if (!src || src.kind !== "github") {
            setLoading(false)
            setLoadErr(null)
            return
        }
        if (githubCache.has(src.displayPath)) {
            setLoading(false)
            setLoadErr(null)
            return
        }

        const controller = new AbortController()
        setLoading(true)
        setLoadErr(null)

        fetch(src.url, { signal: controller.signal })
            .then((r) => {
                if (!r.ok) throw new Error(`${r.status} ${r.statusText}`)
                return r.text()
            })
            .then((text) => {
                setGithubCache((prev) => {
                    const next = new Map(prev)
                    next.set(src.displayPath, text)
                    return next
                })
                setLoading(false)
                setLoadErr(null)
            })
            .catch((e) => {
                if (controller.signal.aborted) return
                setLoading(false)
                setLoadErr(e)
            })

        return () => controller.abort()
    }, [selectedSource, githubCache])

    const code = useMemo(() => {
        if (!selectedSource) return ""
        if (selectedSource.kind === "local") return selectedSource.content || ""
        if (selectedSource.kind === "github") return githubCache.get(selectedSource.displayPath) || ""
        return ""
    }, [selectedSource, githubCache])

    const editorLang = useMemo(() => {
        if (!selectedSource) return "plaintext"
        const filename =
            selectedSource.kind === "github" ? selectedSource.originalPath : selectedSource.displayPath
        return guessLanguage(filename)
    }, [selectedSource])

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
                        "text-white",                // ✅ force white
                        "hover:bg-white/10",
                        active ? "bg-white/10 font-medium" : "text-white/85", // ✅ readable idle state
                    ].join(" ")}
                    style={{ paddingLeft: 8 + depth * 14 }}
                    title={node.path}
                >
                    {node.name}
                </button>
            )
        }

        const children = node.childrenArr
            .map((c) => renderNode(c, depth + 1))
            .filter(Boolean)

        if (filteredPaths && children.length === 0) return null

        return (
            <div key={`${node.name}-${depth}`} className="space-y-1">
                <div
                    className="text-xs uppercase text-white/80 px-2"
                    style={{ paddingLeft: 8 + depth * 14 }}
                >
                    {node.name}
                </div>
                <div className="space-y-1">{children}</div>
            </div>
        )
    }

    const paneHeight = typeof height === "number" ? `${height}px` : "520px"

    return (
        <Card className="w-full bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                    <CardTitle className="text-base text-white">{title}</CardTitle>

                    {github?.showAll ? (
                        <div className="text-xs text-white/50">
                            {repoStatus.loading ? "Loading repo file list…" : null}
                            {repoStatus.err ? `Repo load failed: ${String(repoStatus.err)}` : null}
                            {!repoStatus.loading && !repoStatus.err && repoStatus.branch
                                ? `Branch: ${repoStatus.branch} • Files: ${repoPaths.length}`
                                : null}
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search files..."
                        className="h-8 w-full sm:w-56 rounded-md border border-white/10 bg-black/40 px-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/25"
                    />

                    <Button
                        variant="outline"
                        className="h-8 border-white/15 bg-black/40 text-white hover:bg-white/10"
                        onClick={() => {
                            if (!selected || !code) return
                            navigator.clipboard?.writeText?.(code)
                        }}
                        disabled={!selected || !code}
                    >
                        Copy
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-4 md:col-span-3">
                        <div className="rounded-lg border border-white/10 bg-white/5">
                            <div className="px-3 py-2 text-xs text-white/50 border-b border-white/10">
                                Files
                            </div>

                            <div className="p-2 overflow-auto" style={{ height: paneHeight }}>
                                <div className="space-y-2">{tree.map((n) => renderNode(n, 0))}</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-span-8 md:col-span-9">
                        <div className="rounded-lg border border-white/10 overflow-hidden bg-white/5 backdrop-blur-md">
                            <div className="px-3 py-2 text-xs text-white/50 border-b border-white/10 flex items-center justify-between gap-2">
                                <div className="truncate">
                                    {selected || "No file selected"}
                                    {selectedSource?.kind === "github" ? (
                                        <span className="ml-2 text-[11px] opacity-70">(GitHub)</span>
                                    ) : null}
                                    {loading ? <span className="ml-2 text-[11px] opacity-70">Loading…</span> : null}
                                    {loadErr ? (
                                        <span className="ml-2 text-[11px] text-red-300">
                                            Failed to load ({String(loadErr)})
                                        </span>
                                    ) : null}
                                </div>

                                <span className="text-[11px]">{editorLang}</span>
                            </div>

                            <Editor
                                height={height}
                                value={
                                    loadErr
                                        ? `// Failed to load GitHub file\n// ${String(loadErr)}\n`
                                        : code
                                }
                                language={editorLang}
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
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
