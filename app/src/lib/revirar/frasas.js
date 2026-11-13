// Revirar : les phrases d'entraînement, vie de tous les jours (2026-11-13).
// { id, fr, oc, tema }. Le modèle `oc` est écrit en languedocien, norme
// classique, par Claude : il n'est PAS validé par Romain ; la page le passe mot
// à mot par lo Congrès au moment de l'afficher et marque ce qu'il ne confirme pas.
// Une phrase a souvent plusieurs traductions justes : le modèle n'est qu'un repère.
export const TEMAS = {
	ostal: 'À la maison',
	trabalh: 'Au travail',
	telefon: 'Au téléphone',
	corsas: 'Les courses',
	temps: 'Le temps qu’il fait',
	vida: 'Au quotidien'
};

export const FRASAS = [
	{ id: 'ostal-sopar', tema: 'ostal', fr: 'Je prépare le dîner.', oc: 'Prepari lo sopar.' },
	{ id: 'ostal-porta', tema: 'ostal', fr: 'La porte est fermée.', oc: 'La pòrta es barrada.' },
	{ id: 'ostal-fenestra', tema: 'ostal', fr: 'J’ouvre la fenêtre.', oc: 'Dobrissi la fenèstra.' },
	{ id: 'ostal-clau', tema: 'ostal', fr: 'Où est la clé ?', oc: 'Ont es la clau ?' },
	{ id: 'ostal-gat', tema: 'ostal', fr: 'Le chat dort sur la chaise.', oc: 'Lo gat dormís sus la cadièra.' },
	{ id: 'trabalh-ostal', tema: 'trabalh', fr: 'Aujourd’hui, je travaille à la maison.', oc: 'Uèi, trabalhi a l’ostal.' },
	{ id: 'trabalh-messatge', tema: 'trabalh', fr: 'Je dois envoyer un message.', oc: 'Devi mandar un messatge.' },
	{ id: 'telefon-ser', tema: 'telefon', fr: 'Je t’appelle ce soir.', oc: 'Te telefòni aqueste ser.' },
	{ id: 'telefon-tornar', tema: 'telefon', fr: 'Tu peux répéter, s’il te plaît ?', oc: 'Pòdes tornar dire, se te plai ?' },
	{ id: 'telefon-ausir', tema: 'telefon', fr: 'Je n’entends pas bien.', oc: 'Ausissi pas plan.' },
	{ id: 'telefon-deman', tema: 'telefon', fr: 'Peux-tu m’appeler demain ?', oc: 'Me pòdes sonar deman ?' },
	{ id: 'corsas-mercat', tema: 'corsas', fr: 'Je vais au marché.', oc: 'Vau al mercat.' },
	{ id: 'corsas-prec', tema: 'corsas', fr: 'Combien ça coûte ?', oc: 'Quant còsta aquò ?' },
	{ id: 'corsas-pan', tema: 'corsas', fr: 'Je voudrais du pain, s’il vous plaît.', oc: 'Volriái de pan, se vos plai.' },
	{ id: 'corsas-lach', tema: 'corsas', fr: 'Il me manque du lait.', oc: 'Me manca de lach.' },
	{ id: 'temps-polit', tema: 'temps', fr: 'Il fait beau aujourd’hui.', oc: 'Uèi fa polit.' },
	{ id: 'temps-plòu', tema: 'temps', fr: 'Il pleut depuis ce matin.', oc: 'Plòu dempuèi aqueste matin.' },
	{ id: 'temps-freg', tema: 'temps', fr: 'Il fait froid, mets ton manteau.', oc: 'Fa freg, met ton mantèl.' },
	{ id: 'temps-vent', tema: 'temps', fr: 'Demain, il fera chaud.', oc: 'Deman, farà caud.' },
	{ id: 'vida-fam', tema: 'vida', fr: 'J’ai faim.', oc: 'Ai fam.' },
	{ id: 'vida-miegjorn', tema: 'vida', fr: 'Nous mangeons à midi.', oc: 'Manjam a miègjorn.' },
	{ id: 'vida-fraire', tema: 'vida', fr: 'Mon frère habite à Toulouse.', oc: 'Mon fraire demòra a Tolosa.' },
	{ id: 'vida-enfants', tema: 'vida', fr: 'Les enfants jouent dans le jardin.', oc: 'Los mainats jògan dins lo jardin.' },
	{ id: 'vida-libre', tema: 'vida', fr: 'Je lis un livre.', oc: 'Legissi un libre.' }
];
