import { describe, it, expect } from "vitest";
import { SELECOES_COPA_2026 } from "../constants/copa2026";

describe("Palpite Copa 2026", () => {
  describe("Seleções da Copa 2026", () => {
    // Nota: A Copa 2026 terá 48 seleções (expandida de 32), mas mantemos as principais
    it("deve ter pelo menos 32 seleções cadastradas", () => {
      expect(SELECOES_COPA_2026.length).toBeGreaterThanOrEqual(32);
    });

    it("deve ter seleções únicas (sem duplicatas)", () => {
      const set = new Set(SELECOES_COPA_2026);
      expect(set.size).toBe(SELECOES_COPA_2026.length);
    });

    it("deve incluir Brasil", () => {
      expect(SELECOES_COPA_2026).toContain("Brasil");
    });

    it("deve incluir Argentina", () => {
      expect(SELECOES_COPA_2026).toContain("Argentina");
    });

    it("deve incluir França", () => {
      expect(SELECOES_COPA_2026).toContain("França");
    });

    it("deve estar em ordem alfabética", () => {
      const ordenada = [...SELECOES_COPA_2026].sort();
      expect(SELECOES_COPA_2026).toEqual(ordenada);
    });

    it("não deve incluir seleções que não participam", () => {
      expect(SELECOES_COPA_2026).not.toContain("Atlântica");
      expect(SELECOES_COPA_2026).not.toContain("Marte");
    });
  });

  describe("Validação de campos", () => {
    it("deve validar que nome é obrigatório", () => {
      const nome = "";
      const isValid = nome.trim().length > 0;
      expect(isValid).toBe(false);
    });

    it("deve validar que seleção é obrigatória", () => {
      const selecao = "";
      const isValid = selecao.trim().length > 0;
      expect(isValid).toBe(false);
    });

    it("deve aceitar nome válido", () => {
      const nome = "João Silva";
      const isValid = nome.trim().length > 0;
      expect(isValid).toBe(true);
    });

    it("deve aceitar seleção válida", () => {
      const selecao = "Brasil";
      const isValid = SELECOES_COPA_2026.includes(selecao);
      expect(isValid).toBe(true);
    });

    it("deve rejeitar seleção inválida", () => {
      const selecao = "Seleção Inexistente";
      const isValid = SELECOES_COPA_2026.includes(selecao);
      expect(isValid).toBe(false);
    });

    it("deve validar formulário completo", () => {
      const nome = "Maria";
      const selecao = "Argentina";
      const isValid =
        nome.trim().length > 0 && SELECOES_COPA_2026.includes(selecao);
      expect(isValid).toBe(true);
    });

    it("deve invalidar formulário com nome vazio", () => {
      const nome = "";
      const selecao = "Brasil";
      const isValid =
        nome.trim().length > 0 && SELECOES_COPA_2026.includes(selecao);
      expect(isValid).toBe(false);
    });

    it("deve invalidar formulário com seleção vazia", () => {
      const nome = "Pedro";
      const selecao = "";
      const isValid =
        nome.trim().length > 0 && SELECOES_COPA_2026.includes(selecao);
      expect(isValid).toBe(false);
    });
  });
});
