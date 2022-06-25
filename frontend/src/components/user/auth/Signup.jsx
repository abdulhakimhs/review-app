import React from "react";
import { commonModalClasses } from "../../../utils/theme";
import Container from "../../Container";
import CustomLink from "../../CustomLink";
import FormContainer from "../../form/FormContainer";
import FormInput from "../../form/FormInput";
import Submit from "../../form/Submit";
import Title from "../../form/Title";

export default function Signup() {
  return (
    <FormContainer>
      <Container>
        <form className={commonModalClasses + " w-72"}>
          <Title>Sign Up</Title>
          <FormInput
            type="text"
            name="name"
            placeholder="John Doe"
            label="Your Name"
          />
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
          <Submit value="Sig Up" />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget Password</CustomLink>
            <CustomLink to="/auth/signin">Sign in</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
