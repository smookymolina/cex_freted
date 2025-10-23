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