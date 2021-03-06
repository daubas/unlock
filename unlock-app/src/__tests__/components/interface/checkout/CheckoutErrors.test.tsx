import React from 'react'
import * as rtl from '@testing-library/react'
import { CheckoutErrors } from '../../../../components/interface/checkout/CheckoutErrors'
import { UnlockError } from '../../../../utils/Error'

const fatalError: UnlockError = {
  level: 'Fatal',
  kind: 'Storage',
  message: 'Could not log in',
}

const warningError: UnlockError = {
  level: 'Warning',
  kind: 'Transaction',
  message: 'Something happened :c',
}

const diagnosticError: UnlockError = {
  level: 'Diagnostic',
  kind: 'FormValidation',
  message: 'That is not a great password',
}

const errors = [fatalError, warningError, diagnosticError]
let resetError: jest.Mock<any, any>
describe('Checkout Errors', () => {
  beforeEach(() => {
    resetError = jest.fn()
  })

  it('renders', () => {
    expect.assertions(0)

    const { getByText } = rtl.render(
      <CheckoutErrors errors={errors} resetError={resetError} />
    )

    getByText(fatalError.message)
    getByText(warningError.message)
    getByText(diagnosticError.message)
  })

  it('resets the appropriate error on click', () => {
    expect.assertions(1)

    const { getByText } = rtl.render(
      <CheckoutErrors errors={errors} resetError={resetError} />
    )

    const fatal = getByText(fatalError.message)
    rtl.fireEvent.click(fatal)

    expect(resetError).toHaveBeenCalledWith(fatalError)
  })
})
