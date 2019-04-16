import React from 'react'
import { storiesOf } from '@storybook/react'
import { signupEmail } from '../../actions/signUp'

import { SignUp } from '../../components/interface/SignUp'

storiesOf('SignUp page', module).add('The SignUp Page', () => {
  return <SignUp signupEmail={signupEmail} />
})
