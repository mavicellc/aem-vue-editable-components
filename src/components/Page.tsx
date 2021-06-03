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
import { Component, Prop, Mixins } from 'vue-property-decorator'
import { Model } from '@adobe/aem-spa-page-model-manager'
import { Constants } from '../Constants'
import Utils from '../Utils'
import { ComponentMapping } from '../ComponentMapping'
import { Container, ContainerPropertiesMixins } from './Container'
import { VNode } from 'vue'

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

  get containerAttrs (): {} {
    const props: any = {
      class: Constants._PAGE_CLASS_NAMES,
      attrs: {}
    }

    if (this.isInEditor) {
      props.attrs[Constants.DATA_PATH_ATTR] = this.cqPath
    }

    return props
  }

  /**
   * @returns The child pages of a page.
   */
  get childPages (): VNode[] {
    if (!this.cqChildren) {
      return []
    }

    // @ts-ignore
    return Object.keys(this.cqChildren).map<VNode>((itemKey) => {
      const itemProps = Utils.modelToProps(this.cqChildren[itemKey])
      const ItemComponent: any = this.state.componentMapping.get(itemProps.cqType)
      const isInEditor = this.isInEditor

      if (ItemComponent) {
        return <ItemComponent
            cqPath={itemProps.cqPath}
            isInEditor={isInEditor}
            props={itemProps}
        />
      }
    })
  }

  getItemPath (itemKey: string) {
    return this.cqPath
        ? this.cqPath + '/' + Constants.JCR_CONTENT + '/' + itemKey
        : itemKey
  }

  render (createElement: Function) {
    return <div {...this.containerAttrs}>
      {this.childComponents}
      {this.childPages}
    </div>
  }
}
