/*
 *  Copyright 2021 Mavice LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import 'reflect-metadata'
import { Component, Prop, Vue, Mixins } from 'vue-property-decorator'
import { Model } from '@adobe/aem-spa-page-model-manager'
import { Constants } from '../Constants'
import Utils from '../Utils'
import { ComponentMapping } from '../ComponentMapping'
import { VueConstructor } from 'vue/types/umd'
import { Container, ContainerPropertiesMixins } from './Container'
import { CreateElement } from 'vue'

export interface PageModel extends Model {
  ':type': string;
  'id': string;
  ':path': string;
  ':children'?: { [key: string]: PageModel };
}

@Component({
  components: {}
})
export class PagePropertiesMixin extends Mixins(ContainerPropertiesMixins) {
  @Prop({ default: () => {} }) cqChildren!: { [key: string]: PageModel };
}

@Component({
  components: {}
})
export class Page extends Mixins(PagePropertiesMixin, Container) {
  readonly state = {
    componentMapping: this.componentMapping || ComponentMapping
  };

  /**
   * @returns The child pages of a page.
   */
  get childPages (): VueConstructor[] {
    if (!this.cqChildren) {
      return []
    }

    // @ts-ignore
    return Object.keys(this.cqChildren).map<VueConstructor>((itemKey, i) => {
      const itemProps = Utils.modelToProps(this.cqChildren[itemKey])
      const ItemComponent: any = this.state.componentMapping.get(itemProps.cqType)
      const isInEditor = this.isInEditor
      if (ItemComponent) {
        return Vue.extend({
          name: 'Page',
          render (createElement: CreateElement) {
            return createElement(ItemComponent, {
              props: {
                ...itemProps,
                containerProps: itemProps,
                cqPath: itemProps.cqPath,
                isInEditor: isInEditor
              },
              key: itemKey +  '-page'
            })
          }
        })
      }
    })
  }

  getItemPath (itemKey: string) {
    return this.cqPath
      ? this.cqPath + '/' + Constants.JCR_CONTENT + '/' + itemKey
      : itemKey
  }

  containerAttrs (): {} {
    return {
      class: [Constants._PAGE_CLASS_NAMES],
      attrs: {
        'data-cq-data-path': this.isInEditor ? this.cqPath : ''
      }
    }
  }

  render (createElement: Function) {
    return createElement(
      'div',
      {
        class: [Constants._PAGE_CLASS_NAMES],
        attrs: {
          'data-cq-data-path': this.cqPath
        }
      }, [
        ...this.childComponents.map((component) => createElement(component)),
        ...this.childPages.map((page) => createElement(page))
      ]
    )
  }
}
