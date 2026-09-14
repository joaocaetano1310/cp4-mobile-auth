import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { Botao, cores, estilos } from '../components/ui';

export default function HomeScreen({ navigation }) {
  const { usuario } = useAuth();

  return (
    <ScrollView contentContainerStyle={[estilos.tela, { justifyContent: 'flex-start', paddingTop: 48 }]}>
      <Text style={estilos.titulo}>Olá, {usuario?.nome || 'usuário'} 👋</Text>
      <Text style={estilos.subtitulo}>Você está na área autenticada do aplicativo.</Text>

      <View style={local.cartao}>
        <Text style={local.cartaoTitulo}>Sessão ativa</Text>
        <Text style={local.cartaoTexto}>
          Sua sessão está salva localmente com AsyncStorage. Feche e abra o aplicativo: você
          continuará autenticado.
        </Text>
      </View>

      <Botao titulo="Minha conta / Perfil" onPress={() => navigation.navigate('Perfil')} />
    </ScrollView>
  );
}

const local = StyleSheet.create({
  cartao: {
    backgroundColor: cores.cartao,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  cartaoTitulo: { color: cores.texto, fontSize: 16, fontWeight: '700', marginBottom: 6 },
  cartaoTexto: { color: cores.textoFraco, fontSize: 14, lineHeight: 20 },
});
