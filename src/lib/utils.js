import { useEffect, useRef } from "react"
import def_album from '../assets/album.jpg'

/**
 * @version: 0.1
 * @author: Antonio Muelle
 */

/**
 * Custom Effect Hook que ejecuta una funcion al montar el componente
 * @param {Function} effect - funcion a ejecutar al montar el componente
 * @returns {Object} - objeto con la propiedad current que indica si el componente esta montado
 */
export function useOnMounted(effect = null) {
  const mounted = useRef(false)
  useEffect(() => {
    let cleanup = undefined
    if (effect) { cleanup = effect() }
    return ()=> { mounted.current = false; (typeOf(cleanup) === 'function') && cleanup() }
  }, []) // eslint-disable-line
  return mounted
}

/**
 * Custom Effect Hook que ejecuta una funcion en cada actualizacion de sus dependencias,
 * este hook no ejecuta la funcion al montar el componente sino que espera a la primera actualizacion
 * @param {Function} effect - funcion a ejecutar al desmontar el componente
 * @param {Array} dependencies - dependencias del efecto
 * @param {Object} mounted - objeto con la propiedad current que indica si el componente esta montado
 */
export function useOnUpdate(effect, dependencies, mounted = null) {
  const isMounted = mounted || useOnMounted() // eslint-disable-line
  useEffect(() => {
    if (isMounted.current)
      effect()
    else
      isMounted.current = true
  }, dependencies) // eslint-disable-line
}

// parse time to minutes:seconds from seconds
export function parseTime(time, areMiliseconds = false) {
  areMiliseconds && (time = time / 1000)
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time - minutes * 60)
  return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds)
}

// parse time to hours:minutes:seconds from miliseconds
export function parseMiliSeconds(time) {
  time = parseInt(time / 1000)
  const h = parseInt(time / 3600)
  const m = parseInt((time % 3600) / 60)
  const s = parseInt(time % 60)
  return `${ h<10?'0'+h:h }:${ m<10?'0'+m:m }:${ s<10?'0'+s:s }`
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * @param {Array} arr - arrary donde se eliminara el elemento
 * @param {*} elem - elemento a eliminar
 * @returns number - indice del elemento eliminado o -1 en caso contrario
 */
export function removeItem(arr, elem) {
  const index = arr.indexOf(elem)
  console.log('removeItem', index)
  if (index >= 0)
    arr.splice(index, 1)
  return index
}

/**
 * @param {Array} arr - array donde eliminar un elemento
 * @param {*} elem - elemento a eliminar
 * @returns Array - un nuevo arreglo sin el elemento
 */
export function filterItem(arr, elem) {
  return arr.filter( (item)=> item !== elem)
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export const sleep = (ms = 1000)=> new Promise((resolve)=> setTimeout(resolve, ms))

export const showToast = (message = '') => { document.dispatchEvent(new CustomEvent('toast', { detail: message })) }

export const mergeObj = (base, extend)=> {
  const merged = {}
  for (const key in base)
    merged[key] = extend[key] ?? base[key]
  return merged
}

/** retorna el tipo del objeto en minusculas */
export const typeOf = (obj)=> Object.prototype.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase()

const IMG_URL = 'https://i.scdn.co/image/'
export function pickImage(images, size = 's') {
  if (!images.length) return def_album
  if (typeof size === 'number') return pickImageFromWidth(images, size)
  let min = 0, max = 0
  if (size === 's') {min = 0, max = 200}
  else if (size === 'm') {min = 200, max = 500}
  else if (size === 'l') {min = 500, max = 1000}
  else {min = 1000, max = 10000}
  for (let i = 0; i < images.length; i++) {
    if (images[i].width >= min && images[i].width < max) return IMG_URL + images[i].id
  }
  return IMG_URL + images[images.length - 1].id
}

function pickImageFromWidth(images, width = 300) {
  if (!images.length) return def_album
  let closest = 0
  for (let i = 0; i < images.length; i++) {
    if (Math.abs(images[i].width - width) < Math.abs(images[closest].width - width)) closest = i
  }
  return IMG_URL + images[closest].id
}

// set css custom properties for vh and vw according to window size and the height of the player and sidebar
let properties
export function setCustomCssProps() {
  properties = [
    ['--vh', window.innerHeight / 100 + 'px'],
    ['--vw', window.innerWidth / 100 + 'px'],
    ['--header-height', document.querySelector('header').offsetHeight + 'px'],
    ['--player-height', document.querySelector('.miniplayer').offsetHeight + 'px'],
    ['--sidebar-height', document.querySelector('.sidebar .wrapper').offsetHeight + 'px']
  ]
  properties.forEach(([key, value])=> { document.documentElement.style.setProperty(key, value) })
}