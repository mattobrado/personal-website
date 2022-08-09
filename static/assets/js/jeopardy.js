let categories = [];

// constants
const NUM_CATEGORIES = 6; // number of categories
const NUM_QUESTIONS = 5;  // number of questions per category
const HIGHEST_CATEGORY_ID = 18430; // as of 06/03/22

const $body = $('#gameContainer'); // jQuery reference to game container
const $jeopardyContainer= $('#jeopardyContainer'); // jQuery reference to larger jeopary container

//Get NUM_CATEGORIES random category from API.
function getCategoryIds(numIds, highestId) {
  const ids = []; // declare empty array
  // loop unitl we get enough ids
  while (ids.length < numIds) {
    const randomId = Math.floor(Math.random() * highestId); // get random integer between 0-highestId
    if (ids.indexOf(randomId) === -1) ids.push(randomId); // make sure we havn't found that id yet
  }
  return ids;
}

// Return object with data about a category:
async function getCategory(catId) {
  const result = await axios.get(`http://jservice.io/api/category?id=${catId}`);
  const { title, clues: allClues } = result.data; // destructure data we want
                                                  // rename clues to allClues
                                                  // because we will return a variable
                                                  // named clues and we must do some processing 
                                                  // first
  let clues = []; // declare empty array

  // if we have <=5 clues return the clues
  // this prevents an infinite loop from happening later
  if (allClues.length <= 5) {
    clues = allClues; // set clues to allclues because we don't need to make changes
    return { title, clues };
  }

  // if we made it here, we have too many clues
  // we need to select NUM_QUESTIONS clues to keep

  // get random index of clues
  let randomIndex = Math.floor(Math.random() * allClues.length);

  // loop until we have the right number of clues
  while (clues.length < NUM_QUESTIONS) {
    const randomClue = allClues[randomIndex]; // get clue at randomIndex
    clues.push(randomClue); // push randomClue onto clues
    randomIndex++; // increment randomIndex;
    randomIndex = randomIndex % allClues.length; // if random idex went over the lenght of
                                                 // allClues, wrap around to the beginning 
                                                 // using % (mod)
  }

  // console.log({title, clues});
  return { title, clues };
}

// Fill the HTML table with the categories & cells for questions.
async function fillTable(categories) {
  const $jeopardy = $('<div id="jeopardy" class="table"></div>'); // make jeopardy board
  const $tableHead = $('<thead></thead>'); // make a table head
  const $categoryRow = $('<tr id="categoryRow"></tr>'); //make the categrory row (top row)

  // make cell for each category
  for (let categoryIndex = 0; categoryIndex < NUM_CATEGORIES; categoryIndex++) {
    const $categoryCell = $(`<th class="col-2 text-center text-primary" id=${categoryIndex}>${categories[categoryIndex].title}</th>`); // create category cell
    $categoryRow.append($categoryCell); // append to category row
  }

  $tableHead.append($categoryRow); // append category row to table head
  $jeopardy.append($tableHead); // append table head row to jeopardy board

  const $tableBody = $('<tbody></tbody>'); // make a table body

  // for each row of questions
  for (let questionIndex = 0; questionIndex < NUM_QUESTIONS; questionIndex++) {
    const $row = $('<tr scope="row"></tr>'); // create table row

    // for each category
    for (let categoryIndex = 0; categoryIndex < NUM_CATEGORIES; categoryIndex++) {
      const $cell = $(`<td class="text-center align-middle " data-category=${categoryIndex} data-question=${questionIndex}>?</tr>`); // create cell
      $cell.on('click', function (evt) { handleClick(evt) }); // add event listener for clicks
      $row.append($cell); // append cell to row
    }

    $tableBody.append($row); // append row to jeopardy board
  }

  $jeopardy.append($tableBody); // apead table body to jeopardy board
  $body.append($jeopardy); // append jeopardy board to body
}

// Handle clicking on a clue: show the question or answer.
function handleClick(evt) {

  const $clickedCell = $(evt.target); // get clicked cell

  const clickedCategoryIndex = $clickedCell.attr('data-category'); // get category index
  const clickedQuestionIndex = $clickedCell.attr('data-question'); //get question index

  const clickedCategory = categories[clickedCategoryIndex]; // get category using index
  const clickedQuestion = clickedCategory.clues[clickedQuestionIndex]; // get question

  //check if showing is null or undefined
  if (!clickedQuestion.showing) {

    const questionText = clickedQuestion.question // get question text
    console.log(questionText);
    $clickedCell.html(questionText); // set text to question text
    clickedQuestion.showing = 'question'; // set showing to 'question'
  }
  // check if showing question
  else if (clickedQuestion.showing === 'question') {

    const answerText = clickedQuestion.answer; // get answer text
    $clickedCell.html(answerText); // set text to answer text
    clickedQuestion.showing = 'answer'; // set showing to 'question'
  }
}

// Start game
async function setupAndStart() {
  const categoryIds = getCategoryIds(NUM_CATEGORIES, HIGHEST_CATEGORY_ID); // get category ids
  for (let categoryId of categoryIds) {
    // console.log(categoryId);
    const category = await getCategory(categoryId); // get category data
    categories.push(category);
  }
  // console.log(categories);
  fillTable(categories);
}

// On restart button, set up game.
setupAndStart(); // set up board

const $restartButton = $('<button class="btn btn-outline-danger float-end">Restart</button>'); // make restart button

// click handler for restart button
$restartButton.on('click', function () {

  // only restart if there is a board loaded ($('#jeopardy').length > 0)
  if ($('#jeopardy').length > 0) {

    $('#jeopardy').remove(); // remove old board
    categories = []; // reset categories object
    setupAndStart(); // set up new board
  }
});

$jeopardyContainer.append($restartButton); // add restart button to page