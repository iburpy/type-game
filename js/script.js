const textDisplay = document.querySelector('.typing-text p'),
  input = document.querySelector('.top-controls .input-field'),
  mistakeCount = document.querySelector('.mistake span'),
  accuracyDisplay = document.querySelector('.accuracy span'),
  timeDisplay = document.querySelector('.time span b'),
  wpmDisplay = document.querySelector('.wpm span'),
  cpmDisplay = document.querySelector('.cpm span'),
  timeDropdown = document.querySelector('.top-controls .time-selector'),
  options = timeDropdown.querySelectorAll('option'),
  reset = document.querySelector('.content button'),
  scoreDisplay = document.querySelector('.score-container #score'),
  alertCard = document.querySelector('.alert-card'),
  finalScoreDisplay = document.querySelector('#final-score'),
  finalMistakesDisplay = document.querySelector('#final-mistakes'),
  finalAccuracyDisplay = document.querySelector('#final-accuracy'),
  finalWpmDisplay = document.querySelector('#final-wpm'),
  finalCpmDisplay = document.querySelector('#final-cpm'),
  closeAlertButton = document.querySelector('#close-alert'),
  completionDisplay = document.querySelector('#completion'),
  themeToggle = document.querySelector('#theme-toggle'),
  draggable = document.querySelector('.draggable'),
  wrapper = document.querySelector('.wrapper')

let i = 0,
  mistakes = 0,
  successes = 0,
  accuracy = 0,
  timer = 0,
  timeMax = 120,
  timeLeft = timeMax,
  isTyping = false,
  score = 0,
  maxScore = 0,
  completionPercentage = 0,
  initialAlertX = 0,
  initialAlertY = 0,
  isDraggingAlert = false

const keySound = new Audio('/assets/typewriter-single-key.mp3'),
  timeUpSound = new Audio('/assets/typewriter-bell.mp3')

draggable.addEventListener('mousedown', (event) => {
  isDraggingAlert = true
  event.preventDefault()
  initialAlertX = event.clientX - draggable.offsetLeft
  initialAlertY = event.clientY - draggable.offsetTop
  document.addEventListener('mousemove', dragAlert)
  document.addEventListener('mouseup', stopDragAlert)
})

const dragAlert = (event) => {
  if (isDraggingAlert) {
    const newX = event.clientX - initialAlertX
    const newY = event.clientY - initialAlertY
    draggable.style.left = `${newX}px`
    draggable.style.top = `${newY}px`
  }
}

const stopDragAlert = () => {
  isDraggingAlert = false
  document.removeEventListener('mousemove', dragAlert)
  document.removeEventListener('mouseup', stopDragAlert)
}

const setInputState = (isDisabled) => {
  input.disabled = isDisabled
  input.style.cursor = isDisabled ? 'not-allowed' : 'auto'
}

const setResetState = (isDisabled) => {
  reset.disabled = isDisabled
  reset.style.cursor = isDisabled ? 'not-allowed' : 'pointer'
}

const updateScore = (isCorrect) => {
  score = isCorrect ? score + 1 : Math.max(0, score - 1)
  scoreDisplay.innerText = `${score}/${maxScore}`
}

const randomParagraph = () => {
  const randIndex = Math.floor(Math.random() * paragraphs.length)
  textDisplay.innerHTML = ''
  input.value = ''
  const paragraph = paragraphs[randIndex]
  maxScore = paragraph.length
  paragraph.split('').forEach((char) => {
    let spanTag = `<span>${char}</span>`
    textDisplay.innerHTML += spanTag
  })
}

const handleTyping = () => {
  if (input.disabled) return
  const characters = textDisplay.querySelectorAll('span')
  const typedChar = input.value.split('')[i]

  if (!isTyping) {
    timer = setInterval(updateTimer, 1000)
    setInputState(true)
    setResetState(true)
    isTyping = true
  }

  if (input.value.length < i) {
    i--
    mistakes++
    updateScore(false)
    return
  }

  if (!typedChar) {
    i--
    mistakes++
    characters[i].classList.add('active')
  } else {
    if (characters[i].innerText === typedChar) {
      successes++
      characters[i].classList.add('correct')
      updateScore(true)
    } else {
      mistakes++
      characters[i].classList.add('incorrect')
      updateScore(false)
      keySound.play()
    }

    i++
  }

  characters.forEach((span) => span.classList.remove('active'))
  characters[i]?.classList.add('active')

  mistakeCount.innerText = mistakes

  const totalTyped = successes + mistakes

  accuracy = totalTyped > 0 ? ((successes / totalTyped) * 100).toFixed(2) : 0
  accuracyDisplay.innerText = `${accuracy}%`

  let totalTime = timeMax - timeLeft,
    totalTimeMin = totalTime / 60,
    totalChars = i - mistakes,
    cpm = totalChars,
    wpm = Math.round(totalChars / (5 * totalTimeMin))

  cpmDisplay.innerText = cpm
  wpmDisplay.innerText = wpm

  const totalCharacters = textDisplay.querySelectorAll('span').length
  completionPercentage =
    totalCharacters > 0 ? ((i / totalCharacters) * 100).toFixed(2) : 0
  document.getElementById('completion').innerText = `${completionPercentage}%`

  if (completionPercentage >= 100) handleEnd()
  if (score <= 0) score = 0
  if (mistakes <= 0) mistakes = 0
  if (Number.isNaN(wpm) || !wpm) wpm = 0
  if (Number.isNaN(cpm) || !cpm) cpm = 0
}

const showResults = () => {
  document.querySelector('.result-details').classList.add('hidden')
  document.querySelector('.alert-card').classList.remove('hidden')

  finalScoreDisplay.innerText = scoreDisplay.innerText
  finalMistakesDisplay.innerText = mistakeCount.innerText
  finalAccuracyDisplay.innerText = accuracyDisplay.innerText
  finalWpmDisplay.innerText = wpmDisplay.innerText
  finalCpmDisplay.innerText = cpmDisplay.innerText

  document.querySelector('#final-time').innerText = timeLeft
  document.querySelector(
    '#final-completion'
  ).innerText = `${completionPercentage}%`
  options.selectedIndex = 0
}

const handleEnd = () => {
  clearInterval(timer)
  setInputState(true)
  setResetState(true)
  input.removeEventListener('input', handleTyping)
  timeUpSound.play()
  showResults()
  options.selectedIndex = 0
}

const updateTimer = () => {
  if (timeLeft > 0) {
    timeLeft--
    timeDisplay.innerText = timeLeft
  } else {
    handleEnd()
  }
}

const startTimer = () => {
  if (!isTyping) {
    timer = setInterval(updateTimer, 1000)
    isTyping = true
  }
}

const resetGame = () => {
  clearInterval(timer)
  randomParagraph()
  i = 0
  mistakes = 0
  successes = 0
  accuracy = 0
  timeLeft = timeMax
  timeDisplay.innerText = timeLeft
  mistakeCount.innerText = mistakes
  accuracyDisplay.innerText = `${accuracy}%`
  wpm = 0
  cpm = 0
  wpmDisplay.innerText = wpm
  cpmDisplay.innerText = cpm
  score = 0
  scoreDisplay.innerText = `${score}/${maxScore}`
  input.value = ''
  setInputState(true)
  setResetState(true)
  timeDropdown.style.display = 'block'
  options.selectedIndex = 0
  document.querySelector('.time').style.display = 'none'
  isTyping = false
  input.addEventListener('input', handleTyping)
  completionPercentage = 0
  completionDisplay.innerText = `${completionPercentage}%`
}

timeDropdown.addEventListener('change', () => {
  timeMax = parseInt(timeDropdown.value)
  timeLeft = timeMax
  timeDisplay.innerText = timeLeft

  timeDropdown.style.display = 'none'
  document.querySelector('.time').style.display = 'block'
  setInputState(false)
  setResetState(false)
})

const handleEsc = (event) => {
  if (event.key === 'Escape') {
    alertCard.classList.add('hidden')
    document.querySelector('.result-details').classList.remove('hidden')
    resetGame()
  }
}

document.addEventListener('keydown', handleEsc)

closeAlertButton.addEventListener('click', () => {
  alertCard.classList.add('hidden')
  document.querySelector('.result-details').classList.remove('hidden')
  resetGame()
  document.removeEventListener('keydown', handleEsc)
})

const toggleMode = () => {
  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark')
      themeToggle.checked = true
    } else {
      document.body.classList.remove('dark')
      themeToggle.checked = false
    }
  })

  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      document.body.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.body.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  })
}

randomParagraph()
input.addEventListener('input', handleTyping)
input.addEventListener('focus', startTimer)
reset.addEventListener('click', resetGame)
themeToggle.addEventListener('click', toggleMode)
