'use strict';

const audio = document.querySelector('audio');
const songNameEl = document.querySelector('.song');
const singerNameEl = document.querySelector('.singer');
const coverImgEl = document.querySelector('.cover__img img');

const audioContainer = document.querySelector('.audio-container');
const play = document.querySelector('.play');
const timePassedEl = document.querySelector('.time--passed');
const timeTotalEl = document.querySelector('.time-total');
const progressContainer = document.querySelector('.progress-bar');
const progressEl = document.querySelector('.progress-bar__width');
const forward = document.querySelector('.forward');
const backward = document.querySelector('.backward');

let progressTimer, duration, currentTime;
let width = 0;
let currentSongIndex, prevSongIndex;

const songs = [
  {
    cover: './music/bad blood.png',
    song: 'bad blood',
    singer: 'Taylor Swift',
    src: 'music/bad blood.mp3',
  },

  {
    cover: './music/Best_Friend_Yelawolf.jpg',
    song: 'best friend',
    singer: 'Eminem',
    src: 'music/best friend.mp3',
  },
];

/////// INITIALIZED ACTION BUTTONS
const initActionButtons = function (forwardIndex, backwardIndex) {
  currentSongIndex = forwardIndex;
  prevSongIndex = backwardIndex;

  forward.setAttribute('data-index', forwardIndex);
  backward.setAttribute('data-index', backwardIndex);
};

/////// CHANGE PROGRESS WIDTH

const progress = function (time) {
  const progress = 100 / time;

  progressTimer = setInterval(() => {
    width += progress;
    progressEl.style.width = `${width}%`;
    if (width >= 99.5) {
      clearInterval(progressTimer);
    }
  }, 1000);
};

/////// SET AUDIO TIME IN UI
const setAudioTime = function () {
  setTimeout(() => {
    const totalTime = audio.duration;
    duration = totalTime;

    const minutes = +`${Math.floor(totalTime / 60)}`.padStart(2, 0);
    const seconds = +`${Math.floor(totalTime % 60)}`.padStart(2, 0);

    timeTotalEl.textContent = ` ${minutes} : ${seconds} `;
  }, 500);
};

/////// SET AUDIO CURRENT TIME IN UI
const setCurrentTime = function () {
  currentTime = audio.currentTime;

  const minutes = +`${Math.floor(currentTime / 60)}`.padStart(2, 0);
  const seconds = +`${Math.floor(currentTime % 60)}`.padStart(2, 0);

  timePassedEl.textContent = ` ${minutes} : ${seconds} `;
};

/////// TOGGLE PLAY BUTTON
const toggleAudio = function () {
  const isPlaying = document.querySelector('.fas.fa-play');

  if (!isPlaying) {
    audio.pause();
    clearInterval(progressTimer);

    document.querySelector('.play').firstElementChild.classList.add('fa-play');
    document.querySelector('.play').firstElementChild.classList.remove('fa-pause');
  } else {
    audio.play();
    progress(duration);

    document.querySelector('.play').firstElementChild.classList.remove('fa-play');
    document.querySelector('.play').firstElementChild.classList.add('fa-pause');
  }
};

/////// UPDATE AUDIO TIME
const updateTimer = function () {
  setCurrentTime();
};

/////// HANDLE CHANGE PROGRESS
const changeProgress = function (e) {
  const selectedWidth = e.offsetX;
  width = (selectedWidth / progressContainer.clientWidth) * 100;
  progressEl.style.width = `${width}%`;

  const timePassed = (selectedWidth * duration) / progressContainer.clientWidth;
  audio.currentTime = timePassed;
};

/////// NEXT SONG

const nextSong = function () {
  if (currentSongIndex >= songs.length - 1) return;

  currentSongIndex++;
  prevSongIndex++;

  initActionButtons(currentSongIndex, prevSongIndex);

  coverImgEl.setAttribute('src', songs[currentSongIndex].cover);
  audio.setAttribute('src', songs[currentSongIndex].src);
  songNameEl.textContent = songs[currentSongIndex].song;
  singerNameEl.textContent = songs[currentSongIndex].singer;

  document.querySelector('.play').firstElementChild.classList.add('fa-play');
  document.querySelector('.play').firstElementChild.classList.remove('fa-pause');

  currentTime = 0;
  width = 0;
  duration = 0;
  clearInterval(progressTimer);
  progressEl.style.width = `0%`;

  setAudioTime();
};

const prevSong = function () {
  if (prevSongIndex <= -1) return;

  currentSongIndex--;
  prevSongIndex--;
  initActionButtons(currentSongIndex, prevSongIndex);

  coverImgEl.setAttribute('src', songs[currentSongIndex].cover);
  audio.setAttribute('src', songs[currentSongIndex].src);
  songNameEl.textContent = songs[currentSongIndex].song;
  singerNameEl.textContent = songs[currentSongIndex].singer;

  document.querySelector('.play').firstElementChild.classList.add('fa-play');
  document.querySelector('.play').firstElementChild.classList.remove('fa-pause');

  currentTime = 0;
  width = 0;
  duration = 0;
  clearInterval(progressTimer);
  progressEl.style.width = `0%`;
  setAudioTime();
};

/////// INIT FUNTION
const init = function () {
  window.addEventListener('load', setAudioTime);
  window.addEventListener('load', setCurrentTime);

  play.addEventListener('click', toggleAudio);
  audio.addEventListener('timeupdate', updateTimer);
  audio.addEventListener('ended', nextSong);
  progressContainer.addEventListener('click', changeProgress);
  forward.addEventListener('click', nextSong);
  backward.addEventListener('click', prevSong);
  initActionButtons(0, -1);
};

init();
