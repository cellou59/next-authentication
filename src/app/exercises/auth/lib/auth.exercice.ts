/* eslint-disable @typescript-eslint/no-unused-vars */
import {RoleEnum} from '@/lib/type'
// 🐶 Importe `bcrypt` from `'bcrypt'`
import bcrypt from 'bcrypt'

// 🐶 Importe `bcrypt` from 'addUser' 'getUserByEmail'
import {addUser, getUserByEmail} from '@/db/sgbd'
import {SignInError} from './type'

const signUp = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log('Signing up...', email, password)

  // 🐶 1. Vérification de l'utilisateur en BDD
  // Lève une erreur si l'utilisateur existe déjà
  const user = await getUserByEmail(email)
  if (user) {
    throw {
      type: 'CredentialsSignin',
      message: 'Invalid User.',
    } as SignInError
  }

  // 🐶 2. Hachage du mot de passe
  // https://github.com/kelektiv/node.bcrypt.js?tab=readme-ov-file#to-hash-a-password
  const saltRounds = 10
  const salt = await bcrypt.genSalt(saltRounds)

  // Hachage du mot de passe avec le salt
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = {
    email,
    password: hashedPassword,
    name: 'Not used',
    role: RoleEnum.USER,
  }
  // 🐶 3. Ajout de l'utilisateur en BDD
  const createdUser = await addUser(newUser)
  if (!createdUser) {
    throw {
      type: 'CredentialsSignin',
      message: 'add user error',
    } as SignInError
  }

  // 🐶 4. Retourne l'utilisateur créé
  return {...createdUser, role: RoleEnum.USER}
}

const signIn = async (email: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log('signIn ...', email, password)

  // 🐶 1. Vérification de l'utilisateur en BDD
  const user = await getUserByEmail(email)

  // Lève une erreur si l'utilisateur n'existe pas
  if (!user) {
    throw {
      type: 'CredentialsSignin',
      message: 'Invalid User.',
    } as SignInError
  }

  // 🐶 2. Comparaison du mot de passe
  const match = await bcrypt.compare(password, user.password)

  if (!match) {
    throw {
      type: 'CredentialsSignin',
      message: 'Invalid password.',
    } as SignInError
  }

  // Lève une erreur si le mot de passe ne correspond pas : message: `Invalid credentials.`
  // 🐶 Retourne le user de BDD.
  return {user, role: RoleEnum.USER}
}

async function logout() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return {message: 'Logout successful'}
}

export const auth = {signIn, signUp, logout}
