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

import { MapTo, withComponentMappingContext } from '../ComponentMapping'
import { AllowedComponentsContainer } from './allowedcomponents/AllowedComponentsContainer'
import { PlaceHolderModel } from './ContainerPlaceholder'
import { EditConfig } from './EditableComponent'
import { Constants } from '../Constants'
import { Component, Prop } from 'vue-property-decorator'
import { callVueSuperMethod, getVueSuperComputedProp } from '../vue-utils'

@Component({
  components: {}
})
export class ResponsiveGrid extends AllowedComponentsContainer {
  @Prop({ default: () => {} }) columnClassNames!: { [key: string]: string };
  @Prop({ default: '' }) gridClassNames?: string;

  _allowedComponentPlaceholderListEmptyLabel!: string;

  containerAttrs (): {[key: string]: string} {
    const attrs = callVueSuperMethod(this, 'containerAttrs')

    attrs.class = (attrs.class || '') + ' ' + this.gridClassNames
    attrs.attrs = { 'data-cq-data-path': this.isInEditor ? this.cqPath : '' }

    return attrs
  }

  get placeholderProps (): PlaceHolderModel {
    const props = getVueSuperComputedProp(this, 'placeholderProps')

    props.placeholderClassNames = (props.placeholderClassNames || '') + ' ' + Constants._RESPONSIVE_GRID_PLACEHOLDER_CLASS_NAMES

    return props
  }

  getItemComponentProps (
    item: any,
    itemKey: string,
    itemPath: string
  ): { [key: string]: string } {
    const attrs = callVueSuperMethod(this, 'getItemComponentProps', [item, itemKey, itemPath])

    attrs.className = attrs.className || ''
    attrs.className +=
      this.columnClassNames && this.columnClassNames[itemKey]
        ? ' ' + this.columnClassNames[itemKey]
        : ''

    return attrs
  }
}

/**
 * @private
 */
const config: EditConfig = {
  isEmpty (props: any): boolean {
    return props.cqItemsOrder && props.cqItemsOrder.length > 0
  }
}

MapTo('wcm/foundation/components/responsivegrid')(
  withComponentMappingContext(ResponsiveGrid),
  config
)
