# CP4 — App com Autenticação (Firebase Auth)

Tecnologia em Desenvolvimento de Sistemas — 2TDSPF
Mobile Application Development 

## Integrantes

- João Victor Caetano — RM

## Sobre o projeto

Aplicativo mobile em React Native (Expo) com autenticação por e-mail e senha usando Firebase
Authentication. Cobre o ciclo completo da conta do usuário: cadastro, login, persistência da
sessão, logout, recuperação de senha e exclusão da conta.

A sessão é mantida localmente com AsyncStorage: ao fazer login, os dados de identificação
(uid, nome e e-mail) são gravados sob a chave `@cp4auth:sessao` — a senha nunca é armazenada.
Na abertura do app o `AuthContext` verifica essa chave e, havendo sessão, leva o usuário direto
para a área autenticada. No logout e na exclusão da conta a chave é removida.

Não utiliza Firestore.

## Tecnologias

- React Native / Expo (SDK 57)
- Firebase Authentication (Firebase JS SDK v11)
- AsyncStorage
- React Navigation (native-stack)

## Estrutura

```
src
├── components/ui.js            # componentes de formulário e estilos compartilhados
├── contexts/AuthContext.js     # lógica de autenticação e sessão
├── navigation/RootNavigator.js # stack pública e stack autenticada
├── screens/                    # Login, Cadastro, EsqueciSenha, Home, Perfil
├── services/firebaseConfig.js  # inicialização do Firebase
└── utils/validacao.js          # validações de formulário e mensagens de erro
```

As telas autenticadas só são montadas quando existe sessão, então não há rota alcançável sem login.

## Como executar

```bash
npm install
npx expo install --fix
npx expo start
```

Leia o QR Code com o Expo Go, ou pressione `a` para Android, `i` para iOS e `w` para o navegador.

Para rodar com outro projeto do Firebase, substitua as credenciais em `src/services/firebaseConfig.js`
e habilite o provedor E-mail/senha no console.

## Vídeo de demonstração

(link)
