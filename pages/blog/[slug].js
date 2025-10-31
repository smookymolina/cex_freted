import { useRouter } from 'next/router';
import BlogPostPage from '../../components/blog/BlogPostPage';

// Mock Data - En una aplicación real, buscarías el post por slug en tu CMS
const mockPosts = [
  {
    slug: 'guia-comprar-iphone-reacondicionado',
    title: 'Guía Definitiva para Comprar un iPhone Reacondicionado en 2025',
    image: '/assets/images/blog/guia-comprar-iphone-reacondicionado.jpg',
    category: 'Guías de Compra',
    author: 'Ana García',
    date: '22 de Octubre, 2025',
    content: `
      <p>Comprar un iPhone reacondicionado es una excelente manera de ahorrar dinero y ser más sostenible. Pero, ¿qué debes tener en cuenta para hacer una compra inteligente? En esta guía, te lo contamos todo.</p>
      <h2>1. ¿Qué significa "Reacondicionado"?</h2>
      <p>No es lo mismo que "de segunda mano". Un dispositivo reacondicionado ha sido revisado, reparado y limpiado por profesionales para asegurar que funciona perfectamente. En CEX, todos nuestros productos pasan una certificación de 30 puntos.</p>
      <h2>2. Revisa la Salud de la Batería</h2>
      <p>Uno de los componentes que más sufre con el uso es la batería. Asegúrate de que el vendedor garantice un mínimo de salud de batería. Nosotros garantizamos más del 85% en todos nuestros iPhones certificados.</p>
      <h2>3. Entiende los Grados Estéticos</h2>
      <p>Los grados (Como Nuevo, Muy Bueno, Bueno) se refieren solo al aspecto exterior. Un teléfono de grado "Bueno" puede tener rasguños visibles, pero funcionará tan bien como uno "Como Nuevo". Elige el grado que se ajuste a tu presupuesto y tus exigencias estéticas.</p>
      <p>Esperamos que esta guía te ayude a realizar tu próxima compra con total confianza. ¡Explora nuestro catálogo de iPhones reacondicionados y encuentra el tuyo!</p>
    `
  },
  {
    slug: 'sostenibilidad-tecnologica',
    title: 'El Impacto Oculto de tu Smartphone: Sostenibilidad y Tecnología',
    image: '/assets/images/blog/sostenibilidad-tecnologica.jpg',
    category: 'Sostenibilidad',
    author: 'Carlos Pérez',
    date: '15 de Octubre, 2025',
    content: `
      <p>Cada año, millones de smartphones terminan en vertederos, generando toneladas de basura electrónica. Pero, ¿realmente conocemos el impacto ambiental de nuestros dispositivos? Te contamos la verdad detrás de la industria tecnológica.</p>
      <h2>El Costo Ambiental de un Smartphone Nuevo</h2>
      <p>Fabricar un smartphone requiere más de 60 elementos químicos diferentes, incluyendo metales raros extraídos de minas que causan deforestación y contaminación. Se estima que la producción de un solo dispositivo genera aproximadamente 85 kg de CO2.</p>
      <h2>La Economía Circular como Solución</h2>
      <p>Comprar dispositivos reacondicionados reduce drásticamente la demanda de nuevos recursos. Al elegir un iPhone o Android reacondicionado, estás evitando que un dispositivo funcional termine en la basura y reduciendo la necesidad de extraer nuevos materiales.</p>
      <h2>Más Allá del Reciclaje</h2>
      <p>El reciclaje es importante, pero reutilizar es aún mejor. Un dispositivo reacondicionado puede tener una segunda, tercera o incluso cuarta vida útil antes de necesitar ser reciclado, multiplicando su valor ambiental.</p>
      <h2>Tu Decisión Importa</h2>
      <p>Cada compra consciente suma. Al elegir tecnología reacondicionada, no solo ahorras dinero, sino que contribuyes activamente a un futuro más sostenible. En CEX, nos enorgullece ser parte de este cambio positivo.</p>
    `
  },
  {
    slug: 'macbook-air-vs-pro',
    title: 'MacBook Air vs. Pro: ¿Cuál es el Ideal para Estudiantes?',
    image: '/assets/images/blog/macbook-air-vs-pro.jpg',
    category: 'Comparativas',
    author: 'Laura Martínez',
    date: '10 de Octubre, 2025',
    content: `
      <p>Elegir entre un MacBook Air y un MacBook Pro puede ser complicado, especialmente para estudiantes con presupuesto limitado. Analizamos las diferencias clave para ayudarte a tomar la mejor decisión.</p>
      <h2>MacBook Air: Portabilidad y Eficiencia</h2>
      <p>El MacBook Air es increíblemente ligero (1.29 kg) y ofrece hasta 18 horas de batería. Con el chip M2 o M3, maneja sin problemas tareas como navegación web, ofimática, edición de fotos ligera y programación. Perfecto para estudiantes que necesitan movilidad constante.</p>
      <h2>MacBook Pro: Potencia para Tareas Exigentes</h2>
      <p>El MacBook Pro 13" o 14" ofrece mayor rendimiento con chips M2 Pro o M3 Pro. Ideal si trabajas con edición de video, diseño 3D, compilación de código pesado o música profesional. La pantalla Pro también ofrece mayor brillo y tecnología ProMotion.</p>
      <h2>Comparativa de Precio: Reacondicionado vs Nuevo</h2>
      <p>Un MacBook Air M2 nuevo cuesta alrededor de $24,000 MXN, mientras que uno reacondicionado certificado puede encontrarse desde $16,000 MXN. Un MacBook Pro nuevo supera los $35,000 MXN, pero reacondicionado puedes conseguirlo desde $22,000 MXN.</p>
      <h2>¿Cuál Elegir?</h2>
      <p>Si eres estudiante de humanidades, negocios o ciencias sociales: MacBook Air. Si estudias diseño gráfico, arquitectura, ingeniería o producción audiovisual: MacBook Pro. En ambos casos, comprar reacondicionado te permite ahorrar significativamente sin sacrificar calidad.</p>
      <p>Todos nuestros MacBooks reacondicionados incluyen garantía de 12 meses y certificación completa. ¡Descubre nuestro catálogo!</p>
    `
  },
  {
    slug: 'como-vender-iphone-usado',
    title: 'Cómo Vender tu iPhone Usado: Guía Completa para Obtener el Mejor Precio',
    image: '/assets/images/blog/como-vender-iphone-usado.jpg',
    category: 'Guías de Venta',
    author: 'Roberto Sánchez',
    date: '5 de Octubre, 2025',
    content: `
      <p>¿Tienes un iPhone antiguo guardado en un cajón? Podría valer más de lo que piensas. Te enseñamos cómo prepararlo y venderlo al mejor precio posible.</p>
      <h2>1. Prepara tu Dispositivo</h2>
      <p>Antes de vender, haz un respaldo completo de tus datos en iCloud o iTunes. Luego, desactiva "Buscar mi iPhone" y realiza un restablecimiento de fábrica. Limpia físicamente el dispositivo con un paño de microfibra.</p>
      <h2>2. Documenta el Estado</h2>
      <p>Toma fotos claras desde todos los ángulos, mostrando la pantalla encendida, la parte trasera y los laterales. Verifica y documenta la salud de la batería (Ajustes > Batería > Estado de la Batería).</p>
      <h2>3. Reúne los Accesorios</h2>
      <p>Si conservas la caja original, cargador, cable y audífonos, el valor de reventa aumenta considerablemente. Un iPhone completo en caja puede valer hasta 20% más.</p>
      <h2>4. Conoce el Valor de Mercado</h2>
      <p>Un iPhone 13 Pro de 128GB en buen estado se vende entre $12,000-$15,000 MXN. Un iPhone 12 regular entre $8,000-$10,000 MXN. Los modelos más antiguos (iPhone X, 8) rondan los $3,000-$6,000 MXN según su estado.</p>
      <h2>5. Vende de Forma Segura</h2>
      <p>En CEX, te ofrecemos una cotización instantánea, pago inmediato y total seguridad. Evita riesgos de ventas entre particulares y obtén efectivo o crédito en tienda el mismo día.</p>
    `
  },
  {
    slug: 'tablets-estudiantes-2025',
    title: 'Las Mejores Tablets para Estudiantes en 2025: iPad vs Samsung Galaxy Tab',
    image: '/assets/images/blog/tablets-estudiantes-2025.jpg',
    category: 'Comparativas',
    author: 'Ana García',
    date: '28 de Septiembre, 2025',
    content: `
      <p>Las tablets se han convertido en herramientas esenciales para estudiantes. Comparamos las opciones más populares para ayudarte a elegir la ideal según tus necesidades y presupuesto.</p>
      <h2>iPad (9na y 10ma Generación): La Opción Universal</h2>
      <p>El iPad estándar ofrece excelente rendimiento con chip A14 o A15, compatibilidad con Apple Pencil, y un ecosistema de apps educativas sin igual. Precio nuevo: $9,000-$12,000 MXN. Reacondicionado: desde $6,500 MXN.</p>
      <h2>iPad Air: El Equilibrio Perfecto</h2>
      <p>Con chip M1 o M2, pantalla más grande (10.9") y soporte para Apple Pencil de 2da generación, es ideal para tomar notas digitales y multitarea. Precio nuevo: $15,000-$18,000 MXN. Reacondicionado: desde $11,000 MXN.</p>
      <h2>Samsung Galaxy Tab S8/S9: Alternativa Android</h2>
      <p>Incluye S Pen sin costo extra, expansión de almacenamiento con microSD, y excelente integración con dispositivos Android. Pantalla AMOLED superior. Precio nuevo: $12,000-$20,000 MXN. Reacondicionado: desde $8,500 MXN.</p>
      <h2>¿Cuál Elegir Según tu Carrera?</h2>
      <p>Diseño/Arte: iPad Air o Pro (por Procreate y apps creativas). Ingeniería/Matemáticas: Cualquier iPad (por GoodNotes y Notability). Lectura/Investigación: Galaxy Tab (por pantalla AMOLED). Presupuesto ajustado: iPad 9na generación reacondicionado.</p>
      <h2>Accesorios Esenciales</h2>
      <p>Invierte en un buen stylus (Apple Pencil o S Pen), una funda con teclado, y un protector de pantalla. Estos accesorios transforman tu tablet en una estación de trabajo completa.</p>
    `
  },
  {
    slug: 'garantia-dispositivos-reacondicionados',
    title: 'Todo sobre las Garantías en Dispositivos Reacondicionados: Tu Protección al Comprar',
    image: '/assets/images/blog/garantia-dispositivos-reacondicionados.jpg',
    category: 'Guías de Compra',
    author: 'Carlos Pérez',
    date: '20 de Septiembre, 2025',
    content: `
      <p>Una de las preguntas más frecuentes al comprar tecnología reacondicionada es: "¿Qué pasa si algo sale mal?" Aquí te explicamos todo sobre garantías y protección al consumidor.</p>
      <h2>Garantía Legal en México</h2>
      <p>Por ley federal (PROFECO), todos los productos, incluyendo reacondicionados, deben tener mínimo 60 días de garantía contra defectos de fabricación. Sin embargo, vendedores serios ofrecen mucho más.</p>
      <h2>Nuestra Garantía de 12 Meses</h2>
      <p>En CEX, todos los dispositivos reacondicionados incluyen garantía de 12 meses completos. Esto cubre cualquier falla de hardware o software, sin costo adicional. No es un seguro opcional: está incluido en tu compra.</p>
      <h2>¿Qué Cubre la Garantía?</h2>
      <p>La garantía protege contra: fallas de batería (si cae por debajo del 85% certificado), problemas de pantalla, botones defectuosos, cámaras que no funcionen, problemas de carga, y cualquier defecto de fabricación. No cubre daños por caídas, líquidos o mal uso.</p>
      <h2>Proceso de Garantía Simplificado</h2>
      <p>Si tienes un problema, simplemente contacta a nuestro equipo. Evaluamos el dispositivo en 24-48 horas. Si aplica garantía, lo reparamos o reemplazamos sin costo. Si no aplica, te cotizamos la reparación con precios preferenciales.</p>
      <h2>Garantía Extendida Opcional</h2>
      <p>Para mayor tranquilidad, ofrecemos extensión de garantía hasta 24 meses con cobertura adicional contra accidentes. Pregunta en tienda por los planes disponibles.</p>
      <p>Comprar reacondicionado certificado no significa renunciar a protección. Al contrario: obtienes el respaldo que mereces a un precio justo.</p>
    `
  },
  {
    slug: 'android-vs-iphone-cual-elegir',
    title: 'Android vs iPhone en 2025: ¿Cuál es Mejor para Ti?',
    image: '/assets/images/blog/android-vs-iphone-cual-elegir.jpg',
    category: 'Comparativas',
    author: 'Laura Martínez',
    date: '12 de Septiembre, 2025',
    content: `
      <p>El eterno debate: ¿Android o iPhone? En 2025, ambas plataformas son excelentes, pero tienen diferencias clave que pueden definir tu experiencia. Te ayudamos a decidir.</p>
      <h2>Ecosistema y Compatibilidad</h2>
      <p>iPhone brilla si ya tienes Mac, iPad o Apple Watch: todo se sincroniza perfectamente. AirDrop, Handoff y iCloud funcionan sin configuración. Android ofrece mayor compatibilidad con servicios de Google y dispositivos de múltiples marcas.</p>
      <h2>Personalización vs Simplicidad</h2>
      <p>Android te permite personalizar prácticamente todo: launchers, widgets, apps predeterminadas. iPhone ofrece una experiencia consistente y pulida, pero más limitada. ¿Prefieres control total o experiencia refinada?</p>
      <h2>Actualizaciones de Software</h2>
      <p>Apple ofrece 5-7 años de actualizaciones iOS para todos sus dispositivos. En Android, los Pixel y Samsung Galaxy S reciben 4-5 años, pero la mayoría de marcas ofrecen solo 2-3 años. Esto afecta la vida útil a largo plazo.</p>
      <h2>Precio y Valor de Reventa</h2>
      <p>Los iPhones mantienen mejor su valor: un iPhone de 2 años puede venderse al 60% de su precio original. Android de gama alta pierde más valor, pero ofrece opciones más accesibles inicialmente. Reacondicionados de ambos son excelente inversión.</p>
      <h2>Cámaras y Multimedia</h2>
      <p>En 2025, las cámaras están parejas. iPhone destaca en video y fotografía consistente. Android (especialmente Samsung y Google) ofrece más versatilidad con zoom óptico avanzado y modos nocturnos superiores.</p>
      <h2>Nuestra Recomendación</h2>
      <p>Elige iPhone si: valoras simplicidad, tienes otros productos Apple, planeas conservarlo 4+ años. Elige Android si: quieres personalización, usas servicios Google intensivamente, buscas la mejor relación precio-especificaciones.</p>
      <p>En ambos casos, comprar reacondicionado certificado te permite acceder a gama alta a precio de gama media. Explora nuestro catálogo de ambas plataformas.</p>
    `
  },
  {
    slug: 'consolas-gaming-ps5-xbox-switch',
    title: 'Guía de Consolas 2025: PS5 vs Xbox Series X vs Nintendo Switch - ¿Cuál Comprar?',
    image: '/assets/images/blog/consolas-gaming-ps5-xbox-switch.jpg',
    category: 'Gaming',
    author: 'Roberto Sánchez',
    date: '3 de Septiembre, 2025',
    content: `
      <p>El mercado de consolas está más competitivo que nunca. Si estás pensando en comprar o actualizar tu sistema de gaming, esta guía te ayudará a decidir cuál se adapta mejor a ti.</p>
      <h2>PlayStation 5: El Rey de los Exclusivos</h2>
      <p>La PS5 ofrece gráficos de última generación, exclusivos AAA como Spider-Man 2, God of War Ragnarök y Horizon Forbidden West. El DualSense con retroalimentación háptica eleva la inmersión. Precio nuevo: $13,000-$15,000 MXN. Reacondicionado: desde $10,500 MXN.</p>
      <h2>Xbox Series X: Potencia y Game Pass</h2>
      <p>Técnicamente la consola más potente del mercado. Su mayor ventaja es Xbox Game Pass: acceso a cientos de juegos por suscripción mensual. Ideal si valoras cantidad y variedad. Precio nuevo: $12,000-$14,000 MXN. Reacondicionado: desde $9,800 MXN.</p>
      <h2>Nintendo Switch: Portabilidad y Diversión Familiar</h2>
      <p>Única consola verdaderamente portátil. Exclusivos únicos como Zelda, Mario, Pokémon. Perfecta para familias y jugadores casuales. Menor potencia gráfica pero gameplay magistral. Precio nuevo: $7,500-$8,500 MXN. Reacondicionado: desde $5,500 MXN.</p>
      <h2>Comparativa de Catálogos</h2>
      <p>PS5: Mejores exclusivos narrativos (The Last of Us, Uncharted). Xbox: Mejor servicio de suscripción (Game Pass Ultimate). Switch: Mejores exclusivos familiares y portabilidad total.</p>
      <h2>¿Cuál Comprar en 2025?</h2>
      <p>Compra PS5 si: te encantan historias épicas y exclusivos Sony. Compra Xbox si: prefieres variedad por suscripción y juego online. Compra Switch si: quieres portabilidad o jugar en familia. Pro tip: Comprar reacondicionado te permite ahorrar para más juegos.</p>
      <h2>Accesorios Esenciales</h2>
      <p>Sea cual sea tu elección, invierte en: mando adicional (para multijugador), auriculares gaming, almacenamiento expandido (SSD externo para PS5/Xbox, microSD para Switch).</p>
    `
  },
  {
    slug: 'auriculares-inalambricos-airpods-vs-competencia',
    title: 'AirPods vs la Competencia: Mejor Calidad-Precio en Auriculares Inalámbricos 2025',
    image: '/assets/images/blog/auriculares-inalambricos-airpods-vs-competencia.jpg',
    category: 'Comparativas',
    author: 'Ana García',
    date: '25 de Agosto, 2025',
    content: `
      <p>Los auriculares inalámbricos se han vuelto indispensables. Con tantas opciones en el mercado, ¿valen la pena los AirPods o hay mejores alternativas? Analizamos las opciones más populares.</p>
      <h2>AirPods (2da y 3ra Gen): Integración Apple Perfecta</h2>
      <p>Si tienes iPhone, los AirPods ofrecen conexión instantánea, cambio automático entre dispositivos Apple, y audio espacial. Calidad de sonido buena (no excepcional), pero la comodidad y ecosistema son imbatibles. Precio nuevo: $3,500-$4,500 MXN. Reacondicionado: desde $2,400 MXN.</p>
      <h2>AirPods Pro (1ra y 2da Gen): Cancelación de Ruido Premium</h2>
      <p>Cancelación activa de ruido (ANC) de clase mundial, modo transparencia natural, resistencia al agua IPX4. Los Pro 2da gen añaden USB-C y mejor autonomía. Precio nuevo: $5,500-$6,500 MXN. Reacondicionado: desde $4,200 MXN.</p>
      <h2>Sony WF-1000XM5: El Mejor Sonido</h2>
      <p>Calidad de audio superior a AirPods, mejor ANC, mayor duración de batería (8h con ANC). Compatible con Android e iOS. Ideales para audiófilos. Precio nuevo: $5,800-$6,200 MXN. Reacondicionado: desde $4,500 MXN.</p>
      <h2>Samsung Galaxy Buds 2 Pro: Mejor para Android</h2>
      <p>Integración perfecta con Samsung/Android, ANC competente, sonido balanceado, precio más accesible. Precio nuevo: $3,800-$4,200 MXN. Reacondicionado: desde $2,800 MXN.</p>
      <h2>Beats Fit Pro: Deporte y Estilo</h2>
      <p>Chip H1 de Apple (misma integración que AirPods), diseño seguro con aletas, resistencia al sudor. Ideales para gym. Precio nuevo: $4,200-$4,800 MXN. Reacondicionado: desde $3,200 MXN.</p>
      <h2>Nuestra Recomendación</h2>
      <p>Ecosistema Apple + presupuesto ajustado: AirPods 3ra gen reacondicionados. Máxima calidad y ANC: Sony WF-1000XM5 o AirPods Pro 2. Usuario Android: Galaxy Buds 2 Pro. Deportistas: Beats Fit Pro. Todos disponibles reacondicionados con garantía completa.</p>
    `
  },
  {
    slug: 'apple-watch-cual-comprar-2025',
    title: 'Apple Watch: ¿Qué Generación Comprar en 2025? Guía Completa',
    image: '/assets/images/blog/apple-watch-cual-comprar-2025.jpg',
    category: 'Guías de Compra',
    author: 'Laura Martínez',
    date: '18 de Agosto, 2025',
    content: `
      <p>Con tantas generaciones de Apple Watch disponibles, elegir puede ser confuso. Te ayudamos a identificar cuál es el mejor para ti según tu presupuesto y necesidades.</p>
      <h2>Apple Watch Series 9: Lo Más Reciente</h2>
      <p>Procesador S9 más rápido, pantalla siempre activa más brillante, doble tap gesture, y precisión mejorada en fitness tracking. Ideal si quieres lo último en tecnología. Precio nuevo: $9,500-$11,500 MXN. Reacondicionado: desde $7,200 MXN.</p>
      <h2>Apple Watch Series 8: El Equilibrio Perfecto</h2>
      <p>Incluye sensor de temperatura para seguimiento de ciclo menstrual y ovulación, detección de accidentes automovilísticos, y todas las funciones de salud esenciales. Excelente relación precio-valor. Precio nuevo: $8,000-$9,500 MXN. Reacondicionado: desde $5,800 MXN.</p>
      <h2>Apple Watch SE (2da Gen): La Opción Económica</h2>
      <p>Sin ECG ni sensor de oxígeno, pero mantiene detección de caídas, seguimiento de actividad, notificaciones y GPS. Perfecto para usuarios básicos o primer Apple Watch. Precio nuevo: $6,000-$7,000 MXN. Reacondicionado: desde $4,200 MXN.</p>
      <h2>Apple Watch Series 7: Gran Valor Reacondicionado</h2>
      <p>Pantalla más grande que Series 6, carga rápida, resistencia al polvo IP6X. A precio reacondicionado es una ganga con casi las mismas funciones que Series 8. Precio reacondicionado: desde $4,800 MXN.</p>
      <h2>¿Cuál Elegir?</h2>
      <p>Fitness serio y presupuesto amplio: Series 9. Salud femenina y funciones completas: Series 8. Primer smartwatch o presupuesto limitado: SE 2da Gen. Máximo valor por peso: Series 7 reacondicionado. Todos incluyen garantía de 12 meses.</p>
      <h2>Compatibilidad y Consideraciones</h2>
      <p>Todos requieren iPhone 8 o posterior con iOS 17+. Para funciones celulares, verifica compatibilidad con tu operador. La batería dura típicamente 18 horas con uso normal en todos los modelos.</p>
    `
  },
  {
    slug: 'laptops-gaming-reacondicionadas-vale-la-pena',
    title: 'Laptops Gaming Reacondicionadas: ¿Vale la Pena en 2025?',
    image: '/assets/images/blog/laptops-gaming-reacondicionadas-vale-la-pena.jpg',
    category: 'Gaming',
    author: 'Roberto Sánchez',
    date: '10 de Agosto, 2025',
    content: `
      <p>Las laptops gaming nuevas son costosas. ¿Es inteligente comprar una reacondicionada? Analizamos ventajas, desventajas y qué buscar para hacer una compra exitosa.</p>
      <h2>Ventajas de Laptops Gaming Reacondicionadas</h2>
      <p>Ahorro significativo: 30-50% menos que precio nuevo. Acceso a hardware de gama alta que sería inaccesible nuevo. Menor depreciación: el mayor golpe de precio ya ocurrió. Sostenibilidad: reduces basura electrónica considerablemente.</p>
      <h2>Qué Verificar Antes de Comprar</h2>
      <p>Generación de GPU: Busca mínimo RTX 3060 o RX 6600M para gaming moderno. CPU: Intel 11va gen o AMD Ryzen 5000 en adelante. RAM: Mínimo 16GB, idealmente expandible. Almacenamiento: SSD de 512GB+. Pantalla: Verifica refresh rate (120Hz+ ideal) y resolución.</p>
      <h2>Modelos Recomendados para Comprar Reacondicionados</h2>
      <p>ASUS ROG Strix G15 (2021-2022): Excelente refrigeración, Ryzen 9 + RTX 3070. Precio reacondicionado: $18,000-$22,000 MXN. Lenovo Legion 5 Pro: Pantalla 16" QHD excepcional, construcción sólida. Precio reacondicionado: $16,000-$20,000 MXN. MSI GP66 Leopard: Potencia bruta a buen precio. Precio reacondicionado: $15,000-$19,000 MXN.</p>
      <h2>Puntos de Atención</h2>
      <p>Batería: Las laptops gaming tienen baterías que se desgastan rápido. Verifica que tenga mínimo 80% de salud o úsala enchufada. Limpieza térmica: Asegúrate que el vendedor haya limpiado y re-pastado la GPU/CPU. Puertos: Revisa que todos los USB, HDMI y audio funcionen correctamente.</p>
      <h2>¿Vale la Pena?</h2>
      <p>SÍ, si compras de vendedor certificado con garantía. Un ROG Strix que costaba $40,000 MXN nuevo, a $20,000 reacondicionado te da el mismo rendimiento gaming. En CEX, todas nuestras laptops gaming pasan pruebas de estrés y benchmark antes de venderse.</p>
    `
  },
  {
    slug: 'camaras-digitales-vs-smartphones-2025',
    title: '¿Aún Necesitas una Cámara Digital en 2025? Cámaras vs Smartphones',
    image: '/assets/images/blog/camaras-digitales-vs-smartphones-2025.jpg',
    category: 'Comparativas',
    author: 'Ana García',
    date: '2 de Agosto, 2025',
    content: `
      <p>Los smartphones actuales tienen cámaras impresionantes. ¿Sigue teniendo sentido comprar una cámara dedicada? Analizamos cuándo vale la pena y cuándo tu teléfono es suficiente.</p>
      <h2>Cuándo Tu Smartphone es Suficiente</h2>
      <p>Fotos casuales y redes sociales: Los iPhone 14+ y Samsung S23+ tienen calidad más que suficiente. Video casual: Estabilización y 4K están excelentes en smartphones modernos. Portabilidad máxima: El mejor equipo es el que llevas contigo. Procesamiento automático: Los smartphones optimizan fotos al instante.</p>
      <h2>Cuándo Necesitas una Cámara Dedicada</h2>
      <p>Fotografía profesional: Sensor full-frame captura 10x más luz que cualquier smartphone. Control manual total: Apertura, ISO, velocidad de obturación ajustables. Lentes intercambiables: Gran angular, telefoto, macro especializados. Deportes/vida salvaje: Zoom óptico real de 200-600mm imposible en teléfonos. Fotografía nocturna avanzada: Exposiciones largas y control de ruido superior.</p>
      <h2>Cámaras Recomendadas (Reacondicionadas)</h2>
      <p>Canon EOS M50 Mark II: Mirrorless compacta, 4K, excelente para principiantes. Reacondicionada: $9,500-$12,000 MXN. Sony A6400: Autofoco excepcional, ideal para video. Reacondicionada: $13,000-$16,000 MXN. Fujifilm X-T30: Colores legendarios, diseño retro. Reacondicionada: $11,000-$14,000 MXN.</p>
      <h2>Punto Medio: Cámaras Compactas Premium</h2>
      <p>Si quieres calidad superior sin lentes intercambiables, considera: Sony RX100 VII: Bolsillo pero sensor 1", zoom 24-200mm. Reacondicionada: $12,000-$15,000 MXN. Canon G7X Mark III: Favorita de vloggers, pantalla abatible. Reacondicionada: $8,000-$10,000 MXN.</p>
      <h2>Veredicto</h2>
      <p>Para el 90% de usuarios, un smartphone moderno es suficiente. Compra cámara dedicada solo si: haces fotografía seria/profesional, necesitas zoom óptico real, o la fotografía es tu hobby principal. Comprar reacondicionada es la mejor opción: equipos de $30,000+ disponibles por la mitad.</p>
    `
  },
  {
    slug: 'smart-home-dispositivos-esenciales-2025',
    title: 'Smart Home para Principiantes: Dispositivos Esenciales en 2025',
    image: '/assets/images/blog/smart-home-dispositivos-esenciales-2025.jpg',
    category: 'Guías de Compra',
    author: 'Carlos Pérez',
    date: '25 de Julio, 2025',
    content: `
      <p>Convertir tu hogar en smart home no tiene que ser caro ni complicado. Te mostramos los dispositivos esenciales para empezar y cómo hacerlo con presupuesto inteligente.</p>
      <h2>1. Asistente de Voz: El Centro de Control</h2>
      <p>Empieza con un asistente que coordine todo. Amazon Echo Dot (4ta Gen): Compacto, económico, Alexa funcional. Reacondicionado: $800-$1,200 MXN. Google Nest Mini: Mejor para usuarios Android, integración Google superior. Reacondicionado: $700-$1,000 MXN. HomePod Mini: Mejor sonido, ideal para ecosistema Apple. Reacondicionado: $1,500-$2,000 MXN.</p>
      <h2>2. Focos Inteligentes: Iluminación a tu Voz</h2>
      <p>Los focos inteligentes transforman cualquier habitación. Philips Hue: El estándar oro, 16 millones de colores, escenas automáticas. Pack de 3 focos reacondicionados: $2,500-$3,500 MXN. TP-Link Kasa: Alternativa económica sin hub, control por app. Pack de 4 focos: $1,800-$2,400 MXN.</p>
      <h2>3. Termostato Inteligente: Ahorra en Energía</h2>
      <p>Controla el clima y reduce consumo eléctrico hasta 20%. Google Nest Thermostat: Aprende tus hábitos, control remoto. Reacondicionado: $2,800-$3,500 MXN. Ecobee SmartThermostat: Incluye sensor de habitación. Reacondicionado: $3,200-$4,000 MXN.</p>
      <h2>4. Cámaras de Seguridad: Tranquilidad 24/7</h2>
      <p>Monitorea tu hogar desde cualquier lugar. Ring Video Doorbell: Ve quién toca antes de abrir. Reacondicionado: $1,800-$2,400 MXN. Wyze Cam v3: Económica pero potente, visión nocturna color. Reacondicionado: $600-$900 MXN.</p>
      <h2>5. Enchufes Inteligentes: Controla Cualquier Aparato</h2>
      <p>Convierte cualquier dispositivo en inteligente. TP-Link Kasa Smart Plug: Programación, control remoto, monitoreo de consumo. Pack de 3 reacondicionados: $800-$1,200 MXN.</p>
      <h2>Costo Total de Kit Básico Smart Home (Reacondicionado)</h2>
      <p>Asistente de voz + 3 focos + 2 enchufes + cámara = $5,000-$7,000 MXN. Comprar todo reacondicionado certificado te ahorra 40-50% vs nuevo. Todos nuestros dispositivos smart home incluyen garantía y soporte técnico.</p>
    `
  },
  {
    slug: 'monitores-trabajo-remoto-home-office',
    title: 'Mejores Monitores para Trabajo Remoto y Home Office 2025',
    image: '/assets/images/blog/monitores-trabajo-remoto-home-office.jpg',
    category: 'Guías de Compra',
    author: 'Laura Martínez',
    date: '15 de Julio, 2025',
    content: `
      <p>Un buen monitor transforma tu productividad. Si trabajas desde casa, invertir en pantalla adecuada es esencial. Te ayudamos a elegir según tu profesión y presupuesto.</p>
      <h2>Tamaño: ¿Cuántas Pulgadas Necesitas?</h2>
      <p>24": Ideal para espacios pequeños, suficiente para ofimática básica. 27": Sweet spot para mayoría de usuarios, excelente para multitarea. 32"+: Para diseñadores, editores de video, o quienes usan múltiples ventanas. Ultrawide (34"): Reemplaza setup de 2 monitores, inmersivo.</p>
      <h2>Resolución: Más Allá de Full HD</h2>
      <p>1080p (Full HD): Suficiente para 24", económico. 1440p (QHD): Ideal para 27", excelente balance nitidez-rendimiento. 4K (UHD): Esencial para diseño gráfico, edición de foto/video profesional. Requiere GPU potente.</p>
      <h2>Monitores Recomendados por Profesión</h2>
      <p>Programadores: Dell UltraSharp U2723DE (27" QHD, USB-C). Reacondicionado: $7,500-$9,500 MXN. Diseñadores: BenQ PD2700U (27" 4K, 100% sRGB). Reacondicionado: $8,500-$11,000 MXN. Oficina general: LG 27UK650 (27" 4K, HDR). Reacondicionado: $5,500-$7,000 MXN. Presupuesto ajustado: ASUS VA24EHE (24" Full HD, eye care). Reacondicionado: $2,200-$3,000 MXN.</p>
      <h2>Características Esenciales para Home Office</h2>
      <p>Ajuste de altura: Crucial para ergonomía y salud postural. USB-C con Power Delivery: Carga tu laptop y transmite video con un solo cable. Filtro de luz azul: Reduce fatiga ocular en jornadas largas. Pivot (rotación 90°): Útil para programadores y lectura de documentos.</p>
      <h2>Configuración Dual: ¿Vale la Pena?</h2>
      <p>Dos monitores de 24" aumentan productividad 20-30% según estudios. Alternativa: Un ultrawide 34" ofrece espacio similar sin bezels centrales. Configuración recomendada reacondicionada: 2x 24" Full HD = $4,500-$6,000 MXN. 1x 34" ultrawide = $8,000-$11,000 MXN.</p>
      <h2>Conclusión</h2>
      <p>Invierte en monitor de calidad: lo usarás 8+ horas diarias. Comprar reacondicionado te permite acceder a modelos profesionales a precio de gama baja. Garantía de 12 meses incluida en todos nuestros monitores.</p>
    `
  },
  {
    slug: 'teclados-mecanicos-guia-switches-2025',
    title: 'Teclados Mecánicos: Guía Completa de Switches y Cómo Elegir en 2025',
    image: '/assets/images/blog/teclados-mecanicos-guia-switches-2025.jpg',
    category: 'Guías de Compra',
    author: 'Roberto Sánchez',
    date: '5 de Julio, 2025',
    content: `
      <p>Los teclados mecánicos mejoran tu experiencia de escritura, gaming y programación. Pero con tantos tipos de switches, ¿cómo elegir? Te explicamos todo lo que necesitas saber.</p>
      <h2>¿Por Qué Mecánico vs Membrana?</h2>
      <p>Durabilidad: 50-100 millones de pulsaciones vs 5 millones de membrana. Precisión: Registro de tecla más exacto, sin ghosting. Sensación: Feedback táctil o clic audible satisfactorio. Personalización: Cambiar switches, keycaps, iluminación. Inversión: Cuestan más pero duran décadas.</p>
      <h2>Tipos de Switches: Cherry MX y Clones</h2>
      <p>Cherry MX Red (Lineal): Silencioso, suave, sin resistencia. Ideal para gaming rápido y escritura silenciosa. Cherry MX Brown (Táctil): Bump ligero al pulsar, equilibrado. Mejor para uso mixto (gaming + trabajo). Cherry MX Blue (Clicky): Clic audible y táctil. Perfecto para escritura, molesto para otros. Cherry MX Speed Silver: Activación ultra rápida (1.2mm). Para gamers competitivos. Cherry MX Black: Lineal pero más firme que Red. Para quienes escriben con fuerza.</p>
      <h2>Alternativas Económicas: Gateron, Outemu, Kailh</h2>
      <p>Switches Gateron son clones de Cherry MX pero más suaves y económicos. Outemu ofrece lo mismo a menor precio. Kailh Box tienen mayor durabilidad contra polvo/líquidos. Funcionalmente similares, cuestan 30-50% menos.</p>
      <h2>Teclados Mecánicos Recomendados (Reacondicionados)</h2>
      <p>Keychron K2: Compacto (75%), hot-swap, Bluetooth. Gateron switches. Reacondicionado: $1,800-$2,400 MXN. Ducky One 2 Mini: 60%, construcción premium, Cherry MX. Reacondicionado: $2,200-$2,800 MXN. Logitech G Pro X: Gaming pro, switches intercambiables. Reacondicionado: $2,500-$3,200 MXN. Razer BlackWidow V3: Full size, Razer Green switches (clicky). Reacondicionado: $1,600-$2,200 MXN.</p>
      <h2>Tamaños de Teclado</h2>
      <p>Full Size (100%): Teclado numérico completo. Para contadores, data entry. TKL (Tenkeyless 80%): Sin numérico, más espacio para mouse. 75%: Compacto pero conserva teclas de función. 60%: Minimalista, para puristas y portabilidad.</p>
      <h2>Cómo Probar Antes de Comprar</h2>
      <p>Compra un switch tester (12 switches diferentes) por $300-$500 MXN. Visita nuestra tienda: tenemos teclados de exhibición para probar. Lee experiencias: Red para gaming, Brown para mixto, Blue para escritura. En CEX, aceptamos devoluciones en 7 días si el teclado no te convence.</p>
    `
  },
  {
    slug: 'preparar-android-para-vender',
    title: 'Cómo Preparar tu Android para Vender: Checklist Completo 2025',
    image: '/assets/images/blog/preparar-android-para-vender.jpg',
    category: 'Guías de Venta',
    author: 'Carlos Pérez',
    date: '28 de Junio, 2025',
    content: `
      <p>Vender tu Android usado requiere preparación correcta para proteger tu información y maximizar el precio. Sigue esta guía paso a paso para hacerlo de forma segura.</p>
      <h2>Paso 1: Respalda Toda tu Información</h2>
      <p>Google Photos: Asegúrate que todas las fotos estén en la nube (Configuración > Copia de seguridad). Contactos: Verifica sincronización con cuenta Google (Contactos > Configuración > Sincronizar). WhatsApp: Haz respaldo en Google Drive (WhatsApp > Configuración > Chats > Copia de seguridad). Apps: Google Play reinstalará apps automáticamente en tu nuevo dispositivo.</p>
      <h2>Paso 2: Desvincula Cuentas de Seguridad</h2>
      <p>Desactiva "Buscar mi dispositivo": Configuración > Seguridad > Buscar mi dispositivo > Desactivar. Elimina huella/PIN: Configuración > Seguridad > Bloqueo de pantalla > Ninguno. Quita cuenta Samsung (si aplica): Configuración > Cuentas > Samsung Account > Eliminar cuenta. Cierra sesión de Google: Configuración > Cuentas > Google > Eliminar cuenta.</p>
      <h2>Paso 3: Restablecimiento de Fábrica</h2>
      <p>Configuración > Sistema > Opciones de restablecimiento > Borrar todos los datos. IMPORTANTE: Esto eliminará TODO. Verifica respaldo antes. El proceso toma 5-15 minutos. El teléfono reiniciará como recién salido de caja.</p>
      <h2>Paso 4: Limpieza Física</h2>
      <p>Pantalla: Paño de microfibra con limpiador de pantallas o alcohol isopropílico 70%. Puertos: Cepillo de dientes suave para eliminar pelusa del puerto de carga. Cámara: Limpia lentes con paño especial para evitar rayaduras. Cuerpo: Toallita húmeda para eliminar grasa y suciedad.</p>
      <h2>Paso 5: Documenta el Estado</h2>
      <p>Toma fotos de: pantalla encendida mostrando configuración inicial, parte trasera, marcos laterales, puerto de carga. Captura de pantalla de: Salud de batería (apps como AccuBattery), almacenamiento disponible, modelo exacto en Configuración > Acerca del teléfono.</p>
      <h2>Paso 6: Reúne Accesorios</h2>
      <p>Aumenta valor 15-25% si incluyes: Caja original con IMEI coincidente, cargador original, cable USB, audífonos (si venían incluidos), funda/mica protectora.</p>
      <h2>Vende de Forma Segura en CEX</h2>
      <p>Cotización instantánea online o en tienda. Verificación en 15 minutos. Pago inmediato en efectivo o crédito en tienda con 20% extra. Total transparencia: te explicamos cómo valuamos tu dispositivo. Proceso 100% seguro y legal.</p>
    `
  },
  {
    slug: 'evitar-estafas-comprar-tecnologia-usada',
    title: 'Cómo Evitar Estafas al Comprar Tecnología Usada: Señales de Alerta',
    image: '/assets/images/blog/evitar-estafas-comprar-tecnologia-usada.jpg',
    category: 'Guías de Compra',
    author: 'Ana García',
    date: '18 de Junio, 2025',
    content: `
      <p>Comprar tecnología de segunda mano puede ser riesgoso si no sabes qué buscar. Te enseñamos a identificar estafas comunes y protegerte al comprar usado.</p>
      <h2>Señales de Alerta: Red Flags Críticas</h2>
      <p>Precio demasiado bueno: iPhone 14 Pro a $5,000 MXN es obviamente falso. Solo fotos de stock: Vendedor que no muestra fotos reales del dispositivo específico. Pago solo por transferencia adelantada: Nunca pagues antes de recibir. Urgencia artificial: "Tengo 10 interesados, decide YA" es táctica de presión. Sin IMEI visible: Si oculta el IMEI, puede ser robado.</p>
      <h2>Verifica el IMEI Antes de Comprar</h2>
      <p>Pide el IMEI al vendedor (Configuración > Acerca del teléfono). Consulta en: www.imei.info para verificar especificaciones. Consulta en página de operador para confirmar que no esté reportado como robado. iPhone: Verifica en checkcoverage.apple.com que no tenga bloqueo de activación.</p>
      <h2>Inspección Física: Qué Revisar en Persona</h2>
      <p>Pantalla: Enciende con fondo blanco y negro para detectar pixeles muertos o burn-in. Touch: Prueba toda la pantalla con apps como "Touch Screen Test". Cámaras: Toma fotos con todas las cámaras, verifica enfoque y estabilización. Puertos: Conecta cargador, audífonos, prueba que todo funcione. Biometría: Face ID o huella digital deben funcionar correctamente. Batería: Revisa salud de batería (iOS: Ajustes > Batería, Android: apps como AccuBattery).</p>
      <h2>Estafas Comunes y Cómo Evitarlas</h2>
      <p>Clon/Réplica: Dispositivos que parecen iPhone pero corren Android modificado. Verifica sistema operativo. Partes reemplazadas pirata: Pantallas aftermarket de baja calidad. Compara colores y brillo con original. Daño por líquido oculto: Revisa indicadores de líquido en puerto SIM (punto rojo = mojado). iCloud/Google Lock: Dispositivo bloqueado a cuenta anterior. EXIGE que vendedor lo desbloquee frente a ti.</p>
      <h2>Lugares Seguros para Comprar Usado</h2>
      <p>MEJOR: Tiendas certificadas como CEX con garantía y certificación completa. BUENO: Marketplace de Facebook/MercadoLibre CON reunión en persona y verificación. RIESGOSO: Vendedores anónimos en redes sociales sin reputación. NUNCA: Ofertas por WhatsApp de números desconocidos con precios irreales.</p>
      <h2>Protección Legal: Tus Derechos</h2>
      <p>PROFECO protege compras de segunda mano en establecimientos formales. Exige recibo o comprobante de compra siempre. Tienes derecho a garantía mínima de 60 días por ley en México. En CEX, ofrecemos garantía de 12 meses: 10x más que la mínima legal.</p>
      <h2>Conclusión</h2>
      <p>Comprar usado puede ser excelente decisión si lo haces con vendedor confiable. La diferencia entre buena compra y estafa está en verificación adecuada. Ahorra tiempo, riesgo y dolores de cabeza comprando reacondicionado certificado con garantía.</p>
    `
  },
  {
    slug: 'ssd-vs-hdd-cual-elegir-2025',
    title: 'SSD vs HDD en 2025: ¿Cuál Elegir para tu Computadora?',
    image: '/assets/images/blog/ssd-vs-hdd-cual-elegir-2025.jpg',
    category: 'Guías de Compra',
    author: 'Roberto Sánchez',
    date: '8 de Junio, 2025',
    content: `
      <p>La elección entre SSD y HDD afecta dramáticamente el rendimiento de tu computadora. En 2025, ¿sigue teniendo sentido comprar HDD? Analizamos ambas tecnologías.</p>
      <h2>SSD (Solid State Drive): Velocidad Pura</h2>
      <p>Velocidad: 10-50x más rápido que HDD. Windows arranca en 10 segundos vs 2 minutos. Durabilidad: Sin partes móviles, resiste golpes y vibraciones. Silencioso: Cero ruido, cero vibración. Consumo: Usa 50% menos energía, ideal para laptops. Desventaja: Precio por GB mayor (pero ha bajado significativamente).</p>
      <h2>HDD (Hard Disk Drive): Capacidad Económica</h2>
      <p>Capacidad: 4-16TB a precio accesible. Perfecto para almacenar grandes bibliotecas multimedia. Costo: $400-$600 MXN por TB vs $1,200-$1,800 MXN por TB en SSD. Longevidad: Puede durar 5-10 años con buen cuidado. Desventajas: Lento, ruidoso, frágil ante movimientos bruscos.</p>
      <h2>SSD NVMe vs SATA: ¿Importa la Diferencia?</h2>
      <p>SSD SATA (2.5"): 500-600 MB/s. Suficiente para mayoría de usuarios. SSD NVMe M.2: 3,000-7,000 MB/s. Diferencia notable en transferencias grandes, edición de video 4K. Conclusión: NVMe si tu motherboard lo soporta y trabajas con archivos pesados. SATA si solo quieres upgrade de velocidad general.</p>
      <h2>Configuración Ideal: Híbrido SSD + HDD</h2>
      <p>SSD de 500GB-1TB para: Sistema operativo, programas, juegos que juegas actualmente. HDD de 2-4TB para: Archivos, fotos, videos, juegos que no juegas frecuentemente. Ventaja: Velocidad donde importa + capacidad masiva económica. Setup recomendado reacondicionado: SSD 1TB + HDD 2TB = $3,500-$5,000 MXN.</p>
      <h2>¿Cuándo Solo SSD?</h2>
      <p>Laptops: Siempre SSD por durabilidad y consumo energético. Gaming PC moderno: SSD 2TB cubre mayoría de necesidades (20-30 juegos AAA). Workstation profesional: SSD NVMe para proyectos activos, NAS de red para archivo. Presupuesto amplio: SSD de 2-4TB ahora son accesibles ($6,000-$12,000 MXN reacondicionados).</p>
      <h2>¿Cuándo HDD Todavía Tiene Sentido?</h2>
      <p>Servidor de medios: Plex/Jellyfin con miles de películas. Backups locales: Respaldo de fotos/documentos importantes. Presupuesto muy limitado: PC de oficina básica donde velocidad no es crítica. Almacenamiento masivo: YouTubers, fotógrafos con archivos RAW, editores de video.</p>
      <h2>Migración: Cómo Cambiar de HDD a SSD</h2>
      <p>Software de clonación gratis: Macrium Reflect, Clonezilla. Conecta ambos drives simultáneamente (adaptador USB-SATA $200 MXN). Clona todo el disco en 1-3 horas según capacidad. Reemplaza HDD por SSD, arranca y disfruta velocidad. Alternativa: Instalación limpia de Windows (más limpia pero requiere reinstalar todo).</p>
      <h2>Recomendaciones por Uso</h2>
      <p>Estudiante: SSD 500GB suficiente. $1,500-$2,200 MXN reacondicionado. Gamer: SSD 1TB + HDD 2TB. $4,000-$5,500 MXN reacondicionados. Profesional creativo: SSD NVMe 2TB. $6,500-$9,000 MXN reacondicionado. Uso básico: SSD SATA 256GB. $900-$1,400 MXN reacondicionado.</p>
    `
  }
];

const PostPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  // Encuentra el post basado en el slug. Si no se encuentra, podrías mostrar un 404.
  const post = mockPosts.find(p => p.slug === slug);

  if (!post) {
    return <div>Artículo no encontrado</div>;
  }

  return <BlogPostPage post={post} />;
};

export default PostPage;
