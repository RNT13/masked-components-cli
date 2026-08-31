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
      { title: "Masked Animations", value: "masked-animations" },  
      { title: "Masked Drawer", value: "masked-drawer" },  
      { title: "Masked Popup", value: "masked-popup" },  
      { title: "Masked Skeleton", value: "masked-skeleton" },  
      { title: "Masked Themes", value: "masked-themes" },  
      { title: "Masked Hooks", value: "masked-hooks" },
      { title: "Masked Utils", value: "masked-utils" },
    ],  
  });  
  
  return response.components ?? [];  
}