#!/usr/bin/env node

import { installMaskedButtons } from "./installers/maskedButtons.js";
import { installMaskedCards } from "./installers/maskedCards.js";
import { installMaskedInput } from "./installers/maskedInput.js";
import { selectComponents } from "./prompts/selectComponents.js";

async function main() {
  const components = await selectComponents();

  if (!components.length) {
    console.log("Nenhum componente selecionado.");
    return;
  }

  if (components.includes("masked-input")) {
    await installMaskedInput();
  }

  if (components.includes("masked-cards")) {
    await installMaskedCards();
  }

  if (components.includes("masked-buttons")) {
    await installMaskedButtons();
  }

  console.log("✅ Componentes instalados com sucesso!");
}

main();
