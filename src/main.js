import "./css/index.css";
import IMask from 'imask'; /*importando biblioteca de terceiros*

/* PRIMEIRA AULA */

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

/* SEGUNDA AULA */

// Sobre o IMask 

/* CVC Mask
Primeiro passo é pegar o elemento que preciso e colocar em uma variável!
O query selector serve também para pegar elementos por id, basta colocar o hash (#) e o nome do id. */

const securityCode = document.querySelector('#security-code');

// O segundo passo é criar a mascara que necessito

const securityCodePattern = {
  mask: "0000"
}

/* O terceiro passo é guardar as modificações de pattern em outra variável já mascarada */
const securityCodeMasked = IMask(securityCode, securityCodePattern);

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
  mask: "MM{/}YY",
  /* Regra para o IMask não aceitar meses errado e aceitar somente 10 anos de validade */
  blocks: {
    /* Regra para Meses*/
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    /* Regra para Anos */
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
  },
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

/* EXPRESSÕES REGULARES */

// Utilizaremos o Dynamic Mask para agrupar diversas mascaras.

// ^4/d{0,15} Visa Regex
// /^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/ Mastercard Regex

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = {
  mask: [
    /* O dynamicMasked sempre vai ser os objetos das mascaras. No caso 
      temos 3 propriedades, a mascara, a expressão regular e o tipo de
       cartão.*/
    {
      mask: '0000 0000 0000 0000',
      regex: /^4\d{0,15}/,
      cardType: 'visa'
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: 'mastercard'
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],

  /* DISPATCH serve para disparar a função toda vez que eu digitar algo*/

  dispatch: function (appended, dynamicMasked) {

    /* Aqui, o dynamicMasked começa com nada, depois vai concatenando 
    tudo o que não for PALAVRA (regra passada pelo regex) */

    const number = (dynamicMasked.value + appended).replace(/\D/g, '');

    /* Encontrando a mascara a partir do REGEX. Aqui precisamos 
    utilizarmos o find para buscar a propriedade e o match para caso o 
    o find encontre a expressão regular ele retorne todo o objeto. 
    O com*/

    const foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex);
    })
    return foundMask;
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

/* AULA 03
Trabalhando com Eventos! 
addEventListener -> fica "escutando" o evento ser chamado. A
função abaixo (do click) é anonima, pois ela não possui um nome 
definido. */

const addButton = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
  alert("Cartão cadastrado com sucesso!");
});

/* Editando padrões de comportamentos do botão 
Na função abaixo, ela previne que o submit recarregue a página
*/

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
})

// Capturando informações do nome para transferir para o cartão 

const cartHolder = document.querySelector("#card-holder");
cartHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");

  // Lógica para ver se o nome do cartão está vazio.
  ccHolder.innerText = cartHolder.value.length === 0 ? "NOME IMPRESSO NO CARTÃO" : cartHolder.value;
});

// Capturando informações do CVC para transferir para o cartão

/* Para observar os inputs do IMask, utilizamos o .on (mesma
lógica do addEventListener). O valor accept é quando o valor 
digitado satisfaz as regras pre-estabelecidas nas mascaras.*/

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value);
});

function updateSecurityCode(code) {
  const ccSecurity = document.querySelector(".cc-security .value");

  ccSecurity.innerText = code.length === 0 ? "123" : code;
}

//  Capturando informações do número do cartão para transferir para o cartão

cardNumberMasked.on("accept", () => {
  // Mudando o tema e bandeira do cartão
  const cardType = cardNumberMasked.masked.currentMask.cardType
  setCardType(cardType);
  //atualizando campo de número do cartão
  updateCardNumber(cardNumberMasked.value);
})

function updateCardNumber(number) {
  const ccNumber = document.querySelector(".cc-number");
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;
}

//  Capturando informações da data de expiração para transferir para o cartão

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
  const ccExpiration = document.querySelector(".cc-extra .value");
  ccExpiration.innerText = date.length === 0 ? "01/32" : date;
}