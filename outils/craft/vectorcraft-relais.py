# Relais MCP vers la fenêtre VectorCraft lancée avec --control 7979.
# Usage : py outils/craft/vectorcraft-relais.py list                      -> noms des outils
#         py outils/craft/vectorcraft-relais.py desc OUTIL                -> schéma d'un outil
#         py outils/craft/vectorcraft-relais.py call OUTIL '{json}'       -> appelle un outil
#         py outils/craft/vectorcraft-relais.py batch fichier.jsonl       -> une ligne {"tool":..,"args":{..}} par appel
import json, subprocess, sys
sys.stdout.reconfigure(encoding="utf-8")

CLI = r"C:\Program Files\VectorCraft\vectorcraft-cli.exe"
p = subprocess.Popen([CLI, "mcp", "--connect", "127.0.0.1:7979"], stdin=subprocess.PIPE,
                     stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True, encoding="utf-8")
n = 0

def rpc(method, params=None, notify=False):
    global n
    msg = {"jsonrpc": "2.0", "method": method}
    if params is not None:
        msg["params"] = params
    if not notify:
        n += 1
        msg["id"] = n
    p.stdin.write(json.dumps(msg) + "\n")
    p.stdin.flush()
    if notify:
        return None
    while True:
        line = p.stdout.readline()
        if not line:
            raise SystemExit("connexion fermée")
        r = json.loads(line)
        if r.get("id") == n:
            return r

rpc("initialize", {"protocolVersion": "2025-06-18", "capabilities": {},
                   "clientInfo": {"name": "claude-relais", "version": "1"}})
rpc("notifications/initialized", notify=True)

def call(tool, args):
    r = rpc("tools/call", {"name": tool, "arguments": args})
    if "error" in r:
        return "ERREUR " + json.dumps(r["error"], ensure_ascii=False)
    res = r["result"]
    txt = " ".join(c.get("text", "") for c in res.get("content", []) if c.get("type") == "text")
    return ("ERREUR " if res.get("isError") else "") + txt

mode = sys.argv[1]
if mode == "list":
    tools = rpc("tools/list")["result"]["tools"]
    for t in tools:
        print(t["name"], "-", (t.get("description") or "")[:110].replace("\n", " "))
elif mode == "desc":
    tools = rpc("tools/list")["result"]["tools"]
    for t in tools:
        if t["name"] == sys.argv[2]:
            print(t.get("description"))
            print(json.dumps(t.get("inputSchema"), ensure_ascii=False)[:3000])
elif mode == "call":
    print(call(sys.argv[2], json.loads(sys.argv[3]) if len(sys.argv) > 3 else {})[:4000])
elif mode == "batch":
    for line in open(sys.argv[2], encoding="utf-8"):
        if line.strip():
            c = json.loads(line)
            out = call(c["tool"], c.get("args", {}))
            print(c["tool"], "->", out[:300])
p.stdin.close()
p.terminate()
