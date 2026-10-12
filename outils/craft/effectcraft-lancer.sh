# Exécute un lot « id<TAB>json » sur la fenêtre EffectCraft pilotée ; affiche les erreurs.
. "$(dirname "$0")/effectcraft.sh"
n=0; e=0
while IFS=$'\t' read -r id js; do
  out=$("$C" exec "$id" --params "$js" --bridge 47811 --json 2>&1); n=$((n+1))
  if echo "$out" | grep -qiE '"error"|error:'; then e=$((e+1)); echo "ERREUR [$id] $js"; echo "   -> $(echo "$out" | head -c 250)"; fi
done < "$1"
echo "$n commandes, $e erreurs"
