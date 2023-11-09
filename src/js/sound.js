
export function sound() {
    const audio = document.getElementById("audio");
    const playBtn = document.getElementById("play-btn");
    const muteBtn = document.getElementById("mute-btn");
    const backwardBtn = document.getElementById("backward-btn");
    const forwardBtn = document.getElementById("forward-btn");
    const playMusic = document.getElementById("play-music");
    const volumeRange = document.getElementById("volume-range");
    const volumeHigh = document.getElementById("volume-high");



    var tracks = {
        list: ["./assets/sound-track/Apocalyptica-The_Legend_of_Zelda_Main_Theme_Classic.mp3", "./assets/sound-track/arcade.mp3", "./assets/sound-track/dream-land.mp3", "./assets/sound-track/Hideki_Sakamoto_-_Overworld_The_Legend_of_Zelda_for_3DS.mp3", "./assets/sound-track/KAAZE_-_The_Legend_Of_Zelda.mp3", "./assets/sound-track/march-ahead.mp3", "./assets/sound-track/mario-theme.mp3", "./assets/sound-track/Super_Mario_Bros_Underworld.mp3", "./assets/sound-track/Super_Mario_Bros_World_3_Map_SNES_Mix.mp3", "./assets/sound-track/Super_Mario_santehnik-legenda.mp3", "./assets/sound-track/The_Legend_of_Zelda_-_Ciela_s_Parting_Words.mp3", "./assets/sound-track/The_Legend_of_Zelda_-_Overworld_Theme_piano_cover.mp3", "./assets/sound-track/The_Legend_of_Zelda_-_Overworld_Theme.mp3", "./assets/sound-track/The_Legend_of_Zelda_A_Link_Between_Worlds_-_Death_Mountain.mp3",], // List of songs
        index: 0,
        next: function () {
            if (this.index == this.list.length - 1) this.index = Math.floor(Math.random() * 14);
            else {
                this.index = Math.floor(Math.random() * 14);
            }
        },
        play: function () {
            // console.log(this.list);
            console.log(this.list[Math.floor(Math.random() * 14)])
            return this.list[Math.floor(Math.random() * 14) | 0];
        }
    }

    audio.onended = function () {
        tracks.next();
        audio.src = tracks.play();
        audio.load();
        audio.play();
    }

    playBtn.addEventListener("click", (e) => {
        console.log(e.target);
        if (e.target.classList.contains("fa-play")) {
            playMusic.classList.remove("fa-play");
            playMusic.classList.add("fa-pause");
            audio.play();
        } else {
            playMusic.classList.remove("fa-pause");
            playMusic.classList.add("fa-play");
            audio.pause();
        }
    })

    muteBtn.addEventListener("click", (e) => {
        console.log(e.target);
        if (e.target.classList.contains("fa-volume-high")) {
            audio.volume = 0;
            volumeHigh.classList.remove("fa-volume-high");
            volumeHigh.classList.add("fa-volume-xmark");
        } else {
            audio.volume = 0.1;
            volumeHigh.classList.remove("fa-volume-xmark");
            volumeHigh.classList.add("fa-volume-high");
        }
    })

    backwardBtn.addEventListener("click", (e) => {
        console.log(e.target);
        tracks.next();
        audio.src = tracks.play();
        audio.load();
    })

    forwardBtn.addEventListener("click", (e) => {
        console.log(e.target);
        tracks.next();
        audio.src = tracks.play();
        audio.load();
    })

    volumeRange.addEventListener("change", (e) => {
        audio.volume = e.target.value / 100;
    })

    audio.src = tracks.play();
    volumeRange.value = 0.1 * 100
    audio.volume = 0.1;
    audio.autoplay = true;
}