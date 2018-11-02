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

//////////////////////////////////////////////////////////////////////////////

// Controller for the whole application...
const controller = {
  // array to hold the index of currently open cards...
  openCards: [],

  // handles the case of right selection...
  openHandler: function openHandler() {
    // adding .card-right to both cards...
    controller.openCards[0].cardElement.classList.add("card-right");
    controller.openCards[1].cardElement.classList.add("card-right");

    setTimeout(function() {
      // removing .card-right from both cards...
      controller.openCards[0].cardElement.classList.remove("card-right");
      controller.openCards[1].cardElement.classList.remove("card-right");

      // flushing the controller.openCards...
      controller.openCards = [];

      // adding click listener to cards...
      deckView.bindClickHandler();

    }, 800);
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
    }, 800);
  },

  init: function init() {
    // need to initialize the modal and shuffle the cards...
    modal.cards = modal.shuffle(modal.cards);
    // need to initialize the view and render the deck...
    deckView.init();
  },

  // event handler for 'click' event on the cards
  handleCardClick: function handleCardClick(event) {
    // getting the index for card and then getting the card-name from the modal...
    const cardElement = event.target;
    const cardIndex = Number(cardElement.getAttribute("data-index"));
    const cardName = modal.returnCard(cardIndex);

    // handle for case if the same card is clicked twice...
    if (
      controller.openCards.length == 1 &&
      controller.openCards[0].cardElement === cardElement
    ) {
      return;
    }

    // the card is not already open, so pushing it to openCards[] and opening it in the UI...
    controller.openCards.push({
      cardElement: event.target,
      cardName: cardName
    });
    deckView.open({ cardElement, cardName });

    // checking if it was the second selection...
    if (controller.openCards.length === 2) {

      // removing the handler from deck
      deckView.unbindClickHandler();

      // the 2 open cards are the same...
      if (
        controller.openCards[0].cardName ===
         controller.openCards[1].cardName
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

////////////////////////////////////////////////////////////////////////////////////////

const headerView = {};

const controlsView = {};

const deckView = {

  deck: document.querySelector('#deck'),

  // will bind handlers to #deck...
  bindClickHandler: function bindClickHandler() {
    deckView.deck.addEventListener('click', controller.handleCardClick);
  },

  // will unbind click handler from #deck
  unbindClickHandler: function unbindClickHandler() {
    deckView.deck.removeEventListener('click', controller.handleCardClick);
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

    // adding listeners to the deckView
    deckView.addListeners();
  },

  addListeners: function() {
    // adding listener to the ul which will catch all the click events on any of the cards...
    document
      .querySelector("#deck")
      .addEventListener("click", controller.handleCardClick);
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
