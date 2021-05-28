export function callVueSuperMethod (vueComponent: any, methodName: string, parameters: Array<any> = []) {
  const thisMethod = vueComponent.constructor.options.methods[methodName]
  const superMethod = vueComponent.constructor.super.options.methods[methodName]
  if (thisMethod && thisMethod === superMethod) {
    console.warn('super method is equal to the instance method; returning empty object as fallback')
    return {}
  }

  return superMethod.apply(vueComponent, parameters)
}

export function getVueSuperComputedProp (vueComponent: any, attrName: string) {
  return vueComponent.constructor.super.options.computed[attrName]
}
