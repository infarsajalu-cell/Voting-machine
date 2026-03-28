const candidates = [
    { name: 'Stephen Nedumpally', image: 'Stephen_Nedumpally.png' },
    { name: 'Kadakkal Chandran', image: 'Kadakkal_Chandran.png' },
    { name: 'Kaitheri Sahadevan', image: 'Kaitheri_Sahadevan.png' },
    { name: 'P. P. Sashi Aashan', image: 'P_P_Sashi_Aashan.png' },
    { name: 'Adv. Ramanunni K.R', image: 'Adv_Ramanunni_KR.png' },
    { name: 'Aji Mathew /Ajippan', image: 'Aji Mathew:Ajippan.png' },
    { name: 'C.P.Mammachan', image: 'C_P_Mammachan.png' },
    { name: 'Cuba Mukundan', image: 'Cuba_Mukundan.png' },
    { name: 'Jathin Ramdas', image: 'Jathin_Ramdas.png' },
    { name: 'Aymanam Sidharthan', image: 'Aymanam_Sidharthan.png' },
    { name: 'Lahhel Vakkachan', image: 'Lahhel_Vakkachan.png' },
    { name: 'John Varghese', image: 'John_Varghese.png' }
];

const candidatesList = document.getElementById('candidatesList');
const readyLight = document.getElementById('readyLight');
const resultModal = document.getElementById('resultModal');
const closeModalBtn = document.getElementById('closeModal');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const candidateIntro = document.getElementById('candidateIntro');
const proceedToVoteBtn = document.getElementById('proceedToVoteBtn');
const evmMain = document.getElementById('evmMain');
let hasVoted = false;

// Initialize candidates
function initMachine() {
    // Clear list first if re-initializing
    candidatesList.innerHTML = '';
    
    candidates.forEach((candidate, index) => {
        const row = document.createElement('div');
        row.className = 'candidate-row';
        // Using encodeURI to correctly handle space and colon characters in the image filenames
        row.innerHTML = `
            <div class="candidate-info">
                <img src="${encodeURI(candidate.image)}" alt="${candidate.name}" class="candidate-image">
                <div class="candidate-name-container">
                    <span class="candidate-name">${candidate.name}</span>
                </div>
            </div>
            <div class="voting-area">
                <div class="red-light" id="light-${index}"></div>
                <button class="vote-btn" onclick="castVote(${index})" id="btn-${index}"></button>
            </div>
        `;
        candidatesList.appendChild(row);
    });

    // Make ready light active
    setTimeout(() => {
        readyLight.classList.add('active');
    }, 800);
}

function castVote(index) {
    if (hasVoted) return;
    
    // Lock machine
    hasVoted = true;
    readyLight.classList.remove('active');
    
    // Turn on the specific candidate's red light
    const redLight = document.getElementById(`light-${index}`);
    redLight.classList.add('active');
    
    // Play beep sound (simulated with JS Audio API)
    playBeep();
    
    // Send the vote to Google Sheets
    const candidateName = candidates[index].name;
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby5io4U53sXs8ffopayhbvg6cfz5CfZQ4xF956qjHIxOUrop0_1EiHZ82Ay9v4IZ8DVsQ/exec'; // Replace with your Google Apps Script Web App URL
    
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('http')) {
        // We use mode: 'no-cors' to prevent CORS errors since we are sending a simple GET request
        fetch(`${GOOGLE_SCRIPT_URL}?name=${encodeURIComponent(candidateName)}`, {
            method: 'GET',
            mode: 'no-cors'
        }).catch(err => console.log('Error recording vote to sheet:', err));
    } else {
        console.log(`Vote for ${candidateName} recorded locally (Google Script URL not set)`);
    }
    
    // Show modal after a delay simulating the vote recording procedure
    setTimeout(() => {
        // Update modal with voted candidate info
        document.getElementById('votedImage').src = encodeURI(candidates[index].image);
        document.getElementById('votedName').innerText = candidates[index].name;
        
        showModal();
        
        // Optionally disable buttons visually after vote
        document.querySelectorAll('.vote-btn').forEach(btn => btn.disabled = true);
    }, 2500); // 2.5 second beep duration typically in EVM
}

function playBeep() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); // Beep tone
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 2.5); // Plays for 2.5s
    } catch(e) {
        console.log("Audio not supported or auto-play prevented. To enable audio beep, user might need to interact with the page first.");
    }
}

function showModal() {
    resultModal.classList.add('show');
}

// Start Application flow
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    candidateIntro.style.display = 'flex';
});

proceedToVoteBtn.addEventListener('click', () => {
    candidateIntro.style.display = 'none';
    evmMain.style.display = 'block';
    
    // Initialize or re-initialize the machine
    initMachine();
});

closeModalBtn.addEventListener('click', () => {
    resultModal.classList.remove('show');
});


