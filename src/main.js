import "./css/index.css"

/* Mudando cor do card com DOM
  O g > pega o primeiro nível de g do html (linha 43 nesse caso)
  O g:nth acessa os filhos do elemento g. */

const ccBgColor01 = document.querySelector(".cc-bg svg g > g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg g > g:nth-child(2) path");

/* Mudando SVGs dos cartões com a DOM
   Mesmo esquema do nível g (linha index.html 107). */

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

// Atribuindo cores as SVGs com o JS.

function setCardType(type) {

  // Estrutura de dados para Cores!

  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  /* Setando cores na qual [0] é a primeira cor e [1] é a segunda cor. O acesso aqui é feito com auxilio de função onde a variável "type" recebe o tipo de cartão a ser modificado. */

  ccBgColor01.setAttribute("fill", colors[type][0]);
  ccBgColor02.setAttribute("fill", colors[type][1]);

  /* Setando dinamicamente as bandeiras de acordo com o type do cartão, observe que na pasta public todas as imagens começam com o nome cc- então utilizamos essa manha para alterar a bandeira conforme o tipo de cartão for modificado. */

  ccLogo.setAttribute("src", `cc-${type}.svg`);
}

/* Testando o set de cores (invocando função)
    setCardType("visa");
    setCardType("mastercard");
    setCardType("default");
*/

/* Colocando nossa função em modo global (window) */
globalThis.setCardType = setCardType;
