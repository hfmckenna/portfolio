const allAudio = document.getElementsByTagName('audio'); //get all the audio elements for play/pause

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function () {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
}) // adds a prototype method to detect when an element is already playing

document.getElementById('audioimages').addEventListener("click", function (e) {
    if (e.target.localName === 'i') {
        if (e.target.nextElementSibling.playing) {
            e.target.classList.remove('fa-pause-circle');
            e.target.classList.add('fa-play-circle');
            e.target.nextElementSibling.pause();
        } else if (!e.target.nextElementSibling.playing) {
            for (let audio of allAudio) {
                audio.pause();
                if (e.target.nextElementSibling != audio) {
                    audio.currentTime = 0;
                    audio.previousElementSibling.classList.remove('fa-pause-circle');
                    audio.previousElementSibling.classList.add('fa-play-circle');
                }
            }
            e.target.classList.remove('fa-play-circle');
            e.target.classList.add('fa-pause-circle');
            e.target.nextElementSibling.play();
        }
    }
    else {
        e.stopPropagation();
    }
});