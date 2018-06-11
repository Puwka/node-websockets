import {generateDate} from './date'

export function generateMessage (from, text) {
    return {
        from,
        text,
        createdAt: generateDate()
    }
}