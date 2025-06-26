#!/usr/bin/env bash
# start.sh – spin up backend & frontend

ROOT="$(cd "$(dirname "$0")" && pwd)"

# start backend (port 3001) in the background
(cd "$ROOT/server" && npm run dev &)  
BACK_PID=$!

# give the API a moment
sleep 2

# start frontend (port 3000)
(cd "$ROOT/client" && npm run dev)

# when user hits Ctrl-C, kill backend too
kill $BACK_PID 2>/dev/null