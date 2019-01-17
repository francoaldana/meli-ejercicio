# meli-ejercicio
Ejercicio para ingreso - Advanced IPLookup

## Enunciado
Para coordinar acciones de respuesta ante fraudes, es útil tener disponible información
contextual del lugar de origen detectado en el momento de comprar, buscar y pagar. Para
ello, entre otras fuentes, se decide crear una herramienta que dado un IP obtenga
información asociada:

Construir una aplicación que dada una dirección IP, encuentre el país al que pertenece, y
muestre:
- El nombre y código ISO del país
- Los idiomas oficiales del país
- Hora(s) actual(es) en el país (si el país cubre más de una zona horaria, mostrar
todas)
- Distancia estimada entre Buenos Aires y el país, en km.
- Moneda local, y su cotización actual en dólares (si está disponible)

Para resolver la información, pueden utilizarse las siguientes APIs públicas:
Geoloclización de IPs: https://ip2country.info/
Información de paises: http://restcountries.eu/
Información sobre monedas: http://fixer.io/
- La aplicación puede ser en línea de comandos o web. En el primer caso se espera
que el IP sea un parámetro, y en el segundo que exista un form donde escribir la
dirección.
- La aplicación deberá hacer un uso racional de las APIs, evitando hacer llamadas
innecesarias.
- La aplicación puede tener estado persistente entre invocaciones.
- Además de funcionamiento, prestar atención al estilo y calidad del código fuente.
- La aplicación deberá poder correr ser construida y ejecutada dentro de un
contenedor Docker (incluir un Dockerfile e instrucciones para ejecutarlo).

## Notas de implementación
Para la resolución del ejercicio se desarrolló una WebApp con ReactJS. La aplicación permite buscar y obtener los datos de cualquier dirección IPv4 pública.
Fue necesario usar 3 APIs distintas para la obtención de toda la información pedida ya que no se encontró una completa que cumpla con todos los requerimientos:
### `https://api.ip2country.info`
Para obtener el país de origen de la IP
### `https://restcountries.eu`
Para obtener información avanzada del país de origen
### `https://free.currencyconverterapi.com`
Para obtener información avanzada acerca del cambio de la moneda del país de origen. Esta API es una de las únicas FREE que proporciona lo necesario en cuanto a currency rates.

## Instrucciones de deploy
Clonar el repositorio en un directorio de preferencia. Luego, para la construcción del container con Docker en el directorio `/iplookup-app` ejecutar:
### docker build . -t iplookup-meli

Al finalizar, ejecutar:
### docker run -p 8080:80 iplookup-meli

La WebApp será accesible en:
### http://localhost:8080/
