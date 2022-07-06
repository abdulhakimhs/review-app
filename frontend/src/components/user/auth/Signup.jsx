import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUser } from "../../../api/auth";
import { useAuth, useNotification } from "../../../hooks";
import { isValidEmail } from "../../../utils/helper";
import { commonModalClasses } from "../../../utils/theme";
import Container from "../../Container";
import CustomLink from "../../CustomLink";
import FormContainer from "../../form/FormContainer";
import FormInput from "../../form/FormInput";
import Submit from "../../form/Submit";
import Title from "../../form/Title";

const validateUserInfo = ({name, email, password}) => {
  const isValidName = /^[a-z A-Z]+$/

  if(!name.trim()) return {ok:false, error: 'Name is missing'}
  if(!isValidName.test(name)) return {ok:false, error: 'Invalid Name'}
  
  if(!email.trim()) return {ok: false, error: 'Email is missing'}
  if (!isValidEmail(email)) return {ok: false, error: 'Invalid Email'}

  if(!password.trim()) return {ok: false, error: 'Password is missing'}
  if(password.length < 8) return {ok: false, error: 'Password must be 8 characters long'}

  return {ok: true}
}

export default function Signup() {

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: ""
  })

  const {authInfo} = useAuth()
  const {isLoggedIn} = authInfo
  const navigate = useNavigate()

  const {updateNotification} = useNotification()

  const handleChange = ({target}) => {
    const {value, name} = target
    setUserInfo({...userInfo, [name]:value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const {ok, error} = validateUserInfo(userInfo)

    if(!ok) return updateNotification('error', error)

    const response = await createUser(userInfo)
    if(response.error) return console.log(response.error)

    navigate('/auth/verification', {
      state: {user: response.user}, 
      replace: true,
    })
    
  }

  useEffect(() => {
    // move user to somewhere else
    if(isLoggedIn) navigate('/')
  }, [isLoggedIn])

  const {name, email, password} = userInfo

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign Up</Title>
          <FormInput
            type="text"
            name="name"
            placeholder="John Doe"
            label="Your Name"
            value={name}
            onChange={handleChange}
          />
          <FormInput
            type="text"
            name="email"
            placeholder="john@email.com"
            label="Email"
            value={email}
            onChange={handleChange}
          />
          <FormInput
            type="password"
            name="password"
            placeholder="********"
            label="Password"
            value={password}
            onChange={handleChange}
          />
          <Submit value="Sign Up" />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget Password</CustomLink>
            <CustomLink to="/auth/signin">Sign in</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
