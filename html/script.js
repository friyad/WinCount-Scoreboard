const matchesContainer = document.getElementById("matchesContainer");

const INCREMENT = "increment";
const DECREMENT = "decrement";
const ADD_MATCH_BTN = "addMatchBtn";
const RESET_SCORE_BOARD = "resetScoreboard";

// initial states. It will be appare in first time load
const initialState = [
  {
    id: 1,
    score: 0,
  },
];

// scoreboard reducer to write the business logics
function scoreboardReducer(state = initialState, action) {
  const updatedState = [...state];

  switch (action.type) {
    case ADD_MATCH_BTN:
      const newMatchState = {
        id: updatedState.length + 1,
        score: 0,
      };
      updatedState.push(newMatchState);
      return updatedState;

    case RESET_SCORE_BOARD:
      updatedState.forEach((st) => {
        st.score = 0;
      });
      return updatedState;

    case INCREMENT:
      updatedState.filter((st) => {
        if (st.id === action.payload.id) {
          st.score += action.payload.value;
        }
        return;
      });
      return updatedState;

    case DECREMENT:
      updatedState.filter((st) => {
        if (st.id === action.payload.id) {
          const score = st.score - action.payload.value;
          if (score >= 0) {
            st.score = score;
          } else {
            st.score = 0;
          }
        }
        return;
      });
      return updatedState;

    default:
      return updatedState;
  }
}

let store = Redux.createStore(scoreboardReducer);

// to update the scoreboard view when state will be change
const updateScoreboardView = () => {
  const states = store.getState();

  if (states && states.length > 0) {
    matchesContainer.innerHTML = "";

    states.forEach((match) => {
      const newMatch = `
        <div class="match">
          <div class="wrapper">
            <button class="lws-delete">
              <img src="./image/delete.svg" alt="" />
            </button>
            <h3 class="lws-matchName">Match ${match.id}</h3>
          </div>
          <div class="inc-dec">
            <form class="incrementForm">
              <h4>Increment</h4>
              <input type="number" name="increment-${match.id}" class="lws-increment" />
            </form>
            <form class="decrementForm">
              <h4>Decrement</h4>
              <input type="number" name="decrement-${match.id}" class="lws-decrement" />
            </form>
          </div>
          <div class="numbers">
            <h2 class="lws-singleResult">${match.score}</h2>
          </div>
        </div>
    `;
      matchesContainer.innerHTML += newMatch;
    });
  }
};

updateScoreboardView();
store.subscribe(updateScoreboardView);

// add a new match
document.getElementById("addMatchBtn").addEventListener("click", () => {
  store.dispatch({ type: ADD_MATCH_BTN });
});

// handle increment and decrement input form
const handleIncrDecrForm = () => {
  const allIncrementMatches = document.querySelectorAll(".incrementForm");
  const allDecrementMatches = document.querySelectorAll(".decrementForm");

  // increment action
  allIncrementMatches.forEach((matchForm) => {
    matchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const incrementInput = event.target.querySelector(".lws-increment");
      const InputID = incrementInput.name.split("-")[1];

      store.dispatch({
        type: INCREMENT,
        payload: {
          id: parseInt(InputID),
          value: parseInt(incrementInput.value),
        },
      });
    });
  });

  // decrement action
  allDecrementMatches.forEach((matchForm) => {
    matchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const decrementInput = event.target.querySelector(".lws-decrement");
      const InputID = decrementInput.name.split("-")[1];

      store.dispatch({
        type: DECREMENT,
        payload: {
          id: parseInt(InputID),
          value: parseInt(decrementInput.value),
        },
      });
    });
  });
};

handleIncrDecrForm();
store.subscribe(handleIncrDecrForm);

// reset scoreboard
document.getElementById("resetScoreboard").addEventListener("click", () => {
  store.dispatch({ type: RESET_SCORE_BOARD });
});
