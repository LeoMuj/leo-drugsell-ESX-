let activeOffer = false
let sex = 'male'

const femalePhrase = new Audio('./sounds/f_phrase.mp3');
const malePhrase = new Audio('./sounds/m_phrase.mp3');

const femaleCancel = new Audio('./sounds/f_f-off.mp3');
const maleCancel = new Audio('./sounds/m_f-off.mp3');

document.addEventListener('mousemove', (event) => {
    const element = document.querySelector('.cursor-content');
    const elementRect = element.getBoundingClientRect();

    const mouseX = event.clientX - (elementRect.left + elementRect.width / 2);
    const mouseY = event.clientY - (elementRect.top + elementRect.height / 2);

    const angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

    element.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
});

window.addEventListener('message', (event) => {
    if (event.data.type === 'open') {
        activeOffer = true
        sex = event.data.sex

        document.getElementById('elements').classList.add('active-ui')

        document.getElementById('conversation').innerHTML = `${event.data.conversation}`

        document.getElementById('deal-value').innerHTML = `${event.data.dealRate}`

        if (sex === 'male') {
            malePhrase.volume = 0.2
            malePhrase.play();
        }

        if (sex === 'female') {
            femalePhrase.volume = 0.2
            femalePhrase.play();
        }

        setTimeout(() => {
            if (activeOffer) {
                fetch(`https://leo-drugdeal/uiCallbacks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({
                        callbackType: 'drug confirmation',
                        acceptedOffer: 'time'
                    })
                })

                document.getElementById('elements').classList.remove('active-ui')
            }
        }, 1000 * 10)
    }

    if (event.data.type === 'close') {
        document.getElementById('elements').classList.remove('active-ui')
    }
})

const submitOffer = (value) => {

    femalePhrase.pause();
    femalePhrase.currentTime = 0;

    malePhrase.pause();
    malePhrase.currentTime = 0;

    if (!value && sex === 'male') {
        maleCancel.volume = 0.2
        maleCancel.play();
    }

    if (!value && sex === 'female') {
        femaleCancel.volume = 0.2
        femaleCancel.play();
    }

    fetch(`https://leo-drugdeal/uiCallbacks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
            callbackType: 'drug confirmation',
            acceptedOffer: value
        })
    })

    activeOffer = false

    document.getElementById('elements').classList.remove('active-ui')

}