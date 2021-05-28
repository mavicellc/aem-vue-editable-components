export function callVueSuperMethod (vueComponent: any, methodName: string, parameters: Array<any> = []) {
  return vueComponent.constructor.super.options.methods[methodName].apply(vueComponent, parameters)
}

export function getVueSuperComputedProp (vueComponent: any, attrName: string) {
  return vueComponent.constructor.super.options.computed[attrName]
}
