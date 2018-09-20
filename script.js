var board1 = document.querySelector('#board1')
var board2 = document.querySelector('#board2')
var boardCheatp1 = document.querySelector('#boardcheatp1')
var boardCheatp2 = document.querySelector('#boardcheatp2')
var settingKapal = {
  p1: document.querySelector('.setting-kapalp1'),
  p2: document.querySelector('.setting-kapalp2')
}
var currentPlayer = 'p1'
var gameStart = false

var availShip = {
  p1: [{type: 'carier', size: 5}, {type: 'battleship', size: 4}, {type: 'destroyer', size: 3}, {type: 'submarine', size: 3}, {type: 'patrol boat', size: 2}],
  p2: [{type: 'carier', size: 5}, {type: 'battleship', size: 4}, {type: 'destroyer', size: 3}, {type: 'submarine', size: 3}, {type: 'patrol boat', size: 2}]
}

var shiploc = {
  p1: [],
  p2: [],
}

var totalShipSize = {
  p1: 0,
  p2: 0
}

var fireAttempt = 0


renderBoard('p1')
renderBoard('p2')
renderBoard('cheatp1')
renderBoard('cheatp2')

function renderBoard (player) {
  for (var i = 64; i <= 74; i++) {
    var row = document.createElement('div')
    row.setAttribute('class' ,'row')
    for (var j = 0; j <= 10; j++) {
      if (i !== 64 && j !== 0) {
        var box = document.createElement('div')
        var charAt = String.fromCharCode(i) 
        box.setAttribute('class', 'box')
        box.setAttribute('data-x', charAt)
        box.setAttribute('data-y', j)
        box.id = `${player}${charAt}${j}`
        row.appendChild(box)
      } 

      if (i == 64 && j == 0) {
        var box = document.createElement('div')
        box.setAttribute('class', 'box coordinate')
        box.textContent = '#'
      } else if ( j == 0) {
        var box = document.createElement('div')
        box.setAttribute('class', 'box coordinate')
        box.textContent = String.fromCharCode(i)
      } else if ( i == 64) {
        var box = document.createElement('div')
        box.setAttribute('class', 'box coordinate')
        box.textContent = j
      }
      row.appendChild(box)
    }
    if (player == 'p1') {
      board1.appendChild(row)
    } else if (player == 'p2') {
      board2.appendChild(row)
    } else if (player == 'cheatp1') {
      boardCheatp1.appendChild(row)
    } else if (player == 'cheatp2') {
      boardCheatp2.appendChild(row)
    }
  }
}

function openSettingShip (player) {
  settingKapal[player].style.display = 'block'
  var coordinate = document.getElementById(`coordinate${player}`)
  var optionShipContent = document.getElementById(`availship${player}`)
  var orientations = document.getElementsByName(`orientation${player}`)
  
  coordinate.value = ''

  for (var i=0; i < orientations; i++) {
    orientations[i].checked = false
  }

  optionShipContent.innerHTML = ''
  availShip[player].map((shipType, index) => {
    var ship = document.createElement('input')
    var label = document.createElement('label')
    ship.setAttribute('type', 'radio')
    ship.setAttribute('name', `shiptype${player}`)
    ship.setAttribute('value', shipType.type)
    ship.setAttribute('data-size', shipType.size)
    label.textContent = ` ${shipType.type} `
    optionShipContent.appendChild(ship)
    optionShipContent.appendChild(label)
  })
}

function setShip (player) {
  var coordinate = document.getElementById(`coordinate${player}`)
  var shipOptions = document.getElementsByName(`shiptype${player}`)
  var orientations = document.getElementsByName(`orientation${player}`)
  var tempIndexShip = 0
  var x = xCek = 0
  var y = yCek = 0
  var posShip = {
    coordinate: {},
    ship: {},
    orientation: ''
  }
  var collide = false
  var message = ''

  var coordinateShip = coordinate.value.split(',')
  posShip.coordinate.x = coordinateShip[0]
  x = xCek = coordinateShip[0].charCodeAt(0)
  
  posShip.coordinate.y = coordinateShip[1]
  y = yCek = coordinateShip[1]

  for (var i = 0; i < shipOptions.length; i++) {
    if (shipOptions[i].checked) {
      posShip.ship.type = shipOptions[i].value
      posShip.ship.size = shipOptions[i].getAttribute('data-size')
      tempIndexShip = i
    }
  }

  for (var i = 0; i < orientations.length; i++) {
    if (orientations[i].checked) {
      posShip.orientation = orientations[i].value
    }
  }

  shiploc[player].push(posShip)

  for (var i = 0; i < posShip.ship.size; i++) {
    if (xCek > 74 || yCek > 10) {
      collide = true
      message = 'Kapal tidak bisa diletakan disini karena melebihi bidang permainan'
    } else {
      var block = document.getElementById(`${player}${String.fromCharCode(xCek)}${yCek}`)
      var blockCheat = document.getElementById(`cheat${player}${String.fromCharCode(xCek)}${yCek}`)
      if (block.getAttribute('data-ship') !== null) {
        collide = true
        message = `Kapal tidak bisa ditambahkan karna bertabrakan dengan kapal ${block.getAttribute('data-ship')}`
      }
    }
    if (posShip.orientation === 'menurun') {
      xCek++
    } else {
      yCek++
    }
  }
  
  if (!collide) {
    for (var i = 0; i < posShip.ship.size; i++) {
      var block = document.getElementById(`${player}${String.fromCharCode(x)}${y}`)
      var blockCheat = document.getElementById(`cheat${player}${String.fromCharCode(x)}${y}`)

      block.setAttribute('data-ship', posShip.ship.type)
      block.style.background = 'lime'
      block.textContent = posShip.ship.type.charAt(0)

      blockCheat.setAttribute('data-ship', posShip.ship.type)
      blockCheat.style.background = 'lime'
      blockCheat.textContent = posShip.ship.type.charAt(0)

      if (posShip.orientation === 'menurun') {
        x++
      } else {
        y++
      }
    }
    availShip[player].splice(tempIndexShip, 1)
  } else {
    alert(message)
  }

  settingKapal[player].style.display = 'none'
  console.log('loc : ', shiploc)
}

function startGame () {
  hideShip('p1')
  hideShip('p2')
  gameStart = true
  document.getElementById('start-button').style.display = 'none'
  document.getElementById('p1content').style.display = 'none'
  document.getElementById('p2content').style.display = 'block'
  document.getElementById('endTurn').style.display = 'block'
  document.getElementById('setKapalp1').style.display = 'none'
  document.getElementById('setKapalp2').style.display = 'none'
  document.getElementById('current-player').textContent = currentPlayer

  //cheat
  document.getElementById('cheatp1Content').style.display = 'none'
  document.getElementById('cheatp2Content').style.display = 'block'

  getTotalShipSize()
}

function hideShip (player) {
  for (var i = 65; i <= 74; i++) {
    for (var j = 1; j <= 10; j++) {
      var charAt = String.fromCharCode(i)
      var block = document.getElementById(`${player}${charAt}${j}`)
      var coordinate = block.id
      block.style.background = 'white'
      block.textContent = ''
      block.onclick = fire(coordinate)
    }
  }
}

function fire (coordinate) {
  return function () {
    console.log('currentPlayer : ', currentPlayer)
    if (fireAttempt <= 0) {
      if (gameStart) {
        var target = document.getElementById(coordinate)
        var targetCheat = document.getElementById(`cheat${coordinate}`)
        if (target.getAttribute('data-hit') !== 'hit') {
          if (target.getAttribute('data-ship') !== null) {

            target.style.background = 'red'
            target.textContent = target.getAttribute('data-ship').charAt(0)

            targetCheat.style.background = 'red'
            targetCheat.textContent = target.getAttribute('data-ship').charAt(0)

            if (currentPlayer == 'p1') {
              totalShipSize['p2']--
            } else {
              totalShipSize['p1']--
            }
            alert(`Tembakan Player ${currentPlayer} mengenai ${target.getAttribute('data-ship')}`)
          } else {
            target.style.background = 'skyblue'
            alert(`tembakan Player ${currentPlayer} Miss`)
            console.log(`tembakan Player ${currentPlayer} Miss`)
          }
          target.setAttribute('data-hit', 'hit')
          fireAttempt++
        } else {
          alert('Lokasi yg dipilih telah ditembak')
        }
      } else {
        alert('Permainan Belum Dimulai!!!')
      }
      gameCheck()
    } else {
      alert('Anda Telah Melakukan Tembakan! Silahkan selesaikan giliran anda..')
    }
    console.log('shipLoc : ', totalShipSize)
  } 
}

function changePlayer () {
  fireAttempt = 0
  if (currentPlayer == 'p1') {
    currentPlayer = 'p2'
    document.getElementById('p1content').style.display = 'block'
    document.getElementById('p2content').style.display = 'none'

    //cheat
    document.getElementById('cheatp1Content').style.display = 'block'
    document.getElementById('cheatp2Content').style.display = 'none'
  } else {
    currentPlayer = 'p1'
    document.getElementById('p1content').style.display = 'none'
    document.getElementById('p2content').style.display = 'block'

    //cheat
    document.getElementById('cheatp1Content').style.display = 'none'
    document.getElementById('cheatp2Content').style.display = 'block'
  }
  document.getElementById('current-player').textContent = currentPlayer
}

function gameCheck () {
  if (currentPlayer == 'p1') {
    if (totalShipSize['p2'] === 0) {
      if (currentPlayer == 'p1') {
        alert('Player p1 win')
      } else {
        alert('Player p2 win')
      }
    }
  } else {
    if (totalShipSize['p1'] === 0) {
      if (currentPlayer == 'p1') {
        alert('Player p1 win')
      } else {
        alert('Player p2 win')
      }
    }
  }
}

function getTotalShipSize () {
  shiploc.p1.map((shiploc, index) => {
    totalShipSize.p1 += parseInt(shiploc.ship.size)
  })

  shiploc.p2.map((shiploc, index) => {
    totalShipSize.p2 += parseInt(shiploc.ship.size)
  })
}

function salvo () {
  alert('Cheat diaktifkan!! Sekarang player dapat menembak 5x berturut-turut')
  fireAttempt = -4
}


