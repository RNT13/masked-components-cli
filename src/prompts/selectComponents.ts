import prompts from "prompts";

export async function selectComponents(): Promise<string[]> {
  const response = await prompts({
    type: "multiselect",
    name: "components",
    message: "Quais componentes deseja instalar?",
    choices: [
      { title: "Masked Input", value: "masked-input" },
      { title: "Masked Cards", value: "masked-cards" },
      { title: "Masked Buttons", value: "masked-buttons" },
    ],
  });

  return response.components ?? [];
}
