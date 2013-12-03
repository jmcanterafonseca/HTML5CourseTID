== Ejercicio 1. Imágenes. Mensajería ==

Realizar una aplicación en FirefoxOS que permita al usuario seleccionar una imagen (procedente de la galería, cámara, etc.) y
una vez seleccionada realizar un "crop" de la misma. Una vez recortada la imagen deberá ser de nuevo guardada en la SDCard.
Finalmente deberá poder enviarse por MMS.

Referencias:

* https://developer.mozilla.org/en-US/docs/WebAPI/Web_Activities
* https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Canvas_tutorial?redirectlocale=en-US&redirectslug=Canvas_tutorial
* https://developer.mozilla.org/es/docs/WebAPI/Device_Storage
* https://developer.mozilla.org/en-US/docs/WebAPI/WebSMS/Introduction_to_Mobile_Message_API


== Ejercicio 2. Contactos. Alarmas. ==

Realizar una aplicación en FirefoxOS que

A/ liste los contactos favoritos del usuario. (category contains 'favorite')
B/ Permita establecer la fecha de cumpleaños de cada uno de los contactos listados en A.
C/ Permita avisar mediante notificación cuando es el cumpleaños (incluso si la aplicación está cerrada)
D/ El día del cumpleaños permita enviar un SMS de felicitación o realizar una llamada

Referencias:

* https://developer.mozilla.org/es/docs/WebAPI/Contacts
* https://developer.mozilla.org/en/docs/WebAPI/Alarm
* https://developer.mozilla.org/en/docs/Web/API/notification

== Ejercicio 3. Sensores. ==

Realizar una aplicación que :

A/ Sea capaz de localizar al usuario y situar su posición actual en un mapa, indicando la direccion civil donde se encuentra
B/ sea capaz de seguir los movimientos que realice el usuario con
el dispositivo, mediante el uso de los distintos sensores. Según los movimientos realizados por el usuario
la aplicación podrá vibrar de distintas formas, reproducir distintos sonidos, etc.
C/ Pueda enviar una notificación al usuario (textual, auditiva, vibración) cuando el nivel de batería alcanza un cierto umbral configurable

Nota: La obtención de la información de geocodificacion inversa deberá hacerse mediante llamada HTTP directa y no
mediante el API de recubrimiento proporcionado por Google.

Referencias:

https://developer.mozilla.org/es/docs/WebAPI/Using_geolocation
https://developers.google.com/maps/documentation/geocoding/?hl=es
https://developer.mozilla.org/en-US/docs/Web/Reference/Events/devicemotion
https://developer.mozilla.org/en-US/docs/Web/Reference/Events/deviceorientation?redirectlocale=en-US&redirectslug=DOM%2FMozilla_event_reference%2Fdeviceorientation
https://developer.mozilla.org/en-US/docs/Web/API/Navigator.vibrate
https://developer.mozilla.org/en-US/docs/Web/API/Navigator.battery

General References:

http://buildingfirefoxos.com/
https://developer.mozilla.org/en-US/Firefox_OS/Security/Application_security

El alumno deberá elegir al menos un ejercicio de los propuestos. Los ejercicios están abiertos a la creatividad
y mejoras propuestos por el alumno. Se puede realizar más de un ejercicio. Sólo en este último caso se permitirá la
presentación por parejas.
