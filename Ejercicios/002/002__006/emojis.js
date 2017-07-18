var emojis = {
	felices : ["😺","😃","😄","😁","😆","🙂","😉","😛","🤗","🤓","😎"],
	asustados : ["🙀","😱","😨","😫","😩","😬","😧","😦","😳","😯","😵"],
	molestos : ["😾","😟","😕","🙁","😤","😠","😡","😐","🤔","🤕","😢"],
	encendido : "💥",
	fuego : "🔥",
	arbol : "🌲",
	sensor : "🎄",
	fumador : {
        feliz: "😈",
        asustado: "😈",
        molesto: "👿"
	},
	colilla : "🚬",
	rayo : "⚡",
	bombero : "🚒"
};
function getEmojisPersonaAleatorio() {
    var indice = Math.floor(Math.random() * emojis.felices.length);
    return {
        feliz: emojis.felices[indice],
        asustado: emojis.asustados[indice],
        molesto: emojis.molestos[indice]
    };
}