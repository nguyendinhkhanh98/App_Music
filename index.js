const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAY_STORAGE_KEY = 'F8_PLAYER';

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playList = $('.playlist');


const app = {
    currentIndex: 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    config: JSON.parse(localStorage.getItem(PLAY_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Neveda',
            singer: 'Vicenton',
            path: './assets/music/song1.mp3',
            image:'./assets/img/song1.jpg',
        },
        {
            name: 'Neveda',
            singer: 'Vicenton',
            path: './assets/music/song2.mp3',
            image:'./assets/img/song2.jpg',
        },
        {
            name: 'Neveda',
            singer: 'Vicenton',
            path: './assets/music/song3.mp3',
            image:'./assets/img/song3.jpg',
        },
        {
            name: 'Neveda',
            singer: 'Vicenton',
            path: './assets/music/song4.mp3',
            image:'./assets/img/song4.jpg',
        },
        {
            name: 'Neveda',
            singer: 'Vicenton',
            path: './assets/music/song5.mp3',
            image:'./assets/img/song5.jpg',
        },
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAY_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
                `
        })
        playList.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong' , {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvent: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // X??? l?? CD quay v?? d???ng 
        const cdThumbAnimate = cdThumb.animate({
            transform: 'rotate(360deg'
        },
        {
            duration: 10000,
            iteration:Infinity,
        })

        cdThumbAnimate.pause();
        

        // X??? l?? ph??ng to, thu nh??? CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 ;
            cd.style.opacity = newCdWidth/cdWidth;
        }

        // X??? l?? click play
        playBtn.onclick = function() {

            if(_this.isPlaying) {
                audio.pause();
            }else {
                audio.play(); 
            }
        
        }

        // Khi b??i h??t ???????c play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi b??i h??t pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        
        // X??? l?? ti???n ????? b??i h??y
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100);
                progress.value = progressPercent;
            }
        }

        // X??? l?? khi tua b??i h??t
        progress.onchange = function(e) {
            const seekTime = e.target.value/100 * audio.duration
            audio.currentTime =  seekTime;
        }

        // Khi next b??i h??t
        nextBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
         
        // X??? l?? khi prev b??i h??t
        prevBtn.onclick = function() {
            if(_this.isRandom) {
                _this.playRandomSong();
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // X??? l??  b???t/t???t random b??i h??t
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // X??? l?? ph??t l???i 1 b??i h??t 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.isRepeat = _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // X??? l?? next song khi audio ended
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            }else {
                nextBtn.click();
            }
        }

        // L???ng nghe h??nh vi click v??o b??i h??t
        playList.onclick = function(e) {

            const songNode = e.target.closest('.song:not(.active)');
            if(
                songNode ||
                e.target.closest('option')
            ) {
                // X??? l?? khi click v??o b??i h??t trong playlist
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // X??? l?? khi click v??o n??t option
                if(e.target.closest('option')) {

                }
            }
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')` ;
        audio.src = this.currentSong.path;
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        this.currentIndex++; 
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--; 
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        },300)
    },

    start: function() {

        // G??n c???u h??nh t??? config v??o ???ng d???ng
        this.loadConfig();

        //?????nh ngh??a c??c thu???c t??nh cho object
        this.defineProperties();

        //L???ng nghe, x??? l?? c??c s??? ki???n
        this.handleEvent();

        //T???i th??ng tin b??i h??t ?????u ti??n khi ch???y ???ng d???ng
        this.loadCurrentSong();

        //Render playlist
        this.render();

        // Hi???n th??? tr???ng th??i ban ?????u c???a 2 n??t Random v?? Repeat
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
}

app.start();