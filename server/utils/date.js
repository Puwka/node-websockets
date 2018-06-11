export function generateDate () {
    const timestamp = new Date()
    let hours = timestamp.getHours()
    let minutes = timestamp.getMinutes()
    let seconds = timestamp.getSeconds()
    if (hours < 10) hours = `0${hours}`
    if (minutes < 10) minutes = `0${minutes}`
    if (seconds < 10) seconds = `0${seconds}`
    return `${hours}:${minutes}:${seconds}`
}