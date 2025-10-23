# Plan de Desarrollo Detallado para Gemini

Este documento desglosa la implementación de la plataforma de recommence en pasos atómicos y ejecutables para la IA.

## FASE 0: Preparación y Configuración Inicial

**Objetivo:** Configurar el entorno de desarrollo, el stack tecnológico y la estructura base del proyecto.

---

**Paso 0.1: Instalar dependencias de Next.js y Tailwind CSS**

*   **Acción:** `RUN_COMMAND`
*   **Comando:** 
    ```bash
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```
*   **Descripción:** "Este comando instalará las dependencias de desarrollo necesarias para Tailwind CSS y creará los archivos de configuración `tailwind.config.js` y `postcss.config.js`."

---

**Paso 0.2: Configurar las rutas de contenido en `tailwind.config.js`**

*   **Acción:** `REPLACE_CONTENT`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\tailwind.config.js`
*   **Buscar (old_string):**
    ```javascript
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```
*   **Reemplazar con (new_string):**
    ```javascript
    /** @type {import('tailwindcss').Config} */
    module.exports = {
      content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```
*   **Instrucción:** "En el archivo `tailwind.config.js`, actualiza la propiedad `content` para que Tailwind CSS escanee todos los archivos de las carpetas `pages`, `components` y `app` en busca de clases de utilidad."

---

**Paso 0.3: Añadir las directivas de Tailwind a `styles/globals.css`**

*   **Acción:** `WRITE_FILE` (o `REPLACE_CONTENT` si el archivo ya existe y tiene contenido)
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\styles\globals.css`
*   **Contenido:**
    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```
*   **Instrucción:** "Crea o sobrescribe el archivo `styles/globals.css` para incluir las directivas `@tailwind` base, components y utilities, que son fundamentales para que el framework funcione."

---

**Paso 0.4: Limpiar la página de inicio `pages/index.js`**

*   **Acción:** `REPLACE_CONTENT`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\pages\index.js`
*   **Buscar (old_string):**
    *Nota: El contenido exacto puede variar, pero el objetivo es reemplazar todo el contenido de retorno del componente Home.*
    ```javascript
    // El contenido por defecto de Next.js
    import Image from 'next/image'
    import { Inter } from 'next/font/google'

    const inter = Inter({ subsets: ['latin'] })

    export default function Home() {
      return (
        <main
          className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
          // ... mucho contenido de ejemplo
        </main>
      )
    }
    ```
*   **Reemplazar con (new_string):**
    ```javascript
    export default function Home() {
      return (
        <main>
          <h1 className="text-4xl font-bold text-center p-10">
            Plataforma Recommerce Tecnológico
          </h1>
        </main>
      )
    }
    ```
*   **Instrucción:** "Simplifica el archivo `pages/index.js` eliminando el contenido de ejemplo de Next.js y reemplazándolo con un encabezado `<h1>` simple para verificar que los estilos de Tailwind se aplican correctamente."

---

## FASE 1: Construcción del MVP (Componentes Iniciales)

**Objetivo:** Crear los componentes fundamentales de la UI y la estructura de la página principal.

---

**Paso 1.1: Crear el componente `Header`**

*   **Acción:** `WRITE_FILE`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\components\layout\Header.js`
*   **Contenido:**
    ```javascript
    import Link from 'next/link';

    const Header = () => {
      return (
        <header className="bg-white shadow-md">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">
              <Link href="/">CEX_FRETED</Link>
            </div>
            <div className="hidden md:flex space-x-6 items-center">
              <Link href="/comprar" className="text-gray-600 hover:text-blue-600">Comprar</Link>
              <Link href="/vender" className="text-gray-600 hover:text-blue-600">Vender</Link>
              <Link href="/certificacion" className="text-gray-600 hover:text-blue-600">Certificación</Link>
              <Link href="/garantias" className="text-gray-600 hover:text-blue-600">Garantías</Link>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/mi-cuenta" className="text-gray-600">Mi Cuenta</Link>
              <Link href="/checkout/carrito" className="relative">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              </Link>
            </div>
            <div className="md:hidden">
              <button className="text-gray-600 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </button>
            </div>
          </nav>
        </header>
      );
    };

    export default Header;
    ```
*   **Instrucción:** "Crea el archivo para el componente `Header` en `components/layout/Header.js` con la estructura de navegación principal, incluyendo enlaces a las secciones clave y los iconos de cuenta y carrito."

---

**Paso 1.2: Crear el componente `Footer`**

*   **Acción:** `WRITE_FILE`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\components\layout\Footer.js`
*   **Contenido:**
    ```javascript
    const Footer = () => {
      return (
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold mb-2">Comprar</h3>
                <ul>
                  <li><a href="#" className="hover:underline">Smartphones</a></li>
                  <li><a href="#" className="hover:underline">Laptops</a></li>
                  <li><a href="#" className="hover:underline">Consolas</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">Vender</h3>
                <ul>
                  <li><a href="/vender" className="hover:underline">Tasa tu dispositivo</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">Ayuda</h3>
                <ul>
                  <li><a href="#" className="hover:underline">Contacto</a></li>
                  <li><a href="#" className="hover:underline">FAQs</a></li>
                  <li><a href="#" className="hover:underline">Envíos y devoluciones</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2">Legal</h3>
                <ul>
                  <li><a href="#" className="hover:underline">Términos y condiciones</a></li>
                  <li><a href="#" className="hover:underline">Política de privacidad</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center text-gray-400">
              <p>&copy; 2025 CEX_FRETED. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      );
    };

    export default Footer;
    ```
*   **Instrucción:** "Crea el archivo para el componente `Footer` en `components/layout/Footer.js` con enlaces útiles y la información de copyright."

---

**Paso 1.3: Crear el componente `Layout` para envolver las páginas**

*   **Acción:** `WRITE_FILE`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\components\layout\Layout.js`
*   **Contenido:**
    ```javascript
    import Header from './Header';
    import Footer from './Footer';

    const Layout = ({ children }) => {
      return (
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      );
    };

    export default Layout;
    ```
*   **Instrucción:** "Crea el componente `Layout` en `components/layout/Layout.js`. Este componente importará `Header` y `Footer` y envolverá el contenido principal de cada página (`children`)."

---

**Paso 1.4: Integrar el `Layout` en la aplicación a través de `_app.js`**

*   **Acción:** `WRITE_FILE`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\pages\_app.js`
*   **Contenido:**
    ```javascript
    import '../styles/globals.css';
    import Layout from '../components/layout/Layout';

    function MyApp({ Component, pageProps }) {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }

    export default MyApp;
    ```
*   **Instrucción:** "Crea el archivo `pages/_app.js`. Este archivo es el punto de entrada principal de la aplicación Next.js y nos permitirá aplicar el `Layout` a todas las páginas, asegurando que el `Header` y `Footer` aparezcan en todo el sitio."

---

**Paso 1.5: Verificar la configuración inicial**

*   **Acción:** `RUN_COMMAND`
*   **Comando:** `npm run dev`
*   **Descripción:** "Ejecuta el servidor de desarrollo para verificar visualmente que la página de inicio se renderiza con el Header, el contenido principal y el Footer. Este es un paso de verificación manual."
*   **Nota:** Este comando iniciará un proceso de larga duración. Estaré atento a la URL del servidor local para confirmar que todo funciona.

---
### Sub-fase 1.2: Componentes de la Página de Inicio
---

**Paso 1.2.1: Crear el componente `Hero`**

*   **Acción:** `WRITE_FILE`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\components\home\Hero.js`
*   **Contenido:**
    ```javascript
    import Link from 'next/link';
    import Image from 'next/image';

    const Hero = () => {
      return (
        <section className="w-full bg-gray-100 py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Tecnología Reacondicionada Certificada
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl">
                  12 meses de garantía + Certificado de 30 puntos. Compra con confianza, vende con facilidad.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/comprar" className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-800">
                  Comprar Dispositivos
                </Link>
                <Link href="/vender" className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950">
                  Vender mi Dispositivo
                </Link>
              </div>
            </div>
            <Image
              src="/assets/images/hero-placeholder.png"
              alt="Hero Image"
              width={550}
              height={550}
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
            />
          </div>
        </section>
      );
    };

    export default Hero;
    ```
*   **Instrucción:** "Crea el componente `Hero` en `components/home/Hero.js`. Este será el banner principal de la página de inicio."

---

**Paso 1.2.2: Crear el componente `HowItWorks`**

*   **Acción:** `WRITE_FILE`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\components\home\HowItWorks.js`
*   **Contenido:**
    ```javascript
    const HowItWorks = () => {
      const steps = [
        { title: 'Tasación Instantánea', description: 'Obtén un precio al momento para tu dispositivo.' },
        { title: 'Envío Gratuito', description: 'Recogemos tu dispositivo sin coste alguno.' },
        { title: 'Pago en 48h', description: 'Recibe tu dinero por transferencia o PayPal.' },
      ];

      return (
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">¿Cómo funciona vender?</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                    <span className="text-2xl font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-500">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    };

    export default HowItWorks;
    ```
*   **Instrucción:** "Crea el componente `HowItWorks` en `components/home/HowItWorks.js` para explicar el proceso de venta."

---

**Paso 1.2.3: Crear el componente `GradingSystem`**

*   **Acción:** `WRITE_FILE`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\components\home\GradingSystem.js`
*   **Contenido:**
    ```javascript
    const GradingSystem = () => {
      const grades = ['A+', 'A', 'B', 'C'];

      return (
        <section className="py-12 md:py-24 bg-gray-100">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-8">Conoce Nuestro Sistema de Grados</h2>
            <div className="flex justify-center gap-4">
              {grades.map(grade => (
                <div key={grade} className="cursor-pointer p-4 border rounded-lg hover:bg-white hover:shadow-lg transition-all">
                  <span className="text-2xl font-bold text-blue-600">{grade}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-gray-500">Haz clic en un grado para ver más detalles.</p>
          </div>
        </section>
      );
    };

    export default GradingSystem;
    ```
*   **Instrucción:** "Crea el componente `GradingSystem` en `components/home/GradingSystem.js` para mostrar los diferentes grados de los productos."

---

**Paso 1.2.4: Crear el componente `FeaturedProducts`**

*   **Acción:** `WRITE_FILE`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\components\home\FeaturedProducts.js`
*   **Contenido:**
    ```javascript
    import Image from 'next/image';
    import Link from 'next/link';

    const FeaturedProducts = () => {
      // Datos de ejemplo
      const products = Array(6).fill({
        name: 'iPhone 14 Pro',
        grade: 'A',
        price: '999€',
        image: '/assets/images/product-placeholder.png'
      });

      return (
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Productos Destacados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <Image src={product.image} alt={product.name} width={400} height={400} className="object-cover"/>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">Grado {product.grade}</span>
                      <span className="font-bold text-xl">{product.price}</span>
                    </div>
                    <Link href="#" className="mt-4 inline-block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                      Ver detalles
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    };

    export default FeaturedProducts;
    ```
*   **Instrucción:** "Crea el componente `FeaturedProducts` en `components/home/FeaturedProducts.js` para mostrar una selección de productos."

---

**Paso 1.2.5: Integrar los nuevos componentes en la página de inicio**

*   **Acción:** `REPLACE_CONTENT`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\pages\index.js`
*   **Buscar (old_string):**
    ```javascript
    export default function Home() {
      return (
        <main>
          <h1 className="text-4xl font-bold text-center p-10">
            Plataforma Recommerce Tecnológico
          </h1>
        </main>
      )
    }
    ```
*   **Reemplazar con (new_string):**
    ```javascript
    import Hero from '../components/home/Hero';
    import HowItWorks from '../components/home/HowItWorks';
    import GradingSystem from '../components/home/GradingSystem';
    import FeaturedProducts from '../components/home/FeaturedProducts';

    export default function Home() {
      return (
        <>
          <Hero />
          <HowItWorks />
          <GradingSystem />
          <FeaturedProducts />
        </>
      )
    }
    ```
*   **Instrucción:** "Actualiza `pages/index.js` para importar y renderizar los nuevos componentes de la página de inicio en el orden correcto."

---

**Paso 1.2.6: Crear assets de placeholder**

*   **Acción:** `WRITE_FILE`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\hero-placeholder.png`
*   **Contenido:** (Se creará un placeholder simple, no se necesita contenido de texto)
*   **Instrucción:** "Crea un archivo de imagen placeholder para el Hero. Puede ser un archivo vacío o una imagen simple. Esto evitará errores de imagen no encontrada."

---

**Paso 1.2.7: Crear assets de placeholder para productos**

*   **Acción:** `WRITE_FILE`
*   **Ruta:** `C:\Users\GIRTEC\Documents\GitHub\cex_freted\public\assets\images\product-placeholder.png`
*   **Contenido:** (Se creará un placeholder simple, no se necesita contenido de texto)
*   **Instrucción:** "Crea un archivo de imagen placeholder para los productos. Puede ser un archivo vacío o una imagen simple."

---

**Paso 1.2.8: Verificar la página de inicio actualizada**

*   **Acción:** `RUN_COMMAND`
*   **Comando:** `npm run dev`
*   **Descripción:** "Ejecuta el servidor de desarrollo para verificar visualmente que la página de inicio ahora muestra todos los componentes nuevos: Hero, Cómo funciona, Sistema de Grados y Productos Destacados. Este es un paso de verificación manual."
*   **Nota:** Si el servidor ya está en ejecución, este comando puede fallar. El objetivo es asegurarse de que la página se vea correctamente en el navegador.

```