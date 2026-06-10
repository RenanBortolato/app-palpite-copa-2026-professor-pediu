import { useState, useRef } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Modal,
  FlatList,
  Animated,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import * as Haptics from "expo-haptics";
import { SELECOES_COPA_2026 } from "@/constants/copa2026";

export default function HomeScreen() {
  const [nome, setNome] = useState("");
  const [selecao, setSelecao] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [erros, setErros] = useState({ nome: false, selecao: false });

  // Animação da bola
  const ballX = useRef(new Animated.Value(0)).current;
  const ballY = useRef(new Animated.Value(0)).current;
  const ballScale = useRef(new Animated.Value(1)).current;
  const ballOpacity = useRef(new Animated.Value(0)).current;

  function validarCampos() {
    const novoErros = {
      nome: !nome.trim(),
      selecao: !selecao.trim(),
    };
    setErros(novoErros);
    return !novoErros.nome && !novoErros.selecao;
  }

  function animarBola() {
    // Resetar valores
    ballX.setValue(0);
    ballY.setValue(0);
    ballScale.setValue(1);
    ballOpacity.setValue(1);

    // Animar bola chutando pro gol
    Animated.sequence([
      Animated.parallel([
        Animated.timing(ballX, {
          toValue: 300,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(ballY, {
          toValue: -400,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(ballScale, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(ballOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function handleEnviar() {
    if (!validarCampos()) {
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    animarBola();
    setEnviado(true);
  }

  function selecionarSelecao(s: string) {
    setSelecao(s);
    setDropdownAberto(false);
    setErros((prev) => ({ ...prev, selecao: false }));
  }

  const selecoesFiltradas = SELECOES_COPA_2026.filter((s) =>
    s.toLowerCase().includes(selecao.toLowerCase())
  );

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
          <Text style={styles.label}>
            Meu nome: <Text style={styles.obrigatorio}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, erros.nome && styles.inputErro]}
            placeholder="Digite seu nome"
            placeholderTextColor="#9BA1A6"
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              if (text.trim()) {
                setErros((prev) => ({ ...prev, nome: false }));
              }
            }}
            returnKeyType="next"
            autoCapitalize="words"
          />
          {erros.nome && (
            <Text style={styles.mensagemErro}>Nome é obrigatório</Text>
          )}

          {/* Campo: Seleção campeã (Dropdown) */}
          <Text style={[styles.label, { marginTop: 20 }]}>
            A seleção nacional campeã da Copa de 2026:{" "}
            <Text style={styles.obrigatorio}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.dropdown, erros.selecao && styles.inputErro]}
            onPress={() => setDropdownAberto(true)}
          >
            <Text
              style={[
                styles.dropdownTexto,
                !selecao && styles.dropdownPlaceholder,
              ]}
            >
              {selecao || "Selecione uma seleção..."}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          {erros.selecao && (
            <Text style={styles.mensagemErro}>
              Selecione uma seleção obrigatoriamente
            </Text>
          )}

          {/* Modal do Dropdown */}
          <Modal
            visible={dropdownAberto}
            transparent
            animationType="fade"
            onRequestClose={() => setDropdownAberto(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setDropdownAberto(false)}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitulo}>Selecione a seleção</Text>
                  <TouchableOpacity onPress={() => setDropdownAberto(false)}>
                    <Text style={styles.modalFechar}>✕</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={selecoesFiltradas}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dropdownItem,
                        selecao === item && styles.dropdownItemSelecionado,
                      ]}
                      onPress={() => selecionarSelecao(item)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemTexto,
                          selecao === item &&
                            styles.dropdownItemTextoSelecionado,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  scrollEnabled
                  style={{ maxHeight: 400 }}
                />
              </View>
            </TouchableOpacity>
          </Modal>
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
            <Text style={styles.confirmacaoSubtexto}>
              {nome} aposta no {selecao}
            </Text>
          </View>
        )}

        {/* Animação da bola */}
        <Animated.View
          style={[
            styles.bola,
            {
              transform: [
                { translateX: ballX },
                { translateY: ballY },
                { scale: ballScale },
              ],
              opacity: ballOpacity,
            },
          ]}
        >
          <Text style={styles.bolaTexto}>⚽</Text>
        </Animated.View>
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
  obrigatorio: {
    color: "#EF4444",
    fontWeight: "900",
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
  inputErro: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  mensagemErro: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  dropdown: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownTexto: {
    fontSize: 16,
    color: "#11181C",
    flex: 1,
  },
  dropdownPlaceholder: {
    color: "#9BA1A6",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#687076",
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#11181C",
  },
  modalFechar: {
    fontSize: 24,
    color: "#687076",
    fontWeight: "600",
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  dropdownItemSelecionado: {
    backgroundColor: "#E6F4EA",
  },
  dropdownItemTexto: {
    fontSize: 16,
    color: "#11181C",
  },
  dropdownItemTextoSelecionado: {
    color: "#006600",
    fontWeight: "700",
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
  confirmacaoSubtexto: {
    color: "#006600",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "500",
  },
  bola: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    bottom: 100,
    left: 50,
  },
  bolaTexto: {
    fontSize: 40,
  },
});
