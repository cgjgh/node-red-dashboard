---
description: Guía completa sobre pruebas de extremo a extremo para Node-RED Dashboard 2.0, garantizando fiabilidad y rendimiento.
---

# Pruebas E2E

E2E Testing consiste en runnig un entorno local, y automatizar la interacción con el navegador para probar el comportamiento de los widgets.

Con Dashboard 2.0, tenemos los siguientes comandos que se utilizan para la prueba:

- `npm run cy:server` - Ejecuta una instancia de Node-RED con Dashboard 2.0 instalado.
- `npm run cy:run` - Ejecuta todas las pruebas de Cypress en modo sin cabeza.
- `npm run cy:open` - Abre el runner de pruebas de Cypress, por lo que puedes elegir explícitamente qué pruebas ejecutar localmente.

## Ciprés

Para nuestras pruebas E2E usamos [Cypress](https://www.cypress.io/). Esto proporciona un framework mediante el cual podemos definir pruebas automatizadas que harán clic e interactuarán con elementos relevantes en nuestro panel de control, y compruebe los comportamientos esperados.

## Pruebas en ejecución

### Instancia de prueba Node-RED

Cypress ha sido configurado para ejecutar una instancia local de Node-RED con el Dashboard 2.0 instalado. Necesitarás instalar las dependencias de esta instancia:

```bash
cd ./cypress/fixtures/user-dir/
npm install
```

### Servidor de prueba en ejecución

Para ejecutar el servidor de pruebas, necesitará ejecutar el siguiente comando desde la raíz del repositorio:

```bash
npm run cy:server
```

El servidor de pruebas se ejecutará en `http://localhost:1881`, y cualquier panel resultante estará disponible en `http://localhost:1881/dashboard`.

### Abrir Cypress

Para abrir el runner de pruebas de Cypress, necesitará ejecutar el siguiente comando desde la raíz del repositorio:

```bash
npm run cy:open
```

Seleccione "E2E Testing, y luego el navegador de su elección. Después de esto, verás una lista de las pruebas disponibles, que puedes ejecutar individualmente.

![Captura de pantalla que muestra las pruebas del botón de interfaz de usuario corriendo en el Cazador de pruebas de Cypress](../../assets/images/cypress-ui.png)
_Captura de pantalla que muestra las pruebas del botón de interfaz de usuario corriendo en el Cicpress Test Runner_

## Escribir Pruebas

Con Node-RED y Dashboard 2.0, queremos ser capaces de proporcionar un completo `flow. hijo`, y luego probar el comportamiento del Tablero que es desplegado como resultado de ese flujo.

Como tal, cada conjunto de pruebas contiene dos partes clave:

1. `<widget>.json` - el `flows.json` que detalla los flujos de prueba a desplegar, almacenado en `/cypress/fixtures/flows`
2. `<widget>.spec.js` - la suite de pruebas que define con qué elementos interactuar y los estados a probar, almacenados en `/cypress/tests/`

### 1) Construcción de Flujos de Prueba

Cada suite de pruebas tendrá un archivo `flows.json` correspondiente que detalla el flujo a desplegar en la instancia local de Node-RED. Esto contendrá los nodos necesarios para probar el comportamiento del widget en cuestión.

La forma más fácil de construir este `flow.json` es en sí mismo Node-RED:

1. Construye el flujo que quieres probar en una instancia local de Node-RED
2. Exportarlo como JSON
3. Guarda el `json` exportado en un archivo `json` dentro de `/cypress/fixtures/flows`

También puede que quieras sacar el máximo provecho de los [Cypress Test Helpers](#cypress-test-helpers) también.

### 2. Ejemplo archivo `spec.js`

Para hacer referencia a su correspondiente `flow.json`, puede utilizar la función `cy.deployFixture` que cargará el flujo en la instancia local de Node-RED.

```js
describe('Tablero Node-RED 2. - Grupos de botones', () => {
    // cualquier cosa aquí se ejecutará antes de todas las pruebas indivudas por debajo de
    beforeEach(() => {
        // aquí podemos usar nuestro comando ayudante para cargar un flujo. hijo
        cy. eployFixture('dashboard-button-groups')
        // luego asegúrese de que estamos empezando en la página correcta para cada prueba
        cy. isit('/dashboard/page1')
    })

    // it('') especifica una nueva prueba
    it('se puede hacer clic y emitir un valor de cadena representando la opción', () => {
        // haga clic en AndWait es un comando ayudante que hace clic en un elemento y espera un tiempo establecido
        cy. lickAndWait(cy.get('botón'). ontains('Opción 3'))
        
        // checkOutput entonces utiliza las APIs Helper que tenemos en su lugar para comprobar qué salida vino del botón
        cy. heckOutput('msg.topic', 'first-row')
        cy. heckOutput('msg. ayload', 'option_3')
    })

    it('permite la definición de colores personalizados para opciones', () => {
        // Haz clic en el último botón del grupo de botones
        cy. lickAndWait(cy.get('botón #nrdb-ui-widget-ui-botón-grupo-colores'). ast())

        // comprueba que el CSS se aplica correctamente
        cy. et('#nrdb-ui-widget-ui-button-group-colors button').last()
            . hould('have.css', 'fondo-color', 'rgb(217, 255, 209)')
    })
})
```

## Ayudantes de pruebas de Cypress

### Clic y espera

`cy.clickAndWait(<element>)`

Cypress esperará automáticamente a que aparezcan elementos en el DOM antes de interactuar con ellos, y esperar a las peticiones HTTP cuando se les indica, sin embargo, no puede realizar lo mismo para el tráfico de Websocket.

Dado que la mayoría de las pruebas implicarán la comprobación de las conecencias del tráfico de SocketIO, hemos creado un comando "Cypress", `clickAndWait()` que asegura un período de tiempo establecido después de hacer clic antes de pasar a la siguiente fase de una prueba.

### Tienda de salida (nodo de unición)

Para facilitar la escritura de las pruebas, hemos creado una función de ayuda que puede ser usada para probar la salida de widgets en particular. Este nodo de función puede incluirse en tu flujo Node-RED y almacenará el objeto `msg` en un `global`

<iframe width="100%" height="250px" src="https://flows.nodered.org/flow/51259d06082d56dd79725d7675f6c4bc/share" allow="clipboard-read; clipboard-write" style="border: none;"></iframe>

El nodo de función "Guardar último Msg" contiene:

```js
global.set('msg', msg)
return msg;
```

Cuando se hace clic en un botón en el panel, el valor emitido por ese botón se almacena en una variable global `msg`. Entonces podemos utilizarlo en conjucción comprobando esa producción.

### Comprobar Salida

`cy.checkOutput(<key>, <value>)`

Si se usa el nodo de la función anterior [Salida de tienda](#store-output-function-node) podemos usar el comando `checkOutput` para comprobar el valor del objeto `msg` contra lo que esperamos que sea.

Este flujo de ayuda se implementa automáticamente en la instancia de Node-RED cuando se utiliza el comando `deployFixture(<fixture>)`.

<iframe width="100%" height="250px;" src="https://flows.nodered.org/flow/85116e5ecfdb9da778bbbbfe34c0063b/share" allow="clipboard-read; clipboard-write" style="border: none;"></iframe>

Por ejemplo, desde nuestras pruebas de botón:

```js
describe('Node-RED Dashboard 2.0 - Buttons', () => {
    beforeEach(() => {
        cy.deployFixture('dashboard-buttons') // reads in a flow.json and deploys it to the local Node-RED instance
        cy.visit('/dashboard/page1')
    })

    it('can be clicked and outputs the correct payload & topic are emitted', () => {
        // Emitting strings
        cy.clickAndWait(cy.get('button').contains('Button 1 (str)'))
        // checkOutput calls our helper endpoints to checks the values against the stored msg
        cy.checkOutput('msg.payload', 'button 1 clicked')
        cy.checkOutput('msg.topic', 'button-str-topic')

        // Emitting JSON
        cy.clickAndWait(cy.get('button').contains('Button 1 (json)'))
        cy.checkOutput('msg.payload.hello', 'world')
        cy.checkOutput('msg.topic', 'button-json-topic')
    })
})
```

### Reset Context

`cy.resetContext()`

La función anterior ayuda a configurar y comprobar la salida que depende de las tiendas de "contexto" de Node-RED. Esta función se puede utilizar para asegurarse de que tiene un almacén de contexto limpio reposándolo. Esto se usa _antes_ mejor usando la función de ayuda [Salida de tienda](#store-output-function-node) para asignar nuevos valores a la tienda.

### Recargar panel

`cy.reloadDashboard()`

Si en cualquier momento quieres recargar la página, el uso de este comando actualizará la página, pero también asegúrese de que la llamada API `/_setup` ha terminado, antes de continuar con más pasos en su prueba.