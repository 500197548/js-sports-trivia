// import the utility functions "decodeHtml" and "shuffle"
import { decodeHtml, shuffle } from './utils.js' 

// get the elements from the DOM
const questionElement = document.querySelector('#question')
const answersElement = document.querySelector('#answers')
const nextQuestionElement = document.querySelector('#nextQuestion')

// IIFE (so we can use async/await)
;(async () => {
    
    // Step 1: Create "getNextQuestion" function
    const getNextQuestion = async () => {
        const fetchResponse = await fetch('https://opentdb.com/api.php?amount=1&category=21&difficulty=easy&type=multiple')
        const json = await fetchResponse.json()
        
        const { question, correct_answer: correct, incorrect_answers: incorrect } = json.results[0]
        const answers = shuffle([ ...incorrect, correct ])
        return { question, answers, correct }
    }

    // Step 2: Create "renderQuestion" function
    const renderQuestion = ({ question, answers, correct }) => {

        questionElement.textContent = decodeHtml(question)
        answersElement.innerHTML = ''

        answers.forEach(answer => {
            const button = document.createElement('button')
            button.textContent = decodeHtml(answer)
            button.addEventListener('click', () => {
                if (answer === correct) {
                    button.classList.add('correct')
                    answersElement.querySelectorAll('button').forEach(b => b.disabled = true)
                    alert('Correct!')
                } else {
                    button.disabled = true
                    alert('Incorrect!')
                }
            })
            answersElement.appendChild(button)
        })}

    // Step 3: Add event listener to "nextQuestion" button
    nextQuestionElement.addEventListener('click', async () => {
        renderQuestion(await getNextQuestion())
        nextQuestionElement.disabled = true
        setTimeout(() => nextQuestionElement.disabled = false, 10000)
    })

})()

// Automatically load the first question
nextQuestionElement.click()