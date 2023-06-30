const sentenceP = document.getElementById('sentence-p');
const startButton = document.getElementById('start');
const mistakesDiv = document.getElementById('mistakes-div');
const wpmDiv = document.getElementById('wpm');
startButton.addEventListener('click', startInterval);
const clockCont = document.getElementById('clock-container');

let checkResultFunc;
let usedSentences = [];
let mistakes;
let correctKeyStrokes;
let wpm=0;
let clock = document.getElementById('clock');
let count;
let countInitial;
let intervalID;

// Total Number of Words = Total Keys Pressed / 5
// WPM = Total Number of Words / Time Elapsed in Minutes (rounded down)


const sentenceArray = [
    'His thought process was on so many levels that he gave himself a phobia of heights.',
    'He was the only member of the club who didn\'t like plum pudding.',
    'Her fragrance of choice was fresh garlic.',
    'The gruff old man sat in the back of the bait shop grumbling to himself as he scooped out a handful of worms.',
    'Baby wipes are made of chocolate stardust.',
    'All she wanted was the answer, but she had no idea how much she would hate it.',
    'He found his art never progressed when he literally used his sweat and tears.',
    'The estate agent quickly marked out his territory on the dance floor.',
    'For oil spots on the floor, nothing beats parking a motorbike in the lounge.',
    'The best part of marriage is animal crackers with peanut butter.'
]

function getRandomSentence(){

    let randomSentInd;
    checkResultFunc = undefined;
    let unique=false;
    sentenceP.innerHTML = '';
    
    while(unique === false){
        randSentInd = Math.floor(Math.random()*sentenceArray.length);
        if(usedSentences.includes(randSentInd)){
            done = false;
        } else {
            usedSentences.push(randSentInd);
            unique = true;
        }
    }

    splitSentToSpan(sentenceArray[randSentInd]);
    words(sentenceArray[randSentInd]);
}



function renderSentence(characters){

    characters.forEach((char)=>{
       let insertChar = document.createElement('span');
       insertChar.textContent = char;
       sentenceP.appendChild(insertChar);
    });

}

function words(words){

}


function splitSentToSpan(sent){
   let splitSent = sent.split('');
   renderSentence(splitSent);
}


function checkResultFirst(letter){

    let spans = document.querySelectorAll('span');
    let spanInd = 0;

    function checkResult(newLetter){
        if(spanInd === spanInd.length-1){
            return
        }

        if(spans[spanInd].textContent === newLetter){
            if(spanInd === spans.length-1){
                spanInd++;
                return [spans[spanInd-1], false, true];
            } else {
                spanInd++;
                return [spans[spanInd-1], true, false];
            }
        } else {
            return [spans[spanInd], false, false];
        }
    }

    let firstResult = checkResult(letter);
    
    return {func: checkResult, firstRun : firstResult};
}

function renderConsequences(resultArr){
    let condition = resultArr[1];
    let targetSpan = resultArr[0];
    let red = 'rgb(255, 135, 135)';

    if(condition){
        targetSpan.style.color = 'rgb(122, 255, 122)';
        targetSpan.style.borderStyle = 'none';
        targetSpan.style.backgroundColor = 'transparent';
        correctKeyStrokes++;
    } else {
        if(targetSpan.textContent === ' '){
            targetSpan.style.backgroundColor = red;
        }
        mistakes++;
        targetSpan.style.borderBottom = red;
        targetSpan.style.color = red;
    }

    let accuracy = ((correctKeyStrokes/(correctKeyStrokes + mistakes))*100).toFixed(0);
    accuracy <= 0 ? mistakesDiv.textContent = '0%' : mistakesDiv.textContent = `${accuracy}%`;

    let totalWords = correctKeyStrokes/5;
    let timeElapsedInMin = ((countInitial-count)/60);
    wpm = (totalWords/timeElapsedInMin).toFixed(1);

    wpm < 1 || typeof wpm === 'NaN' ? wpmDiv.textContent = 0 : wpmDiv.textContent = wpm;

}

function checkAndUpdate(e){
    
        let result;
    
        if(checkResultFunc === undefined){
            let tempObj = checkResultFirst(e.key);
            checkResultFunc = tempObj.func;
            result = tempObj.firstRun;
            renderConsequences(result);
        } else {
            result = checkResultFunc(e.key);
            renderConsequences(result);
            //if sentence is done
            if(result[2]){
                getRandomSentence();
            }
        }
}



//CLOCK TIMER STUFF


function displayClock (){
    clock.innerHTML = count;
    clockCont.style.background = `conic-gradient(rgb(152, 250, 255) ${100-((count/countInitial)*100)}%, white 0 )`
    count--;
    let totalWords = correctKeyStrokes/5;
    let timeElapsedInMin = ((countInitial-count)/60);
    wpm = (totalWords/timeElapsedInMin).toFixed(1);

    wpm < 1 || typeof wpm === 'NaN' ? wpmDiv.textContent = 0 : wpmDiv.textContent = wpm;

    if(count<0){
        clearInterval(intervalID);
        document.removeEventListener('keypress', checkAndUpdate)
        startButton.textContent = 'Try Again';
        startButton.removeAttribute('disabled');
        startButton.classList.remove('disabled');
    }
}

function startInterval(){

    intervalID = setInterval(displayClock, 1000);
    count = 29;
    countInitial = 30;
    document.addEventListener('keypress', checkAndUpdate);
    clock.textContent = countInitial;
    mistakesDiv.textContent='0%';
    wpmDiv.textContent = '0';
    //startButton.removeEventListener('click', startInterval);
    startButton.setAttribute('disabled','');
    startButton.classList.add('disabled');
    mistakes = 0;
    correctKeyStrokes=0;
    getRandomSentence();
}


