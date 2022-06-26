import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useNotification } from "../../../hooks";
import { commonModalClasses } from "../../../utils/theme";
import Container from "../../Container";
import CustomLink from "../../CustomLink";
import FormContainer from "../../form/FormContainer";
import FormInput from "../../form/FormInput";
import Submit from "../../form/Submit";
import Title from "../../form/Title";

const validateUserInfo = ({email, password}) => {
  const isValidEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  
  if(!email.trim()) return {ok: false, error: 'Email is missing'}
  if (!isValidEmail.test(email)) return {ok: false, error: 'Invalid Email'}

  if(!password.trim()) return {ok: false, error: 'Password is missing'}
  if(password.length < 8) return {ok: false, error: 'Password must be 8 characters long'}

  return {ok: true}
}

export default function Signin() {

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: ""
  })

  const navigate = useNavigate()
  const {updateNotification} = useNotification()
  const {handleLogin, authInfo} = useAuth()
  const {isPending, isLoggedIn} = authInfo

  const handleChange = ({target}) => {
    const {value, name} = target
    setUserInfo({...userInfo, [name]:value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const {ok, error} = validateUserInfo(userInfo)

    if(!ok) return updateNotification('error', error)
    handleLogin(userInfo.email, userInfo.password)    
  }

  useEffect(() => {
    // move user to somewhere else
    if(isLoggedIn) navigate('/')
  }, [isLoggedIn])

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign In</Title>
          <FormInput
            type="text"
            name="email"
            placeholder="john@email.com"
            label="Email"
            value={userInfo.email}
            onChange={handleChange}
          />
          <FormInput
            type="password"
            name="password"
            placeholder="********"
            label="Password"
            value={userInfo.password}
            onChange={handleChange}
          />
          <Submit value="Sign In" busy={isPending} />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget Password</CustomLink>
            <CustomLink to="/auth/signup">Sign up</CustomLink>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
}
