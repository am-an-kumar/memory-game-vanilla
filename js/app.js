// modal for the application...
const modal = {
  // array that stores the cards for the deck, they will be shuffled, so the order in here does not matter...
  cards: [
    "fa-diamond",
    "fa-diamond",
    "fa-paper-plane-o",
    "fa-paper-plane-o",
    "fa-anchor",
    "fa-anchor",
    "fa-bolt",
    "fa-bolt",
    "fa-cube",
    "fa-cube",
    "fa-leaf",
    "fa-leaf",
    "fa-bicycle",
    "fa-bicycle",
    "fa-bomb",
    "fa-bomb"
  ],

  // method to shuffle the cards array...
  shuffle: function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },

  // method that returns a particular card based on card index...
  returnCard: function returnCard(index){
    return modal.cards[index];
  }


};


// Controller for the whole application...
const controller = {

  // array to hold the index of currently open cards...
  openCards: [],

  init: function init() {
    // need to initialize the modal and shuffle the cards...
    modal.cards = modal.shuffle(modal.cards);
    // need to initialize the view and render the deck...
    deckView.init();
  },

  // event handler for 'click' event on the cards
  handleCardClick: function handleCardClick(event){

    // getting the index for card and then getting the card-name from the modal...
    const cardIndex = Number(event.target.getAttribute('data-index'));
    const cardName = modal.returnCard(cardIndex);

    // returning the control if the card is already open...


    // the card is not already open, so pushing it to openCards[] and opening it in the UI...
    controller.openCards.push({element: event.target, cardName: cardName});
    // the openCards[] will be an array of objects with 2 properties, the cardElement and the cardName


    
    // if it is the second card that is opened, checking if the 2 cards match, and is so, leave the cards open...

    // if not, invoke deckView.close() on both the cards...

    // and in any case, flush the openCards object...


  }



};

const headerView = {};

const controlsView = {};

const deckView = {


  open: function open(cardElement, cardName){  
    // adding cardName as a class to the i element
    cardElement.firstElementChild.classList.add(cardName);
  },

  close: function close(cardElement, cardName){
    cardElement.firstElementChild.classList = 'fa';
  },

  init: function(){
    // rendering the deckView
    deckView.render();

    // adding listeners to the deckView
    deckView.addListeners();
  },


  addListeners: function(){

    // adding listener to the ul which will catch all the click events on any of the cards...
    document.querySelector('#deck').addEventListener('click', controller.handleCardClick);

  },


  render: function() {
    // creating a document fragment
    const docFrag = document.createDocumentFragment();

    // looping to create 16 cards, later this will depend on what level the user has selected...
    for (let i = 0; i < 16; i++) {
      // creating a list item and adding the .card class to it...
      const listItem = document.createElement("li");
      listItem.classList.add("card");

      // adding the 'data-index' attribute to every list item
      listItem.setAttribute('data-index', i);
      // we will later use node.getAttribute() api to get the value of index...

      // creating an i tag and adding class .fa to it...
      const iElement = document.createElement("i");
      iElement.classList.add("fa");

      // adding the i element to the list item...
      listItem.appendChild(iElement);

      // adding the list item to the document fragment...
      docFrag.appendChild(listItem);
    }

    // adding the docFrag to the unordered list
    document.querySelector("#deck").appendChild(docFrag);
  }
};

window.addEventListener("load", function() {
  controller.init();
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
