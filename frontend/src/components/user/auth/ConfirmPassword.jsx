import React from 'react'
import { commonModalClasses } from '../../../utils/theme'
import Container from '../../Container'
import FormContainer from '../../form/FormContainer'
import FormInput from '../../form/FormInput'
import Submit from '../../form/Submit'
import Title from '../../form/Title'

export default function ConfirmPassword() {
  return (
    <FormContainer>
      <Container>
        <form className={commonModalClasses + " w-96"}>
          <Title>Enter New Password</Title>
          <FormInput
            type="password"
            name="password"
            placeholder="********"
            label="New Password"
          />
          <FormInput
            type="password"
            name="confirmPassword"
            placeholder="********"
            label="Confirm Password"
          />
          <Submit value="Confirm Password" />
        </form>
      </Container>
    </FormContainer>
  )
}
