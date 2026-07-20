#!/usr/bin/env python3
"""PreToolUse guardrail — enforces the zntx CLAUDE.md hard rules deterministically.

Reads the tool-call JSON on stdin. Exit 2 BLOCKS the call (stderr shown to the
model); any other exit allows it. Fails OPEN: on parse/logic error it allows the
call, so a bug here never bricks a session.

Modeled on /srv/ravepuls/.claude/hooks/guardrails.py (same server, proven
pattern) — trimmed to what's actually decided for zntx so far (architecture is
still open per CLAUDE.md). Add migration protection once zntx has its own
migration tool/directory.

Blocks:
  - git push --force / -f onto main or master
  - Read/Edit/Write touching .env*, secrets/**, ~/.ssh/**, ~/.aws/**
  - adding `ports:` to a docker-compose file (Caddy is the only allowed ingress)
  - rm -rf targeting paths outside the project
"""
import json
import os
import re
import sys

PROJECT_ROOT = "/srv/zntx"
COMPOSE_FILENAME_RE = re.compile(r"(^|/)(docker-)?compose\.ya?ml$", re.IGNORECASE)
# `ports:`-Policy korrigiert (Luis, 2026-07-20, siehe docs/plans/portfolio-aufbau.md
# "Wichtiger Fund"): die alte Blanko-Sperre widersprach der gelebten Praxis bei
# foodapp/ravepuls/matrix-chat (127.0.0.1-gebundene ports:, Caddy als Host-Service statt
# Container). Jetzt: `ports:`-Einträge erlaubt, aber NUR wenn an 127.0.0.1 gebunden —
# alles andere (0.0.0.0, bare Port ohne Host-Bind) bleibt geblockt.
PORT_ITEM_RE = re.compile(r'^-\s*["\']?([\w.]*:?\d{1,5}:\d{1,5}(?:/\w+)?)["\']?\s*$')


def find_unsafe_port_mappings(text: str) -> list[str]:
    unsafe = []
    for line in text.splitlines():
        m = PORT_ITEM_RE.match(line.strip())
        if m and not m.group(1).startswith("127.0.0.1:"):
            unsafe.append(m.group(1))
    return unsafe


def block(msg: str) -> None:
    sys.stderr.write("BLOCKED by guardrail: " + msg + "\n")
    sys.exit(2)


def main() -> None:
    raw = sys.stdin.read()
    data = json.loads(raw)
    tool = data.get("tool_name", "")
    ti = data.get("tool_input", {}) or {}

    # ── File-touching tools: protect secrets + block new `ports:` entries ──
    if tool in ("Read", "Edit", "Write", "NotebookEdit"):
        path = str(ti.get("file_path", ""))
        low = path.lower()
        # .env.example dokumentiert nur Key-Namen, nie echte Secrets — explizit
        # ausgenommen (Luis, 2026-07-20), analog zur Bash-Ausnahme in scope-guard.py.
        # Echte .env-Dateien bleiben vollständig gesperrt.
        is_env_example = low.endswith(".env.example")
        if not is_env_example and (
            re.search(r"(^|/)\.env($|[./])", low) or "/secrets/" in low
            or "/.ssh/" in low or "/.aws/" in low
        ):
            block(f"secret/credential file is off-limits: {path}")

        if tool in ("Edit", "Write") and COMPOSE_FILENAME_RE.search(low):
            if tool == "Edit":
                new = str(ti.get("new_string", ""))
                unsafe = find_unsafe_port_mappings(new)
            else:  # Write
                content = str(ti.get("content", ""))
                unsafe = find_unsafe_port_mappings(content)
            if unsafe:
                block(
                    "unsafe `ports:` entry (not bound to 127.0.0.1): "
                    f"{', '.join(unsafe)}. Nur 127.0.0.1:<host>:<container> ist erlaubt — "
                    "Caddy bleibt einziger öffentlicher Ingress."
                )
        return

    if tool == "Bash":
        cmd = str(ti.get("command", ""))
        for seg in re.split(r"&&|\|\||[;\n|]", cmd):
            s = seg.strip()
            s = re.sub(r"^(?:[A-Za-z_][A-Za-z0-9_]*=\S+\s+)*", "", s)
            if not s.startswith("git push") and not s.startswith("git  push"):
                continue
            if re.search(r"(--force\b|--force-with-lease\b|(^|\s)-f\b)", s) \
               and re.search(r"\b(main|master|HEAD)\b", s):
                block("git push --force onto main/master is forbidden")
        for seg in re.split(r"&&|\|\||[;\n|]", cmd):
            s = re.sub(r"^(?:[A-Za-z_][A-Za-z0-9_]*=\S+\s+)*", "", seg.strip())
            if not re.match(r"rm\s", s):
                continue
            if not re.search(r"\srm\s|^rm\s", " " + s):
                continue
            if not re.search(r"\s-[a-zA-Z]*r[a-zA-Z]*f|\s-[a-zA-Z]*f[a-zA-Z]*r|\s-rf\b|\s-fr\b", s):
                continue
            for m in re.findall(r"(/[^\s'\";|&]+)", s):
                norm = os.path.normpath(m)
                if not (norm == PROJECT_ROOT or norm.startswith(PROJECT_ROOT + "/") or norm.startswith("/tmp/")):
                    block(f"rm -rf outside the project: {m}")
        return


if __name__ == "__main__":
    try:
        main()
    except Exception:
        sys.exit(0)
