var emojis = {
	felices : ["😺","😃","😄","😁","😆","🙂","😉","😛","🤗","🤓","😎"],
	asustados : ["🙀","😱","😨","😫","😩","😬","😧","😦","😳","😯","😵"],
	molestos : ["😾","😟","😕","🙁","😤","😠","😡","😐","🤔","🤕","😢"],
	fuego : "🔥",
	arbol : "🌲",
	fumador : {
        feliz: "😈",
        asustado: "😈",
        molesto: "👿"
	},
	colilla : "🚬"
};
function getEmojisPersonaAleatorio() {
    var indice = Math.floor(Math.random() * emojis.felices.length);
    return {
        feliz: emojis.felices[indice],
        asustado: emojis.asustados[indice],
        molesto: emojis.molestos[indice]
    };
}