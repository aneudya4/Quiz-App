let { currentQuestion, questions, totalScore } = STORE;
// GLOBAL VARIABLES FOR THE STORE OBJECT

function handleQuiz() {
  startQuiz();
  reStartQuiz();
}

function startQuiz() {
  $('.start-quiz button').on('click', function (evnt) {
    $(this).parent().hide();
    renderNewQuestion();
    updateCurrentQuestion();
    checkAnswer();
  });
}

function renderNewQuestion() {
  const formHtml = `<form>  
    <h2 class='score'>Score: <span>0</span></h2>
   <fieldset> 
   <ul>
   </ul>
   </fieldset>
   <button type="submit"  class='submit'>Submit</button>
   <button  type="button" class='next hide-btn'> Next</button>
   </form>`;

  const questionsContainer = ` 
  <div class="questions-container">
<h2>Quention ${currentQuestion + 1} of ${questions.length}</h2>
 <p> ${questions[currentQuestion].question}
<span>?</span>
</p>
  </div>
 `;

  $('.quiz-container').html(questionsContainer);
  $('.quiz-container').append(formHtml);
  renderAnswers(questions[currentQuestion].options);
  updateScoreUi();
  $('button.next').hide();
}

function renderAnswers(options) {
  options = options.sort((a, b) => a.length - b.length);
  options.forEach((option, idx) => {
    $('ul').append(
      ` <li id="${idx}">
        <label tabindex=${idx}>
          <input  type="radio" name="answers" value="${option}" />
          ${option}
        </label>
      </li>`
    );
  });
}

function checkAnswer() {
  $('.quiz-container').on('submit', function (e) {
    e.preventDefault();
    $('button.next').show();
    $('button.submit').hide();

    const userInput = $('input:checked');
    if (!userInput.val()) {
      alert('Must select one option');
      return;
    }

    const isUserCorrect = userInput.val() === questions[currentQuestion].answer;

    if (isUserCorrect) {
      $(userInput).closest('li').addClass('correct_answer');
      $(userInput)
        .closest('li')
        .prepend('<i class="fas fa-check-circle"> </i>');
      totalScore += 1;
      updateScoreUi();
    } else {
      const id = findCorrectAnswerIndex();
      $(userInput).closest('li').addClass('wrong_answer');
      $(userInput)
        .closest('li')
        .prepend('<i class="fas fa-times-circle"> </i>');

      $('input[type=radio]').attr('disabled', true);
      $(`#${id}`).addClass('correct_answer');
    }
  });
}

function findCorrectAnswerIndex() {
  return questions[currentQuestion].options.indexOf(
    questions[currentQuestion].answer
  );
}

function updateCurrentQuestion() {
  $('.quiz-container').on('click', '.next', (event) => {
    currentQuestion += 1;
    currentQuestion === questions.length
      ? displayFinalResults()
      : renderNewQuestion();
  });
}

function updateScoreUi() {
  $('.score span').text(totalScore);
}

function displayFinalResults() {
  $('.quiz-container').hide();
  $('.final-results span').text(totalScore);
  $('.final-results').removeClass('hide-final-results');
}

function reStartQuiz() {
  $('.restart').on('click', function (evnt) {
    currentQuestion = 0;
    totalScore = 0;
    renderNewQuestion();
    $('.quiz-container').show();
    $('.final-results').addClass('hide-final-results');
  });
}
$(handleQuiz);
