import React from "react";
import Container from "../../Container";
import CustomLink from "../../CustomLink";
import FormInput from "../../form/FormInput";
import Submit from "../../form/Submit";
import Title from "../../form/Title";

export default function Signup() {
  return (
    <div className="fixed inset-0 bg-primary -z-10 flex justify-center items-center">
      <Container>
        <form className="bg-secondary rounded p-6 w-72 space-y-6">
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
    </div>
  );
}
