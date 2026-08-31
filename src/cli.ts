#!/usr/bin/env node

import { installMaskedAnimations } from "./installers/maskedAnimations.js";
import { installMaskedButtons } from "./installers/maskedButtons.js";
import { installMaskedCards } from "./installers/maskedCards.js";
import { installMaskedDrawer } from "./installers/maskedDrawer.js";
import { installMaskedHooks } from "./installers/maskedHooks.js";
import { installMaskedInput } from "./installers/maskedInput.js";
import { installMaskedPopup } from "./installers/maskedPopup.js";
import { installMaskedSkeleton } from "./installers/maskedSkeleton.js";
import { installMaskedThemes } from "./installers/maskedThemes.js";
import { installMaskedUtils } from "./installers/maskedUtils.js";
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

  if (components.includes("masked-animations")) {
    await installMaskedAnimations();
  }

  if (components.includes("masked-drawer")) {
    await installMaskedDrawer();
  }

  if (components.includes("masked-popup")) {
    await installMaskedPopup();
  }

  if (components.includes("masked-hooks")) {  
    await installMaskedHooks();  
  }

  if (components.includes("masked-utils")) {  
    await installMaskedUtils();  
  }

  if (components.includes("masked-skeleton")) {
    await installMaskedSkeleton();
  }

  if (components.includes("masked-themes")) {
    await installMaskedThemes();
  }

  console.log("✅ Componentes instalados com sucesso!");
}

main();
