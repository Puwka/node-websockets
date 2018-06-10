import 'babel-polyfill'
import expect from 'expect'
import { generateMessage } from './message'


describe('generateMessage', () => {
    it('Should generate the correct message object', () => {
        const data = {
            from: 'Puwka',
            text: 'Some message'
        }
        const message = generateMessage(data)

        expect(typeof message.createdAt).toBeA('number')
        expect(message).toMatchObject({
            from: data.from,
            text: data.text
        })
    })
})