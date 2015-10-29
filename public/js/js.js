
var isGameFinished = false,
isQuestionShown = false,
hasBuzzerPlayed = false,
wrongCount = 0;
qNum = 0,
displayQuestions = questions.keys(),
currentQuestion = null,
currentAnswers = null,
currentScores = null;

setQuestion = function(num) {
  if(num >= questions.size) {
    // end game
    $('#question p').text('THANK YOU FOR PLAYING!!');
    isGameFinished = true;
    return;
  }
  currentQuestion = displayQuestions.next().value;
  currentAnswers = questions.get(currentQuestion);
  currentScores = scores.get(currentQuestion);
  $('#question p').text(currentQuestion);
};

showNextQuestion = function() {
  setQuestion(qNum);
  qNum++;
  rotateHide($('#question img'));
  rotateShow($('#question p'));
  isQuestionShown = true;
};

rotateHide = function(el) {
  if($(el).attr('data-isShown') === 'false') {return;}
  $(el).attr('data-isShown', 'false');
  $(el)
  .css({'rotateX': '0deg'})
  .transition({
    rotateX: '90deg'
  });
};

rotateShow = function(el) {
  if($(el).attr('data-isShown') === 'true') {return;}
  $(el).attr('data-isShown', 'true');
  $(el)
  .css({'rotateX': '90deg'})
  .transition({
    rotateX: '0deg'
  });
};

resetBoard = function() {
  rotateShow($('#question img'));
  rotateHide($('#question p'));
  resetAnswers();
  isQuestionShown = false;
};

resetAnswers = function() {
  $('.answer-text').each(function(idx, el) {
    rotateHide(el);
  });
  $('.answer-score').each(function(idx, el) {
    rotateHide(el);
  });
};

wrongAnswerAction = function() {
  if(hasBuzzerPlayed) {return;}
  $('#x-buzzer')[0].play();

  if(wrongCount == 0) {
    $("#wrong").dialog({
      modal: true,
      open: function(event, ui){
       setTimeout("$('#wrong').dialog('close')",3000);
      }
    });
    wrongCount++;
  }
  else if(wrongCount == 1) {
    $("#wrong2").dialog({
      modal: true,
      open: function(event, ui){
       setTimeout("$('#wrong2').dialog('close')",3000);
      }
    });
    wrongCount++;
  }
  else {
    $("#wrong3").dialog({
      modal: true,
      open: function(event, ui){
       setTimeout("$('#wrong3').dialog('close')",3000);
      }
    });
    wrongCount = 0;
  }
  hasBuzzerPlayed = true;
};

keyDownHandler = function(evt) {
  if(evt.keyCode === 39) { // right
    $('#question').click();
  }
  else if(evt.keyCode >= 49 && evt.keyCode <= 54) { // 1 - 6
    $('#answer' + (evt.keyCode - 48)).click();
  }
  else if(evt.keyCode === 37) { // left (back)
    if(isQuestionShown) {
      qNum -= 2; if(qNum < 0) {qNum = 0;}
      resetAnswers();
      setQuestion(qNum);
      qNum++;
    }
    else {
      qNum -= 1; if(qNum < 0) {qNum = 0; return;}
      showNextQuestion();
    }
    isGameFinished = false;
  }
  else if(evt.keyCode === 88) { // X
    wrongAnswerAction()
  }
};

keyUpHandler = function(evt) {
  if(evt.keyCode === 88) { // X
    hasBuzzerPlayed = false;
  }
};

checkAnswer = function() {
  if(currentQuestion === null) {return;}
  var answer = $('#answerAttempt')[0].value;
  console.log("Answer: " + answer)
  var indexOfAnswer = null;
  $.each(currentAnswers, function(index, value) {
    if (value.indexOf(answer) > -1) {
      indexOfAnswer = index;
      return;
    }
  });
  if (indexOfAnswer == null) {
    wrongAnswerAction();
    setTimeout(function() {
        hasBuzzerPlayed = false;
    }, 2000);
    return;
  }

  console.log("Index: " + indexOfAnswer)

    var panel = $(document).find('#answers').find('#answer'+ (indexOfAnswer+1));
    var answerElement = panel.find('.answer-text')[0];
    if($(answerElement).attr('data-isShown') === 'true') {return;}
    var scoreElement = panel.find('.answer-score')[0];

    console.log("Answer Element: " + answerElement)
    console.log("Score Element: " + scoreElement)
    console.log("Index after: " + indexOfAnswer)

    var bell = $('#bell-ding')[0];
    bell.currentTime = 0;
    bell.play();

    $(answerElement).text(currentAnswers[indexOfAnswer]);
    $(scoreElement).text('' + currentScores[indexOfAnswer])
    rotateShow(answerElement);
    rotateShow(scoreElement);
  console.log(answer);
};


$(document).ready(function(){

  $(document).on('keydown', keyDownHandler);
  $(document).on('keyup', keyUpHandler);

  $('#question').click(function(){
    if(isGameFinished) {return;}
    if(isQuestionShown) {
      resetBoard();
    } else {
      $('#blip')[0].play();
      showNextQuestion();
    }
  });

  $('.answer').click(function(){
    if(!isQuestionShown || isGameFinished) {return;}
    var answerTxt = $(this).find('.answer-text')[0];
    if($(answerTxt).attr('data-isShown') === 'true') {return;}
    var answerVal = $(this).find('.answer-score')[0];
    var id = $(this).attr('id');
    var num = parseInt(id.charAt(id.length-1));

    var bell = $('#bell-ding')[0];
    bell.currentTime = 0;
    bell.play();

    $(answerTxt).text(currentAnswers[num-1]);
    var score = scores.get(currentQuestion)[num-1];
    var valString = '' + score;
    $(answerVal).text(valString);

    rotateShow(answerTxt);
    rotateShow(answerVal);
  });

});
