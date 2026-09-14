const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailValido(email) {
  return REGEX_EMAIL.test(String(email).trim());
}

export function validarCadastro({ nome, email, senha, confirmarSenha }) {
  if (!nome?.trim() || !email?.trim() || !senha || !confirmarSenha) {
    return 'Preencha todos os campos.';
  }
  if (nome.trim().length < 3) {
    return 'O nome deve ter pelo menos 3 caracteres.';
  }
  if (!emailValido(email)) {
    return 'Informe um e-mail válido.';
  }
  if (senha.length < 6) {
    return 'A senha deve ter pelo menos 6 caracteres.';
  }
  if (senha !== confirmarSenha) {
    return 'As senhas não conferem.';
  }
  return null;
}

export function validarLogin({ email, senha }) {
  if (!email?.trim() || !senha) {
    return 'Preencha e-mail e senha.';
  }
  if (!emailValido(email)) {
    return 'Informe um e-mail válido.';
  }
  return null;
}

export function validarEmailRecuperacao(email) {
  if (!email?.trim()) return 'Informe seu e-mail.';
  if (!emailValido(email)) return 'Informe um e-mail válido.';
  return null;
}

// Traduz os códigos de erro do Firebase Auth para mensagens de usuário
export function mensagemErroFirebase(codigo) {
  const mapa = {
    'auth/invalid-email': 'E-mail inválido.',
    'auth/user-disabled': 'Esta conta foi desativada.',
    'auth/user-not-found': 'Credenciais inválidas.',
    'auth/wrong-password': 'Credenciais inválidas.',
    'auth/invalid-credential': 'Credenciais inválidas.',
    'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
    'auth/requires-recent-login': 'Por segurança, confirme sua senha novamente.',
    'auth/missing-password': 'Informe a senha.',
  };
  return mapa[codigo] || 'Ocorreu um erro. Tente novamente.';
}
