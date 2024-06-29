import { describe, it, expect, expectTypeOf } from 'vitest'
import celsiusToFahrenheit from './celsiusToFahrenheit'

describe('Celsius To Fahrenheit', () => {
    it('convert', () => {
        expect(celsiusToFahrenheit(1)).toBe(33)
        expect(celsiusToFahrenheit(30)).toBe(86)
    })

    it('type check', () => {
        expectTypeOf(celsiusToFahrenheit).toBeFunction()
        expectTypeOf(celsiusToFahrenheit).parameter(0).toMatchTypeOf<number>()
    })
})