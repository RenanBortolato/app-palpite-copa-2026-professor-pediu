import { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const [nome, setNome] = useState("");
  const [selecao, setSelecao] = useState("");
  const [enviado, setEnviado] = useState(false);

  function handleEnviar() {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setEnviado(true);
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.trophy}>🏆</Text>
          <Text style={styles.titulo}>Palpite Copa 2026</Text>
          <Text style={styles.subtitulo}>Quem vai ser campeão?</Text>
        </View>

        {/* Card do formulário */}
        <View style={styles.card}>
          {/* Campo: Meu nome */}
          <Text style={styles.label}>Meu nome:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#9BA1A6"
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
            autoCapitalize="words"
          />

          {/* Campo: Seleção campeã */}
          <Text style={[styles.label, { marginTop: 20 }]}>
            A seleção nacional campeã da Copa de 2026:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Brasil, Argentina..."
            placeholderTextColor="#9BA1A6"
            value={selecao}
            onChangeText={setSelecao}
            returnKeyType="done"
            autoCapitalize="words"
            onSubmitEditing={handleEnviar}
          />
        </View>

        {/* Botão enviar */}
        <TouchableOpacity
          style={[
            styles.botao,
            (!nome.trim() || !selecao.trim()) && styles.botaoDesabilitado,
          ]}
          onPress={handleEnviar}
          disabled={!nome.trim() || !selecao.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoTexto}>Enviar Palpite</Text>
        </TouchableOpacity>

        {/* Mensagem de confirmação */}
        {enviado && (
          <View style={styles.confirmacao}>
            <Text style={styles.confirmacaoTexto}>✅ Palpite enviado!</Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  trophy: {
    fontSize: 56,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "800",
    color: "#006600",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 15,
    color: "#687076",
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#11181C",
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#11181C",
  },
  botao: {
    width: "100%",
    backgroundColor: "#006600",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#006600",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  botaoDesabilitado: {
    backgroundColor: "#9BA1A6",
    shadowOpacity: 0,
    elevation: 0,
  },
  botaoTexto: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  confirmacao: {
    marginTop: 28,
    backgroundColor: "#e6f4ea",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderWidth: 1.5,
    borderColor: "#006600",
    alignItems: "center",
  },
  confirmacaoTexto: {
    color: "#006600",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
