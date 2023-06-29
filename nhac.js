/* ---- particles.js config ---- */
particlesJS("particle-container", {
    "particles": {
      "number": {
        "value": 50,
        "density": {
          "enable": true,
          "value_area": 400
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#ffffff"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 3,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "repulse"
        },
        "onclick": {
          "enable": false,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });
  
  
  
  // PLAYER 
  
  var player = $('.recordBox'),
      audio = player.find('audio'),
      duration = $('.duration'),
      currentTime = $('.current-time'),
      progressBar = $('.progress span'),
      mouseDown = false,
      rewind, showCurrentTime;
  
  function secsToMins(time) {
    var int = Math.floor(time),
        mins = Math.floor(int / 60),
        secs = int % 60,
        newTime = mins + ':' + ('0' + secs).slice(-2);
    
    return newTime;
  }
  
  function getCurrentTime() {
    var currentTimeFormatted = secsToMins(audio[0].currentTime),
        currentTimePercentage = audio[0].currentTime / audio[0].duration * 100;
    
    currentTime.text(currentTimeFormatted);
    progressBar.css('width', currentTimePercentage + '%');
    
    if (player.hasClass('playing')) {
      showCurrentTime = requestAnimationFrame(getCurrentTime);
    } else {
      cancelAnimationFrame(showCurrentTime);
    }
  }
  
  audio.on('loadedmetadata', function() {
    var durationFormatted = secsToMins(audio[0].duration);
    duration.text(durationFormatted);
  }).on('ended', function() {
    if ($('.repeat').hasClass('active')) {
      audio[0].currentTime = 0;
      audio[0].play();
    } else {
      player.removeClass('playing').addClass('paused');
      audio[0].currentTime = 0;
    }
  });
  
  $('button').on('click', function() {
    var self = $(this);
    
    if (self.hasClass('play-pause') && player.hasClass('paused')) {
      player.removeClass('paused').addClass('playing');
      audio[0].play();
      getCurrentTime();
    } else if (self.hasClass('play-pause') && player.hasClass('playing')) {
      player.removeClass('playing').addClass('paused');
      audio[0].pause();
    }
    
    if (self.hasClass('rw')) {
      player.addClass('rwing');
      rewind = setInterval(function() { audio[0].currentTime -= .3; }, 100);
    }
  }).on('mouseup', function() {
    var self = $(this);
    
    if (self.hasClass('ff')) {
      player.removeClass('ffing');
      audio[0].playbackRate = 1;
    }
    
    if (self.hasClass('rw')) {
      player.removeClass('rwing');
      clearInterval(rewind);
    }
  });
  
  player.on('mousedown mouseup', function() {
    mouseDown = !mouseDown;
  });
  
  progressBar.parent().on('click mousemove', function(e) {
    var self = $(this),
        totalWidth = self.width(),
        offsetX = e.offsetX,
        offsetPercentage = offsetX / totalWidth;
    
    if (mouseDown || e.type === 'click') {
      audio[0].currentTime = audio[0].duration * offsetPercentage;
      if (player.hasClass('paused')) {
        progressBar.css('width', offsetPercentage * 100 + '%');
      }
    }
  });
  