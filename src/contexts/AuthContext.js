import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';

import { auth } from '../services/firebaseConfig';
import { mensagemErroFirebase } from '../utils/validacao';

// A senha nunca é guardada aqui, só os dados de identificação da sessão.
const CHAVE_SESSAO = '@cp4auth:sessao';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    async function verificarSessaoSalva() {
      try {
        const json = await AsyncStorage.getItem(CHAVE_SESSAO);
        if (json) {
          setUsuario(JSON.parse(json));
        }
      } catch (e) {
        console.log('Erro ao ler sessão local:', e);
      } finally {
        setCarregandoSessao(false);
      }
    }
    verificarSessaoSalva();
  }, []);

  async function salvarSessao(firebaseUser, nome) {
    const dados = {
      uid: firebaseUser.uid,
      nome: nome ?? firebaseUser.displayName ?? '',
      email: firebaseUser.email,
      criadoEm: firebaseUser.metadata?.creationTime ?? null,
    };
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(dados));
    setUsuario(dados);
    return dados;
  }

  async function limparSessao() {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
    setUsuario(null);
  }

  async function cadastrar({ nome, email, senha }) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), senha);
      await updateProfile(cred.user, { displayName: nome.trim() });
      await salvarSessao(cred.user, nome.trim());
      return { ok: true };
    } catch (e) {
      return { ok: false, erro: mensagemErroFirebase(e.code) };
    }
  }

  async function entrar({ email, senha }) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), senha);
      await salvarSessao(cred.user);
      return { ok: true };
    } catch (e) {
      return { ok: false, erro: mensagemErroFirebase(e.code) };
    }
  }

  async function sair() {
    try {
      await signOut(auth);
    } catch (e) {
      console.log('Erro no signOut:', e);
    } finally {
      await limparSessao();
    }
    return { ok: true };
  }

  async function recuperarSenha(email) {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { ok: true };
    } catch (e) {
      // Não revelamos se o e-mail existe ou não
      if (e.code === 'auth/user-not-found') return { ok: true };
      return { ok: false, erro: mensagemErroFirebase(e.code) };
    }
  }

  // O Firebase exige login recente para excluir a conta, então
  // pedimos a senha e reautenticamos antes do deleteUser.
  async function excluirConta(senha) {
    try {
      const atual = auth.currentUser;
      if (!atual) {
        await limparSessao();
        return { ok: false, erro: 'Sessão expirada. Faça login novamente.' };
      }

      const credencial = EmailAuthProvider.credential(atual.email, senha);
      await reauthenticateWithCredential(atual, credencial);
      await deleteUser(atual);
      await limparSessao();
      return { ok: true };
    } catch (e) {
      return { ok: false, erro: mensagemErroFirebase(e.code) };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: !!usuario,
        carregandoSessao,
        cadastrar,
        entrar,
        sair,
        recuperarSenha,
        excluirConta,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de um AuthProvider');
  return ctx;
}
