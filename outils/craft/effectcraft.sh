C="/c/Program Files/EffectCraft/effectcraft-cli.exe"
ec(){ "$C" exec "$1" --params "$2" --bridge 47811 --json; echo; }
props(){ "$C" props "$1" "$2" --flat --bridge 47811; }
