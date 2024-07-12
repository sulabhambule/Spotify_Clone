console.log("Sulabh Ambule");

let currentSong = new Audio;

function secondsToMinutesSeconds(seconds) {
  if(isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinuted = String(minutes).padStart(2,'0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinuted}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
      // it will give the arr of 2 , before /songs/ and after songs, i had accesed arr[1], which is after song name.
    }
  }

  return songs;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/" + track);
  currentSong.src = "/songs/" + track
  if(!pause) {
    currentSong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
}


async function main() {
  // get the list of all  the songs
  let songs = await getSongs();
  playMusic(songs[0], true);

  // show all the song in playList
  let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUl.innerHTML += 
      `
      <li>
        <img class="invert" src="music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Sulabh</div>
        </div>
        <div class="playNow">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="">
        </div>
      </li>
      `
  }

  // Attach an event listener to each song
  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
        playMusic(element.currentTarget.querySelector(".info").firstElementChild.innerHTML.trim())

    })
  })

  // Attach an event listner to play, next and previous

  play.addEventListener('click', () => {
    if(currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg";
    } else {
      currentSong.pause();
      play.src = "play.svg";
    }
  })

  // Listen for timeUpdate event..

  currentSong.addEventListener("timeupdate", () => {

    document.querySelector(".songTime").innerHTML = 
    `
    ${secondsToMinutesSeconds(currentSong.currentTime)}/
    ${secondsToMinutesSeconds(currentSong.duration)}
    `

    document.querySelector(".circle").style.left = 
    (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  // add an eventListener to seekbar

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = 
      percent + "%";

    currentSong.currentTime = ((currentSong.duration) * percent) / 100; 
  });
}

main();