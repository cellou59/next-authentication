import {RoleEnum} from '@/lib/type'
import bcrypt from 'bcrypt'
import {addUser, getUserByEmail} from '@/db/sgbd'
import {SignInError} from './type'
import {createSession, deleteSession} from './session-stateless'

const signUp = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = await getUserByEmail(email)
  if (user) {
    throw new Error('User already exists')
  }
  console.log('Signing up...', email, password)
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)

  // Hachage du mot de passe avec le salt
  const hashedPassword = await bcrypt.hash(password, salt)
  const newUser = {
    email,
    password: hashedPassword,
    name: 'John Doe',
    role: RoleEnum.SUPER_ADMIN, //RoleEnum.USER,
  }
  const createdUser = await addUser(newUser)
  await createSession(createdUser.id)
  return {email: createdUser.email, role: createdUser.role}
}

const signIn = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = await getUserByEmail(email)
  console.log('Auth : signIn ...', email, password, user)
  if (!user) {
    // eslint-disable-next-line no-throw-literal
    throw {
      type: 'CredentialsSignin',
      message: 'Invalid User.',
    } as SignInError
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    // eslint-disable-next-line no-throw-literal
    throw {
      type: 'CredentialsSignin',
      message: 'Invalid credentials.',
    } as SignInError
  }
  await createSession(user.id)
  return {email: user.email, role: user.role}
}

async function logout() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  await deleteSession()
  return {message: 'Logout successful'}
}

export const auth = {signIn, signUp, logout}
