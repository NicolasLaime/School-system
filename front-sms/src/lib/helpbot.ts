export interface HelpBot {
    question: string;
    answer: string;
}


export const helpBotData: HelpBot[] = [
    {
        question: "hola",
        answer: "Hola, ¿en qué puedo ayudarte?",
    },
    {
        question: "¿Cómo puedo cambiar mi contraseña?",
        answer: "Para cambiar tu contraseña, debes dirigirte a la sección de configuración de tu perfil. Allí encontrarás la opción de cambiar contraseña.",
    },
    {
        question: "¿Qué puedo hacer si olvidé mi contraseña?",
        answer: "Para cambiar tu contraseña, debes dirigirte a la sección de configuración de tu perfil. Allí encontrarás la opción de cambiar contraseña.",
    },
    {
        question: "¿Como agregar un alumno",
        answer: "Debes dirigirte al menú de alumnos y hacer clic en el botón 'Agregar alumno'. Luego, completa el formulario con la información del alumno.",
    },
    {
        question: "¿Como agregar un profesor?",
        answer: "Debes dirigirte al menú de profesores y hacer clic en el botón 'Agregar profesor'. Luego, completa el formulario con la información del profesor.",
    },
    
]