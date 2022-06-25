import React from "react";
import { commonModalClasses } from "../../../utils/theme";
import Container from "../../Container";
import CustomLink from "../../CustomLink";
import FormContainer from "../../form/FormContainer";
import FormInput from "../../form/FormInput";
import Submit from "../../form/Submit";
import Title from "../../form/Title";

export default function Signin() {
  return (
    <FormContainer>
      <Container>
        <form className={commonModalClasses + " w-72"}>
          <Title>Sign In</Title>
          <FormInput
            type="text"
            name="email"
            placeholder="john@email.com"
            label="Email"
          />
          <FormInput
            type="password"
            name="password"
            placeholder="********"
            label="Password"
          />
          <Submit value="Sig In" />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget Password</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
