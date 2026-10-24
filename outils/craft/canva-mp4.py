# Passerelle EffectCraft → Canva (Romain, 24-10 : « il faut trouver un moyen de
# pouvoir transférer de manière facile d'un logiciel à l'autre »). Canva refuse
# les MP4 d'EffectCraft (« format non pris en charge ») : son encodeur maison
# (filmcraft-h264enc 0.1.1) écrit un fichier lisible mais inhabituel (base de
# temps 30, index en fin de fichier, pas de piste son). On part donc des images
# PNG exportées par EffectCraft, sans perte, et on fabrique des MP4 comme ceux
# que Canva exporte lui-même : H.264 x264, 4:2:0, BT.709, index en tête, piste
# son muette. Une vidéo par page, découpée à l'image près.
# Prérequis : py -m pip install --user imageio-ffmpeg (un ffmpeg autonome).
# py canva-mp4.py <dossier des PNG f_00000.png…> <sortie, ex. …/oplo-v2-pagina-{n}.mp4> 0-4,4-9.6,…  [ips=30]
import subprocess, sys
from pathlib import Path
import imageio_ffmpeg

FF = imageio_ffmpeg.get_ffmpeg_exe()
PNG, SORTIE, DECOUPE = Path(sys.argv[1]), sys.argv[2], sys.argv[3]
IPS = int(sys.argv[4]) if len(sys.argv) > 4 else 30

for n, seg in enumerate(DECOUPE.split(","), 1):
    t0, t1 = (float(v) for v in seg.split("-"))
    debut, nombre = round(t0 * IPS), round((t1 - t0) * IPS)
    sortie = SORTIE.format(n=n)
    subprocess.run([
        FF, "-y", "-v", "error",
        "-framerate", str(IPS), "-start_number", str(debut), "-i", str(PNG / "f_%05d.png"),
        "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
        "-frames:v", str(nombre), "-shortest",
        # couleurs : RGB → YUV avec la matrice BT.709, celle que les lecteurs supposent en HD
        "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
        "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-tune", "animation", "-crf", "18",
        "-x264-params", "colorprim=bt709:transfer=bt709:colormatrix=bt709",
        "-c:a", "aac", "-b:a", "32k",
        "-movflags", "+faststart", sortie], check=True)
    print(sortie, f"{t0}-{t1} s", f"{Path(sortie).stat().st_size / 1e6:.2f} Mo")
