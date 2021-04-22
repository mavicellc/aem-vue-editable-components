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

import { Prop, Vue, Mixins, Component } from 'vue-property-decorator'
import { Container } from '../Container'
import { AllowedComponentPlaceholderList } from './AllowedComponentsPlaceholderList'
import { CreateElement } from 'vue'

/**
 * Component that is allowed to be used on the page by the editor.
 */
export interface AllowedComponent {
  path: string;
  title: string;
}

export interface AllowedComponents {
  /**
   * Should AllowedComponents list be applied.
   */
  applicable: boolean;
  components: AllowedComponent[];
}

@Component({
  components: {}
})
export class AllowedComponentsPropertiesMixin extends Vue {
  @Prop({ default: 'No allowed components' }) _allowedComponentPlaceholderListEmptyLabel?: string;
  @Prop({ default: () => {} }) allowedComponents?: AllowedComponents;
  @Prop({ default: '' }) title?: string;
}

/**
 * Represents allowed components container in AEM.
 */
@Component({
  components: {}
})
export class AllowedComponentsContainer extends Mixins(AllowedComponentsPropertiesMixin, Container) {
  render (createElement: CreateElement) {
    const { allowedComponents, _allowedComponentPlaceholderListEmptyLabel, title, isInEditor } = this
    const emptyLabel = _allowedComponentPlaceholderListEmptyLabel as string

    if (isInEditor && allowedComponents && allowedComponents.applicable) {
      if (_allowedComponentPlaceholderListEmptyLabel) {
        return createElement(AllowedComponentPlaceholderList, {
          props: {
            title: title,
            emptyLabel: emptyLabel,
            components: allowedComponents.components,
            placeholderProps: this.placeholderProps,
            cqPath: this.cqPath
          }
        })
      }
    }

    const childComponentsToRender = this.childComponents.map((component, i) =>
      createElement(component, {
        key: 'child-' + Math.random()
      })
    )
    const placeholderComponent = this.placeholderComponent()

    if (placeholderComponent) childComponentsToRender.push(createElement(placeholderComponent))

    return createElement(
      'div',
      {
        ...this.containerAttrs()
      },
      [
        ...childComponentsToRender
      ]
    )
  }
}
