import prompts from "prompts";
import type { ComponentEntry } from "../registry";
import type { Framework } from "../types";

/** Escolha interativa; devolve [] se o usuário cancelar. */
export async function selectComponents(
  entries: ComponentEntry[],
  framework: Framework,
): Promise<string[]> {
  const choices = entries
    .filter(
      (entry) => !entry.frameworks || entry.frameworks.includes(framework),
    )
    .map((entry) => ({
      title: entry.label,
      value: entry.id,
      description: entry.description,
    }));

  let cancelled = false;
  const answer = await prompts(
    {
      type: "multiselect",
      name: "ids",
      message: "Quais componentes deseja instalar?",
      hint: "espaço seleciona · enter confirma",
      instructions: false,
      min: 1,
      choices,
    },
    {
      onCancel: () => {
        cancelled = true;
        return false;
      },
    },
  );

  return cancelled ? [] : ((answer.ids as string[] | undefined) ?? []);
}

export async function confirm(
  message: string,
  initial = true,
): Promise<boolean> {
  let cancelled = false;
  const answer = await prompts(
    { type: "confirm", name: "ok", message, initial },
    {
      onCancel: () => {
        cancelled = true;
        return false;
      },
    },
  );
  return !cancelled && Boolean(answer.ok);
}
