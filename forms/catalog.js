window.GX_FORM_CATALOG = {
  catalogVersion: '2026-07-07',
  forms: {
    A: {
      activeVersion: 'v2',
      versions: {
        v1: {
          id: 'v1',
          label: 'Initial extracted version',
          status: 'archived',
          form: {
            id: 'form-a',
            title: 'Formulario A - Home Guruxy',
            duration: '12 a 18 minutos',
            target: 'Cualquier tester (incluso sin conocimiento previo)',
            sections: [{
              title: 'Sección A0 - Datos Rápidos',
              questions: [
                { id: 'A0.1', text: 'Nombre del tester', type: 'Short Text', options: [] },
                { id: 'A0.2', text: 'Dispositivo usado', type: 'Multiple Choice', options: ['Desktop', 'Mobile', 'Tablet'] },
                { id: 'A0.3', text: 'Navegador', type: 'Multiple Choice', options: ['Chrome', 'Safari', 'Brave', 'Edge', 'Firefox', 'Otro'] },
                { id: 'A0.4', text: 'Nivel digital', type: 'Multiple Choice', options: ['Bajo', 'Medio', 'Alto'] },
                { id: 'A0.5', text: '¿La prueba fue moderada?', type: 'Multiple Choice', options: ['Sí', 'No'] }
              ]
            }, {
              title: 'Sección A1 - Primera Impresión',
              instruction: 'Nota para moderador: no expliques qué es Guruxy antes de esta tarea para medir comprensión espontánea.',
              questions: [
                { id: 'A1.1', text: 'Mira el Home durante 10 segundos. ¿Qué crees que hace Guruxy?', type: 'Paragraph', options: [], mediaUrl: 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/primera-impresion.jpg', mediaType: 'image', mediaHint: 'Home de Guruxy — pantalla que está evaluando el tester' },
                { id: 'A1.2', text: '¿El tester entendió la propuesta de valor?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'A1.3', text: '¿Qué conceptos mencionó espontáneamente?', type: 'Checkboxes', options: ['Expertos/Gurús', 'Clientes', 'Consultas', 'Agenda', 'Pagos', 'Videollamada', 'Marketplace', 'Servicios', 'No entendió'] },
                { id: 'A1.4', text: 'Del 1 al 5, ¿qué tan claro fue el mensaje principal?', type: 'Linear Scale (1-5)', options: ['1 (Nada claro)', '5 (Muy claro)'] },
                { id: 'A1.5', text: '¿Qué frase o elemento del Home le ayudó más a entender?', type: 'Paragraph', options: [] }
              ]
            }, {
              title: 'Sección A2 - Navegación y Búsqueda',
              instruction: 'Nota para moderador: pide al tester encontrar algo, no le digas exactamente dónde hacer clic.',
              questions: [
                { id: 'A2.1', text: 'Tarea: busca dónde encontrarías un especialista. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'], mediaUrl: 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-navigation.jpg', mediaType: 'image', mediaHint: 'Home - zona de navegacion y busqueda de especialistas' },
                { id: 'A2.2', text: '¿Encontró el buscador principal?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'A2.3', text: '¿Entendió la diferencia entre Todos, Gurús y Especialidades?', type: 'Linear Scale (1-5)', options: ['1 (Nada claro)', '5 (Muy claro)'] },
                { id: 'A2.4', text: '¿Qué nombre sería más claro para esas opciones?', type: 'Paragraph', options: [] },
                { id: 'A2.5', text: 'Tarea: explora una categoría. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'A2.6', text: 'En mobile, ¿entendió que la barra de categorías se mueve horizontalmente?', type: 'Multiple Choice', options: ['Sí', 'No', 'No aplica'] },
                { id: 'A2.7', text: '¿Las categorías de colores ayudan o distraen?', type: 'Multiple Choice', options: ['Ayudan', 'Distraen', 'Neutro'] }
              ]
            }, {
              title: 'Sección A3 - Roles y Llamadas a la Acción',
              questions: [
                { id: 'A3.1', text: 'Tarea: imagina que eres cliente y quieres contratar una consulta. ¿Dónde harías clic?', type: 'Paragraph', options: [], mediaUrls: ['https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-cta.jpg', 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-cta-extra-01.jpg'], mediaType: 'image', mediaHint: 'Home - llamadas a la accion para cliente y guru' },
                { id: 'A3.2', text: '¿Identificó correctamente el camino del cliente?', type: 'Multiple Choice', options: ['Sí', 'Con duda', 'No'] },
                { id: 'A3.3', text: 'Tarea: imagina que quieres ofrecer tus servicios como Gurú. ¿Dónde harías clic?', type: 'Paragraph', options: [] },
                { id: 'A3.4', text: '¿Identificó correctamente el camino del Gurú?', type: 'Multiple Choice', options: ['Sí', 'Con duda', 'No'] },
                { id: 'A3.5', text: '¿Los botones principales tienen jerarquía clara?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Muy claro)'] }
              ]
            }, {
              title: 'Sección A4 - Confianza y Evidencia',
              questions: [
                { id: 'A4.1', text: 'Del 1 al 5, ¿qué tanta confianza genera el Home?', type: 'Linear Scale (1-5)', options: ['1 (Poca confianza)', '5 (Mucha confianza)'], mediaUrls: ['https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-trust.jpg', 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-trust-extra-01.jpg', 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-trust-extra-02.jpg'], mediaType: 'image', mediaHint: 'Home - elementos de confianza y evidencia visual' },
                { id: 'A4.2', text: '¿Qué parte genera más confianza?', type: 'Paragraph', options: [] },
                { id: 'A4.3', text: '¿Qué parte genera menos confianza?', type: 'Paragraph', options: [] },
                { id: 'A4.4', text: '¿Encontraste algún bug visual o funcional?', type: 'Multiple Choice', options: ['Sí', 'No'] },
                { id: 'A4.5', text: 'Sube evidencia si aplica: screenshot o video', type: 'File Upload', options: [] },
                { id: 'A4.6', text: 'Severidad del principal hallazgo', type: 'Dropdown', options: ['Sin hallazgo', 'P0 - Bloqueador crítico', 'P1 - Fricción alta', 'P2 - Fricción media', 'P3 - Mejora menor'] },
                { id: 'A4.7', text: 'Comentario final del Home', type: 'Paragraph', options: [] }
              ]
            }] 
          }
        },
        v2: {
          id: 'v2',
          label: 'Clarify A1.2 wording',
          status: 'active',
          form: {
            id: 'form-a',
            title: 'Formulario A - Home Guruxy',
            duration: '12 a 18 minutos',
            target: 'Cualquier tester (incluso sin conocimiento previo)',
            sections: [{
              title: 'Sección A0 - Datos Rápidos',
              questions: [
                { id: 'A0.1', text: 'Nombre del tester', type: 'Short Text', options: [] },
                { id: 'A0.2', text: 'Dispositivo usado', type: 'Multiple Choice', options: ['Desktop', 'Mobile', 'Tablet'] },
                { id: 'A0.3', text: 'Navegador', type: 'Multiple Choice', options: ['Chrome', 'Safari', 'Brave', 'Edge', 'Firefox', 'Otro'] },
                { id: 'A0.4', text: 'Nivel digital', type: 'Multiple Choice', options: ['Bajo', 'Medio', 'Alto'] },
                { id: 'A0.5', text: '¿La prueba fue moderada?', type: 'Multiple Choice', options: ['Sí', 'No'] }
              ]
            }, {
              title: 'Sección A1 - Primera Impresión',
              instruction: 'Nota para moderador: no expliques qué es Guruxy antes de esta tarea para medir comprensión espontánea.',
              questions: [
                { id: 'A1.1', text: 'Mira el Home durante 10 segundos. ¿Qué crees que hace Guruxy?', type: 'Paragraph', options: [], mediaUrl: 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/primera-impresion.jpg', mediaType: 'image', mediaHint: 'Home de Guruxy — pantalla que está evaluando el tester' },
                { id: 'A1.2', text: '¿El tester entendió con claridad qué problema resuelve Guruxy?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'A1.3', text: '¿Qué conceptos mencionó espontáneamente?', type: 'Checkboxes', options: ['Expertos/Gurús', 'Clientes', 'Consultas', 'Agenda', 'Pagos', 'Videollamada', 'Marketplace', 'Servicios', 'No entendió'] },
                { id: 'A1.4', text: 'Del 1 al 5, ¿qué tan claro fue el mensaje principal?', type: 'Linear Scale (1-5)', options: ['1 (Nada claro)', '5 (Muy claro)'] },
                { id: 'A1.5', text: '¿Qué frase o elemento del Home le ayudó más a entender?', type: 'Paragraph', options: [] }
              ]
            }, {
              title: 'Sección A2 - Navegación y Búsqueda',
              instruction: 'Nota para moderador: pide al tester encontrar algo, no le digas exactamente dónde hacer clic.',
              questions: [
                { id: 'A2.1', text: 'Tarea: busca dónde encontrarías un especialista. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'], mediaUrl: 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-navigation.jpg', mediaType: 'image', mediaHint: 'Home - zona de navegacion y busqueda de especialistas' },
                { id: 'A2.2', text: '¿Encontró el buscador principal?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'A2.3', text: '¿Entendió la diferencia entre Todos, Gurús y Especialidades?', type: 'Linear Scale (1-5)', options: ['1 (Nada claro)', '5 (Muy claro)'] },
                { id: 'A2.4', text: '¿Qué nombre sería más claro para esas opciones?', type: 'Paragraph', options: [] },
                { id: 'A2.5', text: 'Tarea: explora una categoría. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'A2.6', text: 'En mobile, ¿entendió que la barra de categorías se mueve horizontalmente?', type: 'Multiple Choice', options: ['Sí', 'No', 'No aplica'] },
                { id: 'A2.7', text: '¿Las categorías de colores ayudan o distraen?', type: 'Multiple Choice', options: ['Ayudan', 'Distraen', 'Neutro'] }
              ]
            }, {
              title: 'Sección A3 - Roles y Llamadas a la Acción',
              questions: [
                { id: 'A3.1', text: 'Tarea: imagina que eres cliente y quieres contratar una consulta. ¿Dónde harías clic?', type: 'Paragraph', options: [], mediaUrls: ['https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-cta.jpg', 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-cta-extra-01.jpg'], mediaType: 'image', mediaHint: 'Home - llamadas a la accion para cliente y guru' },
                { id: 'A3.2', text: '¿Identificó correctamente el camino del cliente?', type: 'Multiple Choice', options: ['Sí', 'Con duda', 'No'] },
                { id: 'A3.3', text: 'Tarea: imagina que quieres ofrecer tus servicios como Gurú. ¿Dónde harías clic?', type: 'Paragraph', options: [] },
                { id: 'A3.4', text: '¿Identificó correctamente el camino del Gurú?', type: 'Multiple Choice', options: ['Sí', 'Con duda', 'No'] },
                { id: 'A3.5', text: '¿Los botones principales tienen jerarquía clara?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Muy claro)'] }
              ]
            }, {
              title: 'Sección A4 - Confianza y Evidencia',
              questions: [
                { id: 'A4.1', text: 'Del 1 al 5, ¿qué tanta confianza genera el Home?', type: 'Linear Scale (1-5)', options: ['1 (Poca confianza)', '5 (Mucha confianza)'], mediaUrls: ['https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-trust.jpg', 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-trust-extra-01.jpg', 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/home-trust-extra-02.jpg'], mediaType: 'image', mediaHint: 'Home - elementos de confianza y evidencia visual' },
                { id: 'A4.2', text: '¿Qué parte genera más confianza?', type: 'Paragraph', options: [] },
                { id: 'A4.3', text: '¿Qué parte genera menos confianza?', type: 'Paragraph', options: [] },
                { id: 'A4.4', text: '¿Encontraste algún bug visual o funcional?', type: 'Multiple Choice', options: ['Sí', 'No'] },
                { id: 'A4.5', text: 'Sube evidencia si aplica: screenshot o video', type: 'File Upload', options: [] },
                { id: 'A4.6', text: 'Severidad del principal hallazgo', type: 'Dropdown', options: ['Sin hallazgo', 'P0 - Bloqueador crítico', 'P1 - Fricción alta', 'P2 - Fricción media', 'P3 - Mejora menor'] },
                { id: 'A4.7', text: 'Comentario final del Home', type: 'Paragraph', options: [] }
              ]
            }]
          }
        }
      }
    },
    B: {
      activeVersion: 'v1',
      versions: {
        v1: {
          id: 'v1',
          label: 'Initial extracted version',
          status: 'active',
          form: {
            id: 'form-b',
            title: 'Formulario B - Path Guru',
            duration: '25 a 35 minutos',
            target: 'Testers que harán rol de especialistas, mentores, asesores, etc.',
            sections: [{
              title: 'Sección B0 - Datos Rápidos',
              questions: [
                { id: 'B0.1', text: 'Nombre del tester', type: 'Short Text', options: [] },
                { id: 'B0.2', text: 'Dispositivo usado', type: 'Multiple Choice', options: ['Desktop', 'Mobile', 'Tablet'] },
                { id: 'B0.3', text: 'Navegador', type: 'Multiple Choice', options: ['Chrome', 'Safari', 'Brave', 'Edge', 'Firefox', 'Otro'] },
                { id: 'B0.4', text: '¿El tester entiende el rol de Gurú?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] }
              ]
            }, {
              title: 'Sección B1 - Login y Entrada',
              instruction: 'Nota para moderador: si el login falla por credenciales o ambiente, marcar como bloqueo técnico y no insistir más de 3 minutos.',
              questions: [
                { id: 'B1.1', text: 'Tarea: inicia sesión como Gurú. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'], mediaUrls: ['https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/login-screen.jpg', 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/login-screen-extra-01.jpg', 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/login-screen-extra-02.jpg'], mediaType: 'image', mediaHint: 'Pantalla de login de Guruxy - referencia para el tester' },
                { id: 'B1.2', text: '¿El login fue claro?', type: 'Linear Scale (1-5)', options: ['1 (Muy confuso)', '5 (Muy claro)'] },
                { id: 'B1.3', text: '¿Hubo error de autenticación, idioma o redirección?', type: 'Paragraph', options: [] },
                { id: 'B1.4', text: 'Tarea: abre el menú de cuenta y busca Mi Oficina. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'B1.5', text: '¿El menú de cuenta fue claro?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Claro)'] }
              ]
            }, {
              title: 'Sección B2 - Perfil y Activación',
              instruction: 'Nota para moderador: aquí buscamos si el Guru entiende qué le falta para estar listo. No le expliques el porcentaje antes de preguntar.',
              questions: [
                { id: 'B2.1', text: 'Tarea: entra a Perfil y explica qué significa tu estado actual', type: 'Paragraph', options: [], mediaUrls: ['https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/guru-profile.jpg', 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/guru-profile-extra-01.jpg'], mediaType: 'image', mediaHint: 'Perfil del Gurú - barra de completitud y estado de activación' },
                { id: 'B2.2', text: '¿Entendió el porcentaje de completitud?', type: 'Linear Scale (1-5)', options: ['1 (Incomprensible)', '5 (Súper claro)'] },
                { id: 'B2.3', text: '¿Entendió la diferencia entre Activo, Validado y perfil incompleto?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'B2.4', text: '¿El checklist le indicó qué hacer después?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'B2.5', text: '¿Cuál fue el siguiente paso que el tester creyó que debía hacer?', type: 'Paragraph', options: [] },
                { id: 'B2.6', text: 'Tarea: intenta cambiar la foto de perfil. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'B2.7', text: '¿Hubo feedback claro al subir, cancelar o fallar la foto?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No', 'No probado'] },
                { id: 'B2.8', text: 'Sube evidencia si hubo bug en perfil o foto', type: 'File Upload', options: [] }
              ]
            }, {
              title: 'Sección B3 - Crear Servicio',
              instruction: 'Nota para moderador: no expliques cada campo. Observa qué campos generan preguntas.',
              questions: [
                { id: 'B3.1', text: 'Tarea: ve a Servicios. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'B3.2', text: '¿El empty state de Servicios le indicó qué hacer?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'], mediaUrl: 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/guru-services-empty.jpg', mediaType: 'image', mediaHint: 'Vista de Servicios vacía - empty state que ve el Gurú al inicio' },
                { id: 'B3.3', text: 'Tarea: crea un primer servicio. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'B3.4', text: '¿Qué campo generó más duda?', type: 'Checkboxes', options: ['Nombre', 'Descripción', 'Duración', 'Precio', 'Moneda', 'Virtual/Presencial', 'Categoría', 'Subcategoría', 'Crear servicio', 'Ninguno'] },
                { id: 'B3.5', text: '¿Entendió Virtual vs Presencial?', type: 'Linear Scale (1-5)', options: ['1 (Inconsistente)', '5 (Perfecto)'] },
                { id: 'B3.6', text: '¿El tester esperaba una vista previa del servicio antes de publicar?', type: 'Multiple Choice', options: ['Sí', 'No', 'No lo mencionó'] },
                { id: 'B3.7', text: '¿Qué validación o ayuda faltó en el formulario?', type: 'Paragraph', options: [] },
                { id: 'B3.8', text: 'Sube evidencia si hubo bug creando servicio', type: 'File Upload', options: [] }
              ]
            }, {
              title: 'Sección B4 - Agenda y Disponibilidad',
              instruction: 'Nota para moderador: presten atención a si diferencia crear disponibilidad de agendar una cita.',
              questions: [
                { id: 'B4.1', text: 'Tarea: ve a Agenda. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'B4.2', text: '¿El empty state de agenda fue claro?', type: 'Linear Scale (1-5)', options: ['1 (Nada claro)', '5 (Muy claro)'] },
                { id: 'B4.3', text: 'Tarea: crea un horario para recibir reservas. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'B4.4', text: '¿El tester entendió si estaba creando disponibilidad o una cita?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'], mediaUrl: 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/guru-agenda.jpg', mediaType: 'image', mediaHint: 'Pantalla de Agenda - formulario de creación de disponibilidad' },
                { id: 'B4.5', text: '¿Individual y Generación masiva fueron claros?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Excelente)'] },
                { id: 'B4.6', text: '¿Fecha y hora funcionaron sin problemas?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'B4.7', text: '¿Qué nombre sería más claro?', type: 'Multiple Choice', options: ['Agendar horarios', 'Crear disponibilidad', 'Crear cita', 'Otro'] },
                { id: 'B4.8', text: 'Sube evidencia si hubo bug en Agenda', type: 'File Upload', options: [] }
              ]
            }, {
              title: 'Sección B5 - Oficina Virtual y Panel',
              instruction: 'Nota para moderador: la clave es si sabe qué significa estar desconectado y qué hacer cuando llega un visitante.',
              questions: [
                { id: 'B5.1', text: 'Tarea: entra a Oficina Virtual. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'B5.2', text: '¿Qué cree el tester que puede hacer en Oficina Virtual?', type: 'Paragraph', options: [] },
                { id: 'B5.3', text: '¿Entendió Desconectado / Esperando visitantes?', type: 'Linear Scale (1-5)', options: ['1 (No entiende)', '5 (Súper claro)'], mediaUrl: 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/guru-oficina-virtual.jpg', mediaType: 'image', mediaHint: 'Oficina Virtual - estado Desconectado vs Esperando visitantes' },
                { id: 'B5.4', text: '¿Supo cuál era el siguiente paso para recibir clientes?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'B5.5', text: 'Tarea: abre el Panel. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'B5.6', text: '¿Entendió la Cola?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Claro)'] },
                { id: 'B5.7', text: '¿Entendió Alertas?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Claro)'] },
                { id: 'B5.8', text: '¿Entendió Contactos?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Claro)'] },
                { id: 'B5.9', text: '¿Entendió Ajustes y notificaciones?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Claro)'] },
                { id: 'B5.10', text: '¿El panel se sintió útil o demasiado avanzado?', type: 'Multiple Choice', options: ['Útil', 'Avanzado/confuso', 'Neutro'] },
                { id: 'B5.11', text: 'Sube evidencia si hubo bug en Oficina o Panel', type: 'File Upload', options: [] }
              ]
            }, {
              title: 'Sección B6 - Mensajes y Clientes',
              questions: [
                { id: 'B6.1', text: 'Tarea: ve a Mensajes e intenta vincular/invitar cliente. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'], mediaUrl: 'https://raw.githubusercontent.com/HaroldSthid/guruxy-testing-hub/main/assets/img/guru-mensajes.jpg', mediaType: 'image', mediaHint: 'Pantalla de Mensajes - campo para vincular/invitar cliente por email' },
                { id: 'B6.2', text: '¿Qué término entiende mejor?', type: 'Multiple Choice', options: ['Vincular cliente', 'Invitar cliente', 'Agregar cliente', 'Conectar cliente', 'Otro'] },
                { id: 'B6.3', text: '¿Entendió qué pasará después de escribir el correo del cliente?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'B6.4', text: 'Tarea: ve a Clientes y explica qué esperas ver ahí', type: 'Paragraph', options: [] },
                { id: 'B6.5', text: '¿Los contadores de Clientes fueron claros?', type: 'Linear Scale (1-5)', options: ['1 (No se entiende)', '5 (Muy claro)'] }
              ]
            }, {
              title: 'Sección B7 - Cierre Path Guru',
              questions: [
                { id: 'B7.1', text: '¿Cuál fue el mayor bloqueo del Path Guru?', type: 'Paragraph', options: [] },
                { id: 'B7.2', text: '¿Qué tarea fue más fácil?', type: 'Paragraph', options: [] },
                { id: 'B7.3', text: '¿Qué tarea fue más confusa?', type: 'Paragraph', options: [] },
                { id: 'B7.4', text: 'Del 1 al 5, ¿qué tan listo se sentiría para recibir clientes?', type: 'Linear Scale (1-5)', options: ['1 (Nada listo)', '5 (Súper listo)'] },
                { id: 'B7.5', text: 'Tiempo aproximado de la prueba Guru', type: 'Short Text', options: [] },
                { id: 'B7.6', text: 'Severidad del hallazgo principal', type: 'Dropdown', options: ['Sin hallazgo', 'P0 - Bloqueador crítico', 'P1 - Fricción alta', 'P2 - Fricción media', 'P3 - Mejora menor'] }
              ]
            }]
          }
        }
      }
    },
    C: {
      activeVersion: 'v1',
      versions: {
        v1: {
          id: 'v1',
          label: 'Initial extracted version',
          status: 'active',
          form: {
            id: 'form-c',
            title: 'Formulario C - Path Cliente',
            duration: '25 a 35 minutos',
            target: 'Testers que simularán buscar o contratar ayuda/consultas.',
            sections: [{
              title: 'Sección C0 - Datos Rápidos',
              questions: [
                { id: 'C0.1', text: 'Nombre del tester', type: 'Short Text', options: [] },
                { id: 'C0.2', text: 'Dispositivo usado', type: 'Multiple Choice', options: ['Desktop', 'Mobile', 'Tablet'] },
                { id: 'C0.3', text: 'Navegador', type: 'Multiple Choice', options: ['Chrome', 'Safari', 'Brave', 'Edge', 'Firefox', 'Otro'] },
                { id: 'C0.4', text: 'Necesidad simulada (ej. tutor, médico, coach)', type: 'Short Text', options: [] }
              ]
            }, {
              title: 'Sección C1 - Descubrimiento y Búsqueda',
              instruction: 'Nota para moderador: deja que el usuario busque como lo haría naturalmente.',
              questions: [
                { id: 'C1.1', text: 'Tarea: busca un Gurú dentro de una categoría. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'C1.2', text: '¿Entendió el sidebar de especialidades?', type: 'Linear Scale (1-5)', options: ['1 (Muy confuso)', '5 (Muy útil)'] },
                { id: 'C1.3', text: '¿Alguna especialidad cortada o truncada generó confusión?', type: 'Multiple Choice', options: ['Sí', 'No', 'No aplica'] },
                { id: 'C1.4', text: 'Tarea: abre el selector del buscador. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'C1.5', text: '¿Entendió Todos, Gurús y Especialidades?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Muy claro)'] },
                { id: 'C1.6', text: '¿Qué etiquetas serían más claras?', type: 'Paragraph', options: [] },
                { id: 'C1.7', text: 'Tarea: busca por nombre de Gurú. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No', 'No probado'] },
                { id: 'C1.8', text: 'Tarea: busca por especialidad. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No', 'No probado'] }
              ]
            }, {
              title: 'Sección C2 - Filtros',
              instruction: 'Nota para moderador: pedir una tarea concreta, como "encuentra alguien online o económico".',
              questions: [
                { id: 'C2.1', text: 'Tarea: abre Filtros. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'C2.2', text: '¿Entendió el filtro por ciudad?', type: 'Linear Scale (1-5)', options: ['1 (No)', '5 (Sí, fácil)'] },
                { id: 'C2.3', text: '¿Entendió el filtro por estado?', type: 'Linear Scale (1-5)', options: ['1 (No)', '5 (Sí, fácil)'] },
                { id: 'C2.4', text: '¿El término "Busy" generó confusión?', type: 'Multiple Choice', options: ['Sí', 'No', 'No lo notó'] },
                { id: 'C2.5', text: '¿Entendió el filtro/orden de precio?', type: 'Linear Scale (1-5)', options: ['1 (No)', '5 (Sí)'] },
                { id: 'C2.6', text: '¿Pudo aplicar filtros correctamente?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'C2.7', text: '¿Pudo limpiar filtros correctamente?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No', 'No probado'] },
                { id: 'C2.8', text: '¿El overlay o panel de filtros se sintió cómodo?', type: 'Linear Scale (1-5)', options: ['1 (Malo)', '5 (Excelente)'] }
              ]
            }, {
              title: 'Sección C3 - Listado y Cards de Gurús',
              questions: [
                { id: 'C3.1', text: 'Tarea: elige una card de Gurú que contactarías. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'C3.2', text: '¿La card generó confianza?', type: 'Linear Scale (1-5)', options: ['1 (Sospechosa)', '5 (Mucha confianza)'] },
                { id: 'C3.3', text: '¿Entendió la tarifa?', type: 'Linear Scale (1-5)', options: ['1 (No se entiende)', '5 (Claro)'] },
                { id: 'C3.4', text: '¿Entendió la experiencia/años?', type: 'Linear Scale (1-5)', options: ['1 (No)', '5 (Sí)'] },
                { id: 'C3.5', text: '¿Entendió el estado Online/No disponible/Ocupado?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Clarísimo)'] },
                { id: 'C3.6', text: '¿El botón Contactar Ahora fue coherente con el estado del Gurú?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'C3.7', text: '¿Los perfiles de prueba o avatares genéricos bajan confianza?', type: 'Multiple Choice', options: ['Sí', 'No', 'No lo notó'] }
              ]
            }, {
              title: 'Sección C4 - Perfil del Gurú y Servicios',
              questions: [
                { id: 'C4.1', text: 'Tarea: entra al perfil de un Gurú. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'C4.2', text: '¿Entendió quién es el Gurú y qué ofrece?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Súper claro)'] },
                { id: 'C4.3', text: '¿Entendió Verificado / En línea / Nuevo / Rating 0.0?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Súper claro)'] },
                { id: 'C4.4', text: '¿Entendió el rango de tarifas?', type: 'Linear Scale (1-5)', options: ['1 (Incierto)', '5 (Claro)'] },
                { id: 'C4.5', text: 'Tarea: selecciona un servicio. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'C4.6', text: '¿Entendió precio y resumen del servicio seleccionado?', type: 'Linear Scale (1-5)', options: ['1 (No)', '5 (Sí)'] },
                { id: 'C4.7', text: '¿Entendió la modalidad virtual/presencial?', type: 'Linear Scale (1-5)', options: ['1 (No)', '5 (Sí)'] }
              ]
            }, {
              title: 'Sección C5 - Reserva, Disponibilidad y Contacto',
              instruction: 'Nota para moderador: si no hay horarios, eso NO es fallo del tester. Se mide si entiende el bloqueo y el plan B.',
              questions: [
                { id: 'C5.1', text: 'Tarea: intenta reservar el servicio. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'C5.2', text: 'Si no había horarios, ¿entendió qué pasaba?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No', 'No aplica'] },
                { id: 'C5.3', text: '¿El botón "Reservar y pagar" deshabilitado fue claro?', type: 'Linear Scale (1-5)', options: ['1 (Confuso)', '5 (Súper claro)'] },
                { id: 'C5.4', text: '¿Esperaba una opción "Solicitar disponibilidad"?', type: 'Multiple Choice', options: ['Sí', 'No', 'No lo mencionó'] },
                { id: 'C5.5', text: 'Tarea: usa "Contactar ahora". ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No'] },
                { id: 'C5.6', text: '¿Entendió que entraba a la Oficina del Gurú?', type: 'Linear Scale (1-5)', options: ['1 (Perdido)', '5 (Entendió)'] },
                { id: 'C5.7', text: '¿Entendió "Esperando aprobación"?', type: 'Linear Scale (1-5)', options: ['1 (No)', '5 (Sí)'] },
                { id: 'C5.8', text: '¿El texto "Intento 2 de 3" fue claro?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No', 'No apareció'] },
                { id: 'C5.9', text: '¿Supo si debía esperar, escribir por chat o dejar mensaje?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No'] },
                { id: 'C5.10', text: 'Tarea: deja un mensaje si el Gurú no responde. ¿Lo logró?', type: 'Multiple Choice', options: ['Sí', 'Con ayuda', 'No', 'No probado'] },
                { id: 'C5.11', text: '¿El campo URL de video o enlace opcional fue claro?', type: 'Multiple Choice', options: ['Sí', 'Parcialmente', 'No', 'No probado'] },
                { id: 'C5.12', text: 'Sube evidencia si hubo bug o fricción fuerte', type: 'File Upload', options: [] }
              ]
            }, {
              title: 'Sección C6 - Cierre Path Cliente',
              questions: [
                { id: 'C6.1', text: '¿Cuál fue el mayor bloqueo del Path Cliente?', type: 'Paragraph', options: [] },
                { id: 'C6.2', text: '¿Qué parte generó más confianza?', type: 'Paragraph', options: [] },
                { id: 'C6.3', text: '¿Qué parte generó menos confianza?', type: 'Paragraph', options: [] },
                { id: 'C6.4', text: 'Del 1 al 5, ¿qué tanta confianza tendría para pagar una consulta?', type: 'Linear Scale (1-5)', options: ['1 (Ninguna)', '5 (Total)'] },
                { id: 'C6.5', text: 'Del 1 al 5, ¿qué tan fácil fue encontrar un Gurú relevante?', type: 'Linear Scale (1-5)', options: ['1 (Difícil)', '5 (Facilísimo)'] },
                { id: 'C6.6', text: 'Tiempo aproximado de la prueba Cliente', type: 'Short Text', options: [] },
                { id: 'C6.7', text: 'Severidad del hallazgo principal', type: 'Dropdown', options: ['Sin hallazgo', 'P0 - Bloqueador crítico', 'P1 - Fricción alta', 'P2 - Fricción media', 'P3 - Mejora menor'] }
              ]
            }]
          }
        }
      }
    }
  }
};
