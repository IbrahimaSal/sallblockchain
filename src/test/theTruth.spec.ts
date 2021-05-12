/* import { theTruth } from '../testFunction' */
 const { theTruth } = require('../testFunction') 

describe ('ma première suite de tests', () => {
  test('mon premier test', () => {
    const isTrue = theTruth()
    expect(isTrue).toBe(true)
  })
})
