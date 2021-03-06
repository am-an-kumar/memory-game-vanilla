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
  returnCard: function returnCard(index) {
    return modal.cards[index];
  }
};

//////////////////////////////////////////////////////////////////////////

// Controller for the whole application...
const controller = {

  // list of already open indices...
  openIndices: [],

  // array to hold the index of currently open cards...
  openCards: [],

  // variable to keep track of total number of moves...
  moves: 0,

  // variable to keep track of time...
  time: 0,

  // id for setInterval,
  timerId: '',

  // counter of total number of cards solved...
  cardsSolved: 0,

  // storing the modal type...
  modalType: "",

  // function to start timer...
  startTimer: function startTimer(){

    controller.timerId = setInterval(function(){
      controlsView.setTime(++controller.time);
    },1000);
  },

  // function to start timer...
  stopTimer: function stopTimer(){
    clearInterval(controller.timerId);
  },

  // executes for the first card click and starts the timer...
  handleFirstClick: function handleFirstClick(event){
    if(event.target.nodeName == 'LI'){

      controller.startTimer();
      deckView.deck.removeEventListener('click', controller.handleFirstClick);
    }
  },

  // method to restart the game...
  handleRestart: function handleRestart() {
    // updating the modal message...
    modalView.updateMessage("Are you sure that you want to restart the game?");

    // making the modal visible...
    modalView.toggleModal();
  },

  // method to finish the game...
  gameOver: function gameOver() {
    // removing event listeners on li
    deckView.unbindClickHandler();

    // stopping the timer...
    controller.stopTimer();

    // updating the modal message...
    modalView.updateMessage(`You finished,rating ${controlsView.rating.childElementCount} star and time ${controller.time} seconds. Do you want to play a new game`);

    // making the modal visible...
    modalView.toggleModal();
  },

  // handles the case of right selection...
  openHandler: function openHandler() {
    // adding .card-right to both cards...
    controller.openCards[0].cardElement.classList.add("card-right");
    controller.openCards[1].cardElement.classList.add("card-right");

    // pushing index of cards to openIndices...
    controller.openIndices.push(Number(controller.openCards[0].cardElement.getAttribute('data-index')));

    controller.openIndices.push(Number(controller.openCards[1].cardElement.getAttribute('data-index')));

    setTimeout(function() {
      // removing .card-right from both cards...
      controller.openCards[0].cardElement.classList.remove("card-right");
      controller.openCards[1].cardElement.classList.remove("card-right");

      // flushing the controller.openCards...
      controller.openCards = [];

      // adding click listener to cards...
      deckView.bindClickHandler();

      // incrementing the move count and updating the UI...
      controlsView.setMoveCount(++controller.moves);

      // incremeting the cards solved count...
      controller.cardsSolved += 2;

      // checking if the game is over...
      if (controller.cardsSolved == 16) {
        controller.gameOver();
      }
    }, 400);
  },

  // handles the case of error in selection...
  closeHandler: function closeHandler() {
    // adding .card-wrong to both cards...
    controller.openCards[0].cardElement.classList.add("card-wrong");
    controller.openCards[1].cardElement.classList.add("card-wrong");

    setTimeout(function() {
      // removing the class .card-wrong from both the cards...
      controller.openCards[0].cardElement.classList.remove("card-wrong");
      controller.openCards[1].cardElement.classList.remove("card-wrong");

      // closing the cards as the cards do not match...
      deckView.close(controller.openCards[0]);
      deckView.close(controller.openCards[1]);

      // flushing controller.openCards...
      controller.openCards = [];

      // adding click listener to cards...
      deckView.bindClickHandler();

      // incrementing the move count and updating the UI...
      controlsView.setMoveCount(++controller.moves);
    }, 400);
  },

  init: function init() {
    // need to initialize the modal and shuffle the cards...
    modal.cards = modal.shuffle(modal.cards);

    // initializing the variables for controller object...
    controller.moves = 0;
    controller.openCards = [];
    controller.cardsSolved = 0;
    controller.time = 0;
    controller.openIndices = [];

    // initializing the controls view...
    controlsView.init();

    // need to initialize the view and render the deck...
    deckView.init();

    // setting the modal view and initializing the modalView...
    modalView.init();
  },

  // method for handling modal response...
  modalResponseHandler: function modalResponseHandler(event) {
    const btnText = event.target.textContent.toLowerCase();

    // in case of new game or restart, refereshing the board...
    if (btnText === "yes") {
      // removing the content of ul#deck and ul#rating before re-initializing the game...
      deckView.deck.innerHTML = "";
      controlsView.rating.innerHTML = "";
      controller.init();

      controller.stopTimer();
    }
    // hiding the modal...
    modalView.toggleModal();
  },

  // event handler for 'click' event on the cards
  handleCardClick: function handleCardClick(event) {

    // doing nothing for click on ul#deck
    if (event.target.nodeName === "UL") {
      return;
    }

    let cardElement;
    // if the i element was clicked...
    if(event.target.nodeName === 'I'){
      cardElement = event.target.parentElement;
    }
    else if(event.target.nodeName === 'LI'){
      cardElement = event.target;
    }

    // getting the index for card and then getting the card-name from the modal...
    const cardIndex = Number(cardElement.getAttribute("data-index"));
    const cardName = modal.returnCard(cardIndex);

    // if no card is open...
    if(controller.openCards.length === 0){
      // the clicked card should not be present in controller.openIndices
      if(controller.openIndices.indexOf(cardIndex) !== -1){
        return;
      }
    }

    // if one card is open...
    else if(controller.openCards.length === 1){
      // the clicked card should not already be open...
      if(controller.openCards[0].cardElement === cardElement){
        return;
      }
      else if(controller.openIndices.indexOf(cardIndex) !== -1){
        return;
      }

    } 

    // if control came here, then everything is OK...
    // so pushing the card to controller.openCards, and flipping it open using deckView.open();
    controller.openCards.push({
      cardElement: cardElement,
      cardName: cardName
    });
    deckView.open({ cardElement, cardName });

    // checking if it was the second selection...
    if (controller.openCards.length === 2) {
      // removing the handler from deck
      deckView.unbindClickHandler();

      // the 2 open cards are the same...
      if (
        controller.openCards[0].cardName === controller.openCards[1].cardName
      ) {
        controller.openHandler();
      }

      // 2 different cards are opened...
      else {
        controller.closeHandler();
      }
    }
  }
};

////////////////////////////////////////////////////////////////////////////

const modalView = {
  modalElement: "",
  modalContentMessageElement: "",
  modalYesButtonElement: "",
  modalNoButtonElement: "",
  modalButtonParentElement: "",

  init: function init() {
    // getting the reference to DOM elements...
    modalView.modalElement = document.querySelector("#modal");
    modalView.modalContentMessageElement = document.querySelector(
      "#modal-content-message"
    );
    modalView.modalYesButtonElement = document.querySelector("#yes-btn");
    modalView.modalNoButtonElement = document.querySelector("#no-btn");
    modalView.modalButtonParentElement =
      modalView.modalElement.firstElementChild.lastElementChild;

    // binding the handlers...
    modalView.modalButtonParentElement.addEventListener(
      "click",
      controller.modalResponseHandler
    );
  },

  // method to update the message of the modal...
  updateMessage: function updateMessage(message) {
    modalView.modalContentMessageElement.textContent = message;
  },

  // method to toggle the modal...
  toggleModal: function toggleModal() {
    modalView.modalElement.classList.toggle("modal-show");
  }
};

///////////////////////////////////////////////////////////////////////////

const controlsView = {
  // reference to the span element with move count...
  movesElement: "",
  rating: "",
  refresh: "",
  timer: '',

  // function to initialize the controls view...
  init: function init() {
    // calling render() to render the dynamic part of controlsView...
    controlsView.render();

    controlsView.movesElement = document.querySelector("#moves-count");
    controlsView.rating = document.querySelector("#rating");
    controlsView.restart = document.querySelector("#restart");
    controlsView.timer = document.querySelector('#timer');

    // adding click listener for restart button...
    controlsView.restart.addEventListener("click", controller.handleRestart);

    // so that on refresh the game board is reset...
    controlsView.setMoveCount(0);

    // resetting the timer
    controlsView.setTime('0');
  },

  // method to update the time
  setTime: function setTime(time){
    controlsView.timer.textContent = time;
  },

  // increments the UI for moves count by 1...
  setMoveCount: function setMoveCount(moves) {
    // making 2-star for 13th move, and 1-star for 19th move...
    switch (moves) {
      case 13:
      case 19:
        controlsView.rating.lastElementChild.remove();
    }

    controlsView.movesElement.textContent = moves;
  },

  // rendering the dynamic part of controls view, the rating part...
  render: function render() {
    const docFrag = document.createDocumentFragment();

    for (let i = 0; i < 3; i++) {
      // creating list items and adding starts to it...
      const listItem = document.createElement("li");
      listItem.classList = "star";
      const iElement = document.createElement("i");
      iElement.classList = "fa fa-star";
      listItem.appendChild(iElement);

      // adding the start to document fragment...
      docFrag.appendChild(listItem);
    }

    // adding the docFrag to ul#rating...
    document.querySelector("#rating").appendChild(docFrag);
  }
};

///////////////////////////////////////////////////////////////////////////

const deckView = {
  deck: "",

  // will bind handlers to #deck...
  bindClickHandler: function bindClickHandler() {
    deckView.deck.addEventListener("click", controller.handleCardClick);
  },

  // will unbind click handler from #deck
  unbindClickHandler: function unbindClickHandler() {
    deckView.deck.removeEventListener("click", controller.handleCardClick);
  },

  // function to open a card...
  open: function open({ cardElement, cardName }) {
    cardElement.firstElementChild.classList.add(cardName);
  },

  // function to close a card...
  close: function close({ cardElement, cardName }) {
    cardElement.firstElementChild.classList = "fa";
  },

  init: function() {
    // rendering the deckView
    deckView.render();

    // getting a reference to the ul#deck element
    deckView.deck = document.querySelector("#deck");

    // adding listeners to the deckView
    deckView.addListeners();
  },

  addListeners: function() {
    // adding listener to the ul which will catch all the click events on any of the cards...
    document
      .querySelector("#deck")
      .addEventListener("click", controller.handleCardClick);

    // checks for the first click to start timer...
    document
      .querySelector("#deck")
      .addEventListener("click", controller.handleFirstClick);

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
      listItem.setAttribute("data-index", i);
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

// loading the game board, once the page is loaded...
window.addEventListener("load", function() {
  controller.init();
});

/*
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
