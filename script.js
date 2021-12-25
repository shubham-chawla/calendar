const wrapper = document.querySelector('.wrapper')

const meetings = [
  {
    title: 'Meeting with Alice',
    startTime: '00:45',
    endTime: '2:30',
    color: 'tomato'
  },
  {
    title: 'Build Systems 3',
    startTime: '20:30',
    endTime: '22:00',
    color: 'purple'
  },
  {
    title: 'Meeting with bob',
    startTime: '3:00',
    endTime: '4:00',
    color: 'blue'
  },
  {
    title: 'Build Systems',
    startTime: '17:30',
    endTime: '24:00',
    color: 'green'
  },
  {
    title: 'Build Systems 2',
    startTime: '19:30',
    endTime: '24:00',
    color: 'chocolate'
  }
]

function getMeetTime(meet) {
  const startArray = meet.split(':').map(x => parseInt(x, 10))
  return startArray[0] + startArray[1] / 60  
}

function isConflictingMeeting(meetStart, meetIdx) {
  const currentStart = getMeetTime(meetStart)

  const conflictingMeetings = meetings.filter((x, idx) => {
    const start = getMeetTime(x.startTime)
    const finish = getMeetTime(x.endTime)
    if (idx < meetIdx && start <= currentStart && finish >= currentStart) return x
  })

  return conflictingMeetings.length
}

function getTime(val) {
  const rem = val % 12
  const time = rem ? rem : 12
  let meridian = 'am'
  if ((!rem && val === 12) || (rem && val > 12)) {
    meridian = 'pm'
  }
  return `${time}:00 ${meridian}`
}

/**
 * 
 * @param {string: endTime} end 
 * @param {string: startTime} start 
 * @returns {int: duration in hrs}
 */
function getDuration(end, start) {
  const endArray = end.split(':')
  const startArray = start.split(':')
  const endMins = parseInt(endArray[1], 10) - parseInt(startArray[1], 10)
  const endHrs = (parseInt(endArray[0], 10) - parseInt(startArray[0], 10)) * 60

  return (endHrs + endMins) / 60
}

function createSlots() {
  Array.from({ length: 24 }, (_val, idx) => {
    const slot = document.createElement('div')
    slot.className = `slot s-${idx + 1}-00`

    const time = document.createElement('div')
    time.className = `time time-s-${idx + 1}-00`
    time.innerHTML = getTime(idx + 1)

    const box = document.createElement('div')
    box.className = `box box-s-${idx + 1}-00`

    slot.appendChild(time)
    slot.appendChild(box)
    wrapper.appendChild(slot)
  })
}

function createMeetingCard({ startTime, endTime, title, color }, idx) {
  const duration = getDuration(endTime, startTime) // endtime - starttime
  const card = document.createElement('div')
  card.innerHTML = `<div class="details">${title}<br />${startTime}-${endTime}</div>`
  card.style.height = `${duration * 50}px`
  card.style.backgroundColor = color
  card.style.position = 'absolute'
  card.style.inset = 0
  card.style.outline = '1px solid white'
  card.style.borderRadius = '4px'
  card.style.zIndex = 1
  card.style.transform = `translateY(${Math.floor(50 * parseInt(startTime.split(':')[1]) / 60)}px)`

  const conflictingMeetingsLength = isConflictingMeeting(startTime, idx)

  if (conflictingMeetingsLength) {
    card.style.width = `${Math.floor(100 - 100 / (1 + conflictingMeetingsLength))}%`
    card.style.left = `${Math.floor(100 - 100 / (1 + conflictingMeetingsLength))}%`
  }

  return card
}

function meetingsInit() {
  meetings.forEach((meeting, idx) => {
    const card = createMeetingCard(meeting, idx)
    const cardSlot = document.querySelector(`.box-s-${parseInt(meeting.startTime.split(':')[0], 10) + 1}-00`)

    cardSlot.appendChild(card)
  })
}

createSlots()
meetingsInit()